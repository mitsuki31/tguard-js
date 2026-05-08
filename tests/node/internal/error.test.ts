import { createError } from "../../../src/internal/error";

type FutureError<C = unknown> = Error & { cause: C };

describe('internal/error', () => {
  const OriginalError = global.Error;

  // To mock inbuilt Error, don't try to use jest.fn()
  // that can breaks `instanceof` for errors
  // Simply override `global.Error` with this class
  class LegacyError extends OriginalError {
    constructor(message?: string) {
      super(message);

      // Simulate old runtime:
      // ignore ErrorOptions completely
    }
  }

  describe('createError', () => {
    afterEach(() => {
      global.Error = OriginalError;
    });

    test('should create an Error instance', () => {
      const err = createError('test');

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('test');
    });

    test('should create error without cause', () => {
      const err = createError('test');

      expect(err.message).toBe('test');
      expect('cause' in err).toBe(false);
    });

    test('should attach string cause', () => {
      const err = createError('test', 'cause') as FutureError<string>;

      expect(err.message).toBe('test');
      expect(err.cause).toBe('cause');
    });

    test('should attach object cause', () => {
      const cause = { foo: 'bar' };
      const err = createError('test', cause) as FutureError<typeof cause>;

      expect(err.cause).toMatchObject(cause);
    });

    test('should attach Error as cause', () => {
      const cause = new Error('inner');
      const err = createError('outer', cause) as FutureError<typeof cause>;

      expect(err.cause).toBe(cause);
    });

    test('should attach null as cause', () => {
      const err = createError('test', null) as FutureError<null>;

      expect(err.cause).toBeNull();
    });

    test('should attach undefined as explicit cause', () => {
      const err = createError('test', undefined) as FutureError;

      expect('cause' in err).toBe(true);
      expect(err.cause).toBeUndefined();
    });

    test('should preserve stack trace', () => {
      const err = createError('test');

      expect(typeof err.stack).toBe('string');
      expect(err.stack).toContain('Error: test');
    });

    test('should create writable cause property', () => {
      const err = createError('test', 'foo') as FutureError<string>;
      err.cause = 'bar';

      expect(err.cause).toBe('bar');
    });

    test('should overwrite existing cause property', () => {
      const err = createError('test', 'foo') as FutureError<string>;
      err.cause = 'bar';

      expect(err.cause).toBe('bar');
    });

    test('should fallback to attachCause when native cause is unsupported', () => {
      global.Error = LegacyError as ErrorConstructor;

      const err = createError('test', 'legacy-cause') as FutureError<string>;

      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('test');

      // Fallback should attach manually
      expect(err.cause).toBe('legacy-cause');
    });

    test('should not attach cause when omitted in legacy runtime', () => {
      global.Error = LegacyError as ErrorConstructor;

      const err = createError('test');

      expect(
        Object.prototype.hasOwnProperty.call(err, 'cause')
      ).toBe(false);
    });

    test('should preserve explicit undefined cause in legacy runtime', () => {
      global.Error = LegacyError as ErrorConstructor;

      const err = createError('test', undefined) as FutureError;

      expect(
        Object.prototype.hasOwnProperty.call(err, 'cause')
      ).toBe(true);
      expect(err.cause).toBeUndefined();
    });
  });
});
