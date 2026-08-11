(() => {
  'use strict';

  const IMAGE_TYPES = new Set([
    'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'
  ]);
  const IMAGE_EXTENSION = /\.(?:jpe?g|png|webp|heic|heif)$/i;

  function isSupportedImageFile(file, maxBytes) {
    if (!file || !Number.isFinite(file.size) || file.size <= 0 ||
        !Number.isFinite(maxBytes) || maxBytes <= 0 || file.size > maxBytes) {
      return false;
    }
    const type = String(file.type ?? '').split(';')[0].trim().toLowerCase();
    return IMAGE_TYPES.has(type) || IMAGE_EXTENSION.test(String(file.name ?? ''));
  }

  function calculateTileDecodeSide(outputMaxSide, columns, oversample = 3) {
    if (![outputMaxSide, columns, oversample].every(Number.isFinite) ||
        outputMaxSide <= 0 || columns < 1 || oversample <= 0) {
      throw new Error('Resolución de tesela no válida');
    }
    return Math.max(96, Math.min(384, Math.ceil(outputMaxSide / columns * oversample)));
  }

  function colorDistance(a, b) {
    const mean = (a[0] + b[0]) / 2;
    const red = a[0] - b[0];
    const green = a[1] - b[1];
    const blue = a[2] - b[2];
    return Math.sqrt(
      (2 + mean / 256) * red * red +
      4 * green * green +
      (2 + (255 - mean) / 256) * blue * blue
    );
  }

  function calculateGrid(width, height, maxSide, columns) {
    if (![width, height, maxSide, columns].every(Number.isFinite) ||
        width <= 0 || height <= 0 || maxSide <= 0 || columns < 1) {
      throw new Error('Geometría de mosaico no válida');
    }
    const scale = maxSide / Math.max(width, height);
    const outputWidth = Math.max(1, Math.round(width * scale));
    const outputHeight = Math.max(1, Math.round(height * scale));
    const safeColumns = Math.max(1, Math.min(Math.round(columns), outputWidth));
    const tileWidth = outputWidth / safeColumns;
    const rows = Math.max(1, Math.round(outputHeight / tileWidth));
    return {
      width: outputWidth,
      height: outputHeight,
      columns: safeColumns,
      rows,
      tileWidth,
      tileHeight: outputHeight / rows
    };
  }

  function pickTile(color, tiles, recent = [], avoidRepeats = true, usage = null, usagePenalty = 0) {
    if (!Number.isFinite(usagePenalty) || usagePenalty < 0) {
      throw new Error('Penalización de variedad no válida');
    }
    if (!tiles.length) throw new Error('No hay teselas válidas');
    let best;
    let bestDistance = Infinity;
    for (const tile of tiles) {
      let distance = colorDistance(color, tile.color);
      if (avoidRepeats && recent.includes(tile.index)) {
        distance = distance * 1.38 + 24;
      }
      const used = usage instanceof Map ? Number(usage.get(tile.index) || 0) : 0;
      if (Number.isFinite(used) && used > 0) distance += used * usagePenalty;
      if (distance < bestDistance) {
        best = tile;
        bestDistance = distance;
      }
    }
    return best;
  }

  function usageStats(usage, totalTiles) {
    if (!(usage instanceof Map) || !Number.isFinite(totalTiles) || totalTiles < 0) {
      throw new Error('Uso de teselas no válido');
    }
    const counts = [...usage.values()].filter(value => Number.isFinite(value) && value > 0);
    return {
      unique: counts.length,
      total: Math.round(totalTiles),
      mostUsed: counts.length ? Math.max(...counts) : 0
    };
  }

  globalThis.PhotoMosaicEngine = {
    isSupportedImageFile, calculateTileDecodeSide, colorDistance, calculateGrid, pickTile, usageStats
  };
})();
