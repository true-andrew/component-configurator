export function createElement(elName, classList, text, options) {
  const el = document.createElement(elName);
  el.classList = classList;
  if (text) {
    el.textContent = text;
  }
  if (options !== undefined) {
    for (let key in options) {
      el[key] = options[key];
    }
  }
  return el;
}