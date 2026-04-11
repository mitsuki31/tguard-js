/**
 * This module provides type guards for `Error` and its subclasses.
 *
 * @module   builtins.error
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

import { attachCause, toString } from '../internal/utils';
import { isObject } from './object';
import { isString } from './primitive';

/**
 * Determines whether the provided value is an `Error` object.
 *
 * @remarks
 * This function checks whether a value is an instance of `Error` or
 * matches the internal `[[Class]]` tag of `[object Error]`.
 *
 * This ensures compatibility across realms (e.g., iframes).
 *
 * | Value                  | Result |
 * | ---------------------- | ------ |
 * | `new Error()`          | `true` |
 * | `new TypeError()`      | `true` |
 * | `{ message: 'err' }`   | `false`|
 * | `'error'`              | `false`|
 * | `null`                 | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is an `Error` object, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isError(x: unknown): x is Error {
  return x instanceof Error || toString.call(x) === '[object Error]';
}

/**
 * Determines whether the provided value is error-like.
 *
 * @remarks
 * A value is considered error-like if it is an object containing
 * a string `message` property.
 *
 * This is useful when handling errors from external sources where
 * thrown values may not be actual `Error` instances.
 *
 * | Value                        | Result |
 * | ---------------------------- | ------ |
 * | `new Error('msg')`           | `true` |
 * | `{ message: 'msg' }`         | `true` |
 * | `{ message: 123 }`           | `false`|
 * | `'error'`                    | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is error-like, otherwise `false`.
 *
 * @since 1.0.0
 */
export function isErrorLike(x: unknown): x is { message: string } {
  return isObject(x) && 'message' in x && isString((x as any).message);
}

//#region Subclasses

/**
 * Determines whether the provided value is a `TypeError`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `TypeError`.
 *
 * @since 1.0.0
 */
export function isTypeError(x: unknown): x is TypeError {
  return x instanceof TypeError;
}

/**
 * Determines whether the provided value is a `RangeError`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `RangeError`.
 *
 * @since 1.0.0
 */
export function isRangeError(x: unknown): x is RangeError {
  return x instanceof RangeError;
}

/**
 * Determines whether the provided value is a `ReferenceError`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `ReferenceError`.
 *
 * @since 1.0.0
 */
export function isReferenceError(x: unknown): x is ReferenceError {
  return x instanceof ReferenceError;
}

/**
 * Determines whether the provided value is a `SyntaxError`.
 *
 * @param x - The value to be checked.
 * @returns `true` if the value is a `SyntaxError`.
 *
 * @since 1.0.0
 */
export function isSyntaxError(x: unknown): x is SyntaxError {
  return x instanceof SyntaxError;
}

//#endregion
//#region Helpers

/**
 * Determines whether the provided value has a usable error message.
 *
 * @remarks
 * This function is useful when logging or displaying error messages
 * safely from unknown values.
 *
 * | Value                  | Result |
 * | ---------------------- | ------ |
 * | `new Error('msg')`     | `true` |
 * | `{ message: 'msg' }`   | `true` |
 * | `{}`                   | `false`|
 *
 * @param x - The value to be checked.
 * @returns `true` if the value contains a string `message`.
 *
 * @since 1.0.0
 */
export function hasErrorMessage(x: unknown): x is { message: string } {
  return isErrorLike(x);
}

/**
 * Normalizes an unknown value into an `Error` instance.
 *
 * @remarks
 * This function converts any thrown value into a proper `Error` object.
 * It preserves the original message when possible and attaches the
 * original value for debugging purposes.
 *
 * Behavior:
 * - If the value is already an `Error`, it is returned as-is
 * - If the value is error-like (`{ message: string }`), it is converted
 * - Otherwise, the value is stringified into an error message
 *
 * The original value is attached to the returned error as `cause`
 * (if supported) or as a fallback `_cause` property (for older environments).
 *
 * If there is a stack trace in the provided value, it will be preserved.
 *
 * | Input                        | Output message        |
 * | ---------------------------- | --------------------- |
 * | `new Error('msg')`           | `'msg'`               |
 * | `{ message: 'msg' }`         | `'msg'`               |
 * | `'error'`                    | `'error'`             |
 * | `123`                        | `'123'`               |
 * | `null`                       | `'null'`              |
 * | `undefined`                  | `'undefined'`         |
 *
 * @param x - The value to normalize.
 * @returns A normalized `Error` instance.
 *
 * @example
 * ```typescript
 * try {
 *   throw { message: 'Something went wrong' };
 * } catch (err) {
 *   const error = normalizeError(err);
 *   console.log(error.message); // 'Something went wrong'
 *   console.log(error.cause || error._cause); // { message: 'Something went wrong' }
 * }
 * ```
 *
 * @since 1.0.0
 * @see   {@link isError}
 * @see   {@link isErrorLike}
 */
export function normalizeError(x: unknown): Error {
  // 1. Already an Error -> return as-is
  if (isError(x)) return x;

  // 2. Error-like object -> use message
  if (isErrorLike(x)) {
    const err = new Error(x.message);
    // Preserve stack trace
    if ('stack' in x) {
      const stack = (x as any).stack;
      if (typeof stack === 'string') err.stack = stack;
    }

    attachCause(err, x);
    return err;
  }

  // 3. Fallback: stringify
  let message: string;
  try {
    message = String(x);
  } catch {
    message = '[Unknown error]';
  }

  const err = new Error(message);

  attachCause(err, x);
  return err;
}

/**
 * Ensures that the provided value is an `Error` instance.
 *
 * @remarks
 * This function is a convenience wrapper around {@linkcode normalizeError}.
 * It converts any thrown value into a proper `Error` object.
 *
 * @param x - The value to ensure is an `Error`.
 * @returns A normalized `Error` instance.
 *
 * @example
 * ```typescript
 * try {
 *   throw { message: 'Something went wrong' };
 * } catch (err) {
 *   const error = ensureError(err);
 *   console.log(error.message); // 'Something went wrong'
 *   console.log(error.cause || error._cause); // { message: 'Something went wrong' }
 * }
 * ```
 *
 * @since 1.0.0
 * @see   {@link normalizeError}
 */
export function ensureError(x: unknown): Error {
  return normalizeError(x);
}

//#endregion
