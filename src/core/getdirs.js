import {select} from 'd3-selection';
import {isPromise} from 'd3-let';

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
            arg = bits[2],
            dirName = bits[0] === 'd3' ? bits[1] : null;

        if (dirName) {
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

    return dirs.sorted();
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

    sorted () {
        this.all.sort((d) => {
            return -d.priority;
        });
        return this;
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
        var promises = [];
        let promise;
        this.forEach((d) => {
            promise = d.execute(model);
            if (isPromise(promise)) promises.push(promise);
        });
        if (promises.length)
            return Promise.all(promises);
    }
};
