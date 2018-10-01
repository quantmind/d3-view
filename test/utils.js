import { view, viewDebounce, viewProviders } from "../index";
import testFetch from "./fixtures/fetch";

viewProviders.compileTemplate = require("handlebars").compile;
viewProviders.location = {};

export const numDefComponents = view().components.size;

export const logger = {
  logs: [],
  infoLogs: [],

  error: function(msg) {
    logger.logs.push(msg);
  },

  warn: function(msg) {
    logger.logs.push(msg);
  },

  info: function(msg) {
    logger.infoLogs.push(msg);
  },

  pop: function(num) {
    return popLogs(logger.logs, num);
  },

  popInfo: function(num) {
    return popLogs(logger.infoLogs, num);
  }
};

//
//  Return an object with a promise and the resolve function for the promise
export const getWaiter = () => {
  var waiter = {};
  waiter.promise = new Promise(function(resolve) {
    waiter.resolve = resolve;
  });
  return waiter;
};

export function trigger(target, event, process) {
  var e = target.ownerDocument.createEvent("HTMLEvents");
  e.initEvent(event, true, true);
  if (process) process(e);
  target.dispatchEvent(e);
}

export const nextTick = viewDebounce();
export const sleep = delay => viewDebounce(null, delay)();

viewProviders.fetch = testFetch;
// comment this line for logs
viewProviders.logger = logger;
// uncomment this line for debug logs
//viewProviders.setDebug();

export default view;

const popLogs = (logs, num) => {
  if (num !== undefined) return logs.splice(logs.length - num);
  else return logs.splice(0);
};
