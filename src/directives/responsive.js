import {select} from 'd3-selection';
import {debounce} from '../utils';


export default {

    create: function (expression) {
        return expression || '0';
    },

    mount: function (model) {
        var delay = this.expression.eval(model),
            resize = resizeCallback(this, delay);
        select(window).on(`resize.responsive.${this.uid}`, resize);
    },

    destroy: function () {
        // remove resizing event for this paper
        select(window).on(`resize.responsive.${this.uid}`, null);
    }
};


function resizeCallback (dir, delay) {
    return debounce(() => {
        dir.resize();
    }, delay);
}
