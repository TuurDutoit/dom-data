(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.DomData = factory());
}(this, function () { 'use strict';

  const array = typeof [].isArray === "function" ? [].isArray : function(v){return v instanceof Array;};
  const string = function(v){return typeof v === "string";};

  function parse(val) {
    if(!val)
      return val;
      
    if(val === "true")
      return true;
    
    if(val === "false")
      return false;
    
    let testNum = Number(val);
    if(!isNaN(testNum))
      return testNum;
    
    let testDate = new Date(val);
    if(!isNaN(testDate.getTime()))
      return testDate;
    
    try {
      return JSON.parse(val);
    }
    catch(e) {
      return val;
    }
  }

  const privateKeys = ["$$","$_","__"];


  function DomData(root, obj) {
    if(string(root)) {
      root = document.querySelecotr(root);
    }
    
    if(obj.$$) {
      root = root.querySelector(obj.$$);
    }
    
    if(obj.__) {
      return processManual(root, obj);
    }
    else if(obj.$_) {
      return processFilter(root, obj);
    }
    else if (array(obj)) {
      return processArray(root, obj);
    }
    else {
      return processObj(root, obj);
    }
  }


  function processObj(root, obj) {
    let res = {};
    
    for(let key in obj) {
      if(privateKeys.indexOf(key) === -1) {
        let val = obj[key];
        
        if(string(val)) {
          let elem = root.querySelector(val);
          res[key] = parse(elem && elem.textContent);
        }
        else {
          res[key] = DomData(root, val);
        }
      }
    }
    
    return res;
  }

  function processArray(root, arr) {
    let template = arr[0];
    let sel = template.$$;
    template.$$ = undefined; // Otherwise DomData() will try to go deeper.
    let elems = root.querySelectorAll(sel);
    let res = [];
    
    for(let i = 0, len = elems.length; i < len; i++) {
      res[i] = DomData(elems[i], template);
    }
    
    template.$$ = sel;
    
    return res;
  }

  function processFilter(root, obj) {
    return obj.$_(root.textContent, root, DomData);
  }

  function processManual(root, obj) {
    return obj.__(root, DomData);
  }

  DomData.processObj = processObj;
  DomData.processArray = processArray;
  DomData.processFilter = processFilter;
  DomData.processManual = processManual;

  return DomData;

}));