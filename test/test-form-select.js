import {isObject} from 'd3-let';
import {select} from 'd3-selection';

import view, {nextTick, testAsync} from './utils';

import {viewForms} from '../index';


describe('json form select field', () => {

    var vm,
        form = {
            type: "form",
            action: "/login",
            resultHandler: "redirect",
            children: [
                {
                    name: 'testselect',
                    type: "select",
                    options: [
                        'o1',
                        ['o2', 'option 2'],
                        'o3'
                    ]
                }
            ]
        };

    beforeEach(() => {
        vm = view({
            model: {
                selectForm: form
            }
        }).use(viewForms);

        vm.mount(vm.viewElement(`<div><d3form schema='selectForm'></d3form></div>`));
    });

    it ('select', testAsync(async () => {
        var fv = vm.sel.select('form').view();
        var model = fv.model;
        expect(isObject(model.inputs)).toBe(true);
        await nextTick();

        var inp = model.inputs.testselect;
        expect(inp.isDirty).toBe(false);
        var options = vm.sel.selectAll('option').nodes();
        expect(options.length).toBe(3);
        expect(select(options[0]).attr('value')).toBe('o1');
        expect(select(options[0]).html()).toBe('o1');
        expect(select(options[1]).attr('value')).toBe('o2');
        expect(select(options[1]).html()).toBe('option 2');

        inp.options.push('o4');
        inp.$change('options');
        await nextTick();
        options = vm.sel.selectAll('option');
        expect(options.size()).toBe(4);
    }));
});
