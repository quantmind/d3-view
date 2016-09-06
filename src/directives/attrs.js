import {isObject} from 'd3-let';
import Directive from '../directive';

//
//  d3-attrs directive
//  ===================
//
//  Add several attributes, including directives, at once
export default class extends Directive {

    mount (model) {
        var attrs = this.expression.eval(model);

        if (!isObject(attrs)) return;
    }
}
