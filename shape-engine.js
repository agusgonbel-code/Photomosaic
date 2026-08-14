(() => {
  'use strict';

  const SHAPES = Object.freeze({
    heart: { label: 'Corazón', min: 17 },
    circle: { label: 'Círculo', min: 12 },
    oval: { label: 'Óvalo', min: 12 },
    square: { label: 'Cuadrado', min: 16 },
    diamond: { label: 'Rombo', min: 13 },
    triangle: { label: 'Triángulo', min: 10 },
    star: { label: 'Estrella', min: 15 },
    hexagon: { label: 'Hexágono', min: 14 },
    flower: { label: 'Flor', min: 16 },
    crescent: { label: 'Luna', min: 12 },
    cross: { label: 'Cruz', min: 12 },
    lightning: { label: 'Rayo', min: 12 },
    cloud: { label: 'Nube', min: 14 },
    butterfly: { label: 'Mariposa', min: 16 },
    arrow: { label: 'Flecha', min: 12 },
    clover: { label: 'Trébol', min: 16 }
  });

  function inside(shape, x, y) {
    const ax = Math.abs(x), ay = Math.abs(y);
    if (shape === 'heart') {
      const yy = -y;
      return Math.pow(x * x + yy * yy - 0.58, 3) - x * x * Math.pow(yy, 3) <= 0;
    }
    if (shape === 'circle') return x * x + y * y <= 0.9;
    if (shape === 'oval') return x * x / 0.95 + y * y / 0.58 <= 1;
    if (shape === 'square') return ax <= 0.9 && ay <= 0.9;
    if (shape === 'diamond') return ax + ay <= 1.15;
    if (shape === 'triangle') return y >= -0.78 && y <= 0.85 && ay ? ax <= (y + 0.86) * 0.72 : true;
    if (shape === 'hexagon') return ax <= 0.9 && ay <= 0.78 && ax + ay * 0.58 <= 1.18;
    if (shape === 'crescent') return x * x + y * y <= 0.88 && (x - 0.34) * (x - 0.34) + y * y >= 0.58;
    if (shape === 'cross') return (ax <= 0.28 && ay <= 0.9) || (ay <= 0.28 && ax <= 0.9);
    if (shape === 'lightning') return y < -0.05 ? x >= -0.55 - y * 0.16 && x <= 0.22 - y * 0.16 : x >= -0.22 + y * 0.12 && x <= 0.58 + y * 0.12;
    if (shape === 'cloud') return (y >= 0.05 && y <= 0.62 && ax <= 0.82) || (x + 0.46) ** 2 + (y - 0.05) ** 2 <= 0.25 || (x - 0.42) ** 2 + (y - 0.08) ** 2 <= 0.28 || x * x + (y + 0.2) ** 2 <= 0.34;
    if (shape === 'butterfly') return ax <= 0.12 && ay <= 0.72 || ((ax - 0.43) ** 2 / 0.22 + (ay - 0.28) ** 2 / 0.36 <= 1);
    if (shape === 'arrow') return (x >= -0.88 && x <= 0.2 && ay <= 0.28) || (x >= 0.08 && x <= 0.9 && ay <= 0.72 * (0.9 - x) / 0.82);
    if (shape === 'clover') return x * x + y * y <= 0.16 || (x - 0.38) ** 2 + y * y <= 0.24 || (x + 0.38) ** 2 + y * y <= 0.24 || x * x + (y - 0.38) ** 2 <= 0.24 || x * x + (y + 0.38) ** 2 <= 0.24;
    const angle = Math.atan2(y, x);
    const radius = Math.hypot(x, y);
    if (shape === 'star') {
      const boundary = 0.52 + 0.34 * Math.pow(Math.abs(Math.cos(5 * angle)), 5);
      return radius <= boundary;
    }
    if (shape === 'flower') return radius <= 0.67 + 0.18 * Math.cos(6 * angle);
    throw new Error('Forma no válida');
  }

  function shapeCells(shape, columns) {
    if (!SHAPES[shape]) throw new Error('Forma no válida');
    if (!Number.isInteger(columns) || columns < 3 || columns > 80) throw new Error('Tamaño de forma no válido');
    const filled = [];
    const occupied = new Set();
    for (let row = 0; row < columns; row++) {
      for (let column = 0; column < columns; column++) {
        const x = ((column + 0.5) / columns * 2 - 1) * 1.15;
        const y = ((row + 0.5) / columns * 2 - 1) * 1.15;
        if (inside(shape, x, y)) {
          filled.push({ row, column });
          occupied.add(row + '|' + column);
        }
      }
    }
    const neighbours = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return filled.filter(cell => neighbours.some(([dr, dc]) =>
      !occupied.has((cell.row + dr) + '|' + (cell.column + dc))
    ));
  }

  function validLayouts(shape, maximum = 300) {
    if (!SHAPES[shape]) throw new Error('Forma no válida');
    const unique = new Map();
    for (let columns = 3; columns <= 80; columns++) {
      const cells = shapeCells(shape, columns);
      const count = cells.length;
      if (count >= SHAPES[shape].min && count <= maximum && !unique.has(count)) {
        unique.set(count, { shape, columns, rows: columns, count, cells });
      }
    }
    return [...unique.values()].sort((a, b) => a.count - b.count);
  }

  function shapeLimits(shape, maximum = 300) {
    const layouts = validLayouts(shape, maximum);
    if (!layouts.length) throw new Error('No hay tamaños válidos para esta forma');
    return { minimum: layouts[0].count, maximum: layouts.at(-1).count };
  }

  function nearbyCounts(shape, desired, maximum = 300) {
    if (!Number.isFinite(desired)) throw new Error('Cantidad no válida');
    const layouts = validLayouts(shape, maximum);
    const count = Math.round(desired);
    const exact = layouts.find(item => item.count === count);
    const lower = [...layouts].reverse().find(item => item.count < count) || null;
    const upper = layouts.find(item => item.count > count) || null;
    return { exact: exact?.count ?? null, lower: lower?.count ?? null, upper: upper?.count ?? null };
  }

  function layoutForCount(shape, count, maximum = 300) {
    return validLayouts(shape, maximum).find(item => item.count === Math.round(count)) || null;
  }

  function normalizeCustomOutline(points) {
    if (!Array.isArray(points)) throw new TypeError('Contorno personalizado no válido');
    const clean = [];
    for (const point of points) {
      const x = Number(point?.x), y = Number(point?.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const candidate = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
      const previous = clean.at(-1);
      if (!previous || Math.hypot(candidate.x - previous.x, candidate.y - previous.y) >= 0.005) clean.push(candidate);
    }
    if (clean.length < 3) throw new Error('Dibuja un contorno más completo');
    const xs = clean.map(point => point.x), ys = clean.map(point => point.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const width = maxX - minX, height = maxY - minY;
    if (width < 0.05 || height < 0.05) throw new Error('El contorno es demasiado pequeño');
    const scale = 0.84 / Math.max(width, height);
    return clean.map(point => ({
      x: (point.x - (minX + maxX) / 2) * scale + 0.5,
      y: (point.y - (minY + maxY) / 2) * scale + 0.5
    }));
  }

  function segmentDistance(point, start, end) {
    const dx = end.x - start.x, dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (!lengthSquared) return Math.hypot(point.x - start.x, point.y - start.y);
    const amount = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
    return Math.hypot(point.x - (start.x + amount * dx), point.y - (start.y + amount * dy));
  }

  function customShapeCells(points, columns) {
    if (!Number.isInteger(columns) || columns < 3 || columns > 80) throw new Error('Tamaño de forma no válido');
    const outline = normalizeCustomOutline(points);
    const segments = outline.map((point, index) => [point, outline[(index + 1) % outline.length]]);
    const threshold = 0.72 / columns;
    const cells = [];
    for (let row = 0; row < columns; row++) {
      for (let column = 0; column < columns; column++) {
        const centre = { x: (column + 0.5) / columns, y: (row + 0.5) / columns };
        if (segments.some(([start, end]) => segmentDistance(centre, start, end) <= threshold)) cells.push({ row, column });
      }
    }
    return cells;
  }

  const customLayoutCache = new Map();

  function customValidLayouts(points, maximum = 300) {
    const cacheKey = maximum + ':' + (Array.isArray(points) ? points.map(point => `${Number(point?.x).toFixed(3)},${Number(point?.y).toFixed(3)}`).join(';') : 'invalid');
    if (customLayoutCache.has(cacheKey)) return customLayoutCache.get(cacheKey);
    const unique = new Map();
    for (let columns = 3; columns <= 80; columns++) {
      const cells = customShapeCells(points, columns), count = cells.length;
      if (count >= 10 && count <= maximum && !unique.has(count)) unique.set(count, { shape: 'custom', columns, rows: columns, count, cells });
    }
    const layouts = [...unique.values()].sort((a, b) => a.count - b.count);
    customLayoutCache.set(cacheKey, layouts);
    if (customLayoutCache.size > 8) customLayoutCache.delete(customLayoutCache.keys().next().value);
    return layouts;
  }

  function customShapeLimits(points, maximum = 300) {
    const layouts = customValidLayouts(points, maximum);
    if (!layouts.length) throw new Error('El trazo no produce tamaños válidos');
    return { minimum: layouts[0].count, maximum: layouts.at(-1).count };
  }

  function customNearbyCounts(points, desired, maximum = 300) {
    if (!Number.isFinite(desired)) throw new Error('Cantidad no válida');
    const layouts = customValidLayouts(points, maximum), count = Math.round(desired);
    const exact = layouts.find(item => item.count === count);
    return {
      exact: exact?.count ?? null,
      lower: [...layouts].reverse().find(item => item.count < count)?.count ?? null,
      upper: layouts.find(item => item.count > count)?.count ?? null
    };
  }

  function customLayoutForCount(points, count, maximum = 300) {
    return customValidLayouts(points, maximum).find(item => item.count === Math.round(count)) || null;
  }

  function installationPlan(layout, options = {}) {
    if (!layout || !Array.isArray(layout.cells) || !layout.cells.length) throw new Error('Diseño no válido');
    const width = Number(options.photoWidthCm ?? 10);
    const height = Number(options.photoHeightCm ?? 15);
    const gap = Number(options.gapCm ?? 2);
    if (![width, height].every(value => Number.isFinite(value) && value >= 5 && value <= 100) ||
        !Number.isFinite(gap) || gap < 0 || gap > 50) throw new Error('Medidas no válidas');
    const rows = layout.cells.map(cell => cell.row), columns = layout.cells.map(cell => cell.column);
    const minRow = Math.min(...rows), maxRow = Math.max(...rows);
    const minColumn = Math.min(...columns), maxColumn = Math.max(...columns);
    const rowCount = maxRow - minRow + 1, columnCount = maxColumn - minColumn + 1;
    const positions = layout.cells.map((cell, index) => ({
      number: index + 1,
      row: cell.row - minRow + 1,
      column: cell.column - minColumn + 1,
      xCm: (cell.column - minColumn) * (width + gap),
      yCm: (cell.row - minRow) * (height + gap)
    }));
    return {
      photoWidthCm: width, photoHeightCm: height, gapCm: gap,
      widthCm: columnCount * width + (columnCount - 1) * gap,
      heightCm: rowCount * height + (rowCount - 1) * gap,
      rows: rowCount, columns: columnCount, positions
    };
  }

  const xml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);

  function installationGuideSvg(plan, options = {}) {
    if (!plan || !Array.isArray(plan.positions) || !plan.positions.length) throw new Error('Plano no válido');
    const shapeLabel = String(options.shapeLabel || 'Forma').trim().slice(0, 60) || 'Forma';
    const canvasWidth = 1200, canvasHeight = 1500, left = 70, top = 270;
    const drawingWidth = canvasWidth - left * 2, drawingHeight = 1040;
    const scale = Math.min(drawingWidth / plan.widthCm, drawingHeight / plan.heightCm);
    if (!Number.isFinite(scale) || scale <= 0) throw new Error('Medidas del plano no válidas');
    const offsetX = left + (drawingWidth - plan.widthCm * scale) / 2;
    const offsetY = top + (drawingHeight - plan.heightCm * scale) / 2;
    const photoWidth = plan.photoWidthCm * scale, photoHeight = plan.photoHeightCm * scale;
    const fontSize = Math.max(9, Math.min(30, Math.min(photoWidth, photoHeight) * 0.34));
    const photos = plan.positions.map(position => {
      const x = offsetX + position.xCm * scale, y = offsetY + position.yCm * scale;
      return `<g><rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${photoWidth.toFixed(2)}" height="${photoHeight.toFixed(2)}" rx="5" fill="#ffffff" stroke="#111827" stroke-width="2"/><text x="${(x + photoWidth / 2).toFixed(2)}" y="${(y + photoHeight / 2).toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-size="${fontSize.toFixed(1)}" font-weight="700" fill="#111827">${position.number}</text></g>`;
    }).join('');
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${canvasHeight}" role="img" aria-labelledby="title description">
  <title id="title">Plano de colocación · ${xml(shapeLabel)}</title>
  <desc id="description">Guía numerada para colocar ${plan.positions.length} fotografías.</desc>
  <rect width="1200" height="1500" fill="#f8fafc"/>
  <text x="70" y="82" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-size="48" font-weight="800" fill="#111827">PhotoMosaic · ${xml(shapeLabel)}</text>
  <text x="70" y="138" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-size="27" fill="#334155">${plan.positions.length} fotos · pared ${plan.widthCm.toFixed(1)} × ${plan.heightCm.toFixed(1)} cm</text>
  <text x="70" y="181" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-size="24" fill="#475569">Cada foto ${plan.photoWidthCm.toFixed(1)} × ${plan.photoHeightCm.toFixed(1)} cm · separación ${plan.gapCm.toFixed(1)} cm</text>
  <text x="70" y="226" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-size="20" fill="#64748b">Empieza por la esquina superior izquierda y sigue la numeración.</text>
  <g font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif">${photos}</g>
  <text x="70" y="1415" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-size="21" fill="#475569">Guía visual de referencia · no imprimir a escala 1:1.</text>
  <text x="70" y="1454" font-family="-apple-system,BlinkMacSystemFont,Arial,sans-serif" font-size="18" fill="#64748b">Procesado localmente en tu dispositivo.</text>
</svg>`;
  }

  function installationPlanCsv(plan, filenames = []) {
    if (!plan || !Array.isArray(plan.positions) || !plan.positions.length) throw new Error('Plano no válido');
    const rows = [['Foto','Archivo','Fila','Columna','X desde izquierda (cm)','Y desde arriba (cm)'],
      ...plan.positions.map((position, index) => [position.number, filenames[index] || '', position.row, position.column, position.xCm.toFixed(1), position.yCm.toFixed(1)])];
    return '\uFEFF' + rows.map(row => row.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(';')).join('\n');
  }

  function trimSelection(items, count) {
    if (!Array.isArray(items)) throw new TypeError('Selección no válida');
    if (!Number.isInteger(count) || count < 0 || count > items.length) {
      throw new Error('Cantidad de ajuste no válida');
    }
    return items.slice(0, count);
  }

  function pickUniqueTile(color, tiles, used, distance) {
    let best = null, score = Infinity;
    for (const tile of tiles) {
      if (used.has(tile.index)) continue;
      const candidate = distance(color, tile.color);
      if (candidate < score) { best = tile; score = candidate; }
    }
    if (!best) throw new Error('No quedan fotografías para completar la forma');
    return best;
  }

  globalThis.PhotoMosaicShapes = {
    SHAPES, shapeCells, validLayouts, shapeLimits, nearbyCounts, layoutForCount,
    normalizeCustomOutline, customShapeCells, customValidLayouts, customShapeLimits, customNearbyCounts, customLayoutForCount,
    installationPlan, installationGuideSvg, installationPlanCsv, trimSelection, pickUniqueTile
  };
})();
