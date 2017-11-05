import {assign, isFunction} from 'd3-let';

import providers from '../utils/providers';
import base from './base';


providers.transition = {
    duration: 0
};


export default assign(base, {
    //
    // return a transition object if possible
    transition (sel) {
        if (!arguments.length) sel = this.sel;
        var duration = this.transitionDuration(sel);
        if (duration > 0) return sel.transition(this.uid).duration(duration);
    },

    transitionDuration (sel) {
        if (!arguments.length) sel = this.sel;
        if (sel && isFunction(sel.transition) && sel.size()) {
            var duration = sel.attr('data-transition-duration');
            return +(duration === null ? providers.transition.duration : duration);
        }
        return 0;
    }
});
