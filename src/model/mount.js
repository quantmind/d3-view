import {select} from 'd3-selection';
import getdirs from '../getdirs';


export default function (el) {
    var directives = getdirs(el),
        sel = select(el),
        model = sel.model();

    sel.selectAll(function () {
        return this.children;
    }).each(function () {
        var Component = model.$components.get(this.tagName.toLowerCase());

        if (Component)
            new Component({
                el: this,
                parent: model
            }).mount();
        else
            model.$mount(this);
    });


    // Execute directives
    directives.forEach((d) => {
        d.execute();
    });
}
