//
//  d3-if
//  =============
//
//  Show or hide an element
//
export default {

    mount (model) {
        this.display = this.sel.style('display');
        if (!this.display || this.display === 'none') this.display = 'block';
        return model;
    },

    refresh (model, value) {
        if (value) this.sel.style('display', this.display);
        else this.sel.style('display', 'none');
    }
};
