// tiny javascript expression parser
import jsep from './jsep';
import {evaluate} from './eval';


class Expression {

    constructor (expr) {
        this.expr = expr;
        this.parsed = jsep(expr);
    }

    eval (model) {
        return evaluate(model, this.parsed);
    }
}


export function expression (expr) {
    return new Expression(expr);
}


expression.prototype = Expression;
