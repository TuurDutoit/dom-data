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


  attr: function( $root, attr ) {
    return $root.getAttribute( attr );
  },


  prop: function( $root, prop ) {
    return $root[ prop ];
  }
  
};