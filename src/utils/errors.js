

export function HttpError (response) {
    this.response = response;
    this.description = response.statusText;
}


HttpError.prototype = Error.prototype;
