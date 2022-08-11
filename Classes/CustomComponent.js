import {EventEmitter} from "./EventEmitter.js";

export class CustomComponent extends EventEmitter{
  componentName = undefined;
  container = undefined;

  constructor(name) {
    super();
    this.componentName = name;
    this.container = document.createElement('div');
    this.renderComponent();
    document.body.append(this.container);
  }

  renderComponent() {
    const props = JSON.parse(window.localStorage.getItem(this.componentName));
    const propsWithoutPx = ['color', 'select'];

    for (let i = 0, len = props.length; i < len; i++) {
      const prop = props[i];
      const value = propsWithoutPx.includes(prop.type) ? prop.value : prop.value + 'px';
      if (this.container.style[prop.title] !== value) {
        this.container.style[prop.title] = value;
      }
    }
  }

  updateProperty(propName, value) {
    const props = JSON.parse(window.localStorage.getItem(this.componentName));

    for (let i = 0, len = props.length; i < len; i++) {
      const prop = props[i];
      if (prop.title === propName) {
        prop.value = value;
      }
    }

    window.localStorage.setItem(this.componentName, JSON.stringify(props));
    this.renderComponent();
  }

  loadProperties(props) {
    const storage = window.localStorage;
    storage.setItem(this.componentName, JSON.stringify(props));
  }
}