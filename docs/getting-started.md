# Getting Started

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
- [Dependencies](#dependencies)
- [Creating a view](#creating-a-view)

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
<script src="https://unpkg.com/d3-let/build/d3-let.min.js"></script>
<script src="https://d3js.org/d3-selection.v1.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://d3js.org/d3-require.v1.min.js"></script>
<script src="https://unpkg.com/d3-view/build/d3-view.min.js"></script>
<script>

var vm = d3.view();
...
vm.mount("#my-element");

</script>
```

## Dependencies

d3-view strictly depends on five d3 plugins:

* [d3-collection](https://github.com/d3/d3-collection)
* [d3-dispatch](https://github.com/d3/d3-dispatch)
* [d3-let](https://github.com/d3/d3-let)
* [d3-require](https://github.com/d3/d3-require)
* [d3-selection](https://github.com/d3/d3-selection)
* [d3-timer](https://github.com/d3/d3-timer)

However, to write interesting UI components one may want to use many other
d3 plugins, or the whole d3 library.

## Creating a view

``d3.view`` is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
data driven web interfaces. It is not a framework as such, but you can easily
build one on top of it.

Importantly, this library does not make any choice for you, it is build on top
of the modular d3 library following very similar design patterns.

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
custom data: [model](./model.md), [components](./component.md) and [directives](./directives.md).
