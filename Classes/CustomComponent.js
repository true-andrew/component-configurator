export class CustomComponent {
  componentName = undefined;
  container = undefined;

  constructor(name) {
    this.componentName = name;
    this.container = document.createElement('div');
    document.body.append(this.container);
  }

  renderComponent() {
    const props = JSON.parse(window.localStorage.getItem(this.componentName));
    const propsWithoutPx = ['color', 'select'];

    for (let i = 0, len = props.length; i < len; i++) {
      const prop = props[i];
      let value = propsWithoutPx.includes(prop.type) ? prop.value : prop.value + 'px';
      if (prop.type === 'array') {
        value = prop.value.map((el) => el + 'px').join(' ');
      }
      if (this.container.style[prop.title] !== value) {
        this.container.style[prop.title] = value;
      }
    }
  }

  updateProperty(propName, value) {
    const props = JSON.parse(window.localStorage.getItem(this.componentName));

    for (let i = 0, len = props.length; i < len; i++) {
      const prop = props[i];
      if (prop.title === propName) {
        prop.value = value;
      }
    }
    window.localStorage.setItem(this.componentName, JSON.stringify(props));
    this.renderComponent();
  }

  loadProperties(props) {
    const storage = window.localStorage;
    storage.setItem(this.componentName, JSON.stringify(props));
  }
}