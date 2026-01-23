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
function initCarousel(root){
  const track = root.querySelector('.carousel-track');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  if(!track) return;
  const items = Array.from(track.children);
  let index = 0;

  function update(){
    const target = items[Math.max(0, Math.min(index, items.length - 1))];
    const left = target ? target.offsetLeft : 0;
    track.style.transform = `translateX(${-left}px)`;
  }

  const onResize = () => update();
  window.addEventListener('resize', onResize);

  prev?.addEventListener('click', ()=>{ index = Math.max(0, index-1); update(); });
  next?.addEventListener('click', ()=>{ index = Math.min(items.length-1, index+1); update(); });

  // Auto-play for logo carousel
  if (root.classList.contains('logos')){
    setInterval(()=>{ index = (index + 1) % items.length; update(); }, 2800);
  }

  // Initial layout
  requestAnimationFrame(update);
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
  const mascot = document.querySelector('.mascot-floating');
  if (!mascot) return;
  const KEY = 'mascotIntroShown';
  try{
    if (window.localStorage && localStorage.getItem(KEY)) return;
    mascot.classList.add('mascot-floating--enter');
    if (window.localStorage) localStorage.setItem(KEY, '1');
  }catch(_){
    mascot.classList.add('mascot-floating--enter');
  }
})();
