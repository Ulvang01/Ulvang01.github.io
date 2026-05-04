const IFRAME_W = 1440;
const IFRAME_H = 900;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = 0.85;

let zoomTimeout = null;
let zoomHandler = null;
let zoomPortal = null;

function scaleIframe(preview) {
    const iframe = preview.querySelector("iframe");
    const scale = Math.max(
        preview.clientWidth / IFRAME_W,
        preview.clientHeight / IFRAME_H,
    );
    iframe.style.transition = "none";
    iframe.style.transform = `scale(${scale})`;
}

function scaleAll() {
    document.querySelectorAll(".portal__preview").forEach(scaleIframe);
}

function cancelZoom() {
    clearTimeout(zoomTimeout);
    zoomTimeout = null;
    if (zoomPortal && zoomHandler) {
        zoomPortal.removeEventListener("transitionend", zoomHandler);
    }
    zoomHandler = null;
    zoomPortal = null;
}

function resetPortals() {
    cancelZoom();

    document.querySelectorAll(".portal").forEach((p) => {
        p.removeAttribute("style");
        p.classList.remove(
            "portal--zooming",
            "portal--expanding",
            "portal--collapsing",
        );
        const iframe = p.querySelector(".portal__preview iframe");
        if (iframe) iframe.removeAttribute("style");
    });
    document.querySelector(".site-header")?.removeAttribute("style");
    document.querySelector(".portals__divider")?.removeAttribute("style");

    scaleAll();
}

function handleClick(e) {
    e.preventDefault();
    const portal = e.currentTarget;
    const href = portal.getAttribute("href");
    const all = [...document.querySelectorAll(".portal")];
    const rect = portal.getBoundingClientRect();

    all.forEach((p) => (p.style.pointerEvents = "none"));
    portal.classList.add("portal--zooming");

    const header = document.querySelector(".site-header");
    header.style.transition = `opacity ${DURATION * 0.4}s ${EASE}`;
    header.style.opacity = "0";

    all.filter((p) => p !== portal).forEach((p) => {
        p.style.transition = `opacity ${DURATION * 0.4}s ${EASE}`;
        p.style.opacity = "0";
    });
    document.querySelector(".portals__divider").style.opacity = "0";

    portal.style.position = "fixed";
    portal.style.top = `${rect.top}px`;
    portal.style.left = `${rect.left}px`;
    portal.style.width = `${rect.width}px`;
    portal.style.height = `${rect.height}px`;
    portal.style.flex = "none";
    portal.style.margin = "0";
    portal.style.zIndex = "1000";
    portal.style.transition = "none";

    void portal.offsetWidth;

    const dur = `${DURATION}s`;
    portal.style.transition = `top ${dur} ${EASE}, left ${dur} ${EASE}, width ${dur} ${EASE}, height ${dur} ${EASE}`;
    portal.style.top = "0";
    portal.style.left = "0";
    portal.style.width = "100vw";
    portal.style.height = "100vh";

    const iframe = portal.querySelector(".portal__preview iframe");
    const fullScale = Math.max(
        window.innerWidth / IFRAME_W,
        window.innerHeight / IFRAME_H,
    );
    iframe.style.transition = `transform ${dur} ${EASE}`;
    iframe.style.transform = `scale(${fullScale})`;

    const go = () => {
        window.location.href = href;
    };
    zoomHandler = go;
    zoomPortal = portal;
    portal.addEventListener("transitionend", go, { once: true });
    zoomTimeout = setTimeout(go, (DURATION + 0.15) * 1000);
}

window.addEventListener("load", scaleAll);
window.addEventListener("resize", scaleAll);
window.addEventListener("pageshow", (e) => {
    if (e.persisted) resetPortals();
});
document
    .querySelectorAll(".portal")
    .forEach((p) => p.addEventListener("click", handleClick));
