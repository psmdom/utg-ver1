/**
 * endscreen.js — Handles the Game Over Screen Display
 *
 * Manages the end-of-game modal popup showing current and total scores,
 * and provides a button to restart or return to the home screen.
 */

const ID = {
    overlay: 'end-screen-overlay',     // ID for the overlay modal container
    finalScore: 'final-score',          // ID for displaying the current game score
    totalScore: 'total-score',          // ID for displaying the accumulated total score
    playAgain: 'back-to-home-btn',      // ID for the "play again" button
  };
  
  const CLASS = {
    popup: 'endscreen-popup',            // Class for the popup container styling
    visible: 'visible',                  // Class to toggle modal visibility
    button: 'btn mt-2',                  // Class for button styling
  };
  
  export default class EndScreen {
    /**
     * Creates an instance of the EndScreen manager.
     * @param {HTMLElement} parent - The container element to append the modal (defaults to document.body).
     */
    constructor(parent = document.body) {
      this.parent = parent;
      this.onPlayAgainCallback = () => {};  // Callback invoked when play again button is clicked
  
      this.createModal();
      this.cacheElements();
      this.attachEvents();
      this.hide();  // Start hidden
    }
  
    /**
     * Builds the modal DOM structure and appends it to the parent element.
     */
    createModal() {
      this.modal = document.createElement('div');
      this.modal.id = ID.overlay;
      this.modal.innerHTML = `
        <div class="${CLASS.popup}">
          <h2>ياخشى ئىش!</h2>
          <p>بۇ قېتىملىق نومۇرىڭىز: <span id="${ID.finalScore}">0</span></p>
          <p>ئومۇمىي نومۇرىڭىز: <span id="${ID.totalScore}">0</span></p>
          <button id="${ID.playAgain}" class="${CLASS.button}">باش بەتكە قايتىش</button>
        </div>
      `;
      this.parent.appendChild(this.modal);
    }
  
    /**
     * Caches key elements inside the modal for easy access.
     */
    cacheElements() {
      this.finalScoreElement = this.modal.querySelector(`#${ID.finalScore}`);
      this.totalScoreElement = this.modal.querySelector(`#${ID.totalScore}`);
      this.playAgainButton = this.modal.querySelector(`#${ID.playAgain}`);
    }
  
    /**
     * Attaches event listeners, primarily for the play again button.
     */
    attachEvents() {
      this.playAgainButton.addEventListener('click', () => {
        this.hide();
        this.onPlayAgainCallback();  // Notify that "play again" was triggered
      });
    }
  
    /**
     * Shows the end screen modal and updates score displays.
     * @param {number} currentScore - Score achieved in the current game session.
     * @param {number} totalScore - Total accumulated score across sessions.
     */
    show(currentScore, totalScore) {
      this.finalScoreElement.textContent = currentScore;
      this.totalScoreElement.textContent = totalScore;
      this.modal.classList.add(CLASS.visible);
    }
  
    /**
     * Hides the end screen modal.
     */
    hide() {
      this.modal.classList.remove(CLASS.visible);
    }
  
    /**
     * Registers a callback function to be called when "play again" button is clicked.
     * @param {Function} callback - Callback function.
     */
    onPlayAgain(callback) {
      this.onPlayAgainCallback = callback;
    }
  }
