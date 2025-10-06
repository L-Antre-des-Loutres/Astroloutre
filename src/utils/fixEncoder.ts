/**
 * Attempts to fix improperly encoded strings by decoding them.
 * This function assumes the input string might be incorrectly encoded
 * and tries to convert it to a correctly encoded format. If decoding fails,
 * it returns the original string.
 *
 * @param {string} str - The string to be checked and fixed for encoding issues.
 * @return {string} The fixed string with proper encoding, or the original string if decoding fails.
 */

export function fixEncoding(str: string) {
    try {
        return decodeURIComponent(escape(str));
    } catch {
        return str;
    }
}