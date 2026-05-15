/**
 * @module    typeguard.utils
 * @author    Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license   MIT
 * @since     1.0.0
 */

/**
 * Determines whether the provided value has an own property.
 *
 * @remarks
 * This function is an alias for `Object.prototype.hasOwnProperty` but more robust.
 *
 * @typeParam K - The property key type expected to exist on the object.
 * @param obj - The object to be used to check for an own property.
 * @param key - The property key to be checked.
 *
 * @returns `true` if the value has an own property, otherwise `false`.
 *
 * @example
 * ```typescript
 * const obj = { a: 1 };
 * hasOwn(obj, 'a');  // true
 * hasOwn(obj, 'b');  // false
 * ```
 *
 * @since 1.0.0
 */
export function hasOwn<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, key)
  );
}

/**
 * Determines whether the provided value is an object containing all
 * specified own property keys.
 *
 * @remarks
 * This function checks whether every key in the provided `keys` list
 * exists as an own property on the target object.
 *
 * It does **not** require the object to have exactly the same keys;
 * additional properties are allowed.
 *
 * By default, only enumerable string keys are checked.
 * When `includeHidden` is enabled, all own property keys are included,
 * including non-enumerable and symbol keys.
 *
 * ### Array Behavior
 *
 * Arrays are treated as objects and are therefore supported.
 *
 * When validating arrays:
 *
 * - `Object.keys()` returns enumerable index keys (`'0'`, `'1'`, ...)
 * - `Reflect.ownKeys()` additionally includes non-enumerable own keys
 *   such as `'length'`
 *
 * This means enabling `includeHidden` may require including `'length'`
 * in the expected key list for arrays. See example code below:
 *
 * ```javascript
 * hasKeys([], ['length']);        // false
 * hasKeys([], ['length'], true);  // true
 * ```
 *
 * ### Implementation Notes
 *
 * - This function checks only own properties.
 * - Prototype chain properties are ignored.
 * - This function does not validate property values. Use
 *   {@linkcode builtins.object.isRecordOf | isRecordOf} for value validation.
 *
 * @example
 * Basic key validation:
 *
 * ```javascript
 * const user = { id: 1, name: 'Alice' };
 *
 * hasKeys(user, ['id', 'name']); // true
 *
 * // Add new property to user
 * user.email = 'alice@example.com';
 * if (hasKeys(user, ['email'])) {
 *   // Property `email` can be used here
 * }
 * ```
 *
 * Missing keys:
 *
 * ```typescript
 * hasKeys(
 *   { id: 1 },
 *   ['id', 'name']
 * ); // false
 * ```
 *
 * Extra keys are allowed:
 *
 * ```typescript
 * hasKeys(
 *   { id: 1, name: 'Alice', active: true },
 *   ['id']
 * ); // true
 * ```
 *
 * Symbol keys:
 *
 * ```typescript
 * const key = Symbol('token');
 *
 * hasKeys(
 *   { [key]: 'abc' },
 *   [key],
 *   true
 * ); // true
 * ```
 *
 * @typeParam K - The property key type expected to exist on the object.
 *
 * @param o - The value to validate.
 * @param keys - Required own property keys.
 * @param includeHidden - Whether to include non-enumerable and symbol keys.
 *
 * @returns `true` if all specified keys exist on the object.
 *
 * @since 1.1.0
 */
export function hasKeys<K extends PropertyKey>(
  o: unknown,
  keys: readonly K[],
  includeHidden?: boolean
): o is Record<K, unknown> {
  if (o === null || typeof o !== 'object') return false;

  const objectKeys = new Set(
    (includeHidden ? Reflect.ownKeys(o) : Object.keys(o)) as K[]
  );

  for (const key of keys) {
    if (!objectKeys.has(key)) return false;
  }

  return true;
}

/**
 * Determines whether the provided value is an object matching the
 * specified property shape.
 *
 * @remarks
 * This function validates that:
 *
 * - the value is an object
 * - all keys defined in `shape` exist as own properties
 * - each corresponding property value satisfies its predicate
 *
 * Additional properties not defined in `shape` are allowed.
 *
 * Unlike {@linkcode hasKeys}, this function also validates the values of
 * each property.
 *
 * Unlike {@link builtins.object.isRecordOf | isRecordOf},
 * each property may use a different validator.
 *
 * ### Shape Key Behavior
 *
 * The `shape` descriptor always evaluates all own keys using
 * `Reflect.ownKeys()`, including symbol and non-enumerable properties.
 *
 * The `includeHidden` option only controls whether the target object
 * being validated includes non-enumerable and symbol keys.
 *
 * ### Array Behavior
 *
 * Arrays are treated as objects and are therefore supported.
 *
 * When validating arrays:
 *
 * - `Object.keys()` returns enumerable index keys (`'0'`, `'1'`, ...)
 * - `Reflect.ownKeys()` additionally includes non-enumerable own keys
 *   such as `'length'`
 *
 * ```javascript
 * const arr = ['foo', null];
 *
 * hasShape(arr, {
 *   '0': v => v === 'foo',
 *   '1': v => v === null
 * }); // true
 * ```
 *
 * ### Implementation Notes
 *
 * - Only own properties are checked.
 * - Prototype properties are ignored.
 * - Additional properties are allowed.
 * - Symbol and non-enumerable properties require `includeHidden` to be enabled.
 *
 * @example
 * Basic usage:
 *
 * ```typescript
 * hasShape(
 *   { id: 1, name: 'Alice' },
 *   {
 *     id: isNumber,
 *     name: isString
 *   }
 * ); // true
 * ```
 *
 * Missing property:
 *
 * ```typescript
 * hasShape(
 *   { id: 1 },
 *   {
 *     id: isNumber,
 *     name: isString
 *   }
 * ); // false
 * ```
 *
 * Invalid property value:
 *
 * ```typescript
 * hasShape(
 *   { id: '1', name: 'Alice' },
 *   {
 *     id: isNumber,
 *     name: isString
 *   }
 * ); // false
 * ```
 *
 * Symbol keys:
 *
 * ```typescript
 * const token = Symbol('token');
 *
 * hasShape(
 *   { [token]: 'abc' },
 *   {
 *     [token]: isString
 *   },
 *   true
 * ); // true
 * ```
 *
 * @typeParam S - The object shape inferred from the predicate map.
 *
 * @param o - The value to validate.
 * @param shape - An object whose values are predicates for each expected property.
 * @param includeHidden - Whether to include non-enumerable and symbol keys.
 *
 * @returns `true` if the value matches the specified shape.
 *
 * @since 1.1.0
 *
 * @see {@link hasKeys}
 * @see {@link builtins.object.isRecordOf}
 */
