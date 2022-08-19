const events = {};

export class EventEmitter {
  on(eventName, fn) {
    if (!events[eventName]) {
      events[eventName] = [];
    }

    if (!events[eventName].includes(fn)) {
      events[eventName].push(fn);
    }
  }

  emit(eventName, data) {
    const event = events[eventName];
    if (event) {
      for (let i = 0, len = event.length; i < len; i++) {
        const object = event[i];
        object.handleEvent(eventName, data);
      }
    } else {
      throw new Error('Unknown event: ' + eventName);
    }
  }
}