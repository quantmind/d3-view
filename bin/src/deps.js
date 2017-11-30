import {readFile} from 'fs';
import {handleError, info} from './error';


export default function (deps, config, d3) {
    return new Promise((resolve) => {
        deps = extendDeps([], deps, config, d3);
        readAll(deps, config, resolve);
    });
}


function readAll(deps, config, resolve) {
    if (!deps.length) return resolve(config);
    var dep = deps.splice(0, 1)[0],
        current = config.dependencies[dep.name];
    if (typeof(current) === 'string') return readAll(deps, config, resolve);
    current = current || {};

    readFile(`${config.node_modules}/${dep.name}/package.json`, 'utf-8', (error, text) => {
        if (error) handleError(error, true);
        else {
            var json = JSON.parse(text),
                main = current.main || json.main;
            info(config, dep);
            config.dependencies[dep.name] = `@${dep.version}/${main}`;
            if (dep.name.substring(0, 3) === 'd3-') extendDeps(deps, json.dependencies, config, true);
        }
        readAll(deps, config, resolve);
    });
}


function extendDeps(deps, dependencies, config, d3) {
    var version, t;
    dependencies = dependencies || {};
    Object.keys(dependencies).forEach(function (name) {
        if (!config.available.has(name) && (!d3 || name.substring(0, 3) === 'd3-')) {
            version = dependencies[name];
            info(config, `${name} ${version}`);
            t = version.split('.').reduce((s, v) => s + (+v), 0);
            if (t !== t) handleError('Cannot set dependency ' + name + ' ' + version, true);
            else {
                deps.push({
                    name: name,
                    version: version
                });
                config.available.add(name);
            }
        }
    });
    return deps;
}
