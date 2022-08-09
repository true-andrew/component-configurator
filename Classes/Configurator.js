import {EventEmitter} from "./EventEmitter.js";
import {ControlOptionRange, ControlOptionNumberColor, ControlOptionSelect} from "./ControlOptions.js";

class ComponentConfigurator extends EventEmitter {
  editingComponent = undefined;
  container = undefined;

  handleEvent(e) {
    if (e.type === 'optionChanged') {
      this.editingComponent.updateProperty(e.data.optionName, e.data.optionValue);
    }
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
    this.container.style.visibility = 'visible';
    this.container.style.opacity = '1';
  }

  close() {
    this.container.remove();
  }

  makeCloseBtn() {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    // closeBtn.dataset.action = 'hide';
    closeBtn.classList.add('close-btn');
    closeBtn.dataset.eventName = 'onclose';
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
    if (this.editingComponent !== undefined) {
      this.close();
    }
    this.container = this.initContainer();
    this.on('onclose', this.close);
    document.body.append(this.container);
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
    newControl.on('optionChanged', this)
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

export {ComponentConfigurator};