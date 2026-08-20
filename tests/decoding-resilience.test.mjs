import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const worker = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');

test('la decodificación de imágenes tiene cancelación y tiempo máximo', () => {
  assert.match(app, /function load\(f,maxSide=1024,signal=null,timeoutMs=20000\)/);
  assert.match(app, /if\(signal\.cancelled\)settle\(rej,new GenerationCancelledError/);
  assert.match(app, /clearTimeout\(timeout\)/);
  assert.match(app, /clearInterval\(cancelPoll\)/);
  assert.match(app, /URL\.revokeObjectURL\(u\)/);
  assert.match(app, /load\(snapshot\.tiles\[i\],tileSide,signal\)/);
});

test('una foto objetivo ilegible se retira sin tocar las teselas', () => {
  assert.match(app, /if\(st\.target===snapshot\.target\)/);
  assert.match(app, /st\.target=null/);
  assert.match(app, /e\.targetBox\.classList\.add\('hidden'\)/);
  assert.match(app, /La foto principal no se pudo leer y se retiró/);
  assert.match(worker, /photomosaic-v19-cancellable-decoding/);
});
