// ui.js — Handles UI interactions and game flow

import UyghurTypingGame from './game.js';
import ScoreManager from './score.js';
import EndScreen from './endscreen.js';
import HelpBox from './helpbox.js';

/**
 * UIManager class to encapsulate all UI logic and game flow.
 * Improves readability, maintainability, and scalability.
 */
class UIManager {
  constructor() {
    // Cache all required DOM elements for later use
    this.elements = this.cacheDOMElements();

    // Initialize score manager and end screen with respective DOM elements
    this.scoreManager = new ScoreManager(this.elements.scoreDisplay);
    this.endScreen = new EndScreen(document.body);
    this.gameInstance = null; // Will hold the current game session instance

    // Track current screen state to manage UI transitions ('home' or 'game')
    this.currentScreen = 'home';

    // Create and append global UI buttons for navigation and help
    this.backButton = this.createButton('back-btn', 'قايتىش', ['btn', 'mt-2']);
    this.helpButton = this.createButton('helpbox-button', '?', []);
    document.body.appendChild(this.backButton);
    document.body.appendChild(this.helpButton);

    // Initialize the HelpBox with callbacks for confirm and close actions
    this.helpBox = new HelpBox(document.body, this.handleHelpBoxConfirm, this.showHomeScreen);

    // Set up event listeners for user interactions on buttons and logo
    this.setupGlobalListeners();

    // Initialize UI state to show the home screen initially
    this.initializeUI();
  }

  /**
   * Cache all DOM elements used in UIManager to optimize DOM queries.
   * @returns {Object} References to key DOM elements.
   */
  cacheDOMElements() {
    return {
      homeScreen: document.getElementById('home-screen'),
      gameArea: document.getElementById('game-area'),
      gameOverOverlay: document.getElementById('game-over'), // Legacy element, might be deprecated
      replayBtn: document.getElementById('replay-btn'),      // Legacy replay button
      rotatingLogo: document.getElementById('rotating-logo'),
      scoreDisplay: document.getElementById('score'),
    };
  }

