import {EventEmitter} from "./EventEmitter.js";
import {ControlOptionRange, ControlOptionNumberColor, ControlOptionSelect} from "./ControlOptions.js";

class ComponentConfigurator extends EventEmitter {
  static editingComponent = undefined;
  static container = undefined;

  constructor() {
    super();
    ComponentConfigurator.container = this.initContainer();
    EventEmitter.on('onclose', this.hide);
    document.body.append(ComponentConfigurator.container);
  }

  // handleEvent(ev) {
  //   super.handleEvent(ev);
  //   const eventName = 'handleEvent_' + ev.type;
  //   if (this[eventName] !== undefined) {
  //     this[eventName](ev);
  //   } else {
  //     throw new Error(`Unhandled event: ${ev.type}`);
  //   }
  // }

  handleEvent_change(element) {
    const value = element.value;
    const propName = element.dataset.propName;
    ComponentConfigurator.editingComponent.updateProperty(propName, value);
  }

  // handleEvent_click(ev) {
  //   const action = ev.target.dataset.action;
  //   if (this[action] !== undefined) {
  //     this[action](ev);
  //   } else {
  //     throw new Error(`Unknown Action: ${action}`);
  //   }
  // }

  initContainer() {
    const element = document.createElement('div');
    element.id = 'configurator';
    return element;
  }

  show() {
    ComponentConfigurator.container.style.visibility = 'visible';
    ComponentConfigurator.container.style.opacity = '1';
  }

  hide() {
    ComponentConfigurator.container.style.visibility = 'hidden';
    ComponentConfigurator.container.style.opacity = '0';

  }

  makeCloseBtn() {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    // closeBtn.dataset.action = 'hide';
    closeBtn.classList.add('close-btn');
    closeBtn.dataset.eventName = 'onclose';
    closeBtn.addEventListener('click', EventEmitter.handleEvent);
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
    ComponentConfigurator.container.replaceChildren(header, form, closeBtn);
    this.show();
  }

  editComponent(component) {
    ComponentConfigurator.editingComponent = component;
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
    EventEmitter.on('onchange', this.handleEvent_change);
    return newControl.container;
  }
}

const options = {
  'number': ControlOptionNumberColor,
  'color': ControlOptionNumberColor,
  'range': ControlOptionRange,
  'select': ControlOptionSelect
}

function createControl(controlOption) {
  const targetClass = options[controlOption.type];
  return new targetClass(controlOption);
}

const configurator = new ComponentConfigurator();
export {ComponentConfigurator};