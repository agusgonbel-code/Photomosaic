import { execFile } from 'node:child_process';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'icons', 'icon-512.png');
const destination = path.join(
  root,
  'ios',
  'App',
  'App',
  'Assets.xcassets',
  'AppIcon.appiconset',
  'AppIcon-512@2x.png'
);

await stat(destination).catch(() => {
  throw new Error('No existe el proyecto iOS. Ejecuta primero `npx cap add ios`.');
});
await promisify(execFile)('sips', ['-z', '1024', '1024', source, '--out', destination]);
console.log('Icono nativo de PhotoMosaic instalado en el proyecto iOS.');
