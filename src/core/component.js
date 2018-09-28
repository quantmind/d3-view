import { dispatch } from "d3-dispatch";
import { assign, isArray, isFunction, isObject, isString, pop } from "d3-let";
import viewModel from "../model/main";
import dashify from "../utils/dashify";
import dataAttributes from "../utils/data";
import map from "../utils/map";
import maybeJson from "../utils/maybeJson";
import sel from "../utils/sel";
import asSelect from "../utils/select";
import Cache from "./cache";
import createDirective from "./directive";
import "./selection";
import base from "./transition";

export const protoView = {
  doMount(el) {
    return asView(this, el);
  }
};

// prototype for both views and components
const protoComponent = {
  //
  // hooks
  render() {},
  childrenMounted() {},
  mounted() {},
  destroy() {},
  //
  // Mount the component into an element
  // If this component is already mounted, or it is mounting, it does nothing
  mount(el, data) {
    if (mounted(this)) return;
    const sel = asSelect(el);
    el = sel.node();
    if (!el) {
      this.logWarn(
        `element not defined, pass an identifier or an HTMLElement object`
      );
      return Promise.resolve(this);
    }
    // set the owner document
    this.ownerDocument = el.ownerDocument;
    //
    const directives = sel.directives(this);

    let props = assign(dataAttributes(directives.attrs), sel.datum(), data),
      extra = maybeJson(pop(props, "props")),
      value,
      model,
      parentModel;

    if (isObject(extra)) props = assign(extra, props);
    else if (this.parent && this.parent.props[extra])
      props = assign({}, this.parent.props[extra], props);

    // fire mount event
    this.events.call("mount", undefined, this, el, props);

    // pick parent model & props
    if (this.parent) {
      //
      parentModel = this.parent.model;
      model = pop(props, "model");
      if (model && !model.$child) model = parentModel[model];
      if (!model) model = parentModel.$new();
      else model = model.$child();
      //
      // Get props from parent view
      Object.keys(this.props).forEach(key => {
        value = this.parent.props[props[key]];
        if (value === undefined) {
          value = maybeJson(props[key]);
          if (value !== undefined) props[key] = value;
          // default value if available
          else if (this.props[key] !== undefined) props[key] = this.props[key];
        } else props[key] = value;
      });
      //
      // get props object from parent if props is defined
      if (isString(extra)) props = assign({}, this.parent.props[extra], props);
    } else {
      props = assign(this.props, props);
      model = viewModel();
    }

    // add reactive model properties
    Object.keys(this.model).forEach(key => {
      value = pop(props, key);
      if (value !== undefined) {
        if (isString(value) && parentModel && parentModel.$isReactive(value))
          model.$connect(key, value, parentModel);
        else model.$set(key, maybeJson(value));
      } else if (model[key] === undefined) model.$set(key, this.model[key]);
    });
    this.model = bindView(this, model);
    //
    // create the new element from the render function
    if (!props.id) props.id = model.uid;
    this.props = props;
    //
    return this.doMount(el);
  },

  createElement(tag, props) {
    const doc = this.ownerDocument || document;
    const sel = this.select(doc.createElement(tag));
    if (props) {
      sel.attr("id", this.props.id);
      if (this.props.class) sel.classed(this.props.class, true);
    }
    return sel;
  },

  doMount(el) {
    let newEl;
    try {
      newEl = this.render(el);
    } catch (error) {
      newEl = Promise.reject(error);
    }
    if (!newEl || !newEl.then) newEl = Promise.resolve(newEl);
    return newEl
      .then(element => compile(this, el, element))
      .catch(exc => error(this, el, exc));
  },

  use(plugin) {
    if (isObject(plugin)) plugin.install(this);
    else plugin(this);
    return this;
  },

  addComponent(name, obj) {
    name = dashify(name);
    var component = createComponent(name, obj);
    this.components.set(name, component);
    return component;
  },

  addDirective(name, obj) {
    name = dashify(name);
    var directive = createDirective(obj);
    this.directives.set(name, directive);
    return directive;
  }
};

