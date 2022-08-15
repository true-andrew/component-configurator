import {EventEmitter} from "./EventEmitter.js";

export class ControlOption extends EventEmitter {
  type = undefined;
  value = undefined;
  title = undefined;
  container = undefined;

  constructor(controlOption) {
    super();
    this.type = controlOption.type;
    this.value = controlOption.value;
    this.title = controlOption.title;
  }

  handleEvent(ev) {
    const optionName = this.title;
    const optionValue = ev.target.value;
    this.emit({
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
  max = undefined;
  min = undefined;

  constructor(controlOption) {
    super(controlOption);
    if (controlOption.max !== undefined && controlOption.min !== undefined) {
      this.min = controlOption.min;
      this.max = controlOption.max;
    }
    this.container = this.createControlOptionInput(this.title, this.type, this.value);
  }

  createControlOptionInput(title, type, value) {
    const controlElement = super.create(title);
    const inputElement = this.createInputElement(title, type, value);
    controlElement.prepend(inputElement);
    return controlElement;
  }

  createInputElement(title, type, value) {
    const inputElement = document.createElement('input');
    inputElement.max = this.max;
    inputElement.min = this.min;
    inputElement.classList.add('form__field');
    inputElement.id = title;
    inputElement.required = true;
    inputElement.type = type;
    inputElement.value = value;
    super.initEventListener(inputElement);
    return inputElement;
  }
}

export class ControlOptionSelect extends ControlOption {
  options = undefined;

  constructor(controlOption) {
    super(controlOption);
    this.options = controlOption.options;
    this.container = this.createControlOptionSelect();
  }

  createControlOptionSelect() {
    const createdContainer = super.create(this.title);
    const selectElement = this.createSelectElement();
    createdContainer.prepend(selectElement);
    return createdContainer;
  }

  createSelectElement() {
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

export class ControlOptionArray extends ControlOptionInput {
  sides = ['Top', 'Right', 'Bottom', 'Left'];
  mode = undefined;
  propsContainer = undefined;

  constructor(controlOption) {
    super(controlOption);
    this.mode = controlOption.mode;
    this.container = this.createControlOptionArray();
    this.render();
  }

  handleEvent(e) {
    if (e.type === 'change') {
      if (this.mode === 'simple') {
        this.value = this.value.fill(e.target.value);
      } else {
        const formContainer = this.container.lastChild;
        for (let i = 0, len = formContainer.children.length - 1; i < len; i++) {
          const formGroup = formContainer.children[i];
          const input = formGroup.firstChild;
          this.value[i] = input.value;
        }
      }
    } else if (e.type === 'click') {
      this.mode = this.mode === 'simple' ? 'advanced' : 'simple';
      this.value = this.value.fill(this.value[0]);
      this.render();
    }

    this.emit({
      type: 'optionChanged',
      optionName: this.title,
      optionValue: this.value,
      optionMode: this.mode,
    });
  }

  render() {
    this.propsContainer.textContent = '';
    if (this.mode === 'advanced') {
      this.propsContainer.classList.add('advanced_container');
      const inputProps = [];

      for (let i = 0, len = this.value.length; i < len; i++) {
        const container = super.createControlOptionInput('', 'number', this.value[i]);
        const className = 'advanced_input' + this.sides[i];
        container.classList.add(className);
        inputProps.push(container);
      }

      const rectangle = document.createElement('div');
      rectangle.classList.add('advanced_figure');
      this.propsContainer.append(...inputProps, rectangle);
    } else if (this.mode === 'simple') {
      this.propsContainer.classList.remove('advanced_container');
      const simpleContainer = super.createControlOptionInput('', 'number', this.value[0]);
      simpleContainer.classList.add('simple_input');
      this.propsContainer.append(simpleContainer);
    }

    this.container.append(this.propsContainer);
  }

  createControlOptionArray() {
    const container = document.createElement('fieldset');
    container.classList.add('form__row');
    const legend = document.createElement('legend');
    legend.textContent = this.title;
    legend.addEventListener('click', this);
    container.append(legend);
    this.propsContainer = document.createElement('div');
    return container;
  }
}