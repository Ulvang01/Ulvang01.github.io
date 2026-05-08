export function setupCanvas(canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
        const dpr = window.devicePixelRatio || 1; // read fresh — changes on monitor switch
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w === 0 || h === 0) return;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return {
        ctx,
        disconnect: () => observer.disconnect(),
    };
}
