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
  }
  
}