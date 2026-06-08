# API Overview

> [!NOTE]\
> This page highlights the most commonly used APIs.

`tguard-js` provides a set of runtime guards grouped by responsibility: primitives, objects, collections, functions, and utilities. Each function is designed to either **narrow types safely** or **validate runtime state explicitly**.

---

## Primitive Type Guards

Checks for JavaScript primitive values and numeric edge cases.

```ts
import {
  isString, isNumber, isBoolean, isBigInt, isSymbol,
  isNull, isUndefined, isNullish, isNonNullish,
  isPrimitive, isFinite, isInfinite, isNaN
} from 'tguard-js';
```

```ts
isString('hello')        // true
isNumber(42)             // true
isBoolean(true)          // true
isBigInt(123n)           // true
isSymbol(Symbol('x'))    // true

isNull(null)             // true
isUndefined(undefined)   // true

isNullish(null)          // true  (null | undefined)
isNonNullish(0)          // true  (everything except null/undefined)

isPrimitive('text')      // true

isFinite(123)            // true
isInfinite(Infinity)     // true
isNaN(NaN)               // true
```

**Notes:**

- `isNullish` and `isNonNullish` are useful for defensive checks.
- Numeric guards handle edge cases explicitly (`NaN`, `Infinity`).

---

## Object Type Guards

Validates object structure and runtime state.

```ts
import {
  isObject, isPlainObject, isRecord,
  isEmptyObject, isSealed, isFrozen, isExtensible
} from 'tguard-js';
```

```ts
isObject({})                    // true
isPlainObject({})               // true
isRecord({ key: 'value' })      // true (alias of plain object)

isEmptyObject({})               // true

isSealed(Object.seal({}))       // true
isFrozen(Object.freeze({}))     // true
isExtensible({})                // true
```

**Notes:**

- `isObject` excludes `null`.
- `isPlainObject` ensures `{}`-like objects (no class instances).
- `isRecord` is a semantic alias for key-value objects.

---

## Array Type Guards

Utilities for arrays and element validation.

```ts
import {
  isArray, isArrayOf, isEmptyArray, isReadonlyArray,
  isStringArray, isNumberArray, isBooleanArray,
  isBigIntArray, isSymbolArray, isFunctionArray,
  isObjectArray, isPlainObjectArray
} from 'tguard-js';
```

```ts
isArray([])                         // true
isArrayOf([1, 2, 3], isNumber)      // true

isEmptyArray([])                    // true
isReadonlyArray(Object.freeze([]))  // true

isStringArray(['a', 'b'])           // true
isNumberArray([1, 2, 3])            // true
isBooleanArray([true, false])       // true

isPlainObjectArray([{}, {}])        // true
```

**Notes:**

- `isArray` only checks structure.
- `isArrayOf` validates elements using a predicate.
- Specialized helpers (`isStringArray`, etc.) are built on top of `isArrayOf`.

---

## Two-dimensional Arrays & Matrices

```ts
import { is2DArray, isMatrix } from 'tguard-js';
```

```ts
is2DArray([
  ['a', 'b', 'foo'],
  ['bar', 123]
]); // true

isMatrix([
  [1, 2, 3],
  [4, 5, 6]
]); // true

// Matrix entries should be number
isMatrix([
  [1, 2, 3],
  [4, 'foo', 'bar']
]); // false
```

---

## Function & ES6 Class Type Guards

Distinguishes between callable values and class constructors.

```ts
import { isFunction, isClass, isCallable } from 'tguard-js';
```

```ts
isFunction(() => {})       // true
isFunction(class {})       // true

isClass(class A {})        // true

isCallable(() => {})       // true
isCallable(class A {})     // false
```

**Notes:**

- `isFunction` includes all functions.
- `isClass` detects ES6 classes.
- `isCallable` excludes classes and focuses on invokable functions.

---

## Date Type Guards

Covers date objects and string parsing.

```ts
import {
  isDate, isValidDate,
  isISODateString, isDateString
} from 'tguard-js';
```

```ts
isDate(new Date())               // true
isValidDate(new Date())          // true
isValidDate(new Date('invalid')) // false

isISODateString('2026-04-10T12:00:00Z') // true
isDateString('April 10, 2026')          // true
```

**Notes:**

- `isDate` checks type only.
- `isValidDate` ensures the date is not `NaN`.
- `isISODateString` is stricter than `isDateString`.

---

## Error Type Guards

Handles error objects and unsafe thrown values.

```ts
import {
  isError, isErrorLike, hasErrorMessage,
  isTypeError, isRangeError, isReferenceError, isSyntaxError,
  normalizeError, ensureError
} from 'tguard-js';
```

```ts
isError(new Error())              // true
isErrorLike({ message: 'err' })   // true
hasErrorMessage(new Error('msg')) // true

isTypeError(new TypeError())      // true
```

### Error Normalization

JavaScript allows throwing arbitrary values:

```ts
throw "Something went wrong";
throw { message: "error" };
```

Use normalization to enforce consistency:

```ts
try {
  run();
} catch (err) {
  const error = ensureError(err);
  console.error(error.message);
}
```

**Notes:**

- `isError` is strict.
- `isErrorLike` is practical for unknown inputs.
- `normalizeError` and `ensureError` converts any value into a proper `Error`.

---

## Promise Type Guards

Checks for promises and thenable objects.

```ts
import { isPromise, isPromiseLike } from 'tguard-js';
```

```ts
isPromise(Promise.resolve())       // true
isPromiseLike({ then: () => {} })  // true
```

**Notes:**

- `isPromise` checks actual Promise instances.
- `isPromiseLike` supports “thenable” patterns.

---

## Environment Guards

Utility for environment variables.

```ts
import { isEnvDefined } from 'tguard-js';
```

```ts
isEnvDefined(process.env.API_KEY) // true if non-empty string
```

---

## Utility Functions

Low-level helpers for type inspection.

```ts
import { hasOwn, getType, typeOf } from 'tguard-js/utils';
// Or: import TG from 'tguard-js';
//     const { hasOwn, getType, typeOf } = TG.utils;
```

```ts
hasOwn({ a: 1 }, 'a')  // true
hasOwn({}, 'b')        // false

getType(null)          // '[object Null]'
getType(null, true)    // 'null'

typeOf([])             // '[object Array]'
```

**Notes:**

- `hasOwn` is a safe alternative to `Object.prototype.hasOwnProperty`.
- `getType` provides consistent internal `[[Class]]` tagging.
- `typeOf` is an alias for detailed type output.
