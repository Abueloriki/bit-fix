/* =========================================================
   Lógica común de las demos de Bit&Fix
   En una demo, los turnos y consultas NO se envían al negocio (es ficticio):
   se muestra cómo le llegaría el mensaje y se ofrece pedir una web así.
   ========================================================= */
(function () {
  const BITFIX_WA = '5493512002532';
  const rubro = document.body.dataset.rubro || 'negocio';

  function waLink(texto) {
    return 'https://wa.me/' + BITFIX_WA + '?text=' + encodeURIComponent(texto);
  }

  // Franja superior
  const strip = document.createElement('div');
  strip.className = 'bf-strip';
  strip.innerHTML = '<span><b>Página de ejemplo</b> hecha por Bit&amp;Fix · El negocio es ficticio</span>' +
    '<a href="' + waLink('Hola Ricardo, vi la demo de ' + rubro + ' y quiero una página así para mi negocio.') + '" target="_blank" rel="noopener">Quiero una así</a>';
  document.body.prepend(strip);

  // Ventana de vista previa
  const modal = document.createElement('div');
  modal.className = 'bf-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = '<div class="bf-modal__box">' +
    '<h3>Así le llega al negocio</h3>' +
    '<p>En la página real, este mensaje se abre en WhatsApp y le llega directo al dueño del negocio.</p>' +
    '<div class="bf-chat"><div class="bf-bubble" id="bf-msg"></div></div>' +
    '<div class="bf-modal__actions">' +
    '<a class="bf-btn bf-btn--go" id="bf-go" target="_blank" rel="noopener">Quiero una página así</a>' +
    '<button class="bf-btn bf-btn--close" type="button" id="bf-close">Seguir mirando la demo</button>' +
    '</div></div>';
  document.body.appendChild(modal);

  function cerrar() { modal.classList.remove('open'); }
  modal.addEventListener('click', function (e) { if (e.target === modal) cerrar(); });
  document.getElementById('bf-close').addEventListener('click', cerrar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

  // Uso: BitFixDemo.preview('texto del mensaje')
  window.BitFixDemo = {
    preview: function (texto) {
      document.getElementById('bf-msg').textContent = texto;
      document.getElementById('bf-go').href = waLink('Hola Ricardo, vi la demo de ' + rubro + ' y quiero una página así para mi negocio.');
      modal.classList.add('open');
      document.getElementById('bf-go').focus();
    }
  };

  // Cualquier botón con data-demo-msg muestra la vista previa
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-demo-msg]');
    if (!el) return;
    e.preventDefault();
    window.BitFixDemo.preview(el.dataset.demoMsg);
  });

  // Menú móvil genérico: botón .d-menu-btn que abre/cierra nav .d-nav
  const btn = document.querySelector('.d-menu-btn');
  const nav = document.querySelector('.d-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }
})();
