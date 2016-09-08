import {isArray} from 'd3-let';
import warn from './warn';


const componentsFromType = {
    'text': 'input',
    'password': 'input'
};


export function formComponent (child) {
    var type = child.type || 'text';
    return componentsFromType[type] || type;
}


export function addChildren (sel) {
    var model = this.model,
        children = model.structure.children;
    if (children) {
        if (!isArray(children)) {
            warn(`children should be an array of fields, for ${typeof children}`);
            return sel;
        }
        sel.selectAll('.d3form')
            .data(children)
            .enter()
            .append(formChild)
            .classed('d3form', true);
    }
    return sel;
}


function formChild (child) {
    var component = formComponent(child);
    if (!component) {
        warn(`Could not find form component ${child.type}`);
        component = 'input';
        child.type = 'hidden';
    }
    return document.createElement(`d3${component}`);
}
