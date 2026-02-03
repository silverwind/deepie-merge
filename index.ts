type ArrayExtend = boolean | Array<string>;

type DeepieMergeOpts = {
  /** Either a boolean or a array of property keys to allow extension. Default: false */
  arrayExtend?: ArrayExtend,
  /** Maximum recursions to perform. Default: 10. */
  maxRecursion?: number,
};

type DeepMergeable = {[key: string]: any} | Array<any>;

function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function getType(obj: any): string {
  if (isObject(obj)) return "object";
  if (Array.isArray(obj)) return "array";
  return typeof obj;
}

/** deep-merge b into a */
export function deepMerge<T extends DeepMergeable>(a: T, b: any, {arrayExtend = false, maxRecursion = 20}: DeepieMergeOpts = {arrayExtend: false, maxRecursion: 10}): T {
  return merge(a, b, arrayExtend, maxRecursion) as T;
}

function merge(a: any, b: any, arrayExtend: ArrayExtend, maxRecursion: number): any {
  if (maxRecursion === 0) return a;

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return arrayExtend ? Array.from(new Set([...a, ...b])) : b;
    }
    return b;
  }
  if (Array.isArray(b)) return b;

  if (isObject(a) && isObject(b)) {
    const keys = Object.keys(b);
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const typeA = getType(a[key]);
      const typeB = getType(b[key]);
      if (typeA !== typeB) {
        a[key] = b[key];
      } else if (typeA === "array" && (Array.isArray(arrayExtend) ? arrayExtend.includes(key) : arrayExtend)) {
        a[key] = Array.from(new Set([...a[key], ...b[key]]));
      } else if (typeA === "object") {
        a[key] = merge(a[key], b[key], arrayExtend, maxRecursion - 1);
      } else {
        a[key] = b[key];
      }
    }
  }

  return a;
}
