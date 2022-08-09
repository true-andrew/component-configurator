export class EventEmitter {
  static events = {};

  static handleDOMEvent(ev) {
    const eventName = ev.target.dataset.eventName;
    const data = ev.target;
    EventEmitter.emit(eventName, data);
  }

  static on(eventName, fn) {
    if (!EventEmitter.events[eventName]) {
      EventEmitter.events[eventName] = [];
    }

    if (!EventEmitter.events[eventName].includes(fn)) {
      EventEmitter.events[eventName].push(fn);
    }
  }

  static off(eventName, callback) {
    EventEmitter.events[eventName] = EventEmitter.events[eventName].filter((fn) => callback !== fn);
  }

  static emit(eventName, data) {
    const event = EventEmitter.events[eventName];
    if (event) {
      for (let i = 0, len = event.length; i < len; i++) {
        const fn = event[i];
        fn(data);
      }
    } else {
      throw new Error('Unknown event' + eventName);
    }
  }
}