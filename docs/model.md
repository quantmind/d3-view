# Model

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Hierarchical Reactive Model](#hierarchical-reactive-model)
- [Reactivity](#reactivity)
  - [Objects](#objects)
  - [Collections](#collections)
  - [Lazy reactivity](#lazy-reactivity)
- [Model API](#model-api)
  - [model.parent](#modelparent)
  - [model.$get(attribute)](#modelgetattribute)
  - [model.$set(attribute, value)](#modelsetattribute-value)
  - [model.$update(object)](#modelupdateobject)
  - [model.$on(attribute, callback)](#modelonattribute-callback)
  - [model.$change(attribute)](#modelchangeattribute)
  - [model.$off()](#modeloff)
  - [model.$child(intials)](#modelchildintials)
  - [model.$new(intials)](#modelnewintials)

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
The model does not allow dynamically adding new root-level reactive properties
to an already created instance::
```javascript
model.a = 5;
// model.a is NOT reactive
model.$events.get('a')
// undefinied
```
However you can specify a new reactive property via the ``$set`` method
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
or explicitly calling the ``$change`` method
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
The ``nested`` property is converted into a reactive model with the parent set to the newly created model:
```javascript
typeof model.nested
```

### Collections
The ``$change`` method is useful when dealing with reactive collections, for example:
```javascript
model = d3.viewModel({
    data: [10, 5]
});
model.data.push(68);
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

### model.$get(attribute)

Get an attribute value from the model, traversing the tree. If the ``attribute`` is not available in the model,
it will recursively retrieve it from its [parent](#modelparent).

### model.$set(attribute, value)

Set an attribute value in the model, traversing the tree. If the attribute is not
a reactive attribute it becomes one.

### model.$update(object)

Same as [$set]() bit for a group of attribute-value pairs.

### model.$on(attribute, callback)

Add a ``callback`` to a model reactive ``attribute``. The callback is invoked when
the attribute change value only. It is possible to pass the ``callback`` only, in which case it is triggered when any of the model **own attributes** change.

### model.$change(attribute)

Dispatch the ``change`` event for ``attribute`` (it must be a reactive attribute otherwise it is a no operation).

this is useful when updating a composite model attribute (an array for example).
```javascript
var model = d3.viewModel({
    data: []
});
model.data.push(4);
model.$change('data');
```

### model.$off()

Remove all callbacks from reactive attributes

### model.$child(intials)

Crate a child model with prototypical inheritance from the model.
```javascript
var a = d3.viewModel({foo: 4});
var b = model.$child({bla: 3});
b.foo       //  4
b.bla       //  3
b.parent    //  a
```
### model.$new(intials)

Create a child model, with no inheritance from the parent (an isolated model).
```javascript
var a = d3.viewModel({foo: 4});
var b = model.$new({bla: 3});
b.foo       //  undefined
b.bla       //  3
b.parent    //  a
```

[d3-view]: ./view.md
[component]: ./component.md
[HRM]: #hierarchical-reactive-model
