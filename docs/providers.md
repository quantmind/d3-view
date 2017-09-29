# Providers

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Access Providers](#access-providers)
  - [Logger](#logger)
  - [Fetch](#fetch)
- [Require](#require)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Access Providers

Providers are global entities used for a variety of applications such as logging, fetching data from url and so forth. To access the providers:

* In ES6
```javascript
import {viewProviders} from 'd3-view'
```
* In common JS
```javascript
d3.viewProviders
```

### Logger

The logger is available at
```javascript
d3.viewProviders.logger
```

### Fetch

Retrieve data from urls
```javascript
d3.viewProviders.fetch
```

## Require

The library export the ``require`` function for asynchronously load modules
```javascript
require(name).then(...)
```
The function has the ``libs`` map for mapping name to url if needed:
```javascript
require.libs.set('marked', '/assets/marked.min.js');
```
