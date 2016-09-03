import Directive from '../directive';


//
//  d3-html
//  =============
//  attach html or text to the innerHtml property
//
//  Usage:
//      <div id="foo" d3-html="output"></div>
//
//  new d3.View({el: '#foo', model: {output: '<h1>A title</h1>'}});
export default class extends Directive {

    refresh (model, value) {
        if (value) this.sel.style('display', null);
        else this.sel.style('display', 'none');
    }
}
