export const EventBus = (() => {
  const callbacks: { [key: string]: Function[] } = {};

  const $on = (event: string, callback: Function) => {
    if (!callbacks[event]) {
      callbacks[event] = [];
    }
    callbacks[event].push(callback);

    return () => {
      // Remove the callback from the event listeners
      callbacks[event] = callbacks[event].filter((cb: Function) => cb !== callback);
    };
  };

  const $emit = (event: string, payload?: any) => {
    if (callbacks[event]) {
      callbacks[event].forEach((callback: Function) => callback(payload));
    }
  };

  return { $on, $emit };
})();
