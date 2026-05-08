/**
 * Contains shared utilities for internal use only.
 *
 * @module    internal.utils
 * @author    Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license   MIT
 * @since     1.0.0
 */

/**
 * A cached reference to `Object.prototype.toString`.
 *
 * @private
 */
export const toString = Object.prototype.toString;

/**
 * A cached reference to `Function.prototype.toString`.
 *
 * @private
 */
export const toStringFunc = Function.prototype.toString;

/**
 * A cached reference to `Object.getPrototypeOf`.
 *
 * @private
 */
export const getProto = Object.getPrototypeOf;

/**
 * Attaches the original thrown value to an error instance using the
 * `cause` property.
 *
 * @remarks
 * This utility normalizes error chaining across runtimes by assigning
 * the original value directly to `err.cause`.
 *
 * Unlike the native `ErrorOptions` constructor support introduced in
 * newer ECMAScript environments, this function performs a direct
 * property assignment:
 *
 * ```ts
 * err.cause = original;
 * ```
 *
 * This approach remains compatible with older runtimes such as
 * Node.js v14+, where `Error.prototype.cause` is not natively defined,
 * because JavaScript allows dynamic property assignment on extensible
 * objects.
 *
 * If the error object is non-extensible (for example, frozen or sealed),
 * the assignment may fail silently.
 *
 * In summary, this function can be an altenative way to attaching cause
 * for error in older environments (Node.js <16.9).
 *
 * @private
 *
 * @param err - The error instance to attach the cause to.
 * @param original - The original thrown value or underlying cause.
 */
export function attachCause(err: Error, original: unknown): void {
  try {
    (err as Error & { cause?: unknown }).cause = original;
  } catch {
    // no throw: Ignore for non-extensible errors
  }
}
