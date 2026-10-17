import 'zone.js';
import 'zone.js/testing';

// jsdom lacks ResizeObserver, which PrimeNG uses.
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    } as unknown as typeof ResizeObserver;
}
