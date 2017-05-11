
# Form Plugin

This library include a form plugin for creating dynamic forms from JSON layouts.
The plugin adds the ``d3form`` [component][] to the view-model:
```javascript
import {view, viewForms} from 'd3-view';

var vm = view().use(viewForms);
```

## Importing

If you are using [rollup][] to compile your javascript application, the form plugin
will be included in your compiled file only if
```javascript
import {viewForms} from 'd3-view';
```
is present somewhere in your code. Otherwise, it will be eliminated thanks to
tree-shaking.

## Form API

<a name="user-content-form-setsubmit" href="#form-setsubmit">#</a> form.<b>setSubmit</b>()

Sets the form model ``formSubmitted`` and ``formSubmitted`` reactive attribute to ``true`` and
returns a [Promise][] which resolves in ``true`` or ``false``
depending if the form inputs pass validation.

<a name="user-content-form-isvalid" href="#form-isvalid">#</a> form.<b>isValid</b>()

Check if the form inputs pass validation, return ``true`` or ``false``.

## Bootstrap Plugin

It is possible to use bootstrap layouts for d3 forms by importing and using the ``viewBootstrapForms`` plugin:
```javascript
import {view, viewForms, viewBootstrapForms} from 'd3-view';

var vm = view().use(viewForms).use(viewBootstrapForms);
```
