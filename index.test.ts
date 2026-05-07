import {deepMerge} from "./index.ts";

test("deepMerge", () => {
  expect(deepMerge({a: [1]}, null)).toEqual({a: [1]});
  expect(deepMerge({a: [1]}, undefined)).toEqual({a: [1]});

  expect(deepMerge({a: [1]}, {a: [2]})).toEqual({a: [2]});
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
  expect(deepMerge({}, {})).toEqual({});

  const original = {a: 1, deep: {b: 2, c: 0}};
  const result = deepMerge(original, {a: 2, deep: {c: 3}}, {clone: true});
  expect(result).toEqual({a: 2, deep: {b: 2, c: 3}});
  expect(original).toEqual({a: 1, deep: {b: 2, c: 0}});

  const originalArr = [1, 2];
  const resultArr = deepMerge(originalArr, [3, 4], {clone: true, arrayExtend: true});
  expect(resultArr).toEqual([1, 2, 3, 4]);
  expect(originalArr).toEqual([1, 2]);

  const customClone = (value: any) => structuredClone(value);
  const original2 = {a: 1, deep: {b: 2, c: 0}};
  const result2 = deepMerge(original2, {a: 2, deep: {c: 3}}, {clone: customClone});
  expect(result2).toEqual({a: 2, deep: {b: 2, c: 3}});
  expect(original2).toEqual({a: 1, deep: {b: 2, c: 0}});
});

test("deepMerge type: rejects keys not in target", () => {
  type Config = {pin?: Record<string, string>};
  const config: Config = {pin: {tsdown: "0.21.9"}};
  // @ts-expect-error 'pnpm' is not a key of Config
  deepMerge(config, {pnpm: "^10"});
  // @ts-expect-error 'wrongKey' is not a key of nested target
  deepMerge({a: 1, deep: {b: 2}}, {deep: {wrongKey: 3}});
});
