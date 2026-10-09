/* La Placita de Santurce — Revisión 2 (sin dependencias) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menú móvil */
  var mb = $('.menu-btn'), nav = $('#nav');
  if (mb && nav) mb.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open'); mb.setAttribute('aria-expanded', open);
  });

  /* Aparición suave */
  var fades = $$('.fade');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { threshold: .12 });
    fades.forEach(function (f) { io.observe(f); });
  } else fades.forEach(function (f) { f.classList.add('is-in'); });

  /* ---------------- Directorio ---------------- */
  var dir = $('.dir');
  if (!dir || !window.PLACES) return;
  var places = {}; window.PLACES.forEach(function (p) { places[p.n] = p; });
  var pins = $$('.dir .pin'), stores = $$('.store'), groups = $$('.legend__group');
  var chips = $$('.chip'), input = $('.legend input[type=search]'), count = $('.legend__meta .count');
  var pop = $('.card-pop'), canvas = $('.map-canvas');
  var state = { cat: 'todos', q: '', active: null, zoom: 1, mode: '2d' };

  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function apply() {
    var q = norm(state.q), shown = 0, visibleCats = {};
    stores.forEach(function (li) {
      var ok = (state.cat === 'todos' || li.dataset.cat === state.cat) && (!q || norm(li.dataset.search).indexOf(q) > -1);
      li.hidden = !ok; if (ok) { shown++; visibleCats[li.dataset.cat] = 1; }
    });
    groups.forEach(function (g) { g.hidden = !visibleCats[g.dataset.group]; });
    pins.forEach(function (pin) {
      var li = $('.store[data-n="' + pin.dataset.n + '"]');
      pin.classList.toggle('is-dim', li.hidden);
    });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.filter === state.cat); });
    if (count) count.textContent = shown + (shown === 1 ? ' negocio' : ' negocios');
  }

  function select(n, fromList) {
    state.active = n;
    pins.forEach(function (p) { p.classList.toggle('is-active', +p.dataset.n === n); });
    stores.forEach(function (s) { s.classList.toggle('is-active', +s.dataset.n === n); });
    var p = places[n]; if (!p || !pop) return;
    pop.dataset.cat = p.cat;
    $('.card-pop__cat', pop).textContent = p.n + ' · ' + p.catName;
    $('h3', pop).textContent = p.name;
    $('.card-pop__addr', pop).textContent = p.addr;
    var img = $('img', pop); img.src = p.img; img.alt = 'Foto de ' + p.name;
    $('.card-pop__link', pop).href = '/negocios/' + p.slug;
    $('.card-pop__go', pop).href = window.MAPS_BASE + encodeURIComponent(p.name + ' La Placita Santurce San Juan');
    pop.classList.add('is-open');
    if (fromList && window.innerWidth <= 980) { setView('mapa'); }
    var pin = $('.dir .pin[data-n="' + n + '"]'), st = $('.map-stage');
    if (pin && st && st.scrollWidth > st.clientWidth) {
      var c = pin.querySelector('circle'), k = st.scrollWidth / 1000;
      st.scrollTo({ left: c.cx.baseVal.value * k - st.clientWidth / 2, top: c.cy.baseVal.value * (st.scrollHeight / 700) - st.clientHeight / 2.4, behavior: reduce ? 'auto' : 'smooth' });
    }
    var li = $('.store[data-n="' + n + '"]');
    if (li && !fromList) li.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }

  pins.forEach(function (pin) {
    pin.addEventListener('click', function () { select(+pin.dataset.n); });
    pin.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(+pin.dataset.n); } });
  });
  stores.forEach(function (li) {
    li.addEventListener('click', function (ev) { if (ev.target.closest('a')) return; select(+li.dataset.n, true); });
  });
  $('.card-pop__close').addEventListener('click', function () {
    pop.classList.remove('is-open'); select(null);
  });
  chips.forEach(function (c) { c.addEventListener('click', function () { state.cat = c.dataset.filter; apply(); }); });
  if (input) input.addEventListener('input', function () { state.q = input.value; apply(); });

  /* 2D / 3D */
  $$('[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.mode = b.dataset.mode;
      $$('[data-mode]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      canvas.classList.toggle('is-3d', state.mode === '3d');
      setZoom(1);
    });
  });
  /* Zoom */
  function setZoom(z) {
    state.zoom = Math.min(2.2, Math.max(1, z));
    var base = state.mode === '3d' ? 'rotateX(52deg) rotateZ(-24deg) scale(' + (0.92 * state.zoom) + ')' : 'scale(' + state.zoom + ')';
    canvas.style.transform = base;
  }
  $$('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () { setZoom(state.zoom + (b.dataset.zoom === 'in' ? .3 : -.3)); });
  });

  /* Pestañas móvil */
  function setView(v) {
    dir.dataset.view = v;
    $$('.dir-tabs [data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.view === v); });
  }
  $$('.dir-tabs [data-view]').forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.view); }); });

  /* Parámetros de URL: ?cat= &q= &n= */
  var params = new URLSearchParams(location.search);
  if (params.get('cat') && $('.chip[data-filter="' + params.get('cat') + '"]')) state.cat = params.get('cat');
  if (params.get('q')) { state.q = params.get('q'); if (input) input.value = state.q; if (window.innerWidth <= 980) setView('lista'); }
  apply();
  /* En celular el mapa se recorre deslizando: centrar en el mercado */
  var stage = $('.map-stage');
  function centerMap() { if (stage && stage.scrollWidth > stage.clientWidth) { stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2; stage.scrollTop = (stage.scrollHeight - stage.clientHeight) * .4; } }
  centerMap();
  $$('.dir-tabs [data-view="mapa"]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(centerMap, 30); }); });
  if (params.get('n')) select(+params.get('n'));
})();
