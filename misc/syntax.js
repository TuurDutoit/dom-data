// Goals:
//
//   - Readable: templates should be easy to read and syntax easy to be understood
//   - Concise: small memory footprint, or at least very minifiable
//   - Type safe: always know exactly what type of data is produced
//   - Data safe: just ignores corrupt data, without crashing (with optional warnings)
//   - Strict: mistakes in template definitions cause errors to be thrown





// 1: keywords (old)
// Ugly, unreadable, not type safe

var template = [
  {
    $$: "article",
    id: {__: function($article) {
      return $article.getAttribute("id");
    }},
    title: ".title",
    intro: {$$: ".intro", $_: function(intro) {
      return intro.toUpperCase();
    }},
    content: {$$: ".content", __: function($content) {
      return $content.innerHTML;
    }},
    posted: ".posted",
    numberOfReads: ".number-of-reads",
    author: {
      $e: ".author",
      name: ".name",
      age: ".age"
    }
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

DomData(root, template);


// 2: keywords (improved)
// Type safe, but still ulgy and unreadable

var template = [
  {
    $d: {$t: "string"},
    $e: "article",
    id: {
      $a: "id"
    },
    title: ".title",
    intro: {
      $e: ".intro",
      $f: function(val) {
        return val.toUpperCase();
      }
    },
    content: {
      $e: ".content",
      $h: true
    },
    posted: {$e: ".posted", $t: "date"},
    numberOfReads: {$e: ".number-of-reads", $t: "number"},
    author: {
      $e: "author",
      name: ".name",
      age: {$e: ".age", $t: "number"}
    }
    related: [
      {
        $e: ".related a",
        $m: function(ctx) {
          return ctx.root.getAttribute("href").slice(1);
        }
      }
    ]
  }
];

DomData(root, template);



// 3: strings
// Very concise and readable, but we can't be sure what's a string and what's an expression and args for filters are hard

var template = [
  {
    $$: "article",
    id: ":attr(id)",
    title: "{.title} | prepend(~title)",
    intro: "{.intro} | uppercase(20)",
    content: "{.content}:html",
    posted: "{.posted} | date",
    numberOfReads: "{.number-of-reads} | number",
    author: {
      $$: ".author",
      name: "{.name}",
      age: "{.age} | number"
    },
    related: [
      "{.related li a}:attr(href) | slice(1)"
    ]
  }
];

var vars = {
  title: "OFFICIAL: "
}

DomData(root, template, vars);


// 5: chaining
// Too verbose and chaotic

DomData(root).list().query("article")
  .object()
    .set("id").attr("id")
    .set("title").query(".title").text() // optional
    .set("intro").query(".intro").html()
    .set("content").query(".content").filter(function(intro){ return intro.slice(0, 20); })
    .set("posted").query(".posted").date()
    .set("numberOfReads").query(".number-of-reads").number()
    .set("author").object()
      .set("name").query(".name")
      .set("age").query(".age").number()
      .up()
    .set("related").list().query(".related li a").call(function(ctx) {
      return ctx.root.href.slice(1);
    })
    .parse();


// 6: functions
// Just perfect!

var template = [
  {
    $$: DomData.query("article"),
    id: DomData.attribute("id"),
    title: DomData.query(".title").text().prepend("OFFICIAL: "), //optional: text() is the default getter
    intro: DomData.query(".intro").filter(function(intro){ return intro.slice(0, 20); }),
    content: DomData.query(".content").html(),
    posted: DomData.query(".posted").date(),
    numberOfReads: DomData.query(".number-of-reads").number(),
    author: {
      name: DomData.query(".name"),
      age: DomData.query(".age").number()
    },
    related: [
      DomData.query(".related li a").attr("href").slice(1),
      DomData.parse("{.related li a}:attr(href) | slice(1)"),  // or use strings
      DomData("{.related li a}:attr(href) | slice(1)")  // short string version
    ]
  }
];

DomData(root, template);
