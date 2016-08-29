
var clock = {

    render: function () {
        var format = d3.timeFormat("%B %d, %H:%M:%S"),
            el = this.createElement('span'),
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
