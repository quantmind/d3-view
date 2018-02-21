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

    createModel (parentModel, modelData) {
        return parentModel.$new(modelData);
    }
};
