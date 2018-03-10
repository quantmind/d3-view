import view, {test, nextTick} from './utils';
import {viewForms, viewElement, viewBootstrapForms} from '../index';
import jsonform4 from './fixtures/jsonform4';

import {isEmail} from 'validator';


describe('Bootstrap plugin -', () => {

    let el;

    viewForms.validators.set('email', {
        validate (el, value) {
            if (el.attr('type') === 'email' && !isEmail(value)) return 'not a valid email address';
        }
    });

    beforeEach(() => {
        el = viewElement(`<div><d3form props='${jsonform4}'></d3form></div>`);
    });

    test('help', async () => {
        var vm = view().use(viewForms).use(viewBootstrapForms);
        await vm.mount(el);
        var form = vm.sel.select('form').model();
        form.inputs.email.value = 'bjhbdfjhv';
        await nextTick();
        expect(form.$isValid()).toBe(false);
        form.inputs.email.value = 'bla@foo.com';
        await nextTick();
        expect(form.$isValid()).toBe(true);
    });
});