// factory of View and Component constructors
export const createComponent = (name, o, coreDirectives, coreComponents) => {
  if (isFunction(o)) o = { render: o };

  var obj = assign({}, o),
    classComponents = extendComponents(new Map(), pop(obj, "components")),
    classDirectives = extendDirectives(new Map(), pop(obj, "directives")),
    model = pop(obj, "model"),
    props = pop(obj, "props");

  function Component(options) {
    var parent = pop(options, "parent"),
      components = map(parent ? parent.components : coreComponents),
      directives = map(parent ? parent.directives : coreDirectives),
      events = parent
        ? parent.events
        : dispatch(
            "message",
            "created",
            "mount",
            "mounted",
            "error",
            "directive-refresh"
          ),
      cache = parent ? parent.cache : new Cache();

    classComponents.forEach((comp, key) => {
      components.set(key, comp);
    });
    classDirectives.forEach((comp, key) => {
      directives.set(key, comp);
    });
    extendComponents(components, pop(options, "components"));
    extendDirectives(directives, pop(options, "directives"));

    Object.defineProperties(this, {
      name: {
        get() {
          return name;
        }
      },
      components: {
        get() {
          return components;
        }
      },
      directives: {
        get() {
          return directives;
        }
      },
      parent: {
        get() {
          return parent;
        }
      },
      root: {
        get() {
          return parent ? parent.root : this;
        }
      },
      cache: {
        get() {
          return cache;
        }
      },
      uid: {
        get() {
          return this.model.uid;
        }
      },
      events: {
        get() {
          return events;
        }
      }
    });
    this.props = asObject(props, pop(options, "props"));
    this.model = asObject(model, pop(options, "model"));
    this.events.call("created", undefined, this);
  }

  Component.prototype = assign({}, base, protoComponent, obj);

  function component(options) {
    return new Component(options);
  }

  component.prototype = Component.prototype;

  return component;
};

// Used by both Component and view

export const extendComponents = (container, components) => {
  map(components).forEach((obj, key) => {
    key = dashify(key);
    container.set(key, createComponent(key, obj, protoComponent));
  });
  return container;
};

export const extendDirectives = (container, directives) => {
  map(directives).forEach((obj, key) => {
    key = dashify(key);
    container.set(key, createDirective(obj));
  });
  return container;
};

//
//  Finalise the binding between the view and the model
//  inject the model into the view element
//  call the mounted hook and can return a Promise
export const asView = (vm, element) => {
  Object.defineProperty(sel(vm), "el", {
    get: function() {
      return element;
    }
  });
  // Apply model to element and mount
  return vm
    .select(element)
    .view(vm)
    .mount()
    .then(() => vmMounted(vm));
};

export const mounted = vm => {
  if (vm.isMounted === undefined) {
    vm.isMounted = false;
    return false;
  } else if (vm.isMounted) {
    vm.logWarn(`component already mounted`);
  } else {
    vm.isMounted = true;
    // invoke mounted component hook
    vm.mounted();
    // invoke the view mounted events
    vm.events.call("mounted", undefined, vm);
  }
  return true;
};

// Internals

//
//  Component/View mounted
//  =========================
//
//  This function is called when a component/view has all its children added
const vmMounted = vm => {
  var parent = vm.parent;
  vm.childrenMounted();
  if (parent && !parent.isMounted) {
    const event = `mounted.${vm.uid}`;
    vm.events.on(event, cm => {
      if (cm === parent) {
        vm.events.on(event, null);
        mounted(vm);
      }
    });
  } else mounted(vm);
  return vm;
};

// Compile a component model
// This function is called once a component has rendered the component element
const compile = (cm, origEl, element) => {
  if (isString(element)) {
    const props = Object.keys(cm.props).length ? cm.props : null;
    element = cm.viewElement(element, props, origEl.ownerDocument);
  }
  element = asSelect(element);
  const size = element.size();
  if (!size)
    throw new Error(
      "render() must return a single HTML node. It returned nothing!"
    );
  else if (size !== 1) cm.logWarn("render() must return a single HTML node");
  element = element.node();
  //
  // mark the original element as component
  origEl.__d3_component__ = true;
  // Insert before the component element
  if (origEl.parentNode) origEl.parentNode.insertBefore(element, origEl);
  // remove the component element
  cm.select(origEl).remove();
  //
  return asView(cm, element);
};

// Invoked when a component cm has failed to render
const error = (cm, origEl, exc) => {
  cm.logWarn(`failed to render due to the unhandled exception reported below`);
  cm.logError(exc);
  cm.events.call("error", undefined, cm, origEl, exc);
  return cm;
};

const asObject = (value, opts) => {
  if (isFunction(value)) value = value();
  if (isArray(value))
    value = value.reduce((o, key) => {
      o[key] = undefined;
      return o;
    }, {});
  return assign({}, value, opts);
};

const bindView = (view, model) => {
  Object.defineProperties(model, {
    $$view: {
      get() {
        return view;
      }
    },
    $$name: {
      get() {
        return view.name;
      }
    },
    props: {
      get() {
        return view.props;
      }
    }
  });
  return model;
};
