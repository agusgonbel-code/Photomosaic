import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la configuración nativa conserva identidad, privacidad y paquete reproducible', () => {
  const config = JSON.parse(readFileSync(new URL('../capacitor.config.json', import.meta.url), 'utf8'));
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const build = readFileSync(new URL('../scripts/build-mobile.mjs', import.meta.url), 'utf8');
  const site = readFileSync(new URL('../scripts/build-site.mjs', import.meta.url), 'utf8');
  const assets = readFileSync(new URL('../scripts/configure-ios-assets.mjs', import.meta.url), 'utf8');
  const validator = readFileSync(new URL('../scripts/validate-ios-release.mjs', import.meta.url), 'utf8');
  const release = JSON.parse(readFileSync(new URL('../ios-release.json', import.meta.url), 'utf8'));
  const metadata = JSON.parse(readFileSync(new URL('../app-store/metadata.es-ES.json', import.meta.url), 'utf8'));
  const screenshots = JSON.parse(readFileSync(new URL('../app-store/screenshots.es-ES.json', import.meta.url), 'utf8'));
  const privacyManifest = readFileSync(new URL('../PrivacyInfo.xcprivacy', import.meta.url), 'utf8');
  const privacyPage = readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');
  const supportPage = readFileSync(new URL('../support.html', import.meta.url), 'utf8');
  const workflow = readFileSync(new URL('../.github/workflows/ios-native-ci.yml', import.meta.url), 'utf8');

  assert.equal(config.appId, 'com.agusgonbel.photomosaic');
  assert.equal(config.appName, 'PhotoMosaic');
  assert.equal(config.webDir, 'www');
  assert.equal(pkg.dependencies['@capacitor/core'], '8.5.0');
  assert.equal(pkg.dependencies['@capacitor/ios'], '8.5.0');
  assert.equal(pkg.devDependencies['@capacitor/cli'], '8.5.0');
  assert.equal(release.bundleId, config.appId);
  assert.equal(release.displayName, config.appName);
  assert.equal(release.marketingVersion, pkg.version);
  assert.ok(Number.isInteger(release.buildNumber) && release.buildNumber > 0);
  assert.equal(release.minimumIOSVersion, '15.0');
  assert.equal(pkg.scripts['ios:release:check'], 'node scripts/validate-ios-release.mjs');
  assert.equal(metadata.locale, 'es-ES');
  assert.equal(metadata.name, release.displayName);
  assert.equal(metadata.primaryCategory, 'PHOTO_AND_VIDEO');
  assert.ok(metadata.subtitle.length <= 30);
  assert.ok(metadata.promotionalText.length <= 170);
  assert.ok(metadata.keywords.length <= 100);
  assert.equal(screenshots.locale, metadata.locale);
  assert.equal(screenshots.platform, 'IPHONE');
  assert.equal(screenshots.orientation, 'PORTRAIT');
  assert.equal(screenshots.scenes.length, 5);
  assert.equal(screenshots.scenes[0].surface, 'target');
  assert.equal(screenshots.scenes.at(-1).surface, 'wallGuide');
  assert.match(pkg.scripts['ios:add'], /ios:assets/);
  assert.match(pkg.scripts['ios:prepare'], /ios:assets/);

  for (const resource of ['index.html', 'app.js', 'shape-engine.js', 'icons/icon-512.png', 'privacy.html', 'support.html']) {
    assert.ok(build.includes(`'${resource}'`), `Falta ${resource} en el paquete nativo`);
    assert.ok(site.includes(`'${resource}'`), `Falta ${resource} en el sitio público`);
  }
  assert.match(build, /location\.protocol==='http:'/);
  assert.doesNotMatch(build, /'service-worker\.js'\s*,/);

  assert.match(assets, /icons.*icon-512\.png/s);
  assert.match(assets, /'sips'/);
  assert.match(assets, /'1024'/);
  assert.match(assets, /PrivacyInfo\.xcprivacy/);
  assert.match(assets, /PBXResourcesBuildPhase/);
  assert.match(assets, /PrivacyInfo\.xcprivacy in Resources/);
  assert.match(assets, /MARKETING_VERSION/);
  assert.match(assets, /CURRENT_PROJECT_VERSION/);
  assert.match(assets, /IPHONEOS_DEPLOYMENT_TARGET/);
  assert.match(assets, /CFBundleDisplayName/);
  assert.match(validator, /release\.bundleId, capacitor\.appId/);
  assert.match(validator, /icon\.readUInt32BE\(16\)/);
  assert.match(validator, /metadata\.promotionalText\.length/);
  assert.match(validator, /metadata\.keywords\.length/);
  assert.match(validator, /screenshots\.maximumScreenshots/);
  assert.match(validator, /fotografías ficticias/i);

  assert.match(privacyManifest, /<key>NSPrivacyTracking<\/key>\s*<false\/>/);
  assert.match(privacyManifest, /<key>NSPrivacyTrackingDomains<\/key>\s*<array\/>/);
  assert.match(privacyManifest, /<key>NSPrivacyCollectedDataTypes<\/key>\s*<array\/>/);
  assert.match(privacyManifest, /<key>NSPrivacyAccessedAPITypes<\/key>\s*<array\/>/);
  assert.match(privacyPage, /No recopilamos datos personales/);
  assert.match(privacyPage, /procesa.*directamente en tu dispositivo/s);
  assert.match(supportPage, /github\.com\/agusgonbel-code\/Photomosaic\/issues\/new/);
  assert.match(workflow, /PrivacyInfo\.xcprivacy/);
  assert.match(workflow, /plutil -lint/);
  assert.match(workflow, /-configuration Release/);
  assert.match(workflow, /CFBundleShortVersionString/);
  assert.match(workflow, /MinimumOSVersion/);
});
