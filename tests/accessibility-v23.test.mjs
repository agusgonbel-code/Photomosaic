import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html=await readFile(new URL('../studio.html',import.meta.url),'utf8');

test('selection count is announced to assistive technologies',()=>{
  assert.match(html,/id="count"[^>]*role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/);
});

test('main visual previews expose meaningful accessible names',()=>{
  assert.match(html,/id="targetPreview"[^>]*alt="Vista previa de la foto principal"/);
  assert.match(html,/id="canvas"[^>]*role="img"[^>]*aria-label="Vista previa del diseño generado"/);
});

test('generated result announces its availability',()=>{
  assert.match(html,/id="result"[^>]*aria-live="polite"/);
});
