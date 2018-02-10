# viewEvents

The ``viewEvents`` object is a global [d3-dispatch](https://github.com/d3/d3-dispatch) instance
for registering events triggered by views, components and directives.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [component-mount](#component-mount)
- [component-children-mounted](#component-children-mounted)
- [component-mounted](#component-mounted)
- [component-error](#component-error)
- [directive-refresh](#directive-refresh)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## component-mount

Fired when a component is about to be mounted. In this state the component unmounted and has the same properties as in the ``comonent-created`` event. The onlyt difference is in the availability of the ``ownerDocument`` attribute.
```javascript
viewEvent.on('component-mount', (vm, origEl, data) => {
    vm.logInfo("Hi, I'm about to be mouned");
});
```

## component-children-mounted

Fired when all children components have been mounted
```javascript
viewEvent.on('component-children-mounted', vm => {
    vm.logInfo("Hi, Children are fully mounted");
});
```

## component-mounted

Fired when a componened has been fully mounted
```javascript
viewEvent.on('component-mounted', vm => {
    vm.logInfo("Hi, I'm fully mounted");
});
```

## component-error

Fired when the component failed to mount
```javascript
viewEvent.on('component-error', (vm, origEl, exc) {
    // an error has occurred and it has been logged already
});
```

## directive-refresh
```javascript
viewEvent.on('directive-refresh', (dir, model, value) => {
    dir.logInfo("Hi, I've just refreshed");
});
```
