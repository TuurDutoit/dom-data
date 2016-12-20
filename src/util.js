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