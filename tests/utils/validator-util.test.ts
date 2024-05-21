import { validateUrl } from '../../src/utils';

describe('validateUrl', () => {
    it('should return true for a valid URL', () => {
        // Act
        const validUrl = 'https://www.example.com';

        // Assert
        expect(validateUrl(validUrl)).toBe(true);
    });

    it('should return false for an invalid URL', () => {
        // Act
        const invalidUrl = 'invalidurl.com';

        // Assert
        expect(validateUrl(invalidUrl)).toBe(false);
    });

    it('should return false for a URL containing "undefined"', () => {
        // Act
        const urlWithUndefined = 'https://www.example.com/undefined';

        // Assert
        expect(validateUrl(urlWithUndefined)).toBe(false);
    });
});
