//
//  Form Responses
//  ====================
//
//  To add/override responses:
//
//  import viewForms from 'd3-view'
//
//  viewForms.responses.myresponse = function (data, status, headers) {
//      ...
//  }
export default {
  default: defaultResponse,
  redirect
};

// The default response emit a formMessage to event to parent models
function defaultResponse(response) {
  var level =
    response.status < 300
      ? "info"
      : response.status < 500
        ? "warning"
        : "error";
  this.$emit("formMessage", {
    level: level,
    data: response.data,
    response: response
  });
}

function redirect(response) {
  var location = this.$$view.providers.location;
  location.href = response.data.redirectTo || "/";
}
