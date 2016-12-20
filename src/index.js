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



