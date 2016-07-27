export const array = typeof [].isArray === "function" ? [].isArray : function(v){return v instanceof Array;};
export const string = function(v){return typeof v === "string";};
