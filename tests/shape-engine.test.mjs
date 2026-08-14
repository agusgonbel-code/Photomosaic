import assert from 'node:assert/strict';
await import('../shape-engine.js');
const { SHAPES, shapeCells, shapeLimits, nearbyCounts, layoutForCount, trimSelection, pickUniqueTile } = globalThis.PhotoMosaicShapes;

assert.deepEqual(Object.keys(SHAPES), ['heart','circle','oval','square','diamond','triangle','star','hexagon','flower','crescent','cross','lightning','cloud','butterfly','arrow','clover']);
assert.equal(Object.keys(SHAPES).length, 16);
for (const shape of Object.keys(SHAPES)) {
  const limits = shapeLimits(shape);
  assert.ok(limits.minimum >= 10);
  assert.ok(limits.maximum <= 300);
  assert.ok(layoutForCount(shape, limits.minimum), `${shape} debe aceptar su mínimo`);
  assert.ok(limits.maximum <= 300);
  assert.ok(shapeCells(shape, 12).every(cell => cell.row >= 0 && cell.column >= 0));
}
const heart = nearbyCounts('heart', 100);
assert.deepEqual(heart, { exact: null, lower: 93, upper: 106 });
assert.equal(layoutForCount('heart', 106).cells.length, 106);
assert.equal(layoutForCount('heart', 100), null);
const photos = Array.from({ length: 100 }, (_, index) => ({ id: index }));
const trimmed = trimSelection(photos, 93);
assert.equal(trimmed.length, 93);
assert.equal(photos.length, 100, 'El ajuste no debe mutar la selección original');
assert.equal(trimmed.at(-1).id, 92);
assert.throws(() => trimSelection(photos, 106), /Cantidad de ajuste/);
assert.throws(() => trimSelection(null, 0), /Selección no válida/);

const used = new Set([0]);
const tiles = [{ index: 0, color: [0,0,0] }, { index: 1, color: [10,10,10] }];
assert.equal(pickUniqueTile([0,0,0], tiles, used, (a,b) => Math.abs(a[0]-b[0])).index, 1);
assert.throws(() => pickUniqueTile([0,0,0], tiles, new Set([0,1]), () => 0), /No quedan/);
console.log('Shape engine tests passed');
