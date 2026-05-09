// Base class for all scenes.
// Subclasses override whichever lifecycle hooks they need.
//
// Lifecycle order:
//   init()     — scene becomes active (wire up entities, subscribe to Events)
//   update(dt) — called every logic tick (dt is fixed seconds, e.g. 1/60)
//   draw(ctx, alpha) — called every render frame (alpha = interpolation 0-1)
//   destroy()  — scene is replaced (unsubscribe Events, release resources)

export class Scene {
    init() {}
    destroy() {}
    update(_dt) {}
    draw(_ctx, _alpha) {}
}
