import {select} from 'd3-selection';

import warn from '../utils/warn';

// No value, it has its own directive
const attributes = ['name', 'class', 'disabled', 'readonly', 'required', 'href'];


export default function (element, directives) {
    var sel = select(element),
        dirs = sel.directives();
    if (dirs) return dirs;
    dirs = new Directives();

    if (!directives) return dirs;

    for (let i = 0; i < element.attributes.length; ++i) {
        let attr = element.attributes[i],
            bits = attr.name.split('-'),
            dirName = bits[0] === 'd3' ? bits[1] : null,
            arg;

        if (dirName) {
            arg = bits.slice(2).join('-');
            if (!arg && attributes.indexOf(dirName) > -1) {
                arg = dirName;
                dirName = 'attr';
            }
            var directive = directives.get(dirName);
            if (directive) dirs.add(directive(element, attr, arg));
            else warn(`${element.tagName} cannot find directive "${dirName}". Did you forget to register it?`);
        }
        dirs.attrs[attr.name] = attr.value;
    }

    if (dirs.size()) sel.directives(dirs);
    return dirs;
}


// Directives container
function Directives () {
    this.attrs = {};
    this.all = [];
}


Directives.prototype = {

    size () {
        return this.all.length;
    },

    pop: function (dir) {
        var index = this.all.indexOf(dir);
        if (index > -1) {
            dir.removeAttribute();
            this.all.splice(index, 1);
        }
        return dir;
    },

    add (dir) {
        this.all.push(dir);
    },

    forEach (callback) {
        this.all.forEach(callback);
    },

    preMount () {
        let dir;
        for (let i=0; i<this.all.length; ++i) {
            dir = this.all[i];
            if (dir.preMount()) return this.pop(dir);
        }
    },

    execute (model) {
        if (!this.size()) return;
        return Promise.all(this.all.map(d => d.execute(model)));
    },

    once (model, data) {
        let dir;
        const all = [];
        for (let i=0; i<this.all.length; ++i) {
            dir = this.all[i];
            if (dir.once) dir.once(model, data);
            else all.push(dir);
        }
        this.all = all;
    }
};
