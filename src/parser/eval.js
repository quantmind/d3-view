import {code} from './jsep';

export function evaluate (self, expr) {

    switch(expr.type) {
        case code.IDENTIFIER: return self[expr.name];
        case code.LITERAL: return expr.value;
        case code.CALL_EXP: return callExpression(self, expr.callee, expr.arguments);
        case code.MEMBER_EXP: return evaluate(evaluate(self, expr.object), expr.property);
    }
}


function callExpression (self, callee, args) {
    var func;

    args = args.map((arg) => {
        return evaluate(self, arg);
    });

    if (callee.type !== code.IDENTIFIER) {
        self = evaluate(self, callee.object);
        callee = callee.property;
    }

    func = self[callee.name];
    return func.apply(self, args);
}
