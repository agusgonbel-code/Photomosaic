import assert from 'node:assert/strict';
await import('../mosaic-engine.js');
const { isSupportedImageFile, calculateTileDecodeSide, colorDistance, calculateGrid, pickTile, usageStats } = globalThis.PhotoMosaicEngine;

assert.equal(isSupportedImageFile({ name: 'foto.HEIC', type: '', size: 1024 }, 2048), true);
assert.equal(isSupportedImageFile({ name: 'foto', type: 'image/heif', size: 1024 }, 2048), true);
assert.equal(isSupportedImageFile({ name: 'vector.svg', type: 'image/svg+xml', size: 1024 }, 2048), false);
assert.equal(isSupportedImageFile({ name: 'foto.jpg', type: 'image/jpeg', size: 4096 }, 2048), false);
assert.equal(isSupportedImageFile({ name: 'vacía.jpg', type: 'image/jpeg', size: 0 }, 2048), false);
assert.equal(calculateTileDecodeSide(3200, 100), 96);
assert.equal(calculateTileDecodeSide(2200, 44), 150);
assert.equal(calculateTileDecodeSide(3200, 15), 384);
assert.throws(() => calculateTileDecodeSide(0, 45));

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
const usage = new Map([[0, 10], [1, 0]]);
assert.equal(pickTile([100, 100, 100], tiles, [], false, usage, 18).index, 1);
assert.equal(pickTile([100, 100, 100], tiles, [], false, usage, 0).index, 0);
assert.throws(() => pickTile([100, 100, 100], tiles, [], false, usage, -1));
assert.throws(() => pickTile([0, 0, 0], []));
assert.deepEqual(usageStats(new Map([[0, 4], [1, 2], [2, 0]]), 6), {
  unique: 2, total: 6, mostUsed: 4
});

console.log('Mosaic engine tests passed');
