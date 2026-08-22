import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../selection-controls.js',import.meta.url),'utf8');

test('thumbnail removal touch target is at least 44px',()=>{
  assert.match(source,/\.tile-remove\{[^}]*width:44px[^}]*height:44px[^}]*min-width:44px[^}]*min-height:44px/s);
});

test('large selections explicitly say all photos still participate',()=>{
  assert.match(source,/Mostrando 80 miniaturas de/);
  assert.match(source,/participan en la generación/);
});

test('result integrity lock remains present',()=>{
  assert.match(source,/Resultado protegido/);
  assert.match(source,/lockResultInputs/);
});
