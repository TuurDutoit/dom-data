module.exports = {
  
  number: function( str ) {
    return new Number( str );
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
      console.warn( "Error parsing data to object: '" + str + "'" );
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
      console.warn( "Error parsing data to array: '" + str + "'" );
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