import label from './label';
import formGroup from './form-group';
import inputGroup from './input-group';
import formCheck from './check';
import submit from './submit';
import help from './help';


const bootstrap = {

    input: ['inputGroup', 'label', 'help', 'formGroup'],
    checkbox: ['formCheck', 'help', 'formGroup'],
    textarea: ['label', 'help', 'formGroup'],
    select: ['label', 'help', 'formGroup'],
    submit: ['submit'],
    wrappers: {
        label,
        formGroup,
        inputGroup,
        formCheck,
        submit,
        help
    }
};


//
//  Bootstrap plugin
//  ===================
//
//  Simply add a new form extension to wrap form fields
//
export default {

    install (vm) {
        if (!vm.$formExtensions)
            return vm.logWarn('form bootstrap requires the form plugin installed first!');
        vm.$formExtensions.push(wrapBootstrap);
    }
};


function wrapBootstrap(field, wrappedEl, fieldEl) {
    var wrappers = bootstrap[fieldEl.attr('type')] || bootstrap[fieldEl.node().tagName.toLowerCase()];
    if (!wrappers) return wrappedEl;
    let wrap;

    wrappers.forEach(wrapper => {
        wrap = bootstrap.wrappers[wrapper];
        if (wrap) wrappedEl = wrap(field, wrappedEl, fieldEl);
        else field.logWarn(`Could not find form field wrapper ${wrapper}`);
    });

    return wrappedEl;
}
