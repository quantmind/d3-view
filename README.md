# d3-view

[![CircleCI](https://circleci.com/gh/quantmind/d3-view.svg?style=svg&circle-token=f84972c3cf4e8f17d74066ead28544da990115c3)](https://circleci.com/gh/quantmind/d3-view)

This is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
interactive web interfaces.
It provides data-reactive components with a simple and flexible API.

* Modern javascript
* Minimal footprint  - use only what you need
* Built on top of [d3](https://github.com/d3)
 
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

## API Reference

## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)
