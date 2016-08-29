
var navbar = {

    model: {
        navbar: [
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

    render: function () {
        var el = this.createElement('navbar'),
            navbar = this.model.navbar,
            self = this;

        function show () {
            var dt = new Date(),
                next = 1000 - dt.getMilliseconds();
            el.text(format(dt));
            self.timer = d3.timeout(show, next);
        }

        show();
        return el;
    },

    destroy: function () {
        if (this.timer) this.timer.stop();
    }

};


new d3.View({
    el: '#clock',
    components: {
        clock: clock
    }
}).mount();
