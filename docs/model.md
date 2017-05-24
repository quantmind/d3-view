# Model

At the core of the library we have the Hierarchical Reactive Model.
The Model is comparable to angular scope but its implementation is different.

* **Hierarchical**: a **root** model is associated with a d3-view object.

* **Reactive**: model properties which are registered to be reactive, dispatch a ``change`` event when their value change.

A model is usually associated with a given [component][], the model-view pair, but it can also be used in other contexts.

## Model API

### model.parent

Get the ancestor of the model if it exists. It it does not exist, this is the root model.

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

[component]: ./component.md
