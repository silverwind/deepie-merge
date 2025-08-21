type ArrayExtend = boolean | string[];

type DeepieMergeOpts = {
  /** Either a boolean or a array of property keys to allow extension. Default: false */
  arrayExtend?: ArrayExtend,
  /** Maximum recursions to perform. Default: 10. */
  maxRecursion?: number,
}

type DeepMergeable = {[key: string]: any} | any[];

function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function extendArrays<T extends any[]>(a: T, b: T): T {
  return uniq([...a, ...b]) as T;
}

function uniq<T extends any[]>(arr: T): T {
  return Array.from(new Set(arr)) as T;
}

function getType(obj: any): string {
  if (isObject(obj)) return "object";
  if (Array.isArray(obj)) return "array";
  return typeof obj;
}

function canExtendArray(key: string, arrayExtend: ArrayExtend): boolean {
  return Array.isArray(arrayExtend) ? arrayExtend.includes(key) : arrayExtend;
}

/** deep-merge b int a */
export function deepMerge<T extends DeepMergeable>(a: T, b: any, {arrayExtend = false, maxRecursion = 10}: DeepieMergeOpts = {arrayExtend: false, maxRecursion: 10}): T {
  if (maxRecursion === 0) return a;

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return (arrayExtend ? extendArrays(a, b) : b) as T;
    } else {
      return b as T;
    }
  } else if (Array.isArray(b)) {
    return b as T;
  }

  if (isObject(a) && isObject(b)) {
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
  }

  return a;
}
