const IFRAME_W = 1440;
const IFRAME_H = 900;
const EASE     = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION = 0.85; // seconds

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

  all.forEach(p => (p.style.pointerEvents = 'none'));

  portal.classList.add('portal--zooming');

  // Fade out header so portal can expand over it
  const header = document.querySelector('.site-header');
  header.style.transition = `opacity ${DURATION * 0.4}s ${EASE}`;
  header.style.opacity    = '0';

  // Fade out siblings and divider
  all.filter(p => p !== portal).forEach(p => {
    p.style.transition = `opacity ${DURATION * 0.4}s ${EASE}`;
    p.style.opacity    = '0';
  });
  document.querySelector('.portals__divider').style.opacity = '0';

  // Pull portal out of flex flow, freeze at current screen position
  portal.style.position   = 'fixed';
  portal.style.top        = `${rect.top}px`;
  portal.style.left       = `${rect.left}px`;
  portal.style.width      = `${rect.width}px`;
  portal.style.height     = `${rect.height}px`;
  portal.style.flex       = 'none';
  portal.style.margin     = '0';
  portal.style.zIndex     = '1000';
  portal.style.transition = 'none';

  void portal.offsetWidth; // commit starting position

  const dur = `${DURATION}s`;

  // Expand to cover full viewport including header
  portal.style.transition = `top ${dur} ${EASE}, left ${dur} ${EASE}, width ${dur} ${EASE}, height ${dur} ${EASE}`;
  portal.style.top    = '0';
  portal.style.left   = '0';
  portal.style.width  = '100vw';
  portal.style.height = '100vh';

  // Scale iframe to fill the full viewport
  const iframe    = portal.querySelector('.portal__preview iframe');
  const fullScale = Math.min(window.innerWidth / IFRAME_W, window.innerHeight / IFRAME_H);
  iframe.style.transition = `transform ${dur} ${EASE}`;
  iframe.style.transform  = `scale(${fullScale})`;

  const go = () => { window.location.href = href; };
  portal.addEventListener('transitionend', go, { once: true });
  setTimeout(go, (DURATION + 0.15) * 1000);
}

function resetPortals() {
  document.querySelectorAll('.portal').forEach(p => {
    p.removeAttribute('style');
    p.classList.remove('portal--zooming', 'portal--expanding', 'portal--collapsing');
  });
  const header  = document.querySelector('.site-header');
  const divider = document.querySelector('.portals__divider');
  if (header)  header.removeAttribute('style');
  if (divider) divider.removeAttribute('style');
  scaleAll();
}

window.addEventListener('load', scaleAll);
window.addEventListener('resize', scaleAll);
window.addEventListener('pageshow', (e) => { if (e.persisted) resetPortals(); });
document.querySelectorAll('.portal').forEach(p => p.addEventListener('click', handleClick));
