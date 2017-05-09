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
  
  
  hasAttribute: hasAttribute,
  hasAttr: hasAttribute,

  
  property: property,
  prop: property,
  
  
  hasProperty: hasProperty,
  hasProp: hasProperty
  
};




function attribute( $root, attr ) {
  return $root.getAttribute( attr );
}


function hasAttribute( $root, atr ) {
  return $root.hasAttribute( attr );
}


function property( $root, prop ) {
  return $root[ prop ];
}


function hasProperty( $root, prop ) {
  return $root[ prop ] != null;
}