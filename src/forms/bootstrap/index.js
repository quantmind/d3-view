import label from './label';
import group from './group';
import submit from './submit';


const bootstrap = {

    input: ['label', 'group'],
    textarea: ['label', 'group'],
    submit: ['group', 'submit'],
    wrappers: {
        label: label,
        group: group,
        submit: submit
    }
};


// Bootstrap theme
export default {

    install: function (view) {
        var d3form = view.components.get('d3form');
        if (d3form)
            d3form.prototype.formTheme = bootstrap;
    }
};
