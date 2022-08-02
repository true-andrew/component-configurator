import props from './props.js';

function ComponentConfigurator() {
  this.container = this.initContainer();
  document.body.append(this.container);
}

ComponentConfigurator.prototype.editingComponent = undefined;
ComponentConfigurator.prototype.container = undefined;
ComponentConfigurator.prototype.editForm = undefined;

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
  const componentProps = this.editingComponent[this.editingComponent.container.dataset.propsId];
  for (let i = 0, len = ev.target.length - 1; i < len; i++) {
    const input = ev.target[i];
    componentProps[input.dataset.key] = input.value;
  }
  this.editingComponent.applyStyles();
}

ComponentConfigurator.prototype.createEditForm = function (component) {
  if (this.editingComponent !== undefined) {
    return;
  }

  this.editingComponent = component;
  this.initEditForm();
  const categories = component.componentProps.categories;
  for (let key in categories) {

  }
  for (let i = 0, len = Object.keys(categories).length; i < len; i++) {
    console.log(len);
  }

  const submitChangesButton = document.createElement('button');
  submitChangesButton.type = 'submit';
  submitChangesButton.textContent = 'Submit';

  this.editForm.append(submitChangesButton);

  this.editForm.addEventListener('submit', this);

  this.container.append(this.editForm);
}

function determineFieldTypeByKey(key) {
  const regExp = /color/i;
  if (regExp.test(key)) {
    return 'color';
  } else {
    return 'number';
  }
}

const configurator = new ComponentConfigurator();

//Custom Div Element
function Component() {
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
  this.applyStyles();
  document.body.append(this.container);
}

Component.prototype.renderComponent = function () {

    searchStyles(this.componentProps, this.container.style);
    console.log(this.container.style.borderStyle);
}

const searchStyles = function (node, styles) {
  if (node.hasOwnProperty('cssName')) {
    // console.log(node);
    styles[node.cssName] = node.value + node.units;
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      searchStyles(node.children[i], styles);
    }
  }}

Component.prototype.applyStyles = function (styles) {
  for (let key in this.componentProps) {
    const type = determineFieldTypeByKey(key);
    if (type === 'number') {
      this.container.style[key] = this.componentProps[key] + 'px';
    } else {
      this.container.style[key] = this.componentProps[key];
    }
  }
}

const component = new Component();


let rootNode = document.createElement('form');
let currentNode = rootNode;

const createFormFromTree = function (node) {
  // console.log("Visiting Node " + tree.title);
  const el = document.createElement(node.htmlName);
  currentNode.append(el);
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
    const br = document.createElement('br');
    el.after(br);
  } else if (node.htmlName === 'select') {
    const label = document.createElement('label');
    label.textContent = node.title;
    el.before(label);
    currentNode = el;
  } else if (node.htmlName === 'option') {
    el.textContent = node.title;
  }

  // Recurse with all children
  traverse(node, createFormFromTree);

  currentNode = el.parentElement;
  // console.log("Went through all children of " + tree.title + ", returning to it's parent.");
  return null;
};

function traverse(node, func) {
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      func(node.children[i]);
    }
  }
}

createFormFromTree(props);

document.body.append(rootNode);
