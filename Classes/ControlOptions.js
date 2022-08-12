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
    let optionName = ev.target.id;
    let optionValue = ev.value;
    if (this.type === 'array') {
      for (let i = 1, len = this.container.children.length; i < len; i++) {
        const formGroup = this.container.children[i];
        const input = formGroup.firstChild;
        this.value[i - 1] = input.value;
      }
      optionName = this.title;
      optionValue = this.value;
    }
    this.emit('optionChanged', {
      type: 'optionChanged',
      optionName,
      optionValue,
    })
  }

  create(title) {
    const propContainer = this.createContainer();
    const titleElement = this.createLabel(title);
    propContainer.append(titleElement);
    return propContainer;
  }

  createContainer() {
    const propContainer = document.createElement('div');
    propContainer.classList.add('form__group');
    return propContainer;
  }

  createLabel(title) {
    const labelElement = document.createElement('label');
    labelElement.classList.add('form__label');
    labelElement.htmlFor = title;
    labelElement.textContent = title;
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

  create(title, type, value) {
    const controlElement = super.create(title);
    const inputElement = this.createInput(title, type, value);
    controlElement.prepend(inputElement);
    return controlElement;
  }

  createInput(title, type) {
    const inputElement = document.createElement('input');
    inputElement.classList.add('form__field');
    inputElement.id = title;
    inputElement.required = true;
    inputElement.type = type;
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
    this.container = super.create(this.title);
  }

  createInput() {
    const input = super.createInput(this.title, this.type);
    input.max = this.max;
    input.min = this.min;
    input.value = this.value;
    return input;
  }
}

export class ControlOptionNumberColor extends ControlOptionInput {
  constructor(controlOption) {
    super(controlOption);
    this.container = super.create(this.title, this.type, this.value);
  }

  createInput(title, type, value) {
    const input = super.createInput(title, type);
    input.value = value;
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
    const createdContainer = super.create(this.title);
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

export class ControlOptionArray extends ControlOptionNumberColor {
  sides = ['Top', 'Right', 'Bottom', 'Left'];

  constructor(controlOption) {
    super(controlOption);
    this.container = this.createCustomContainer();

    const inputProps = []
    for (let i = 0, len = this.value.length; i < len; i++) {
      const newTitle = this.title + this.sides[i];
      const container = super.create(newTitle, 'number', this.value[i]);
      inputProps.push(container);
    }
    this.container.append(...inputProps);

  }

  createCustomContainer() {
    const custom = document.createElement('fieldset');
    custom.classList.add('form__row');
    const legend = document.createElement('legend');
    legend.textContent = this.title;
    custom.append(legend);
    // const checkbox = document.createElement('input');
    // checkbox.type = 'checkbox';
    // custom.append(checkbox);

    return custom;
  }
}