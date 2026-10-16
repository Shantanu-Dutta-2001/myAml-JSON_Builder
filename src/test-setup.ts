import 'zone.js';
import 'zone.js/testing';

// jsdom has no ResizeObserver; PrimeNG's TabList needs one when the builder page renders.
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    } as unknown as typeof ResizeObserver;
}
