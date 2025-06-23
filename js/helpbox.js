/**
 * helpbox.js — Modal Help Box with Uyghur Keyboard Guide
 *
 * Implements a reusable modal dialog that provides a visual guide
 * to the Uyghur keyboard layout and controls game start flow.
 * Includes accessible attributes and keyboard/mouse event handling.
 */

export default class HelpBox {
    /**
     * Creates the HelpBox instance and initializes modal elements and events.
     * @param {HTMLElement} parent - The container element to append the modal to (default: document.body).
     * @param {Function} onConfirm - Callback triggered when the "Start Game" button is clicked.
     * @param {Function} onHide - Callback triggered when the modal is closed without starting the game.
     */
    constructor(parent = document.body, onConfirm = () => {}, onHide = () => {}) {
      this.parent = parent;
      this.onConfirm = onConfirm;
      this.onHideCallback = onHide; // Callback for when modal hides without confirming
      this.isFromHome = true; // Tracks whether helpbox was opened from home screen context
  
      this.createModal();
      this.cacheElements();
      this.attachEvents();
      this.hide(); // Initialize hidden
    }
  
    /**
     * Creates the modal DOM structure, sets accessibility attributes,
     * and appends it to the parent element.
     */
    createModal() {
      this.modal = document.createElement('div');
      this.modal.id = 'helpbox-modal';
      this.modal.className = 'helpbox-modal';
      this.modal.setAttribute('role', 'dialog');
      this.modal.setAttribute('aria-modal', 'true');
      this.modal.setAttribute('aria-labelledby', 'helpbox-title');
  
      this.modal.innerHTML = `
        <div class="helpbox-content">
          <button id="helpbox-close" class="helpbox-close" aria-label="Close Help">✖</button>
          <h2 id="helpbox-title">ئۇيغۇرچە كۇنۇپكا ياردەمچىسى</h2>
          <img 
            src="/images/bg/utg_helpbox.png" 
            alt="Uyghur Keyboard Map" 
            loading="lazy" 
            class="keyboard-map"
          />
          <button id="helpbox-ok" class="btn mt-2" aria-label="Start Game">باشلاش</button>
        </div>
      `;
  
      this.parent.appendChild(this.modal);
    }
  
    /**
     * Caches frequently used modal elements for event binding and manipulation.
     */
    cacheElements() {
      this.closeBtn = this.modal.querySelector('#helpbox-close');
      this.okBtn = this.modal.querySelector('#helpbox-ok');
    }
  
    /**
     * Attaches event listeners to modal buttons.
     * - Close button hides the modal and triggers onHideCallback if from home screen.
     * - OK button hides modal and triggers onConfirm to start the game.
     */
    attachEvents() {
      this.closeBtn?.addEventListener('click', () => {
        this.hide();
        if (this.isFromHome) {
          this.onHideCallback();
        }
      });
  
      this.okBtn?.addEventListener('click', () => {
        this.hide();
        this.onConfirm();
      });
    }
  
    /**
     * Displays the modal.
     * @param {boolean} isFromHome - Indicates if the helpbox was opened from the home screen.
     */
    show(isFromHome = true) {
      this.isFromHome = isFromHome;
      this.modal.style.display = 'flex';
      this.modal.classList.add('visible');
    }
  
    /**
     * Hides the modal.
     */
    hide() {
      this.modal.style.display = 'none';
      this.modal.classList.remove('visible');
    }
  }
