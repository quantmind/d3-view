import {version} from '../package.json';
import {Base, Component} from './component';
import directives from './directives/index';
import providers from './utils';

const components = {};

//
//  d3 view class
export class View extends Base {

    static get Component () {
        return Component;
    }

    static get version () {
        return version;
    }

    static get directives () {
        return directives;
    }

    static get components () {
        return components;
    }

    static get providers () {
        return providers;
    }
}
