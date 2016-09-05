import {select} from 'd3-selection';
import Input, {refreshFunction} from './input';


export default class extends Input {

    on (model, attrName) {
        var refresh = refreshFunction(this, model, attrName);

        // DOM => model binding
        select(this.el)
            .on('input', refresh)
            .on('change', refresh);
    }
}
