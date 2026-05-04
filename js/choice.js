const IFRAME_W = 1440;
const IFRAME_H = 900;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION = '0.65s';

function scaleIframe(preview) {
  const iframe = preview.querySelector('iframe');
  const scale = Math.min(
    preview.clientWidth  / IFRAME_W,
    preview.clientHeight / IFRAME_H
  );
  iframe.style.transition = 'none';
  iframe.style.transform  = `scale(${scale})`;
}

function scaleAll() {
  document.querySelectorAll('.portal__preview').forEach(scaleIframe);
}

function handleClick(e) {
  e.preventDefault();
  const portal = e.currentTarget;
  const href   = portal.getAttribute('href');
  const all    = [...document.querySelectorAll('.portal')];

  all.forEach(p => (p.style.pointerEvents = 'none'));

  portal.classList.add('portal--expanding');
  all.filter(p => p !== portal).forEach(p => p.classList.add('portal--collapsing'));

  // animate iframe scale toward full-window scale
  const iframe     = portal.querySelector('.portal__preview iframe');
  const fullScale  = Math.min(window.innerWidth / IFRAME_W, window.innerHeight / IFRAME_H);
  iframe.style.transition = `transform ${DURATION} ${EASE}`;
  iframe.style.transform  = `scale(${fullScale})`;

  const go = () => { window.location.href = href; };
  portal.addEventListener('transitionend', go, { once: true });
  setTimeout(go, 800);
}

window.addEventListener('load', scaleAll);
window.addEventListener('resize', scaleAll);
document.querySelectorAll('.portal').forEach(p => p.addEventListener('click', handleClick));
