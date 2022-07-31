const element = document.createElement('div');
const editBtn = document.createElement('button');
editBtn.textContent = 'Edit Component';
editBtn.addEventListener('click', handleEditClick);
element.append(editBtn);
const props = {
    width: "500px",
    height: "500px",
    padding: '25px',
    backgroundColor: '#ff0000',
    borderRadius: '25px',
}

element.dataset.propsId = 'props';

for (let key in props) {
    element.style[key] = props[key];
}

document.body.append(element);

const editForm = document.createElement('div');

for (let key in props) {
    const formElement = document.createElement('div');
    const elHeading = document.createElement('span');
    elHeading.textContent = key;
    const inputField = document.createElement('input');
    inputField.value = props[key];
    formElement.append(elHeading, inputField);
    editForm.append(formElement);
}
const submitChangesButton = document.createElement('button');
submitChangesButton.textContent = 'Submit';
editForm.append(submitChangesButton);


function handleEditClick(ev) {
    element.append(editForm);
}