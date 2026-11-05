// Genera todas las páginas del sitio a partir de destinos.json.
// Uso: node _build/build.mjs
//
// Para cambiar un texto de un destino, edita destinos.json y vuelve a generar.
// Para cambiar el menú o el pie de página, edita encabezado() y pie() aquí.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirBuild = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirBuild, '..');
const destinos = JSON.parse(fs.readFileSync(path.join(dirBuild, 'destinos.json'), 'utf8'));
const medidas = JSON.parse(fs.readFileSync(path.join(dirBuild, 'imagenes.json'), 'utf8'));

const ZONAS = [
  { id: 'cahuita', nombre: 'Cahuita', texto: 'Pueblo pesquero con arrecife de coral, parque nacional y la música del calipso.' },
  { id: 'puerto-viejo', nombre: 'Puerto Viejo y Cocles', texto: 'El corazón afrocaribeño de la ruta, con sus playas y sus primeros caminos.' },
  { id: 'manzanillo', nombre: 'Punta Uva, Manzanillo y Gandoca', texto: 'Refugio de vida silvestre, comunidades costeras y la laguna cerca de la frontera con Panamá.' },
];

const TEMAS = {
  naturaleza: { nombre: 'Naturaleza', texto: 'Arrecifes, bosque costero y laguna', foto: 'd5/3' },
  cultura: { nombre: 'Cultura viva', texto: 'Calipso, memoria y comunidad', foto: 'd12/1' },
  historia: { nombre: 'Historia', texto: 'Naufragios y caminos antiguos', foto: 'd7/2' },
};

const zonaDe = (id) => ZONAS.find((z) => z.id === id);
const porZona = (id) => destinos.filter((d) => d.zona === id).sort((a, b) => a.orden - b.orden);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function foto(clave, tam, alt, base, extra = '') {
  const [w, h] = medidas[`${clave}-${tam}`];
  return `<img src="${base}assets/img/${clave}-${tam}.webp" width="${w}" height="${h}" alt="${esc(alt)}" ${extra}>`;
}

const LOGO = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#c8431f" d="M16 1C9.4 1 4 6.3 4 12.9 4 21.6 16 31 16 31s12-9.4 12-18.1C28 6.3 22.6 1 16 1Z"/><circle cx="16" cy="13" r="7" fill="#fbf6ec"/><path fill="#0e7c7b" d="M9.3 14.6c2.2-1.7 4.4-1.7 6.7 0s4.5 1.7 6.7 0c-.7 3.3-3.4 5.4-6.7 5.4s-6-2.1-6.7-5.4Z"/></svg>';

const CORREO = 'jorge_zamora28@outlook.com';

function encabezado(base, actual) {
  const enlace = (href, texto, id, clase = '') =>
    `<a href="${base}${href}"${clase ? ` class="${clase}"` : ''}${actual === id ? ' aria-current="page"' : ''}>${texto}</a>`;
  return `<a class="saltar" href="#contenido">Saltar al contenido</a>
<header class="barra">
  <div class="wrap barra__fila">
    <a class="logo" href="${base}index.html">${LOGO}Ruta Caribe Sur</a>
    <button class="menu-boton" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><i class="bi bi-list" aria-hidden="true"></i></button>
    <nav class="menu" id="menu" aria-label="Principal">
      ${enlace('destinos.html', 'Destinos', 'destinos')}
      ${enlace('mapa.html', 'Mapa', 'mapa')}
      ${enlace('galeria.html', 'Galería', 'galeria')}
      ${enlace('planifica.html', 'Planifica tu visita', 'planifica', 'menu__cta')}
    </nav>
  </div>
</header>`;
}

