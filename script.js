const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('mainNav');
toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('#mainNav a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* scroll progress + header shrink */
const scrollBar = document.getElementById('scrollBar');
const header = document.getElementById('siteHeader');
function onScroll(){
  const h = document.documentElement;
  const scrolled = h.scrollTop || document.body.scrollTop;
  const max = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  if (scrollBar) scrollBar.style.width = pct + '%';
  if (header) header.classList.toggle('scrolled', scrolled > 10);
}
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* scroll-spy: highlight active nav link */
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('#mainNav a'));
function onSpy(){
  let current = sections[0];
  const probe = window.innerHeight * 0.3;
  for (const sec of sections){
    const rect = sec.getBoundingClientRect();
    if (rect.top <= probe) current = sec;
  }
  navLinks.forEach(a => {
    a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id);
  });
}
document.addEventListener('scroll', onSpy, {passive:true});
onSpy();

/* scroll reveal */
if ('IntersectionObserver' in window && !reduceMotion){
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15, rootMargin: '0px 0px -40px 0px'});
  document.querySelectorAll('.reveal, .reveal-zoom').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal, .reveal-zoom').forEach(el => el.classList.add('is-visible'));
}

/* animated counters */
function animateCount(el){
  const target = parseInt(el.getAttribute('data-count'), 10) || 0;
  const prefix = el.getAttribute('data-prefix') || '';
  if (reduceMotion){ el.textContent = prefix + target; return; }
  const duration = 1200;
  const start = performance.now();
  function tick(now){
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + Math.floor(eased * target);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target;
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('.stat b[data-count]');
if ('IntersectionObserver' in window){
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});
  counters.forEach(el => countObserver.observe(el));
} else {
  counters.forEach(animateCount);
}
