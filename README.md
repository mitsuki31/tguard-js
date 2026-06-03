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

A lightweight, runtime-agnostic validation library designed to secure the boundaries of your application. It delivers strict runtime type narrowing, absolute cross-realm safety, and predictable edge-case handling where TypeScript compile-time inferences cannot reach.

Unlike heavy validation libraries, this package eliminates the boilerplate of writing repetitive runtime type checks.
It provides a consistent, high-performance utility set so you can focus on building your application instead of rewriting the same guards.

---

## Key Benefits & Use Cases

| Core Benefit | Why It Matters | Perfect Use Cases |
| :--- | :--- | :--- |
| **Zero External Dependencies** | Keeps your final bundle size minimal and completely eliminates supply-chain security risks. | **CLI Tools & SDKs:** Maintainers looking to build lean, ultra-fast utilities with no downstream bloat. |
| **Runtime Agnostic** | Seamlessly works across **Node.js (v14.13+)**, modern browsers, **Bun**, and other contemporary JS environments. | **Isomorphic Applications:** Monorepos sharing validation logic between backends and frontends. |
| **Predictable Structural Shapes** | Uses `hasShape` to explicitly validate object structures and nested properties with well-defined behavior. | **Web Scrapers & Config Parsers:** Safely asserting the exact keys and types of messy, extracted data or incoming user configurations. |
| **Cross-Realm Safe** | Accurately checks types across isolated execution contexts where native features like `instanceof` shatter. | **Micro-frontends & Workers:** Environments passing dynamic payloads across Iframes or Web Worker boundaries. |
| **TypeScript Inference** | Uses precise `value is T` type predicates to unlock instant IDE autocomplete and compile-time type narrowing. | **REST APIs & Route Guards:** Transforming untyped, incoming `unknown` JSON bodies into strictly typed objects. |

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

### Imports

`tguard-js` supports both **ESModule** and **CommonJS** modules.

#### ESModule

```typescript
import TG from 'tguard-js';
```

#### CommonJS

```typescript
const TG = require('tguard-js');
```

### Basic Example

```typescript
import { isString, isArrayOf, isRecord } from 'tguard-js';

// Basic validation
if (isString(value)) {
  value.toUpperCase();
}

// Check if all array elements are string
if (isArrayOf(data, isString)) {
  console.log(data[0]);
}

// Check if the config has `key` property before consuming it
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
