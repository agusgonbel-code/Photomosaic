import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [release, capacitor, pkg, privacy, icon] = await Promise.all([
  readFile(new URL('ios-release.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('capacitor.config.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('package.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('PrivacyInfo.xcprivacy', root), 'utf8'),
  readFile(new URL('icons/icon-512.png', root))
]);

assert.equal(release.bundleId, capacitor.appId, 'El bundle ID nativo no coincide con Capacitor');
assert.equal(release.displayName, capacitor.appName, 'El nombre nativo no coincide con Capacitor');
assert.equal(release.marketingVersion, pkg.version, 'La versión iOS no coincide con package.json');
assert.match(release.marketingVersion, /^\d+\.\d+\.\d+$/, 'La versión debe tener formato X.Y.Z');
assert.ok(Number.isInteger(release.buildNumber) && release.buildNumber > 0, 'El build debe ser entero positivo');
assert.match(release.minimumIOSVersion, /^\d+\.\d+$/, 'La versión mínima de iOS debe tener formato X.Y');
assert.match(privacy, /<key>NSPrivacyTracking<\/key>\s*<false\/>/, 'Falta la declaración de seguimiento');

assert.equal(icon.toString('ascii', 1, 4), 'PNG', 'El icono debe ser PNG');
assert.equal(icon.readUInt32BE(16), 512, 'El icono fuente debe medir 512 px de ancho');
assert.equal(icon.readUInt32BE(20), 512, 'El icono fuente debe medir 512 px de alto');

console.log(`Release iOS válida: ${release.bundleId} ${release.marketingVersion} (${release.buildNumber}), iOS ${release.minimumIOSVersion}+`);
