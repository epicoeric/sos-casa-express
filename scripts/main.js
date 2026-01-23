// Mobile nav toggle (glass dropdown)
const navToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('menu--open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Simple carousel (no dependencies)
function initLightbox(){
  const lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return null;
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('[data-lightbox-close]');
  let lastActive = null;

  function openLightbox(src, alt){
    if (!image) return;
    lastActive = document.activeElement;
    image.src = src;
    image.alt = alt || 'Imagem ampliada';
    if (caption) caption.textContent = alt || '';
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn?.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
  }

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  return openLightbox;
}

const openLightbox = initLightbox();

function initCarousel(root){
  const track = root.querySelector('.carousel-track');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  if(!track) return;
  const items = Array.from(track.children);
  const filterWrap = root.querySelector('[data-carousel-filters]');
  const filterButtons = filterWrap ? Array.from(filterWrap.querySelectorAll('[data-filter]')) : [];
  const progress = root.querySelector('[data-carousel-progress]');
  let index = 0;

  const getVisibleItems = () => items.filter((item) => !item.hidden);

  function update(){
    const visible = getVisibleItems();
    if (!visible.length) {
      track.style.transform = 'translateX(0)';
      prev?.setAttribute('disabled', 'true');
      next?.setAttribute('disabled', 'true');
      if (progress) progress.textContent = '0 / 0';
      return;
    }
    index = Math.max(0, Math.min(index, visible.length - 1));
    const target = visible[index];
    const left = target ? target.offsetLeft : 0;
    track.style.transform = `translateX(${-left}px)`;
    prev?.toggleAttribute('disabled', index === 0);
    next?.toggleAttribute('disabled', index >= visible.length - 1);
    if (progress) progress.textContent = `${index + 1} / ${visible.length}`;
  }

  const onResize = () => update();
  window.addEventListener('resize', onResize);

  prev?.addEventListener('click', ()=>{
    const visible = getVisibleItems();
    if (!visible.length) return;
    index = Math.max(0, index - 1);
    update();
  });
  next?.addEventListener('click', ()=>{
    const visible = getVisibleItems();
    if (!visible.length) return;
    index = Math.min(visible.length - 1, index + 1);
    update();
  });

  // Auto-play for logo carousel
  if (root.classList.contains('logos')){
    setInterval(()=>{
      const visible = getVisibleItems();
      if (!visible.length) return;
      index = (index + 1) % visible.length;
      update();
    }, 2800);
  }

  function applyFilter(value){
    items.forEach((item) => {
      const match = value === 'all' || item.dataset.category === value;
      item.hidden = !match;
    });
    index = 0;
    update();
  }

  if (filterButtons.length){
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((item) => {
          const active = item === btn;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        applyFilter(btn.dataset.filter || 'all');
      });
    });
  }

  if (openLightbox) {
    items.forEach((item) => {
      if (!item.classList.contains('media-card')) return;
      const img = item.querySelector('img');
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      if (img?.alt) item.setAttribute('aria-label', `Ampliar imagem: ${img.alt}`);
    });

    const openFromCard = (card) => {
      const img = card?.querySelector('img');
      if (!img) return;
      openLightbox(img.currentSrc || img.src, img.alt || '');
    };

    track.addEventListener('click', (event) => {
      const card = event.target.closest('.media-card');
      if (!card) return;
      openFromCard(card);
    });

    track.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest('.media-card');
      if (!card) return;
      event.preventDefault();
      openFromCard(card);
    });
  }

  // Initial layout
  requestAnimationFrame(() => {
    if (filterButtons.length) {
      const activeBtn = filterButtons.find((btn) => btn.classList.contains('is-active')) || filterButtons[0];
      if (activeBtn) {
        activeBtn.classList.add('is-active');
        activeBtn.setAttribute('aria-pressed', 'true');
        applyFilter(activeBtn.dataset.filter || 'all');
        return;
      }
    }
    update();
  });
}

document.querySelectorAll('[data-carousel]').forEach(initCarousel);

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Contact form -> WhatsApp message
const contatoForm = document.getElementById('contato-form');
if (contatoForm) {
  contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!contatoForm.reportValidity()) return;

    const data = new FormData(contatoForm);
    const nome = String(data.get('nome') || '').trim();
    const contato = String(data.get('contato') || '').trim();
    const tipo = String(data.get('tipo') || '').trim();
    const link = String(data.get('link') || '').trim();

    const linhas = [
      'Olá! Gostaria de solicitar uma análise do meu imóvel.',
      `Nome: ${nome}`,
      `Contato: ${contato}`,
      `Tipo de imóvel: ${tipo}`
    ];
    if (link) linhas.push(`Link do anúncio: ${link}`);

    const numero = contatoForm.dataset.whatsapp || '5511994786873';
    const texto = encodeURIComponent(linhas.join('\n'));
    window.location.href = `https://wa.me/${numero}?text=${texto}`;
  });
}

// Ensure hero video plays inline and continuously on mobile
(function ensureHeroVideo(){
  const v = document.getElementById('hero-video');
  if (!v) return;
  try {
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('muted', '');
    v.muted = true; // property also required on iOS
    v.loop = true;
    v.autoplay = true;

    const tryPlay = () => {
      // iOS quirk: seek a tiny offset before play can help
      if (v.currentTime === 0) {
        try { v.currentTime = 0.01; } catch (_) {}
      }
      return v.play().catch(()=>{});
    };
    v.addEventListener('loadeddata', tryPlay, { once: true });
    v.addEventListener('canplay', tryPlay, { once: true });
    v.addEventListener('ended', () => { v.currentTime = 0; tryPlay(); });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlay();
    });
    // As a last resort, resume on first user interaction
    const resume = () => { tryPlay(); window.setTimeout(tryPlay, 200); window.removeEventListener('touchstart', resume); window.removeEventListener('click', resume); };
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('click', resume, { once: true });
  } catch(_){}
})();

// Mascot floating entrance animation (first visit)
(function initMascotFloating(){
  const mascot = document.querySelector(".mascot-floating");
  if (!mascot) return;
  const KEY = "mascotIntroShown";
  try{
    if (window.localStorage && !localStorage.getItem(KEY)) {
      mascot.classList.add("mascot-floating--enter");
      localStorage.setItem(KEY, "1");
    }
  }catch(_){
    mascot.classList.add("mascot-floating--enter");
  }

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let animTimer;

  const triggerScrollTop = () => {
    mascot.classList.remove("is-animating");
    void mascot.offsetWidth;
    mascot.classList.add("is-animating");
    if (animTimer) window.clearTimeout(animTimer);
    if (prefersReduced) {
      animTimer = window.setTimeout(() => mascot.classList.remove("is-animating"), 400);
    }
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  mascot.addEventListener("click", triggerScrollTop);
  mascot.addEventListener("animationend", (event) => {
    if (event.animationName === "mascot-pop") {
      mascot.classList.remove("is-animating");
    }
  });
})();

