// Navbar component
var navbar = {

    render: function () {
        var el = this.createElement('navbar'),
            navbar = this.model.navbar,
            brand = navbar.brand ? [navbar.brand] : [];

        el.selectAll('a.navbar-brand')
            .data(brand)
            .enter()
            .append('a')
            .attr('class', 'navbar-brand')
            .attr('href', (d) => {return d.href || '#';});

        el.selectAll('ul')
            .data([true])
            .enter()
            .append('ul')
            .attr('class', 'nav navbar-nav');

        var items = el.select('ul').selectAll('li').data(navbar.items || []);

        var enter = items.enter()
            .append('li')
            .attr('class', 'nav-item')
            .attr('d3-active', '');

        // add links
        enter.append('a').attr('class', 'nav-link');

        enter.merge(items)
            .select('a')
            .attr('href', (d) => {return d.href || '#';});

        return el;
    }

};


new d3.View({
    el: '#page',
    model: {
        navbar: {
            brand: "Test",
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
        }
    },
    components: {
        navbar: navbar
    }
}).mount();
