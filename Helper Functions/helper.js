export function createDOMElement(type, textContent, className, dataset) {
  const element = document.createElement(type);

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  if (className !== '' && className !== undefined) {
    element.classList.add(className);
  }

  if (dataset !== undefined) {
    const keys = Object.keys(dataset);
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      element.dataset[key] = dataset[key];
    }
  }

  return element;
}