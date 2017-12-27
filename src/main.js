import {map} from 'd3-collection';

import components from './components/index';
import directives from './directives/index';
import protoView from './core/view';
import {createComponent, extendDirectives, extendComponents} from './core/component';
import './core/clean';

// Core Directives
const coreDirectives = extendDirectives(map(), directives);
const coreComponents = extendComponents(map(), components);

// the root view constructor
export default function (config) {
    const viewClass = createComponent('view', protoView, coreDirectives, coreComponents);
    return viewClass(config);
}
