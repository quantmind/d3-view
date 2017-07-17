# Form Plugin

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Usage](#usage)
- [Form API](#form-api)
  - [$inputData ()](#inputdata-)
  - [$isValid ()](#isvalid-)
  - [$setSubmit ()](#setsubmit-)
  - [$setSubmitDone ()](#setsubmitdone-)
- [Extensions](#extensions)
- [Bootstrap Plugin](#bootstrap-plugin)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

This library include a form [plugin][] for creating dynamic forms from JSON schema.
The plugin adds the ``d3form`` [component][] to the view-model:
```javascript
import {view, viewForms} from 'd3-view';

var vm = view().use(viewForms);
```

The form plugin will be included in your compiled file only if
```javascript
import {viewForms} from 'd3-view';
```
is present somewhere in your code. Otherwise, it will be eliminated thanks to
tree-shaking.

## Usage

Create a form schema along these lines:
```json
schema = {
    "children": [
        {
            "type": "text",
            "maxLength": 64,
            "minLength": 2,
            "label": "Full name",
            "required": true,
            "name": "fullName"
        },
        {
            "type": "number",
            "min": 0,
            "max": 100,
            "required": true,
            "name": "age"
        },
        {
            "type": "submit"
        }
    ]
}
```
A d3 form can be rendered via
```javascript
d3.select('#form-container').html('<d3form></d3form>').mount({schema: schema});
```
Alternatively, one can mount the form via a remote url
```javascript
d3.select('#form-container').html('<d3form schema="https://goo.gl/fRVi9w"><d3form>');
```

## Form API

The form API is exposed to the [model](./model.md) bound to the form component.

### actions

Object containing actions which can be performed by the form.
Only the default ``submit`` action is implemented.

### $inputData ()

This method returns the object containing fields data with keys given by field names.
Only values which are defined are included.

### $isValid ()

Check if the form inputs pass validation, return ``true`` or ``false``.

### $setSubmit ()

Sets the form model ``formSubmitted`` and ``formPending`` reactive attributes to ``true`` and
returns ``true`` or ``false`` depending if the form inputs pass validation.

### $setSubmitDone ()

Sets the form model ``formPending`` reactive attribute to ``false``.
A common usage of this method is during form submission:
```javascript
if (form.$setSubmit()) {
    // submit form
} else
    form.$setSubmitDone()   // don't submit, form not valid
```
## Field API

Fields are model associated with forms input components.

### endpoint

An object which defines an endpoint. Mainly used by ``submit`` type fields.

## Extensions

It is possible to customize fields by adding new functionality or
wrapping their html representation with additional html elements.
Extensions are functions with the following signature:
```javascript
extension (field, wrappedEl, fieldEl) {
    //
}
```
where ``field`` is a form field component, ``wrappedEl`` is the outer HTML element
which contain the field element ``fieldEl``.

Form extensions should be added to the ``$formExtensions`` list in the root view.
```javascript
var vm = d3.view().use(d3.viewForms);
vm.$formExtensions  //  []
vm = d3.use(d3.viewBootstrapForms);
vm.$formExtensions  //  [ [Function: wrapBootstrap] ]
```

Form extensions can be added via plugins as the Bootstrap plugin does.

## Bootstrap Plugin

It is possible to use bootstrap layouts for d3 forms by importing and using the ``viewBootstrapForms`` plugin:
```javascript
import {view, viewForms, viewBootstrapForms} from 'd3-view';

var vm = view().use(viewForms).use(viewBootstrapForms);
```

[component]: ./component.md
[plugin]: ./plugins.md
