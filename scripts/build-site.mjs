import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const publicFiles = [
  'index.html', 'styles.css', 'app.js', 'mosaic-engine.js', 'shape-engine.js', 'generation-controller.js',
  'service-worker.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of publicFiles) {
  const source = path.join(root, file);
  const destination = path.join(dist, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination);
}
await writeFile(path.join(dist, '.nojekyll'), '');

const index = await readFile(path.join(dist, 'index.html'), 'utf8');
const worker = await readFile(path.join(dist, 'service-worker.js'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(dist, 'manifest.webmanifest'), 'utf8'));
for (const required of ['app.js', 'mosaic-engine.js', 'shape-engine.js', 'generation-controller.js', 'styles.css', 'manifest.webmanifest']) {
  if (!index.includes(required)) throw new Error(`index.html no referencia ${required}`);
}
for (const required of publicFiles.filter(file => file !== 'service-worker.js')) {
  const reference = required === 'index.html' ? './index.html' : `./${required}`;
  if (!worker.includes(reference) && !['icons/icon-192.png', 'icons/icon-512.png'].includes(required)) {
    throw new Error(`service-worker.js no incluye ${reference}`);
  }
}
if (manifest.scope !== './' || manifest.start_url !== './') {
  throw new Error('El manifiesto no es portable a GitHub Pages');
}
console.log(`Sitio preparado: ${publicFiles.length} recursos públicos.`);
