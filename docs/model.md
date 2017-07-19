# Model

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Hierarchical Reactive Model](#hierarchical-reactive-model)
- [Reactivity](#reactivity)
  - [Overview](#overview)
  - [Objects](#objects)
  - [Collections](#collections)
  - [Lazy reactivity](#lazy-reactivity)
- [Model API](#model-api)
  - [model.parent](#modelparent)
  - [model.$get (attribute)](#modelget-attribute)
  - [model.$set (attribute, value)](#modelset-attribute-value)
  - [model.$update (object, [override])](#modelupdate-object-override)
  - [model.$on (attribute, callback)](#modelon-attribute-callback)
  - [model.$change ([attribute])](#modelchange-attribute)
  - [model.$off ()](#modeloff-)
  - [model.$child ([object])](#modelchild-object)
  - [model.$new ([object])](#modelnew-object)

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

### model.parent

Get the ancestor of the model if it exists. It it does not exist, this is a root model.

### model.$get (attribute)

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#modelparent).

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

### model.$on (attribute, callback)

Add a ``callback`` to a model reactive ``attribute``. The callback is invoked when
the attribute change value only. It is possible to pass the ``callback`` only, in which case it is triggered when any of the model **own attributes** change.

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

### model.$off ()

Remove all callbacks from reactive attributes and the model.

### model.$child ([object])

Crate a child model with prototypical inheritance from the model.
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
