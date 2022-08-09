class ComponentConfigurator {
  editingComponent = undefined;
  container = undefined;

  constructor() {
    this.container = this.initContainer();
    document.body.append(this.container);
    eventEmitter.on(
      'onchange',
      this,
      this.handleEvent_change
    );
  }

  handleEvent(ev) {
    const eventName = 'handleEvent_' + ev.type;
    if (this[eventName] !== undefined) {
      this[eventName](ev);
    } else {
      throw new Error(`Unhandled event: ${ev.type}`);
    }
  }

  handleEvent_change(element) {
    const value = element.value;
    const propName = element.dataset.propName;
    this.editingComponent.updateProperty(propName, value);
  }

  handleEvent_click(ev) {
    const action = ev.target.dataset.action;
    if (this[action] !== undefined) {
      this[action](ev);
    } else {
      throw new Error(`Unknown Action: ${action}`);
    }
  }

  initContainer() {
    const element = document.createElement('div');
    element.id = 'configurator';
    return element;
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
    return newControl.container;
  }
}

class ControlOption {
  type = undefined;
  value = undefined;
  title = undefined;

  constructor(controlOption) {
    this.type = controlOption.type;
    this.value = controlOption.value;
    this.title = controlOption.title;
  }

  create() {
    const propContainer = this.createContainer();
    const titleElement = this.createLabel();
    propContainer.append(titleElement);
    return propContainer;
  }

  createContainer() {
    const propContainer = document.createElement('div');
    propContainer.classList.add('form__group');
    return propContainer;
  }

  createLabel() {
    const labelElement = document.createElement('label');
    labelElement.classList.add('form__label');
    labelElement.htmlFor = this.title;
    labelElement.textContent = this.title;
    return labelElement;
  }

  initEventListener(element) {
    element.addEventListener('change', () => {
      eventEmitter.emit('onchange', element);
    });
  }
}

class ControlOptionInput extends ControlOption {
  container = undefined;

  constructor(controlOption) {
    super(controlOption);
  }

  create() {
    const controlElement = super.create();
    const inputElement = this.createInput();
    controlElement.prepend(inputElement);
    return controlElement;
  }

  createInput() {
    const inputElement = document.createElement('input');
    inputElement.classList.add('form__field');
    inputElement.id = this.title;
    inputElement.required = true;
    inputElement.type = this.type;
    inputElement.dataset.propName = this.title;
    super.initEventListener(inputElement);
    return inputElement;
  }
}

class ControlOptionRange extends ControlOptionInput {
  max = undefined;
  min = undefined;

  constructor(controlOption) {
    super(controlOption);
    this.max = controlOption.max;
    this.min = controlOption.min;
    this.container = super.create();
  }

  createInput() {
    const input = super.createInput();
    input.max = this.max;
    input.min = this.min;
    input.value = this.value;
    return input;
  }
}

class ControlOptionNumberColor extends ControlOptionInput {
  constructor(controlOption) {
    super(controlOption);
    this.container = super.create();
  }

  createInput() {
    const input = super.createInput();
    input.value = this.value;
    return input;
  }
}

class ControlOptionSelect extends ControlOption {
  container = undefined;
  options = undefined;
  constructor(controlOption) {
    super(controlOption);
    this.options = controlOption.options;
    this.container = this.create();
  }

  create() {
    const createdContainer =  super.create();
    const selectElement = this.createSelect();
    createdContainer.prepend(selectElement);
    return createdContainer;
  }

  createSelect() {
    const selectElement = document.createElement('select');
    selectElement.classList.add('form__field');
    selectElement.dataset.propName = this.title;
    const optionElements = [];
    for (let i = 0, len = this.options.length; i < len; i++) {
      const optionEl = document.createElement('option');
      optionEl.textContent = this.options[i];
      optionElements.push(optionEl);
    }
    selectElement.append(...optionElements);
    super.initEventListener(selectElement);
    return selectElement;
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

class EventEmitter {
  events = undefined;

  constructor() {
    this.events = {};
  }

  on(eventName, context, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push({fn, context});
  }

  off(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(({fn}) => callback !== fn);
  }

  emit(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.forEach(({fn, context}) => {
        fn.call(context, data);
      });
    } else {
      throw new Error('Unknown event' + eventName);
    }
  }
}

const eventEmitter = new EventEmitter();
const configurator = new ComponentConfigurator();
export {configurator};