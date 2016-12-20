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