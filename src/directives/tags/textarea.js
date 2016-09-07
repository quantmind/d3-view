import {select} from 'd3-selection';

import {createTag, refreshFunction} from './tag';


export default createTag({
    
    on: function (model, attrName) {
        var refresh = refreshFunction(this, model, attrName);

        // DOM => model binding
        select(this.el)
            .on('input', refresh)
            .on('change', refresh);
    }
});
