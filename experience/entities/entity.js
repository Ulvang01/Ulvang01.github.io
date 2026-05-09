import { Vector2 } from "../utils/vector2.js";
import { clamp } from "../utils/math.js";

let _nextId = 0;

export class Entity {
    #position;

    // Unique ID used by the collision system for pair deduplication
    id = _nextId++;

    // Shape / physics data — subclasses set these in their constructor
    size = 0;
    maxSpeed = 0;
    acc = 0;
    deacc = 0;

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
    up = false;
    down = false;
    left = false;
    right = false;

    constructor(position, size = 0, maxSpeed = 0, acc = 0, deacc = 0) {
        this.#position = position;
        this.size = size;
        this.maxSpeed = maxSpeed;
        this.acc = acc;
        this.deacc = deacc;
    }

    get position() {
        return this.#position;
    }

    // Subclasses override this to invalidate their bounds cache.
    // Always call super.position = v inside the override.
    set position(v) {
        this.#position = v;
    }

    // Broad-phase shape type — override in subclasses with non-AABB shapes
    get shape() {
        return "aabb";
    }

    // Standard acceleration / deceleration physics.
    // Call from subclass update(dt) to advance the entity by one tick.
    // Uses this.position setter so subclass cache invalidation fires automatically.
    //
    // Each direction is handled independently — pressing a key accelerates that
    // way; NOT pressing it applies deacc to bleed off any velocity in that
    // direction.  The two sides stack when reversing: pressing LEFT while drifting
    // right applies both the acc in the new direction AND the deacc against the
    // old one, giving crisp, snappy direction changes.
    _stepMovement(dt) {
        // ── X ────────────────────────────────────────────────────────────────
        if (this.right) {
            this.dx += this.acc * dt;
            if (this.dx > this.maxSpeed) this.dx = this.maxSpeed;
        } else if (this.dx > 0) {
            this.dx -= this.deacc * dt;
            if (this.dx < 0) this.dx = 0;
        }

        if (this.left) {
            this.dx -= this.acc * dt;
            if (this.dx < -this.maxSpeed) this.dx = -this.maxSpeed;
        } else if (this.dx < 0) {
            this.dx += this.deacc * dt;
            if (this.dx > 0) this.dx = 0;
        }

        // ── Y ────────────────────────────────────────────────────────────────
        if (this.down) {
            this.dy += this.acc * dt;
            if (this.dy > this.maxSpeed) this.dy = this.maxSpeed;
        } else if (this.dy > 0) {
            this.dy -= this.deacc * dt;
            if (this.dy < 0) this.dy = 0;
        }

        if (this.up) {
            this.dy -= this.acc * dt;
            if (this.dy < -this.maxSpeed) this.dy = -this.maxSpeed;
        } else if (this.dy < 0) {
            this.dy += this.deacc * dt;
            if (this.dy > 0) this.dy = 0;
        }

        // Normalise diagonal speed — without this, moving on two axes at once
        // produces a combined vector of up to maxSpeed×√2 ≈ 41% too fast.
        const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.dx *= scale;
            this.dy *= scale;
        }

        // Uses the public setter so any subclass override (e.g. bounds invalidation) fires
        this.position = new Vector2(
            this.#position.x + this.dx * dt,
            this.#position.y + this.dy * dt,
        );
    }

    // ── Abstract ──────────────────────────────────────────────────────────────

    // Returns an AABB used for culling and collision
    get bounds() {
        throw new Error(`${this.constructor.name} must implement get bounds`);
    }

    update(dt) {
        throw new Error(`${this.constructor.name} must implement update(dt)`);
    }
    draw(ctx) {
        throw new Error(`${this.constructor.name} must implement draw(ctx)`);
    }
}
