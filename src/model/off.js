// remove event handlers
export default function (attr) {
    if (attr === undefined)
        this.$events.each(function (event) {
            event.on('change', null);
        });
    else {
        var event = this.$events.get(attr);
        if (event)
            event.on('change', null);
    }

    this.$children.forEach(function (child) {
        child.$off(attr);
    });
}
