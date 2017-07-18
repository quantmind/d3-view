import view, {testAsync, nextTick, trigger} from './utils';
import {viewForms, viewProviders} from '../index';
import jsonform from './fixtures/jsonform2';


describe('submit field', () => {

    let vm;

    beforeEach(() => {
        vm = view().use(viewForms);

        vm.mount(vm.viewElement(`<div><d3form schema='${jsonform}'></d3form></div>`));
    });


    it ('disabled', testAsync(async () => {

        var form = vm.sel.select('form').model();
        expect(form.$isValid()).toBe(false);
        //
        // hijack form response
        var responses = [];
        form.$response = function (data, status, headers) {
            responses.push({
                data: data,
                status: status,
                headers: headers
            });
        };

        // submit no endpoint.url
        viewProviders.logger.pop();
        var button = vm.sel.select('button');
        trigger(button.node(), 'click');
        // expect(viewProviders.logger.pop(1)[0]).toBe('[d3-form] No url, cannot submit');

        await nextTick();

        expect(button.property('disabled')).toBe(true);
        expect(responses.length).toBe(0);

        form.inputs.id.value = 'vhcgdsv';
        form.inputs.token.value = 'hsjdgvchgjdc';

        await nextTick();

        expect(form.$isValid()).toBe(true);

        expect(button.property('disabled')).toBe(false);
        trigger(button.node(), 'click');
        await nextTick();

        expect(responses.length).toBe(1);
    }));
});