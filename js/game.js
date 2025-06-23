/**
 * game.js — Core Game Mechanics for Uyghur Typing Game
 *
 * Handles the main gameplay loop including sequence generation,
 * rendering letters on screen, timing, user input, scoring, and game over.
 *
 * Uses imported letter data and image paths from letter.js.
 */

import { letterMap, getLetterImagePath, allLetters } from './letter.js';

const CONFIG = {
  LETTER_COUNT: 7,         // Number of letters per sequence
  MAX_ADVANCE: 7,          // Maximum letters player can advance before game ends
  SPACING: 160,            // Horizontal space between letters in pixels
  WIDTH: 128,              // Letter image width in pixels
  FLICKER_DELAY: 7000,     // Time in ms before letter flickers to warn timeout
  FALL_DELAY: 10000,       // Time in ms before letter falls off screen
  BURST_PARTICLES: 10,     // Number of particles in visual burst effect
};

export default class UyghurTypingGame {
  /**
   * Initializes the game instance.
   * @param {HTMLElement} area - The DOM element to render letters inside.
   * @param {Function} onGameOver - Callback invoked when the game ends.
   * @param {ScoreManager} scoreManager - Instance managing score updates.
   */
  constructor(area, onGameOver, scoreManager) {
    this.area = area;
    this.onGameOver = onGameOver;
    this.keys = allLetters;

    this.scoreManager = scoreManager; // Shared score manager instance
    this.resetState();
    this.prepareInputHandler();
  }

  /**
   * Resets internal game state and clears timers/intervals.
   */
  resetState() {
    this.seq = [];         // Current letter sequence to type
    this.letters = [];     // DOM elements for each letter in sequence
    this.idx = 0;          // Current letter index in sequence
    clearTimeout(this.letterT);
    clearInterval(this.flicker);
  }

  /**
   * Prepares keydown event handler for user input.
   */
  prepareInputHandler() {
    this.keyHandler = (ev) => {
      if (this.idx >= this.seq.length) return;
      if (ev.key === this.seq[this.idx]) this.handleCorrectKey();
    };
  }

  /**
   * Starts the game, resets state, adds key event listener,
   * generates initial sequence and renders it.
   */
  start() {
    this.resetState();
    document.addEventListener('keydown', this.keyHandler);
    this.newSequence();
    this.render();
  }

  /**
   * Generates a new random letter sequence.
   */
  newSequence() {
    this.seq = Array.from({ length: CONFIG.LETTER_COUNT }, () =>
      this.keys[Math.floor(Math.random() * this.keys.length)]
    );
  }

  /**
   * Clears previously rendered letters and cancels timers.
   */
  clearRender() {
    this.letters.forEach(el => el.remove());
    this.letters = [];
    clearTimeout(this.letterT);
    clearInterval(this.flicker);
  }

  /**
   * Renders the current letter sequence centered horizontally on screen.
   * Letters fade and scale in staggered animation.
   * Starts the timer for the first letter.
   */
  render() {
    this.clearRender();

    const totalW = (this.seq.length - 1) * CONFIG.SPACING + CONFIG.WIDTH;
    const startX = (window.innerWidth - totalW) / 2;

    this.seq.forEach((char, i) => {
      const img = document.createElement('img');
      img.src = getLetterImagePath(char);
      img.alt = char;
      img.className = 'letter animated';
      img.style.left = `${startX + CONFIG.SPACING * i}px`;
      img.style.top = `${window.innerHeight / 2}px`;
      img.style.opacity = '0';

      setTimeout(() => {
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 100 + i * 100);

      this.area.appendChild(img);
      this.letters.push(img);
    });

    this.startTimer();
  }

  /**
   * Starts timers for the current letter:
   * - Flickers letter after FLICKER_DELAY.
   * - Makes letter fall after FALL_DELAY, triggering next letter.
   */
  startTimer() {
    if (this.idx >= this.seq.length) return;

    const el = this.letters[this.idx];
    let flickered = false;

    this.letterT = setTimeout(() => {
      flickered = true;
      this.flicker = setInterval(() => {
        el.style.opacity = el.style.opacity === '1' ? '0.3' : '1';
      }, 250);
    }, CONFIG.FLICKER_DELAY);

    this.letterT = setTimeout(() => {
      if (flickered) clearInterval(this.flicker);
      el.style.transition = 'top 1s ease, opacity 1s ease';
      el.style.top = `${window.innerHeight + 150}px`;
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 1000);
      this.nextLetter();
    }, CONFIG.FALL_DELAY);
  }

  /**
   * Shifts all remaining letters left by one spacing unit,
   * visually advancing the sequence.
   */
  shiftLetters() {
    this.letters.slice(this.idx).forEach(el => {
      const currentLeft = parseFloat(el.style.left);
      el.style.left = `${currentLeft - CONFIG.SPACING}px`;
    });
  }

  /**
   * Creates a burst particle effect at specified screen coordinates.
   * @param {number} x - X coordinate for burst center.
   * @param {number} y - Y coordinate for burst center.
   */
  createBurst(x, y) {
    for (let i = 0; i < CONFIG.BURST_PARTICLES; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 40 + 20;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;

      particle.animate(
        [
          { transform: 'translate(0, 0)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
        ],
        { duration: 600, easing: 'ease-out', fill: 'forwards' }
      );

      this.area.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }

  /**
   * Handles correct key press:
   * - Stops timers and flicker.
   * - Creates visual burst on letter.
   * - Animates letter fade and removal.
   * - Increments score.
   * - Advances to next letter.
   */
  handleCorrectKey() {
    const el = this.letters[this.idx];
    clearTimeout(this.letterT);
    clearInterval(this.flicker);

    const rect = el.getBoundingClientRect();
    this.createBurst(rect.left + 64, rect.top + 64);

    el.style.transition = 'transform 0.4s ease, opacity 0.4s ease, filter 0.4s';
    el.style.transform = 'scale(1.4)';
    el.style.opacity = '0';
    el.style.filter = 'drop-shadow(0 0 8px #fff)';
    setTimeout(() => el.remove(), 400);

    this.scoreManager?.increment(10);
    this.nextLetter();
  }

  /**
   * Advances the current letter index and updates game state.
   * Ends game if max advances reached, otherwise shifts letters and restarts timer.
   */
  nextLetter() {
    this.idx++;
    if (this.idx >= CONFIG.MAX_ADVANCE) {
      return this.endGame();
    }

    this.shiftLetters();
    this.startTimer();
  }

  /**
   * Ends the game by removing event listeners and triggering game over callback.
   */
  endGame() {
    document.removeEventListener('keydown', this.keyHandler);
    this.onGameOver?.(this.scoreManager.getScore());
  }
}
