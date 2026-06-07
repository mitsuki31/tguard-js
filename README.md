# tguard-js

<div align="center">
  <img src="https://raw.githubusercontent.com/mitsuki31/tguard-js/refs/heads/master/docs/favicon.png" />
</div>

<div align="center">
  <img alt="GitHub Actions Test" src="https://img.shields.io/github/actions/workflow/status/mitsuki31/tguard-js/test.yml?branch=master&style=flat-square&logo=github" />
  <a href="https://app.codecov.io/gh/mitsuki31/tguard-js">
    <img alt="Codecov Coverage" src="https://img.shields.io/codecov/c/github/mitsuki31/tguard-js?style=flat-square&logo=codecov&label=Code%20Coverage&labelColor=%23ffeedd" />
  </a>
  <a href="https://www.codefactor.io/repository/github/mitsuki31/tguard-js">
    <img alt="CodeFactor" src="https://www.codefactor.io/repository/github/mitsuki31/tguard-js/badge" />
  </a>
  <br />

  <a href="https://npmjs.com/package/tguard-js">
    <img alt="npm version" src="https://img.shields.io/npm/v/tguard-js?style=flat-square&logo=npm" />
  </a>
  <a href="https://bundlephobia.com/package/tguard-js">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/tguard-js?style=flat-square&logo=npm" />
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

## Why tguard-js?

JavaScript’s built-in type checks are inconsistent and sometimes misleading.

```js
// Cross-realm issue
const ForeignError = window.frames[0].Error;
new ForeignError() instanceof Error; // false

// Primitive coercion (by spec, but often undesirable)
Object.isSealed(null);     // true
Object.isFrozen(123);      // true
typeof null === 'object';  // true
```

These results are technically correct by specification, but not useful for runtime validation.

### tguard-js Approach

```js
import tg from 'tguard-js';

tg.isNull(null);    // true
tg.isArray([]);     // true
tg.isObject(null);  // false
tg.isRecord({});    // true
tg.isRecord([]);    // false

// Cross-realm safe
const ForeignError = window.frames[0].Error;
tg.isError(new ForeignError()); // true

// Predictable object checks
tg.isSealed(null);  // false
tg.isFrozen(123);   // false
tg.utils.getType(null, true) === 'object'; // false
```

The library prioritizes **predictability over spec quirks**.

## Installation

### Bun

```bash
bun a tguard-js
```

### npm

```bash
npm i tguard-js
```

## Quick Start

### Imports

`tguard-js` supports both **ESModule** and **CommonJS** modules.

#### ESModule

```typescript
import tg from 'tguard-js';
```

#### CommonJS

```typescript
const tg = require('tguard-js');
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

Object validation:

```js
import tg from 'tguard-js';

const isUser = (u) => tg.hasShape(u, {
  id: tg.isNumber,
  name: tg.isString,
});

const data = { ... } // untrusted user data

// Check if the input is unrecognized as user data
if (!isUser(data)) {
  // Here you can throw an error or have a fallback
}

// Can safely use the input data
consumeUser(data);
```

## API Overview

See APIs documentation:\
→ [API Overview](./docs/APIs.md)

## Advanced Usage

More patterns and examples:\
→ [Advanced Usage](./docs/Advanced-Usage.md)

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

## Contributing

Contributions are welcome and appreciated. Please prefer small, focused changes with clear context and reasoning whenever possible.

Before opening a pull request, read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for setup instructions, development workflow, and contribution guidelines.

---

## License

© 2026 [Ryuu Mitsuki](https://github.com/mitsuki31). Licensed under the [MIT License](./LICENSE).

Made with ❤️ by developer, for developers.
