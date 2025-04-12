import { SettingsComponent } from "../components/settings.js";

export class SettingsPage {
  constructor(uiManager, timerManager) {
    this.uiManager = uiManager;
    this.timerManager = timerManager;
    this.settingsComponent = new SettingsComponent(uiManager);
  }

  render() {
    this.uiManager.showButtons();
    this.timerManager.stopTimer();
    this.settingsComponent.render();
  }
}
