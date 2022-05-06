export function deepCopy(oldObject: object) {
  return JSON.parse(JSON.stringify(oldObject));
}
