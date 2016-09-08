
var clock = {

    render: function () {
        var format = d3.timeFormat("%B %d, %H:%M:%S"),
            el = this.createElement('h1'),
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


d3.view({
    components: {
        clock: clock
    }
}).mount('#clock');
