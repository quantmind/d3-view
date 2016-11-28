import warn from '../utils/warn';
import viewModel from '../model';


// Model factory function
export default function (directives, defaults, parent) {
    // model directive
    var dir = directives.pop('model');

    // For loop directive not permitted in the root view
    if (directives.get('for') && !parent) {
        warn(`Cannot have a "d3-for" directive in the root view element`);
        directives.pop('for');
    }

    if (!parent) {
        if (dir) warn(`Cannot have a d3-model directive in the root element`);
        return viewModel(defaults);
    }

    // Execute model directive
    if (dir) {
        dir.execute(parent);
        var model = dir.sel.model();
        if (model) model.$update(defaults, false);
        return model;
    }
    else if (defaults)
        return parent.$child(defaults);
    else
        return parent;
}
