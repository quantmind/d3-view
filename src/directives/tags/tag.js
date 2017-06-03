import assign from 'object-assign';
import {select} from 'd3-selection';

import debounce from '../../utils/debounce';


const base = {

    on: function (model, attrName) {
        var refresh = refreshFunction(this, model, attrName);

        // DOM => model binding
        select(this.el)
            .on('input', refresh)
            .on('change', refresh);
    }
};


export function createTag (proto) {

    function Tag(el) {
        this.el = el;
    }

    Tag.prototype = assign({}, base, proto);

    function tag (el) {
        var t = new Tag(el);

        Object.defineProperty(t, 'value', {
            get: function () {
                return select(t.el).property('value');
            },
            set: function (v) {
                select(t.el).property('value', v);
            }
        });

        return t;
    }

    tag.prototype = Tag.prototype;

    return tag;
}


export function refreshFunction (dom, model, attrName) {

    return debounce(() => {
        model.$set(attrName, dom.value);
    });
}
