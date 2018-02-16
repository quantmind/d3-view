import components from './components/index';
import directives from './directives/index';
import {createComponent, extendDirectives, extendComponents, protoView} from './core/component';
import './core/clean';

// Core Directives
const coreDirectives = extendDirectives(new Map, directives);
const coreComponents = extendComponents(new Map, components);

// the root view constructor
export default config => createComponent('view', protoView, coreDirectives, coreComponents)(config);
