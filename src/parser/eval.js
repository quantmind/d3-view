import { code } from "./jsep";

export function evaluate(self, expr, nested) {
  switch (expr.type) {
    case code.IDENTIFIER:
      return self[expr.name];
    case code.LITERAL:
      return nested ? self[expr.value] : expr.value;
    case code.ARRAY_EXP:
      return expr.elements.map(elem => {
        return evaluate(self, elem);
      });
    case code.LOGICAL_EXP:
    case code.BINARY_EXP:
      return binaryExp(
        expr.operator,
        evaluate(self, expr.left),
        evaluate(self, expr.right)
      );
    case code.CALL_EXP:
      return callExpression(self, expr.callee, expr.arguments);
    case code.MEMBER_EXP:
      return evaluate(evaluate(self, expr.object), expr.property, true);
    case code.CONDITIONAL_EXP:
      return evaluate(self, expr.test)
        ? evaluate(self, expr.consequent)
        : evaluate(self, expr.alternate);
    case code.UNARY_EXP:
      return unaryExp(expr.operator, evaluate(self, expr.argument));
  }
}

// extract identifiers
export function identifiers(expr, all) {
  if (arguments.length === 1) all = new Set();
  switch (expr.type) {
    case code.IDENTIFIER:
      all.add(expr.name);
      break;
    case code.ARRAY_EXP:
      expr.elements.forEach(elem => identifiers(elem, all));
      break;
    case code.LOGICAL_EXP:
    case code.BINARY_EXP:
      identifiers(expr.left, all);
      identifiers(expr.right, all);
      break;
    case code.CALL_EXP:
      identifiers(expr.callee, all);
      expr.arguments.forEach(elem => identifiers(elem, all));
      break;
    case code.MEMBER_EXP:
      all.add(fullName(expr));
      break;
    case code.CONDITIONAL_EXP:
      identifiers(expr.test, all);
      identifiers(expr.consequent, all);
      evaluate(expr.alternate, all);
      break;
    case code.UNARY_EXP:
      identifiers(expr.argument, all);
      break;
  }
  return all;
}

function callExpression(self, callee, args) {
  var func;

  args = args.map(arg => {
    return evaluate(self, arg);
  });

  if (callee.type !== code.IDENTIFIER) {
    self = evaluate(self, callee.object);
    callee = callee.property;
  }

  func = self[callee.name];
  if (!func)
    throw new EvalError(`callable "${callee.name}" not found in context`);
  return func.apply(self, args);
}

function unaryExp(op, arg) {
  if (!unaryFunctions[op])
    unaryFunctions[op] = new Function("arg", `return ${op} arg`);
  return unaryFunctions[op](arg);
}

function binaryExp(op, a, b) {
  if (!binaryFunctions[op])
    binaryFunctions[op] = new Function("a", "b", `return a ${op} b`);
  return binaryFunctions[op](a, b);
}

function fullName(expr) {
  if (expr.type === code.IDENTIFIER) return expr.name;
  else return `${fullName(expr.object)}.${expr.property.name}`;
}

const unaryFunctions = {};
const binaryFunctions = {};
