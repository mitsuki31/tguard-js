/**
 * This module provides type guards for asynchronous programming.
 *
 * @module   async.promise
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { isObject } from '../builtins/object';

/**
 * Checks if the given value is a `Promise`-like object.
 *
 * @param   x - The value to check.
 * @returns `true` if the value is a `Promise`-like object, otherwise `false`.
 *
 * @since 1.0
 */
export function isPromiseLike(x: unknown): x is PromiseLike<unknown> {
  return isObject(x) && typeof (x as PromiseLike<unknown>).then === 'function';
}

/**
 * Checks if the given value is a `Promise` object.
 *
 * @param   x - The value to check.
 * @returns `true` if the value is a `Promise` object, otherwise `false`.
 *
 * @since 1.0
 */
export function isPromise(x: unknown): x is Promise<unknown> {
  return x instanceof Promise;
}
