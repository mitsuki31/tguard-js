/**
 * This module provides type guards for built-in objects.
 *
 * @module   builtins.object
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { getProto } from '../internal/utils';

type Predicate<K, V> = (key: K, value: unknown) => value is V;

/**
 * Determines whether the provided value is an object (excluding `null`).
 *
 * @remarks
 * This function returns `true` for any value whose `typeof` result is `"object"`
 * except `null`. This includes arrays, dates, maps, sets, and class instances.
 *
 * This function does **NOT** check whether a value is a plain object (`{}`).
 * Use {@linkcode isPlainObject} for that purpose.
 *
 * | Value        | Result  |
 * | ------------ | ------- |
 * | `{}`         | `true`  |
 * | `[]`         | `true`  |
 * | `new Date()` | `true`  |
 * | `new Map()`  | `true`  |
 * | `null`       | `false` |
 * | `undefined`  | `false` |
 * | `() => {}`   | `false` |
 * | `'text'`     | `false` |
 *
 * @param o - The value to be checked.
 * @returns `true` if the value is an object and not `null`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isObject(o: unknown): o is object {
  return o !== null && typeof o === 'object';
}

/**
 * Determines whether the provided value is a plain object.
 *
 * @remarks
 * A plain object is an object created using:
 *
 * - Object literal (`{}`)
 * - `new Object()`
 * - `Object.create(null)`
 *
 * This function returns `false` for arrays, class instances,
 * built-in objects, and special object types.
 *
 * This function only narrows the top-level type and does not
 * validate nested properties.
 *
 * | Value                    | Result  |
 * | ------------------------ | ------- |
 * | `{}`                     | `true`  |
 * | `new Object()`           | `true`  |
 * | `Object.create(null)`    | `true`  |
 * | `[]`                     | `false` |
 * | `new Date()`             | `false` |
 * | `new Map()`              | `false` |
 * | `class A {}; new A()`    | `false` |
 * | `null`                   | `false` |
 * | `undefined`              | `false` |
 *
 * @param o - The value to be checked.
 *
 * @returns `true` if the value is a plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isObject}
 */
export function isPlainObject(o: unknown): o is Record<PropertyKey, unknown> {
  if (!isObject(o)) return false;
  let proto = getProto(o);
  return proto === Object.prototype || proto === null;
}

/**
 * Alias for {@linkcode isPlainObject}.
 *
 * @param o - The value to be checked.
 * @returns `true` if the value is a plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isRecord(o: unknown): o is Record<PropertyKey, unknown> {
  return isPlainObject(o);
}

/**
 * Determines whether the provided value is a record whose entries
 * satisfy the given predicate.
 *
 * @remarks
 * This function validates both the property keys and values of an object
 * using a custom predicate callback.
 *
 * By default, only enumerable string keys are checked using `Object.keys()`.
 * When `includeHidden` is enabled, all own property keys are inspected
 * using `Reflect.ownKeys()`, including:
 *
 * - non-enumerable properties
 * - symbol keys
 *
 * The predicate receives:
 *
 * - the current property key
 * - the associated property value
 *
 * and must return whether the value satisfies the expected type.
 *
 * @example
 * Validate a record of strings:
 *
 * ```typescript
 * isRecordOf(
 *   { a: 'hello', b: 'world' },
 *   (_k, v): v is string => isString(v)
 * ); // true
 * ```
 *
 * Validate key-sensitive values:
 *
 * ```typescript
 * isRecordOf(
 *   { port: 3000 },
 *   (k, v): v is number => {
 *     return k === 'port' && isNumber(v);
 *   }
 * );
 * ```
 *
 * Include non-enumerable and symbol keys:
 *
 * ```typescript
 * const obj = Object.defineProperty(
 *   { [Symbol('id')]: 123 },
 *   'hidden',
 *   {
 *     value: 456,
 *     enumerable: false,
 *   }
 * );
 *
 * isRecordOf(obj, (_k, v): v is number => {
 *   return isNumber(v);
 * }, true);
 * ```
 *
 * @param o - The value to validate.
 * @param predicate - A predicate used to validate each entry value.
 * @param includeHidden - Whether to include non-enumerable and symbol keys.
 *
 * @returns `true` if all entries satisfy the predicate, otherwise `false`.
 *
 * @since 1.1.0
 * @see   {@link isRecord}
 */
export function isRecordOf<K extends PropertyKey, V>(
  o: unknown,
  predicate: Predicate<K, V>,
  includeHidden?: boolean
): o is Record<K, V> {
  if (!isRecord(o)) return false;

  const keys = (includeHidden ? Reflect.ownKeys(o) : Object.keys(o)) as K[];
  for (const key of keys) {
    const value = (o as Record<PropertyKey, unknown>)[key];

    if (!predicate(key, value)) return false;
  }

  return true;
}

