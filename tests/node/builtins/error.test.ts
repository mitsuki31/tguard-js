// ! Developer note:
// ! Keep imports and test cases sorted alphabetically to keep organized and easy to maintain.

import {
  ensureError,
  hasErrorMessage,
  isError,
  isErrorLike,
  isRangeError,
  isReferenceError,
  isSyntaxError,
  isTypeError,
  normalizeError,
} from '../../../src/builtins/error';

describe('builtins/error', () => {
  //#region ensureError

  describe('ensureError', () => {
    test('should be an alias for normalizeError', () => {
      const error = new Error('message');
      expect(ensureError(error)).toMatchObject(error);
    });

    test('should convert error-like objects to Error', () => {
      const errorLike = { message: 'custom message' };
      const result = ensureError(errorLike);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toStrictEqual('custom message');
    });

    test('should convert strings to Error', () => {
      const result = ensureError('error message');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toStrictEqual('error message');
    });
  });

  //#endregion
  //#region hasErrorMessage

  describe('hasErrorMessage', () => {
    test('should return true for Error objects', () => {
      expect(hasErrorMessage(new Error('msg'))).toBe(true);
      expect(hasErrorMessage(new TypeError('msg'))).toBe(true);
    });

    test('should return true for objects with string message property', () => {
      expect(hasErrorMessage({ message: 'msg' })).toBe(true);
    });

    test('should return false for objects without string message', () => {
      expect(hasErrorMessage({})).toBe(false);
      expect(hasErrorMessage({ message: 123 })).toBe(false);
    });

    test('should return false for non-objects', () => {
      expect(hasErrorMessage('error')).toBe(false);
      expect(hasErrorMessage(null)).toBe(false);
    });
  });

  //#endregion
  //#region isError

  describe('isError', () => {
    test('should return true for Error objects', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new Error('message'))).toBe(true);
    });

    test('should return true for Error subclasses', () => {
      expect(isError(new TypeError())).toBe(true);
      expect(isError(new RangeError())).toBe(true);
      expect(isError(new ReferenceError())).toBe(true);
      expect(isError(new SyntaxError())).toBe(true);
    });

    test('should return false for error-like objects', () => {
      expect(isError({ message: 'error' })).toBe(false);
    });

    test('should return false for non-errors', () => {
      expect(isError('error')).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError([])).toBe(false);
      expect(isError(123)).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isErrorLike

  describe('isErrorLike', () => {
    test('should return true for Error objects', () => {
      expect(isErrorLike(new Error('msg'))).toBe(true);
      expect(isErrorLike(new TypeError('msg'))).toBe(true);
    });

    test('should return true for objects with string message property', () => {
      expect(isErrorLike({ message: 'msg' })).toBe(true);
      expect(isErrorLike({ message: '', other: 'prop' })).toBe(true);
    });

    test('should return false for objects with non-string message', () => {
      expect(isErrorLike({ message: 123 })).toBe(false);
      expect(isErrorLike({ message: null })).toBe(false);
      expect(isErrorLike({ message: undefined })).toBe(false);
    });

    test('should return false for objects without message property', () => {
      expect(isErrorLike({})).toBe(false);
      expect(isErrorLike({ error: 'msg' })).toBe(false);
    });

    test('should return false for non-objects', () => {
      expect(isErrorLike('error')).toBe(false);
      expect(isErrorLike(123)).toBe(false);
      expect(isErrorLike(null)).toBe(false);
      expect(isErrorLike(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isRangeError

  describe('isRangeError', () => {
    test('should return true for RangeError objects', () => {
      expect(isRangeError(new RangeError())).toBe(true);
      expect(isRangeError(new RangeError('message'))).toBe(true);
    });

    test('should return false for other error types', () => {
      expect(isRangeError(new Error())).toBe(false);
      expect(isRangeError(new TypeError())).toBe(false);
    });

    test('should return false for non-errors', () => {
      expect(isRangeError({ message: 'error' })).toBe(false);
      expect(isRangeError('error')).toBe(false);
    });
  });

  //#endregion
  //#region isReferenceError

  describe('isReferenceError', () => {
    test('should return true for ReferenceError objects', () => {
      expect(isReferenceError(new ReferenceError())).toBe(true);
      expect(isReferenceError(new ReferenceError('message'))).toBe(true);
    });

    test('should return false for other error types', () => {
      expect(isReferenceError(new Error())).toBe(false);
      expect(isReferenceError(new TypeError())).toBe(false);
    });

    test('should return false for non-errors', () => {
      expect(isReferenceError({ message: 'error' })).toBe(false);
      expect(isReferenceError('error')).toBe(false);
    });
  });

  //#endregion
  //#region isSyntaxError

  describe('isSyntaxError', () => {
    test('should return true for SyntaxError objects', () => {
      expect(isSyntaxError(new SyntaxError())).toBe(true);
      expect(isSyntaxError(new SyntaxError('message'))).toBe(true);
    });

    test('should return false for other error types', () => {
      expect(isSyntaxError(new Error())).toBe(false);
      expect(isSyntaxError(new TypeError())).toBe(false);
    });

    test('should return false for non-errors', () => {
      expect(isSyntaxError({ message: 'error' })).toBe(false);
      expect(isSyntaxError('error')).toBe(false);
    });
  });

  //#endregion
  //#region isTypeError

  describe('isTypeError', () => {
    test('should return true for TypeError objects', () => {
      expect(isTypeError(new TypeError())).toBe(true);
      expect(isTypeError(new TypeError('message'))).toBe(true);
    });

    test('should return false for other error types', () => {
      expect(isTypeError(new Error())).toBe(false);
      expect(isTypeError(new RangeError())).toBe(false);
    });

    test('should return false for non-errors', () => {
      expect(isTypeError({ message: 'error' })).toBe(false);
      expect(isTypeError('error')).toBe(false);
    });
  });

  //#endregion
  //#region normalizeError

  describe('normalizeError', () => {
    test('should return the same Error object if already an Error', () => {
      const error = new Error('message');
      const actual = normalizeError(error);
      expect(actual).toBeInstanceOf(Error);
      expect(actual).toMatchObject(error);
    });

    test('should convert error-like objects to Error', () => {
      const errorLike = { message: 'custom message' };
      const result = normalizeError(errorLike);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('custom message');
    });

    test('should preserve stack trace from error-like objects', () => {
      const errorLike = { message: 'msg', stack: 'custom stack' };
      const result = normalizeError(errorLike);
      expect(result.stack).toStrictEqual('custom stack');
    });

    test('should attach original value as cause', () => {
      const errorLike = { message: 'msg' };
      const result = normalizeError(errorLike);
      expect((result as any).cause).toMatchObject(errorLike);
    });

    test('should convert strings to Error', () => {
      const result = normalizeError('error message');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toStrictEqual('error message');
    });

    test('should convert numbers to Error', () => {
      const result = normalizeError(123);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toMatch(/unknown error/i);
    });

    test('should convert null to Error', () => {
      const result = normalizeError(null);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toMatch(/unknown error/i);
    });

    test('should convert undefined to Error', () => {
      const result = normalizeError(undefined);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toMatch(/unknown error/i);
    });

    test('should handle objects that cannot be stringified', () => {
      const circular: any = {};
      circular.self = circular;
      const result = normalizeError(circular);
      expect(result).toBeInstanceOf(Error);
      // Should not throw on circular reference
    });

    test('should return "Unknown error" for objects that cannot be stringified', () => {
      const obj = {
        toString() {
          return {};
        },
        valueOf() {
          return {};
        },
      };
      const result = normalizeError(obj);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toMatch(/unknown error/i);
    });
  });

  //#endregion
});
