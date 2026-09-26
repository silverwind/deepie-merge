type ArrayExtend = boolean | Array<string>;

type DeepieMergeOpts<T = any> = {
  /** Either a boolean or an array of property keys to allow extension. Default: false */
  arrayExtend?: ArrayExtend,
  /** Maximum recursions to perform. Default: 20. */
  maxRecursion?: number,
  /** Return a new value instead of mutating the first argument. Default: false */
  clone?: boolean | ((value: NoInfer<T>) => NoInfer<T>),
};

type DeepMergeable = {[key: string]: any} | Array<any>;

/** Top-level shape and keys of `T` with `unknown` values: rejects excess keys, accepts wider overrides */
type DeepMergeSource<T> =
  T extends ReadonlyArray<any> ? ReadonlyArray<unknown> :
    T extends object ? {[K in keyof T]?: unknown} :
      never;

function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function getType(obj: any): string {
  if (isObject(obj)) return "object";
  if (Array.isArray(obj)) return "array";
  return typeof obj;
}

/** deep-merge b into a */
export function deepMerge<T extends DeepMergeable>(a: T, b: NoInfer<T> | DeepMergeSource<NoInfer<T>> | null | undefined, {arrayExtend = false, maxRecursion = 20, clone = false}: DeepieMergeOpts<T> = {}): T {
  return merge(clone ? (typeof clone === "function" ? clone(a) : structuredClone(a)) : a, b, arrayExtend, maxRecursion);
}

function union(target: Array<any>, source: Array<any>): Array<any> {
  const set = new Set(target);
  for (const value of source) set.add(value);
  return Array.from(set);
}

function merge(a: any, b: any, arrayExtend: ArrayExtend, maxRecursion: number): any {
  if (maxRecursion === 0) return a;

  if (Array.isArray(a)) return arrayExtend && Array.isArray(b) ? union(a, b) : b;
  if (Array.isArray(b)) return b;

  if (isObject(a) && isObject(b)) {
    const keys = Object.keys(b);
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const typeA = getType(a[key]);
      if (typeA !== getType(b[key])) {
        a[key] = b[key];
      } else if (typeA === "array" && (Array.isArray(arrayExtend) ? arrayExtend.includes(key) : arrayExtend)) {
        a[key] = union(a[key], b[key]);
      } else if (typeA === "object") {
        a[key] = merge(a[key], b[key], arrayExtend, maxRecursion - 1);
      } else {
        a[key] = b[key];
      }
    }
  }

  return a;
}
