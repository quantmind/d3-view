# Getting Started

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
- [A simple App](#a-simple-app)
- [Dependencies](#dependencies)
- [Creating a view](#creating-a-view)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

If you use [NPM](https://www.npmjs.com/package/d3-view), ``npm install d3-view``.
Otherwise, download the [latest release](https://github.com/quantmind/d3-view/releases).
You can also load directly from [unpkg](https://unpkg.com/d3-view/).
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported.
Try [d3-view](https://runkit.com/npm/d3-view) in your browser.

## A simple App

To best understand d3-view is to code a simple application:
```html
<!DOCTYPE html>
<html>
<head>
  <title>d3 view app</title>
  <meta charset="utf-8">
  <script src="https://unpkg.com/d3-view/build/d3-require.js"></script>
</head>
<body>
  <div id="app"><p d3-html="countdown"></p></div>
  <script>
    d3.require('d3-view', 'd3-timer').then(async d3 => {
      const vm = d3.view({model: {countdown: 5}});
      await vm.mount("#app");

      const timer = d3.interval(() => {
        vm.model.countdown -= 1;
        if (!vm.model.countdown) {
          vm.model.countdown = 'Welcome to d3-view!';
          timer.stop();
        }
      }, 1000);
    });
  </script>
</body>
</html>
```

In this small example we have performed the following steps:
* Created a ``view`` object with a [model](./model.md) containing the ``countdown`` attribute
* Mounted the view into the DOM via the ``#app`` selector and waited to be ready (mounting is asynchronous)
* The app displays the ``countdown`` value
* Modified the countdown model attribute and see the value changing

## Dependencies

d3-view strictly depends on four d3 plugins:

* [d3-dispatch](https://github.com/d3/d3-dispatch)
* [d3-let](https://github.com/d3/d3-let)
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
    components: {...},
    directives: {...}
});
```

You can create more than one view:
```javascript
var vm2 = d3.view({
    model: {...},
    components: {...},
    directives: {...}
});
```

All properties in the input object are optionals and are used to initialise the view with
custom data reactive data ([model](./model.md)), [components](./component.md) and [directives](./directives.md).
