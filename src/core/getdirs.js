import {select, selection} from 'd3-selection';

import warn from '../utils/warn';

// No value, it has its own directive
const attributes = ['name', 'class', 'disabled', 'readonly', 'required'];


selection.prototype.directives = directives;


function directives (value) {
    return arguments.length
      ? this.property("__directives__", value)
      : this.node().__directives__;
}


export default function (element, directives) {
    var sel = select(element),
        dirs = sel.directives();
    if (dirs) return dirs;
    dirs = new Directives();
    sel.directives(dirs);

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
    return dirs.sorted();
}


// Directives container
function Directives () {
    this.attrs = {};
    this._dirs = {};
    this._all = [];
}


Directives.prototype = {
    size: function () {
        return this._all.length;
    },

    get: function (name) {
        return this._dirs[name];
    },

    pop: function (name) {
        var dir = this._dirs[name];
        if (dir) {
            delete this._dirs[name];
            dir.removeAttribute();
            var index = this._all.indexOf(dir);
            if (index > -1) this._all.splice(index, 1);
        }
        return dir;
    },

    add: function (name, dir) {
        this._dirs[name] = dir;
        this._all.push(dir);
    },

    sorted: function () {
        this._all.sort((d) => {
            return -d.priority;
        });
        return this;
    },

    forEach: function (callback) {
        this._all.forEach(callback);
    }
};
