// Form Responses
export default {
    "default": defaultResponse,
    redirect: redirect
};


function defaultResponse (response) {
    var data = response.json();
    this.message(data);
}


function redirect () {
    window.location.href = this.data.redirectTo || '/';
}
