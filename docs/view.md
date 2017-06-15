# View
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Introduction](#introduction)
- [Mount](#mount)
- [Plugins](#plugins)
- [View API](#view-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

A **view** is the entry-point for creating reactive d3 based web applications.
```javascript
var vm = d3.view({
	model: {},
	components: [],
	directives: []
});
```
## Mount

To **mount** a view model into an HTML ``element`` one uses the **view.mount** method.

vm.**mount**(element, *callback*)

The view only affect ``element`` and its children.
This method can be called **once only** for a given view model.
```javascript
vm.mount('#app', function () {
    d3.viewWarn('View mounted');
});
```

The element can be a selector, an HTML element or a d3 selection. The optional *callback* function
is invoked once the view is fully mounted in the DOM, including all the view components.

## Plugins

Views are extandible via [plugins](./plugins.md). To add plugins into a view
```javascript
vm.use(myPlugin);
```

This method can be called several times with as many plugins as one needs,
however it can be called only before the view is mounted into an element.


## View API

With the exception of the [mount](#view-mount) and
[use](#view-use) methods, the view API is available once the view has been mounted to an HTML element, i.e. once the [mount](#view-mount)
method has been called. The API is exactly the same as the [component API](./component.md#component-api).
