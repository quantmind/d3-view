// tiny javascript expression parser
import jsep, {code} from './jsep';
import {evaluate, identifiers} from './eval';
import {warn} from '../utils';


class Expression {

    get codes () {
        return code;
    }

    constructor (expr) {
        this.expr = expr;
        this.parsed = jsep(expr);
    }

    eval (model) {
        return evaluate(model, this.parsed);
    }

    safeEval (model) {
        try {
            return evaluate(model, this.parsed);
        } catch (msg) {
            warn(`Could not evaluate <<${this.expr}>> expression: ${msg}`);
        }
    }

    identifiers () {
        return identifiers(this.parsed).values();
    }
}


export function viewExpression (expr) {
    try {
        return new Expression(expr);
    } catch (msg) {
        warn(`Could not parse <<${expr}>> expression: ${msg}`);
    }
}


viewExpression.prototype = Expression;
