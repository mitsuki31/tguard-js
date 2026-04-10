/**
 * @module   envs.env
 * @author   Ryuu Mitsuki (https://github.com/mitsuki31)
 * @license  MIT
 * @since    1.0.0
 */

/**
 * Checks if an environment variable is defined and has a non-empty string value.
 *
 * @remarks
 * This function is specifically designed for checking `process.env` variables.
 * An environment variable is considered "defined" if it exists (is not `undefined`)
 * and its value is a non-empty string. An empty string (`""`) is treated as
 * "not defined" in this context, as is common for environment flags.
 *
 * @param envVar - The environment variable value to check.
 * @returns `true` if the given environment variable is a non-empty string, otherwise `false`.
 *
 * @example
 * ```bash
 * # Setting environment variables
 * env SOME_VAR="hello"
 * env EMPTY_VAR=""
 * ```
 *
 * Now, we can use `isEnvDefined` to check if an environment variable is defined
 * and has a non-empty string value.
 *
 * ```typescript
 * // Checking environment variables
 * isEnvDefined(process.env.SOME_VAR);   // true
 * isEnvDefined(process.env.EMPTY_VAR);  // false
 *
 * // Environment variable `UNDEFINED_VAR` is not set yet
 * isEnvDefined(process.env.UNDEFINED_VAR);  // false
 *
 * let myEnvVar: string | undefined = process.env.MY_FLAG;
 * if (isEnvDefined(myEnvVar)) {
 *   // myEnvVar is now safely typed as 'string' in this scope
 *   console.log(`My flag is set to: ${myEnvVar}`);
 * }
 * ```
 *
 * @since 1.0.0
 * @see   {@link isNonNullish} - Use this function to check if a value is "non-nullish".
 */
export function isEnvDefined(envVar: string | undefined): envVar is string {
  return typeof envVar === 'string' && envVar !== '';
}
