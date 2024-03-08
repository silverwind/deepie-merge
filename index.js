const isObject = obj => Object.prototype.toString.call(obj) === "[object Object]";
const uniq = arr => Array.from(new Set(arr));

function extendArrays(a, b) {
  return uniq([...a, ...b]);
}

function type(obj) {
  if (isObject(obj)) return "object";
  if (Array.isArray(obj)) return "array";
  return typeof obj;
}

function canExtendArray(key, arrayExtend) {
  return Array.isArray(arrayExtend) ? arrayExtend.includes(key) : arrayExtend;
}

// merge b int a, arrayExtend is either a boolean or a array of property keys to allow extension
export function deepMerge(a, b, {maxRecursion = 10, arrayExtend = false} = {}) {
  if (Array.isArray(a) && Array.isArray(b)) return arrayExtend ? extendArrays(a, b) : b;
  if (!isObject(b)) return b;
  if (maxRecursion === 0) return a;

  for (const key of Object.keys(b)) {
    const typeA = type(a[key]);
    const typeB = type(b[key]);
    if (typeA !== typeB) { // different type, overwrite
      a[key] = b[key];
    } else { // same type
      if (typeA === "array" && canExtendArray(key, arrayExtend)) {
        a[key] = extendArrays(a[key], b[key]);
      } else if (typeA === "object") {
        a[key] = deepMerge(a[key], b[key], {arrayExtend, maxRecursion: maxRecursion - 1});
      } else {
        a[key] = b[key];
      }
    }
  }

  return a;
}
