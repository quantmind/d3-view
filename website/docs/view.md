# View
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Introduction](#introduction)
- [Mount](#mount)
- [Plugins](#plugins)
- [View API](#view-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

A **view** is the entry-point for creating reactive d3 based web applications.
```javascript
var vm = d3.view({
    model: {...},
    components: {...},
    directives: {...}
});
```
## Mount

When a new view is created with the statement above, no binding with the DOM has occurred
and the view is in an unmounted state
```javascript
vm.isMounted    //  undefined
vm.el           //  undefined
vm.sel          //  undefined
```
To bind a view object into an HTML ``element`` one uses the **view.mount** method.
The view only affect ``element`` and its children.
This method should be called **once only** for a given view object:
```javascript
vm.mount('#app').then(() => {
    vm.logWarn('View mounted');
    vm.isMounted    //  true
});
```

The element can be a [W3c selector string](https://www.w3.org/TR/selectors-api/),
an HTML element or a [d3 selection](https://github.com/d3/d3-selection).
The mount method always return a ``Promise`` resolved once the view is fully mounted.

## Plugins

Views are extendible via [plugins](./plugins.md). To add plugins into a view
```javascript
vm.use(myPlugin);
```

This method can be called several times with as many plugins as one needs,
however it can be called only before the view is mounted into an element.


## View API

With the exception of the [mount](#view-mount) and
[use](#view-use) methods, the view API is available once the view has been mounted to an HTML element, i.e. once the [mount](#view-mount)
method has been called. The API is exactly the same as the [component API](./component.md#component-api).
