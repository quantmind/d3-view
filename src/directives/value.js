import Directive from '../directive';
import tags from './tags';

//
// Two-way data binding for HTML elements supporting the value property
export default class extends Directive {

    create (expression) {
        var type = this.sel.attr('type'),
            tag = this.el.tagName.toLowerCase(),
            Tag = tags[type] || tags[tag];

        if (!Tag) return this.warn(`Cannot apply d3-value directive to ${tag}`);
        this.tag = new Tag(this.el);
        return expression;
    }

    mount (model) {
        this.tag.on(model, this.expression);
        return model;
    }

    destroy () {
        this.tag.off();
    }
}


