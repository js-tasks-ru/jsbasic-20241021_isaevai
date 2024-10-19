function checkSpam(str) {  // мой код...
  let strtoLowerCase = str.toLowerCase();
  if (( strtoLowerCase.includes('1xbet') ) || ( strtoLowerCase.includes('xxx') )) { 
      return true;
  } 
  return false;
}