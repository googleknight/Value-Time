import { SettingsComponent } from "../components/settings.js";
import { SettingsManager } from "../managers/settingsManager.js";

export class SettingsPage {
  constructor(uiManager, timerManager, storageManager) {
    this.uiManager = uiManager;
    this.timerManager = timerManager;
    this.storageManager = storageManager;
    this.domElements = uiManager.domElements;

    // Create the settings manager
    this.settingsManager = new SettingsManager(storageManager, timerManager);

    // Create the settings component with the manager
    this.settingsComponent = new SettingsComponent(
      uiManager,
      this.settingsManager
    );
  }

  async render() {
    this.uiManager.hideButtons();
    this.timerManager.stopTimer();

    // Initialize will handle rendering
    await this.settingsComponent.initialize();

    // Add back button
    const backButton = document.createElement("button");
    backButton.id = "back-to-timer-btn";
    backButton.textContent = "Back to Timer";
    backButton.className = "back-button";
    backButton.addEventListener("click", () => {
      // Access the globally available timeApp instance
      if (window.timeApp) {
        window.timeApp.handleSettingsToggle();
      }
    });

    document.body.appendChild(backButton);

    // Update DOM references to include the back button
    this.domElements.updateSettingsElements();
  }

  destroy() {
    // Remove back button using the DOM reference
    if (this.domElements.settingsBackButton) {
      this.domElements.settingsBackButton.remove();
    }
  }
}
