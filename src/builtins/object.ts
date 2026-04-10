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
 * This function does NOT check whether a value is a plain object (`{}`).
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
 * @param x - The value to be checked.
 * @returns `true` if the value is an object and not `null`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isObject(x: unknown): x is object {
  return x !== null && typeof x === 'object';
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
 * | Value                    | Result |
 * | ------------------------ | ------ |
 * | `{}`                     | `true` |
 * | `new Object()`           | `true` |
 * | `Object.create(null)`    | `true` |
 * | `[]`                     | `false`|
 * | `new Date()`             | `false`|
 * | `new Map()`              | `false`|
 * | `class A {}; new A()`    | `false`|
 * | `null`                   | `false`|
 * | `undefined`              | `false`|
 * | `() => ({})`             | `true` |
 *
 * @param x - The value to be checked.
 *
 * @returns `true` if the value is a plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isObject}
 */
export function isPlainObject(x: unknown): x is Record<PropertyKey, unknown> {
  if (!isObject(x)) return false;
  let proto = getProto(x);
  return proto === Object.prototype || proto === null;
}

/**
 * Alias for {@linkcode isPlainObject}.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isRecord(x: unknown): x is Record<PropertyKey, unknown> {
  return isPlainObject(x);
}

/**
 * Determines whether the provided value is an empty plain object.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an empty plain object, otherwise `false`.
 *
 * @since 1.0.0
 * @see   {@link isPlainObject}
 */
export function isEmptyObject(x: unknown): boolean {
  return isPlainObject(x) && Object.keys(x).length === 0;
}
