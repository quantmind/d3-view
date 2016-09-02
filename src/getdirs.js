import {warn} from './utils';


export default function (element, directives) {
    if (element.__directives__) return element.__directives__;
    var dirs = new Directives();
    element.__directives__ = dirs;

    for (let i = 0; i < element.attributes.length; ++i) {
        let attr = element.attributes[i],
            bits = attr.name.split(':'),
            extra = bits[1],
            dirName = bits[0].substring(0, 3) === 'd3-' ? bits[0].substring(3) : null;

        if (dirName || (extra && bits[0] === '')) {
            dirName = dirName || 'attr';
            var Directive = directives.get(dirName);
            if (Directive) dirs.add(dirName, new Directive(element, attr, extra));
            else warn(`${element.tagName} cannot find directive "${dirName}". Did you forget to register it?`);
        }
    }
    return dirs.sorted();
}


// Directives container
class Directives {

    constructor () {
        this._dirs = {};
        this._all = [];
    }

    get (name) {
        return this._dirs[name];
    }

    pop (name) {
        var dir = this._dirs[name];
        if (dir) {
            delete this._dirs[name];
            dir.removeAttribute();
            var index = this._all.indexOf(dir);
            if (index > -1) this._all.splice(index, 1);
        }
        return dir;
    }

    add (name, dir) {
        this._dirs[name] = dir;
        this._all.push(dir);
    }

    sorted () {
        this._all.sort((d) => {
            return -d.priority;
        });
        return this;
    }

    forEach (callback) {
        this._all.forEach(callback);
    }
}
