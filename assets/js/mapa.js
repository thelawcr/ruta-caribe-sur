// Mapa interactivo: lee los destinos del JSON incluido en la página.
(function () {
  const destinos = JSON.parse(document.getElementById('datos-mapa').textContent);
  const mapa = L.map('mapa', { scrollWheelZoom: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; colaboradores de OpenStreetMap',
    maxZoom: 18,
  }).addTo(mapa);

  const marcadores = new Map();
  const botones = [...document.querySelectorAll('.mapa-lista button')];

  function marcar(n) {
    botones.forEach((b) => b.classList.toggle('activo', Number(b.dataset.n) === n));
  }

  destinos.forEach((d) => {
    const icono = L.divIcon({
      className: 'marcador',
      html: `<span class="pin pin--${d.tema}">${d.n}</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -12],
    });
    const m = L.marker([d.lat, d.lng], { icon: icono, title: d.titulo, alt: d.titulo }).addTo(mapa);
    m.bindPopup(`<div class="globo"><img src="${d.foto}" alt="" width="220" height="120">
      <h3>${d.titulo}</h3><p>${d.resumen}</p>
      <a href="${d.url}">Ver destino <i class="bi bi-arrow-right"></i></a></div>`);
    m.on('popupopen', () => marcar(d.n));
    marcadores.set(d.n, m);
  });

  botones.forEach((b) => b.addEventListener('click', () => {
    const m = marcadores.get(Number(b.dataset.n));
    mapa.setView(m.getLatLng(), Math.max(mapa.getZoom(), 13));
    m.openPopup();
    if (window.innerWidth <= 1000) document.getElementById('mapa').scrollIntoView({ block: 'center' });
  }));

  mapa.fitBounds(destinos.map((d) => [d.lat, d.lng]), { padding: [36, 36] });
  mapa.on('focus', () => mapa.scrollWheelZoom.enable());
  mapa.on('blur', () => mapa.scrollWheelZoom.disable());
})();
