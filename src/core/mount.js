import {select} from 'd3-selection';

import getdirs from './getdirs';
import createModel from './model';

// Mount a model into an element
export default function mount (model, el) {
    var sel = select(el),
        directives = el.directives();

    // directives not available, this is a mount from a directive/loop
    if (!directives) {
        directives = getdirs(el, this.$vm ? this.$vm.directives : null);
        model = createModel(directives, model);
    }

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
            component({parent: model}).mount(this);
        else
            mount.call(model, this);
    });

    // Execute directives
    directives.forEach((d) => {
        d.execute(model);
    });
}
