import {version} from '../package.json';
import {Base} from './component';
import directives from './directives/index';


//
//  d3 view class
export class View extends Base {

}


View.version = version;
View.directives = directives;
View.components = {};

