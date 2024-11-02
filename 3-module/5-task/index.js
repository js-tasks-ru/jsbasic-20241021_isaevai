function getMinMax(str) {
   let arr = str.split(' ');
   arr = arr.filter(item => isFinite(item))
   
   let min = Math.min(...arr);
   let max = Math.max(...arr);
   
   return {
    min,
    max,
   }
}
