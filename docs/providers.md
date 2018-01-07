# Providers

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [logger](#logger)
- [fetch](#fetch)
- [compileTemplate (text)](#compiletemplate-text)
- [require](#require)
- [resolve (name, [options])](#resolve-name-options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


Providers are global entities used for a variety of applications such as logging, fetching data from url and so forth. To access the providers:

* In ES6
```javascript
import {viewProviders} from 'd3-view'
```
* In common JS
```javascript
d3.viewProviders
```

## logger

The logger is available at
```javascript
d3.viewProviders.logger
```

## fetch

Retrieve data from urls
```javascript
d3.viewProviders.fetch
```

## compileTemplate (text)

[Handlebars](http://handlebarsjs.com/) is required when rendering templates with static context.
To use handlebars, one can either include it as a script in the page or load it via require and
store it as a view provider:
```javascript
import {viewProviders} from 'd3-view';

require('handlebars').then(handlebars => {
    viewProviders.compileTemplate = handlebars.compile;
});
```

## require

Function for asynchronously loading modules
```javascript
require(name).then(...)
```
The function has the ``libs`` map for mapping name to url if needed:
```javascript
require.libs.set('marked', '/assets/marked.min.js');
```

## resolve (name, [options])

Function for resolving library names.
