import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=await readFile(new URL('../styles.css',import.meta.url),'utf8');
const pro=await readFile(new URL('../professional-v31.css',import.meta.url),'utf8');
test('PhotoMosaic loads its professional presentation layer',()=>{assert.match(base,/professional-v31\.css/);});
test('professional layer keeps split-product cards and accessible focus',()=>{assert.match(pro,/\.modeCard/);assert.match(pro,/focus-visible/);assert.match(pro,/prefers-reduced-motion/);assert.match(pro,/\.actions \.primary\{grid-column:1\/-1\}/);});
