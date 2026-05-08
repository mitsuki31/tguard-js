import { attachCause } from './utils';

/**
 * Creates a new `Error` instance with optional error cause attachment.
 *
 * @remarks
 * This utility provides a compatibility layer for environments that do
 * not fully support the ES2022 `ErrorOptions.cause` constructor option.
 *
 * In modern runtimes, the cause is attached natively using:
 *
 * ```ts
 * new Error(message, { cause });
 * ```
 *
 * Older runtimes (such as Node.js v14) silently ignore the second
 * constructor argument. In such cases, this function falls back to
 * manually attaching the cause using {@linkcode attachCause}.
 *
 * The function detects native support by checking whether the created
 * error instance contains its own `cause` property.
 *
 * **NOTE:**
 * The attached `cause` property is enumerable in older runtimes
 * to preserve debugging visibility and compatibility behavior.
 *
 * This differs slightly from native ES2022 `Error.cause`,
 * which defines the property as non-enumerable internally.
 *
 * @private
 *
 * @param message - The error message.
 * @param cause - The underlying cause or original thrown value.
 *
 * @returns A new `Error` instance with normalized cause attachment.
 *
 * @see {@link attachCause}
 */
export function createError(message: string): Error;
export function createError<C>(
  message: string,
  cause: C
): Error & { readonly cause: C };

export function createError(message: string, cause?: unknown): Error {
  let err: Error;

  if (arguments.length >= 2) {
    // @ts-expect-error: Node.js v14 compatibility
    err = new Error(message, { cause });
    const attached = Object.prototype.hasOwnProperty.call(err, 'cause');

    if (!attached) attachCause(err, cause);
    return err;
  }

  return new Error(message);
}
