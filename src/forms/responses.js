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


function defaultResponse (response) {
    this.$emit('message', {
        level: 'info',
        msg: response.data,
        response: response
    });
}


function redirect (response) {
    var location = this.$$view.providers.location;
    location.href = response.data.redirectTo || '/';
}
