import {EventEmitter} from "./EventEmitter.js";

export class CustomComponent extends EventEmitter {
  componentName = undefined;
  container = undefined;
  props = undefined;

  constructor(id, props) {
    super();
    this.componentName = id;
    this.init(props);
  }

  handleEvent(e) {
    if (e.type === 'click') {
      this.emit('chooseComponent', this);
    }
  }

  init(props) {
    if (props === undefined) {
      return;
    }
    this.setContainer();
    this.loadProperties(props);
    this.renderComponent();
  }

  setContainer() {
    this.container = document.getElementById(this.componentName);
    this.container.addEventListener('click', this);
  }

  loadProperties(props) {
    this.props = props;
  }

  get properties() {
    return this.props;
  }

  renderComponent() {
    const propsWithoutPx = ['color', 'select'];

    for (let i = 0, len = this.props.length; i < len; i++) {
      const prop = this.props[i];
      if (prop.category === 'Visual') {
        let value = propsWithoutPx.includes(prop.type) ? prop.value : prop.value + 'px';
        if (this.container.style[prop.name] !== value) {
          if (prop.type === 'array') {
            value = '';
            for (let j = 0, len = prop.value.length; j < len; j++) {
              value += prop.value[j] + 'px ';
            }
          }
          this.container.style[prop.name] = value;
        }
      } else if (prop.category === 'General') {
        if (prop.attribute) {
          this.container.setAttribute(prop.name, prop.value);
        } else {
          this.container[prop.name] = prop.value;
        }
      }
    }
  }

  updateProperty(data) {
    const props = this.props;

    const propName = data.optionName;
    const propValue = data.optionValue;
    const propMode = data.optionMode;

    for (let i = 0, len = props.length; i < len; i++) {
      const prop = props[i];
      if (prop.name === propName) {
        if (propMode !== undefined) {
          prop.mode = propMode;
        }
        prop.value = propValue;
        break;
      }
    }
    this.props = props;
    this.renderComponent();
  }
}