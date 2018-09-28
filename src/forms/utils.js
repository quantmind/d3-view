import { isObject } from "d3-let";

const componentsFromType = {
  text: "input",
  email: "input",
  password: "input",
  checkbox: "input",
  number: "input",
  date: "input",
  url: "input",
  "datetime-local": "input"
};

export const formComponent = child => {
  var type = child.type || "text";
  return componentsFromType[type] || type;
};

export const addAttributes = (el, attributes) => {
  var expr, attr;

  if (!isObject(attributes)) return;

  for (attr in attributes) {
    expr = attributes[attr];
    if (isObject(expr)) expr = JSON.stringify(expr);
    el.attr(attr, expr || "");
  }
};

export function formChild(child) {
  var component = formComponent(child);
  return document.createElement(`d3-form-${component}`);
}
