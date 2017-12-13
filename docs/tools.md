# Library tools

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [isAbsoluteUrl (url)](#isabsoluteurl-url)
- [viewProviders](#viewproviders)
- [viewRequire (name, [name, ...])](#viewrequire-name-name-)
- [viewResolve (name, [options])](#viewresolve-name-options)
- [viewElement (text, [context])](#viewelement-text-context)
- [viewTemplate (text, [context])](#viewtemplate-text-context)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## isAbsoluteUrl (url)

Check if a ``url`` is absolute, i.e. it contains the full schema, domain and path information.

## viewProviders

See the [providers](./providers.md) documentation.

## viewRequire (name, [name, ...])



## viewResolve (name, [options])


## viewElement (text, [context])

Compile an HTML text template via the [viewTemplate](#viewtemplate-text-context) function and return
a new HTMLElement.

## viewTemplate (text, [context])

Render a text template with an optional context object. If the ``context``
object is not given this is a simple passthrough function. If the ``context``
object is given, it uses the [providers](./providers.md) ``compileTemplate`` function if available, otherwise
it logs an error and return the ``text`` without compiling the template.
