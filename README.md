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
  - [Custom Directive](#custom-directive)
  - [Directive API](#directive-api)
- [Components](#components)
  - [Registration](#registration)
  - [Reusing](#reusing)
- [Other Frameworks](#other-frameworks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

The only hard dependency are [d3-transition](https://github.com/d3/d3-transition) (and its dependencies) and [d3-collection](https://github.com/d3/d3-collection). If you use NPM, ``npm install d3-view``.
Otherwise, download the latest release.
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:
```javascript
<script src="https://d3js.org/d3-view.min.js"></script>
<script>

var view = new d3.View({
    el: "#my-element"
});

view.mount();

</script>
```

## Getting Started

``d3.View`` is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
data driven web interfaces. It is not a framework as such, but you can easily
build one on top of it.

Importantly, this library does not make any choice for you, it is build on top
of the modular d3 library following very similar design patterns.

### Create the View

Create a view object for you application, it doesn't need to be the whole application:
```javascript
var v1 = d3.view({
    el: '#entry',
    components: {...},
    directives: {...}
});
// v1 is one view managed by d3.View

// You can create more than one if you need to
var v2 = d3.view({
    el: '#entry2',
    components: {...},
    directives: {...}
});
// v2 is another view managed by d3.View
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
[theme, number]         //  Arrays
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

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#model-parent).



## Directives

Directives are special attributes with the ``d3-`` prefix.
Directive attribute values are expected to be binding [expression](#expressions).
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
At a high level, Components are custom elements that ``d3.View`` attach
specified behavior to.

### Registration

In order to use components you need to register them with the `view`` object 

### Reusing

Components can be designed to be reused.


## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)


[Coverage]: https://circleci.com/api/v1/project/quantmind/d3-view/latest/artifacts/0/$CIRCLE_ARTIFACTS/coverage/index.html?branch=master&filter=successful
