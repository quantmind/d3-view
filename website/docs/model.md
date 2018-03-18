# Model

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Hierarchical Reactive Model](#hierarchical-reactive-model)
- [Hierarchical](#hierarchical)
- [Reactivity](#reactivity)
  - [Overview](#overview)
  - [Objects](#objects)
  - [Collections](#collections)
  - [Lazy reactivity](#lazy-reactivity)
- [Model API](#model-api)
  - [model.isolated](#modelisolated)
  - [model.isolatedRoot](#modelisolatedroot)
  - [model.parent](#modelparent)
  - [model.root](#modelroot)
  - [model.uid](#modeluid)
  - [model.$change ([attribute])](#modelchange-attribute)
  - [model.$connect(attr, [ownerAttr], [owner])](#modelconnectattr-ownerattr-owner)
  - [model.$data ()](#modeldata-)
  - [model.$emit (eventName, [data])](#modelemit-eventname-data)
  - [model.$isReactive (attribute)](#modelisreactive-attribute)
  - [model.$set (attribute, value)](#modelset-attribute-value)
  - [model.$update (object, [override])](#modelupdate-object-override)
  - [model.$owner (attribute)](#modelowner-attribute)
  - [model.$on (attribute, callback)](#modelon-attribute-callback)
  - [model.$off ([attribute])](#modeloff-attribute)
  - [model.$child ([object])](#modelchild-object)
  - [model.$new ([object])](#modelnew-object)
- [Component bound](#component-bound)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Hierarchical Reactive Model

At the core of the library we have the **HRM**, the Hierarchical Reactive Model.

* **Hierarchical**: a **root** model is associated with a [d3-view][] object.
```javascript
var vm = d3.view({
    model: {
        message: 'this is a test'
    }
});
vm.mount('#app');
vm.model.message
// 'this is a test'
vm.model.parent
// undefined
```

* **Reactive**: model properties which are registered to be reactive, dispatch a ``change`` event when their value change.

A model is usually associated with a given [component][], the model-view pair, but it can also be used in other contexts.

## Hierarchical

The first important property of a d3 view model is the hierarchical inheritance.
There are two methods for creating derived children

* [$child](#modelchild-object) create a child model with prototypical inheritance
* [$new](#modelnew-object) create a child model, with no inheritance from the parent (an isolated model)

Parent models can listen for events emitted by children models, regarthless if
created with the ``$new`` or ``$child`` method, via implementing listeners methods
as discussed in the [$emit](#modelemit-eventname-data) method.


## Reactivity

Model reactivity is what makes models powerful when designing dynamic interfaces.
Models are usually associed with d3-view views and components but they
can be used on their own too.

### Overview

A model is created with ``viewModel`` function by passing an object of reactive
properties:
```javascript
model = d3.viewModel({
    bla: 'foo',
    score: 10
});

// model.bla is reactive
// model.score is reactive
```
A model does not allow dynamically adding new root-level reactive properties
to an already created instance:
```javascript
model.a = 5;
// model.a is NOT reactive
model.$events.get('a')
// undefinied
```
However you can specify a new reactive property via the [$set](#modelset-attribute-value) method
```javascript
model.$set('a', 5);
// model.a is now reactive
model.$events.get('a')
// {...}
```
All reactive properties have a corresponding entry in the ``$events`` [d3.map](https://github.com/d3/d3-collection#maps).
One can trigger a change event either by modifying the value:
```javsacript
model.score = 11
```
or explicitly calling the [$change](#modelchange-attribute) method
```javascript
model.$change('score');
```

### Objects

An important property of the [HRM][] is to create **new** models when
reactive properties are objects. For example
```javascript
model = d3.viewModel({
    bla: 'foo',
    nested: {
        foo: 1
    }
});
model.uid
// 'd3v1'
model.nested.parent === model
// true
model.nested.uid
// 'd3v2'
model.nested.foo
// 1
```
The ``nested`` property is converted into a reactive model with the parent set to the newly created model.
The ``nested`` model **is not created via prototypical inheritance** from the parent model, therefore
```javascript
model.bla
//  `foo`
model.nested.bla
//  undefined
```
In other words, the ``nested`` model has been created via the [$new](#modelnew-object) method.

### Collections

The ``$change`` method is useful when dealing with reactive collections, for example:
```javascript
model = d3.viewModel({
    data: [10, 5]
});
model.data.push(68);
```
Even though the ``data`` is a reactive attribute, the ``push`` function does
not trigger a change event (the array has changed but it is still the same object).
Therefore one can force the change event with:
```javascript
model.$change('data');
```

### Lazy reactivity

We refer to leazy reactivity to properties which depends on other properties.
These properties are defined as a function:
```javascript
model = d3.viewModel({
    bla: 'foo',
    score: 10,
    isValid: {
        reactOn: ['score'],
        get: function () {
            return this.score > 0;
        }
    }
});
```
The ``reactOn`` entry specifies which reactive properties
the ``isValid`` lazy property depends on.
```javascript
model.score = -2;
// at the next event loop tick
model.isValid   //  False
```

## Model API

### model.isolated

Read-only property which is ``true`` when the model was created via the [$new](#modelnew-object) method
from its parent. An isolated model does not share any property with its parent model.
For the root model it is always ``true``.

### model.isolatedRoot

Read-only property which points to the first ancestor, including self, which is an isolated model.

### model.parent

Read-only property which points to the ancestor of the model if it exists.
It it does not exist, this is a root model.

### model.root

Read-only property which points to the root model.

### model.uid

Read-only unique id.

### model.$change ([attribute])

If ``attribute`` is not specified or it is an empty string, this method dispatches the ``change`` event for the model.
Alternatively, it dispatches the ``change`` event for ``attribute`` (it must be a reactive attribute otherwise it is a no operation).

This is useful when updating a composite model attribute (an array for example).
```javascript
var model = d3.viewModel({
    data: []
});
model.data.push(4);
model.$change('data');
```
### model.$connect(attr, [ownerAttr], [owner])

Connect a model attribute ``attr`` with another model attribute ```ownerAttr``.
If ``ownerAttr`` is not specified or it is ``null`` it is assumed to be ``attr``.
If the ``owner`` model is not specified, it is avaluated via the [$owner](#modelowner-attribute) method:
```javascript
owner = model.$owner(ownerAttr)
```
The ``attr`` attribute is read-only on the model an it reacts on ``ownerAttr`` changes.
This method is usefule when you need to add a reactive property to a model which depends on other models.


### model.$data ()

Return the data stored in the model as a vanilla object.

### model.$emit (eventName, [data])

Propagate an event up the chain of [parent](#modelparent) models. This
method is used by models to communicate back to the parent when
something of interest happens. This is the custom event system of d3-view.
Parent models that need to listen to a given event must implement a function
``eventName`` prefixed by ``$``. For example:
```javascript
model.$emit('something', ...)
```
In order to receive the ``something`` event, a parent model must implement the ``$something``
listener:
```javascript
{
    $something (data, originModel) {
        ...
    }
}
```
``data`` is an optional data to be passed to listeners while ``originModel`` is the
model which originally triggered the event via ``$emit``.
The ``$emit`` propagate through the ancestor chain and trigger listeners when found.
It is possible to stop the propagation by returning ``false``:
```javascript
{
    $something (data, originModel) {
        ...
        return false;
    }
}
```

### model.$isReactive (attribute)

Check if ``attribute`` is a reactive property of the model (including its parents if the model is not isolated). Return ``true`` or ``false``.
```javascript
m.$isReactive('a')  // true
c1 = m.$child();
c1.$isReactive('a')  // true
c2 = m.$new();
c2.$isReactive('a')  // false
```

### model.$set (attribute, value)

Set a reactive attribute value in the model. If the attribute is not a reactive attribute it becomes one.

### model.$update (object, [override])

Same as [$set][] but for a group of attribute-value pairs. The optional ``override``
parameter can be used to prevent overriding existing values:
```javascript
var m = d3.viewModel({a: 2});
m.a     //  2

m.$update({
    a: 5,
    b: 10
}, false);
m.a     // 2
m.b     // 10

m.$update({
    a: 5,
    b: 11
});
m.a     // 5
m.b     // 11
```

### model.$owner (attribute)

Return the first model owning the reactive ``attribute`` following the model
hierarchical tree. Return nothing if no model was found.
```javascript
m.$owner('a') === m     // true
c1 = m.$child();
c1.$owner('a') === m    // true
c2 = m.$new();
c2.$owner('a')          // undefined
```

### model.$on (attribute, callback)

Add a ``callback`` to a model reactive ``attribute``. The callback is invoked when
the attribute change value only. It is possible to pass the ``callback`` only, in which case it is triggered when any of the model **own attributes** change.

### model.$off ([attribute])

Remove all callbacks for the provided ``attribute``,
if the attribute is a reactive property of the model.
If ``attribute`` is not provided, remove all callbacks from reactive attributes and the model.

### model.$child ([object])

Create a child model with prototypical inheritance from the model.
```javascript
var a = d3.viewModel({foo: 4});
var b = model.$child({bla: 3});
b.foo       //  4
b.bla       //  3
b.parent    //  a
```
Child models are created by components by inheriting from the model of the previous
component/view in the DOM tree.

### model.$new ([object])

Create a child model, with no inheritance from the parent (an isolated model).
```javascript
var a = d3.viewModel({foo: 4});
var b = model.$new({bla: 3});
b.foo       //  undefined
b.bla       //  3
b.parent    //  a
```
All models, with the exception of component models, are created in this way.

[d3-view]: ./view.md
[$set]: #modelset-attribute-value
[component]: ./component.md
[HRM]: #hierarchical-reactive-model

## Component bound

When a model is bount to a [component](./component.md)/[view](./view.md)
it has the following attributes

* ``$$view`` the component/view bound to the model
* ``$$name`` the name of the component/view
