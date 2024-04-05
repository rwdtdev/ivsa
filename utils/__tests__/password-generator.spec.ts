import { describe, expect, test } from 'vitest';
import { isStrong, generatePasswordAsync } from '../password-generator';

describe('utils:password-generator', () => {
  describe('isStrong function', () => {
    describe('return false if password', () => {
      const testCases = [
        {
          name: 'not contains uppercase char',
          arg: '1a?qwertyui'
        },
        {
          name: 'not contains lowercase char',
          arg: '1A?QWERTYUI'
        },
        {
          name: 'not contains special char',
          arg: '1AaQWERTYUI'
        },
        {
          name: 'not contains number',
          arg: 'bAaQWERTYUI'
        },
        {
          name: 'contains greater then 2 repeat consecutive chars',
          arg: 'bbbA?1aQWERTYUI'
        }
      ];

      testCases.forEach(({ name, arg }) => {
        test(name, () => expect(isStrong(arg)).toBeFalsy());
      });
    });
  });

  describe('generatePasswordAsync function', () => {
    test('not generate password with length less then 12 and greater then 32', async () => {
      const promises = [
        generatePasswordAsync(),
        generatePasswordAsync(),
        generatePasswordAsync()
      ];

      const passwords = await Promise.all(promises);

      passwords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(12);
        expect(password.length).toBeLessThanOrEqual(32);
      });
    });
  });
});
