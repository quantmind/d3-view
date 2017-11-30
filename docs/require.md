# View-Require

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [d3-require.js](#d3-requirejs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The ``view-require`` executable is useful for creating a ``d3-require`` file with dependencies matching the ``package.json`` file of your module.

For help on how to use the script in terminal
```
view-require -h
```

## d3-require.js

The d3-require.js javascript file contains a variation of [d3-require](https://github.com/d3/d3-require)
with the following additional features:
```javascript
d3.require.libs
```
a Map matching library names with url or partial url and
```javascript
d3.require.local
```
a function for matching a library name with a local url (in the same domain as the html page)
