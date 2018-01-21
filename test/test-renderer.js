import render from './render';
import {test} from './utils';


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

});
