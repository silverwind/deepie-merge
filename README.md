# deepie-merge
[![](https://img.shields.io/npm/v/deepie-merge.svg?style=flat)](https://www.npmjs.org/package/deepie-merge) [![](https://img.shields.io/npm/dm/deepie-merge.svg)](https://www.npmjs.org/package/deepie-merge) [![](https://packagephobia.com/badge?p=deepie-merge)](https://packagephobia.com/result?p=deepie-merge)

> Yay, another deep merge

## Usage
```console
npm i deepie-merge
```

```js
import {deepMerge} from "deepie-merge";

deepMerge({a: [1]}, {a: [2]});
// => {a: [2]}

deepMerge({a: [1]}, {a: [2]}, {arrayExtend: true});
// => {a: [1, 2]}

deepMerge({a: [1], b: [1]}, {a: [2], b: [2]}, {arrayExtend: ["a"]});
// => {a: [1, 2], b: [2]}
```

## API

### deepMerge(dst, src, options)

- `dst` *any*: Destination value
- `src` *any*: Source value
- `options` *object*:
  - `arrayExtend` *boolean* or *string[]*: Whether to extend array instead of replacing them. When passed a string array, it will only extend the object keys provided in that array
  - `maxRecursions` *number*: Amount of nesting levels to recurse into. Default: `10`

© [silverwind](https://github.com/silverwind), distributed under BSD licence
