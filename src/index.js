var merge = require("lodash.merge");
var filters = require("./filters");
var getters = require("./getters");
var is = require("./is");


var DomData = module.exports = function DomData( $root, template ) {
  
  if ( this instanceof DomData ) {
    // Create a context
    console.log("constructor");
    
    this[ is.Context ] = true;
    this._getter = getters.text;
    this._filters = [];
    this._query = null;
    
    return this;
  }
  
  // Parse template
  console.log("function");
  
  if ( is.context( template ) ) {
    return template.exec( $root );
  }
  
  
  
}


DomData._plugins = [];
DomData._getters = {};
DomData._filters = {};


DomData.extend = function( opts ) {
  var opts = opts || {};
  var self = this;
  
  // Extend DomData function
  var DD = function DomData( $root, template ) {
    return self.call( this, $root, template );
  }

  merge( DD, this );
  
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
    merge( DD._getters, opts.getters );
  }
  
  if ( opts.filters ) {
    merge( DD._filters, opts.filters );
  }
  
  // Run plugins
  DD._plugins.forEach( function( plugin ) {
    plugin( DD );
  } );
  
  return DD;
}


DomData.register = function( type, name, item ) {
  
  if ( is.func( type ) ) {
    // This is a plugin
    this.registerPlugin( type, name );
  }
  else if ( type === "getter" ) {
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
    return ctx[ name ].apply( ctx, arguments );
  }
  
  this.prototype[ name ] = function(  ) {
    this.setGetter( getter, arguments );
  }
  
  return this;
}


DomData.registerFilter = function( name, filter ) {
  
  this._filters[ name ] = filter;
  
  this[ name ] = function(  ) {
    var ctx = new self();
    return ctx[ name ].apply( ctx, arguments );
  }
  
  this.prototype[ name ] = function(  ) {
    this.addFilter( filter, arguments );
  }
  
  return this;
}


DomData.prototype.exec = function( $root ) {
  
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
}


// QUERY


DomData.prototype.query = function( q ) {
  
  this._query = q;
  
  return this;
}


// GETTER


DomData.prototype.setGetter = function( getter, args ) {
  var old = getter; // Save a ref to this value in case we need to report an error.
  
  if ( is.string( getter ) ) {
    getter = this.constructor._getters[ getter ];
  }
  
  if ( !is.func( getter ) ) {
    console.warn( "Getter is not a function or was not found! Ignoring.", old );
    return this;
  }
  
  this._getter = bind( getter, args );
  
  return this;
}


DomData.prototype.getter = function( getter ) {
  return this.setGetter( getter, [].slice.call( arguments, 1 ) );
}


// FILTERS


DomData.prototype.addFilter = function( filter, args ) {
  var old = filter; // Save a ref to this value in case we need to report an error.
  
  if ( is.string( filter ) ) {
    filter = this.constructor._filters[ filter ];
  }
  
  if ( !is.func( filter ) ) {
    console.warn( "Filter is not a function! Ingoring.", old );
    return this;
  }
  
  this._filters.push( bind( filter, args ) );
  
  return this;
}


DomData.prototype.filter = function( filter ) {
  return this.addFilter( filter, [].slice.call( arguments, 1 ) );
}




function bind( func, args ) {
  return function(  ) {
    return func.apply( this, [].concat( arguments ).concat( args ) );
  }
}