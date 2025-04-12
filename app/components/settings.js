export class SettingsComponent {
  constructor(uiManager) {
    this.uiManager = uiManager;
  }

  render() {
    this.uiManager.domElements.container.innerHTML = `
        <div class="settings">
          <h1>Settings</h1>
          <p>Configure your timers and preferences here.</p>
        </div>
      `;
  }
}
