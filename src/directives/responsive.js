import {select} from 'd3-selection';
import Directive from '../directive';
import {debounce} from '../utils';


export default class extends Directive {

    create (expression) {
        return expression || '0';
    }

    mount (model) {
        var delay = this.expression.eval(model),
            resize = resizeCallback(this, delay);
        select(window).on(`resize.responsive.${this.uid}`, resize);
    }

    destroy () {
        // remove resizing event for this paper
        select(window).on(`resize.responsive.${this.uid}`, null);
    }
}


function resizeCallback (dir, delay) {
    return debounce(() => {
        dir.resize();
    }, delay);
}
