# Components

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Registration](#registration)
- [Creating a Component](#creating-a-component)
  - [props](#props)
  - [model](#model)
  - [render (HTMLAttrs, HTMLElement)](#render-htmlattrs-htmlelement)
  - [childrenMounted ()](#childrenmounted-)
  - [mounted ()](#mounted-)
  - [destroy ()](#destroy-)
- [Using Components](#using-components)
- [Component API](#component-api)
  - [vm.cache](#vmcache)
  - [vm.events](#vmevents)
  - [vm.model](#vmmodel)
  - [vm.parent](#vmparent)
  - [vm.root](#vmroot)
- [Selection](#selection)
  - [selection.view ()](#selectionview-)
  - [selection.model ()](#selectionmodel-)
  - [selection.mount (data, [callback])](#selectionmount-data-callback)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Overview

Components help you extend basic HTML elements to encapsulate reusable code.
They are custom elements that [d3.view][] renders into the DOM.
They have the same API as the [d3.view][] with the exception they cannot be the root view, i.e. a component ``parent`` attribute is always available.


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
A component is either an object with the ``render`` method:
```javascript
var component1 = {
    render () {
        return '<p>Very simple component</p>';
    }
};
```
or a function, the component **render** method:
```javascript
function component1 () {
    return '<p>Another very simple component</p>';
}
```


## Creating a Component

A component is defined by the [render][] method. However, there are optional properties and
methods that can be used to customize construction and lifecycle of a component.
```javascript
var component = {
    props: {...},
    model: {...},
    render (HTMLAttrs, HTMLElement) {},
    childrenMounted () {}
    mounted () {},
    destroy () {}
};
```

### props

Optional array or object to specify a set of HTML attributes which contribute to the component properties.
Component properties are non-reactive attributes and are passed as an object to the component [render][] method.
The HTML properties can contain

* JSON strings
* Model attribute name

For example:
```javascript
var hi = {
    props: {
        id: 'defaultid'
    },
    render(props) {
        return `<p id="${props.id}">Hi</p>`;
    }
};
```
and in the html
```html
<hi id="ciao"></hi>
```
will render as
```html
<p id="ciao">Hi</p>
```

### model

An object or a function returning an object.

Once the component has been mounted, this object/function is replaced by the [model][] associated with the component. Its properties are reactive properties of the component model.
```javascript
vm = view({
    components: {
        hi: {
            model: {
                message: 'Hi!'
            },
            render() {
                return `<p id="test" d3-html="message"></p>`;
            }
        }
    }
});
```
After mounting the view
```javascript
await vm.mount('body');
```
One can select the component via the [selection.view](#selectionview-) method and test the model reactivity:
```javascript
var hi = vm.sel.selectAll('#test').view();
hi.model.message // 'Hi!'
hi.model.$isReactive('message') //  true
```

### render (HTMLAttrs, HTMLElement)

This is **the only required method**. It is called once only while the component is being mounted into the DOM and must return a single HTMLElement or a d3 selector with one node only.
The returned element replaces the component element in the DOM.
Importantly, this function can also return a [Promise][] which resolve in an HTMLElement or selector.

The input parameters are:

* ``HTMLAttrs`` is an object containing the key-value of attributes in the ``HTMLElement`` excluding keys defined in ``props``
* ``HTMLElement`` the original HTML element of the component

### childrenMounted ()

Hook called when all the children of the component have been attached to the component element.
The component is not yet attached to the DOM.

### mounted ()

Hook called after the component element has been attached in to the DOM.
In this state the component has the full API available, its parent elements
are in the DOM. The mounted hook is called in the same order as the render method.

### destroy ()

Called when the component HTML element is removed from the DOM.

## Using Components

Components are meant to be used together, most commonly in parent-child relationships.
Component A may use component B in its own template.
They inevitably need to communicate to one another: the parent may need to pass
data down to the child, and the child may need to inform the parent of something
that happened in the child. However, it is also very important to keep the parent
and the child as decoupled as possible via a clearly-defined interface.
This ensures each component’s code can be written and reasoned about in relative
isolation, thus making them more maintainable and potentially easier to reuse.

Composing components can be summarised as follow:

* Parent components pass ``props`` and ``model`` data down to children components
* Children components emit custom events up to ancestors

## Component API

Components and [views](./view.md) share the same API which extends the [viewBase](./base.md) prototype
with the following properties.

### vm.cache

An object for storing data. This object is the same across all components in a given [d3.view][].
```
vm.cache.set('foo', 'test');
vm.cache.get('foo') //  'test'
vm.cache.has('foo') //  true
```
To disable the cache
```
vm.cache.active = false;
vm.cache.get('foo') //  undefined
```
and to re-enable it
```
vm.cache.active = true;
vm.cache.get('foo') //  'test'
```

### vm.events

A [d3-dispatch][] object for registering events triggered by this component/view.
While [viewEvents](./tools.md#viewevents) are global, this object is different for each
component and can be used to register callbacks for a specific component only.
```javascript
vm.events.on('mount', function (vm, el, data) {
    vm.logInfo("Hi, I'm about to be mouned");
});

vm.events.on('children-mounted', function (vm) {
    vm.logInfo("Hi, Children are fully mounted");
});

vm.events.on('mounted', function (vm) {
    vm.logInfo("Hi, I'm fully mounted");
});

vm.events.on('destroy', function (vm) {
    vm.logInfo("I'm gone, Bye");
});
```
Since both ``mount`` and ``mounted`` are one-time only operation, these events are fired once only for a given component.

### vm.model

The [model](#model) bound to the component, the combo gives the name to the **view-model object**, often shortened to ``vm`` or ``cm``.

### vm.parent

The parent component. If not defined this is the root view, not a component.

### vm.root

The [d3.view][] object the component belongs to. Equal to itself if the component is a [d3.view][].

## Selection

This plugins extend the [d3.selection][] API with three additional methods for retrieving mounted component from a given element and mounting components on a selection.

### selection.view ()

Retrieve the nearest ``component``/``view`` element to the ``selection`` starting for the Html element in the selection.
It returns ``null`` if no component or view was not found in the selection element nor in all its parent elements.

### selection.model ()

Retrieve the nearest ``model`` to the ``selection`` starting for the Html element in the selection. Equivalent to
```javascript
var vm = selection.view();
vm ? vm.model : null;
```

### selection.mount (data, [callback])

Mount a ``selection`` with new components. This method is useful when adding new components to an already mounted DOM.
The ``data`` object is passed to the render method while the optional ``callback`` function is called once mounting has finished.

For example lets take the following example:
```html
<div id="app"><div>
```
create and mount a view with a custom component ``msg``
```javascript
vm = d3.view({
    components: {
        msg: {
            model: {
                message: "Hi there!"
            },
            render () {
                return this.viewElement('<p d3-html="message"></p>');
            }
        }
    }
});
vm.mount('#app');
```
Somewhere in the code, after mounting:
```javascript
var sel = vm.sel;
// equivalent to d3.select('#app');
sel.append('msg').mount();
sel.append('msg').mount({message: "Nice to meet you"});
```
and the result
```html
<div id="app">
<p>Hi there!</p>
<p>Nice to meet you</p>
</div>
```

[d3.view]: ./view.md
[cache]: #vmcache
[model]: #vmmodel
[props]: #props
[render]: #render-props-htmlattrs-htmlelement
[d3.selection]: https://github.com/d3/d3-selection
[d3-dispatch]: https://github.com/d3/d3-dispatch
[handlebars]: http://handlebarsjs.com/
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
