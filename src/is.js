var isContext = "__DomDataContext__";


module.exports = {
  
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


  array: function( val ) {
    return Array.isArray( val );
  },


  context: function( val ) {
    return !!val[ isContext ];
  },
  
  
  Context: isContext
  
}