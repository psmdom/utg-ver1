/**
 * letter.js — Manages Uyghur Letters and Corresponding Image Paths
 * 
 * Defines the set of Uyghur letters used in the game, associates each letter
 * with its corresponding image filename, and provides utility functions
 * to retrieve image paths for each letter.
 */

/**
 * Base directory path where letter images are stored.
 */
const IMAGE_BASE_PATH = '/images/letter';

/**
 * Array of Uyghur letters used in the game.
 * Letters correspond to individual image files for display.
 * Uncomment any letter whose image asset is not yet ready.
 */
const LETTERS = [
  'ب', 'پ', 'ت', 'ج', 'چ', 'خ', 'د', 'ر', 'ز', 'ژ', 'س', 'ش',
  'غ', 'ف', 'ق', 'ك', 'گ', 'ڭ', 'م', 'ن', 'ھ', 'ي', 'ا',
  'و', 'ۇ', 'ۆ', 'ۈ', 'ې', 'ى', 'ۋ',
  // 'ە' // Uncomment when image is ready
];

/**
 * Maps each letter to its image filename.
 * Constructed dynamically from LETTERS
 * Example: { 'ب': 'ب.png', 'پ': 'پ.png', ... }
 */
export const letterMap = LETTERS.reduce((acc, letter) => {
  acc[letter] = `${letter}.png`;
  return acc;
}, {});

/**
 * Returns the full image path for a given letter character.
 * @param {string} char - The letter character to get the image for.
 * @returns {string|null} - The full path to the letter's image file, or null if none exists.
 */
export const getLetterImagePath = (char) => {
  const filename = letterMap[char];
  return filename ? `${IMAGE_BASE_PATH}/${filename}` : null;
};

/**
 * Exported array of all letters for external use.
 */
export const allLetters = [...LETTERS];
