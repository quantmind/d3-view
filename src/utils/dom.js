import {timeout} from 'd3-timer';


// Add callback to execute when the DOM is ready
export default function (callback) {
    readyCallbacks.push(callback);
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', _completed);
        // A fallback to window.onload, that will always work
        window.addEventListener('load', _completed);
    }
    else
        domReady();
}


var readyCallbacks = [];

function _completed () {
    document.removeEventListener('DOMContentLoaded', _completed);
	window.removeEventListener('load', _completed);
    domReady();
}


function domReady() {
    let callback;
    while (readyCallbacks.length ) {
        callback = readyCallbacks.shift();
        timeout(callback);
    }
}
