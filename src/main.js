import components from './components/index';
import directives from './directives/index';
import protoView from './core/view';
import {createComponent, extendDirectives, extendComponents} from './core/component';
import './core/clean';

// Core Directives
const coreDirectives = extendDirectives(new Map, directives);
const coreComponents = extendComponents(new Map, components);

// the root view constructor
export default function (config) {
    const viewClass = createComponent('view', protoView, coreDirectives, coreComponents);
    return viewClass(config);
}
