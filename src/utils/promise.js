// a resolved promise
export default function (result) {
	return new Promise(function (resolve) {
        resolve(result);
    });
}
