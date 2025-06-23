// score.js — Handles Score Tracking and UI Updates

const TOTAL_SCORE_KEY = 'uyghurTypingTotalScore';

/**
 * ScoreManager class to track current game score and total score across sessions.
 * Manages score display updates and persistence using localStorage.
 */
export default class ScoreManager {
  /**
   * @param {HTMLElement} displayElement - DOM element where the score is displayed.
   */
  constructor(displayElement) {
    this.displayElement = displayElement; // Reference to score display element
    this.score = 0;                      // Current game session score
    this.totalScore = this.loadTotalScore(); // Load total score from localStorage

    // Update the UI to show the loaded total score on initialization
    this.updateDisplay({ showTotal: true });
  }

  /**
   * Load total accumulated score from localStorage.
   * @returns {number} The total score or 0 if not found.
   */
  loadTotalScore() {
    const stored = localStorage.getItem(TOTAL_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * Save the total accumulated score back to localStorage.
   */
  saveTotalScore() {
    localStorage.setItem(TOTAL_SCORE_KEY, this.totalScore.toString());
  }

  /**
   * Reset the current game session score to zero and update the display.
   */
  reset() {
    this.score = 0;
    this.updateDisplay();
  }

  /**
   * Increment the current score and total score by a specified amount.
   * Updates the UI with animation and saves total score persistently.
   * @param {number} points - Number of points to add (default 10).
   */
  increment(points = 10) {
    this.score += points;
    this.totalScore += points;

    this.updateDisplay({ animate: true });
    this.saveTotalScore();
  }

  /**
   * Get the current game session score.
   * @returns {number} Current session score.
   */
  getScore() {
    return this.score;
  }

  /**
   * Get the total accumulated score across sessions.
   * @returns {number} Total score.
   */
  getTotalScore() {
    return this.totalScore;
  }

  /**
   * Update the text content of the score display element.
   * Can optionally animate the update or switch between total/current score display.
   * @param {Object} options
   * @param {boolean} options.animate - Whether to animate the score update.
   * @param {boolean} options.showTotal - Whether to show the total score instead of current score.
   */
  updateDisplay({ animate = false, showTotal = false } = {}) {
    if (!this.displayElement) return;

    const scoreText = showTotal
      ? `ئومۇمىي نومۇرىڭىز: ${this.totalScore}`
      : `نۇمۇرىڭىز: ${this.score}`;

    if (this.displayElement.textContent !== scoreText) {
      this.displayElement.textContent = scoreText;
    }

    if (animate) {
      this.animateScore();
    }
  }

  /**
   * Animate the score display element to give visual feedback on score changes.
   * Uses scaling and brightness effects along with CSS class 'pulse'.
   */
  animateScore() {
    this.displayElement.animate(
      [
        { transform: 'scale(1.2)', filter: 'brightness(1.5)' },
        { transform: 'scale(1)', filter: 'brightness(1)' }
      ],
      { duration: 300, fill: 'forwards' }
    );
    this.displayElement.classList.add('pulse');
    setTimeout(() => {
      this.displayElement.classList.remove('pulse');
    }, 600);
  }
}