function pie(base) {
  return `<footer class="pie">
  <div class="wrap pie__fila">
    <div class="pie__marca">
      <a class="logo" href="${base}index.html">${LOGO}Ruta Caribe Sur</a>
      <p>Descubre el patrimonio natural, cultural e histórico del Caribe Sur de Costa Rica a través de una ruta diseñada para explorar sus destinos más emblemáticos.</p>
    </div>
    <div>
      <h2>Explora</h2>
      <ul>
        <li><a href="${base}destinos.html">Destinos</a></li>
        <li><a href="${base}mapa.html">Mapa</a></li>
        <li><a href="${base}galeria.html">Galería</a></li>
        <li><a href="${base}planifica.html">Planifica tu visita</a></li>
      </ul>
    </div>
    <div>
      <h2>Zonas</h2>
      <ul>
        ${ZONAS.map((z) => `<li><a href="${base}destinos.html?zona=${z.id}">${z.nombre}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div>
      <h2>Proyecto</h2>
      <ul>
        <li>Universidad de Costa Rica</li>
        <li>TC-598</li>
        <li>CATCCAS</li>
      </ul>
      <h2 class="pie__contacto">Contacto</h2>
      <a class="pie__correo" href="mailto:${CORREO}">${CORREO}</a>
    </div>
  </div>
  <div class="pie__final">
    <div class="wrap">© 2026 Ruta Caribe Sur · Universidad de Costa Rica · Desarrollado por Jorge Zamora Lopez</div>
  </div>
</footer>`;
}

function pagina({ base = '', actual = '', titulo, descripcion, cabezaExtra = '', cuerpo, scripts = [] }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descripcion)}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descripcion)}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#0a4c50">
  <link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Nunito+Sans:wght@400;700;800&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">${cabezaExtra}
  <link rel="stylesheet" href="${base}assets/css/estilos.css">
</head>
<body>
${encabezado(base, actual)}
<main id="contenido">
${cuerpo}
</main>
${pie(base)}
${[...scripts, `${base}assets/js/sitio.js`].map((s) => `<script src="${s}"></script>`).join('\n')}
</body>
</html>
`;
}

const urlDestino = (d, base = '') => `${base}destinos/${d.slug}.html`;
const etiquetaTema = (d) => `<span class="etiqueta etiqueta--${d.tema}">${TEMAS[d.tema].nombre}</span>`;

function tarjeta(d, base, nivel = 'h3') {
  return `<article class="tarjeta" data-tema="${d.tema}" data-zona="${d.zona}" data-acceso="${d.acceso}">
  <a href="${urlDestino(d, base)}">
    <div class="tarjeta__foto">
      ${foto(d.portada, 'sm', d.titulo, base, 'loading="lazy"')}
      <span class="pin pin--${d.tema}">${d.n}</span>
    </div>
    <div class="tarjeta__cuerpo">
      <div class="etiquetas">${etiquetaTema(d)}<span class="etiquetas__zona">${zonaDe(d.zona).nombre}</span></div>
      <${nivel}>${esc(d.titulo)}</${nivel}>
      <p>${esc(d.resumen)}</p>
      <ul class="tarjeta__datos">
        <li><i class="bi bi-clock" aria-hidden="true"></i>${esc(d.horarioCorto)}</li>
        <li><i class="bi bi-ticket-perforated" aria-hidden="true"></i>${esc(d.ingreso)}</li>
      </ul>
    </div>
  </a>
</article>`;
}

// ---------- Inicio ----------

