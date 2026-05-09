const DEFAULTS = Object.freeze({
    // Engine
    TPS: 60, // logic ticks per second
    MAX_FRAME_MS: 100, // spiral-of-death guard: cap raw frame delta

    // Rendering
    PIXEL_RATIO: window.devicePixelRatio || 1,

    // Camera layout
    CAMERA_PADDING: 80, // px inset from canvas edge
    CAMERA_COLLIDER_INSET: 120, // world units — collider is viewport shrunk by this
    FOLLOW_LERP_SPEED: 6, // higher = snappier target follow

    // World
    WORLD_W: 4800,
    WORLD_H: 3200,

    // Drag zoom
    CAMERA_DRAG_ZOOM: 0.82, // zoom level while pointer is held
    CAMERA_ZOOM_LERP_SPEED: 5, // higher = snappier zoom transition

    // Player
    PLAYER_RADIUS: 20, // world units
    PLAYER_MAX_SPEED: 600, // world units / sec
    PLAYER_ACC: 14400, // world units / sec² — full speed in 2.5 ticks (matches Java ratio)
    PLAYER_DEACC: 2160, // world units / sec² — coast-to-stop in ~17 ticks (matches Java ratio)
    PLAYER_DRAG_LERP: 6, // how quickly player chases camera during drag — lower = more hang
    PLAYER_LIFT_SCALE: 1.5, // radius multiplier while lifted
    PLAYER_LIFT_LERP: 8, // speed of radius animation — higher = snappier
    PLAYER_SLIDE_ACC: 800, // acceleration applied while sliding off an entity (world units/sec²)
    PLAYER_SLIDE_MAX_SPEED: 400, // velocity cap while sliding
});

export const config = { ...DEFAULTS };

// ── Console API ───────────────────────────────────────────────────────────────
// Edit live:  __config.PLAYER_ACC = 1500
// Reset all:  __resetConfig()
window.__config = config;
window.__resetConfig = () => {
    Object.assign(config, DEFAULTS);
    console.log("[config] Reset to defaults.", { ...config });
};
