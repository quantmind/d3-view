# Form Plugin

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Overview](#overview)
- [Usage](#usage)
  - [Field inputs](#field-inputs)
- [Events](#events)
  - [formFieldChange](#formfieldchange)
  - [formMessage](#formmessage)
- [Responses](#responses)
- [Form API](#form-api)
  - [inputs](#inputs)
  - [actions](#actions)
  - [$inputData ()](#inputdata-)
  - [$isValid ()](#isvalid-)
  - [$setSubmit ()](#setsubmit-)
  - [$setSubmitDone ()](#setsubmitdone-)
  - [$response (response)](#response-response)
- [Field API](#field-api)
  - [endpoint](#endpoint)
- [Extensions](#extensions)
- [Bootstrap Plugin](#bootstrap-plugin)
  - [Size](#size)

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
    "name": "myform",
    "children": [
        {
            "type": "text",
            "maxLength": 64,
            "minLength": 2,
            "label": "Full name",
            "required": true,
            "name": "fullName",
            "attributes": {
                "attr1": "fooo",
                "d3-attr-disabled": "blabla"
            }
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
### Field inputs

A field in the form schema has the following attributes:

* **name** (required) the field name, must be unique amongst fields in the same form. It sets the html ``name`` attribute and it is the key used to access the field model from the form model [inputs](#inputs).
* **type** (optional) the field type, if not supplied it is assumed to be "text" and rendered as ``input type="text"``. Valid options are: text, email, password, checkbox, number, date, url, textarea, select.
* **label** (optional) field label, displayed unless `srOnly` is set to true. If not supplied, the name is used instead.
* **classes** (optional) string with classes for the HTML element.
* **id** (optional) id of HTML element, if not provided the ``uid`` of the field model is used.
* **required**/**disabled**/**readonly** (optional) DOM attributes for the field. They can be either strings (in which case they are considered expressions for the ``d3-attr-*`` directive) or booleans.
* **placeholder** (optional) a string for the placeholder
* **attributes** (optional) an object with additional attributes to apply to the form field HTML element. These attributes can be directives too.

## Events

The form components emits several custom [events](./model.md#modelemit-eventname-data) which
allow to write fully responsive applications from from inputs and responses.

### formFieldChange

Whenever the value of a form field changes, the model associated with the field component
emits the ``formFieldChange`` event with data given by the field model itself.
See the [$emit](./model.md#modelemit-eventname-data) documentation for more information
on how to listen to custom events.

### formMessage

Whenever a form needs to broadcast a message, the ``formMessage`` event is triggered
with the following data object
```javascript
{
  level: 'info, warning, error',
  data: {},
  response: 'optional http response object'
}
```
Form messages are broadcasted whenever the status of the form changes in response to submit events.

## Responses

Form responses are callback functions invoked after a form submission. These callback functions
are accessible in the form plugin:
```javascript
import {viewForms} from 'd3-view';

viewForms.responses.default   //  default form response
viewForms.responses.redirect  //  redirect response
```

## Form API

The form API is exposed to the [model](./model.md) bound to the form component.

### inputs

Object containing the form model fields by field name.

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

### $response (response)

Called after a successful form submit.


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

### Size

To control the size of the form or each indivisual field one can use the ``size``
attribute in the JSON object:
```javascript
size: "sm"  // small form
```
or
```javascript
size: "lg"  // large form
```

[component]: ./component.md
[plugin]: ./plugins.md
