(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DomData = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require("./util");
var is = require("./is");



module.exports = {
  
  // GET VALUE
  
  exec: function( $root ) {
    this.$root = $root;
    
    var val = this._getter( $root );
    
    if ( is.defined( val ) ) {
      this.value = val;
    }
    
    for ( var i = 0, len = this._filters.length; i < len; i++ ) {
      
      var input = this.value;
      var filter = this._filters[ i ];
      var output = filter.call( this, input );
      
      if ( is.defined( output ) ) {
        this.value = output;
      }
      else if ( is.undef( this.value ) ) {
        var name = is.string( filter.name ) ? " (" + filter.name + ")" : "";
        
        console.warn( "A filter didn't return a value! Returning null for this field." );
        console.warn( "Input:", input );
        console.warn( "Filter" + name + ":", filter );
        
        return null;
      }
      
    }
    
    return this.value;
  },


  // QUERY


  query: function( q ) {
    
    this._query = q;
    
    return this;
  },


  // GETTER


  setGetter: function( getter, args ) {
    var old = getter; // Save a ref to this value in case we need to report an error.
    
    if ( is.string( getter ) ) {
      getter = this.constructor._getters[ getter ];
    }
    
    if ( !is.func( getter ) ) {
      console.warn( "Getter is not a function or was not found! Ignoring.", old );
      return this;
    }
    
    this._getter = util.bind( getter, args );
    
    return this;
  },


  getter: function( getter ) {
    return this.setGetter( getter, [].slice.call( arguments, 1 ) );
  },


  // FILTERS


  addFilter: function( filter, args ) {
    var old = filter; // Save a ref to this value in case we need to report an error.
    
    if ( is.string( filter ) ) {
      filter = this.constructor._filters[ filter ];
    }
    
    if ( !is.func( filter ) ) {
      console.warn( "Filter is not a function or was not found! Ingoring.", old );
      return this;
    }
    
    this._filters.push( util.bind( filter, args ) );
    
    return this;
  },


  filter: function( filter ) {
    return this.addFilter( filter, [].slice.call( arguments, 1 ) );
  }
  
}
},{"./is":5,"./util":6}],2:[function(require,module,exports){
module.exports = {
  
  number: function( str ) {
    return Number( str );
  },
  

  date: function( str ) {
    return new Date( str );
  },


  object: function( str ) {

    if ( str[0] !== "{" ) {
      str = "{" + str + "}";
    }

    try {
      return JSON.parse( str );
    } catch ( e ) {
      console.warn( "Error parsing data to object: '" + str + "'", e );
      return null;
    }

  },


  array: function( str ) {

    if ( str[0] !== "[" ) {
      str = "[" + str + "]";
    }

    try {
      return JSON.parse( str );
    } catch ( e ) {
      console.warn( "Error parsing data to array: '" + str + "'", e );
      return null;
    }

  },
  
  
  json: function( str ) {
    
    try {
      return JSON.parse( str );
    } catch( e ) {
      console.warn( "Error parsing data to JSON: '" + str + "'", e );
      return null;
    }
    
  },


  get: function( obj, key ) {
    return obj[ key ];
  },


  set: function( obj, key, val ) {
    obj[ key ] = val;
  },
  
  
  keys: function( obj ) {
    return Object.keys( obj );
  },


  prepend: function( str, prefix ) {
    return prefix + str;
  },


  append: function( str, suffix ) {
    return str + suffix;
  },


  replace: function( str, regex, replacement ) {
    return str.replace( regex, replacement );
  },


  slice: function( str, from, to ) {
    return str.slice( from, to );
  },


  split: function( str, delimiter ) {
    return str.split( delimiter );
  },


  join: function( arr, delimiter ) {
    return arr.join( delimiter );
  },


  push: function( arr, val, multiple ) {
    
    if ( multiple && is.array( val ) ) {
      arr.push( ...val );
    } else {
      arr.push( val );
    }
    
  },


  unshift: function( arr, val, multiple ) {
    
    if ( multiple && is.array( val ) ) {
      arr.unshift( ...val );
    } else {
      arr.unshift( val );
    }
    
  },


  add: function( a, b ) {
    return a + b;
  },


  sub: function( a, b ) {
    return a - b;
  },


  subFrom: function( a, b ) {
    return b - a;
  },


  mul: function( a, b ) {
    return a * b;
  },


  div: function( a, b ) {
    return a / b;
  },


  divBy: function( a, b ) {
    return b / a;
  }
  
};
},{}],3:[function(require,module,exports){
module.exports = {
  
  text: function( $root ) {
    return $root.textContent;
  },


  html: function( $root ) {
    return $root.innerHTML;
  },


  outer: function( $root ) {
    return $root.outerHTML;
  },


  attribute: attribute,
  attr: attribute,

  
  property: property,
  prop: property
  
};




function attribute( $root, attr ) {
  return $root.getAttribute( attr );
}


function property( $root, prop ) {
  return $root[ prop ];
}
},{}],4:[function(require,module,exports){
var filters = require("./filters");
var getters = require("./getters");
var context = require("./context");
var util = require("./util");
var is = require("./is");




//
// Constructor
//




var DomData = module.exports = function DomData( $root, template, hasToQuery ) {
  
  // 1. Create a context (constructor)
  if ( this instanceof DomData ) {
    
    this[ is.Context ] = true;
    this._getter = getters.text;
    this._filters = [];
    this._query = null;
    
    return this;
  }
  
  // OR:
  
  // 2. Parse template (simple function)
  
  hasToQuery = hasToQuery !== false;
  
  if ( is.undef( $root ) ) {
    return util.noRoot( template );
  }
  
  // 2.a Template is just a context
  if ( is.context( template ) ) {
    return processContext( $root, template, hasToQuery );
  }
  
  // 2.b template is an array
  if ( is.array( template ) ) {
    return processArray( $root, template );
  }
  
  // 2.c Template is an object
  return processObject( $root, template, hasToQuery );
}


function processContext( $root, template, hasToQuery ) {
  if ( hasToQuery && template._query ) {
    $root = $root.querySelector( template._query );
    
    if ( is.undef( $root ) ) {
      return util.noRoot( template );
    }
    
  }
  
  return template.exec( $root );
}


function processArray( $root, template ) {
  var res = [];
  
  template.forEach( function( child ) {
    
    if ( is.queryable( child ) ) {
      var $elems = $root.querySelectorAll( child._query || child.$$._query || child.$$ );
      
      for ( var i = 0, len = $elems.length; i < len; i++ ) {
        res.push( DomData( $elems[ i ], child, false ) );
      }
      
    }
    else {
      
      res.push( DomData( $root, child ) );
      
    }
    
  } );
  
  return res;
}


function processObject( $root, template, hasToQuery ) {
  var res = {};
  
  if ( hasToQuery && is.query( template.$$ ) ) {
    $root = $root.querySelector( template.$$._query || template.$$ );
    
    if ( is.undef( $root ) ) {
      return util.noRoot( template );
    }
    
  }
  
  for ( var key in template ) {
    var val = template[ key ];
    
    if ( is.object( val ) ) {
      // context, object or array
      res[ key ] = DomData( $root, val );
    }
    else if ( key !== "$$" ) {
      // simple value
      res[ key ] = val;
    }
  }
  
  return res;
}


DomData.VERSION = "0.1.1";
DomData._plugins = [];
DomData._getters = {};
DomData._filters = {};




//
// Methods
//




DomData.extend = function( opts ) {
  var opts = opts || {};
  var self = this;
  
  // Extend DomData function
  var DD = function DomData( $root, template ) {
    return self.call( this, $root, template );
  }

  util.merge( DD, this );
  
  DD.prototype = Object.create( this.prototype, {
    "constructor": {
      value: DD,
      enumerable: false,
      writable: true,
      configurable: true
    }
  } );
  
  // Merge in plugins, filters and getters
  if ( opts.plugins ) {
    DD._plugins = DD._plugins.concat( opts.plugins );
  }
  
  if ( opts.getters ) {
    util.merge( DD._getters, opts.getters );
  }
  
  if ( opts.filters ) {
    util.merge( DD._filters, opts.filters );
  }
  
  // Run plugins
  DD._plugins.forEach( function( plugin ) {
    plugin( DD );
  } );
  
  return DD;
}


DomData.register = function( name, item, isGetter ) {
  
  if ( is.func( name ) ) {
    // This is a plugin
    this.registerPlugin( name, item );
  }
  else if ( isGetter ) {
    this.registerGetter( name, item );
  }
  else {
    this.registerFilter( name, item );
  }
  
  return this;
}


DomData.registerPlugin = function( plugin, rerun ) {
  
  if ( ( plugin( this ) || rerun ) && this._plugins.indexOf( plugin ) === -1 ) {
    this._plugins.push( plugin );
  }
  
  return this;
  
}


DomData.registerGetter = function( name, getter ) {
  var self = this;
  
  this._getters[ name ] = getter;
  
  this[ name ] = function(  ) {
    var ctx = new self();
    return ctx.setGetter( getter, arguments );
  }
  
  this.prototype[ name ] = function(  ) {
    return this.setGetter( getter, arguments );
  }
  
  return this;
}


DomData.registerFilter = function( name, filter ) {
  
  this._filters[ name ] = filter;
  
  this[ name ] = function(  ) {
    var ctx = new self();
    return ctx.setGetter( getter, arguments );
  }
  
  this.prototype[ name ] = function(  ) {
    return this.addFilter( filter, arguments );
  }
  
  return this;
}


DomData.query = function( query ) {
  
  var ctx = new this();
  return ctx.query( query );
  
}




//
// Context
// Getters and Filters (defaults)
//


util.merge(DomData.prototype, context);

for ( var name in getters ) {
  DomData.registerGetter( name, getters[ name ] );
}

for ( var name in filters ) {
  DomData.registerFilter( name, filters[ name ] );
}




},{"./context":1,"./filters":2,"./getters":3,"./is":5,"./util":6}],5:[function(require,module,exports){
var isContext = "__DomDataContext__";


module.exports = {
  
  Context: isContext,
  
  
  undef: function( val ) {
    return val == null;
  },
  
  
  defined: function( val ) {
    return !this.undef( val );
  },


  string: function( val ) {
    return typeof( val ) === "string";
  },


  func: function( val ) {
    return typeof( val ) === "function";
  },
  
  
  object: function( val ) {
    return typeof( val ) === "object";
  },


  array: function( val ) {
    return Array.isArray( val );
  },


  context: function( val ) {
    return !!val[ isContext ];
  },
  
  
  query: function( val ) {
    return this.defined( val ) && ( this.string( val ) || this.context( val ) );
  },
  
  
  queryable: function( val ) {
    return this.defined( val ) && ( this.context( val ) || this.query( val.$$ ) );
  }
  
}
},{}],6:[function(require,module,exports){
var is = require("./is");


module.exports = {

  noRoot: function( template ) {
    console.warn( "No root element, returning null.", template );
    return null;
  },


  merge: function( dest, src ) {
    
    for ( var key in src ) {
      var val = src[ key ];
      
      if ( is.object( val ) ) {
        dest[ key ] = merge( is.array( val ) ? [] : {}, val );
      } else {
        dest[ key ] = val;
      }
    }
    
    return dest;
  },


  bind: function( func, args ) {
    args = toArray( args );
    
    return function bound(  ) {
      return func.apply( this, toArray( arguments ).concat( args ) );
    }
  }
  
};


function toArray( arrayLike ) {
  return [].slice.call( arrayLike );
}
},{"./is":5}]},{},[4])(4)
});