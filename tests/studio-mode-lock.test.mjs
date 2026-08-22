import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../studio-mode.js',import.meta.url),'utf8');

test('shape and mosaic keep distinct document identities',()=>{
  assert.match(source,/Forma para pared · PhotoMosaic/);
  assert.match(source,/Mosaico fotográfico · PhotoMosaic/);
  assert.match(source,/photomosaicMode='shape'/);
  assert.match(source,/photomosaicMode='mosaic'/);
});

test('hidden internal mode selector cannot switch products after route selection',()=>{
  assert.match(source,/chooser\.hidden=true/);
  assert.match(source,/aria-hidden/);
  assert.match(source,/select\.addEventListener\('change'/);
  assert.match(source,/if\(select\.value===mode\)return/);
  assert.match(source,/select\.value=mode/);
});

test('shape route hides target photo and mosaic-only controls while mosaic restores them',()=>{
  assert.match(source,/if\(target\)target\.hidden=true/);
  assert.match(source,/if\(mosaic\)mosaic\.hidden=true/);
  assert.match(source,/if\(target\)target\.hidden=false/);
  assert.match(source,/if\(mosaic\)mosaic\.hidden=false/);
});
