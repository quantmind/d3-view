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
  - [d3-show](#d3-show)
  - [d3-value](#d3-value)
- [Custom Directive](#custom-directive)
- [Directive API](#directive-api)
  - [directive.el](#directiveel)
  - [directive.expression](#directiveexpression)
  - [directive.create(<i>expression</i>)](#directivecreateiexpressioni)
  - [directive.mount(<i>model</i>)](#directivemountimodeli)
  - [directive.refresh(<i>model, newValue</i>)](#directiverefreshimodel-newvaluei)
  - [directive.destroy(<i>model</i>)](#directivedestroyimodeli)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is a Directive?

Directives are special attributes with the ``d3-`` prefix.
Directive attribute values are expected to be binding [expressions](#expressions).
The library provides several directives for every day task.

For example the ``d3-html`` directive binds an expression to the inner
Html of the element containing the directive:
```html
<div id="entry">
    ...
    <p d3-html='paragrah'></p>
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

### d3-for

As the name suggest, the [d3-for][] directive can be used to repeat the
element once per item from a collection. Each element gets its own model,
where the given loop variable is set to the current collection item,
and ``index`` is set to the item index or key.


### d3-html

The [d3-html][] directive creates a **one-way-binding** between a model property
and the innerHtml property of the hosting HTML element.
You can use it to attach html or text to element dynamically.

### d3-if

With [d3-if][] you can create conditionals.

### d3-on

The [d3-on][] directive attaches an event listener to the element. The event type is denoted by the argument.
The expression should be model method call, the event ``callback``. if the attribute is omitted
it is assumed to be a ``click`` event.
The event ``callback`` listens to **native DOM events only**.
```html
<button d3-on-click="submit()">Submit</button>
```

### d3-show

The [d3-show][] directive display or hide an element. The display style is preserved.

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
    destroy () {

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
None of the method needs implementing, and indeed for some directive
the ``refresh`` method is the only one which needs attention.

Directives can also be added via [plugins][]

## Directive API

### directive.el

The HTML Element hosting the directive, available after initialisation and therefore accessible by all
API methods.

### directive.expression

The parsed expression, available after the [create](#directivecreateexpression)
method has been called.

### directive.create(<i>expression</i>)

The ``create`` method is called once only, at the end of directive initialisation, no binding with the HTML element or model has yet occurred.
The ``expression`` is the attribute value, a string, and it is not yet parsed.
This method must return the expression for parsing (it doesn't need to be the same as the input expression).
However, if it returns nothing, the directive is not executed.

### directive.mount(<i>model</i>)

The ``mount`` method is called once only, at the beginning of the binding process with the HTML element.
The expression returned by the ``create`` method
has been parsed and available in the ``this.expression`` attribute.
This method must return the model for binding (it doesn't need to be the same as the input model, but usually it is).
However, if it returns nothing, the binding execution is aborted.

### directive.refresh(<i>model, newValue</i>)

This method is called every time the model associated with the element hosting the directive, has changed value. It is also called at the end of a successful [mount](#directivemountmodel).

### directive.destroy(<i>model</i>)

Called when the element hosting the directive is removed from the DOM.


[d3-attr]: https://github.com/quantmind/d3-view/blob/master/src/directives/attr.js
[d3-for]: https://github.com/quantmind/d3-view/blob/master/src/directives/for.js
[d3-html]: https://github.com/quantmind/d3-view/blob/master/src/directives/html.js
[d3-if]: https://github.com/quantmind/d3-view/blob/master/src/directives/if.js
[d3-on]: https://github.com/quantmind/d3-view/blob/master/src/directives/on.js
[d3-show]: https://github.com/quantmind/d3-view/blob/master/src/directives/show.js
[d3-value]: https://github.com/quantmind/d3-view/blob/master/src/directives/value.js
