// tiny javascript expression parser
import jsep from './jsep';
import {evaluate} from './eval';
import {warn} from '../utils';


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
    try {
        return new Expression(expr);
    } catch (msg) {
        warn(msg);
    }
}


expression.prototype = Expression;
