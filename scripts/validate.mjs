import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'index.html',
  'style.css',
  'app.js',
  'fotoPerfil.jpg',
  'favicon.svg',
  'site.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'gracias.html',
  '404.html',
  'netlify.toml',
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const file of requiredFiles) {
  check(existsSync(join(root, file)), `Falta el archivo requerido: ${file}`);
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'style.css'), 'utf8');
const js = readFileSync(join(root, 'app.js'), 'utf8');

check(/<html\s+lang="es-CO">/i.test(html), 'El documento debe declarar lang="es-CO".');
check((html.match(/<h1\b/gi) ?? []).length === 1, 'La página debe tener un único h1.');
check(/<meta\s+name="description"\s+content="[^"]{70,160}"/i.test(html), 'La meta description debe tener entre 70 y 160 caracteres.');
check(/<link\s+rel="canonical"\s+href="https:\/\/anadevia\.netlify\.app\/"/i.test(html), 'Falta la URL canónica.');
check(/type="application\/ld\+json"/i.test(html), 'Faltan los datos estructurados JSON-LD.');
check(/data-netlify="true"/i.test(html), 'El formulario debe conservar la integración con Netlify Forms.');
check(!/SprignBoot|\[email(?:&|\s)*protected\]/i.test(html), 'Se encontró contenido roto o un error ortográfico conocido.');
check(!/emailjs/i.test(html + js), 'La versión anterior de EmailJS no debe seguir cargándose.');
check(/prefers-reduced-motion/.test(css), 'Falta soporte para prefers-reduced-motion.');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicatedIds = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicatedIds.length === 0, `Hay id duplicados: ${[...new Set(duplicatedIds)].join(', ')}`);

const idSet = new Set(ids);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const anchor of anchors) {
  check(idSet.has(anchor), `El enlace #${anchor} no tiene un destino existente.`);
}

for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
  check(/rel="[^"]*noopener[^"]*"/i.test(match[0]), `Enlace externo sin rel="noopener": ${match[0]}`);
}

const labels = new Set([...html.matchAll(/<label\s+for="([^"]+)"/gi)].map((match) => match[1]));
for (const match of html.matchAll(/<(input|select|textarea)\b[^>]*\sid="([^"]+)"[^>]*>/gi)) {
  const [, , id] = match;
  if (/type="hidden"/i.test(match[0])) continue;
  check(labels.has(id), `El campo #${id} no tiene un label asociado.`);
}

for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*(?:src|href)="\/([^"?#]+)"[^>]*>/gi)) {
  const localPath = match[1];
  if (!localPath || localPath.endsWith('/')) continue;
  check(existsSync(join(root, localPath)), `Recurso local inexistente: /${localPath}`);
}

const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
if (jsonLdMatch) {
  try {
    JSON.parse(jsonLdMatch[1]);
  } catch {
    failures.push('El bloque JSON-LD no contiene JSON válido.');
  }
}

if (failures.length) {
  console.error(`Validación fallida (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validación completa: ${requiredFiles.length} archivos, ${ids.length} ids y ${anchors.length} enlaces internos verificados.`);
