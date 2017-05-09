import {select} from 'd3-selection';

import getdirs from './getdirs';
import createModel from './model';

// Mount a model into an element
export default function mount (model, el) {
    var sel = select(el),
        directives = sel.directives();

    // directives not available, this is a mount from
    // a directive or loop and requires a new model
    if (!directives) {
        directives = getdirs(el, model.$vm ? model.$vm.directives : null);
        model = createModel(directives, null, model);
    }

    // Loop directive is special
    var loop = directives.pop('for');

    if (loop) {
        loop.execute(model);
        return true;    // Important - skip mounting a component
    } else {
        if (!sel.model()) sel.model(model);
        mountChildren(sel, directives);
    }
}



function mountChildren (sel, directives) {
    var model = sel.model(),
        vm = model.$vm;

    sel.selectAll(function () {
        return this.children;
    }).each(function () {
        var component = vm ? vm.components.get(this.tagName.toLowerCase()) : null;

        if (component)
            component({parent: vm}).mount(this);
        else {
            // vanilla element
            mount(model, this);
            var child = select(this);
            // cleanup model if not needed
            if (child.model() === model) child.model(null);
        }
    });

    // Execute directives
    if (directives.size()) {
        directives.forEach((d) => {
            d.execute(model);
        });
    } else
        // no directives - remove property
        sel.directives(null);
}
