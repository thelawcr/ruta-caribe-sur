// Filtros de la galería: por zona y por destino.
(function () {
  const fotos = [...document.querySelectorAll('.galeria a')];
  const chips = [...document.querySelectorAll('[data-zona-filtro]')];
  const destino = document.getElementById('filtro-destino');
  const resultado = document.getElementById('resultado');
  const opciones = [...destino.options];
  let zona = 'todas';
  let visor;

  function aplicar() {
    let visibles = 0;
    fotos.forEach((f) => {
      const ver = (zona === 'todas' || f.dataset.zona === zona)
        && (destino.value === 'todos' || f.dataset.destino === destino.value);
      f.hidden = !ver;
      f.classList.toggle('foto-visible', ver);
      if (ver) visibles++;
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.zonaFiltro === zona)));
    resultado.textContent = visibles === 1 ? '1 foto' : `${visibles} fotos`;
    if (visor) visor.destroy();
    visor = GLightbox({ selector: '.foto-visible', touchNavigation: true, loop: true });
  }

  chips.forEach((c) => c.addEventListener('click', () => {
    zona = c.dataset.zonaFiltro;
    destino.value = 'todos';
    opciones.forEach((o) => { o.hidden = o.value !== 'todos' && zona !== 'todas' && o.dataset.zona !== zona; });
    aplicar();
  }));
  destino.addEventListener('change', aplicar);
  aplicar();
})();
