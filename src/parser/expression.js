// tiny javascript expression parser
import jsep, {code} from './jsep';
import {evaluate, identifiers} from './eval';
import warn from '../utils/warn';


const proto = {

    eval: function (model) {
        return evaluate(model, this.parsed);
    },

    safeEval: function (model) {
        try {
            return evaluate(model, this.parsed);
        } catch (msg) {
            warn(`Could not evaluate <<${this.expr}>> expression: ${msg}`);
        }
    },

    identifiers: function () {
        return identifiers(this.parsed).values();
    }
};


function Expression (expr) {
    this.codes = code;
    this.expr = expr;
    this.parsed = jsep(expr);
}

Expression.prototype = proto;


export default function (expr) {
    return new Expression(expr);
}
