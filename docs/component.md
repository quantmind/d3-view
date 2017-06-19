# Components

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Registration](#registration)
- [Creating a Component](#creating-a-component)
  - [model](#model)
  - [init (<i>options</i>)](#init-ioptionsi)
  - [render (<i>data, attrs</i>)](#render-idata-attrsi)
  - [mounted()](#mounted)
  - [destroy()](#destroy)
- [Component API](#component-api)
  - [vm.model](#vmmodel)
  - [vm.el](#vmel)
  - [vm.parent](#vmparent)
  - [vm.root](#vmroot)
  - [vm.cache](#vmcache)
  - [vm.uid](#vmuid)
  - [vm.events](#vmevents)
  - [vm.createElement (<i>tag</i>)](#vmcreateelement-itagi)
  - [vm.viewElement (<i>html</i>, [<i>context</i>])](#vmviewelement-ihtmli-icontexti)
  - [vm.fetch (<i>url</i>, [<i>options</i>])](#vmfetch-iurli-ioptionsi)
  - [vm.renderFromUrl (<i>url</i>, [<i>context</i>])](#vmrenderfromurl-iurli-icontexti)
- [Selection](#selection)
  - [selection.view()](#selectionview)
  - [selection.model()](#selectionmodel)
  - [selection.mount(<i>data</i>, [<i>callback</i>])](#selectionmountidatai-icallbacki)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Overview

Components help you extend basic HTML elements to encapsulate reusable code.
They are custom elements that [d3.view][] attach specified behavior to. They have the same API as the [d3.view][] with the exception they cannot be the root view, i.e. a component ``parent`` attribute is always available.


## Registration

In order to use components you need to register them with a ``view`` object:
```javascript
d3.view({
    model: {...},
    components: {
        tag1: component1,
        ...
        tagN: componentN
    }
});
```
A component is either an object:
```javascript
var component1 = {
    render: function () {
        return this.htmlElement('<p>Very simple component</p>');
    }
};
```
or a function, the component **render** method:
```javascript
function component1 () {
    return this.htmlElement('<p>Another very simple component</p>');
}
```


## Creating a Component

A component is defined by the [render][] method. However, there are optional properties and
methods that can be used to customize construction and lifecycle of a component.
```javascript
var component = {
    model: {...},
    props: [...],
    init (options) {
    },
    render (data, attr) {
    },
    mounted () {
    },
    destroy () {
    }
};
```

The optional ``props`` array can specify a set of html attributes which
contribute to the component data.
The html properties can contain

* JSON strings
* Model attribute name

### model

A function or an object which specifies the default values of the component model.

Once the component has been mounted, this is becomes the
model associated with the component and therefore an API property
of the component.

Some component have their own model, other they use the model of the parent component.

### init (<i>options</i>)

Hook called once only at the beginning of the component initialisation process, before it is mounted into the DOM.

### render (<i>data, attrs</i>)

This is **the only required hook**. It is called once only while the component is being mounted into the DOM
and must return a single HTMLElement or a selector with one node only.
The returned element replaces the component element in the DOM.
Importantly, this function can also return a [Promise][] which resolve in an HTMLElement or selector.

* ``data`` is the data object in the component element
* ``attrs`` is an object containing the key-value of attributes in the component element

### mounted()

Hook called after the component has been mounted in to the DOM.
In this state the component has the full API available
and all its children elements are mounted too.

### destroy()

Called when the component HTML element is removed from the DOM.

## Component API

Components and views share the same API.

### vm.model

The [model](#model) bound to the component, the combo gives the name to the **view-model object**, often shortened to ``vm`` or ``cm``.

### vm.el

Root HTMLElement of the view.

### vm.parent

The parent component. If not defined this is the root view, not a component.

### vm.root

The [d3.view][] object the component belongs to. Equal to itself if the component is a [d3.view][].

### vm.cache

An object for storing data. This object is the same across all components in a given [d3.view][].
```
vm.cache.foo = 'test';
```

### vm.uid

Unique identifier

### vm.events

Events object which can be used for registering event listeners or firing events.

### vm.createElement (<i>tag</i>)

Create a new HTML Element with the given tag. Return a [d3.selection][] of the new element.

### vm.viewElement (<i>html</i>, [<i>context</i>])

Render an ``html`` string into an HTML Element. This method returns a [d3.selection][].
If the optional ``context`` object is provided, it renders the html string using
[handlebars][] template engine (requires handlebars to be available).

### vm.fetch (<i>url</i>, [<i>options</i>])

Fetch a resource from a ``url``.

### vm.renderFromUrl (<i>url</i>, [<i>context</i>])

Fetch an ``html`` template from a ``url`` (or the [cache][] if already loaded) and return a [Promise][] which resolve into a [d3.selection][].
If the optional ``context`` object is provided, it renders the remote html string using
[handlebars][] template engine (requires handlebars to be available).

## Selection

This plugins extend the [d3.selection][] API with three additional methods for retrieving mounted component from a given element and mounting components on a selection.

### selection.view()

Retrieve the nearest ``component``/``view`` element to the ``selection`` starting for the Html element in the selection.
It returns ``null`` if no component or view was not found in the selection element nor in all its parent elements.

### selection.model()

Retrieve the nearest ``model`` to the ``selection`` starting for the Html element in the selection. Equivalent to
```javascript
var vm = selection.view();
vm ? vm.model : null;
```

### selection.mount(<i>data</i>, [<i>callback</i>])

Mount a ``selection`` with new components. This method is useful when adding new components to an already mounted DOM.
The ``data`` object is passed to the render method while the optional ``callback`` function is called once mounting has finished.



[d3.view]: ./view.md
[cache]: #vmcache
[render]: render
[d3.selection]: https://github.com/d3/d3-selection
[handlebars]: http://handlebarsjs.com/
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
