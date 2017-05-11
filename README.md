# d3-view

[![CircleCI](https://circleci.com/gh/quantmind/d3-view.svg?style=svg&circle-token=f84972c3cf4e8f17d74066ead28544da990115c3)](https://circleci.com/gh/quantmind/d3-view)
[![Dependency Status](https://david-dm.org/quantmind/d3-view.svg)](https://david-dm.org/quantmind/d3-view)
[![devDependency Status](https://david-dm.org/quantmind/d3-view/dev-status.svg)](https://david-dm.org/quantmind/d3-view#info=devDependencies)

[Coverage][]

This is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
interactive web interfaces.
It provides data-reactive components with a simple and flexible API.

* Modern javascript
* Minimal footprint  - use only what you need
* Built on top of [d3](https://github.com/d3)


## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installing](#installing)
- [Getting Started](#getting-started)
  - [Create a view-model object](#create-a-view-model-object)
- [View](#view)
  - [View API](#view-api)
    - [view.model](#viewmodel)
    - [view.parent](#viewparent)
    - [view.el](#viewel)
    - [view.createElement(<i>tag</i>)](#viewcreateelementitagi)
    - [view.mount(<i>element</i>)](#viewmountielementi)
    - [view.use(<i>plugin</i>)](#viewuseiplugini)
- [Model](#model)
  - [Model API](#model-api)
    - [model.parent](#modelparent)
    - [model.$get(attribute)](#modelgetattribute)
    - [model.$set(attribute, value)](#modelsetattribute-value)
    - [model.$update(object)](#modelupdateobject)
    - [model.$on(attribute, callback)](#modelonattribute-callback)
    - [model.$off()](#modeloff)
    - [model.$child(intials)](#modelchildintials)
    - [model.$new(intials)](#modelnewintials)
- [Directives](#directives)
  - [Core Directives](#core-directives)
    - [d3-attr](#d3-attr)
    - [d3-for](#d3-for)
    - [d3-html](#d3-html)
    - [d3-if](#d3-if)
    - [d3-model](#d3-model)
    - [d3-on](#d3-on)
    - [d3-show](#d3-show)
    - [d3-value](#d3-value)
  - [Custom Directive](#custom-directive)
  - [Directive API](#directive-api)
    - [directive.el](#directiveel)
    - [directive.expression](#directiveexpression)
    - [directive.create(<i>expression</i>)](#directivecreateiexpressioni)
    - [directive.mount(<i>model</i>)](#directivemountimodeli)
    - [directive.refresh(<i>model, newValue</i>)](#directiverefreshimodel-newvaluei)
    - [directive.destroy(<i>model</i>)](#directivedestroyimodeli)
- [Components](#components)
  - [Registration](#registration)
  - [Components API](#components-api)
  - [Creating a component](#creating-a-component)
    - [component.model](#componentmodel)
    - [component.init(<i>options</i>)](#componentinitioptionsi)
    - [component.render(<i>data, attrs</i>)](#componentrenderidata-attrsi)
    - [component.mounted()](#componentmounted)
    - [component.destroy()](#componentdestroy)
  - [Component API](#component-api)
    - [component.events](#componentevents)
    - [component.parent](#componentparent)
    - [component.root](#componentroot)
    - [component.uid](#componentuid)
- [Expressions](#expressions)
  - [Expressions API](#expressions-api)
    - [expression.expr](#expressionexpr)
    - [expression.eval(model)](#expressionevalmodel)
    - [expression.safeEval(model)](#expressionsafeevalmodel)
    - [expression.identifiers()](#expressionidentifiers)
- [Plugins](#plugins)
  - [Form Plugin](#form-plugin)
    - [Importing](#importing)
    - [Form API](#form-api)
  - [Bootstrap Plugin](#bootstrap-plugin)
- [Providers](#providers)
- [Other Frameworks](#other-frameworks)
- [D3 plugins](#d3-plugins)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing

If you use [NPM](https://www.npmjs.com/package/d3-view), ``npm install d3-view``.
Otherwise, download the [latest release](https://github.com/quantmind/d3-view/releases).
You can also load directly from [giottojs.org](https://giottojs.org),
as a [standalone library](https://giottojs.org/latest/d3-view.js) or
[unpkg](https://unpkg.com/d3-view/).
AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported.
Try [d3-view](https://runkit.com/npm/d3-view) in your browser.
```javascript
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-collection.v1.min.js"></script>
<script src="https://d3js.org/d3-color.v1.min.js"></script>
<script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
<script src="https://d3js.org/d3-ease.v1.min.js"></script>
<script src="https://d3js.org/d3-selection.v1.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
<script src="https://d3js.org/d3-transition.v1.min.js"></script>
<script src="https://giottojs.org/latest/d3-let.min.js"></script>
<script src="https://giottojs.org/latest/d3-view.min.js"></script>
<script>

var vm = d3.view();
...
vm.mount("#my-element");

</script>
```

## Getting Started

``d3.view`` is a [d3 plugin](https://bost.ocks.org/mike/d3-plugin/) for building
data driven web interfaces. It is not a framework as such, but you can easily
build one on top of it.

Importantly, this library does not make any choice for you, it is build on top
of the modular d3 library following very similar design patterns.


### Create a view-model object

To create a view object for you application, invoke the ``d3.view`` function
```javascript
var vm = d3.view({
    model: {...},
    props: [...],
    components: {...},
    directives: {...}
});
```

You can create more than one view:
```javascript
var vm2 = d3.view({
    model: {},
    props: [...],
    components: {},
    directives: {}
});
```

All properties in the input object are optionals and are used to initialised the view with
custom data ([model][]), [components][] and [directives][].

## View

### View API

With the exception of the [mount](#view-mount) and
[use](#view-use) methods, the view API is available once the view
has been mounted to an HTML element, i.e. once the [mount](#view-mount)
method has been called.

#### view.model

The [model](#model) bound to the view, the combo gives the name to the object, the **view-model object**.

#### view.parent

The parent of a view, always **undefined**, a view is always the root element of
a view mounted DOM.

#### view.el

Root HTMLElement of the view.

#### view.createElement(<i>tag</i>)

Create a new HTML Element with the given tag. Return a [d3.selection][]
of the new element.

#### view.mount(<i>element</i>)

Mount a view model into the HTML ``element``.
The view only affect ``element`` and its children.
This method can be called **once only** for a given view model.

#### view.use(<i>plugin</i>)

Install a [plugin](#plugins) into the view model. This method can be called several times with as many plugins as one needs,
however it can be called only before the view is mounted into an element.


## Model

At the core of the library we have the Hierarchical Reactive Model.
The Model is comparable to angular scope but its implementation is different.

* **Hierarchical**: a **root** model is associated with a d3-view object.

* **Reactive**:

A model can be associated with more than one element, new children model are created for elements that needs a new model.
For example, a [component][] that specify the ``model`` object during initialisation, creates its own model,
a child model of the model associated with its parent element.

### Model API

#### model.parent

Get the ancestor of the model if it exists. It it does not exist, this is the root model.

#### model.$get(attribute)

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#modelparent).

#### model.$set(attribute, value)

Set an attribute value in the model, traversing the tree. If the attribute is not
a reactive attribute it becomes one.

#### model.$update(object)

Same as [$set]() bit for a group of attribute-value pairs.

#### model.$on(attribute, callback)

Add a ``callback`` to a model reactive ``attribute``. The callback is invoked when
the attribute change value only. It is possible to pass the ``callback`` only, in which
case it is triggered when any of the model **own attributes** change.

#### model.$off()

Remove all callbacks from reactive attributes

#### model.$child(intials)

Crate a child model with prototypical inheritance from the model.
```javascript
var a = d3.viewModel({foo: 4});
var b = model.$child({bla: 3});
b.foo       //  4
b.bla       //  3
b.parent    //  a
```
#### model.$new(intials)

Create a child model, with no inheritance from the parent (an isolated model).
```javascript
var a = d3.viewModel({foo: 4});
var b = model.$new({bla: 3});
b.foo       //  undefined
b.bla       //  3
b.parent    //  a
```

## Components

Components help you extend basic HTML elements to encapsulate reusable code.
They are custom elements that ``d3.view`` attach specified behavior to.

### Registration

In order to use components you need to register them with the ``view`` object:
```javascript
d3.view({
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
or a function, the component render method:
```javascript
function component1 () {
    return this.htmlElement('<p>Another very simple component</p>');
}
```

### Components API

<a name="user-content-component-el" href="#component-el">#</a> component.<b>el</b>

The HTML element created by the component [render][] method. Available after the component is mounted.

<a name="user-content-component-model" href="#component-model">#</a> component.<b>model</b>

The [model][] bound to the component


### Creating a component

A component is defined by the [render][] method. However, there optional properties and
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

#### component.model

A function or an object which specifies the default values of the component model.

Once the component has been mounted, this is becomes the
model associated with the component and therefore an API property
of the component.

Some component have their own model, other they use the model of the parent component.

#### component.init(<i>options</i>)

Hook called once only at the beginning of the component initialisation process, before it is mounted into the DOM.

#### component.render(<i>data, attrs</i>)

This is **the only required hook**. It is called once only while the component is being mounted into the DOM
and must return a single HTMLElement or a selector with one node only.
The returned element replaces the component element in the DOM.
Importantly, this function can also return a [Promise][] which resolve in an HTMLElement or selector.

* **data** is the data object in the component element
* **attrs** is an object containing the key-value of attributes in the component element

#### component.mounted()

Hook called after the component has been mounted in to the DOM.
In this state the component has the full API available
and all its children elements are mounted too.

#### component.destroy()

Called when the component HTML element is removed from the DOM.

### Component API

The most important part of a component is the ``render`` method. This sections
deals with the API available to the component once it is created.
The API is very similar to the [view-api][] since components and views share
the same constructor.

#### component.events

Events object which can be used for registering event listeners or firing events.

#### component.parent

The parent component. If not defined this is the root view, not a component.

#### component.root

The view object the component belongs to.

#### component.uid

Component unique identifier


## Other Frameworks

In order of complexity

* [Angular](https://angularjs.org/)
* [React](https://facebook.github.io/react/)
* [Vue](http://vuejs.org/)

## D3 plugins

* [d3-interpolate-path](https://github.com/pbeshai/d3-interpolate-path)
* [d3-line-chunked](https://github.com/pbeshai/d3-line-chunked)
* [d3-scale-cluster](https://github.com/schnerd/d3-scale-cluster)

[Coverage]: https://circleci.com/api/v1/project/quantmind/d3-view/latest/artifacts/0/$CIRCLE_ARTIFACTS/coverage/index.html?branch=master&filter=successful
[rollup]: http://rollupjs.org/
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[model]: #model
[component]: #components
[components]: #components
[directives]: #directives
[plugins]: #plugins
[view-api]: #view-api
[d3-selection]: https://github.com/d3/d3-selection
[render]: #render
