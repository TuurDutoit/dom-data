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