# View-Require

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [view-require](#view-require)
  - [config](#config)
- [d3-require.js](#d3-requirejs)
  - [Version](#version)
  - [Main](#main)
  - [Local module](#local-module)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## view-require

The ``view-require`` executable is useful for creating a ``d3-require`` file with dependencies matching the ``package.json`` file of your module.

For help on how to use the script in terminal
```
view-require -h
```

### config

It is possible to specify a ``require.config.js`` file of the form:
```javascript

module.exports = {
    out: 'build/xxxx.js',
    prepend: [
        'whatwg-fetch/fetch.js'
    ],
    append: [
        'build/require.js'
    ],
    dependencies: {
        "ace-builds": {
            main: "src-min/ace.js"
        },
        handlebars: {
            main: 'dist/handlebars.min.js'
        }
    }
};
```

## d3-require.js

The [d3-require.js][] javascript file is a minimal, promise-based implementation
to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD)
```javascript
d3.require('d3-view').then(d3 => {
    ...
});
```

### Version

The ``d3.libs`` map is useful for setting versions:
```javascript
d3.libs.set('d3-selection', {
    version: '1.1'
});
```
The required url will be
```
https://unpkg.com/d3-selection@1.1
```

### Main

THe ``libs`` map is useful for setting the main file of a distribution:
```javascript
d3.libs.set('d3-selection', {
    version: '1.1',
    main: 'build/d3-selection.min.js'
});
```
The required url will be
```
https://unpkg.com/d3-selection@1.1/build/d3-selection.min.js
```

### Local module

This example will set the ``mylib`` requirement to a local module
```javascript
d3.libs.set('mylib', {
    origin: '/',
    main: 'the/main/module.js'
});
```
