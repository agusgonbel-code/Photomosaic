import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [release, metadata, screenshots, capacitor, pkg, privacy, icon, html] = await Promise.all([
  readFile(new URL('ios-release.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('app-store/metadata.es-ES.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('app-store/screenshots.es-ES.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('capacitor.config.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('package.json', root), 'utf8').then(JSON.parse),
  readFile(new URL('PrivacyInfo.xcprivacy', root), 'utf8'),
  readFile(new URL('icons/icon-512.png', root)),
  readFile(new URL('index.html', root), 'utf8')
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

assert.equal(screenshots.locale, metadata.locale, 'Las capturas no coinciden con el idioma de la ficha');
assert.equal(screenshots.platform, 'IPHONE', 'Las capturas deben estar preparadas para iPhone');
assert.equal(screenshots.orientation, 'PORTRAIT', 'El guion debe usar orientación vertical');
assert.equal(screenshots.minimumScreenshots, 1, 'App Store requiere al menos una captura');
assert.equal(screenshots.maximumScreenshots, 10, 'App Store admite como máximo diez capturas');
assert.ok(screenshots.scenes.length >= screenshots.minimumScreenshots, 'Faltan escenas para App Store');
assert.ok(screenshots.scenes.length <= screenshots.maximumScreenshots, 'Sobran escenas para App Store');
assert.deepEqual(screenshots.scenes.map(scene => scene.order), screenshots.scenes.map((_, index) => index + 1), 'El orden de capturas no es consecutivo');
assert.equal(new Set(screenshots.scenes.map(scene => scene.id)).size, screenshots.scenes.length, 'Hay identificadores de captura repetidos');
for (const scene of screenshots.scenes) {
  assert.ok(scene.headline.length > 0 && scene.headline.length <= 40, `Titular no válido en ${scene.id}`);
  assert.ok(scene.supportingText.length > 0 && scene.supportingText.length <= 70, `Texto no válido en ${scene.id}`);
  assert.ok(Array.isArray(scene.setup) && scene.setup.length >= 2, `Preparación incompleta en ${scene.id}`);
  assert.ok(scene.setup.every(step => typeof step === 'string' && step.trim()), `Hay pasos vacíos en ${scene.id}`);
  assert.match(html, new RegExp(`id=["']${scene.surface}["']`), `La superficie ${scene.surface} no existe`);
}
const privacyRules = screenshots.privacyRules.join(' ');
assert.match(privacyRules, /fotografías ficticias/i, 'Las capturas no exigen fotos ficticias');
assert.match(privacyRules, /no incluir rostros reconocibles/i, 'Las capturas no protegen identidades');

assert.equal(icon.toString('ascii', 1, 4), 'PNG', 'El icono debe ser PNG');
assert.equal(icon.readUInt32BE(16), 512, 'El icono fuente debe medir 512 px de ancho');
assert.equal(icon.readUInt32BE(20), 512, 'El icono fuente debe medir 512 px de alto');

console.log(`Release iOS válida: ${release.bundleId} ${release.marketingVersion} (${release.buildNumber}), iOS ${release.minimumIOSVersion}+`);
console.log(`Ficha App Store válida: ${metadata.locale}, ${metadata.name}`);
console.log(`Capturas App Store válidas: ${screenshots.scenes.length} escenas para ${screenshots.platform}`);