  /**
   * Create a button element with specified attributes and classes.
   * @param {string} id - Unique ID for the button element.
   * @param {string} text - Button text content.
   * @param {string[]} classes - CSS classes to add.
   * @returns {HTMLButtonElement} The created button element.
   */
  createButton(id, text, classes) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.classList.add(...classes);
    button.style.display = 'none'; // Hide buttons initially until shown explicitly
    return button;
  }

  /**
   * Attach event listeners for global UI controls and game interactions.
   */
  setupGlobalListeners() {
    // Start game flow on clicking or keyboard activating the rotating logo
    this.elements.rotatingLogo.addEventListener('click', this.handleStartGameFlow);
    this.elements.rotatingLogo.addEventListener('keydown', this.handleLogoKeydown);

    // Replay button for legacy game over screen
    this.elements.replayBtn?.addEventListener('click', this.handleReplayGame);

    // Listen to play again event from custom end screen
    this.endScreen.onPlayAgain(this.showHomeScreen);

    // Back and Help buttons
    this.backButton.addEventListener('click', this.handleBackButtonClick);
    this.helpButton.addEventListener('click', this.handleHelpButtonClick);
  }

  /**
   * Initialize the UI by showing the home screen on app start.
   */
  initializeUI() {
    this.showHomeScreen();
  }

  // --- UI State Management Methods ---

  /**
   * Show UI elements for the game screen and hide others.
   */
  showGameUI = () => {
    this.currentScreen = 'game';

    this.elements.homeScreen.style.display = 'none';
    this.elements.gameOverOverlay.style.display = 'none';
    this.endScreen.hide();

    this.elements.gameArea.style.display = 'block';
    this.elements.scoreDisplay.style.display = 'block';
    this.scoreManager.updateDisplay(false, false); // Update score for current game

    this.backButton.style.display = 'block';
    this.helpButton.style.display = 'none'; // Hide help button during gameplay
  };

  /**
   * Hide game-specific UI components.
   */
  hideGameUI = () => {
    this.elements.gameArea.style.display = 'none';
    this.backButton.style.display = 'none';
    this.helpButton.style.display = 'block'; // Show help button outside gameplay
    // Score display visibility controlled by screen-specific functions
  };

  /**
   * Show the home screen UI and display the total score.
   */
  showHomeScreen = () => {
    this.currentScreen = 'home';

    // Make sure home screen container is visible and centered
    this.elements.homeScreen.style.display = 'flex';
    this.elements.homeScreen.style.flexDirection = 'column';
    this.elements.homeScreen.style.alignItems = 'center';
    this.elements.homeScreen.style.justifyContent = 'center';

    // Hide game UI and game over overlay
    this.hideGameUI();
    this.elements.gameOverOverlay.style.display = 'none';
    this.endScreen.hide();

    // Show score display and update to show total score across sessions
    this.elements.scoreDisplay.style.display = 'block';
    this.scoreManager.updateDisplay({ showTotal: true });
  };

  /**
   * Perform all operations required to start a new game session.
   */
  actuallyStartGame = () => {
    // Clean up existing game instance if present
    if (this.gameInstance) {
      document.removeEventListener('keydown', this.gameInstance.keyHandler);
      this.gameInstance.resetState();
      this.gameInstance.clearRender(); // Remove old letter elements
    }
    this.elements.gameArea.innerHTML = ''; // Clear game area

    // Reset score for new game
    this.scoreManager.reset();

    // Switch UI to game screen
    this.showGameUI();

    // Create a new game instance and start it
    this.gameInstance = new UyghurTypingGame(this.elements.gameArea, this.handleGameEnd);
    this.gameInstance.scoreManager = this.scoreManager; // Pass shared score manager
    this.gameInstance.start();
  };

  // --- Event Handlers ---

  /**
   * Triggered when user clicks or activates the rotating logo.
   * Shows the help box as a first step before starting the game.
   */
  handleStartGameFlow = () => {
    this.helpBox.show();
  };

  /**
   * Handle keyboard events on the rotating logo (Enter or Space keys).
   * @param {KeyboardEvent} event
   */
  handleLogoKeydown = (event) => {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      this.handleStartGameFlow();
    }
  };

  /**
   * Callback when the help box confirms to start the game.
   * Starts a new game session.
   */
  handleHelpBoxConfirm = () => {
    this.actuallyStartGame();
  };

  /**
   * Handles the end of a game session.
   * Updates score, hides game UI, and shows end screen.
   * @param {number} currentScore - The score achieved in the finished game.
   */
  handleGameEnd = (currentScore) => {
    this.scoreManager.saveTotalScore();

    this.hideGameUI();
    this.elements.gameOverOverlay.style.display = 'none';
    this.elements.scoreDisplay.style.display = 'none';

    // Show custom end screen with current and total scores
    this.endScreen.show(currentScore, this.scoreManager.getTotalScore());

    if (this.gameInstance) {
      document.removeEventListener('keydown', this.gameInstance.keyHandler);
      this.gameInstance.clearRender();
      this.gameInstance = null;
    }
  };

  /**
   * Handles the Back button click to return to the home screen.
   * Stops any ongoing game session and cleans up.
   */
  handleBackButtonClick = () => {
    this.scoreManager.saveTotalScore();

    if (this.gameInstance) {
      document.removeEventListener('keydown', this.gameInstance.keyHandler);
      this.gameInstance.clearRender();
      this.gameInstance = null;
    }
    this.showHomeScreen();
  };

  /**
   * Handles Replay button click from legacy game over screen.
   * Hides end screen and restarts game.
   */
  handleReplayGame = () => {
    this.endScreen.hide();
    this.elements.gameArea.innerHTML = '';
    this.actuallyStartGame();
  };

  /**
   * Handles Help button click, shows the help box.
   * The score display remains visible beneath the help box overlay.
   */
  handleHelpButtonClick = () => {
    this.helpBox.show();
  };
}

// Initialize UIManager after DOM is ready to ensure all elements are loaded
document.addEventListener('DOMContentLoaded', () => {
  new UIManager();
});
