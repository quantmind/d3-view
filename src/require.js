export {requireFrom} from 'd3-require';
import {requireFrom, resolve as d3Resolve} from 'd3-require';

var libs = new Map;

export function resolve (name, base) {
    return d3Resolve(libs.get(name) || name, base);
}

export var require = requireFrom(resolve);

require.libs = libs;
