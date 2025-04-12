export class DOMElements {
  static instance = null;

  constructor() {
    if (DOMElements.instance) {
      return DOMElements.instance;
    }

    // Main containers
    this.container = document.getElementById("time-app");
    this.buttonsContainer = document.getElementById("buttons-container");

    // Buttons
    this.themeButton = document.getElementById("mode");
    this.settingsButton = document.getElementById("settings");
    this.nextTimerButton = document.getElementById("switch-timer");

    // Timer elements
    this.countElement = null;
    this.quoteLabelElement = null;
    this.timeLabelElement = null;

    DOMElements.instance = this;
  }

  static getInstance() {
    if (!DOMElements.instance) {
      DOMElements.instance = new DOMElements();
    }
    return DOMElements.instance;
  }

  // Method to clear and update timer elements that are dynamically created
  updateTimerElements() {
    if (this.container) {
      this.countElement = document.getElementById("count");
      this.quoteLabelElement = document.querySelector(".quote-label");
      this.timeLabelElement = document.querySelector(".timer-label");
    }
  }

  // Clear container content but maintain references
  clearContainer() {
    if (this.container) {
      this.container.innerHTML = "";
      this.countElement = null;
      this.quoteLabelElement = null;
      this.timeLabelElement = null;
    }
  }
}
