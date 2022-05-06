export function mergeArrays(a: number[], b: number[]) {
  const sorted: number[] = [];
  while (a.length > 0 || b.length > 0) {
    if (a.length === 0) {
      sorted.push(...b);
      break;
    } else if (b.length === 0) {
      sorted.push(...a);
      break;
    } else {
      let elem;
      if (a[0] <= b[0]) {
        elem = a.shift() as number;
      } else {
        elem = b.shift() as number;
      }
      sorted.push(elem);
    }
  }
  return sorted;
}
