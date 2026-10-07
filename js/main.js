/* =========================================================
   Bit&Fix v2 — funciones de la página
   ========================================================= */

// Número de WhatsApp en formato internacional (54 9 + característica + número, sin espacios)
const WHATSAPP = '5493512002532';

/* ---------------------------------------------------------
   PCs A LA VENTA
   Para publicar un equipo, copiá un bloque { ... } dentro de la lista.
   - foto: subí la imagen a la carpeta img/equipos/ y poné su nombre.
   - Si la lista queda vacía [], la sección muestra solo las 3 categorías.
   Ejemplo:
   {
     nombre: 'PC Oficina Ryzen 5',
     foto: 'img/equipos/pc-oficina-1.jpg',
     specs: ['Ryzen 5 5600G', '16 GB de RAM', 'SSD 480 GB', 'Windows 11'],
     precio: '$ 000.000'
   },
   --------------------------------------------------------- */
const EQUIPOS = [
];

function linkWhatsApp(texto) {
  return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
}

// Todos los botones con data-wa abren WhatsApp con un mensaje ya escrito
document.querySelectorAll('[data-wa]').forEach(function (a) {
  a.href = linkWhatsApp(a.dataset.wa);
});

// Lista de equipos en venta
(function renderEquipos() {
  const cont = document.getElementById('lista-equipos');
  if (!cont || !EQUIPOS.length) return;
  cont.innerHTML = EQUIPOS.map(function (e) {
    const specs = (e.specs || []).map(function (s) { return '<li>' + s + '</li>'; }).join('');
    const msg = 'Hola Ricardo, me interesa el equipo "' + e.nombre + '". ¿Sigue disponible?';
    return '<article class="product">' +
      (e.foto ? '<img src="' + e.foto + '" alt="' + e.nombre + '" loading="lazy">' : '') +
      '<div class="product__body"><h3>' + e.nombre + '</h3>' +
      '<ul class="product__specs">' + specs + '</ul>' +
      (e.precio ? '<p class="product__price">' + e.precio + '</p>' : '') +
      '<a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="' + linkWhatsApp(msg) + '">Me interesa</a>' +
      '</div></article>';
  }).join('');
})();

// Menú en el celular
(function menu() {
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('menu');
  if (!btn || !nav) return;
  function cerrar() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menú'); }
  btn.addEventListener('click', function () {
    const abierto = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    btn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', cerrar); });
})();

// Formulario: arma el mensaje y lo abre en WhatsApp
(function formulario() {
  const form = document.getElementById('form-contacto');
  if (!form) return;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const nombre = form.nombre.value.trim();
    const motivo = form.motivo.value;
    const mensaje = form.mensaje.value.trim();
    const texto = 'Hola Ricardo, soy ' + nombre + '.\nConsulta: ' + motivo + (mensaje ? '\n' + mensaje : '');
    window.open(linkWhatsApp(texto), '_blank', 'noopener');
  });
})();

// Pausar los demás videos cuando se reproduce uno
document.querySelectorAll('video').forEach(function (v) {
  v.addEventListener('play', function () {
    document.querySelectorAll('video').forEach(function (o) { if (o !== v) o.pause(); });
  });
});

// Año actual en el pie
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();
