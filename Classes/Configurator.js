import {EventEmitter} from "./EventEmitter.js";
import {ControlOptionArray, ControlOptionInput, ControlOptionSelect, ControlOptionTextarea} from "./ControlOptions.js";
import {createDOMElement} from "../Helper Functions/helper.js";

class ComponentConfigurator extends EventEmitter {
  editingComponent = undefined;
  container = undefined;
  components = [];

  constructor(id) {
    super();
    this.init(id)
  }

  init(id) {
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
    const clickTarget = e.composedPath();
    if (!clickTarget.includes(this.container)) {
      for (let i = 0, len = this.components.length; i < len; i++) {
        const component = this.components[i];
        if (clickTarget.includes(component.container)) {
          this.setEditingComponent(component);
          return;
        }
      }
    } else {
      const action = e.target.dataset.action;
      if (action !== undefined) {
        if (this[action] !== undefined) {
          this[action](e);
          e.stopImmediatePropagation();
        } else {
          throw new Error(`There is no such action: ${action}`);
        }
      }
    }
  }

  registerComponent(component) {
    this.components.push(component);
  }
//TODO
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

  renderForm(form) {
    const header = createDOMElement('h2', undefined, 'Configurator');
    const closeBtn = createDOMElement('button', 'close-btn', 'Close', {
      'action': 'hide'
    });
    closeBtn.addEventListener('click', this);
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
    const form = createDOMElement('form', 'form');

    const iterableCategories = Object.keys(categories);
    const tabs = createDOMElement('fieldset', 'tabs');

    for (let i = 0, len = iterableCategories.length; i < len; i++) {
      const name = iterableCategories[i];
      const category = createDOMElement('fieldset', 'form__tab');
      category.id = 'tab-' + i;
      const tabTitle = createDOMElement('h4', 'form__tab-title', name, {
        'action': 'changeTab',
        'tab': 'tab-' + i,
      });

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