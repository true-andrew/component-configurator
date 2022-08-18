import {EventEmitter} from "./EventEmitter.js";

export class ControlOption extends EventEmitter {
  type = undefined;
  value = undefined;
  name = undefined;
  container = undefined;

  constructor(controlOption) {
    super();
    this.type = controlOption.type;
    this.value = controlOption.value;
    this.name = controlOption.name;
  }

  handleEvent(ev) {
    const optionName = this.name;
    const optionValue = ev.target.value;
    this.emit('optionChanged', {
      optionName,
      optionValue,
    });
  }

  createPropContainerWithTitle(title) {
    const propContainer = document.createElement('div');
    propContainer.classList.add('form__group');
    const labelElement = document.createElement('label');
    labelElement.classList.add('form__label');
    labelElement.htmlFor = title;
    labelElement.textContent = title;
    propContainer.append(labelElement);
    return propContainer;
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
    this.container = this.createControlOptionInput(controlOption.title, this.type, this.value);
  }

  createControlOptionInput(title, type, value) {
    const controlElement = super.createPropContainerWithTitle(title);
    const inputElement = this.createInputElement(type, value);
    controlElement.prepend(inputElement);
    return controlElement;
  }

  createInputElement(type, value) {
    const inputElement = document.createElement('input');
    inputElement.max = this.max;
    inputElement.min = this.min;
    inputElement.classList.add('form__field');
    inputElement.id = this.name;
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
    this.container = this.createControlOptionSelect(controlOption.title);
  }

  createControlOptionSelect(title) {
    const createdContainer = super.createPropContainerWithTitle(title);
    const selectElement = this.createSelectElement();
    createdContainer.prepend(selectElement);
    return createdContainer;
  }

  createSelectElement() {
    const selectElement = document.createElement('select');
    selectElement.classList.add('form__field');

    for (let i = 0, len = this.options.length; i < len; i++) {
      const optionEl = document.createElement('option');
      const optionName = this.options[i];
      optionEl.textContent = optionName;
      if (optionName === this.value) {
        optionEl.selected = true;
      }
      selectElement.append(optionEl);
    }

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
    this.container = this.createControlOptionArray(controlOption.title);
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
    } else {
      throw new Error(`Unknown event type: ${e.type}`);
    }

    this.emit('optionChanged', {
      optionName: this.name,
      optionValue: this.value,
      optionMode: this.mode,
    });
  }

  render() {
    this.propsContainer.textContent = '';
    if (this.mode === 'advanced') {
      this.propsContainer.classList.add('advanced_container');

      for (let i = 0, len = this.value.length; i < len; i++) {
        const container = super.createControlOptionInput('', 'number', this.value[i]);
        const className = 'advanced_input' + this.sides[i];
        container.classList.add(className);
        this.propsContainer.append(container);
      }

      const rectangle = document.createElement('div');
      rectangle.classList.add('advanced_figure');
      this.propsContainer.append(rectangle);
    } else if (this.mode === 'simple') {
      this.propsContainer.classList.remove('advanced_container');
      const simpleContainer = super.createControlOptionInput('', 'number', this.value[0]);
      simpleContainer.classList.add('simple_input');
      this.propsContainer.append(simpleContainer);
    }

    this.container.append(this.propsContainer);
  }

  createControlOptionArray(title) {
    const container = document.createElement('fieldset');
    container.classList.add('form__row');
    const legend = document.createElement('legend');
    legend.textContent = title;
    legend.addEventListener('click', this);
    container.append(legend);
    this.propsContainer = document.createElement('div');
    return container;
  }
}

export class ControlOptionTextarea extends ControlOption{
  constructor(controlOption) {
    super(controlOption);
    this.container = this.createTextArea(controlOption.title);
  }

  createTextArea(title) {
    const container = super.createPropContainerWithTitle(title);
    const label = container.firstChild;
    label.classList.add('form__label-textarea');
    const textarea = document.createElement('textarea');
    textarea.classList.add('form__textarea');
    super.initEventListener(textarea);
    textarea.value = this.value;
    container.prepend(textarea);
    return container;
  }
}