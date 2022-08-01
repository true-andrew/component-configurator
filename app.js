function ComponentConfigurator() {
    const element = document.createElement('div');
    element.id = 'configurator';
    element.style.cssText = 'position: absolute;top: 0;right: 0;' +
      'display: none;background-color: #003399;padding: 25px;color: #e5e5e5;';
    document.body.append(element);
    this.container = element;
}

ComponentConfigurator.prototype.editingComponent = undefined;
ComponentConfigurator.prototype.editForm = undefined;

ComponentConfigurator.prototype.handleEvent = function (ev) {
    if (ev.type === 'submit') {
        this.submitChanges(ev);
    }
}

ComponentConfigurator.prototype.show = function () {
    this.container.style.display = 'block';
}

ComponentConfigurator.prototype.hide = function () {
    this.container.style.display = 'none';
}

ComponentConfigurator.prototype.initEditForm = function () {
    this.editForm = document.createElement('form');
}

ComponentConfigurator.prototype.submitChanges = function (ev) {
    ev.preventDefault();
    const componentProps = this.editingComponent[this.editingComponent.container.dataset.propsId];
    for (let i = 0, len = ev.target.length - 1; i < len; i++) {
        const input = ev.target[i];
        componentProps[input.dataset.key] = input.value;
    }
    this.editingComponent.renderComponent();
}

ComponentConfigurator.prototype.editComponent = function (component) {
    if (this.editingComponent !== undefined) {
        return;
    }

    this.editingComponent = component;
    this.initEditForm();
    const componentProps = component[component.container.dataset.propsId];
    for (let key in componentProps) {
        const formElement = document.createElement('div');
        const elHeading = document.createElement('span');
        elHeading.textContent = key + ' ';
        const inputField = document.createElement('input');
        inputField.value = componentProps[key];
        inputField.dataset.key = key;
        formElement.append(elHeading, inputField);
        this.editForm.append(formElement);
    }

    const submitChangesButton = document.createElement('button');
    submitChangesButton.type = 'submit';
    submitChangesButton.textContent = 'Submit';

    this.editForm.append(submitChangesButton);

    this.editForm.addEventListener('submit', this);

    this.container.append(this.editForm);
}

const configurator = new ComponentConfigurator();

//Custom Div Element
function Component() {
    this.componentProps = {
        width: "500px",
        height: "500px",
        padding: '25px',
        backgroundColor: '#ff0000',
        borderRadius: '25px',
    }

    const component = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Component';
    editBtn.addEventListener('click', handleEditClick);
    component.append(editBtn);
    component.dataset.propsId = 'componentProps';

    this.container = component;
    this.renderComponent();
    document.body.append(this.container);
}

Component.prototype.renderComponent = function () {
    for (let key in this.componentProps) {
        this.container.style[key] = this.componentProps[key];
    }
}

const component = new Component();

function handleEditClick(ev) {
    configurator.show();
    configurator.editComponent(component);
}