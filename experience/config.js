const DEFAULTS = Object.freeze({
    // Engine
    TPS:          60,    // logic ticks per second
    MAX_FRAME_MS: 100,   // spiral-of-death guard: cap raw frame delta

    // Rendering
    PIXEL_RATIO: window.devicePixelRatio || 1,

    // Camera layout
    CAMERA_PADDING:        80,   // px inset from canvas edge
    CAMERA_COLLIDER_INSET: 120,  // world units — collider is viewport shrunk by this
    FOLLOW_LERP_SPEED:     6,    // higher = snappier target follow

    // World
    WORLD_W: 2400,
    WORLD_H: 1600,

    // Camera movement
    CAMERA_ACC:       1400,  // world units / sec² — acceleration when key held
    CAMERA_DEACC:     3000,  // world units / sec² — deceleration when key released
    CAMERA_MAX_SPEED: 600,   // world units / sec

    // Drag zoom
    CAMERA_DRAG_ZOOM:       0.82,  // zoom level while pointer is held
    CAMERA_ZOOM_LERP_SPEED: 5,     // higher = snappier zoom transition
});

export const config = { ...DEFAULTS };

// ── Console API ───────────────────────────────────────────────────────────────
// Edit live:  __config.CAMERA_ACC = 2000
// Reset all:  __resetConfig()
window.__config      = config;
window.__resetConfig = () => {
    Object.assign(config, DEFAULTS);
    console.log("[config] Reset to defaults.", { ...config });
};
