import directives from './directives/index';
import {protoView} from './core/views';

// Core Directives
const coreDirectives = extendDirectives(map(), directives);

// the view constructor
export default createComponent(null, protoView, coreDirectives);
