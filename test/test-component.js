import View from './utils';
import {htmlElement} from '../';
import {select} from 'd3-selection';


describe('Create component', function() {

    var year = {
        render: function () {
            var date = new Date();
            return this.createElement('span').attr('class', 'year').text(date.getFullYear());
        }
    };

    it('View class', () => {
        var view = new View({
            el: htmlElement('<div id="test1"><year></year></div>'),
            components: {
                year: year
            }
        });
        expect(view.el.tagName).toBe('DIV');
        expect(view.components.size()).toBe(1);
        expect(view.mount()).toBe(view);
        var span = select(view.el).select('span');
        expect(span.attr('class')).toBe('year');
        expect(span.text()+0).toBeGreaterThan(2015);
        var c = span.node().__d3view__;
        expect(c).toBeTruthy();
        expect(c.isd3).toBe(true);
        expect(c.uid).toBeGreaterThan(view.uid);
        expect(c.model).not.toBe(view.model);
        expect(c.model.$parent).toBe(view.model);
        expect(c.parent).toBe(view);
    });


});

