# Plugins

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Install Plugins](#install-plugins)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

Plugins, usually, add functionality to a view-model.
There is no strictly defined scope for a plugin but there are typically several
types of plugins you can write:

* Add a group of [components][]
* Add a group of [directives][]
* Add some components methods by attaching them to components prototype.
* Add providers to the ``view.providers`` object
* Whatever you think it is useful

A plugin can be an object with the ``install`` method or a simple
function (same signature as the install method).
```javascript
var myPlugin = {
    install: function (vm) {
        // add a component
        vm.addComponent('alert', {
            model: {
                style: "alert-info",
                text: "Hi! this is a test!"
            },
            render: function () {
                return view.htmlElement('<div class="alert" :class="style" d3-html="text"></div>');
            }
        });
        // add another component
        vm.addComponent('foo', ...);

        // add a custom directive
        vm.addDirective('mydir', {
            refresh: function (model, value) {
                ...
            }
        });

        // inject a property to the root view
        vm.myCustomProperty = [];
    }
}
```

## Install Plugins

Plugins are installed in a view via the chainable ``use`` method:
```javascript
var vm = d3.view();
vm.use(myPlugin).use(anotherPlugin);
```

The ``use`` method can only be used before the view ``vm`` is mounted into the dom.


[components]: ./component.md
[directives]: ./directives.md
