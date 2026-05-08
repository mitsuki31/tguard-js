/**
 * @module    typeguard.utils
 * @author    Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license   MIT
 * @since     1.0.0
 */

/**
 * Determines whether the provided value has an own property.
 *
 * @typeParam K - The type of the property key.
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
