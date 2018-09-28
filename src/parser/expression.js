// tiny javascript expression parser
import warn from "../utils/warn";
import { evaluate, identifiers } from "./eval";
import jsep, { code } from "./jsep";

const proto = {
  eval(model) {
    return evaluate(model, this.parsed);
  },

  safeEval(model) {
    try {
      return evaluate(model, this.parsed);
    } catch (msg) {
      warn(`Could not evaluate <<${this.expr}>> expression: ${msg}`);
    }
  },

  // evaluate identifiers from a model
  identifiers() {
    return identifiers(this.parsed);
  }
};

function Expression(expr) {
  this.codes = code;
  this.expr = expr;
  this.parsed = jsep(expr);
}

Expression.prototype = proto;

export default function(expr) {
  return new Expression(expr);
}
