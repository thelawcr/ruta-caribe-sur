# Cómo mantener el sitio

Las páginas `.html` se generan automáticamente. No las edites a mano, porque se
sobrescriben. Necesitas [Node.js](https://nodejs.org).

## Cambiar un texto, horario o dato de un destino

1. Edita `_build/destinos.json`.
2. Desde la carpeta del sitio, ejecuta `node _build/build.mjs`.

## Cambiar el menú, el pie o el diseño de una página

- Estructura: `_build/build.mjs`.
- Colores y estilos: `assets/css/estilos.css`. Los colores están al inicio del archivo.

Después de cambiar `build.mjs`, vuelve a generar el sitio.

## Agregar o cambiar fotos

1. Coloca la foto en `imgs/D<número>/`.
2. Agrega su nombre a la lista `fotos` del destino en `destinos.json`, por ejemplo `d5/6`.
3. Dentro de `_build`, ejecuta `npm install` y luego `npm run imagenes`.
4. Vuelve a generar el sitio.

## Ver el sitio en tu computadora

Ejecuta `node _build/serve.mjs` y abre http://localhost:8080

## Qué publicar

Publica los `.html`, la carpeta `destinos` y la carpeta `assets`.
No hace falta publicar `imgs`, `_build`, `.claude` ni `_respaldo-sitio-original`.
