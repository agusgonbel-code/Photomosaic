import assert from 'node:assert/strict';
await import('../shape-engine.js');
const { SHAPES, shapeCells, shapeLimits, nearbyCounts, layoutForCount, normalizeCustomOutline, customShapeCells, customShapeLimits, customNearbyCounts, customLayoutForCount, installationPlan, installationGuideSvg, installationPlanCsv, trimSelection, pickUniqueTile } = globalThis.PhotoMosaicShapes;

assert.deepEqual(Object.keys(SHAPES), ['heart','circle','oval','square','diamond','triangle','star','hexagon','flower','crescent','cross','lightning','cloud','butterfly','arrow','clover']);
assert.equal(Object.keys(SHAPES).length, 16);
for (const shape of Object.keys(SHAPES)) {
  const limits = shapeLimits(shape);
  assert.ok(limits.minimum >= 10);
  assert.ok(limits.maximum <= 300);
  assert.ok(layoutForCount(shape, limits.minimum), `${shape} debe aceptar su mínimo`);
  const cells = shapeCells(shape, 12);
  assert.ok(cells.length > 0);
  assert.ok(cells.every(cell => cell.row >= 0 && cell.column >= 0));
  const occupied = new Set(cells.map(cell => cell.row + '|' + cell.column));
  assert.ok(cells.every(cell => [[-1,0],[1,0],[0,-1],[0,1]].some(([dr,dc]) =>
    !occupied.has((cell.row + dr) + '|' + (cell.column + dc))
  )), `${shape} solo debe contener fotografías del contorno`);
}
const heartLimits = shapeLimits('heart');
const heart = nearbyCounts('heart', 100);
assert.ok(heart.exact === 100 || heart.lower < 100 || heart.upper > 100);
assert.equal(layoutForCount('heart', heartLimits.minimum).cells.length, heartLimits.minimum);
const customStroke = [{ x: .1, y: .1 }, { x: .9, y: .1 }, { x: .9, y: .9 }, { x: .1, y: .9 }];
const normalizedStroke = normalizeCustomOutline(customStroke);
assert.equal(normalizedStroke.length, 4);
assert.ok(normalizedStroke.every(point => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1));
const customCells = customShapeCells(customStroke, 12);
assert.ok(customCells.length >= 10);
assert.ok(customCells.every(cell => cell.row <= 1 || cell.row >= 10 || cell.column <= 1 || cell.column >= 10), 'El interior de una forma personalizada debe quedar vacío');
const customLimits = customShapeLimits(customStroke);
assert.ok(customLimits.minimum >= 10 && customLimits.maximum <= 300);
const customNear = customNearbyCounts(customStroke, 100);
assert.ok(customNear.exact === 100 || customNear.lower < 100 || customNear.upper > 100);
assert.equal(customLayoutForCount(customStroke, customLimits.minimum).cells.length, customLimits.minimum);
assert.throws(() => normalizeCustomOutline([{ x: .1, y: .1 }]), /más completo/);
const photos = Array.from({ length: 100 }, (_, index) => ({ id: index }));
const trimmed = trimSelection(photos, 90);
assert.equal(trimmed.length, 90);
assert.equal(photos.length, 100, 'El ajuste no debe mutar la selección original');
assert.equal(trimmed.at(-1).id, 89);
assert.throws(() => trimSelection(photos, 106), /Cantidad de ajuste/);
assert.throws(() => trimSelection(null, 0), /Selección no válida/);

const used = new Set([0]);
const tiles = [{ index: 0, color: [0,0,0] }, { index: 1, color: [10,10,10] }];
assert.equal(pickUniqueTile([0,0,0], tiles, used, (a,b) => Math.abs(a[0]-b[0])).index, 1);
assert.throws(() => pickUniqueTile([0,0,0], tiles, new Set([0,1]), () => 0), /No quedan/);
console.log('Shape engine tests passed');

const wallLayout = { cells: [{ row: 2, column: 3 }, { row: 2, column: 4 }, { row: 3, column: 4 }] };
const wallPlan = installationPlan(wallLayout, { photoWidthCm: 10, photoHeightCm: 15, gapCm: 2 });
assert.equal(wallPlan.widthCm, 22);
assert.equal(wallPlan.heightCm, 32);
assert.deepEqual(wallPlan.positions.map(({ number, xCm, yCm }) => ({ number, xCm, yCm })), [
  { number: 1, xCm: 0, yCm: 0 },
  { number: 2, xCm: 12, yCm: 0 },
  { number: 3, xCm: 12, yCm: 17 }
]);
assert.throws(() => installationPlan(wallLayout, { photoWidthCm: 2 }), /Medidas no válidas/);
assert.throws(() => installationPlan({ cells: [] }), /Diseño no válido/);

const visualGuide = installationGuideSvg(wallPlan, { shapeLabel: 'Corazón <familiar>' });
assert.match(visualGuide, /Plano de colocación/);
assert.match(visualGuide, /Corazón &lt;familiar&gt;/);
assert.match(visualGuide, />1<\/text>/);
assert.match(visualGuide, /22\.0 × 32\.0 cm/);
const csvGuide = installationPlanCsv(wallPlan, ['uno.jpg', 'foto;"dos".jpg', 'tres.jpg']);
assert.ok(csvGuide.startsWith('\uFEFF'));
assert.match(csvGuide, /"foto;""dos""\.jpg"/);
assert.throws(() => installationGuideSvg(null), /Plano no válido/);
