/**
 * Converts the first character of the given string to an uppercase letter
 * and returns the modified string.
 *
 * Ex: "hello" -> "Hello"
 *
 * @param {string} str - The input string to process.
 * @return {string} The resulting string with the first character capitalized.
 */

export function CapitalLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}