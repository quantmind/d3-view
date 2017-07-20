# Development

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [ES6](#es6)
- [Other Frameworks](#other-frameworks)
- [D3 plugins](#d3-plugins)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## ES6

d3-view is written in Javascript ES6 and uses [rollup][] for creating bundles.
During development one can use the rollup watch client for fast incremental
rebuilds:
```bash
yarn dev
```

## Contributing

We welcome all type of contributions, all you need to do is to
check the very minimal [contributing](../contributing.md) guidelines and
contribute in the form of

* bug fixes
* feature requests
* API design
* Documentation
* Examples as blocks
Check the very minimal [contributing](../contributing.md) guidelines and hope
to see your patch or idea soon.

## Other Frameworks

d3-view is a model-view library, lightweight by design. There are several other
libraries or frameworks doing or aim at doing similar things.

* [Angular](https://angularjs.org/) - monolitic framework
* [React](https://facebook.github.io/react/) - very popular
* [Vue](http://vuejs.org/) - popular - d3-view has taken some idea from it


## D3 plugins

Some plugin we really like

* [d3-annotation](https://github.com/susielu/d3-annotation)
* [d3-contour](https://www.npmjs.com/package/d3-contour)
* [d3-interpolate-path](https://github.com/pbeshai/d3-interpolate-path)
* [d3-line-chunked](https://github.com/pbeshai/d3-line-chunked)
* [d3-scale-cluster](https://github.com/schnerd/d3-scale-cluster)

Discover more at [npm d3-plugins](https://www.npmjs.com/browse/keyword/d3-module)


[rollup]: https://github.com/rollup/rollup
