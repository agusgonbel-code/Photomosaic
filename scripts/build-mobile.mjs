import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const destination = path.join(root, 'www');
const files = [
  'index.html', 'styles.css', 'custom-shape.css', 'app.js', 'selection-controls.js',
  'mosaic-engine.js', 'shape-engine.js', 'custom-shape-ui.js', 'generation-controller.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'
];

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const file of files) {
  const output = path.join(destination, file);
  await mkdir(path.dirname(output), { recursive: true });
  await cp(path.join(root, file), output);
}

// La PWA conserva su service worker. El contenedor nativo lleva todos los
// recursos empaquetados y no debe intentar registrar ni mezclar una caché web.
const appPath = path.join(destination, 'app.js');
let app = await readFile(appPath, 'utf8');
const registration = "if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));";
if (!app.includes(registration)) throw new Error('No se encontró el registro PWA esperado');
app = app.replace(
  registration,
  "if((location.protocol==='http:'||location.protocol==='https:')&&'serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));"
);
await writeFile(appPath, app, 'utf8');

console.log(`Build móvil listo: ${files.length} recursos en www/`);

