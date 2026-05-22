// ! Developer note:
// ! Keep imports and test cases sorted alphabetically to keep organized and easy to maintain.

import { isEnvDefined } from '../../../src/envs/env';

describe('envs/env', () => {
  describe('isEnvDefined', () => {
    test('should return true for non-empty strings', () => {
      expect(isEnvDefined('hello')).toBe(true);
      expect(isEnvDefined('0')).toBe(true);
      expect(isEnvDefined('false')).toBe(true);
      expect(isEnvDefined(' ')).toBe(true);
    });

    test('should return false for empty strings', () => {
      expect(isEnvDefined('')).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(isEnvDefined(undefined)).toBe(false);
    });

    test('should return false for non-strings', () => {
      expect(isEnvDefined(null as any)).toBe(false);
      expect(isEnvDefined(123 as any)).toBe(false);
      expect(isEnvDefined(true as any)).toBe(false);
      expect(isEnvDefined([] as any)).toBe(false);
      expect(isEnvDefined({} as any)).toBe(false);
    });

    test('should work with process.env values', () => {
      // Set an environment variable for testing
      const originalValue = process.env.TEST_ENV_VAR;
      try {
        process.env.TEST_ENV_VAR = 'test_value';
        expect(isEnvDefined(process.env.TEST_ENV_VAR)).toBe(true);

        process.env.TEST_ENV_VAR = '';
        expect(isEnvDefined(process.env.TEST_ENV_VAR)).toBe(false);

        delete process.env.TEST_ENV_VAR;
        expect(isEnvDefined(process.env.TEST_ENV_VAR)).toBe(false);
      } finally {
        // Restore original value
        if (originalValue !== undefined) {
          process.env.TEST_ENV_VAR = originalValue;
        } else {
          delete process.env.TEST_ENV_VAR;
        }
      }
    });

    test('should handle multi-line strings', () => {
      expect(isEnvDefined('line1\nline2')).toBe(true);
    });

    test('should handle strings with special characters', () => {
      expect(isEnvDefined('value=123')).toBe(true);
      expect(isEnvDefined('value with spaces')).toBe(true);
      expect(isEnvDefined('value\twith\ttabs')).toBe(true);
    });
  });
});
