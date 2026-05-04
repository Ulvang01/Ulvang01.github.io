const IFRAME_W = 1440;
const IFRAME_H = 900;
const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DURATION = '0.65s';

function scaleIframe(preview, transition = false) {
  const iframe = preview.querySelector('iframe');
  const scale = Math.min(
    preview.clientWidth  / IFRAME_W,
    preview.clientHeight / IFRAME_H
  );
  if (transition) {
    iframe.style.transition = `transform ${DURATION} ${EASE}`;
  } else {
    iframe.style.transition = 'none';
  }
  iframe.style.transform = `scale(${scale})`;
  return scale;
}

function scaleAll() {
  document.querySelectorAll('.panel__preview').forEach(p => scaleIframe(p));
}

function handleClick(e) {
  e.preventDefault();
  const panel = e.currentTarget;
  const href  = panel.getAttribute('href');
  const all   = [...document.querySelectorAll('.panel')];

  // lock pointer events so double-clicks can't fire
  all.forEach(p => (p.style.pointerEvents = 'none'));

  // expand clicked panel, collapse the rest
  panel.classList.add('panel--expanding');
  all.filter(p => p !== panel).forEach(p => p.classList.add('panel--collapsing'));

  // animate iframe scale toward fullscreen while panel expands
  const preview = panel.querySelector('.panel__preview');
  const fullScale = Math.min(window.innerWidth / IFRAME_W, window.innerHeight / IFRAME_H);
  const iframe = preview.querySelector('iframe');
  iframe.style.transition = `transform ${DURATION} ${EASE}`;
  iframe.style.transform   = `scale(${fullScale})`;

  // navigate once the flex transition ends (with fallback timeout)
  const go = () => { window.location.href = href; };
  panel.addEventListener('transitionend', go, { once: true });
  setTimeout(go, 800); // fallback if transitionend misfires
}

// init
window.addEventListener('load', scaleAll);
window.addEventListener('resize', scaleAll);
document.querySelectorAll('.panel').forEach(p => p.addEventListener('click', handleClick));
