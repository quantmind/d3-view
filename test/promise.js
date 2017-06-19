export default {
    ok (result) {
        return new Promise(function (resolve) {resolve(result);});
    },
    error (result) {
        return new Promise(function (resolve, error) {error(result);});
    }
};
