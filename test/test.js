var canvas = document.getElementById("my-app");
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

var data = DomData(canvas, template);
console.log(data);
