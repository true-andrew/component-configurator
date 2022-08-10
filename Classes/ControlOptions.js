import {EventEmitter} from "./EventEmitter.js";

export class ControlOption extends EventEmitter {
  type = undefined;
  value = undefined;
  title = undefined;

  constructor(controlOption) {
    super();
    this.type = controlOption.type;
    this.value = controlOption.value;
    this.title = controlOption.title;
  }

  handleEvent(ev) {
    this.emit('optionChanged', {
      type: 'optionChanged',
      optionName: this.title,
      optionValue: ev.target.value,
    })
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
    element.addEventListener('change', this);
  }
}

export class ControlOptionInput extends ControlOption {
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
    super.initEventListener(inputElement)
    return inputElement;
  }
}

export class ControlOptionRange extends ControlOptionInput {
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

export class ControlOptionNumberColor extends ControlOptionInput {
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

export class ControlOptionSelect extends ControlOption {
  container = undefined;
  options = undefined;

  constructor(controlOption) {
    super(controlOption);
    this.options = controlOption.options;
    this.container = this.create();
  }

  create() {
    const createdContainer = super.create();
    const selectElement = this.createSelect();
    createdContainer.prepend(selectElement);
    return createdContainer;
  }

  createSelect() {
    const selectElement = document.createElement('select');
    selectElement.classList.add('form__field');
    const optionElements = [];
    for (let i = 0, len = this.options.length; i < len; i++) {
      const optionEl = document.createElement('option');
      const optionName = this.options[i];
      optionEl.textContent = optionName;
      if (optionName === this.value) {
        optionEl.selected = true;
      }
      optionElements.push(optionEl);
    }
    selectElement.append(...optionElements);
    super.initEventListener(selectElement);
    return selectElement;
  }
}