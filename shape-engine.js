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
    flower: { label: 'Flor', min: 16 }
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
    const cells = [];
    for (let row = 0; row < columns; row++) {
      for (let column = 0; column < columns; column++) {
        const x = ((column + 0.5) / columns * 2 - 1) * 1.15;
        const y = ((row + 0.5) / columns * 2 - 1) * 1.15;
        if (inside(shape, x, y)) cells.push({ row, column });
      }
    }
    return cells;
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
    SHAPES, shapeCells, validLayouts, shapeLimits, nearbyCounts, layoutForCount, trimSelection, pickUniqueTile
  };
})();
