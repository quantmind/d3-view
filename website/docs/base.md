# View Base

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Overview](#overview)
- [Properties](#properties)
  - [.name](#name)
  - [.el](#el)
  - [.providers](#providers)
  - [.sel](#sel)
  - [.uid](#uid)
- [Methods](#methods)
  - [.createElement (tag)](#createelement-tag)
  - [.viewElement (html, [context])](#viewelement-html-context)
  - [.domEvent()](#domevent)
  - [.fetch (url, [options])](#fetch-url-options)
  - [.fetchText (url, [options])](#fetchtext-url-options)
  - [.json (url, [options])](#json-url-options)
  - [.logDebug (msg)](#logdebug-msg)
  - [.logInfo (msg)](#loginfo-msg)
  - [.logWarn (msg)](#logwarn-msg)
  - [.logError (err)](#logerror-err)
  - [.on (el, typenames, listener)](#on-el-typenames-listener)
  - [.renderFromUrl (url, [context], [asElement])](#renderfromurl-url-context-aselement)
  - [.renderFromDist (name, path, [context], [asElement])](#renderfromdist-name-path-context-aselement)
  - [.select(HTMLElement)](#selecthtmlelement)
  - [.selectAll(HTMLElement)](#selectallhtmlelement)
  - [.selectChildren ([HTMLElement])](#selectchildren-htmlelement)
  - [.transition ([sel])](#transition-sel)
  - [.transitionDuration ([sel])](#transitionduration-sel)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Overview


The ``viewBase`` object is the base prototype for both view/component and directives
prototypes and therefore it is at the core of the extendibility for the framework.
```javascript
import {viewBase} from 'd3-view';

viewBase.myMethod = function () {
}
```


## Properties

### .name

Component name, for a view this is `view`, for any other component/directive it is the name
the component has been registered with. For directives, this is always prefixed with ``d3-``.

### .el

The HTMLElement of the component.

### .providers

Same as [viewProviders](./providers.md)

### .sel

Equivalent to ``d3.select(vm.el)``, d3 selection of the component element.

### .uid

Unique identifier

## Methods

### .createElement (tag)

Create a new HTML Element with the given tag. Return a [d3.selection][] of the new element.

### .viewElement (html, [context])

Render an ``html`` string into an HTML Element. This method returns a [d3.selection][].
If the optional ``context`` object is provided, it renders the html string using
[handlebars][] template engine (requires handlebars to be available).

### .domEvent()

Return the current dom event. Equivalent to ``d3.selection.event``.

### .fetch (url, [options])

Fetch a resource from a ``url``. This is a convenient method which uses the
``fetch`` [provider](./providers.md).

### .fetchText (url, [options])

Fetch a resource from a ``url`` and return the text value

### .json (url, [options])

Fetch a resource from a ``url`` and return the object obtained after parsing text as JSON.

### .logDebug (msg)

Convenience method for logging a debug message (only when debug is turned on).
Uses the ``viewProvider.logger`` instance with the [.name](#name) prefix.

### .logInfo (msg)

Convenience method for logging a info message.
Uses the ``viewProvider.logger`` instance with the [.name](#name) prefix.

### .logWarn (msg)

Convenience method for logging a warning message.
Uses the ``viewProvider.logger`` instance with the [.name](#name) prefix.

### .logError (err)

Convenience method for logging an error message or a stack trace in case ``err`` is an exception.
Uses the ``viewProvider.logger`` instance with the [.name](#name) prefix.

### .on (el, typenames, listener)

Adds or removes a listener to each selected element ``el`` for the specified event ``typenames``. The input ``el`` can be a [W3c selector string](https://www.w3.org/TR/selectors-api/), an HTML element or a [d3 selection](https://github.com/d3/d3-selection).
The ``typenames`` is a string event type, such as click, mouseover, or submit; any
[DOM event type](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events) supported by your browser may be used.
This method is a proxy for [d3-selection.on](https://github.com/d3/d3-selection#selection_on) with the only difference in the ``listener`` signature:
```javascript
function listener (event) {
    ...
}
```
where ``event`` is the ``d3.event`` fired.


### .renderFromUrl (url, [context], [asElement])

Fetch a template from a ``url`` (or the [cache][] if already loaded) and return a [Promise][] which resolve into a [d3.selection][] if ``asElement`` is ``true`` (by default it is true).

If the optional ``context`` object is provided, it renders the remote html string using
the ``compileHtml`` function in ``viewProviders`` (provided this functin is available).

The ``compileHtml`` function is not available in the standard ``d3-view`` distribution.
One could use [handlebars][] compile function for example:
```javascript
import Handlebars from 'handlebars';
import {viewProviders} from 'd3-view';

viewProviders.compileHtml = Handlebars.compile;
```

The ``asElement`` parameter can be set to ``false`` if the the template is not a valid html and therefore no conversion to d3-selection is required. This is useful for any other template such as text, json and so forth.

### .renderFromDist (name, path, [context], [asElement])

Similar to the previous function, but fetches the template/file form a distribution.


### .select(HTMLElement)

Return a [d3.selection][] of the ``HTMLElement``.

### .selectAll(HTMLElement)

Equivalent to ``d3.selectAll(HTMLElement)``.

### .selectChildren ([HTMLElement])

Select all children of a given HTMLElement, if the HTMLElement is not given
select all children of the [.el](#el) element.

### .transition ([sel])

Return a [d3.transition](https://github.com/d3/d3-transition#transition_transition) object if possible. It requires the [d3-transition][] module to be loaded in the bundle.
If a selection ``sel`` is not provided, return a transition on [.sel](#sel).
If [d3-transition][] is not loaded or a transition duration is not specified or equal to 0, this method returns nothing.

### .transitionDuration ([sel])

Fetch a transition duration for the selection ``sel``. If ``sel`` is not provided,
fetch a transition duration from [.sel](#sel).
A transition duration is specified in the ``data-transition-duration`` attribute.
```html
<div ... data-transition-duration=250></div>
```
If [d3-transition][] is not loaded this method always returns 0.


[cache]: ./component#vmcache
[d3.selection]: https://github.com/d3/d3-selection
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[handlebars]: http://handlebarsjs.com/
[d3-transition]: https://github.com/d3/d3-transition
