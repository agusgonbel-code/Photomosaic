import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la configuración nativa conserva identidad y paquete web reproducible', () => {
  const config = JSON.parse(readFileSync(new URL('../capacitor.config.json', import.meta.url), 'utf8'));
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const build = readFileSync(new URL('../scripts/build-mobile.mjs', import.meta.url), 'utf8');
  const assets = readFileSync(new URL('../scripts/configure-ios-assets.mjs', import.meta.url), 'utf8');

  assert.equal(config.appId, 'com.agusgonbel.photomosaic');
  assert.equal(config.appName, 'PhotoMosaic');
  assert.equal(config.webDir, 'www');
  assert.equal(pkg.dependencies['@capacitor/core'], '8.5.0');
  assert.equal(pkg.dependencies['@capacitor/ios'], '8.5.0');
  assert.equal(pkg.devDependencies['@capacitor/cli'], '8.5.0');
  assert.match(pkg.scripts['ios:add'], /ios:assets/);
  assert.match(pkg.scripts['ios:prepare'], /ios:assets/);
  for (const resource of ['index.html', 'app.js', 'shape-engine.js', 'icons/icon-512.png']) {
    assert.ok(build.includes(`'${resource}'`), `Falta ${resource} en el paquete nativo`);
  }
  assert.match(build, /location\.protocol==='http:'/);
  assert.doesNotMatch(build, /'service-worker\.js'\s*,/);
  assert.match(assets, /icons.*icon-512\.png/s);
  assert.match(assets, /'sips'/);
  assert.match(assets, /'1024'/);
  assert.match(assets, /AppIcon-512@2x\.png/);
});
