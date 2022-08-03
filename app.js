import props from './props.js';

function ComponentConfigurator() {
  this.container = this.initContainer();
  document.body.append(this.container);
}

ComponentConfigurator.prototype.editingComponent = undefined;
ComponentConfigurator.prototype.container = undefined;
ComponentConfigurator.prototype.editForm = undefined;

//TODO доделать
ComponentConfigurator.prototype.handleEvent = function (ev) {
  if (ev.type === 'submit') {
    this.submitChanges(ev);
  } else if (ev.type === 'click') {
    this.closeConfigurator();
  } else {
    throw new Error(`Unhandled event: ${ev}`);
  }
}

ComponentConfigurator.prototype.initContainer = function () {
  const element = document.createElement('div');
  element.id = 'configurator'
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.dataset.action = 'closeConfigurator';
  closeBtn.addEventListener('click', this);
  element.append(closeBtn);
  return element;
}

ComponentConfigurator.prototype.show = function () {
  this.container.style.display = 'block';
}

ComponentConfigurator.prototype.hide = function () {
  this.container.style.display = 'none';
}

ComponentConfigurator.prototype.closeConfigurator = function () {
  this.hide();
  this.editingComponent = undefined;
  this.editForm.remove();
}

ComponentConfigurator.prototype.initEditForm = function () {
  this.editForm = document.createElement('form');
}

//TODO improve submitting
ComponentConfigurator.prototype.submitChanges = function (ev) {
  ev.preventDefault();
  const styles = {};
  const formElements = ev.target;

  for (let i = 0, len = formElements.length - 1; i < len; i++) {
    const element = formElements[i];
    if (element.tagName !== 'FIELDSET') {
      styles[element.dataset.cssName] = element.value + (element.dataset.units || '');
    }
  }

  this.editingComponent.applyStyles(styles);
  //TODO

  // this.editingComponent.updateProps(styles);
}

ComponentConfigurator.prototype.createEditForm = function (component) {
  this.editingComponent = component;
  this.initEditForm();

  const docFragment = createForm(this.editingComponent.componentProps);
  this.editForm.append(docFragment);

  const submitChangesButton = document.createElement('button');
  submitChangesButton.type = 'submit';
  submitChangesButton.textContent = 'Submit';

  this.editForm.append(submitChangesButton);

  this.editForm.addEventListener('submit', this);

  this.container.replaceChildren(this.editForm);
}

const configurator = new ComponentConfigurator();

//Custom Div Element
function Component() {
  // this.componentName = 'sdjsdjsjd' // sdjsdjsjd_props
  this.componentProps = props;
  const component = document.createElement('div');
  const editBtn = document.createElement('button');
  // component.dataset.props = JSON.stringify(props);
  editBtn.textContent = 'Edit Component';
  editBtn.addEventListener('click', () => {
    configurator.show();
    configurator.createEditForm(this);
  });
  component.append(editBtn);
  // component.dataset.propsId = 'componentProps';

  this.container = component;
  this.renderComponent();
  document.body.append(this.container);
}

Component.prototype.renderComponent = function () {
  const styles = {};
  getStylesFromTree(this.componentProps, styles);
  this.applyStyles(styles);
}

Component.prototype.applyStyles = function (styles) {
  this.container.style.display = 'none';
  for (let key in styles) {
    this.container.style[key] = styles[key];
  }
  this.container.style.display = '';
}

Component.prototype.updateProperty = function (property) {
  /// conponent.mewthodToChangeProp
  /// localstarage.setItem
  // switch (propertyName) {
  //   case "color":
  //     domEl.style.background = 'propertyValue'
  //     break
  //   default:
  //     break
  // }
}

const getStylesFromTree = function (node, styles) {
  // TODO  this.component.getProperties || localstorage.getItem sjon parse

  if (node.hasOwnProperty('cssName')) {
    styles[node.cssName] = node.value + node.units;
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      getStylesFromTree(node.children[i], styles);
    }
  }
}

const createForm = function (elementsArr) {
  const result = document.createDocumentFragment();
  const categories = {};

  for (let i = 0, len = elementsArr.length; i < len; i++) {
    const element = elementsArr[i];
    if (!categories.hasOwnProperty(element.category)) {
      categories[element.category] = [];
    }
    const propertyControl = createPropControl(element);
    categories[element.category].push(propertyControl);
  }

  for (let key in categories) {
    const category = createCategory(key);
    category.append(...categories[key]);
    result.append(category);
  }

  return result;
}

function createCategory(name) {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = name;
  fieldset.append(legend);
  return fieldset;
}

function createPropControl(obj) {
  const propContainer = document.createElement('div');
  const element = document.createElement('input');
  const title = document.createElement('label');
  title.textContent = obj.title;
  element.type = obj.type;
  element.value = obj.value;
  propContainer.append(title, element);
  return propContainer;
}

const createFormFromTree = function (node, currentNode) {
  const el = document.createElement(node.htmlName);
  currentNode.append(el);
  // TODO
  //const propertyControl = createPropControl(node.htmlName) // getPropsControl("positiveInt")
  if (node.htmlName === 'fieldset') {
    currentNode = el;
    const legend = document.createElement('legend');
    legend.textContent = node.title;
    el.append(legend);
  } else if (node.htmlName === 'input') {
    const label = document.createElement('label');
    label.textContent = node.title;
    el.before(label);
    el.value = node.value;
    el.type = node.type;
    el.dataset.cssName = node.cssName;
    el.dataset.units = node.units;
    const br = document.createElement('br');
    el.after(br);
  } else if (node.htmlName === 'select') {
    const label = document.createElement('label');
    label.textContent = node.title;
    el.before(label);
    el.dataset.cssName = node.cssName;
    currentNode = el;
  } else if (node.htmlName === 'option') {
    el.textContent = node.title;
  }

  // Recurse with all children
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      createFormFromTree(node.children[i], currentNode);
    }
  }
  return null;
};

const component = new Component();
const component2 = new Component();