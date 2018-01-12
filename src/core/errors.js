export default {
    noElement: {
        message: "No element or selection returned by component render() method",
        code: 104
    },
    readOnlyKey (key) {
        return {
            message: `Cannot set "${key}" value because it is owned by a parent model`,
            code: 201
        };
    }
};


const URL = 'https://view.giottojs.org/docs/errors#';


export function formatError (msg) {
    if (typeof msg === 'string') return msg;
    return `[ERROR ${msg.code}] - ${msg.message} - see ${URL}error-${msg.code}`;
}


export function formatWarn (msg) {
    if (typeof msg === 'string') return msg;
    return `[WARN ${msg.code}] - ${msg.message} - see ${URL}warn-${msg.code}`;
}
