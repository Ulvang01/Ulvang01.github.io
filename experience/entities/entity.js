import { Vector2 } from "../utils/vector2.js";
import { clamp }   from "../utils/math.js";

let _nextId = 0;

export class Entity {
    #position;

    // Unique ID used by the collision system for pair deduplication
    id = _nextId++;

    // Shape / physics data — subclasses set these in their constructor
    size     = 0;
    maxSpeed = 0;
    acc      = 0;
    deacc    = 0;

    // Current velocity (world units / sec)
    dx = 0;
    dy = 0;

    // When false the collision system skips this entity entirely
    collidable = true;

    // When true the entity is never moved by collision resolution (e.g. walls)
    isStatic = false;

    // Fraction of overlap corrected per tick (1.0 = instant full separation).
    // Set below 1.0 to get a gradual slide-out effect (e.g. Player while sliding).
    correctionRate = 1.0;

    // Directional intent — set by input() each tick
    up    = false;
    down  = false;
    left  = false;
    right = false;

    constructor(position, size = 0, maxSpeed = 0, acc = 0, deacc = 0) {
        this.#position = position;
        this.size      = size;
        this.maxSpeed  = maxSpeed;
        this.acc       = acc;
        this.deacc     = deacc;
    }

    get position()  { return this.#position; }

    // Subclasses override this to invalidate their bounds cache.
    // Always call super.position = v inside the override.
    set position(v) { this.#position = v; }

    // Broad-phase shape type — override in subclasses with non-AABB shapes
    get shape() { return 'aabb'; }

    // Standard acceleration / deceleration physics.
    // Call from subclass update(dt) to advance the entity by one tick.
    // Uses this.position setter so subclass cache invalidation fires automatically.
    _stepMovement(dt) {
        if (this.up)    this.dy -= this.acc * dt;
        if (this.down)  this.dy += this.acc * dt;
        if (this.left)  this.dx -= this.acc * dt;
        if (this.right) this.dx += this.acc * dt;

        this.dx = clamp(this.dx, -this.maxSpeed, this.maxSpeed);
        this.dy = clamp(this.dy, -this.maxSpeed, this.maxSpeed);

        if (!this.left && !this.right) {
            const dec = this.deacc * dt;
            this.dx = this.dx > 0 ? Math.max(0, this.dx - dec) : Math.min(0, this.dx + dec);
        }
        if (!this.up && !this.down) {
            const dec = this.deacc * dt;
            this.dy = this.dy > 0 ? Math.max(0, this.dy - dec) : Math.min(0, this.dy + dec);
        }

        // Uses the public setter so any subclass override (e.g. bounds invalidation) fires
        this.position = new Vector2(
            this.#position.x + this.dx * dt,
            this.#position.y + this.dy * dt,
        );
    }

    // ── Abstract ──────────────────────────────────────────────────────────────

    // Returns an AABB used for culling and collision
    get bounds() { throw new Error(`${this.constructor.name} must implement get bounds`); }

    update(dt) { throw new Error(`${this.constructor.name} must implement update(dt)`); }
    draw(ctx)  { throw new Error(`${this.constructor.name} must implement draw(ctx)`); }
}
