import label from './label';
import formGroup from './form-group';
import inputGroup from './input-group';
import submit from './submit';
import warn from '../warn';


const bootstrap = {

    input: ['inputGroup', 'label', 'formGroup'],
    textarea: ['label', 'formGroup'],
    select: ['label', 'formGroup'],
    submit: ['submit'],
    wrappers: {
        label,
        formGroup,
        inputGroup,
        submit
    }
};


// Bootstrap theme
export default {

    install (vm) {
        if (!vm.$formExtensions)
            return warn('form bootstrap requires the form plugin installed first!');
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
        else warn(`Could not find form field wrapper ${wrapper}`);
    });

    return wrappedEl;
}
