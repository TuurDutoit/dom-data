Expression strings
==================

With `DomData.parse()`, it's possible to parse strings into Expression objects. These are a lot easier to read and more concise, but come with a few catches. This document explains these gotcha's, along with the syntax and some other information.

## Syntax
The expression syntax allows you to set the query, getter and some filters for the Expression, but, like the actual Expression object, all of these are optional: leave one out, and the default will be used.

Here's the formal syntax definition:

```
{query}:getter(args) | filter(args) | filter(args) | ...
```

Some notes about this:

1. `query`, `getter` and `filter` have to be replaced by valid values, of course.
1. Every part is optional, i.e. you can use or leave out `{query}`, `:getter(args)` and ` | filter(args)` as you wish.
1. The `(args)` parts are optional, comma-separated lists of arguments, much like JavaScript functions. In fact, the arguments are parsed with `JSON.parse()`, so you can pass in numbers, objects and arrays. Everything that can't be parsed, is passed as a string.  
This means that strings that don't contain a comma, don't need quotes around them, but object property names do need them. Also, you can't pass in variables, only literal values.
1. `query` goes directly into `Expression.query`, so it has to be a valid CSS selector.
1. The default set of getters contains:
  * text (the default): returns the `textContent` of the element
  * html: returns the `innerHTML` of the element
  * attr(attributeName): extracts the value of an attribute
  * prop(propertyName): extracts the value of a property of the Element object
1. The filters can be used to convert values to numbers, Dates, Arrays or Objects by default, but you can add your own filters to do all sorts of conversions.

With that in mind, let's take a look at a few examples:


## Examples

>  In all examples, the body is used as the root


### Get text from an element as a number
index.html:
```html
<body>
  <ul class="posts" data-length="23">
    <li>...</li>
    ...
  </ul>
</body>
```

data.js:
```js
var template = {
  numberOfPosts: DomData.parse("{.posts}:attr(data-length) | number")
}
```

Result:
```json
{
  "numberOfPosts": 23
}
```


### Get an element's content as an object or array
index.html:
```html
<body>
  <div id="author">{"name": "Tuur Dutoit", "age": 19}</div>
  <div id="related">["53RFZET6","QD56ZE","EE57EER345"]</div>
</body>
```

You can even leave out the `{}` and `[]` if you want:
```html
<div id="author">"name": "Tuur Dutoit", "age": 19</div>
<div id="related">"53RFZET6","QD56ZE","EE57EER345"</div>
```

data.js:
```js
var template = {
  author: DomData.parse("{#author} | object"),
  related: DomData.parse("{#related} | array")
}
```

Result:
```json
{
  "author": {
    "name": "Tuur Dutoit",
    "age": 19
  },
  "related": [
    "53RFZET6",
    "QD56ZE",
    "EE57EER345"
  ]
}
```


### Get the parent element's html
index.html:
```html
<body>
  <div class="some-data">...</div>
  <a href="/home">Home</a>
</body>
```

data.js:
```js
var template = DomData.parse(":html | slice(0, 23)");
```

Result:
```json
"<div class=\"some-data\">"
```


### Get the parent element's content as a number
index.html:
```html
<body>26465.56</body>
```

data.js:
```js
var template = DomData.parse("| number");
```

Result:
```json
26465.56
```


### Get text from parent element (using the empty string)
Not quite helpful, but cool nonetheless!

index.html:
```html
<body>Hello</body>
```

data.js:
```js
var template = DomData.parse("");
```

Result:
```json
"Hello"
```
