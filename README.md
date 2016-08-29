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
- [API Reference](#api-reference)
  - [Directives](#directives)
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
of the modular d3 library following very similar design guidelines.


## API Reference

### Directives


### Components

Components help you extend basic HTML elements to encapsulate reusable code.
At a high level, Components are custom elements that ``d3.View`` attach
specified behavior to.

#### Registration

#### Reusing


## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)


[Coverage]: https://circleci.com/api/v1/project/quantmind/d3-view/latest/artifacts/0/$CIRCLE_ARTIFACTS/coverage/index.html?branch=master&filter=successful
