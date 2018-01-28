import {view} from 'd3-view';

import {render, fakeFetch, httpJson, httpError, httpText} from './index';


describe('Render -', () => {

    test('simple view', async () => {
        var d = await render('<p>Hi</p>');
        expect(d.view).toBeTruthy();
        var tree = d.tree();
        expect(tree.component).toBe(d.view);
        expect(tree.children.length).toBe(0);
    });

    test('message', async () => {
        var d = await render('<message />', {
            message: {
                model: {
                    message: "Hi"
                },
                render () {
                    return '<p d3-html="message"/>';
                }
            }
        });
        expect(d.view).toBeTruthy();
        var tree = d.tree();
        expect(tree.children.length).toBe(1);
        var cm = d.component;
        expect(cm.name).toBe('message');
        expect(cm.sel.html()).toBe('Hi');
    });


    test('nested message', async () => {
        var d = await render('<nested />', {
            nested () {
                return '<message />';
            },
            message: {
                model: {
                    message: "Hi"
                },
                render () {
                    return '<p d3-html="message"/>';
                }
            }
        });
        expect(d.view).toBeTruthy();
        var tree = d.tree();
        expect(tree.children.length).toBe(1);
        var cm = d.component;
        expect(cm.name).toBe('message');
        expect(cm.sel.html()).toBe('Hi');
    });

    test('select', async () => {
        var d = await render('<p/><p/>');
        expect(d.select('p').size()).toBe(1);
        expect(d.selectAll('p').size()).toBe(2);
    });

    test('click', async () => {
        let clicked = 0;
        let event = null;
        var vm = view({
            model: {
                $clicked() {
                    clicked += 1;
                }
            }
        });
        var d = await render('<button d3-on=$clicked()>Click me</button>', vm);
        expect(d.select('button').size()).toBe(1);
        d.click('button');
        expect(clicked).toBe(1);
        d.click('button', (e) => {event = e;});
        expect(clicked).toBe(2);
        expect(event).toBeTruthy();
    });

    test('click error', async () => {
         var d = await render('<p/>');
         expect(() => {d.click('button');}).toThrow(new Error('Cannot click on an empty element'));
     });

    test('click d3-for', async () => {
        var items = [],
            vm = view({
                model: {
                    data: [
                        {
                            text: "bla"
                        },
                        {
                            text: "foo"
                        }
                    ],
                    $clicked(item) {
                        items.push(item);
                    }
                }
            });
        var d = await render(`
            <div d3-for='item in data'>
                <button d3-attr-id='"btn-" + index' d3-on="$clicked(item)">Click me</button>
            </div>`, vm);
        expect(d.selectAll('div').size()).toBe(2);
        expect(d.select('#btn-0').size()).toBe(1);
        d.click('#btn-0');
        expect(items.length).toBe(1);
        expect(items[0].text).toBe('bla');
        d.click('#btn-1');
        expect(items.length).toBe(2);
        expect(items[1].text).toBe('foo');
        vm.model.$push('data', {text:'pippo'});
        await d.nextTick();
        d.click('#btn-2');
        expect(items.length).toBe(3);
        expect(items[2].text).toBe('pippo');
    });

    test('fakeFetch', async () => {
        const vm = view();
        vm.providers.fetch = fakeFetch({
            '/bla': function () {
                return httpJson({});
            },
            '/text': function () {
                return httpText('hi');
            },
            '/error': function () {
                return httpError(400);
            }
        });
        let response = await vm.json('/bla');
        expect(response.status).toBe(200);
        expect(response.data).toEqual({});
        response = await vm.fetch('/xyz');
        expect(response.status).toBe(404);
        response = await vm.fetch('/error');
        expect(response.status).toBe(400);
        response = await vm.fetchText('/text');
        expect(response.status).toBe(200);
        expect(response.data).toBe('hi');
    });
});
