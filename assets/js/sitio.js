// Menú móvil: se usa en todas las páginas.
(function () {
  const boton = document.querySelector('.menu-boton');
  const menu = document.getElementById('menu');
  if (!boton || !menu) return;

  function alternar(abrir) {
    menu.classList.toggle('abierto', abrir);
    boton.setAttribute('aria-expanded', String(abrir));
    boton.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    boton.querySelector('i').className = abrir ? 'bi bi-x-lg' : 'bi bi-list';
  }

  boton.addEventListener('click', () => alternar(!menu.classList.contains('abierto')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') alternar(false); });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !boton.contains(e.target)) alternar(false);
  });
})();
