import {view} from 'd3-view';

import {render} from './index';


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
                $cliked() {
                    clicked += 1;
                }
            }
        });
        var d = await render('<button d3-on=$cliked()>Click me<button/>', vm);
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
});
