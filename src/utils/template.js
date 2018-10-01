import { isString } from "d3-let";
import { select } from "d3-selection";
import providers from "./providers";
import warn from "./warn";

export const template = (source, context) => {
  if (isString(source)) {
    if (context) {
      var s = compile(source);
      if (!s) return source;
      source = s;
    } else return source;
  }
  return source(context);
};

export const htmlElement = (source, context, ownerDocument) => {
  ownerDocument = ownerDocument || document;
  var el = select(ownerDocument.createElement("div"));
  el.html(template(source, context));
  var children = el.node().children;
  if (children.length !== 1)
    warn(
      `viewElement function should return one root element only, got ${
        children.length
      }`
    );
  return children[0];
};

const compile = text => {
  var compile = providers.compileTemplate;
  if (compile) return compile(text);
  warn(
    "No compileTemplate function available in viewProviders, cannot render template"
  );
};
