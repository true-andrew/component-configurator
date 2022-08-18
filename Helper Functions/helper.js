export function createDOMElement(type, className, textContent, dataset) {
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