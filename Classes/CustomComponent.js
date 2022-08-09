import {ComponentConfigurator} from "./Configurator.js";

export class CustomComponent {
  componentName = undefined;
  container = undefined;

  constructor(name) {
    this.componentName = name;

    const component = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Component';
    editBtn.addEventListener('click', () => {
      const component = new ComponentConfigurator()
      component.editComponent(this);
    });
    component.append(editBtn);
    this.container = component;
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