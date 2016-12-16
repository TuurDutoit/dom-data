## DomData($root Element, Template) : object
$root: Element. The root element to start from.
Template. The template to use.
return: object. The retrieved values.

Starts parsing a Template, filling the results with values retrieved from the `$root`.

## DomData(Expression) : Context
Expression. The expression to parse.

Calls DomData.parse(Expression) to parse an Expression into a Context.

## new DomData() : Context
Creates an empty context. The `new` operator is optional.

### #register(type string, name string, item any)
what: string. The type of item that's being registered. One of `filter`, `getter`.
name: string. The name of the item being registered.
item: any. The actual filter/getter that's being registered.

Register a filter/getter.

### #register(Plugin, [rerun: bool])
Alias: plugin()
Plugin. The plugin to be registered.

Register a plugin.

### #plugin(Plugin, [rerun: bool])
Alias: register()
Plugin. The plugin to be registered.

Register a plugin.

### #registerFilter(name string, Filter)
name: string. The name of the filter.
Filter. The filter function.

Register a filter.

### #registerGetter(name string, Getter)
name: string. The name of the getter.
Getter. The getter function.

Register a getter.

### #extend(Config)
Config. Configuration options for the new DomData function.

Creates a new DomData function, with the same functionality as the one it was created from.











## Plugin : function(DomData)
DomData. The DomData function.
rerun: bool. Whether to rerun the plugin when extend()ing DomData.

A plugin is no more than a function that, when registered, is run with the DomData function as only argument. It can attach filters, getters, resolvers or any other functionality.  
If a plugin is registered with `rerun` set to `true`, it will be rerun every time DomData is extend()ed - with the new DomData function, of course. If rerun is `false` (or not set), the plugin will not be rerun, but any functionality it registered will be copied over. This is also the case with `rerun = true`.


## Filter : function(before any, ... any).Context : [after any]
before: any. The value before the filter. Also available as `this.value`.
...: any. Other arguments that may have been passed from the template.
return: any (optional). The new value. The new value can also be set as `this.value`.
this: Context. The current execution context.

Filters a value. The old value can be accessed via the first argument, or as `this.value`. In the same spirit, the new value can either be returned, or set as `this.value`.  
Filters can be registered with DomData.register("filter", "name", Filter) or DomData.registerFilter("name", Filter).


## Getter : function($root Element, ... any).Context : [value any]
$root: Element. The current element we're searching on. Also available as `this.$root`.
...: any. Other arguments that may have been passed from the template.
return: any. The value retrieved from the element.

Gets a value from an DOM element, like an attribute or its content. The element to retrieve from can be accessed from the first argument (`$root`), or as `this.$root`. The retrieved value can either be returned or set as `this.value`.


## Config : object
Configuration options for new DomData functions.

### .