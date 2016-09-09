# d3-view

[![CircleCI](https://circleci.com/gh/quantmind/d3-view.svg?style=svg&circle-token=f84972c3cf4e8f17d74066ead28544da990115c3)](https://circleci.com/gh/quantmind/d3-view)

[Coverage][]

This is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
interactive web interfaces.
It provides data-reactive components with a simple and flexible API.

* Modern javascript
* Minimal footprint  - use only what you need
* Built on top of [d3](https://github.com/d3)
 
## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
- [Getting Started](#getting-started)
  - [Create a view-model object](#create-a-view-model-object)
  - [Expressions](#expressions)
- [View](#view)
  - [View API](#view-api)
- [Model](#model)
  - [Model API](#model-api)
- [Directives](#directives)
  - [Core Directives](#core-directives)
  - [Custom Directive](#custom-directive)
  - [Directive API](#directive-api)
- [Components](#components)
  - [Registration](#registration)
  - [Components API](#components-api)
  - [Components hooks](#components-hooks)
  - [Plugins](#plugins)
- [Form Plugin](#form-plugin)
  - [Importing](#importing)
  - [Bootstrap layouts](#bootstrap-layouts)
- [Other Frameworks](#other-frameworks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

The only hard dependency are [d3-transition](https://github.com/d3/d3-transition) (and its dependencies),  [d3-collection](https://github.com/d3/d3-collection) and [d3-let](https://github.com/quantmind/d3-let).
If you use [NPM](https://www.npmjs.com/package/d3-view), ``npm install d3-view``.
Otherwise, download the latest release.
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:
```javascript
<script src="https://d3js.org/d3-view.min.js"></script>
<script>

var vm = d3.view();
...
vm.mount("#my-element");

</script>
```

## Getting Started

``d3.view`` is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
data driven web interfaces. It is not a framework as such, but you can easily
build one on top of it.

Importantly, this library does not make any choice for you, it is build on top
of the modular d3 library following very similar design patterns.


### Create a view-model object

To create a view object for you application, invoke the ``d3.view`` function
```javascript
var vm = d3.view({
    model: {...},
    components: {...},
    directives: {...}
});
```

You can create more than one view:
```
var vm2 = d3.view({
    model: {...},
    components: {...},
    directives: {...}
});
```

All properties in the input object are optionals and are used to initialised the view with
custom data ([model][]), [components][] and [directives][].

Lets consider one view for the sake of this introduction.
The ``vm`` obtained by the ```view`` function is a view-model object which
can be *mounted* into the DOM via the view ``mount`` function.

### Expressions

The text we put inside directive's values are called ``binding expressions``.
In d3-view, a binding expression consists of a single JavaScript expression
but not operations. The difference between expressions and operations is akin
to the difference between a cell in an Excel spreadsheet vs. a proper JavaScript program.

Valid expression are:
```javascript
"The sun"               //  literal
theme                   //  An identifier (a property of a model)
dosomething()           //  A function
[theme, number]         //  Arrays of identifiers
x ? "Hi" : "goodbye"    //  Conditionals
```
and complex combinations of the above
```
user.groups().join(", ")
[theme, user.groups(), "Hi"]
```

## View :heart:

### View API

<a name="user-content-view-model" href="#view-model">#</a> view.<b>model</b>

The [model](#model) bound to the view, the combo gives the name to the object, the **view-model object**.

<a name="user-content-view-parent" href="#view-parent">#</a> view.<b>parent</b>

The parent of a view, always undefined, a view is always the root element of
a view mounted DOM.

<a name="user-content-view-el" href="#view-el">#</a> view.<b>el</b>

Root HTMLElement of the view, once mounted.

<a name="user-content-view-mount" href="#view-mount">#</a> view.<b>mount</b>(<i>element</i>)

Mount a view model into the HTML ``element``.
The view only affect ``element`` and its children.
This method can be called **once only** for a given view model.

<a name="user-content-view-use" href="#view-use">#</a> view.<b>use</b>(<i>plugin</i>)

Install a [plugin](#plugins) into the view model. This method can be called several time with as many plugins as one needs,
however it can be called only before the view is mounted into an element.


## Model :zap:

At the core of the library we have the Hierarchical Reactive Model.
The Model comparable to angular scope but its implementation is different.

* **Hierarchical**: a **root** model is associated with a d3-view object.

* **Reactive**:

A model can be associated with more than one element, new children model are created for elements that needs a new model.
For example, a [component][] that specify the ``model`` object during initialisation, creates its own model,
a child model of the model associated with its parent element.

### Model API

<a name="user-content-model-parent" href="#model-parent">#</a> model.<b>parent</b>

Get the ancestor of the model if it exists. It it does not exist, this is the root model.

<a name="user-content-model-get" href="#model-get">#</a> model.<b>$get</b>(<i>attribute</i>)

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#model-parent).

<a name="user-content-model-set" href="#model-set">#</a> model.<b>$set</b>(<i>attribute, value</i>)

Set an attribute value from in the model, traversing the tree.

<a name="user-content-model-on" href="#model-on">#</a> model.<b>$on</b>(<i>attribute, callback</i>)

Add ``callback`` to a model reactive ``attribute``. The callback is invoked when
the attribute change value only. It is possible to pass the ``callback`` only, in which
case it is triggered when any of the model **own attributes** change.

<a name="user-content-model-child" href="#model-child">#</a> model.<b>$child</b>(<i>intials</i>)

Crate a child model with prototypical inheritance from the model.

<a name="user-content-model-new" href="#model-new">#</a> model.<b>$new</b>(<i>intials</i>)

Create a child model, with no inheritance from the parent (an isolated model).

## Directives :clap:

Directives are special attributes with the ``d3-`` prefix.
Directive attribute values are expected to be binding [expressions](#expressions).
The library provides several directives for every day task.

For example the ``d3-html`` directive binds an expression to the inner
Html of the element containing the directive:
```html
<div id="entry">
    ...
    <p d3-html='paragrah'></p>
    ...
</div>
```
Here the ``paragraph`` is a reactive attribute of the View model.
```javascript
d3.view({
    model: {
        paragraph: 'TODO'
    }
}).mount('#entry');
```

### Core Directives

<a name="user-content-d3-attr" href="#d3-attr">#</a> [d3-attr][]

Create a one-way binding between a model property and an HTML element attribute
```html
<input d3-attr-name="code" d3-attr-placeholder="description || code">
```
The ``attr`` can be omitted for ``class``, ``name`` , ``disabled``, ``readonly`` and ``required``.
```html
<input d3-name="code" d3-class="bright ? 'bright' : 'dull'">
```
``code`` and ``bright`` are reactive properties of the view-model.

<a name="user-content-d3-for" href="#d3-for">#</a> [d3-for][]

<a name="user-content-d3-html" href="#d3-html">#</a> [d3-html][]

<a name="user-content-d3-if" href="#d3-if">#</a> [d3-if][]

<a name="user-content-d3-model" href="#d3-model">#</a> [d3-model][]

<a name="user-content-d3-on" href="#d3-on">#</a> [d3-on][]

Attaches an event listener to the element. The event type is denoted by the argument.
The expression should be model method call, the event ``callback``. if the attribute is omitted
it is assumed to be a ``click`` event.
The event ``callback`` listens to **native DOM events only**.
```html
<button d3-on-click="submit()">Submit</button>
```

<a name="user-content-d3-value" href="#d3-value">#</a> [d3-value][]

Establish a **two-way data binding** for HTML elements supporting the value property.
The binding is tw ways because

* an update in the model attribute causes an update in the HTML value property
* an update in the HTML value property causes an update in the model attribute

### Custom Directive

Creating a custom directive involve the following steps:

* Create a (reusable) directive object:
```javascript
var mydir = {
    create: function (expression) {
        return expression;
    },
    mount: function (model) {
        return model;
    },
    refresh: function (model, value) {
    },
    destroy: function () {
    
    }
};
```
* Add the directive to the view constructor:
```javascript
var vm = d3.view({
    el: '#entry',
    ...
    directives: {
        mydir: mydir
    }
};
```
* Use the directive via the ``d3-mydir`` attribute.

A directive is implemented customized via the four methods highlighted above.
None of the method needs implementing, and indeed for some directive the ``refresh`` method is the only one which needs attention.

### Directive API

<a name="user-content-directive-create" href="#directive-create">#</a> directive.<b>create</b>(<i>expression</i>)

The ``create`` method is called once only, at the end of directive initialisation, no binding with the HTML element or the model has yet occurred.
The ``expression`` is the attribute value, a string, and it is not yet parsed.
This method must return the expression for parsing (it doesn't need to be the same as the input expression).
However, if it returns nothing, the directive is not executed.

<a name="user-content-directive-mount" href="#directive-mount">#</a> directive.<b>mount</b>(<i>model</i>)

The ``mount`` method is called once only, at the beginning of the binding process with the HTML element.
The expression returned by the ``create`` method
has been parsed and available in the ``this.expression`` attribute.
This method must return the model for binding (it doesn't need to be the same as the input model, but usually it is).
However, if it returns nothing, the binding execution is aborted.

<a name="user-content-directive-refresh" href="#directive-refresh">#</a> directive.<b>refresh</b>(<i>model, newValue</i>)

<a name="user-content-directive-destroy" href="#directive-destroy">#</a> directive.<b>destroy</b>(<i>model</i>)

## Components :punch:

Components help you extend basic HTML elements to encapsulate reusable code.
They are custom elements that ``d3.view`` attach specified behavior to.

### Registration

In order to use components you need to register them with the ``view`` object:
```javascript
d3.view({
    components: {
        tag1: component1,
        ...
        tagN: componentN
    }
});
```
A component is either an object:
```javascript
var component1 = {
    render: function () {
        return this.htmlElement('<p>Very simple component</p>');
    }
};
```
or a function, the component render method:
```javascript
function component1 () {
    return this.htmlElement('<p>Another very simple component</p>');
}
```

### Components API

<a name="user-content-component-el" href="#component-el">#</a> component.<b>el</b>

The HTML element created by the component [render][] method. Available after the component is mounted.

<a name="user-content-component-model" href="#component-model">#</a> component.<b>model</b>

The [model][] bound to the component


### Components hooks

A component is defined by the [render][] method. However, there are four additional methods that can be used to
customize lifecycle of a component.

<a name="user-content-component-init" href="#component-init">#</a> component.<b>init</b>(<i>options</i>)

Hook called once only at the beginning of the component initialisation process, before it is mounted into the DOM.

<a name="user-content-component-render" href="#component-render">#</a> component.<b>render</b>(<i>data, attrs</i>)

This is **the only required hook**. It is called once only while the component is being mounted into the DOM
and must return a single HTMLElement or a selector with one node only.
The returned element replaces the component element in the DOM.

* **data** is the data object in the component element
* **attrs** is an object containing the key-value of attributes in the component element

<a name="user-content-component-mounted" href="#component-refresh">#</a> component.<b>mounted</b>()

Hook called after the component has been mounted in to the DOM.
In this state the component has the full API available
and all its children elements are mounted too.

<a name="user-content-component-destroy" href="#directive-destroy">#</a> directive.<b>destroy</b>()

Called when the component HTML element is removed from the DOM.

### Plugins

Plugins usually add functionality to a view-model.
There is no strictly defined scope for a plugin but there are typically several
types of plugins you can write:

* Add a group of [components](#components)
* Add a group of [directives](#directives)
* Add some components methods by attaching them to components prototype.
* Add providers to the ``view.providers`` object

A plugin can be an object with the ``install`` method or a simple
function (same signature as the install method).
```javascript
var myPlugin = {
    install: function (vm) {
        // add a component
        vm.addComponent('alert', {
            model: {
                style: "alert-info",
                text: "Hi! this is a test!"
            },
            render: function () {
                return view.htmlElement('<div class="alert" :class="style" d3-html="text"></div>');
            }
        });
        // add another component
        vm.addComponent('foo', ...);
        
    }
}
```

A plugin is installed in a view via the chainable ``use`` method:
```javascript
var vm = d3.view();
vm.use(myPlugin).use(anotherPlugin);
```

## Form Plugin :gift:

This library include a form plugin for creating dynamic forms from JSON layouts.
The plugin adds the ``d3form`` [component][] to the view-model:
```javascript
import {view, viewForms} from 'd3-view';

var vm = view().use(viewForms);
```

### Importing

If you are using [rollup][] to compile your javascript application, the form plugin
will be included in your compiled file only if
```javascript
import {viewForms} from 'd3-view';
```
is present somewhere in your code. Otherwise, it will be eliminated thanks to
tree-shaking.

### Bootstrap layouts

It is possible to use bootstrap layouts for d3 forms by importing and using the ``viewBootstrapForms`` plugin:
```javascript
import {view, viewForms, viewBootstrapForms} from 'd3-view';

var vm = view().use(viewForms).use(viewBootstrapForms);
```

## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)


[Coverage]: https://circleci.com/api/v1/project/quantmind/d3-view/latest/artifacts/0/$CIRCLE_ARTIFACTS/coverage/index.html?branch=master&filter=successful
[rollup]: http://rollupjs.org/
[model]: #model
[component]: #components
[components]: #components
[directives]: #directives
[d3-attr]: https://github.com/quantmind/d3-view/blob/master/src/directives/attr.js
[d3-for]: https://github.com/quantmind/d3-view/blob/master/src/directives/for.js
[d3-html]: https://github.com/quantmind/d3-view/blob/master/src/directives/html.js
[d3-if]: https://github.com/quantmind/d3-view/blob/master/src/directives/if.js
[d3-model]: https://github.com/quantmind/d3-view/blob/master/src/directives/model.js
[d3-on]: https://github.com/quantmind/d3-view/blob/master/src/directives/on.js
[d3-value]: https://github.com/quantmind/d3-view/blob/master/src/directives/value.js
[render]: #component-render
