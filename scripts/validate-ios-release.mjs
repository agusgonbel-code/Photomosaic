import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [release, metadata, capacitor, pkg, privacy, icon] = await Promise.all([
  readFile(new URL('ios-release.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('app-store/metadata.es-ES.json', root), 'utf8').then(JSON.parse),
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

assert.equal(metadata.locale, 'es-ES', 'La ficha debe usar español de España');
assert.equal(metadata.name, release.displayName, 'El nombre de App Store no coincide con el binario');
assert.ok(metadata.name.length > 0 && metadata.name.length <= 30, 'El nombre supera 30 caracteres');
assert.ok(metadata.subtitle.length > 0 && metadata.subtitle.length <= 30, 'El subtítulo supera 30 caracteres');
assert.ok(metadata.promotionalText.length > 0 && metadata.promotionalText.length <= 170, 'El texto promocional supera 170 caracteres');
assert.ok(metadata.description.length > 0 && metadata.description.length <= 4000, 'La descripción supera 4000 caracteres');
assert.ok(metadata.keywords.length > 0 && metadata.keywords.length <= 100, 'Las palabras clave superan 100 caracteres');
assert.equal(metadata.primaryCategory, 'PHOTO_AND_VIDEO', 'La categoría principal no es Foto y vídeo');
assert.match(metadata.privacyUrl, /^https:\/\//, 'Falta una URL de privacidad HTTPS');
assert.match(metadata.supportUrl, /^https:\/\//, 'Falta una URL de soporte HTTPS');
assert.ok(metadata.reviewNotes.length > 0, 'Faltan notas para App Review');
assert.doesNotMatch(JSON.stringify(metadata), /\bTODO\b|\bTBD\b|\bPLACEHOLDER\b|example\.com/, 'La ficha contiene texto provisional');

assert.equal(icon.toString('ascii', 1, 4), 'PNG', 'El icono debe ser PNG');
assert.equal(icon.readUInt32BE(16), 512, 'El icono fuente debe medir 512 px de ancho');
assert.equal(icon.readUInt32BE(20), 512, 'El icono fuente debe medir 512 px de alto');

console.log(`Release iOS válida: ${release.bundleId} ${release.marketingVersion} (${release.buildNumber}), iOS ${release.minimumIOSVersion}+`);
console.log(`Ficha App Store válida: ${metadata.locale}, ${metadata.name}`);
