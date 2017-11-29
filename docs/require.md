# View-Require

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The ``view-require`` executable is useful for creating a ``d3-require`` file with dependencies matching the ``package.json`` file of your module.

For help on how to use the script in terminal
```
view-require -h
```

The require javascript file is contains a variation of [d3-require]()
with the following additional features:
```javascript
d3.require.libs
```
a Map matching library names with url and
```javascript
d3.require.local
```
a function for matching a library name with a local url (in the same domain as the html page)
