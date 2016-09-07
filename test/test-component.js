import {select} from 'd3-selection';

import view from './utils';
import {viewElement} from '../';


describe('Components - ', function() {

    var year = {
        render: function () {
            var date = new Date();
            return this.createElement('span').attr('class', 'year').text(date.getFullYear());
        }
    };

    var text = {
        model: {
            text: 'Hi!'
        },
        render: function () {
            return this.createElement('p').attr('d3-html', 'text');
        }
    };

    it('simple - no binding', () => {
        var vm = view({
            components: {
                year: year
            }
        });
        expect(vm.components.size()).toBe(1);
        expect(vm.components.get('year')).toBeTruthy();
        expect(vm.components.get('year').prototype.isd3).toBe(true);
        // mount
        expect(vm.mount(viewElement('<div id="test1"><year></year></div>'))).toBe(vm);
        expect(vm.el.tagName).toBe('DIV');

        var span = select(vm.el).select('span');
        expect(span.attr('class')).toBe('year');
        expect(span.text()+0).toBeGreaterThan(2015);
        var c = span.model();
        expect(c).toBeTruthy();
        expect(c.parent).toBe(undefined);
    });


    it('simple - sandwiched between standard elements', () => {
        var vm = view({
            components: {
                year: year
            }
        }).mount(viewElement('<div id="test1"><h1>This Year</h1><year></year><p>Hi there</p></div>'));
        var div = vm.el;
        expect(div.tagName).toBe('DIV');
        expect(div.children.length).toBe(3);
        expect(div.children[0].tagName).toBe('H1');
        expect(div.children[1].tagName).toBe('SPAN');
        expect(div.children[2].tagName).toBe('P');
    });


    it('with model', () => {
        var vm = view({
            components: {
                text: text
            }
        });
        expect(vm.components.size()).toBe(1);

        expect(vm.mount(viewElement('<div id="test1"><text></text></div>'))).toBe(vm);
        expect(vm.el.tagName).toBe('DIV');
        var p = select(vm.el).select('p');
        var model = p.model();
        expect(model).toBeTruthy();
        expect(model.parent).toBe(vm.model);
    });


});

