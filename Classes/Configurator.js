import {EventEmitter} from "./EventEmitter.js";
import {ControlOptionSelect, ControlOptionArray, ControlOptionInput} from "./ControlOptions.js";

class ComponentConfigurator extends EventEmitter {
  editingComponent = undefined;
  container = undefined;
  components = [];

  constructor(id) {
    super();
    this.container = document.getElementById(id);
    this.initChooseComponentListener();
  }

  handleEvent(e, data) {
    if (e === 'optionChanged') {
      this.editingComponent.updateProperty(data);
    } else if (e.type === 'click') {
      this.handleEvent_click(e);
    }
  }

  handleEvent_click(ev) {
    const action = ev.target.dataset.action;

    if (action !== undefined) {
      if (this[action] !== undefined) {
        this[action](ev);
      } else {
        throw new Error(`There is no such action: ${action}`);
      }
    } else {
      const clickTarget = ev.composedPath();
      if (!clickTarget.includes(this.container)) {
        for (let i = 0, len = this.components.length; i < len; i++) {
          const component = this.components[i];
          if (clickTarget.includes(component.container)) {
            this.setEditingComponent(component);
          }
        }
      }
    }
  }

  register(component) {
    this.components.push(component);
  }

  initChooseComponentListener() {
    document.body.addEventListener('click', this);
  }

  show() {
    this.container.style.visibility = 'visible';
    this.container.style.opacity = '1';
  }

  hide() {
    this.container.style.visibility = 'hidden';
    this.container.style.opacity = '0';
  }

  makeCloseBtn() {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.dataset.action = 'hide';
    closeBtn.classList.add('close-btn');
    closeBtn.addEventListener('click', this);
    return closeBtn;
  }

  makeHeader() {
    const header = document.createElement('h2');
    header.textContent = 'Configuration';
    return header;
  }

  renderForm(form) {
    const header = this.makeHeader();
    const closeBtn = this.makeCloseBtn();
    this.container.replaceChildren(header, form, closeBtn);
    this.show();
  }

  setEditingComponent(component) {
    if (this.editingComponent === component) {
      this.show();
      return;
    }
    this.editingComponent = component;
    const categories = this.findPropCategories(component.properties);
    const form = this.createForm(categories);
    this.renderForm(form);
  }

  findPropCategories(properties) {
    const categories = {};

    for (let i = 0, len = properties.length; i < len; i++) {
      const prop = properties[i];
      if (!categories.hasOwnProperty(prop.category)) {
        categories[prop.category] = [];
      }
      const propertyControl = this.createPropControl(prop);
      categories[prop.category].push(propertyControl);
    }

    return categories;
  }

  createPropControl(controlOption) {
    const newControl = createControl(controlOption);
    newControl.on('optionChanged', this);
    return newControl;
  }

  createForm(categories) {
    const form = document.createElement('form');
    form.classList.add('form');

    const iterableCategories = Object.keys(categories);

    for (let i = 0, len = iterableCategories.length; i < len; i++) {
      const key = iterableCategories[i];
      const category = this.createCategory(key);
      for (let j = 0, len = categories[key].length; j < len; j++) {
        const propContainer = categories[key][j].container;
        category.append(propContainer);
      }
      form.append(category);
    }

    return form;
  }

  createCategory(name) {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = name;
    fieldset.append(legend);
    return fieldset;
  }
}

const options = {
  'number': ControlOptionInput,
  'color': ControlOptionInput,
  'range': ControlOptionInput,
  'select': ControlOptionSelect,
  'array': ControlOptionArray,
}

function createControl(controlOption) {
  const targetClass = options[controlOption.type];
  return new targetClass(controlOption);
}

export {ComponentConfigurator};