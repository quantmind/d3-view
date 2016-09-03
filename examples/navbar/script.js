var navbarTpl = `<nav class="navbar" :class="[theme, ['navbar-fixed-top', fixedTop]]">
    <a class="navbar-brand" d3-if="brand" :href="brand.href || '#'" d3-html="brand.title"></a>
    <ul class="nav navbar-nav">
        <li d3-for="item in items" class="nav-item" d3-active>
            <a class="nav-link" :href="item.href || '#'" d3-html="item.title"></a>
        </li>
    </ul>
</nav>`;



d3.view({
    el: '#page',
    model: {
        navbar: {
            fixedTop: true,
            theme: 'navbar-light bg-faded',
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
            "navbar-light bg-faded",
            "navbar-dark bg-primary",
            "navbar-dark bg-inverse"
        ]

    },
    components: {
        navbar: function () {
            return d3.view.htmlElement(navbarTpl);
        }
    }
}).mount();
