import view, {test} from './utils';


describe('d3-prop -', function() {

    test('simple', async () => {

        var vm = view({
            model: {
                test: 'This is a test'
            },
            components: {
                simple () {
                    return `<p>${this.props.msg}</p>`;
                }
            }
        });
        await vm.mount(vm.viewElement('<div><simple d3-prop-msg="test">Bla</simple></div>'));

        expect(vm.sel.select('p').html()).toBe('This is a test');
    });

});
