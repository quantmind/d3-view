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
  - [Create the View](#create-the-view)
  - [Expressions](#expressions)
- [Model](#model)
  - [Model API](#model-api)
- [Directives](#directives)
  - [Core Directives](#core-directives)
  - [Custom Directive](#custom-directive)
  - [Directive API](#directive-api)
- [Components](#components)
  - [Registration](#registration)
  - [Components API](#components-api)
  - [Components Hooks](#components-hooks)
- [Other Frameworks](#other-frameworks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

The only hard dependency are [d3-transition](https://github.com/d3/d3-transition) (and its dependencies) and [d3-collection](https://github.com/d3/d3-collection). If you use NPM, ``npm install d3-view``.
Otherwise, download the latest release.
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:
```javascript
<script src="https://d3js.org/d3-view.min.js"></script>
<script>

var view = d3.view({
    el: "#my-element"
});

view.mount();

</script>
```

## Getting Started

``d3.view`` is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
data driven web interfaces. It is not a framework as such, but you can easily
build one on top of it.

Importantly, this library does not make any choice for you, it is build on top
of the modular d3 library following very similar design patterns.


### Create the View

To create a view object for you application, invoke the ``d3.view`` function with at least the ``el`` entry in the input object
```javascript
var v1 = d3.view({
    el: '#entry',
    components: {...},
    directives: {...}
});
```

You can create more than one view:
```
var v2 = d3.view({
    el: '#entry2',
    components: {...},
    directives: {...}
});
```

Both ``v1`` and ``v2`` are

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

## Model

At the core of the library we have the Hierarchical Reactive Model.
The Model comparable to angular scope but its implementation is different.

* **Hierarchical**: a **root** model is associated with a d3-view object.

* **Reactive**:

A model can be associated with more than one element, new children model are created for elements that needs a new model.
For example, a [component][] that specify the ``model`` object during initialisation, creates its own model,
a child model of the model associated with its parent element.

### Model API

<a name="parent" href="#model-parent">#</a> model.<b>parent</b>

Get the ancestor of the model if it exists. It it does not exist, this is the root model.

<a name="$get" href="#model-get">#</a> model.<b>$get</b>(<i>attribute</i>)

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#model-parent).

<a name="$set" href="#model-set">#</a> model.<b>$set</b>(<i>attribute, value</i>)

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#model-parent).

<a name="$on" href="#model-on">#</a> model.<b>$on</b>(<i>attribute, callback</i>)

Add ``callback`` to a model reactive ``attribute``. The callback is invoked when
the attribute change value only. It is possible to pass the ``callback`` only, in which
case it is triggered when any of the model **own attributes** change.

<a name="$mount" href="#model-mount">#</a> model.<b>$mount</b>(<i>HTMLElement</i>)

Mount a model into an HTML Element. It kick starts the model-DOM binding process for the given element.
If the element was already bound to a model, it does nothing and a warning is issued.



## Directives

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
    el: '#entry',
    model: {
        paragraph: 'TODO'
    }
}).mount();
```

### Core Directives

<a name="d3-attr" href="#d3-attr">#</a> [d3-attr][]

Create a one-way binding between a model property and an HTML element attribute
```html
<input d3-attr:name="code" d3-attr:placeholder="description || code">
```
The ``d3-attr`` can also be ommited:
```html
<input :name="code" :placeholder="description || code">
```
``code`` and ``description`` are properties of the d3-view model.

<a name="d3-for" href="#d3-for">#</a> [d3-for][]

<a name="d3-html" href="#d3-html">#</a> [d3-html][]

<a name="d3-if" href="#d3-if">#</a> [d3-if][]

<a name="d3-model" href="#d3-model">#</a> [d3-model][]

<a name="d3-on" href="#d3-on">#</a> [d3-on][]

<a name="d3-value" href="#d3-value">#</a> [d3-value][]

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

<a name="create" href="#directive-create">#</a> directive.<b>create</b>(<i>expression</i>)

The ``create`` method is called once only, at the end of directive initialisation, no binding with the HTML element or the model has yet occurred.
The ``expression`` is the attribute value, a string, and it is not yet parsed.
This method must return the expression for parsing (it doesn't need to be the same as the input expression).
However, if it returns nothing, the directive is not executed.

<a name="mount" href="#directive-mount">#</a> directive.<b>mount</b>(<i>model</i>)

The ``mount`` method is called once only, at the beginning of the binding process with the HTML element.
The expression returned by the ``create`` method
has been parsed and available in the ``this.expression`` attribute.
This method must return the model for binding (it doesn't need to be the same as the input model, but usually it is).
However, if it returns nothing, the binding execution is aborted.

<a name="refresh" href="#directive-refresh">#</a> directive.<b>refresh</b>(<i>model, newValue</i>)

<a name="destroy" href="#directive-destroy">#</a> directive.<b>destroy</b>(<i>model</i>)

## Components

Components help you extend basic HTML elements to encapsulate reusable code.
They are custom elements that ``d3.view`` attach specified behavior to.

### Registration

In order to use components you need to register them with the ``view`` object:
```javascript
d3.view({
    el: '#entry',
    components: {
        tag1: component1,
        ...
        tagN: componentN
    }
});
```
A component is either a ``Component`` subclass created via the API:
```javascript
import {view} from 'd3-view';

class component1 extends view.Component {
    render () {
        ...
    }
}
```
or an object:
```javascript
var component1 = {
    render: function () {
    }
};
```
or a function, the component render method:
```javacript
function component1 () {
    return d3.view.htmlElement('<p>Very simple component</p>');
}
```

### Components API

<a name="el" href="#component-el">#</a> component.<b>el</b>

The HTML element created by the component ``render`` method. Available after the component is mounted.

<a name="model" href="#component-model">#</a> component.<b>model</b>

The [model][] bound to the component


### Components Hooks

A component is defined by the ``render`` method. However, there are four additional methods that can be used to
customize lifecycle of a component.

<a name="init" href="#component-init">#</a> component.<b>init</b>(<i>options</i>)

Hook called at the beginning of the component initialisation process, before it is mounted into the DOM.

<a name="created" href="#component-create">#</a> component.<b>create</b>()

Hook is called at the end of the component initialisation process, before it is mounted into the DOM.

<a name="mounted" href="#component-refresh">#</a> component.<b>mounted</b>()

Hook called after the component has been mounted in to the DOM.

<a name="destroy" href="#directive-destroy">#</a> directive.<b>destroy</b>(<i>model</i>)

Called when the component HTML element is removed from the DOM.

## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)


[Coverage]: https://circleci.com/api/v1/project/quantmind/d3-view/latest/artifacts/0/$CIRCLE_ARTIFACTS/coverage/index.html?branch=master&filter=successful
[model]: #model
[component]: #components
[d3-attr]: https://github.com/quantmind/d3-view/blob/master/src/directives/attr.js
[d3-for]: https://github.com/quantmind/d3-view/blob/master/src/directives/for.js
[d3-html]: https://github.com/quantmind/d3-view/blob/master/src/directives/html.js
[d3-if]: https://github.com/quantmind/d3-view/blob/master/src/directives/if.js
[d3-model]: https://github.com/quantmind/d3-view/blob/master/src/directives/model.js
[d3-on]: https://github.com/quantmind/d3-view/blob/master/src/directives/on.js
[d3-value]: https://github.com/quantmind/d3-view/blob/master/src/directives/value.js
