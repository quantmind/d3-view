# Directives


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is a Directive?](#what-is-a-directive)
- [Core Directives](#core-directives)
  - [d3-attr](#d3-attr)
  - [d3-for](#d3-for)
  - [d3-html](#d3-html)
  - [d3-if](#d3-if)
  - [d3-on](#d3-on)
  - [d3-prop](#d3-prop)
  - [d3-value](#d3-value)
- [Custom Directive](#custom-directive)
  - [directive.create (expression)](#directivecreate-expression)
  - [directive.mount (model)](#directivemount-model)
  - [directive.refresh (model, newValue)](#directiverefresh-model-newvalue)
  - [directive.destroy (model)](#directivedestroy-model)
- [Directive API](#directive-api)
  - [directive.active](#directiveactive)
  - [directive.expression](#directiveexpression)
  - [directive.passes](#directivepasses)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is a Directive?

Directives are special HTML attributes with the ``d3-`` prefix.
They apply special reactive behavior to the hosting HTML element.
Differently from [components](./component.md), a directive doesn't replace
the HTML element they belong to.

Directive attribute values are one of

* empty
* binding [expressions](#expressions)
* JSON string

A directive attribute value can be a non binding expression provided the [create][] method
returns nothing and set the ``active`` attribute to ``true``.

The library provides several directives for every day task.
For example the ``d3-html`` directive binds an expression to the inner
Html of the element containing the directive:
```html
<div id="entry">
    ...
    <p d3-html='paragraph'></p>
    ...
</div>
```
Here the ``paragraph`` is a reactive attribute of the View model.
```javascript
d3.view({
    model: {
        paragraph: 'TODO'
    }
}).mount('#entry');
```

## Core Directives

### d3-attr

The [d3-attr][] directive creates a **one-way binding** between a model
property and an HTML element attribute
```html
<input d3-attr-name="code" d3-attr-placeholder="description || code">
```
The ``attr`` can be omitted for ``class``, ``name`` , ``disabled``,
``readonly`` and ``required``.
```html
<input d3-name="code" d3-class="bright ? 'bright' : 'dull'">
```
``code`` and ``bright`` are reactive properties of the view-model.

The ``d3-class`` directive can accept array values too.

### d3-for

As the name suggest, the [d3-for][] directive can be used to repeat the
element once per item from a collection. Each element gets its own model,
where the given loop variable is set to the current collection item,
and ``index`` is set to the item index or key.
```html
<li d3-for="item in items">
    <a d3-attr-href="item.href" d3-html="item.label"></a>
</li>
```

### d3-html

The [d3-html][] directive creates a **one-way-binding** between a model property
and the innerHtml property of the hosting HTML element.
You can use it to attach html or text to element dynamically.
Add ``data-transition-duration`` to your element to allow transitions:
```html
<p d3-html="message" data-transition-duration="250"></p>
```

### d3-if

The [d3-if][] directive displays or hides an element depending on the binding expression.
The display style is preserved. Add ``data-transition-duration`` to your element
to allow transitions:
```html
<div d3-if="showMe" data-transition-duration="250">...</div>
```

### d3-on

The [d3-on][] directive attaches an event listener to the element.
The event type is denoted by the argument postfix, ``d3-click-<arg>``.
if the ``arg`` part is omitted it is assumed to be a ``click`` event.
The expression should be a model method call and it is the event ``callback``.
The event ``callback`` listens to **native DOM events only**.
```html
<button d3-on-click="submit()">Submit</button>
```
The [d3.event]() object is available in the model context as ``$event``
and can be passed to the callback function. For example
```html
<button d3-on-click="submit($event)">Submit</button>
```

### d3-prop

The [d3-prop][] directive creates a **one only binding** between an expression and a ``prop`` for a component.
Lets say we have a component which requires a ``msg`` property do display a its inner html:
```javascript
const cm = view({
    model: {
        message: "this is a test"
    },
    components: {
        hi (props) {
            return `<p>${p.msg}</p>`;
        }
    }
});
```
One can pass the ``msg`` from the model with the ``d3-prop`` directive
```html
<hi d3-prop-msg="message"></hi>
```

### d3-value

The [d3-value][] directive establish a **two-way data binding** for HTML
elements supporting the value property.
The binding is two ways because

* an update in the model attribute causes an update in the HTML value property
* an update in the HTML value property causes an update in the model attribute

## Custom Directive

Creating a custom directive involve the following steps:

* Create a (reusable) directive object:
```javascript
var mydir = {
    create (expression) {
        return expression;
    },
    mount (model) {
        return model;
    },
    refresh (model, value) {
    },
    destroy (model) {

    }
};
```
* Add the directive to the view constructor:
```javascript
var vm = d3.view({
    el: '#entry',
    directives: {
        mydir: mydir
    }
});
```
* Use the directive via the ``d3-mydir`` attribute.

A directive is customized via the four methods highlighted above.
None of the methods need implementing, and indeed for some directive
the **refresh** method is the only one which needs attention.

Directives can also be added via [plugins][].

### directive.create (expression)

The ``create`` method is called **once only**, at the end of directive initialisation, no binding with the HTML element or model has yet occurred.
The ``expression`` is the attribute value, a string, and it is not yet parsed.

The returned value of this method is important in defining what the directive does. There are three alternatives

* The default implementation simply returns the expression
```javascript
create (expression) {
    return expression;
}
```
In this case the directive is considered ``active``, and if the expression is a non empty string it is considered a binding [expressions](#expressions).
* It is possible to return a different expression, for example
```javascript
create (expression) {
    return 'calculate(' + expression + ')';
}
```
This case is very much equivalent to the first case, with the return value considered a binding expression.
* To avoid the creation of a binding expression, the create method should return nothing and set the ``active`` attribute to ``true``.
```javascript
create (expression) {
    this.target = expression;
    this.active = true;
}
```
* If the ``active`` attribute is not set to ``true`` and the return value is empty and the input expression is not an empty string, the directive is not executed (``active`` is set to false by the framework).

### directive.mount (model)

The ``mount`` method is called **once only**, at the beginning of the binding process with the HTML element.
If an expression is returned by the ``create`` method, the expression is now parsed and available in the ``this.expression`` attribute.

This method must return the model for binding (it doesn't need to be the same as the input model, but usually it is).
However, if it returns nothing, the binding execution is aborted. The default implementation simply returns the input model.
```javascript
mount (model) {
    return model;
}
```
The input model belongs to the ancestor [component](/component.md).

This method can be used to add additional binding to the ``model`` for example.

### directive.refresh (model, newValue)

This method is called **every time** the model associated with the element hosting the directive, has changed value. It is also called at the end of a successful [mount](#directivemountmodel). The input ``model`` is the one returned by the ``mount`` method.

### directive.destroy (model)

Called **once only** when the element hosting the directive is removed from the DOM.
When the directive has been removed, the ``destroyDirective`` custom event is emitted by the model.

## Directive API

A directive has all the properties and methods of the [viewBase](./base.md) prototype
with these additional properties.


### directive.active

``true`` when the directive is active


### directive.expression

The parsed expression, available after the [create](#directivecreateexpression)
method has been called.


### directive.passes

Number of times the directive has been refreshed by a change in the reactive model


[d3-attr]: https://github.com/quantmind/d3-view/blob/master/src/directives/attr.js
[d3-for]: https://github.com/quantmind/d3-view/blob/master/src/directives/for.js
[d3-html]: https://github.com/quantmind/d3-view/blob/master/src/directives/html.js
[d3-if]: https://github.com/quantmind/d3-view/blob/master/src/directives/if.js
[d3-on]: https://github.com/quantmind/d3-view/blob/master/src/directives/on.js
[d3-prop]: https://github.com/quantmind/d3-view/blob/master/src/directives/prop.js
[d3-value]: https://github.com/quantmind/d3-view/blob/master/src/directives/value.js
[create]: #directivecreate-expression
[plugins]: ./plugins.md
