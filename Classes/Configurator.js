import {EventEmitter} from "./EventEmitter.js";
import {ControlOptionSelect, ControlOptionArray, ControlOptionInput, ControlOptionTextarea} from "./ControlOptions.js";

class ComponentConfigurator extends EventEmitter {
  editingComponent = undefined;
  container = undefined;
  components = [];

  constructor(id) {
    super();
    this.container = document.getElementById(id);
    this.initChooseComponentListener();
  }

  handleEvent(e, data) {
    if (e === 'optionChanged') {
      this.editingComponent.updateProperty(data);
    } else if (e.type === 'click') {
      this.handleEvent_click(e);
    }
  }

  handleEvent_click(e) {
    const action = e.target.dataset.action;

    if (action !== undefined) {
      if (this[action] !== undefined) {
        this[action](e);
        e.stopImmediatePropagation();
      } else {
        throw new Error(`There is no such action: ${action}`);
      }
    } else {
      const clickTarget = e.composedPath();
      if (!clickTarget.includes(this.container)) {
        for (let i = 0, len = this.components.length; i < len; i++) {
          const component = this.components[i];
          if (clickTarget.includes(component.container)) {
            this.setEditingComponent(component);
            return;
          }
        }
      }
    }

  }

  registerComponent(component) {
    this.components.push(component);
  }

  initChooseComponentListener() {
    document.body.addEventListener('click', this);
  }

  show() {
    this.container.style.visibility = 'visible';
    this.container.style.opacity = '1';
  }

  hide() {
    this.container.style.visibility = 'hidden';
    this.container.style.opacity = '0';
  }

  changeTab(e) {
    if (e.target.classList.contains('form_tab_title-active')) {
      return;
    }
    const prevActiveTitle = document.getElementsByClassName('form__tab_title-active')[0];
    prevActiveTitle.classList.remove('form__tab_title-active');
    const prevTab = document.getElementById(prevActiveTitle.dataset.tab);
    prevTab.classList.remove('form__tab_active');

    e.target.classList.add('form__tab_title-active');
    const curTab = document.getElementById(e.target.dataset.tab);
    curTab.classList.add('form__tab_active');
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

  setEditingComponent(component) {
    if (this.editingComponent === component) {
      this.show();
      return;
    }
    this.editingComponent = component;
    const categories = this.findPropCategories(component.properties);
    const form = this.createForm(categories);
    this.renderForm(form);
  }

  findPropCategories(properties) {
    const categories = {};

    for (let i = 0, len = properties.length; i < len; i++) {
      const prop = properties[i];
      if (!categories.hasOwnProperty(prop.category)) {
        categories[prop.category] = [];
      }
      const propertyControl = this.createPropControl(prop);
      categories[prop.category].push(propertyControl);
    }

    return categories;
  }

  createPropControl(controlOption) {
    const newControl = createControl(controlOption);
    newControl.on('optionChanged', this);
    return newControl;
  }

  createForm(categories) {
    const form = document.createElement('form');
    form.classList.add('form');

    const iterableCategories = Object.keys(categories);
    const tabs = document.createElement('fieldset');
    tabs.classList.add('tabs');

    for (let i = 0, len = iterableCategories.length; i < len; i++) {
      const name = iterableCategories[i];
      const category = this.createCategory(name);
      const tabTitle = this.createTab(name);
      tabTitle.dataset.action = 'changeTab';
      tabTitle.dataset.tab = `tab-${i}`;
      category.id = `tab-${i}`;

      if (i === 0) {
        category.classList.add('form__tab_active');
        tabTitle.classList.add('form__tab_title-active');
      }

      tabTitle.addEventListener('click', this);
      tabs.append(tabTitle);

      for (let j = 0, len = categories[name].length; j < len; j++) {
        const propContainer = categories[name][j].container;
        category.append(propContainer);
      }
      form.append(category);
    }

    form.prepend(tabs);

    return form;
  }

  createTab(name) {
    const h4 = document.createElement('h4');
    h4.textContent = name;
    return h4;
  }

  createCategory() {
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('form__tab');
    return fieldset;
  }
}

const options = {
  'number': ControlOptionInput,
  'color': ControlOptionInput,
  'range': ControlOptionInput,
  'select': ControlOptionSelect,
  'array': ControlOptionArray,
  'text': ControlOptionInput,
  'textarea': ControlOptionTextarea
}

function createControl(controlOption) {
  const targetClass = options[controlOption.type];
  return new targetClass(controlOption);
}

export {ComponentConfigurator};