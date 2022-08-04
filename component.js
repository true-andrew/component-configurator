import {props1, props2} from "./props.js";
import {configurator} from "./configurator.js";

function Component(name, props) {
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

Component.prototype.renderComponent = function () {
  const props = JSON.parse(window.localStorage.getItem(this.componentName));

  for (let i = 0, len = props.length; i < len; i++) {
    const prop = props[i];
    this.container.style[prop.title] = prop.type === 'number' ? prop.value + 'px' : prop.value;
  }

}

Component.prototype.applyStyles = function (styles) {
  this.container.style.display = 'none';
  for (let key in styles) {
    this.container.style[key] = styles[key];
  }
  this.container.style.display = '';
}

Component.prototype.updateProperty = function (propName, value) {
  const props = JSON.parse(window.localStorage.getItem(this.componentName));

  for (let i = 0, len = props.length; i < len; i++) {
    const prop = props[i];
    if (prop.title === propName && prop.value !== value) {
      prop.value = value;
    }
  }

  window.localStorage.setItem(this.componentName, JSON.stringify(props));
  this.renderComponent();
}

Component.prototype.loadProperties = function (props) {
  const storage = window.localStorage;

  if (storage.getItem(this.componentName) === null) {
    storage.setItem(this.componentName, JSON.stringify(props));
  }
}

const component = new Component('component1', props1);
const component2 = new Component('component2', props2);