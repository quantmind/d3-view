import formElement from './element';

//
// Submit element
export default class extends formElement {

    render () {
        var vm = this,
            model = this.model,
            el = this.createElement('button')
                .attr('id', model.id)
                .attr('type', model.type || 'submit')
                .attr('name', model.name)
                .html(model.label || 'submit')
                .on('click', (event) => {
                    vm.click(event);
                });
        return el;
    }

    click () {

    }
}
