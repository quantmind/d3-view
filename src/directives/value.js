import {select} from 'd3-selection';
import Directive from '../directive';
import tags from './tags';

//
// Two-way data binding for HTML elements supporting the value property
export default class extends Directive {

    mount (attrName) {
        var el = select(this.el),
            type = el.attr('type'),
            tag = this.el.tagName.toLowerCase(),
            Tag = tags[type] || tags[tag],
            model = this.model;
        this.attrName = attrName;

        if (!Tag) return this.warn(`Cannot apply d3-value directive to ${tag}`);
        this.tag = new Tag(this.el, attrName, model);
    }

    destroy () {
        select(this.el).on('change.d3Value', null);
        this.model.off(this.attrName);
    }
}


