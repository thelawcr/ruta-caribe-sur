// Vista ampliada de las fotos en las páginas de destino.
(function () {
  const visor = GLightbox({ selector: '.foto', touchNavigation: true, loop: true });
  const boton = document.querySelector('.mosaico__todas');
  if (boton) boton.addEventListener('click', () => visor.open());
})();
