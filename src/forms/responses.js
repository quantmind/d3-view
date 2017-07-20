// Form Responses
export default {
    "default": defaultResponse,
    redirect: redirect
};


function defaultResponse (data) {
    this.message(data);
}


function redirect () {
    window.location.href = this.data.redirectTo || '/';
}
