import {timeout} from 'd3-timer';

import view, {logger} from './utils';
import {viewElement} from '../index';


describe('d3-for directive', function() {

    it('bad template', () => {
        logger.pop();
        var vm = view();
        vm.mount(
            viewElement('<div><p d3-for="foo bo bla"></p></div>')
        );

        expect(vm.isMounted).toBe(true);
        expect(logger.pop()[0]).toBe(
            '[d3-view] d3-for directive requires "item in expression" template, got "foo bo bla"'
        );
    });

    it('d3-for to paragraph', () => {
        logger.pop();
        var text = ["blaaaaaa", "foooooooo"],
            vm = view({
            model: {
                bla: text
            }
        });
        vm.mount(
            viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
        );

        expect(vm.isMounted).toBe(true);
        var paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);
        paragraphs.select(function (txt, i) {
            expect(txt).toBe(text[i]);
            expect(this.innerHTML).toBe(txt);
        });
        expect(logger.pop().length).toBe(0);
    });

    it('d3-for refresh', (done) => {
        var text = ["blaaaaaa", "foooooooo"],
            vm = view({
            model: {
                bla: text
            }
        });
        vm.mount(
            viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
        );

        expect(vm.isMounted).toBe(true);
        var paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);
        vm.model.bla.push('a new entry');
        vm.model.$change('bla');
        paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);

        timeout(() => {
            paragraphs = vm.sel.selectAll('p');
            expect(paragraphs.size()).toBe(3);
            done();
        });
    });

    it('d3-for update', (done) => {
        var text = ["blaaaaaa", "foooooooo"],
            newText = ["whaatt", "kaput"],
            vm = view({
            model: {
                bla: text
            }
        });
        vm.mount(
            viewElement('<div><p d3-for="foo in bla" d3-html="foo"></p></div>')
        );

        expect(vm.isMounted).toBe(true);
        var paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);
        vm.model.bla = newText;
        paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);

        timeout(() => {
            done();
            paragraphs = vm.sel.selectAll('p');
            expect(paragraphs.size()).toBe(2);
            paragraphs.each(function (d, i) {
                expect(d).toBe(newText[i]);
                expect(vm.select(this).html()).toBe(newText[i]);
            });
        });

    });

    it('d3-for update object', (done) => {
        var data = [
                {
                    text: "blaaaaaa",
                    active: true
                },
                {
                    text: "foooooooo",
                }
            ],
            vm = view({
            model: {
                bla: data
            }
        });
        vm.mount(
            viewElement(`<div><p d3-for="foo in bla" d3-html="foo.text" d3-class="foo.active ? 'active' : null"></p></div>`)
        );

        expect(vm.isMounted).toBe(true);
        var paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);
        var bla = [
            {
                text: "foooo",
                active: true
            },
            {
                text: "kaput",
                active: true
            },
            {
                text: "ciao",
            }
        ];
        vm.model.bla = bla;
        paragraphs = vm.sel.selectAll('p');
        expect(paragraphs.size()).toBe(2);

        timeout(() => {
            done();
            paragraphs = vm.sel.selectAll('p');
            expect(paragraphs.size()).toBe(3);
            paragraphs.each(function (d, i) {
                expect(d.text).toBe(bla[i].text);
                expect(vm.select(this).html()).toBe(bla[i].text);
                expect(vm.select(this).classed('active')).toBe(bla[i].active || false);
            });
        });

    });
});
