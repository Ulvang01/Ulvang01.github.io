// Global event bus — import { Events } from anywhere and use directly.
// No need to pass it through constructors.
//
// Usage:
//   Events.on('player:died', ({ x, y }) => spawnEffect(x, y));
//   Events.emit('player:died', { x: 100, y: 200 });
//   Events.off('player:died', handler);
//
// Scenes should call Events.off() for every handler they register in their
// destroy() method to prevent stale callbacks accumulating across scene switches.

const _map = new Map(); // eventName → Set<handler>

export const Events = Object.freeze({
    // Subscribe to an event. Returns the handler so callers can off() it later.
    on(event, handler) {
        if (!_map.has(event)) _map.set(event, new Set());
        _map.get(event).add(handler);
        return handler;
    },

    // Subscribe for a single firing, then auto-unsubscribe.
    once(event, handler) {
        const wrapper = (payload) => {
            handler(payload);
            _map.get(event)?.delete(wrapper);
        };
        this.on(event, wrapper);
        return wrapper; // return wrapper so it can be off()'d early if needed
    },

    // Unsubscribe a specific handler.
    off(event, handler) {
        _map.get(event)?.delete(handler);
    },

    // Emit an event synchronously. All listeners are called in registration order.
    emit(event, payload) {
        _map.get(event)?.forEach((h) => h(payload));
    },

    // Remove ALL listeners for an event — useful for coarse cleanup.
    clear(event) {
        _map.delete(event);
    },
});
