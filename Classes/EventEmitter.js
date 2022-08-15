export class EventEmitter {
  events = {};

  on(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    if (!this.events[eventName].includes(fn)) {
      this.events[eventName].push(fn);
    }
  }

  off(eventName, callback) {
    const callbacks = this.events[eventName];
    const newCallbacks = [];
    for (let i = 0, len = callbacks.length; i < len; i++) {
      const targetCallback = callbacks[i];
      if (targetCallback !== callback) {
        newCallbacks.push(targetCallback);
      }
    }
    this.events[eventName] = newCallbacks;
  }

  emit(e) {
    const event = this.events[e.type];
    if (event) {
      for (let i = 0, len = event.length; i < len; i++) {
        const object = event[i];
        object.handleEvent(e);
      }
    } else {
      throw new Error('Unknown event: ' + e.type);
    }
  }
}