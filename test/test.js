var template = [
  {
    $$: "article",
    id: DomData.attribute("id"),  // optional: text() is the default getter
    title: DomData.query(".title").prepend("OFFICIAL: "),  // Use a filter
    intro: DomData.query(".intro").filter(function(intro){ return intro.slice(0, 20); }),  // Use a custom filter inline
    content: DomData.query(".content").html(),  // Get the inner HTML (getter)
    posted: DomData.query(".posted").date(),  // Convert to a Date object (filter)
    numberOfReads: DomData.query(".number-of-reads").number(),  // Convert to a number (filter)
    author: DomData.query(".author").text().object(),  // Parse as JSON. text() getter is is the default, and thus optional
    related: [
      DomData.query(".related li a").attr("href").slice(1),
      //DomData.parse("{.related li a}:attr(href) | slice(1)"),  // or use strings
      //DomData("{.related li a}:attr(href) | slice(1)")  // short string version
    ]
  }
];

DomData.register("filter", "prepend")

var canvas = document.getElementById("my-app");
var data = DomData(canvas, template);
console.log(data);
