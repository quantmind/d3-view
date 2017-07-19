import {map} from 'd3-collection';

import directives from './directives/index';
import protoView from './core/view';
import {createComponent, extendDirectives} from './core/component';

// Core Directives
const coreDirectives = extendDirectives(map(), directives);

// the view constructor
export default createComponent('view', null, protoView, coreDirectives);
