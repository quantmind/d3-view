const { JSDOM } = require("jsdom");
const d3 = require("d3-view");

const nextTick = d3.viewDebounce();

const validateHTML = (html, jsdom) => {
  if (!jsdom) jsdom = new JSDOM();
  var d = jsdom.window.document.createElement("div");
  d.innerHTML = html;
  return d.innerHTML === html;
};

//
// render function
const test = {
  validateHTML,

  nextTick,

  render(html, components) {
    if (!components) components = {};
    let vm = components;
    if (!vm.isd3) vm = d3.view({ components });
    const options = {
      runScripts: "dangerously",
      resources: "usable"
    };
    const jsdom = new JSDOM(`<div id="root">${html}</div>`, options);
    const sel = vm.select(jsdom.window.document).select("#root");
    return vm.mount(sel).then(() => new Render(vm, jsdom));
  },

  fakeFetch(fixtures) {
    return new FakeFetch(fixtures);
  },

  httpError(status) {
    return {
      status: status,
      headers: new Map()
    };
  },

  httpText(text) {
    return {
      status: 200,
      headers: new Map([["content-type", "text/plain"]]),
      text() {
        return Promise.resolve(text);
      }
    };
  },

  httpJson(data) {
    return {
      status: 200,
      headers: new Map([["content-type", "application/json"]]),
      json() {
        return Promise.resolve(data);
      }
    };
  },

  getWaiter() {
    const waiter = {};
    waiter.promise = new Promise(function(resolve) {
      waiter.resolve = resolve;
    });
    return waiter;
  }
};

module.exports = test;

function Render(vm, jsdom) {
  this.view = vm;
  this.jsdom = jsdom;
  this.window = jsdom.window;
}

Render.prototype = {
  constructor: Render,
  nextTick,

  tree(shallow) {
    return tree(this.view, shallow);
  },

  select(selector) {
    return this.view.sel.select(selector);
  },

  selectAll(selector) {
    return this.view.sel.selectAll(selector);
  },

  trigger(target, event, process) {
    var e = this.window.document.createEvent("HTMLEvents");
    e.initEvent(event, true, true);
    if (process) process(e);
    return target.dispatchEvent(e);
  },

  click(selector, process) {
    if (typeof selector === "string") selector = this.view.sel.select(selector);
    var node = selector.node();
    if (!node) throw new Error("Cannot click on an empty element");
    return this.trigger(node, "click", process);
  }
};

Object.defineProperties(Render.prototype, {
  component: {
    get() {
      var tree = this.tree(true);
      return tree.children.length ? tree.children[0].component : undefined;
    }
  }
});

function getComponents(children, components, shallow) {
  let component;
  if (!components) components = [];

  children.forEach(el => {
    component = el.__d3_view__;
    if (component) components.push(shallow ? { component } : tree(component));
    else
      getComponents(
        Array.prototype.slice.call(el.children),
        components,
        shallow
      );
  });
  return components;
}

function tree(cm, shallow) {
  return {
    component: cm,
    children: getComponents(
      Array.prototype.slice.call(cm.el.children),
      null,
      shallow
    )
  };
}

function FakeFetch(fixtures) {
  return (url, ...o) => {
    if (d3.isAbsoluteUrl(url)) url = new URL(url).pathname;
    var result = fixtures[url];
    if (result) {
      try {
        return Promise.resolve(result(...o));
      } catch (err) {
        return Promise.reject(err);
      }
    } else return Promise.resolve(test.httpError(404));
  };
}
