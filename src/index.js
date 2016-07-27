import { array as isArray, string as isString } from "./is";
import parse from "./parse";
const privateKeys = ["$$","$_","__"];


export default function DomData(root, obj) {
  if(isString(root)) {
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
  else if (isArray(obj)) {
    return processArray(root, obj);
  }
  else {
    return processObj(root, obj);
  }
}


export function processObj(root, obj) {
  let res = {};
  
  for(let key in obj) {
    if(privateKeys.indexOf(key) === -1) {
      let val = obj[key];
      
      if(isString(val)) {
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

export function processArray(root, arr) {
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

export function processFilter(root, obj) {
  return obj.$_(root.textContent, root, DomData);
}

export function processManual(root, obj) {
  return obj.__(root, DomData);
}
