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
- [Directives](#directives)
- [Components](#components)
  - [Registration](#registration)
  - [Reusing](#reusing)
- [API Reference](#api-reference)
  - [Directives](#directives-1)
  - [Components](#components-1)
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
var v1 = new d3.View({
    el: '#entry',
    components: {...},
    directives: {...}
});
// v1 is one view managed by d3.View

// You can create more than one if you need to
var v2 = new d3.View({
    el: '#entry2',
    components: {...},
    directives: {...}
});
// v2 is another view managed by d3.View
```

Both ``v1`` and ``v2`` are
## Directives


## Components

Components help you extend basic HTML elements to encapsulate reusable code.
At a high level, Components are custom elements that ``d3.View`` attach
specified behavior to.

### Registration

In order to use components you need to register them with the `view`` object 

### Reusing


## API Reference

### Model

At the core of the library we have the Hierarchical Reactive Model.
The Model comparable to angular scope but its implementation is very different.

<a name="$get" href="#model-$get">#</a> model.<b>$get</b>(<i>attribute</i>) [<>](https://github.com/d3/d3-selection/blob/master/src/selectAll.js "Source")

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#model-$parent).

<a name="$parent" href="#model-$parent">#</a> model.<b>$parent</b> [<>](https://github.com/d3/d3-selection/blob/master/src/selectAll.js "Source")

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#model-$parent).

### Directives


### Components


## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)


[Coverage]: https://circleci.com/api/v1/project/quantmind/d3-view/latest/artifacts/0/$CIRCLE_ARTIFACTS/coverage/index.html?branch=master&filter=successful