export function hasShape<S extends Record<PropertyKey, unknown>>(
  o: unknown,
  shape: { [K in keyof S]: (value: unknown) => value is S[K] },
  includeHidden?: boolean
): o is S {
  if (o === null || typeof o !== 'object') return false;

  const objectKeys = new Set(
    (includeHidden ? Reflect.ownKeys(o) : Object.keys(o)) as (keyof S)[]
  );

  for (const key of Reflect.ownKeys(shape) as (keyof S)[]) {
    if (!objectKeys.has(key)) return false;

    const value = (o as Record<PropertyKey, unknown>)[key];
    const predicate = shape[key];

    if (!predicate(value)) return false;
  }

  return true;
}

/**
 * Returns the type of the provided value as a string.
 *
 * @remarks
 * This function provides a normalized type representation by combining
 * `typeof` and `Object.prototype.toString` semantics.
 *
 * - For `null`, it returns `'null'` (instead of the misleading `'object'` from `typeof`).
 * - For primitives (`string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`),
 *   it returns the result of `typeof`.
 * - For objects and built-in instances, it returns the internal tag
 *   (e.g., `'[object Date]'`, `'[object Array]'`).
 * - For functions and classes:
 *   - When `nameOnly` is `false`, it returns `'function'`.
 *   - When `nameOnly` is `true`, it attempts to return the function or class name.
 *
 * ### Function and Class Name Resolution
 *
 * When `nameOnly` is `true`, the function attempts to resolve a meaningful name:
 *
 * 1. Uses `fn.name` if available (including inferred names).
 * 2. Falls back to parsing `Function.prototype.toString`.
 * 3. Returns a fallback string if no name can be determined.
 *
 * ### Edge Cases
 *
 * | Value                         | `getType(x)`        | `getType(x, true)` |
 * | ----------------------------- | ------------------- | ------------------ |
 * | `null`                        | `'[object Null]'`   | `'null'`           |
 * | `undefined`                   | `'undefined'`       | `'undefined'`      |
 * | `'text'`                      | `'string'`          | `'string'`         |
 * | `123`                         | `'number'`          | `'number'`         |
 * | `123n`                        | `'bigint'`          | `'bigint'`         |
 * | `[]`                          | `'[object Array]'`  | `'Array'`          |
 * | `{}`                          | `'[object Object]'` | `'Object'`         |
 * | `new Date()`                  | `'[object Date]'`   | `'Date'`           |
 * | `function foo(){}`            | `'function'`        | `'foo'`            |
 * | `const x = () => {}`          | `'function'`        | `'x'`              |
 * | `(() => {})`                  | `'function'`        | `'(anonymous)'`    |
 * | `class MyClass {}`            | `'function'`        | `'MyClass'`        |
 * | `class {}`                    | `'function'`        | `'(anonymous)'`    |
 * | `function() {}`               | `'function'`        | `'(anonymous)'`    |
 *
 * ### Notes
 *
 * - Function and class names may be inferred from variable bindings:
 *
 *   ```typescript
 *   const fn = () => {};
 *   fn.name === 'fn';
 *   ```
 *
 * - Anonymous functions or classes (without bindings nor variable names) may not have a name,
 *   and will return `'(anonymous)'` as a fallback.
 *
 * - In minified or transpiled code, names may be altered or removed.
 *
 * @param x - The value whose type is to be determined.
 * @param nameOnly - Whether to return a simplified name instead of a full tag.
 *
 * @returns A string representing the type of the value.
 *
 * @since 1.0.0
 */
export function getType(x: unknown, nameOnly?: boolean): string {
  // We don't use `typeof x` here, it can returns 'object' which is
  // not consistent and can't distinguish between object subtypes
  if (x === null) return nameOnly ? 'null' : '[object Null]';

  const type = typeof x;

  // Handle functions / classes
  if (type === 'function') {
    if (!nameOnly) return 'function';

    const fn = x as Function;
    // Attempting to get the bound name from the class/function
    // This can explicitly return the bound variable name
    if (fn.name && fn.name.length > 0) return fn.name;

    const fnStr = Function.prototype.toString.call(fn);

    if (/^class\s*\{/.test(fnStr)) return '(anonymous)'; // Detect anonymous class
    return '(anonymous)'; // Anonymous / arrow function
  }

  // Primitive (non-object)
  if (type !== 'object') return type;

  const tag = Object.prototype.toString.call(x);
  return nameOnly ? tag.slice(8, -1) : tag;
}

/**
 * Returns the detailed type of the provided value as a string.
 *
 * @remarks
 * This function is an alias for {@linkcode getType} with `nameOnly` set to `false`.
 *
 * @param x - The value whose type is to be determined.
 * @returns A string representing the detailed type of the value.
 *
 * @since 1.0.0
 * @see {@link getType}
 */
export function typeOf(x: unknown): string {
  return getType(x, false);
}
