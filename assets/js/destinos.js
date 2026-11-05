// Filtros de la página de destinos. La selección queda en la dirección
// (por ejemplo destinos.html?tema=cultura) para poder compartirla.
(function () {
  const tarjetas = [...document.querySelectorAll('.tarjeta')];
  const chips = [...document.querySelectorAll('[data-tema-filtro]')];
  const zona = document.getElementById('filtro-zona');
  const acceso = document.getElementById('filtro-acceso');
  const resultado = document.getElementById('resultado');
  const vacio = document.getElementById('sin-resultados');
  const params = new URLSearchParams(location.search);
  let tema = params.get('tema') || 'todos';

  if (!chips.some((c) => c.dataset.temaFiltro === tema)) tema = 'todos';
  if ([...zona.options].some((o) => o.value === params.get('zona'))) zona.value = params.get('zona');
  acceso.checked = params.get('acceso') === 'si';

  function aplicar(guardar) {
    let visibles = 0;
    tarjetas.forEach((t) => {
      const ver = (tema === 'todos' || t.dataset.tema === tema)
        && (zona.value === 'todas' || t.dataset.zona === zona.value)
        && (!acceso.checked || t.dataset.acceso === 'si');
      t.hidden = !ver;
      if (ver) visibles++;
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.temaFiltro === tema)));
    resultado.textContent = visibles === 1 ? '1 destino' : `${visibles} destinos`;
    vacio.hidden = visibles > 0;

    if (guardar) {
      const q = new URLSearchParams();
      if (tema !== 'todos') q.set('tema', tema);
      if (zona.value !== 'todas') q.set('zona', zona.value);
      if (acceso.checked) q.set('acceso', 'si');
      const texto = q.toString();
      history.replaceState(null, '', texto ? `?${texto}` : location.pathname);
    }
  }

  chips.forEach((c) => c.addEventListener('click', () => { tema = c.dataset.temaFiltro; aplicar(true); }));
  zona.addEventListener('change', () => aplicar(true));
  acceso.addEventListener('change', () => aplicar(true));
  document.getElementById('limpiar').addEventListener('click', () => {
    tema = 'todos';
    zona.value = 'todas';
    acceso.checked = false;
    aplicar(true);
  });
  aplicar(false);
})();
