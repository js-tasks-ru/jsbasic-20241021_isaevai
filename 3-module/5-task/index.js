function getMinMax(str) {
  const arr = str
  .split(' ')
  .filter(item => Number(item));

  return {
    min: Math.min(...arr),
    max: Math.max(...arr),
  };
}