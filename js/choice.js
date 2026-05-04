const IFRAME_W = 1440;
const IFRAME_H = 900;
const EASE     = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION = 0.65; // seconds

function scaleIframe(preview) {
  const iframe = preview.querySelector('iframe');
  const scale  = Math.min(
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
  const rect   = portal.getBoundingClientRect();

  // Lock out further interaction
  all.forEach(p => (p.style.pointerEvents = 'none'));

  // Fade out overlay text + edge effects on the clicked portal
  portal.classList.add('portal--zooming');

  // Fade out siblings immediately
  all.filter(p => p !== portal).forEach(p => {
    p.style.transition = `opacity ${DURATION * 0.5}s ${EASE}`;
    p.style.opacity    = '0';
  });
  document.querySelector('.portals__divider').style.opacity = '0';

  // Pull portal out of flex flow, freeze it at its current screen position
  portal.style.position = 'fixed';
  portal.style.top      = `${rect.top}px`;
  portal.style.left     = `${rect.left}px`;
  portal.style.width    = `${rect.width}px`;
  portal.style.height   = `${rect.height}px`;
  portal.style.flex     = 'none';
  portal.style.margin   = '0';
  portal.style.zIndex   = '1000';
  portal.style.transition = 'none';

  // Force reflow so the starting position is committed before animating
  void portal.offsetWidth;

  const dur = `${DURATION}s`;

  // Expand to full viewport
  portal.style.transition = `top ${dur} ${EASE}, left ${dur} ${EASE}, width ${dur} ${EASE}, height ${dur} ${EASE}`;
  portal.style.top    = '0';
  portal.style.left   = '0';
  portal.style.width  = '100vw';
  portal.style.height = '100vh';

  // Scale iframe to exactly fill the full viewport
  const iframe     = portal.querySelector('.portal__preview iframe');
  const fullScale  = Math.min(window.innerWidth / IFRAME_W, window.innerHeight / IFRAME_H);
  iframe.style.transition = `transform ${dur} ${EASE}`;
  iframe.style.transform  = `scale(${fullScale})`;

  const go = () => { window.location.href = href; };
  portal.addEventListener('transitionend', go, { once: true });
  setTimeout(go, (DURATION + 0.1) * 1000); // fallback
}

window.addEventListener('load', scaleAll);
window.addEventListener('resize', scaleAll);
document.querySelectorAll('.portal').forEach(p => p.addEventListener('click', handleClick));
