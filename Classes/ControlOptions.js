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
    let optionName = this.title;
    let optionValue = ev.target.value;
    if (this.type === 'array') {
      if (this.mode === 'simple') {
        this.value = this.value.fill(ev.target.value);
      } else {
        const formContainer = this.container.lastChild;
        for (let i = 0, len = formContainer.children.length - 1; i < len; i++) {
          const formGroup = formContainer.children[i];
          const input = formGroup.firstChild;
          this.value[i] = input.value;
        }
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
    this.container = this.create(this.title, this.type, this.value);
  }

  create(title, type, value) {
    const controlElement = super.create(title);
    const inputElement = this.createInput(title, type, value);
    controlElement.prepend(inputElement);
    return controlElement;
  }

  createInput(title, type, value) {
    const inputElement = document.createElement('input');
    inputElement.classList.add('form__field');
    inputElement.id = title;
    inputElement.required = true;
    inputElement.type = type;
    inputElement.value = value;
    super.initEventListener(inputElement);
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
    const input = super.createInput(this.title, this.type, this.value);
    input.max = this.max;
    input.min = this.min;
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

export class ControlOptionArray extends ControlOptionInput {
  sides = ['Top', 'Right', 'Bottom', 'Left'];
  mode = undefined;
  propsContainer = undefined;

  constructor(controlOption) {
    super(controlOption);
    this.mode = controlOption.mode;
    this.container = this.createCustomContainer();
    this.render();
  }

  handleEvent(ev) {
    if (ev.type === 'change') {
      super.handleEvent(ev);
    } else if (ev.type === 'click') {
      this.mode = this.mode === 'simple' ? 'advanced' : 'simple';
      this.value = this.value.fill(this.value[0]);
      this.emit('optionChanged', {
        type: 'optionChanged',
        optionName: this.title,
        optionValue: this.value
      })
      this.render();
    }
  }

  render() {
    this.propsContainer.textContent = '';
    if (this.mode === 'advanced') {
      this.propsContainer.classList.add('advanced_container');
      const inputProps = [];
      const rectangle = document.createElement('div');
      rectangle.classList.add('advanced_figure')
      for (let i = 0, len = this.value.length; i < len; i++) {
        const container = super.create('', 'number', this.value[i]);
        const className = 'advanced_input' + this.sides[i];
        container.classList.add(className);
        inputProps.push(container);
      }
      this.propsContainer.append(...inputProps, rectangle);
    } else if (this.mode === 'simple') {
      this.propsContainer.classList.remove('advanced_container');
      const simpleContainer = super.create('', 'number', this.value[0]);
      simpleContainer.style.padding = '0';
      this.propsContainer.append(simpleContainer);
    }

    this.container.append(this.propsContainer);
  }

  createCustomContainer() {
    const custom = document.createElement('fieldset');
    custom.classList.add('form__row');
    const legend = document.createElement('legend');
    legend.textContent = this.title;
    legend.addEventListener('click', this)
    custom.append(legend);
    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.propsContainer = document.createElement('div');

    return custom;
  }
}