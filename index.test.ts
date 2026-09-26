import {deepMerge} from "./index.ts";

test("deepMerge", () => {
  expect(deepMerge({a: [1]}, null)).toEqual({a: [1]});
  expect(deepMerge({a: [1]}, undefined)).toEqual({a: [1]});
  // @ts-expect-error null is not a valid destination
  expect(deepMerge(null, {a: [1]})).toEqual(null);
  // @ts-expect-error undefined is not a valid destination
  expect(deepMerge(undefined, {a: [1]})).toEqual(undefined);

  expect(deepMerge({a: [1]}, {a: [2]})).toEqual({a: [2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: true})).toEqual({a: [1, 2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: false})).toEqual({a: [2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: ["a"]})).toEqual({a: [1, 2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: ["b"]})).toEqual({a: [2]});

  const obj = {};
  expect(deepMerge({a: [obj]}, {a: [obj]}, {arrayExtend: true})).toEqual({a: [obj]});
  expect(deepMerge({a: [obj]}, {a: [obj]}, {arrayExtend: false})).toEqual({a: [obj]});
  expect(deepMerge({a: [1, 2]}, {a: [2, 3]}, {arrayExtend: true})).toEqual({a: [1, 2, 3]});

  expect(deepMerge({
    a: 1,
    arr: [1],
    deep: {
      b: 2,
      arr: [2],
      verydeep: {
        c: 3,
        arr: [4],
      }
    }
  }, {
    a: 2,
    deep: {
      b: 3,
      arr: [3],
      verydeep: {
        c: 4,
        arr: [],
      }
    }
  })).toEqual({
    "a": 2,
    "arr": [1],
    "deep": {
      "arr": [3],
      "b": 3,
      "verydeep": {
        "arr": [],
        "c": 4,
      },
    },
  });

  expect(deepMerge([1], [2])).toEqual([2]);
  expect(deepMerge([1], [2], {arrayExtend: true})).toEqual([1, 2]);
  // @ts-expect-error heterogeneous merge of array into object
  expect(deepMerge([1], {})).toEqual({});
  expect(deepMerge({}, [1])).toEqual([1]);
  expect(deepMerge({}, {})).toEqual({});

  const nested = (value: number) => Array.from({length: 12}).reduce<Record<string, any>>((inner) => ({x: inner}), {v: value});
  expect(deepMerge(nested(1), nested(2))).toEqual(nested(2));
  expect(deepMerge(nested(1), nested(2), {})).toEqual(nested(2));

  const original = {a: 1, deep: {b: 2}};
  expect(deepMerge(original, {a: 2, deep: {b: 3}}, {clone: true})).toEqual({a: 2, deep: {b: 3}});
  expect(original).toEqual({a: 1, deep: {b: 2}});

  const originalArr = [1, 2];
  expect(deepMerge(originalArr, [3, 4], {clone: true, arrayExtend: true})).toEqual([1, 2, 3, 4]);
  expect(originalArr).toEqual([1, 2]);

  const original2 = {a: 1, deep: {b: 2}};
  expect(deepMerge(original2, {a: 2, deep: {b: 3}}, {clone: (value) => structuredClone(value)})).toEqual({a: 2, deep: {b: 3}});
  expect(original2).toEqual({a: 1, deep: {b: 2}});

  expect(deepMerge({}, JSON.parse(`{"__proto__": {"polluted": true}}`))).toEqual({});
  expect(Object.prototype).not.toHaveProperty("polluted");
  function Foo() {}
  expect(deepMerge(Object.create(Foo), JSON.parse(`{"prototype": {"polluted": true}}`))).toEqual({});
  expect(Foo.prototype).not.toHaveProperty("polluted");
  expect(deepMerge({}, {constructor: 1})).toEqual({constructor: 1});
});

test("deepMerge type: rejects top-level keys not in target", () => {
  type Config = {pin?: Record<string, string>};
  const config: Config = {pin: {tsdown: "0.21.9"}};
  // @ts-expect-error 'pnpm' is not a key of Config
  deepMerge(config, {pnpm: "^10"});
});

test("deepMerge type: accepts full T as second arg in generic context", () => {
  function merge<T extends {[key: string]: any}>(a: T, b: T): T {
    return deepMerge(a, b);
  }
  expect(merge({a: 1, b: 2}, {a: 3, b: 4})).toEqual({a: 3, b: 4});
});

test("deepMerge type: accepts wider override against a satisfies-narrowed literal", () => {
  type Config = {clearScreen?: boolean, important?: boolean | string};
  const overrides: Partial<Config> = {clearScreen: true, important: "always"};
  expect(deepMerge({
    clearScreen: false,
    important: true,
  } satisfies Config, overrides)).toEqual({clearScreen: true, important: "always"});
});

test("deepMerge type: accepts union of object and primitive at nested position", () => {
  type Config = {framework?: string | {name: string, options: object}};
  const overrides: Partial<Config> = {framework: "react"};
  expect(deepMerge({framework: {name: "default", options: {}}}, overrides)).toEqual({framework: "react"});
});
