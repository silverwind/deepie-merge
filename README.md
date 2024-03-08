# deepie-merge
[![](https://img.shields.io/npm/v/deepie-merge.svg?style=flat)](https://www.npmjs.org/package/deepie-merge) [![](https://img.shields.io/npm/dm/deepie-merge.svg)](https://www.npmjs.org/package/deepie-merge) [![](https://packagephobia.com/badge?p=deepie-merge)](https://packagephobia.com/result?p=deepie-merge)

> Yet another deep merge

## Usage
```console
npm i deepie-merge
```

```js
import {deepMerge} from "deepie-merge";

deepMerge({a: [1]}, {a: [2]});
// => {a: [1]}

deepMerge({a: [1]}, {a: [2]}, {arrayExtend: true});
// => {a: [1, 2]}

deepMerge({a: [1], b: [1]}, {a: [2], b: [2]}, {arrayExtend: ["a"]});
// => {a: [1, 2], b: [2]}
```

© [silverwind](https://github.com/silverwind), distributed under BSD licence
