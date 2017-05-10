import warn from '../utils/warn';
import viewModel from '../model/main';


// Model factory function
export default function (directives, defaults, parent) {

    // For loop directive not permitted in the root view
    if (directives.get('for') && !parent) {
        warn(`Cannot have a "d3-for" directive in the root view element`);
        directives.pop('for');
    }

    return parent ? parent.$child(defaults) : viewModel(defaults);
}
