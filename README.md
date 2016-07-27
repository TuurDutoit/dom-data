dom-data
=========
`v0.0.1`

Extract data from the DOM, ready to be used in your JavaScript.  
Designed to tackle the SEO problem faced by SPA's: search engines only see an empty page if you get your data from XHR or WebSockets. With this module, you can send your data to the client in the HTML document - probably hidden from view, but still visible to search engines. Just place the `bundle.js` file in a script tag, extract the data as shown below, and present it in a nicer way to your users.

## API
### DomData(string|element root, Object template) -> Object
Extracts data from `root`, following the rules in `template` and returns the result.  
To explain the rules, an example is probably the most effective, so here you go:

**page.html**:

```html
<!DOCTYPE html>
<html><head>...</head>
<body>
  ...
  <canvas id="my-app">
    <article id="344147334">
      <header class="title">This is the title of the first article</header>
      <p class="intro">This is the intro to the article. It's not too long</p>
      <div class="content">
        <p>This is the first line of the article</p>
        <p>Here is another line</p>
        <p>And this is the last line</p>
      </div>
      <div class="author">{"first": "Tuur", "last": "Dutoit"}</div>
      <div class="posted">Wed Jul 27 2016 14:19:06 GMT+0200 (CEST)</div>
      <div class="public">true</div>
      <div class="number-of-reads">243</div>
      <ul class="related">
        <li><a href="#785645677">Second article</a></li>
        <li><a href="#235645675">Third article</a></li>
      </ul>
    </article>
    
    <article id="785645677">...</article>
    
    ...
  </canvas>
  ...
</body></html>
```

**extract.js**:

```javascript
var template = [
  // Will be repeated for every article
  {
    // $$: select an element, in this case <article>s
    $$: "article",
    // __: process element manually - get id from <article>
    id: {__: function($article) {
      return $article.getAttribute("id");
    }},
    title: ".title",
    // $_: filter outputted text - cap intro at 20 chars
    intro: {$$: ".intro", $_: function(intro) { 
      return intro.slice(0, 20);
    }},
    content: {$$: ".content", __: function($content) {
      return $content.innerHTML;
    }},
    author: ".author",
    posted: ".posted",
    numberOfReads: ".number-of-reads",
    related: [
      {
        $$: ".related a",
        __: function($link) {
          return $link.getAttribute("href").slice(1);
        }
      }
    ]
  }
];

var canvas = document.getEementById("my-app");
var data = DomData(canvas, template);
```

**data**:

```javascript
[
  {
    id: "344147334",
    title: "This is the title of the first article",
    intro: "This is the intro to",
    content: "<p>This is the first line of the article</p>\n<p>Here is another line</p>\n<p>And this is the last line</p>",
    author: {
      first: "Tuur",
      last: "Dutoit"
    },
    posted: Date("Wed Jul 27 2016 14:19:06 GMT+0200 (DEST)"),
    numberOfReads: 243,
    related: ["785645677", "235645675"]
  },
  {"...": "..."}
]
```



## License
The MIT License (MIT)
Copyright (c) 2016 Tuur Dutoit

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
