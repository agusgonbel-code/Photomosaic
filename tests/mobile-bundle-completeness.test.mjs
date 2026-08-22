import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const studio=await readFile(new URL('../studio.html',import.meta.url),'utf8');
const build=await readFile(new URL('../scripts/build-mobile.mjs',import.meta.url),'utf8');

test('native bundle includes the studio reached from the launcher',()=>{
  assert.match(build,/'studio\.html'/);
});

test('every local script required by studio is copied into the native bundle',()=>{
  const scripts=[...studio.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]).filter(src=>!/^https?:/.test(src));
  assert.ok(scripts.length>=8);
  for(const src of scripts)assert.ok(build.includes(`'${src}'`),`Missing native studio script: ${src}`);
});

test('every local stylesheet required by studio is copied into the native bundle',()=>{
  const styles=[...studio.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m=>m[1]);
  for(const href of styles)assert.ok(build.includes(`'${href}'`),`Missing native studio stylesheet: ${href}`);
});
