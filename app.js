function ComponentConfigurator() {
    const element = document.createElement('div');
    element.id = 'configurator';
    element.style.cssText = 'position: absolute;top: 0;right: 0;' +
      'display: none;background-color: #003399;padding: 25px;color: #e5e5e5;';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', this);
    element.append(closeBtn);
    document.body.append(element);
    this.container = element;
}

ComponentConfigurator.prototype.editingComponent = undefined;
ComponentConfigurator.prototype.container = undefined;
ComponentConfigurator.prototype.editForm = undefined;

ComponentConfigurator.prototype.handleEvent = function (ev) {
    if (ev.type === 'submit') {
        this.submitChanges(ev);
    } else if (ev.type === 'click') {
        this.closeConfigurator();
    }
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
        inputField.type = determineFieldTypeByKey(key);
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
    this.componentProps = {
        width: "500",
        height: "500",
        padding: '25',
        backgroundColor: '#ff0000',
        borderRadius: '25',
    }

    const component = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Component';
    editBtn.addEventListener('click', () => {
        configurator.show();
        configurator.editComponent(this);
    });
    component.append(editBtn);
    component.dataset.propsId = 'componentProps';

    this.container = component;
    this.renderComponent();
    document.body.append(this.container);
}

Component.prototype.renderComponent = function () {
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