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

  emit(eventName, data) {
    const event = this.events[eventName];
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