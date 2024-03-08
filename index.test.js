import {deepMerge} from "./index.js";

test("deepMerge", () => {
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

  expect(deepMerge({a: [1]}, {a: [2]})).toEqual({a: [2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: true})).toEqual({a: [1, 2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: false})).toEqual({a: [2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: ["a"]})).toEqual({a: [1, 2]});
  expect(deepMerge({a: [1]}, {a: [2]}, {arrayExtend: ["b"]})).toEqual({a: [2]});

  const obj = {};
  expect(deepMerge({a: [obj]}, {a: [obj]}, {arrayExtend: true})).toEqual({a: [obj]});
  expect(deepMerge({a: [obj]}, {a: [obj]}, {arrayExtend: false})).toEqual({a: [obj]});
  expect(deepMerge({a: [1, 2]}, {a: [2, 3]}, {arrayExtend: true})).toEqual({a: [1, 2, 3]});
});
