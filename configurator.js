function ComponentConfigurator() {
  this.container = this.initContainer();
  document.body.append(this.container);
}

ComponentConfigurator.prototype.editingComponent = undefined;
ComponentConfigurator.prototype.container = undefined;
ComponentConfigurator.prototype.editForm = undefined;

ComponentConfigurator.prototype.handleEvent = function (ev) {
  const eventName = 'handleEvent_' + ev.type;
  if (this[eventName] !== undefined) {
    this[eventName](ev);
  } else {
    throw new Error(`Unhandled event: ${ev.type}`);
  }
}

ComponentConfigurator.prototype.handleEvent_change = function (ev) {
  const value = ev.target.value;
  const propName = ev.target.dataset.propName;
  this.editingComponent.updateProperty(propName, value);
}

ComponentConfigurator.prototype.handleEvent_click = function (ev) {
  const action = ev.target.dataset.action;
  if (this[action] !== undefined) {
    this[action](ev);
  } else {
    throw new Error(`Unknown Action: ${action}`);
  }
}

ComponentConfigurator.prototype.initContainer = function () {
  const element = document.createElement('div');
  element.id = 'configurator'
  return element;
}

ComponentConfigurator.prototype.show = function () {
  this.container.style.display = 'flex';
}

ComponentConfigurator.prototype.hide = function () {
  this.container.style.display = 'none';
}

ComponentConfigurator.prototype.initEditForm = function (component) {
  this.editForm = document.createElement('form');

  const elementsArr = JSON.parse(window.localStorage.getItem(component.componentName));
  const form = this.createForm(elementsArr);
  this.editForm.append(form);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.dataset.action = 'hide';
  closeBtn.addEventListener('click', this);

  this.container.replaceChildren(this.editForm, closeBtn);
}

/*
componentName.width = '450',
localstorage.getItem('componentName');
localstorage.getItem('componentName.???');
 */

ComponentConfigurator.prototype.editComponent = function (component) {
  this.editingComponent = component;

  this.initEditForm(component);

  this.show();
}

ComponentConfigurator.prototype.createForm = function (elementsArr) {
  const form = document.createDocumentFragment();
  const categories = {};

  for (let i = 0, len = elementsArr.length; i < len; i++) {
    const element = elementsArr[i];
    if (!categories.hasOwnProperty(element.category)) {
      categories[element.category] = [];
    }
    const propertyControl = this.createPropControl(element);
    categories[element.category].push(propertyControl);
  }

  for (let key in categories) {
    const category = this.createCategory(key);
    category.append(...categories[key]);
    form.append(category);
  }

  return form;
}

ComponentConfigurator.prototype.createCategory = function (name) {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = name;
  fieldset.append(legend);
  return fieldset;
}

ComponentConfigurator.prototype.createPropControl = function (obj) {
  const propContainer = document.createElement('div');
  const inputElement = document.createElement('input');
  const titleElement = document.createElement('label');
  titleElement.textContent = obj.title;
  inputElement.type = obj.type;
  inputElement.value = obj.value;
  inputElement.dataset.propName = obj.title
  inputElement.addEventListener('change', this);
  propContainer.append(titleElement, inputElement);
  return propContainer;
}

export const configurator = new ComponentConfigurator();