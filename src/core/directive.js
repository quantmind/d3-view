import { isFunction, isObject } from "d3-let";
import viewModel from "../model/main";
import viewExpression from "../parser/expression";
import sel from "../utils/sel";
import uid from "../utils/uid";
import base from "./transition";

//
// Directive Prototype
//
// Directives are special attributes with the d3- prefix.
// Directive attribute values are expected to be binding expressions.
// A directive’s job is to reactively apply special behavior to the DOM
// when the value of its expression changes.
//
// A directive can implement one or more of the directive methods:
//
//  * create
//  * mount
//  * refresh
//  * destroy
//
const prototype = {
  // hooks
  create(expression) {
    return expression;
  },

  // pre mount
  preMount() {},

  mount(model) {
    return model;
  },

  refresh() {},

  destroy() {},

  removeAttribute() {
    this.el.removeAttribute(this.name);
  },

  // Execute directive
  execute(model) {
    if (!this.active) return;
    this.removeAttribute();
    this.identifiers = [];
    model = this.mount(model);
    // If model returned, bind the element to its properties
    if (model) this.bindModel(model);
  },

  bindModel(model) {
    var dir = this,
      error = false,
      events = model.$$view.events,
      refresh = function() {
        let value = dir.expression ? dir.expression.eval(model) : dir.data;
        dir.refresh(model, value);
        dir.passes++;
        events.call("directive-refresh", undefined, dir, model, value);
      };
    //
    // get the cache instance
    dir.cache = model.$$view.cache;

    // Bind expression identifiers with model
    let bits, target, attr, i;
    if (dir.data) {
      dir.data = model.$new(dir.data);
      dir.identifiers.push({
        model: dir.data,
        attr: ""
      });
    } else if (!this.expression) {
      dir.identifiers.push({
        model: model,
        attr: ""
      });
    } else {
      var modelEvents = new Map();
      this.expression.identifiers().forEach(identifier => {
        bits = identifier.split(".");
        target = model;
        attr = null;

        for (i = 0; i < bits.length - 1; ++i) {
          target = target[bits[i]];
          if (!isObject(target)) {
            attr = bits.slice(0, i + 1).join(".");
            dir.logError(
              `"${attr}" is not an object, cannot bind to "${identifier}" identifier`
            );
            error = true;
            break;
          }
        }

        // process attribute
        if (attr === null) {
          if (!(target instanceof viewModel)) {
            dir.logError(
              `${identifier} is not a reactive model. Cannot bind to it`
            );
            error = true;
          } else addTarget(modelEvents, target, bits[bits.length - 1]);
        }
      });

      // register with model reactive properties
      modelEvents.forEach(target => {
        // if we are listening to all event simply bind to the model changes
        if (target.events.has(""))
          dir.identifiers.push({
            model: target.model,
            attr: ""
          });
        else
          target.events.forEach(attr => {
            dir.identifiers.push({
              model: target.model,
              attr: attr
            });
          });
      });
    }

    if (error) return;

    this.identifiers.forEach(identifier => {
      var event = `${identifier.attr}.${dir.uid}`;
      identifier.model.$on(event, refresh);
    });

    this.bindDestroy(model);

    refresh();
  },

  bindDestroy(model) {
    var dir = this,
      destroy = this.destroy;
    // bind destroy to the model
    dir.destroy = function() {
      dir.identifiers.forEach(identifier => {
        identifier.model.$off(`${identifier.attr}.${dir.uid}`);
      });
      if (dir.data) dir.data.$off();
      try {
        destroy.call(dir, model);
      } finally {
        model.$emit("destroyDirective", dir);
      }
    };
  }
};

// Directive constructor
export default function(obj) {
  function Directive(el, attr, arg) {
    this.el = el;
    this.ownerDocument = el.ownerDocument;
    this.name = attr.name;
    this.arg = arg;
    this.passes = 0;
    var expr = sel(uid(this)).create(attr.value);
    if (expr) {
      try {
        this.expression = viewExpression(expr);
      } catch (e) {
        try {
          this.data = JSON.parse(expr);
        } catch (m) {
          this.logError(e);
        }
      }
    }
    if (!this.active)
      this.active = Boolean(!attr.value || this.expression || this.data);
  }

  Directive.prototype = { ...base, ...prototype, ...obj };

  function directive(el, attr, arg) {
    return new Directive(el, attr, arg);
  }

  directive.prototype = Directive.prototype;
  return directive;
}

function addTarget(modelEvents, model, attr) {
  var value = arguments.length === 3 ? model[attr] : undefined;
  //
  // a method of the model, event is at model level
  if (isFunction(value) || arguments.length === 2)
    getTarget(modelEvents, model).events.add("");
  // value is another model, events at both target model level and value model level
  else if (value instanceof viewModel) {
    addTarget(modelEvents, value);
    model = model.$owner(attr);
    if (model) getTarget(modelEvents, model).events.add("");
  } else {
    // make sure attr is a reactive property of model
    model = model.$owner(attr) || model;
    if (!model.$isReactive(attr)) model.$set(attr, value);
    getTarget(modelEvents, model).events.add(attr);
  }
}

function getTarget(modelEvents, model) {
  var target = modelEvents.get(model.uid);
  if (!target) {
    target = {
      model: model,
      events: new Set()
    };
    modelEvents.set(model.uid, target);
  }
  return target;
}
