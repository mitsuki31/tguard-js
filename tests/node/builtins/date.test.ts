import {
  isDate,
  isDateString,
  isISODateString,
  isValidDate,
} from '../../../src/builtins/date';

describe('builtins/date', () => {
  //#region isDate

  describe('isDate', () => {
    test('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2026-04-10'))).toBe(true);
      expect(isDate(new Date(0))).toBe(true);
    });

    test('should return true for invalid Date objects', () => {
      expect(isDate(new Date('invalid'))).toBe(true);
      expect(isDate(new Date(NaN))).toBe(true);
    });

    test('should return false for timestamps', () => {
      expect(isDate(Date.now())).toBe(false);
      expect(isDate(0)).toBe(false);
    });

    test('should return false for ISO date strings', () => {
      expect(isDate(new Date().toISOString())).toBe(false);
      expect(isDate('2026-04-10')).toBe(false);
    });

    test('should return false for date-like objects', () => {
      expect(isDate({ getTime: () => 0 })).toBe(false);
    });

    test('should return false for non-dates', () => {
      expect(isDate({})).toBe(false);
      expect(isDate([])).toBe(false);
      expect(isDate('text')).toBe(false);
      expect(isDate(123)).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isValidDate

  describe('isValidDate', () => {
    test('should return true for valid Date objects', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date(0))).toBe(true);
      expect(isValidDate(new Date('2026-04-10'))).toBe(true);
    });

    test('should return false for invalid Date objects', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate(new Date(NaN))).toBe(false);
    });

    test('should return false for timestamps', () => {
      expect(isValidDate(Date.now())).toBe(false);
      expect(isValidDate(0)).toBe(false);
    });

    test('should return false for non-dates', () => {
      expect(isValidDate({})).toBe(false);
      expect(isValidDate('2026-04-10')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isISODateString

  describe('isISODateString', () => {
    test('should return true for valid ISO date strings (non-strict)', () => {
      expect(isISODateString('2026-04-10T12:00:00Z')).toBe(true);
      expect(isISODateString('2026-04-10T12:00:00+07:00')).toBe(true);
      expect(isISODateString(new Date().toISOString())).toBe(true);
    });

    test('should return true for ISO date strings with partial time (non-strict)', () => {
      expect(isISODateString('2026-04-10T12:00:00')).toBe(true);
      expect(isISODateString('2026-04-10T')).toBe(true);
    });

    test('should return false for valid ISO date strings (strict mode)', () => {
      expect(isISODateString('2026-04-10T', true)).toBe(false);
      expect(isISODateString('2026-04-10T-foo', true)).toBe(false);
    });

    test('should return true for strictly valid ISO date strings (strict mode)', () => {
      expect(isISODateString('2026-04-10T12:00:00Z', true)).toBe(true);
      expect(isISODateString('2026-04-10T12:00:00+07:00', true)).toBe(true);
      expect(isISODateString('2026-04-10T12:00:00.123Z', true)).toBe(true);
      expect(isISODateString(new Date().toISOString(), true)).toBe(true);
    });

    test('should return false for non-ISO date strings', () => {
      expect(isISODateString('2026-04-10')).toBe(false);
      expect(isISODateString('invalid-date')).toBe(false);
      expect(isISODateString('April 10, 2026')).toBe(false);
    });

    test('should return false for non-strings', () => {
      expect(isISODateString(123)).toBe(false);
      expect(isISODateString(new Date())).toBe(false);
      expect(isISODateString(null)).toBe(false);
      expect(isISODateString(undefined)).toBe(false);
    });
  });

  //#endregion
  //#region isDateString

  describe('isDateString', () => {
    test('should return true for ISO date strings', () => {
      expect(isDateString('2026-04-10T12:00:00Z')).toBe(true);
      expect(isDateString(new Date().toISOString())).toBe(true);
    });

    test('should return true for parseable date strings', () => {
      expect(isDateString('2026-04-10')).toBe(true);
      expect(isDateString('April 10, 2026')).toBe(true);
      expect(isDateString('04/10/2026')).toBe(true);
    });

    test('should return false for non-parseable date strings', () => {
      expect(isDateString('invalid')).toBe(false);
      expect(isDateString('not a date')).toBe(false);
    });

    test('should return false for non-strings', () => {
      expect(isDateString(123)).toBe(false);
      expect(isDateString(new Date())).toBe(false);
      expect(isDateString(null)).toBe(false);
      expect(isDateString(undefined)).toBe(false);
    });
  });

  //#endregion
});
