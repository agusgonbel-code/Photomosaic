import assert from 'node:assert/strict';
await import('../mosaic-engine.js');
const { colorDistance, calculateGrid, pickTile } = globalThis.PhotoMosaicEngine;

assert.equal(colorDistance([20, 40, 60], [20, 40, 60]), 0);
assert.equal(colorDistance([0, 0, 0], [255, 255, 255]) > 700, true);

assert.deepEqual(calculateGrid(4000, 3000, 2200, 44), {
  width: 2200, height: 1650, columns: 44, rows: 33,
  tileWidth: 50, tileHeight: 50
});
const portrait = calculateGrid(3000, 4000, 2200, 45);
assert.equal(portrait.width, 1650);
assert.equal(portrait.height, 2200);
assert.equal(portrait.columns, 45);
assert.equal(portrait.rows, 60);

const tiles = [
  { index: 0, color: [100, 100, 100] },
  { index: 1, color: [106, 106, 106] }
];
assert.equal(pickTile([100, 100, 100], tiles, [], true).index, 0);
assert.equal(pickTile([100, 100, 100], tiles, [0], true).index, 1);
assert.equal(pickTile([100, 100, 100], tiles, [0], false).index, 0);
assert.throws(() => pickTile([0, 0, 0], []));

console.log('Mosaic engine tests passed');
