class ComponentConfigurator {
  editingComponent = undefined;
  container = undefined;

  constructor() {
    this.container = this.initContainer();
    document.body.append(this.container);
  }

  handleEvent(ev) {
    const eventName = 'handleEvent_' + ev.type;
    if (this[eventName] !== undefined) {
      this[eventName](ev);
    } else {
      throw new Error(`Unhandled event: ${ev.type}`);
    }
  }

  handleEvent_change(ev) {
    const value = ev.target.value;
    const propName = ev.target.dataset.propName;
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
    this.container.style.display = 'flex';
  }

  hide() {
    this.container.style.display = 'none';
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
    const propContainer = document.createElement('div');
    const titleElement = document.createElement('label');
    titleElement.classList.add('form__label');
    titleElement.textContent = controlOption.title;
    propContainer.classList.add('form__group');
    const inputElement = document.createElement('input');
    inputElement.classList.add('form__field');
    inputElement.required = true;
    inputElement.type = controlOption.type;
    inputElement.value = controlOption.value;
    inputElement.dataset.propName = controlOption.title;
    inputElement.addEventListener('change', this);
    propContainer.append(inputElement, titleElement);
    return propContainer;
  }
}

class ControlOption {
  constructor() {

  }
}

const configurator = new ComponentConfigurator()
export {configurator};