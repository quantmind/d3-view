import Directive from '../directive';


//
//  d3-if
//  =============
//  Remove an element if the condition is not satisfied
//
//  Usage:
//      <div id="foo" d3-if="show"></div>
//
//  d3.view({el: '#foo', model: {show: true}});
export default class extends Directive {

    refresh (model, value) {
        if (value) this.sel.style('display', null);
        else this.sel.style('display', 'none');
    }
}
