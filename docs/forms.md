# Form Plugin

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Usage](#usage)
- [Form API](#form-api)
- [Bootstrap Plugin](#bootstrap-plugin)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

This library include a form plugin for creating dynamic forms from JSON schema.
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
        }
    ]
}
```
A d3 form can be rendered via
```javascript
d3.select('#form-container').html('<d3form></d3form>').mount({schema: schema});
```

## Form API

<a name="user-content-form-setsubmit" href="#form-setsubmit">#</a> form.<b>setSubmit</b>()

Sets the form model ``formSubmitted`` and ``formSubmitted`` reactive attribute to ``true`` and
returns a [Promise][] which resolves in ``true`` or ``false``
depending if the form inputs pass validation.

<a name="user-content-form-isvalid" href="#form-isvalid">#</a> form.<b>isValid</b>()

Check if the form inputs pass validation, return ``true`` or ``false``.


## Customize Fields

It is possible to customize fields by adding new functionality or
wrapping their html representation with additional html elements.

## Bootstrap Plugin

It is possible to use bootstrap layouts for d3 forms by importing and using the ``viewBootstrapForms`` plugin:
```javascript
import {view, viewForms, viewBootstrapForms} from 'd3-view';

var vm = view().use(viewForms).use(viewBootstrapForms);
```

[component]: ./component.md
