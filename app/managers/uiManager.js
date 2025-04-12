export class UIManager {
  constructor(themeManager, timerManager, domElements) {
    this.themeManager = themeManager;
    this.timerManager = timerManager;
    this.domElements = domElements;
    this.currentQuote = "";
  }

  async initialize() {
    // Set up event listeners
    if (this.domElements.settingsButton) {
      this.domElements.settingsButton.addEventListener("click", () => {
        // Access the globally available timeApp instance
        if (window.timeApp) {
          window.timeApp.handleSettingsToggle();
        }
      });
    }

    if (this.domElements.nextTimerButton) {
      this.domElements.nextTimerButton.addEventListener("click", async () => {
        const label = await this.timerManager.changeTimer();
        this.setTimerLabel(label);
      });
    }
  }

  showButtons() {
    if (this.domElements.buttonsContainer) {
      this.domElements.buttonsContainer.style.display = "flex";
    }
  }

  hideButtons() {
    if (this.domElements.buttonsContainer) {
      this.domElements.buttonsContainer.style.display = "none";
    }
  }

  clearContainer() {
    this.domElements.clearContainer();
  }

  updateTimerDisplay({ hours, minutes, seconds, milliseconds }) {
    // Make sure we have the latest references to dynamic elements
    this.domElements.updateTimerElements();

    if (this.domElements.countElement) {
      const timeUnits =
        this.domElements.countElement.querySelectorAll(".time-unit");
      if (timeUnits.length === 4) {
        timeUnits[0].textContent = hours;
        timeUnits[1].textContent = minutes;
        timeUnits[2].textContent = seconds;
        timeUnits[3].textContent = milliseconds;
      }
    }

    if (this.domElements.quoteLabelElement && this.currentQuote) {
      this.domElements.quoteLabelElement.textContent = this.currentQuote;
    }
  }

  setQuote(quote) {
    this.currentQuote = quote;
    this.domElements.updateTimerElements();
    if (this.domElements.quoteLabelElement) {
      this.domElements.quoteLabelElement.textContent = quote;
    }
  }

  setTimerLabel(label) {
    this.domElements.updateTimerElements();
    if (this.domElements.timeLabelElement) {
      this.domElements.timeLabelElement.textContent = `TIME LEFT IN ${label}`;
    }
  }
}
