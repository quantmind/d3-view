import view from './utils';
import {select} from 'd3-selection';


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
            el: view.htmlElement('<div id="test1"><year></year></div>'),
            components: {
                year: year
            }
        });
        expect(vm.el.tagName).toBe('DIV');
        expect(vm.components.size()).toBe(1);
        expect(vm.mount()).toBe(vm);
        var span = select(vm.el).select('span');
        expect(span.attr('class')).toBe('year');
        expect(span.text()+0).toBeGreaterThan(2015);
        var c = span.model();
        expect(c).toBeTruthy();
        expect(c.parent).toBe(undefined);
    });


    it('with model', () => {
        var vm = view({
            el: view.htmlElement('<div id="test1"><text></text></div>'),
            components: {
                text: text
            }
        });
        expect(vm.el.tagName).toBe('DIV');
        expect(vm.components.size()).toBe(1);
        expect(vm.mount()).toBe(vm);
        var p = select(vm.el).select('p');
        var model = p.model();
        expect(model).toBeTruthy();
        expect(model.parent).toBe(vm.model);
    });


});

