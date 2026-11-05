// Genera versiones livianas (WebP) de las fotos de imgs/ en assets/img/.
//   dN/1-sm.webp -> 640 px, tarjetas y miniaturas
//   dN/1-lg.webp -> 1600 px, portadas y vista ampliada
// Las fotos originales de imgs/ no se modifican.
// Uso: cd _build && npm install && npm run imagenes
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'imgs');
const out = path.join(root, 'assets', 'img');
const sizes = { sm: [640, 72], lg: [1600, 76] };
const meta = {};
let count = 0;

for (const dir of fs.readdirSync(src).filter((d) => /^D\d+$/.test(d))) {
  const target = path.join(out, dir.toLowerCase());
  fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(path.join(src, dir))) {
    const base = path.parse(file).name;
    const input = path.join(src, dir, file);
    for (const [name, [width, quality]] of Object.entries(sizes)) {
      const info = await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(path.join(target, `${base}-${name}.webp`));
      meta[`${dir.toLowerCase()}/${base}-${name}`] = [info.width, info.height];
    }
    count++;
  }
}

// Tamaños reales, para que el navegador reserve el espacio de cada foto.
fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'imagenes.json'), JSON.stringify(meta, null, 0));
console.log(`Fotos procesadas: ${count}`);
