//
//  d3-show
//  =============
//  Show or hide an element
//
export default {

    mount: function (model) {
        this.block = this.sel.style('display') ? 'block' : null;
        return model;
    },

    refresh: function (model, value) {
        if (value) this.sel.style('display', this.block);
        else this.sel.style('display', 'none');
    }
};
