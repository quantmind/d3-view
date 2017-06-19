import promise from '../promise';


export default {
    '/test': () => {
        return asText('<p>This is a test</p>');
    }
};


function asText (text) {
    return {
        text () {
            return promise.ok(text);
        }
    };
}
