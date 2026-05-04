# typeguard-js

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

## Why `typeguard-js`?

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

### `typeguard-js` Approach

```js
import * as TG from 'typeguard-js';

TG.isNull(null);        // true
TG.isArray([]);         // true
TG.isObject(null);      // false
TG.isRecord({});        // true
TG.isRecord([]);        // false

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

```bash
bun install typeguard-js
```

```bash
npm install typeguard-js
```

---

## Quick Start

```ts
import { isString, isArray, isRecord } from 'typeguard-js';

if (isString(value)) {
  value.toUpperCase();
}

if (isArray(data) && isString(data[0])) {
  console.log(data[0]);
}

if (isRecord(config) && isString(config.key)) {
  useConfig(config);
}
```

---

## Core Concepts

### 1. Type guards only when provable

Functions use `x is T` **only when runtime checks guarantee it**.

```ts
isString(x): x is string       // safe
isArray(x): x is unknown[]     // safe
```

### 2. No false guarantees

Generic predicates are only used when validated:

```ts
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
bun test
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

Fully compatible with strict mode:

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

isArrayOf(['a', true], isStringOrBoolean);
```

---

## Runtime Support

- Node.js 14+
- Modern browsers (ES2015+)
- Bun
- Deno

---

## Contributing

Contributions are welcome. Prefer small, focused changes with clear reasoning.

---

## License

© 2026 [Ryuu Mitsuki](https://github.com/mitsuki31). Licensed under the [MIT License](./LICENSE).

Made with ❤️ by developer, for developers.
