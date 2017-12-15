# Library tools

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [viewProviders](#viewproviders)
- [Require](#require)
  - [isAbsoluteUrl (url)](#isabsoluteurl-url)
  - [viewRequire (names...)](#viewrequire-names)
  - [viewRequire.libs](#viewrequirelibs)
  - [viewResolve (name, [options])](#viewresolve-name-options)
- [Text Utilities](#text-utilities)
  - [viewElement (text, [context])](#viewelement-text-context)
  - [viewSlugify (text)](#viewslugify-text)
  - [viewTemplate (text, [context])](#viewtemplate-text-context)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## viewProviders

See the [providers](./providers.md) documentation.


## Require

A minimal, promise-based implementation to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD).
Most of the implementation is from [d3-require](https://github.com/d3/d3-require) with some twicks for accomodating for
library versions and location.

### isAbsoluteUrl (url)

Check if a ``url`` is absolute, i.e. it contains the full schema, domain and path information.

### viewRequire (names...)

Asynchronously load modules, for example this call loads two modules and merge them into a single object:
```javascript
viewRequire('d3-shape', 'd3-geo').then(d3 => {
    ...
});
```
To load a module with a version, set the version value before loading:
```javascript
viewRequire.libs.set('d3-shape', {
    version: 1
});
```
This function should not be used directly, instead the ``viewProviders.require`` should be used instead.

### viewRequire.libs

Mapping of library names to library information object. A library information object has the following entries (all optional)
```javascript
{
    "version": "library version (can be partial)",
    "main": "library main file (relative path)",
    "origin": "the origin part of the url, set to '/' for a local library for example"
}
```
This function should not be used directly, instead the ``viewProviders.require.libs`` should be used instead.

### viewResolve (name, [options])

Returns the URL to load the module with the specified ``name``.
The name may also be specified as a relative path, in which case it is resolved relative to the specified ``options.base`` URL.
If ``options.base`` is not specified, it defaults to the global [location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location).
The input name can be

* a URL
* a relative path
* a library name

The implementation will check the ``viewRequire.libs`` for information about the library to load.

This function should not be used directly, instead the ``viewProviders.resolve`` should be used instead.

## Text Utilities

### viewElement (text, [context])

Compile an HTML text template via the [viewTemplate](#viewtemplate-text-context) function and return
a new HTMLElement.

### viewSlugify (text)

Convert a text string into a [slug](https://en.wikipedia.org/wiki/Semantic_URL).

### viewTemplate (text, [context])

Render a text template with an optional context object. If the ``context``
object is not given this is a simple passthrough function. If the ``context``
object is given, it uses the [providers](./providers.md) ``compileTemplate`` function if available, otherwise
it logs an error and return the ``text`` without compiling the template.
