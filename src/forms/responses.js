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
    "default": defaultResponse,
    redirect: redirect
};


function defaultResponse (data) {
    this.message(data);
}


function redirect (data) {
    window.location.href = data.redirectTo || '/';
}