function inicio() {
  const collage = [
    ['d5/3', 'Persona caminando por un sendero de madera en medio del bosque', 'parque-nacional-cahuita', 'Parque Nacional Cahuita'],
    ['d12/1', 'Mural colorido de la Casa de la Cultura y el Calipso de Cahuita', 'casa-cultura-walter-ferguson', 'Casa Walter Ferguson'],
    ['d13/2', 'Lanchón oxidado con un árbol creciendo encima, frente a la playa', 'lanchon-de-puerto-viejo', 'Lanchón de Puerto Viejo'],
  ];
  const gratis = destinos.filter((d) => /gratis|libre/i.test(d.ingreso)).length;
  const accesibles = destinos.filter((d) => d.acceso === 'si').length;

  const cuerpo = `<section class="portada">
  <div class="wrap">
    <div class="portada__fila">
      <div>
        <span class="antetitulo">Caribe Sur · Costa Rica</span>
        <h1>Un recorrido por la naturaleza, la historia y la cultura del Caribe Sur</h1>
        <p class="portada__texto">Descubre 13 destinos donde la naturaleza, la historia y la cultura se unen en una experiencia única.</p>
        <div class="portada__acciones">
          <a class="boton" href="destinos.html">Ver los destinos <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
          <a class="boton boton--borde" href="mapa.html"><i class="bi bi-map" aria-hidden="true"></i> Abrir el mapa</a>
        </div>
      </div>
      <div class="collage">
        ${collage.map(([c, alt, slug, nombre], i) => `<a href="destinos/${slug}.html">${foto(c, i === 0 ? 'lg' : 'sm', alt, '', i === 0 ? 'fetchpriority="high"' : '')}<span>${nombre}</span></a>`).join('\n        ')}
      </div>
    </div>
    <div class="datos">
      <div><b>${destinos.length}</b><span>destinos en la ruta</span></div>
      <div><b>${ZONAS.length}</b><span>zonas, de Cahuita a Gandoca</span></div>
      <div><b>${gratis}</b><span>con ingreso libre o contribución voluntaria</span></div>
      <div><b>${accesibles}</b><span>con accesos para personas con discapacidad</span></div>
    </div>
  </div>
</section>

<section class="seccion seccion--arena">
  <div class="wrap">
    <div class="seccion__cabeza">
      <h2>¿Qué te gustaría vivir?</h2>
      <p>Empieza por lo que más te llama la atención.</p>
    </div>
    <div class="temas">
      ${Object.entries(TEMAS).map(([id, t]) => {
        const n = destinos.filter((d) => d.tema === id).length;
        return `<a class="tema" href="destinos.html?tema=${id}">
        ${foto(t.foto, 'lg', '', '', 'loading="lazy"')}
        <div><h3>${t.nombre}</h3><p>${t.texto} · ${n} destinos</p></div>
      </a>`;
      }).join('\n      ')}
    </div>
  </div>
</section>

<section class="seccion">
  <div class="wrap">
    <div class="seccion__cabeza">
      <h2>La ruta, de norte a sur</h2>
      <p>Los destinos están agrupados por zona para que aproveches mejor cada día. El número es el mismo que verás en el mapa.</p>
    </div>
    <div class="zonas">
      ${ZONAS.map((z, i) => `<div class="zona">
        <span class="zona__norte">Zona ${i + 1}</span>
        <h3>${z.nombre}</h3>
        <p class="zona__texto">${z.texto}</p>
        <ul class="paradas">
          ${porZona(z.id).map((d) => `<li><a href="${urlDestino(d)}"><span class="pin pin--${d.tema}">${d.n}</span><span>${esc(d.titulo)}</span></a></li>`).join('\n          ')}
        </ul>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="seccion seccion--arena">
  <div class="wrap">
    <div class="banda">
      <div class="banda__texto">
        <h2>Prepara tu visita</h2>
        <p>Consulta cómo llegar, compara horarios y revisa qué lugares necesitan registro previo o guía local.</p>
        <a class="boton" href="planifica.html">Planifica tu visita <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </div>
      ${foto('d1/5', 'lg', 'Visitantes en el mirador de Manzanillo, junto a una baranda pintada de verde, amarillo y rojo', '', 'loading="lazy"')}
    </div>
  </div>
</section>

<section class="seccion">
  <div class="wrap">
    <div class="seccion__cabeza">
      <h2>La ruta en imágenes</h2>
    </div>
    <div class="tira">
      ${['d2/4', 'd3/1', 'd8/2', 'd9/2', 'd13/4'].map((c) => foto(c, 'sm', '', '', 'loading="lazy"')).join('\n      ')}
    </div>
    <p><a class="enlace-flecha" href="galeria.html">Ver toda la galería <i class="bi bi-arrow-right" aria-hidden="true"></i></a></p>
  </div>
</section>`;

  return pagina({
    titulo: 'Ruta Caribe Sur · Destinos del Caribe Sur de Costa Rica',
    descripcion: 'Guía de 13 destinos naturales, culturales e históricos del Caribe Sur de Costa Rica: Cahuita, Puerto Viejo, Manzanillo y Gandoca.',
    cuerpo,
  });
}

// ---------- Listado de destinos ----------

function listado() {
  const orden = ZONAS.flatMap((z) => porZona(z.id));
  const cuerpo = `<div class="cabecera wrap">
  <h1>Destinos</h1>
  <p>Trece lugares para conocer el Caribe Sur, ordenados de norte a sur. Filtra por lo que te interesa.</p>
</div>
<section class="seccion seccion--junta">
  <div class="wrap">
    <div class="filtros">
      <div class="filtros__grupo" role="group" aria-label="Filtrar por tema">
        <button class="chip" type="button" data-tema-filtro="todos" aria-pressed="true">Todos</button>
        ${Object.entries(TEMAS).map(([id, t]) => `<button class="chip" type="button" data-tema-filtro="${id}" aria-pressed="false">${t.nombre}</button>`).join('\n        ')}
      </div>
      <select class="selector" id="filtro-zona" aria-label="Filtrar por zona">
        <option value="todas">Todas las zonas</option>
        ${ZONAS.map((z) => `<option value="${z.id}">${z.nombre}</option>`).join('\n        ')}
      </select>
      <label class="casilla"><input type="checkbox" id="filtro-acceso"> Accesible</label>
    </div>
    <p class="resultado" id="resultado" aria-live="polite">${destinos.length} destinos</p>
    <div class="tarjetas">
      ${orden.map((d) => tarjeta(d, '', 'h2')).join('\n      ')}
    </div>
    <div class="sin-resultados" id="sin-resultados" hidden>
      <p>Ningún destino coincide con esos filtros.</p>
      <p><button class="boton boton--borde" type="button" id="limpiar">Quitar filtros</button></p>
    </div>
  </div>
</section>`;
  return pagina({
    actual: 'destinos',
    titulo: 'Destinos · Ruta Caribe Sur',
    descripcion: 'Los 13 destinos de la Ruta Caribe Sur, con filtros por tema, zona y accesibilidad.',
    cuerpo,
    scripts: ['assets/js/destinos.js'],
  });
}

// ---------- Página de cada destino ----------

const GLIGHTBOX_CSS = '\n  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/css/glightbox.min.css">';
const GLIGHTBOX_JS = 'https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/js/glightbox.min.js';

function paginaDestino(d) {
  const base = '../';
  const total = d.fotos.length;
  const anterior = destinos.find((x) => x.n === d.n - 1);
  const siguiente = destinos.find((x) => x.n === d.n + 1);
  const cerca = porZona(d.zona)
    .filter((x) => x.n !== d.n)
    .sort((a, b) => Math.abs(a.orden - d.orden) - Math.abs(b.orden - d.orden))
    .slice(0, 3);
  const nombreDistinto = d.nombre.replace(/\.$/, '') !== d.titulo;
  const sello = {
    si: '<p class="sello sello--si"><i class="bi bi-universal-access" aria-hidden="true"></i>Con accesos para personas con discapacidad</p>',
    no: '<p class="sello sello--no"><i class="bi bi-info-circle" aria-hidden="true"></i>Sin condiciones de accesibilidad</p>',
    'sin-dato': '',
  }[d.acceso];

  const cuerpo = `<div class="wrap">
  <nav class="migas" aria-label="Ruta de navegación">
    <ol>
      <li><a href="${base}index.html">Inicio</a></li>
      <li><a href="${base}destinos.html">Destinos</a></li>
      <li aria-current="page">${esc(d.titulo)}</li>
    </ol>
  </nav>

  <div class="destino-cabeza">
    <div class="etiquetas"><span class="pin pin--${d.tema}">${d.n}</span>${etiquetaTema(d)}<span class="etiquetas__zona">${zonaDe(d.zona).nombre}</span></div>
    <h1>${esc(d.titulo)}</h1>
    <p>${esc(d.lema || d.resumen)}</p>
  </div>

  <div class="mosaico" data-fotos="${total}">
    ${d.fotos.map((c, i) => `<a class="foto" href="${base}assets/img/${c}-lg.webp" data-gallery="destino" data-title="${esc(d.titulo)}">${foto(c, i === 0 ? 'lg' : 'sm', `${d.titulo}, foto ${i + 1} de ${total}`, base, i === 0 ? 'fetchpriority="high"' : 'loading="lazy"')}</a>`).join('\n    ')}
    <button class="mosaico__todas" type="button"><i class="bi bi-images" aria-hidden="true"></i>Ver ${total} fotos</button>
  </div>

  <div class="destino-fila">
    <div>
      <section class="bloque">
        <h2>Conoce este lugar</h2>
        ${d.intro.map((p, i) => `<p${i === 0 ? ' class="bloque__entrada"' : ''}>${esc(p)}</p>`).join('\n        ')}
      </section>

      <div class="bloque dos-listas">
        <section class="lista-caja lista-caja--mar">
          <h2>Qué disfrutar</h2>
          <ul>${d.turistico.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>
        <section class="lista-caja lista-caja--mango">
          <h2>Valor cultural</h2>
          <ul>${d.cultural.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>
      </div>

      <section class="bloque">
        <h2>Su historia y su entorno</h2>
        ${d.historia.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}
      </section>

      <section class="bloque" id="llegar">
        <h2>Cómo llegar</h2>
        <ol class="pasos">${d.llegar.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="mapa-embebido">
          <iframe src="${esc(d.mapa)}" title="Mapa de ubicación de ${esc(d.titulo)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>

      <section class="bloque">
        <h2>Servicios cercanos</h2>
        <ul class="servicios">${d.servicios.map((x) => `<li>${esc(x.replace(/\.$/, ''))}</li>`).join('')}</ul>
      </section>
    </div>

    <aside aria-label="Datos para tu visita">
      <div class="visita">
        <h2>Datos para tu visita</h2>
        ${sello}
        <dl>
          <dt><i class="bi bi-clock" aria-hidden="true"></i>Horario</dt>
          <dd>${esc(d.horario)}</dd>
          <dt><i class="bi bi-ticket-perforated" aria-hidden="true"></i>Ingreso y accesos</dt>
          <dd>${esc(d.adicional)}</dd>
          <dt><i class="bi bi-geo-alt" aria-hidden="true"></i>Ubicación</dt>
          <dd>${esc(d.ubicacion)}</dd>${nombreDistinto ? `
          <dt><i class="bi bi-signpost" aria-hidden="true"></i>Nombre completo</dt>
          <dd>${esc(d.nombre)}</dd>` : ''}
        </dl>
        <a class="boton boton--ancho" href="https://www.google.com/maps/dir/?api=1&amp;destination=${d.lat},${d.lng}" target="_blank" rel="noopener"><i class="bi bi-sign-turn-right" aria-hidden="true"></i>Abrir indicaciones</a>
      </div>
    </aside>
  </div>

  <nav class="paginacion" aria-label="Otros destinos de la ruta">
    ${anterior ? `<a href="${anterior.slug}.html"><small>← Destino ${anterior.n}</small>${esc(anterior.titulo)}</a>` : ''}
    ${siguiente ? `<a class="paginacion__siguiente" href="${siguiente.slug}.html"><small>Destino ${siguiente.n} →</small>${esc(siguiente.titulo)}</a>` : ''}
  </nav>
</div>

<section class="seccion">
  <div class="wrap">
    <div class="seccion__cabeza">
      <h2>También en ${zonaDe(d.zona).nombre}</h2>
    </div>
    <div class="tarjetas">
      ${cerca.map((x) => tarjeta(x, base)).join('\n      ')}
    </div>
  </div>
</section>`;

  return pagina({
    base,
    actual: 'destinos',
    titulo: `${d.titulo} · Ruta Caribe Sur`,
    descripcion: `${d.resumen} Horario, cómo llegar y fotos de ${d.titulo}.`,
    cabezaExtra: GLIGHTBOX_CSS,
    cuerpo,
    scripts: [GLIGHTBOX_JS, `${base}assets/js/fotos.js`],
  });
}

// ---------- Mapa ----------

function mapa() {
  const datos = destinos.map((d) => ({
    n: d.n, titulo: d.titulo, resumen: d.resumen, tema: d.tema, lat: d.lat, lng: d.lng,
    foto: `assets/img/${d.portada}-sm.webp`, url: urlDestino(d),
  }));
  const cuerpo = `<div class="cabecera wrap">
  <h1>Mapa de la ruta</h1>
  <p>Toca un número para ver una vista previa del destino y entrar a su página.</p>
</div>
<section class="seccion seccion--junta">
  <div class="wrap">
    <ul class="leyenda" aria-label="Colores del mapa">
      ${Object.entries(TEMAS).map(([id, t]) => `<li><span class="pin pin--${id}"></span>${t.nombre}</li>`).join('\n      ')}
    </ul>
    <div class="mapa-fila">
      <div class="mapa-lista">
        ${ZONAS.map((z) => `<h2>${z.nombre}</h2>
        <ul>
          ${porZona(z.id).map((d) => `<li><button type="button" data-n="${d.n}"><span class="pin pin--${d.tema}">${d.n}</span>${esc(d.titulo)}</button></li>`).join('\n          ')}
        </ul>`).join('\n        ')}
      </div>
      <div id="mapa" role="region" aria-label="Mapa interactivo de los destinos"></div>
    </div>
  </div>
</section>
<script type="application/json" id="datos-mapa">${JSON.stringify(datos).replace(/</g, '\\u003c')}</script>`;
  return pagina({
    actual: 'mapa',
    titulo: 'Mapa · Ruta Caribe Sur',
    descripcion: 'Mapa interactivo con los 13 destinos de la Ruta Caribe Sur.',
    cabezaExtra: '\n  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">',
    cuerpo,
    scripts: ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'assets/js/mapa.js'],
  });
}

// ---------- Galería ----------

function galeria() {
  const orden = ZONAS.flatMap((z) => porZona(z.id));
  const items = orden.flatMap((d) => d.fotos.map((c, i) =>
    `<a class="foto-visible" href="assets/img/${c}-lg.webp" data-zona="${d.zona}" data-destino="${d.slug}" data-gallery="ruta" data-title="${esc(d.titulo)}">${foto(c, 'sm', `${d.titulo}, foto ${i + 1}`, '', 'loading="lazy"')}<span>${esc(d.corto)}</span></a>`));
  const cuerpo = `<div class="cabecera wrap">
  <h1>Galería</h1>
  <p>Mira la ruta en imágenes y filtra por zona o por destino.</p>
</div>
<section class="seccion seccion--junta">
  <div class="wrap">
    <div class="filtros">
      <div class="filtros__grupo" role="group" aria-label="Filtrar por zona">
        <button class="chip" type="button" data-zona-filtro="todas" aria-pressed="true">Todas</button>
        ${ZONAS.map((z) => `<button class="chip" type="button" data-zona-filtro="${z.id}" aria-pressed="false">${z.nombre}</button>`).join('\n        ')}
      </div>
      <select class="selector" id="filtro-destino" aria-label="Filtrar por destino">
        <option value="todos">Todos los destinos</option>
        ${orden.map((d) => `<option value="${d.slug}" data-zona="${d.zona}">${esc(d.corto)}</option>`).join('\n        ')}
      </select>
    </div>
    <p class="resultado" id="resultado" aria-live="polite">${items.length} fotos</p>
    <div class="galeria">
      ${items.join('\n      ')}
    </div>
  </div>
</section>`;
  return pagina({
    actual: 'galeria',
    titulo: 'Galería · Ruta Caribe Sur',
    descripcion: 'Fotografías de los 13 destinos de la Ruta Caribe Sur.',
    cabezaExtra: GLIGHTBOX_CSS,
    cuerpo,
    scripts: [GLIGHTBOX_JS, 'assets/js/galeria.js'],
  });
}

// ---------- Planifica ----------

function planifica() {
  const orden = ZONAS.flatMap((z) => porZona(z.id));
  const accesoTexto = { si: 'Sí', no: 'No', 'sin-dato': 'Sin dato' };
  const enlace = (n) => {
    const d = destinos.find((x) => x.n === n);
    return `<a href="${urlDestino(d)}">${esc(d.corto)}</a>`;
  };
  const consejos = [
    ['bi-pencil-square', 'Registro previo', `${enlace(4)}, ${enlace(5)} y ${enlace(6)} piden registrarse y atienden de 8:00 a.m. a 4:00 p.m.`],
    ['bi-telephone', 'Consulta antes de ir', `${enlace(12)} no tiene horario fijo. En ${enlace(9)}, los horarios se consultan con la comunidad.`],
    ['bi-person-check', 'Guía local', `Para recorrer ${enlace(8)} hay que contactar a guías locales autorizados.`],
    ['bi-moon-stars', 'Mejor de día', `No se recomienda visitar de noche ${enlace(8)} ni ${enlace(11)}.`],
    ['bi-water', 'Clima y marea', `En ${enlace(10)}, el acceso es a pie y conviene considerar el clima y la marea.`],
    ['bi-life-preserver', 'Mar con cuidado', `Alrededor de ${enlace(2)} hay oleaje fuerte. Haz snorkel siguiendo medidas de seguridad.`],
  ];

  const cuerpo = `<div class="cabecera wrap">
  <h1>Planifica tu visita</h1>
  <p>Lo esencial para organizar tu recorrido por el Caribe Sur.</p>
</div>

<section class="seccion seccion--junta">
  <div class="wrap">
    <div class="seccion__cabeza"><h2>Cómo llegar desde San José</h2></div>
    <ol class="trayecto">
      <li><span>San José</span></li>
      <li><span>Siquirres</span></li>
      <li><span>Limón</span></li>
      <li><span>Caribe Sur</span></li>
    </ol>
    <div class="tramos">
      <div class="tramo"><h3>Hacia Cahuita</h3><p>Desde Limón sigue directo a Cahuita, la primera zona de la ruta.</p></div>
      <div class="tramo"><h3>Hacia Puerto Viejo y Cocles</h3><p>Continúa de Limón a Puerto Viejo. Cocles se recorre desde ahí con acceso peatonal.</p></div>
      <div class="tramo"><h3>Hacia Manzanillo y Gandoca</h3><p>Desde Puerto Viejo: Manzanillo está a 13 km (20–30 min) y la laguna de Gandoca a 16–20 km (35–45 min).</p></div>
    </div>
  </div>
</section>

<section class="seccion seccion--arena">
  <div class="wrap">
    <div class="seccion__cabeza"><h2>Antes de salir</h2></div>
    <ul class="consejos">
      ${consejos.map(([i, t, x]) => `<li><i class="bi ${i}" aria-hidden="true"></i><div><b>${t}</b><span>${x}</span></div></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="seccion">
  <div class="wrap">
    <div class="seccion__cabeza">
      <h2>Compara los destinos</h2>
      <p>Horarios, ingreso y accesibilidad de un vistazo. Confirma los detalles en la página de cada destino.</p>
    </div>
    <div class="tabla-caja">
      <table class="tabla">
        <thead><tr><th scope="col">Destino</th><th scope="col">Horario</th><th scope="col">Ingreso</th><th scope="col">Accesible</th></tr></thead>
        <tbody>
          ${orden.map((d) => `<tr><th scope="row"><a href="${urlDestino(d)}"><span class="pin pin--${d.tema}">${d.n}</span>${esc(d.corto)}</a></th><td data-etiqueta="Horario">${esc(d.horarioCorto)}</td><td data-etiqueta="Ingreso">${esc(d.ingreso)}</td><td data-etiqueta="Accesible">${accesoTexto[d.acceso]}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="seccion seccion--arena">
  <div class="wrap">
    <div class="seccion__cabeza">
      <h2>¿Tienes alguna pregunta?</h2>
      <p>Escríbenos si tienes dudas sobre la ruta o encontraste un dato que debamos corregir.</p>
    </div>
    <a class="boton" href="mailto:${CORREO}"><i class="bi bi-envelope" aria-hidden="true"></i>Escribir un correo</a>
  </div>
</section>`;
  return pagina({
    actual: 'planifica',
    titulo: 'Planifica tu visita · Ruta Caribe Sur',
    descripcion: 'Cómo llegar al Caribe Sur, recomendaciones y comparación de horarios, ingreso y accesibilidad de los 13 destinos.',
    cuerpo,
  });
}

// Mantiene funcionando los enlaces antiguos (destino1.html ... destino13.html).
function redireccion(d) {
  const url = urlDestino(d);
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${esc(d.titulo)} · Ruta Caribe Sur</title>
  <meta http-equiv="refresh" content="0; url=${url}">
  <link rel="canonical" href="${url}">
</head>
<body><p>Esta página se movió a <a href="${url}">${esc(d.titulo)}</a>.</p></body>
</html>
`;
}

const escribir = (rel, html) => fs.writeFileSync(path.join(root, rel), html);

escribir('index.html', inicio());
escribir('destinos.html', listado());
escribir('mapa.html', mapa());
escribir('galeria.html', galeria());
escribir('planifica.html', planifica());
fs.mkdirSync(path.join(root, 'destinos'), { recursive: true });
for (const d of destinos) {
  escribir(`destinos/${d.slug}.html`, paginaDestino(d));
  escribir(`destino${d.n}.html`, redireccion(d));
}
console.log(`Listo: 5 páginas, ${destinos.length} destinos y ${destinos.length} redirecciones.`);
