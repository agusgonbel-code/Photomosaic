(function (root) {
  class GenerationCancelledError extends Error {
    constructor(reason = 'Generación cancelada') {
      super(reason);
      this.name = 'GenerationCancelledError';
    }
  }

  function createGenerationController() {
    let nextId = 0;
    let current = null;
    function invalidate(reason) {
      if (current) {
        current.cancelled = true;
        current.reason = reason;
      }
    }
    return {
      start() {
        invalidate('Sustituida por una nueva generación');
        const signal = {
          id: ++nextId,
          cancelled: false,
          reason: '',
          throwIfCancelled() {
            if (this.cancelled) throw new GenerationCancelledError(this.reason);
          }
        };
        current = signal;
        return signal;
      },
      cancel(reason = 'Cancelada por el usuario') { invalidate(reason); },
      isCurrent(signal) { return current === signal && !signal.cancelled; },
      finish(signal) {
        if (current !== signal) return false;
        current = null;
        return true;
      },
      isRunning() { return Boolean(current && !current.cancelled); }
    };
  }
  root.PhotoMosaicGeneration = { createGenerationController, GenerationCancelledError };
})(typeof window !== 'undefined' ? window : globalThis);
