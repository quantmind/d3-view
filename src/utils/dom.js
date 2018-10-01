import { timeout } from "d3-timer";
import providers from "./providers";

// Add callback to execute when the DOM is ready
export default callback => {
  providers.readyCallbacks.push(callback);
  /* istanbul ignore next */
  if (document.readyState !== "complete") {
    document.addEventListener("DOMContentLoaded", _completed);
    // A fallback to window.onload, that will always work
    window.addEventListener("load", _completed);
  } else domReady();
};

/* istanbul ignore next */
const _completed = () => {
  document.removeEventListener("DOMContentLoaded", _completed);
  window.removeEventListener("load", _completed);
  domReady();
};

const domReady = () => {
  let callback;
  while (providers.readyCallbacks.length) {
    callback = providers.readyCallbacks.shift();
    timeout(callback);
  }
};
