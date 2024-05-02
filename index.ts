const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) === "[object Object]";
const uniq = (arr: any[]): any[] => Array.from(new Set(arr));
const extendArrays = (a: any[], b: any[]): any[] => uniq([...a, ...b]);

type ArrayExtend = boolean | string[];

type DeepieMergeOpts = {
  /** Either a boolean or a array of property keys to allow extension. */
  arrayExtend: ArrayExtend,
  /** Maximum recursions to perform. Default: 10. */
  maxRecursion?: number,
}

function getType(obj: any): string {
  if (isObject(obj)) return "object";
  if (Array.isArray(obj)) return "array";
  return typeof obj;
}

function canExtendArray(key: string, arrayExtend: ArrayExtend): boolean {
  return Array.isArray(arrayExtend) ? arrayExtend.includes(key) : arrayExtend;
}

// merge b int a, arrayExtend is either a boolean or a array of property keys to allow extension
export function deepMerge(a: any, b: any, {arrayExtend = false, maxRecursion = 10}: DeepieMergeOpts = {arrayExtend: false, maxRecursion: 10}): any {
  if (Array.isArray(a) && Array.isArray(b)) return arrayExtend ? extendArrays(a, b) : b;
  if (!isObject(b)) return b;
  if (maxRecursion === 0) return a;

  for (const key of Object.keys(b)) {
    const typeA = getType(a[key]);
    const typeB = getType(b[key]);
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
