# Components

Components help you extend basic HTML elements to encapsulate reusable code.
They are custom elements that [d3.view][] attach specified behavior to. They have the same API as the [d3.view][] with the exception they cannot be the root view, i.e. a component ``parent`` attribute is always available.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Registration](#registration)
- [Creating a component](#creating-a-component)
    - [component.model](#componentmodel)
    - [component.init(<i>options</i>)](#componentinitioptionsi)
    - [component.render(<i>data, attrs</i>)](#componentrenderidata-attrsi)
    - [component.mounted()](#componentmounted)
    - [component.destroy()](#componentdestroy)
- [Component API](#component-api)
  - [view.model](#viewmodel)
  - [view.parent](#viewparent)
  - [view.el](#viewel)
  - [view.createElement(<i>tag</i>)](#viewcreateelementitagi)
    - [component.events](#componentevents)
    - [component.parent](#componentparent)
    - [component.root](#componentroot)
    - [component.uid](#componentuid)
- [Examples](#examples)
  - [Simple component](#simple-component)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Registration

In order to use components you need to register them with the ``view`` object:
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
or a function, the component render method:
```javascript
function component1 () {
    return this.htmlElement('<p>Another very simple component</p>');
}
```


## Creating a component

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

## Component API


### view.model

The [model](#model) bound to the component, the combo gives the name to the **component-model object**, often shortened to **vm** or **cm**.

### view.parent

The parent of a view, always **undefined**, a view is always the root element of
a view mounted DOM.

### view.el

Root HTMLElement of the view.

### view.createElement(<i>tag</i>)

Create a new HTML Element with the given tag. Return a [d3.selection][]
of the new element.

[d3-selection]: https://github.com/d3/d3-selection

<a name="user-content-component-el" href="#component-el">#</a> component.<b>el</b>

The HTML element created by the component [render][] method. Available after the component is mounted.

<a name="user-content-component-model" href="#component-model">#</a> component.<b>model</b>

The [model][] bound to the component

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

## Examples

### Simple component

A simple component can be sued to attach a new model to an html element
```javascript
{
    model: {},
    render () {
        return this.viewElement('<div></div>');
    }
}

```

Component unique identifier

[d3.view]: ./view.md
