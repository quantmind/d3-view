let UID = 0;

// Add a unique identifier to an object
export default function (o) {
    var uid = ++UID;

    if (arguments.length) {
        Object.defineProperty(o, 'uid', {
            get: function () {
                return uid;
            }
        });

        return o;
    } else
        return uid;
}
