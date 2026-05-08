import { PIXEL_RATIO } from "../config.js";

export function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;

        canvas.width = Math.round(w * PIXEL_RATIO);
        canvas.height = Math.round(h * PIXEL_RATIO);

        // scale all draw calls so coordinates are always in CSS pixels
        ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    }

    new ResizeObserver(resize).observe(canvas);
    resize();

    return ctx;
}
