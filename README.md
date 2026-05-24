# tguard-js

<div align="center">
  <img alt="GitHub Actions Test" src="https://img.shields.io/github/actions/workflow/status/mitsuki31/tguard-js/test.yml?branch=master&style=flat-square&logo=github" />
  <a href="https://app.codecov.io/gh/mitsuki31/tguard-js">
    <img alt="Codecov Coverage" src="https://img.shields.io/codecov/c/github/mitsuki31/tguard-js?style=flat-square&logo=codecov&label=Code%20Coverage&labelColor=%23ffeedd" />
  </a>
  <br />

  <a href="https://npmjs.com/package/tguard-js">
    <img alt="npm version" src="https://img.shields.io/npm/v/tguard-js?style=flat-square&logo=npm" />
  </a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <a href="https://github.com/mitsuki31/tguard-js/blob/master/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/mitsuki31/tguard-js?style=flat-square&label=License" />
  </a>
  <br />

  <img alt="Node Version" src="https://img.shields.io/node/v/tguard-js?style=flat-square&logo=node.js" />
  <img alt="Bun Support" src="https://img.shields.io/badge/Bun-supported-f9f1e1?style=flat-square&logo=bun" />
</div>
<br />

A small, focused runtime type-checking library for TypeScript and JavaScript.
Provides reliable type guards with accurate narrowing, predictable behavior, and consistent handling of edge cases.

This package helps you skip the repetitive work of writing runtime type checks.
It gives you a consistent set of utilities, so you can focus on building instead of rewriting the same guards.

---

## Features

- **Reliable Type Guards**\
  Covers primitives, objects, arrays, functions, dates, errors, and more.
- **Accurate Type Narrowing**\
  Uses proper TypeScript predicates (`x is T`) where runtime guarantees are valid.
- **Cross-Realm Safe Checks**\
  Handles cases where `instanceof` fails (e.g., `iframe`s, multiple runtimes).
- **Consistent Runtime Semantics**\
  Avoids misleading native behaviors (e.g., `Object.isSealed(null)`).
- **Zero Dependencies**\
  No external packages, suitable for production and libraries.
- **Well-Defined Behavior**\
  Each function documents its guarantees and limitations explicitly.
- **Runtime Agnostic**\
  Works in Node.js, browsers, Bun, and other modern JS environments.

---

## Why `tguard-js`?

JavaScript’s built-in type checks are inconsistent and sometimes misleading.

```js
// Cross-realm issue
const ForeignError = window.frames[0].Error;
new ForeignError() instanceof Error; // false

// Primitive coercion (by spec, but often undesirable)
Object.isSealed(null);   // true
Object.isFrozen(123);    // true
```

These results are technically correct by specification, but not useful for runtime validation.

---

### `tguard-js` Approach

```js
import * as TG from 'tguard-js';

TG.isNull(null);    // true
TG.isArray([]);     // true
TG.isObject(null);  // false
TG.isRecord({});    // true
TG.isRecord([]);    // false

// Cross-realm safe
const ForeignError = window.frames[0].Error;
TG.isError(new ForeignError()); // true

// Predictable object checks
TG.isSealed(null);  // false
TG.isFrozen(123);   // false
```

The library prioritizes **predictability over spec quirks**.

---

## Installation

### Bun

```bash
bun install tguard-js
```

### npm

```bash
npm install tguard-js
```

---

## Quick Start

```ts
import { isString, isArrayOf, isRecord } from 'tguard-js';

// Basic validation
if (isString(value)) {
  value.toUpperCase();
}

// Check if all array elements are string
if (isArrayOf(data, isString)) {
  console.log(data[0]);
}

// Check if the config has `key` before consuming it
if (isRecord(config) && isString(config.key)) {
  useConfig(config);
}
```

---

## Core Concepts

### 1. Type guards only when provable

Functions use `x is T` **only when runtime checks guarantee it**.

```ts
isString(x): x is string    // safe
isArray(x): x is unknown[]  // safe
isRecord(o): o is Record<PropertyKey, unknown>  // safe

isEmptyArray(x): x is []
isEmptyObject(o): o is Record<PropertyKey, never>
```

### 2. No false guarantees

Generic predicates are only used when validated:

```ts
isArrayOf<T>(x, predicate): x is T[]
isRecordOf<T>(x, predicate): x is Record<string, T>
```

This avoids unsafe narrowing.

### 3. Clear separation of responsibilities

| Function Type   | Example         |
| --------------- | --------------- |
| Type check      | `isDate`        |
| Validity check  | `isValidDate`   |
| Structure check | `isPlainObject` |
| Semantic check  | `isEmptyObject` |

---

## API Overview

See APIs documentation:\
→ [API Overview](./docs/APIs.md)

---

## Advanced Usage

More patterns and examples:\
→ [Advanced Usage](./docs/Advanced-Usage.md)

---

## Testing

```bash
bun run test
```

or:

```bash
npm run test
```

The test suite covers:

- edge cases
- invalid inputs
- runtime consistency

---

## Performance

Designed for minimal overhead:

- No allocations beyond necessary checks
- Direct use of native APIs
- Suitable for hot paths and validation layers

---

## TypeScript

Fully compatible with TypeScript's strict mode:

```ts
if (isString(value)) {
  value.charAt(0);
}
```

Custom predicates:

```ts
function isStringOrBoolean(x: unknown): x is string | boolean {
  return isString(x) || isBoolean(x);
}

isArrayOf(['a', true], isStringOrBoolean); // true
```

---

## Runtime Support

- Node.js 14+ (with support both CommonJS and ESM)
- Modern browsers (ES2015+)
- Bun
- Deno

---

## Contributing

Contributions are welcome and appreciated. Please prefer small, focused changes with clear context and reasoning whenever possible.

Before opening a pull request, read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for setup instructions, development workflow, and contribution guidelines.

---

## License

© 2026 [Ryuu Mitsuki](https://github.com/mitsuki31). Licensed under the [MIT License](./LICENSE).

Made with ❤️ by developer, for developers.
