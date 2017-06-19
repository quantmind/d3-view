export default {
    '/test': () => {
        return asText('<p>This is a test</p>');
    }
};


function asText (text) {
    return {
        text () {
            return new Promise(function (resolve) {resolve(text);});
        }
    };
}
