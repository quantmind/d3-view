export function HttpResponse(response, data) {
  this.response = response;
  this.data = data;
  this.status = response.status;
  this.headers = response.headers;
  this.description = response.statusText;
}

export function HttpError(response, data, description) {
  this.response = response;
  this.data = data;
  this.status = response.status;
  this.headers = response.headers;
  this.description = description || response.statusText;
}

export function jsonResponse(response) {
  var ct = (response.headers.get("content-type") || "").split(";")[0];
  if (ct === "application/json")
    return response.json().then(data => new HttpResponse(response, data));
  else {
    var msg =
      response.status < 300
        ? `Expected "application/json" content type, got "${ct}"`
        : null;
    throw new HttpError(response, null, msg);
  }
}

export function textResponse(response) {
  if (response.status < 300)
    return response.text().then(data => new HttpResponse(response, data));
  else {
    throw new HttpError(response);
  }
}

HttpError.prototype = Error.prototype;
