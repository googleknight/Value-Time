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

    // Settings elements
    this.timersListElement = null;
    this.addTimerButton = null;
    this.settingsBackButton = null;
    this.newTimerLabelInput = null;
    this.newTimerHourInput = null;
    this.newTimerMinuteInput = null;
    this.newTimerPeriodSelect = null;

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
      this.timeLabelElement = document.querySelector(".time-label");
    }
  }

  // Method to update settings elements that are dynamically created
  updateSettingsElements() {
    if (this.container) {
      this.timersListElement = document.getElementById("timers-list");
      this.addTimerButton = document.getElementById("add-timer-btn");
      this.newTimerLabelInput = document.getElementById("new-timer-label");
      this.newTimerHourInput = document.getElementById("new-timer-hour");
      this.newTimerMinuteInput = document.getElementById("new-timer-minute");
      this.newTimerPeriodSelect = document.getElementById("new-timer-period");
    }

    // Back button is added directly to body
    this.settingsBackButton = document.getElementById("back-to-timer-btn");
  }

  // Helper method to get edit form elements for a specific timer index
  getEditFormElements(index) {
    return {
      labelInput: document.getElementById(`edit-label-${index}`),
      hourInput: document.getElementById(`edit-hour-${index}`),
      minuteInput: document.getElementById(`edit-minute-${index}`),
      periodSelect: document.getElementById(`edit-period-${index}`),
    };
  }

  // Clear container content but maintain references
  clearContainer() {
    if (this.container) {
      this.container.innerHTML = "";
      this.countElement = null;
      this.quoteLabelElement = null;
      this.timeLabelElement = null;
      this.timersListElement = null;
      this.addTimerButton = null;
      this.newTimerLabelInput = null;
      this.newTimerHourInput = null;
      this.newTimerMinuteInput = null;
      this.newTimerPeriodSelect = null;
    }
  }
}
