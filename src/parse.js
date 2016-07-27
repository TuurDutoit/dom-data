export default function parse(val) {
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
