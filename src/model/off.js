// remove event handlers
export default function (attr) {
    if (attr === undefined)
        this.$events.each((event) => event.on('change', null));
    else {
        var event = this.$events.get(attr);
        if (event) event.on('change', null);
    }

    this.$children.forEach((child) => child.$off(attr));
}
