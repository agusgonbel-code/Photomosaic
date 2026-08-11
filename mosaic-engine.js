(() => {
  'use strict';

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

  function pickTile(color, tiles, recent = [], avoidRepeats = true) {
    if (!tiles.length) throw new Error('No hay teselas válidas');
    let best;
    let bestDistance = Infinity;
    for (const tile of tiles) {
      let distance = colorDistance(color, tile.color);
      if (avoidRepeats && recent.includes(tile.index)) {
        distance = distance * 1.38 + 24;
      }
      if (distance < bestDistance) {
        best = tile;
        bestDistance = distance;
      }
    }
    return best;
  }

  globalThis.PhotoMosaicEngine = { colorDistance, calculateGrid, pickTile };
})();
