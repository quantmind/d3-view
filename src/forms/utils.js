import {timeout} from 'd3-timer';
import {isArray} from 'd3-let';


const componentsFromType = {
    text: 'input',
    email: "input",
    password: 'input',
    checkbox: 'input',
    number: 'input',
    date: 'input',
    url: 'input',
    'datetime-local': 'input'
};


// return A promise which execute a callback at the next event Loop cycle
export function nextTick (callback) {
    var self = this,
        promise = new Promise((resolve) => timeout(resolve));
    if (callback) promise.then(() => callback.call(self));
    return promise;
}


export function formComponent (child) {
    var type = child.type || 'text';
    return componentsFromType[type] || type;
}


export function addChildren (sel) {
    var children = this.model.data.children;
    if (children) {
        if (!isArray(children)) {
            this.logError(`children should be an array of fields, got ${typeof children}`);
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
    return document.createElement(`d3-form-${component}`);
}
