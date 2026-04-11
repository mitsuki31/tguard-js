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
 * Attaches the original value to the error as `cause` or `_cause`.
 *
 * @remarks
 * For newer environments (Node 16+, modern browsers), it uses the `cause` property.
 * Otherwise, it uses the `_cause` property.
 *
 * @private
 * @param err - The error to attach the cause to.
 * @param original - The original value to attach.
 */
export function attachCause(err: Error, original: unknown): void {
  // Modern environments (Node 16+, modern browsers)
  try {
    if ('cause' in Error.prototype) {
      (err as Error & { cause?: unknown }).cause = original;
      return;
    }
  } catch {
    /* no throw */
  }

  // Fallback for older environments
  (err as Error & { _cause?: unknown })._cause = original;
}
