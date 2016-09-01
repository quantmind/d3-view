// Navbar component
var navbar = {

    render: function () {
        var vm = this,
            el = this.createElement('nav').attr('class', 'navbar'),
            model = this.model;

        model.$on(() => {
            vm.refresh(vm.sel);
        });

        var brand = model.brand ? [model.brand] : [];

        el.selectAll('a.navbar-brand')
            .data(brand)
            .enter()
            .append('a')
            .attr('class', 'navbar-brand')
            .attr('href', (d) => {
                return d.href || '#';
            })
            .text((d) => {return d.title;});

        el.selectAll('ul')
            .data([true])
            .enter()
            .append('ul')
            .attr('class', 'nav navbar-nav');

        this.refresh(el);
        return el;
    },

    refresh: function (el) {
        var model = this.model,
            theme = 'navbar-' + (model.theme || 'light bg-faded'),
            items = el
                .classed(theme, true)
                .classed('navbar-fixed-top', model.fixedTop)
                .select('ul')
                .selectAll('li').data(model.items || []);

        var enter = items.enter()
            .append('li')
            .attr('class', 'nav-item')
            .attr('d3-active', '');

        // add links
        enter.append('a').attr('class', 'nav-link');

        enter.merge(items)
            .select('a')
            .attr('href', (d) => {return d.href || '#';})
            .html((d) => {return d.title;});

        return el;
    }

};


new d3.View({
    el: '#page',
    model: {
        navbar: {
            fixedTop: true,
            brand: {
                title: "Test"
            },
            items: [
                {
                    title: 'one'
                },
                {
                    title: 'two'
                },
                {
                    title: 'three'
                }
            ]
        },
        themes: [
            "light bg-faded",
            "dark bg-primary",
            "dark bg-inverse"
        ]

    },
    components: {
        navbar: navbar
    }
}).mount();
