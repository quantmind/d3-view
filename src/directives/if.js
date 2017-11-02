//
//  d3-if
//  =============
//
//  Show or hide an element
//
export default {

    mount (model) {
        var sel = this.sel;
        this.display = sel.style('display');
        this.opacity = sel.style('opacity');
        this.pass = 0;
        if (!this.display || this.display === 'none') this.display = 'block';
        return model;
    },

    refresh (model, value) {
        var sel = this.sel,
            transition = this.hasTransition(sel) && this.pass;

        this.pass += 1;
        if (value) sel.style('display', this.display);
        else if (!transition) sel.style('display', 'none');

        if (transition) {
            if (value)
                this.transition(sel).style('opacity', this.opacity);
            else
                this.transition(sel)
                    .style('opacity', 0)
                    .on('end', () => sel.style('display', 'none'));
        }
    }
};
