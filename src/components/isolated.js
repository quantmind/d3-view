//
// An isolated component
//
// Use this component to create a component with an isolated model
export default {
    props: {
        tag: 'div'
    },

    render (props, attrs, htmlEl) {
        var sel = this.createElement(props.tag);
        return sel
                .attr('id', attrs.id)
                .attr('class', attrs.class)
                .html(htmlEl.innerHTML);
    },

    createModel (data) {
        var model = this.parent.model.$new(data);
        model.$$view = this;
        model.$$name = this.name;
        return model;
    }
};
