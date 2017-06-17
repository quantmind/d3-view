# Getting Started

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
- [Creating a view](#creating-a-view)
  - [Create a view-model object](#create-a-view-model-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

If you use [NPM](https://www.npmjs.com/package/d3-view), ``npm install d3-view``.
Otherwise, download the [latest release](https://github.com/quantmind/d3-view/releases).
You can also load directly from [giottojs.org](https://giottojs.org),
as a [standalone library](https://giottojs.org/latest/d3-view.js) or
[unpkg](https://unpkg.com/d3-view/).
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported.
Try [d3-view](https://runkit.com/npm/d3-view) in your browser.
```javascript
<script src="https://d3js.org/d3-collection.v1.min.js"></script>
<script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
<script src="https://d3js.org/d3-selection.v1.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://giottojs.org/latest/d3-view.min.js"></script>
<script>

var vm = d3.view();
...
vm.mount("#my-element");

</script>
```

## Creating a view

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
    props: [...],
    components: {...},
    directives: {...}
});
```

You can create more than one view:
```javascript
var vm2 = d3.view({
    model: {},
    props: [...],
    components: {},
    directives: {}
});
```

All properties in the input object are optionals and are used to initialised the view with
custom data: [model](./model.md), [components](./component.md) and [directives](./directives).
