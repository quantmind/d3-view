import {isArray} from 'd3-let';
import warn from './warn';


const modelDataKeys = ['labelSrOnly', 'layout'];


const componentsFromType = {
    'text': 'input',
    'password': 'input'
};


export function formComponent (child) {
    var type = child.type || 'text';
    return componentsFromType[type] || type;
}


export function addChildren (sel) {
    var children = this.data.children;
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

export function modelData(data) {
    if (!data) data = {};
    this.data = data;
    var model = this.model;
    modelDataKeys.forEach((key) => {
        if (key in data)
            model.$set(key, data[key]);
    });
    return data;
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
