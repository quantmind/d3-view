import {select} from 'd3-select';
import {version} from '../package.json';
import {map} from 'd3-collection';
import {warn} from './logger';

//
//  d3 view class
export default class View {

    constructor (options) {
        options = map(options);
        var tag = options.get('tag');
        if (!tag) warn('tag is required when creating a new d3.View');
    }
}


View.version = version;
