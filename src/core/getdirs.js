import {select} from 'd3-selection';

import warn from '../utils/warn';

// No value, it has its own directive
const attributes = ['name', 'class', 'disabled', 'readonly', 'required'];


export default function (element, directives) {
    var sel = select(element),
        dirs = sel.directives();
    if (dirs) return dirs;
    dirs = new Directives();

    if (!directives) return dirs;

    for (let i = 0; i < element.attributes.length; ++i) {
        let attr = element.attributes[i],
            bits = attr.name.split('-'),
            arg = bits[2],
            dirName = bits[0] === 'd3' ? bits[1] : null;

        if (dirName) {
            if (!arg && attributes.indexOf(dirName) > -1) {
                arg = dirName;
                dirName = 'attr';
            }
            var directive = directives.get(dirName);
            if (directive) dirs.add(dirName, directive(element, attr, arg));
            else warn(`${element.tagName} cannot find directive "${dirName}". Did you forget to register it?`);
        }
        dirs.attrs[attr.name] = attr.value;
    }

    if (dirs.size()) sel.directives(dirs);

    return dirs.sorted();
}


// Directives container
function Directives () {
    this.attrs = {};
    this._dirs = {};
    this._all = [];
}


Directives.prototype = {

    size () {
        return this._all.length;
    },

    get (name) {
        return this._dirs[name];
    },

    pop (name) {
        var dir = this._dirs[name];
        if (dir) {
            delete this._dirs[name];
            dir.removeAttribute();
            var index = this._all.indexOf(dir);
            if (index > -1) this._all.splice(index, 1);
        }
        return dir;
    },

    add (name, dir) {
        this._dirs[name] = dir;
        this._all.push(dir);
    },

    sorted () {
        this._all.sort((d) => {
            return -d.priority;
        });
        return this;
    },

    forEach (callback) {
        this._all.forEach(callback);
    },

    preMount () {
        for (let i=0; i<this._all.length; ++i)
            if (this._all[i].preMount())
                return this._all[i];
    }
};
