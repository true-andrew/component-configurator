import {EventEmitter} from "./EventEmitter.js";
import {ControlOptionArray, ControlOptionInput, ControlOptionSelect, ControlOptionTextarea} from "./ControlOptions.js";
import {createDOMElement} from "../Helper Functions/helper.js";

class ComponentConfigurator extends EventEmitter {
  editingComponent = undefined;
  container = undefined;
  currentTab = undefined;
  tabs = [];

  constructor(id) {
    super();
    this.init(id)
  }

  init(id) {
    this.container = document.getElementById(id);
    super.on('chooseComponent', this);
  }

  handleEvent(e, data) {
    if (e === 'optionChanged') {
      this.editingComponent.updateProperty(data);
    } else if (e === 'chooseComponent') {
      this.setEditingComponent(data);
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
    }
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
    if (e.target === this.currentTab.title) {
      return;
    }
    this.currentTab.title.classList.remove('form__tab_title-active');
    this.currentTab.container.classList.remove('form__tab_active');

    this.currentTab.title = e.target;
    this.currentTab.container = this.tabs[this.currentTab.title.dataset.tab];

    this.currentTab.title.classList.add('form__tab_title-active');
    this.currentTab.container.classList.add('form__tab_active');
  }

  renderForm(form) {
    const header = createDOMElement('h2', 'Configurator');
    const closeBtn = createDOMElement('button', 'Close', 'close-btn', {
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
    this.tabs = [];
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
    const form = createDOMElement('form', '', 'form');

    const iterableCategories = Object.keys(categories);
    const tabs = createDOMElement('fieldset', '', 'tabs');

    for (let i = 0, len = iterableCategories.length; i < len; i++) {
      const name = iterableCategories[i];
      const tabContainer = createDOMElement('fieldset', '', 'form__tab');
      const tabTitle = createDOMElement('h4', name, 'form__tab-title', {
        'action': 'changeTab',
        'tab': i,
      });

      if (i === 0) {
        tabContainer.classList.add('form__tab_active');
        tabTitle.classList.add('form__tab_title-active');
        this.currentTab = {
          title: tabTitle,
          container: tabContainer
        }
      }

      this.tabs.push(tabContainer);
      tabTitle.addEventListener('click', this);
      tabs.append(tabTitle);

      for (let j = 0, len = categories[name].length; j < len; j++) {
        const propContainer = categories[name][j].container;
        tabContainer.append(propContainer);
      }

      form.append(tabContainer);
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