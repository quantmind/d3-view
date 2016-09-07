import warn from '../utils/warn';
import viewModel from '../model';


// Model factory function
export default function (directives, data, parent) {
    // model directive
    var dir = directives.pop('model');

    // For loop directive not permitted in the root view
    if (directives.get('for') && !parent) {
        warn(`Cannot have a "d3-for" directive in the root view element`);
        directives.pop('for');
    }

    if (!parent) {
        if (dir) warn(`Cannot have a d3-model directive in the root element`);
        return viewModel(data);
    }

    // Execute model directive
    if (dir) {
        dir.execute(parent);
        var model = dir.sel.model();
        if (model) model.$update(data);
        return model;
    }
    else
        return parent.$child(data);
}
