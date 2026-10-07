/* =========================================================
   Kit de demos de Bit&Fix: catálogo, carrito, formularios y cotizador.
   Cada demo define window.KIT antes de cargar este archivo:
   KIT = {
     icons: { nombre: '<svg …>' },
     products: [{ name, desc, price, cat, icon, tag?, sizes? }],
     cart: { title, delivery: ['Retiro en el local', 'Envío a domicilio'], intro }
   }
   ========================================================= */
(function () {
  const KIT = window.KIT || {};
  const icons = KIT.icons || {};
  const fmt = function (n) { return '$ ' + Number(n).toLocaleString('es-AR'); };
  const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ---------- íconos inline: <i data-icon="pan"></i> ----------
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    if (icons[el.dataset.icon]) el.innerHTML = icons[el.dataset.icon];
  });

  // ---------- catálogo ----------
  const cat = document.getElementById('k-catalog');
  const cart = [];
  if (cat && KIT.products) {
    const cats = ['Todo'].concat(KIT.products.map(function (p) { return p.cat; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; }));
    let current = 'Todo';
    const filters = document.createElement('div');
    filters.className = 'k-filters';
    const grid = document.createElement('div');
    grid.className = 'k-grid';
    if (cats.length > 2) cat.appendChild(filters);
    cat.appendChild(grid);

    function render() {
      filters.innerHTML = cats.map(function (c) { return '<button type="button" class="' + (c === current ? 'on' : '') + '">' + esc(c) + '</button>'; }).join('');
      grid.innerHTML = KIT.products.map(function (p, i) {
        if (current !== 'Todo' && p.cat !== current) return '';
        const sizes = p.sizes ? '<div class="k-sizes">' + p.sizes.map(function (s, j) { return '<button type="button" data-size="' + esc(s) + '" class="' + (j === 0 ? 'on' : '') + '">' + esc(s) + '</button>'; }).join('') + '</div>' : '';
        return '<article class="k-prod" data-i="' + i + '">' +
          '<div class="k-prod__art"' + (p.tile ? ' style="background:' + p.tile + '"' : '') + '>' + (icons[p.icon] || '') + (p.tag ? '<span class="k-prod__tag">' + esc(p.tag) + '</span>' : '') + '</div>' +
          '<div class="k-prod__body"><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc || '') + '</p>' + sizes +
          '<div class="k-prod__row"><span class="k-price">' + fmt(p.price) + (p.unit ? '<small style="font-size:.7em;opacity:.7"> ' + esc(p.unit) + '</small>' : '') + '</span>' +
          '<button type="button" class="k-add" aria-label="Agregar ' + esc(p.name) + ' al pedido">+</button></div></div></article>';
      }).join('');
    }
    filters.addEventListener('click', function (e) {
      const b = e.target.closest('button'); if (!b) return;
      current = b.textContent; render();
    });
    grid.addEventListener('click', function (e) {
      const sz = e.target.closest('[data-size]');
      if (sz) {
        sz.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
        sz.classList.add('on'); return;
      }
      const add = e.target.closest('.k-add'); if (!add) return;
      const card = add.closest('.k-prod');
      const p = KIT.products[+card.dataset.i];
      const sel = card.querySelector('[data-size].on');
      const size = sel ? sel.dataset.size : '';
      const key = p.name + '|' + size;
      const line = cart.find(function (l) { return l.key === key; });
      if (line) line.qty++; else cart.push({ key: key, name: p.name, size: size, price: p.price, qty: 1 });
      add.classList.add('added'); add.textContent = '✓';
      setTimeout(function () { add.classList.remove('added'); add.textContent = '+'; }, 900);
      updateBar();
    });
    render();

    // barra del carrito
    const bar = document.createElement('div');
    bar.className = 'k-cart';
    bar.innerHTML = '<span><b id="k-count">0 productos</b><br><span id="k-sum">$ 0</span></span><button type="button" class="btn btn--sm" id="k-open">Ver pedido</button>';
    document.body.appendChild(bar);

    const panel = document.createElement('div');
    panel.className = 'k-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    const delivery = (KIT.cart && KIT.cart.delivery) || ['Retiro en el local', 'Envío a domicilio'];
    panel.innerHTML = '<div class="k-panel__box"><h3>' + esc((KIT.cart && KIT.cart.title) || 'Tu pedido') + '<button type="button" aria-label="Cerrar" id="k-close">×</button></h3>' +
      '<ul class="k-lines" id="k-lines"></ul><div class="k-total"><span>Total</span><span id="k-total">$ 0</span></div>' +
      '<form id="k-checkout"><label for="k-nombre">Tu nombre</label><input id="k-nombre" required placeholder="Ej.: Ana">' +
      '<label for="k-entrega">Entrega</label><select id="k-entrega">' + delivery.map(function (d) { return '<option>' + esc(d) + '</option>'; }).join('') + '</select>' +
      '<button class="btn btn--accent btn--block" type="submit">Enviar pedido por WhatsApp</button></form></div>';
    document.body.appendChild(panel);

    function total() { return cart.reduce(function (s, l) { return s + l.price * l.qty; }, 0); }
    function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }
    function updateBar() {
      const n = count();
      document.getElementById('k-count').textContent = n + (n === 1 ? ' producto' : ' productos');
      document.getElementById('k-sum').textContent = fmt(total());
      bar.classList.toggle('show', n > 0);
      document.body.classList.toggle('has-cart', n > 0);
      if (n === 0) panel.classList.remove('open');
      renderLines();
    }
    function renderLines() {
      document.getElementById('k-lines').innerHTML = cart.map(function (l, i) {
        return '<li><span>' + esc(l.name) + (l.size ? '<small>Talle ' + esc(l.size) + '</small>' : '') + '<small>' + fmt(l.price) + ' c/u</small></span>' +
          '<span class="k-qty"><button type="button" data-q="-1" data-l="' + i + '" aria-label="Quitar uno">−</button><b>' + l.qty + '</b><button type="button" data-q="1" data-l="' + i + '" aria-label="Agregar uno">+</button></span></li>';
      }).join('');
      document.getElementById('k-total').textContent = fmt(total());
    }
    document.getElementById('k-lines').addEventListener('click', function (e) {
      const b = e.target.closest('[data-q]'); if (!b) return;
      const l = cart[+b.dataset.l]; l.qty += +b.dataset.q;
      if (l.qty <= 0) cart.splice(+b.dataset.l, 1);
      updateBar();
    });
    document.getElementById('k-open').addEventListener('click', function () { panel.classList.add('open'); document.getElementById('k-nombre').focus(); });
    document.getElementById('k-close').addEventListener('click', function () { panel.classList.remove('open'); });
    panel.addEventListener('click', function (e) { if (e.target === panel) panel.classList.remove('open'); });
    document.getElementById('k-checkout').addEventListener('submit', function (e) {
      e.preventDefault();
      const lines = cart.map(function (l) { return '• ' + l.qty + ' x ' + l.name + (l.size ? ' (talle ' + l.size + ')' : ''); }).join('\n');
      const msg = 'Hola! Soy ' + document.getElementById('k-nombre').value.trim() + '. ' + ((KIT.cart && KIT.cart.intro) || 'Quiero hacer este pedido:') + '\n' + lines +
        '\nTotal: ' + fmt(total()) + '\nEntrega: ' + document.getElementById('k-entrega').value;
      panel.classList.remove('open');
      window.BitFixDemo.preview(msg);
    });
  }

  // ---------- cotizador: <form data-quote='{"base":{…},"factor":{…}}'> ----------
  document.querySelectorAll('form[data-quote]').forEach(function (f) {
    const q = JSON.parse(f.dataset.quote);
    const out = f.querySelector('.k-quote b');
    function calc() {
      const base = q.base[f.elements[q.baseField].value] || 0;
      const factor = q.factor[f.elements[q.factorField].value] || 1;
      const precio = Math.round(base * factor / 1000) * 1000;
      f.dataset.precio = fmt(precio);
      if (out) out.textContent = fmt(precio);
    }
    f.addEventListener('change', calc);
    calc();
  });

  // ---------- formularios con plantilla: data-template="Hola! Soy {nombre}…" ----------
  document.querySelectorAll('form[data-template]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      let msg = f.dataset.template.replace(/\{(\w+)\}/g, function (_, k) {
        if (k === 'precio') return f.dataset.precio || '';
        const el = f.elements[k];
        return el ? el.value.trim() : '';
      });
      // "\n" en la plantilla = salto de línea; se quitan renglones "Dato:" que quedaron vacíos
      msg = msg.replace(/\\n/g, '\n').split('\n').filter(function (l) { return !/:\s*$/.test(l); }).join('\n');
      window.BitFixDemo.preview(msg);
    });
  });
})();
