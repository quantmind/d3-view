import {select} from 'd3-selection';
import {Tag} from './input';


export default class extends Tag {

    _dom_bind () {
        var self = this;

        // DOM => model binding
        select(this.el).on('change', function () {
            self.model.$set(self.attrName, self.value);
        });

        select(this.el).on('input', function () {
            self.model.$set(self.attrName, self.value);
        });
    }
}
