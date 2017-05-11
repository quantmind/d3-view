# Expressions

The text we put inside directive's values are called ``binding expressions``.
In d3-view, a binding expression consists of a single JavaScript expression
but not operations. The difference between expressions and operations is akin
to the difference between a cell in an Excel spreadsheet vs. a proper JavaScript program.

Valid expression are:
```javascript
"The sun"               //  literal
theme                   //  An identifier (a property of a model)
dosomething()           //  A function
[theme, number]         //  Arrays of identifiers
x ? "Hi" : "goodbye"    //  Conditionals
```
and complex combinations of the above
```javascript
user.groups().join(", ")
[theme, user.groups(), "Hi"]
```

## Expressions API

Expression can be created via the javascript API:
```javascript
var expression = viewExpression(<expression string>);
```
### expression.expr

The original expression string passed to the Expression constructor.

### expression.eval(model)

Evaluate an expression with data from a given ``model``. The ``model``
can be a [model][] instance or a vanilla object.

### expression.safeEval(model)

Same as [expression.eval](#expressionevalmodel) but does not throw an
exception if evalutation fails. Instead it logs the error end returns nothing.

### expression.identifiers()

Array of identifiers (model properties) in the expression.

