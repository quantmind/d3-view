import view from './utils';
import {select} from 'd3-selection';


describe('Create component', function() {

    var year = {
        render: function () {
            var date = new Date();
            return this.createElement('span').attr('class', 'year').text(date.getFullYear());
        }
    };

    it('View class', () => {
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
        expect(c.parent).toBe(vm.model);
    });


});

