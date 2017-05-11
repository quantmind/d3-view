# Model

At the core of the library we have the Hierarchical Reactive Model.
The Model is comparable to angular scope but its implementation is different.

* **Hierarchical**: a **root** model is associated with a d3-view object.

* **Reactive**:

A model can be associated with more than one element, new children model are created for elements that needs a new model.
For example, a [component][] that specify the ``model`` object during initialisation, creates its own model,
a child model of the model associated with its parent element.

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
the attribute change value only. It is possible to pass the ``callback`` only, in which
case it is triggered when any of the model **own attributes** change.

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
