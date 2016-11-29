import view, {logger} from './utils';
import {viewElement} from '../index';


describe('d3-on directive', function() {

    it('bad template', () => {
        var vm = view().mount(
            viewElement('<div><p d3-for="foo bo bla"></p></div>')
        );

        expect(vm.isMounted).toBe(true);
        expect(logger.pop()[0]).toBe('[d3-view] d3-for directive requires "item in expression" template, got "foo bo bla"');
    });

    it('d3-for to paragraph', () => {
        var vm = view({
            model: {
                bla: ["blaaaaaa", "foooooooo"]
            }
        }).mount(
            viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
        );

        expect(vm.isMounted).toBe(true);
    });
});
