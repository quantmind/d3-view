import view, {trigger, getWaiter, test, nextTick} from './utils';

const dropdown = `
<ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
<li class="nav-item dropdown">
<a class="nav-item nav-link mr-md-2" href="#" aria-haspopup="true" d3-attr-aria-expanded="menuExpanded ? 'true' : 'false'" d3-on='$toggleMenu($event)'>
<i class="fa fa-caret-down"></i>
</a>
</li>
</ul>
`;


describe('d3-on recursive -', () => {


    test('toggleMenu', async () => {
        var ev,
            waiter = getWaiter(),
            vm = view({
                model: {
                    $toggleMenu () {}
                },
                components: {
                    dropdown: {
                        model: {
                            menuExpanded: false,
                            menuItems: [
                                {
                                    label: 'foo',
                                    $callback() {}
                                },
                                {
                                    label: 'pippo',
                                    $callback() {}
                                }
                            ],
                            $toggleMenu: toggleMenu
                        },
                        render () {
                            return this.viewElement(dropdown);
                        }
                    }
                }
            });
        await vm.mount(vm.viewElement('<div><dropdown></dropdown></div>'));

        var sel = vm.sel.selectAll('a'),
            dirs = sel.directives(),
            model = sel.model();

        expect(sel.size()).toBe(1);
        expect(sel.attr('d3-on')).toBe(null);
        expect(dirs.all.length).toBe(2);
        dirs = dirs.all.reduce((o, d) => {o[d.name] = d; return o;}, {});
        expect(dirs['d3-attr-aria-expanded']).toBeTruthy();
        expect(dirs['d3-attr-aria-expanded'].arg).toBe('aria-expanded');
        expect(model.parent).toBe(vm.model);
        expect(sel.attr('aria-expanded')).toBe('false');

        model.menuItems.forEach(item => {
            expect(item.parent).toBe(model);
            expect(item.isolated).toBe(true);
            expect(item.label).toBeTruthy();
            expect(item.$isReactive('label')).toBe(true);
        });

        trigger(sel.node(), 'click');
        await waiter.promise;
        expect(ev).toBeTruthy();
        expect(ev.type).toBe('click');
        expect(ev.defaultPrevented).toBe(false);
        expect(sel.attr('aria-expanded')).toBe('false');
        await nextTick();
        expect(sel.attr('aria-expanded')).toBe('true');

        function toggleMenu (event) {
            ev = event;
            expect(this.parent).toBe(model);
            this.menuExpanded = true;
            waiter.resolve(null);
        }
    });


});
