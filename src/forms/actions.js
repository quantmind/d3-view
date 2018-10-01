import { assign } from "d3-let";

//
// Form Actions
export default {
  submit: submit
};

const messages = {
  default: "<strong>Error!</strong> Could not submit form"
};

const endpointDefaults = {
  contentType: "application/json",
  method: "POST"
};

//
// Submit action
function submit(e) {
  var submit = this,
    view = submit.$$view,
    form = view.props.form,
    endpoint = assign({}, endpointDefaults, submit.props.endpoint);

  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  var data = form.$inputData(),
    options = {};

  if (!endpoint.url) {
    view.logError("No url, cannot submit form");
    return;
  }

  if (endpoint.contentType === "application/json") {
    options.headers = {
      "Content-Type": endpoint.contentType
    };
    options.body = JSON.stringify(data);
  } else {
    options.body = new FormData();
    for (var key in data) options.body.append(key, data[key]);
  }

  // Flag the form as submitted
  if (!form.$setSubmit()) {
    // form not valid, don't bother with request
    form.$setSubmitDone();
  } else {
    options.method = endpoint.method;
    view.json(endpoint.url, options).then(done, done);
  }

  function done(response) {
    form.$setSubmitDone();
    if (response.status && response.headers) form.$response(response);
    else
      form.$emit("formMessage", {
        level: "error",
        message: messages[response.message] || messages.default
      });
  }
}
