# View

## View API

With the exception of the [mount](#view-mount) and
[use](#view-use) methods, the view API is available once the view
has been mounted to an HTML element, i.e. once the [mount](#view-mount)
method has been called.

### view.model

The [model](#model) bound to the view, the combo gives the name to the object, the **view-model object**.

### view.parent

The parent of a view, always **undefined**, a view is always the root element of
a view mounted DOM.

### view.el

Root HTMLElement of the view.

### view.createElement(<i>tag</i>)

Create a new HTML Element with the given tag. Return a [d3.selection][]
of the new element.

### view.mount(<i>element</i>)

Mount a view model into the HTML ``element``.
The view only affect ``element`` and its children.
This method can be called **once only** for a given view model.

### view.use(<i>plugin</i>)

Install a [plugin](#plugins) into the view model. This method can be called several times with as many plugins as one needs,
however it can be called only before the view is mounted into an element.
