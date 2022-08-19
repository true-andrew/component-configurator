import {EventEmitter} from "./EventEmitter.js";
import {createDOMElement} from "../Helper Functions/helper.js";

export class ControlOption extends EventEmitter {
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
    const propContainer = createDOMElement('div', '', 'form__group');
    const labelElement = createDOMElement('label', title, 'form__label');
    labelElement.htmlFor = this.name;
    propContainer.append(labelElement);
    return propContainer;
  }

  initEventListener(element) {
    element.addEventListener('change', this);
  }
}

export class ControlOptionInput extends ControlOption {
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
    const inputElement = createDOMElement('input', '', 'form__field');

    if (this.max && this.min) {
      inputElement.max = this.max;
      inputElement.min = this.min;
    }

    inputElement.id = this.name;
    inputElement.required = true;
    inputElement.type = type;
    inputElement.value = value;
    super.initEventListener(inputElement);
    return inputElement;
  }
}

export class ControlOptionSelect extends ControlOption {
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
    const selectElement = createDOMElement('select', '', 'form__field');

    for (let i = 0, len = this.options.length; i < len; i++) {
      const optionName = this.options[i];
      const optionEl = createDOMElement('option', optionName);
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
  propsContainer = undefined;

  constructor(controlOption) {
    super(controlOption);
    this.mode = controlOption.mode;
    this.init(controlOption.title);
  }

  init(title) {
    this.container = this.createControlOptionArray(title);
    this.render();
  }

  handleEvent(e) {
    if (e.type === 'change') {
      this.setValue(e.target.value);
    } else if (e.type === 'click') {
      this.changeViewMode();
    } else {
      throw new Error(`Unknown event type: ${e.type}`);
    }

    this.emit('optionChanged', {
      optionName: this.name,
      optionValue: this.value,
      optionMode: this.mode,
    });
  }

  changeViewMode() {
    this.mode = this.mode === 'simple' ? 'advanced' : 'simple';
    this.setValue(this.value[0]);
    this.render();
  }

  setValue(value) {
    if (this.mode === 'simple') {
      this.value = this.value.fill(value);
    } else {
      const formContainer = this.container.lastChild;
      for (let i = 0, len = formContainer.children.length - 1; i < len; i++) {
        const formGroup = formContainer.children[i];
        const input = formGroup.firstChild;
        this.value[i] = input.value;
      }
    }
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

      const rectangle = createDOMElement('div', '', 'advanced_figure');
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
    const container =  createDOMElement('fieldset', '', 'form__row');
    const legend = createDOMElement('legend', title);
    legend.addEventListener('click', this);
    container.append(legend);
    this.propsContainer = createDOMElement('div', '');
    return container;
  }
}

export class ControlOptionTextarea extends ControlOption {
  constructor(controlOption) {
    super(controlOption);
    this.container = this.createControlOptionTextarea(controlOption.title);
  }

  createControlOptionTextarea(title) {
    const container = super.createPropContainerWithTitle(title);
    const label = container.firstChild;
    label.classList.add('form__label-textarea');
    const textarea = createDOMElement('textarea', '', 'form__textarea');
    textarea.value = this.value;
    super.initEventListener(textarea);
    container.prepend(textarea);
    return container;
  }
}