// Engine
export const TPS               = 60;   // logic ticks per second
export const MAX_FRAME_MS      = 100;  // spiral-of-death guard: cap raw frame delta

// Rendering
export const PIXEL_RATIO       = window.devicePixelRatio || 1;

// Camera
export const CAMERA_PADDING        = 80;    // px inset from canvas edge
export const CAMERA_COLLIDER_INSET = 120;   // world units — collider is viewport shrunk by this
export const FOLLOW_LERP_SPEED     = 6;     // higher = snappier follow

// World
export const WORLD_W = 2400;  // total width in world units
export const WORLD_H = 1600;  // total height in world units

// Camera movement
export const CAMERA_ACC       = 1400;  // world units / sec² — acceleration when key held
export const CAMERA_DEACC     = 3000;  // world units / sec² — deceleration when key released
export const CAMERA_MAX_SPEED = 600;   // world units / sec
