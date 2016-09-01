import {select} from 'd3-selection';


// Mount a model into an HTML element
export default function (el) {

    var model = this,
        components = this.$components,
        dirs = this.$directives;

    // create directive for this element
    var directives = [];
    for (let i=0; i<el.attributes.length; ++i) {
        let attr = el.attributes[i],
            dirName = attr.name.substring(0, 3) === 'd3-' ? attr.name.substring(3) : null,
            Directive = dirs.get(dirName);
        if (Directive) directives.push(new Directive(model, el, attr));
    }

    if (directives.length)
        el.__d3_directives__ = directives.sort((d) => {return -d.priority;});

    // Mount components
    if (!el.__template__) {
        model.$el = el;
        select(el).selectAll('*').each(function () {
            // mount components
            var Component = components.get(this.tagName.toLowerCase()),
                sel = select(this),
                modelName = sel.attr('d3-model'),
                data = modelName ? model[modelName] : null;

            if (Component) {
                var comp = new Component({
                    el: this,
                    parent: model,
                    model: data
                });
                if (modelName) model.$setbase(modelName, comp.model);
                comp.mount();
            }
            else {
                var child = model;
                if (modelName) {
                    child = model.child(data);
                    model.$setbase(modelName, child);
                }
                child.$mount(this);
            }

            this.removeAttribute('d3-model');
        });
    }

    // mount directive
    directives.forEach((d) => {
        d.mount();
    });
}
