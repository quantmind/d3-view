import {select} from 'd3-selection';
import Input from './input';


export default class extends Input {

    on (model, attrName) {
        var self = this;

        // DOM => model binding
        select(this.el).on('input', function () {
            model.$set(attrName, self.value);
        });
        select(this.el).on('change', function () {
            model.$set(attrName, self.value);
        });
    }
}
