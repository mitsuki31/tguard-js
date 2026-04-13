import { attachCause } from '../../../src/internal/utils';

describe('internal/utils', () => {
  //#region attachCause

  describe('attachCause', () => {
    test('should attach cause property if supported', () => {
      const error = new Error('test');
      const cause = new Error('cause');
      attachCause(error, cause);

      // Should have either cause or _cause property
      const actualCause = (error as any).cause || (error as any)._cause;
      expect(actualCause).toMatchObject(cause);
    });

    test('should handle non-Error values as cause', () => {
      const error = new Error('test');
      const cause = { message: 'error-like' };
      attachCause(error, cause);

      const actualCause = (error as any).cause || (error as any)._cause;
      expect(actualCause).toMatchObject(cause);
    });

    test('should attach string cause', () => {
      const error = new Error('test');
      attachCause(error, 'string cause');

      const actualCause = (error as any).cause || (error as any)._cause;
      expect(actualCause).toStrictEqual('string cause');
    });

    test('should attach null as cause', () => {
      const error = new Error('test');
      attachCause(error, null);

      const actualCause = (error as any).cause || (error as any)._cause;
      expect(actualCause).toBeNull();
    });

    test('should attach undefined as cause', () => {
      const error = new Error('test');
      attachCause(error, undefined);

      const actualCause = (error as any).cause || (error as any)._cause;
      expect(actualCause).toBeUndefined();
    });

    test('should not preserve existing cause property', () => {
      const error = new Error('test');
      const cause = new Error('cause');
      (error as any).cause = cause;
      attachCause(error, new Error('new cause'));

      const actualCause = (error as any).cause || (error as any)._cause;
      expect(actualCause).toMatchObject(cause);
    });
  });

  //#endregion
});