/**
 * Determines whether the provided value is an empty plain object.
 *
 * @remarks
 * A value is considered empty if it is a plain object with no own
 * enumerable string-keyed properties.
 *
 * For checking an empty array, consider use
 * {@linkcode builtins.array.isEmptyArray | isEmptyArray}.
 *
 * Non-enumerable and symbol properties are not considered.
 *
 * | Value                         | Result |
 * | ----------------------------- | ------ |
 * | `{}`                          | `true` |
 * | `{ a: 1 }`                    | `false`|
 * | `Object.create(null)`         | `true` |
 * | `[]`                          | `false`|
 * | `new Date()`                  | `false`|
 * | `{ [Symbol('a')]: 1 }`        | `true` |
 *
 * @param o - The value to be checked.
 * @returns `true` if the value is an empty plain object.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isEmptyObject(o: unknown): boolean {
  if (!isPlainObject(o)) return false;
  return Object.keys(o).length === 0;
}

/**
 * Determines whether the provided value is a sealed object.
 *
 * **Important Note:**\
 * Empty objects (`{}`) that are made non-extensible (via `Object.preventExtensions`)
 * are also considered sealed, since there are no properties that violate the constraint.
 *
 * @remarks
 * A sealed object is an object whose properties:
 * - cannot be added or removed
 * - cannot be reconfigured
 *
 * However, existing property values may still be changed if they are writable.
 *
 * This function only returns `true` for actual object values. It avoids the
 * coercion behavior of `Object.isSealed`, which returns `true` for all
 * non-object (primitive) values.
 *
 * In contrast, `Object.isSealed` treats primitives such as `null`,
 * `undefined`, numbers, and strings as already sealed, which can lead
 * to misleading results when performing runtime validation.
 *
 * | Value                 | Result  | `Object.isSealed()` |
 * | --------------------- | ------- | ------------------- |
 * | `Object.freeze( {} )` | `true`  | `true`              |
 * | `Object.freeze( [] )` | `true`  | `true`              |
 * | `Object.seal( {} )`   | `true`  | `true`              |
 * | `Object.seal( [] )`   | `true`  | `true`              |
 * | `{}`                  | `false` | `false`             |
 * | `[]`                  | `false` | `false`             |
 * | `new Date()`          | `false` | `false`             |
 * | `null`                | `false` | `true`              |
 * | `undefined`           | `false` | `true`              |
 * | `123`                 | `false` | `true`              |
 * | `'text'`              | `false` | `true`              |
 *
 * @typeParam T - The type of the input value.
 * @param     o - The value to be checked.
 *
 * @returns `true` if the value is a sealed object, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isSealed<T extends object>(o: T): o is T {
  if (!isObject(o)) return false;
  return Object.isSealed(o);
}

/**
 * Determines whether the provided value is an extensible object.
 *
 * @remarks
 * An extensible object is an object to which new properties can be added.
 *
 * This function only returns `true` for actual object values. It avoids the
 * coercion behavior of `Object.isExtensible`, which returns `false` for all
 * non-object (primitive) values.
 *
 * | Value                  | Result | `Object.isExtensible` |
 * | ---------------------- | ------ | --------------------- |
 * | `Object.seal( {} )`    | `false`| `false`               |
 * | `Object.freeze( {} )`  | `false`| `false`               |
 * | `{}`                   | `true` | `true`                |
 * | `[]`                   | `true` | `true`                |
 * | `null`                 | `false`| `false`               |
 * | `undefined`            | `false`| `false`               |
 * | `123`                  | `false`| `false`               |
 *
 * @typeParam T - The type of the input value.
 * @param     o - The value to be checked.
 *
 * @returns `true` if the value is an extensible object, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isExtensible<T extends object>(o: unknown): o is T {
  if (!isObject(o)) return false;
  return Object.isExtensible(o);
}

/**
 * Determines whether the provided value is a frozen object.
 *
 * **Important Note:**\
 * JavaScript considers an object "frozen" if it is non-extensible and all of its
 * properties are non-configurable and non-writable.
 *
 * This leads to a subtle edge case:
 * - An empty object (`{}`) that is sealed or made non-extensible is also
 *   considered frozen, even if `Object.freeze` was never called.
 *
 * @remarks
 * A frozen object is an object whose properties:
 * - cannot be added or removed
 * - cannot be reconfigured
 * - cannot be reassigned (all properties are effectively read-only)
 *
 * This function only returns `true` for actual object values. It avoids the
 * coercion behavior of `Object.isFrozen`, which returns `true` for all
 * non-object (primitive) values.
 *
 * | Value                  | Result | `Object.isFrozen` |
 * | ---------------------- | ------ | ----------------- |
 * | `Object.freeze( {} )`  | `true` | `true`            |
 * | `Object.seal( {} )`    | `true` | `true`            |
 * | `{}`                   | `false`| `false`           |
 * | `[]`                   | `false`| `false`           |
 * | `null`                 | `false`| `true`            |
 * | `undefined`            | `false`| `true`            |
 * | `123`                  | `false`| `true`            |
 *
 * @typeParam T - The type of the input value.
 * @param     o - The value to be checked.
 *
 * @returns `true` if the value is a frozen object, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isFrozen<T extends object>(o: unknown): o is Readonly<T> {
  if (!isObject(o)) return false;
  return Object.isFrozen(o);
}
