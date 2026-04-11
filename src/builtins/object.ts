/**
 * This module provides type guards for built-in objects.
 *
 * @module   builtins.object
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { getProto } from '../internal/utils';

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
