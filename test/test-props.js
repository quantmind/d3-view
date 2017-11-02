import view, {test, nextTick} from './utils';


describe('Component data -', () => {

    var append = {
            refresh: function (model, html) {
                var sel = this.sel.selectAll(`#${this.uid}`).data([0]);
                sel.enter()
                        .append('span')
                        .attr('id', this.uid)
                    .merge(sel)
                        .html(''+html);
            }
        },
        sidebar = {
            // static properties
            props: {
                id: 'sidebar',
                brand: 'sidebar',
                brandUrl: '/'
            },
            // reactive properties
            model: {
                sidebarContent: '',
                primaryItems: [],
                secondaryItems: []
            },
            render (props, attrs, el) {
                this.model.sidebarContent = this.select(el).html();
                return this.renderFromUrl('/sidebar', props);
            }
        };

    test ('properties', async () => {
        var vm = view({
            model: {
                sidebarItems: [
                    {
                        url: '#',
                        name: 'link1'
                    },
                    {
                        url: '#',
                        name: 'link2'
                    }
                ]
            },
            components: {
                sidebar: sidebar
            },
            directives: {
                append: append
            }
        });
        // API pre-mount
        expect(vm.components.size()).toBe(1);
        expect(vm.components.get('sidebar')).toBeTruthy();
        //
        await vm.mount(vm.viewElement(
            `<div><sidebar id="bang" brand="Big bang" data-primary-items="sidebarItems"><p id="innerBang">bla bla bla</p></sidebar></div>`
        ));
        var bar = vm.sel.selectAll('#bang');
        expect(bar.size()).toBe(1);
        var model = bar.model();
        expect(model.parent).toBe(vm.model);
        expect(model.primaryItems).toBe(vm.model.sidebarItems);

        expect(bar.selectAll('.sidebar-brand').html()).toBe('Big bang');
        var items = bar.selectAll('.list-group-item-primary');
        expect(items.size()).toBe(2);
        items.each(function (d, idx) {
            expect(vm.select(this).select('span').html()).toBe(vm.model.sidebarItems[idx].name);
        });

        vm.model.sidebarItems = [{
            url: 'gggg',
            name: 'link3'
        }];
        await nextTick();
        items = bar.selectAll('.list-group-item-primary');
        expect(items.size()).toBe(1);
        items.each(function (d, idx) {
            expect(vm.select(this).attr('href')).toBe(vm.model.sidebarItems[idx].url);
            expect(vm.select(this).select('span').html()).toBe(vm.model.sidebarItems[idx].name);
        });
    });
});