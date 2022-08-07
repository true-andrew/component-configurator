import {props1, props2} from "./props.js";
import {configurator} from "./configurator.js";

class Component {
  componentName = undefined;
  container = undefined;

  constructor(name, props) {
    this.componentName = name;

    this.loadProperties(props);

    const component = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Component';
    editBtn.addEventListener('click', () => {
      configurator.editComponent(this);
    });
    component.append(editBtn);

    this.container = component;
    this.renderComponent();
    document.body.append(this.container);
  }

  renderComponent() {
    const props = JSON.parse(window.localStorage.getItem(this.componentName));

    for (let i = 0, len = props.length; i < len; i++) {
      const prop = props[i];
      const value = prop.type === 'number' ? prop.value + 'px' : prop.value;
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

    if (storage.getItem(this.componentName) === null) {
      storage.setItem(this.componentName, JSON.stringify(props));
    }
  }
}

const component = new Component('component1', props1);
const component2 = new Component('component2', props2);