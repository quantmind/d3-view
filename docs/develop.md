# Development

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [ES6](#es6)
- [Contributing](#contributing)
- [Other Frameworks](#other-frameworks)
- [D3 plugins](#d3-plugins)
- [CI](#ci)

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

## CI

For continuous integration there are few steps to go through:

* [qmbot](https://github.com/qmbot) user must be able to push to the repo (for this make sure this repository is part of the [boot](https://github.com/orgs/quantmind/teams/boot/members) team with **write permissions**)
* Login to CircleCI as qmbot and [follow this project](https://circleci.com/add-projects/gh/quantmind)
* Go to this project settings, permissions, Checkout SSH keys and add user key
* Learn about [NPM Tokens](https://www.npmjs.com/settings/tokens) to push releases from CI
* Add the token as environment variable ``NPM_TOKEN``

[rollup]: https://github.com/rollup/rollup
