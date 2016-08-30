// Navbar component
var navbar = {

    render: function () {
        var vm = this,
            el = this.createElement('nav').attr('class', 'navbar'),
            navbar = this.model.$get('navbar');

        if (!navbar) {
            navbar = {};
            this.warn('navbar component requires a "navbar" entry in the view model');
        }
        else
            this.model.$on('navbar', (value) => {
                vm.refresh(vm.el, value);
            });

        var brand = navbar.brand ? [navbar.brand] : [];

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

        this.refresh(el, navbar);
        return el;
    },

    refresh: function (el, navbar) {
        var theme = 'navbar-' + (navbar.theme || 'light bg-faded'),
            items = el
                .classed(theme, true)
                .classed('navbar-fixed-top', navbar.fixedTop)
                .select('ul')
                .selectAll('li').data(navbar.items || []);

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
