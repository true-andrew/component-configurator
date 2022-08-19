export function createDOMElement(type, textContent, className, dataset) {
  const element = document.createElement(type);
  element.classList.add(className);
  if (dataset !== undefined) {
    const keys = Object.keys(dataset);
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      element.dataset[key] = dataset[key];
    }
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

export function createElement(type, textContent) {
  const element = document.createElement(type);
  element.textContent = textContent;
  return element;
}

/**
 * @param type = string
 * @param textContent = string
 * @param classList = array
 */
export function createElementWithClassList(type, textContent, classList) {
  const element = createElement(type, textContent);
  for (let i = 0, len = classList.length; i < len; i++) {
    const className = classList[i];
    if (className !== '' && className !== undefined) {
      element.classList.add(className);
    }
  }
  return element;
}

/**
 *
 * @param type = string
 * @param textContent = string
 * @param classList = array
 * @param dataset = object
 * @returns {*}
 */
export function createElementWithClassListAndDataset(type, textContent, classList, dataset) {
  const element = createElementWithClassList(type, textContent, classList);
  const keys = Object.keys(dataset);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    element.dataset[key] = dataset[key];
  }
  return element;
}
