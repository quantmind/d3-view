//
//  d3-if
//  =============
//
//  Remove an element if the condition is not satisfied
//
export default {

    refresh: function (model, value) {
        if (value) this.sel.style('display', null);
        else this.sel.style('display', 'none');
    }
};
