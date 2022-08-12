import {EventEmitter} from "./EventEmitter.js";
import {
  ControlOptionRange,
  ControlOptionNumberColor,
  ControlOptionSelect,
  ControlOptionArray
} from "./ControlOptions.js";

class ComponentConfigurator extends EventEmitter {
  editingComponent = undefined;
  container = undefined;
  components = [];

  constructor() {
    super();
    this.container = this.initContainer();
    document.body.append(this.container);
    this.chooseComponent();
  }

  handleEvent(e) {
    if (e.type === 'optionChanged') {
      this.editingComponent.updateProperty(e.optionName, e.optionValue);
    } else if (e.type === 'click') {
      this.handleEvent_click(e);
    }
  }

  handleEvent_click(ev) {
    const action = ev.target.dataset.action;
    if (this[action] !== undefined) {
      this[action](ev);
    } else if (action === undefined) {
      if (!ev.composedPath().includes(this.container)) {
        for (let i = 0, len = this.components.length; i < len; i++) {
          const component = this.components[i];
          if (ev.composedPath().includes(component.container)) {
            this.editComponent(component);
          }
        }
      }
    } else {
      throw new Error(`There is no such action: ${action}`);
    }
  }

  register(component) {
    this.components.push(component);
  }

  initContainer() {
    const element = document.createElement('div');
    element.id = 'configurator';
    return element;
  }

  chooseComponent() {
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

  editComponent(component) {
    if (this.editingComponent === component) {
      this.show();
      return;
    }
    this.editingComponent = component;
    const formFields = this.findFormFields(component);
    const form = this.createForm(formFields);
    this.renderForm(form);
  }

  findFormFields(component) {
    const elementsArr = JSON.parse(window.localStorage.getItem(component.componentName));

    const formFields = {};

    for (let i = 0, len = elementsArr.length; i < len; i++) {
      const element = elementsArr[i];
      if (!formFields.hasOwnProperty(element.category)) {
        formFields[element.category] = [];
      }
      const propertyControl = this.createPropControl(element);
      formFields[element.category].push(propertyControl);
    }

    return formFields;
  }

  createForm(formFields) {
    const form = document.createElement('form');
    form.classList.add('form');

    for (let field in formFields) {
      const category = this.createCategory(field);
      category.append(...formFields[field]);
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

  createPropControl(controlOption) {
    const newControl = createControl(controlOption);
    newControl.on('optionChanged', this);
    return newControl.container;
  }
}

const options = {
  'number': ControlOptionNumberColor,
  'color': ControlOptionNumberColor,
  'range': ControlOptionRange,
  'select': ControlOptionSelect,
  'array': ControlOptionArray,
}

function createControl(controlOption) {
  const targetClass = options[controlOption.type];
  return new targetClass(controlOption);
}

export {ComponentConfigurator};