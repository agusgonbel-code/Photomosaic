import { execFile } from 'node:child_process';
import { copyFile, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const root = path.resolve(import.meta.dirname, '..');
const iconSource = path.join(root, 'icons', 'icon-512.png');
const iconDestination = path.join(
  root,
  'ios',
  'App',
  'App',
  'Assets.xcassets',
  'AppIcon.appiconset',
  'AppIcon-512@2x.png'
);
const privacySource = path.join(root, 'PrivacyInfo.xcprivacy');
const privacyDestination = path.join(root, 'ios', 'App', 'App', 'PrivacyInfo.xcprivacy');
const projectPath = path.join(root, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');
const infoPath = path.join(root, 'ios', 'App', 'App', 'Info.plist');
const releaseConfigPath = path.join(root, 'ios-release.json');

for (const file of [iconDestination, projectPath, infoPath]) {
  await stat(file).catch(() => {
    throw new Error('No existe el proyecto iOS. Ejecuta primero `npx cap add ios`.');
  });
}
await stat(privacySource).catch(() => {
  throw new Error('Falta PrivacyInfo.xcprivacy en la raíz del proyecto.');
});

const release = JSON.parse(await readFile(releaseConfigPath, 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(release.marketingVersion)) {
  throw new Error('marketingVersion debe tener el formato X.Y.Z.');
}
if (!Number.isInteger(release.buildNumber) || release.buildNumber < 1) {
  throw new Error('buildNumber debe ser un entero positivo.');
}
if (!/^\d+\.\d+$/.test(release.minimumIOSVersion)) {
  throw new Error('minimumIOSVersion debe tener el formato X.Y.');
}

await promisify(execFile)('sips', ['-z', '1024', '1024', iconSource, '--out', iconDestination]);
await copyFile(privacySource, privacyDestination);

let project = await readFile(projectPath, 'utf8');
const fileRef = 'A11CE0010000000000000001';
const buildRef = 'A11CE0010000000000000002';
const buildLine = `\t\t${buildRef} /* PrivacyInfo.xcprivacy in Resources */ = {isa = PBXBuildFile; fileRef = ${fileRef} /* PrivacyInfo.xcprivacy */; };\n`;
const fileLine = `\t\t${fileRef} /* PrivacyInfo.xcprivacy */ = {isa = PBXFileReference; lastKnownFileType = text.xml; path = PrivacyInfo.xcprivacy; sourceTree = "<group>"; };\n`;
const groupLine = `\t\t\t\t${fileRef} /* PrivacyInfo.xcprivacy */,\n`;
const resourceLine = `\t\t\t\t${buildRef} /* PrivacyInfo.xcprivacy in Resources */,\n`;

const addAfter = (source, anchor, addition, description) => {
  if (source.includes(addition.trim())) return source;
  if (!source.includes(anchor)) throw new Error(`No se encontró ${description} en el proyecto Xcode.`);
  return source.replace(anchor, anchor + addition);
};

project = addAfter(project, '/* Begin PBXBuildFile section */\n', buildLine, 'PBXBuildFile');
project = addAfter(project, '/* Begin PBXFileReference section */\n', fileLine, 'PBXFileReference');

if (!project.includes(groupLine.trim())) {
  const appGroup = /(\/\* App \*\/ = \{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = \(\n)/;
  if (!appGroup.test(project)) throw new Error('No se encontró el grupo App en el proyecto Xcode.');
  project = project.replace(appGroup, `$1${groupLine}`);
}
if (!project.includes(resourceLine.trim())) {
  const resources = /(\/\* Resources \*\/ = \{\n\t\t\tisa = PBXResourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = \(\n)/;
  if (!resources.test(project)) throw new Error('No se encontró la fase Resources en el proyecto Xcode.');
  project = project.replace(resources, `$1${resourceLine}`);
}

const replaceBuildSetting = (source, key, value) => {
  const expression = new RegExp(`(${key} = )[^;]+;`, 'g');
  if (!expression.test(source)) throw new Error(`No se encontró ${key} en el proyecto Xcode.`);
  return source.replace(expression, `$1${value};`);
};

project = replaceBuildSetting(project, 'MARKETING_VERSION', release.marketingVersion);
project = replaceBuildSetting(project, 'CURRENT_PROJECT_VERSION', String(release.buildNumber));
project = replaceBuildSetting(project, 'IPHONEOS_DEPLOYMENT_TARGET', release.minimumIOSVersion);

await writeFile(projectPath, project, 'utf8');

let info = await readFile(infoPath, 'utf8');
const setPlistString = (source, key, value) => {
  const expression = new RegExp(`(<key>${key}</key>\\s*<string>)[^<]*(</string>)`);
  if (!expression.test(source)) throw new Error(`No se encontró ${key} en Info.plist.`);
  return source.replace(expression, `$1${value}$2`);
};

info = setPlistString(info, 'CFBundleDisplayName', release.displayName);
info = setPlistString(info, 'CFBundleShortVersionString', '$(MARKETING_VERSION)');
info = setPlistString(info, 'CFBundleVersion', '$(CURRENT_PROJECT_VERSION)');
await writeFile(infoPath, info, 'utf8');

console.log(`Recursos iOS listos: ${release.displayName} ${release.marketingVersion} (${release.buildNumber}).`);
