export class OnboardingComponent {
  constructor(uiManager, onComplete) {
    this.uiManager = uiManager;
    this.onComplete = onComplete;
  }

  render() {
    this.uiManager.domElements.container.innerHTML = `
        <div class="onboarding">
          <div class="onboarding-content">
            <h1>Welcome to ValueTime!</h1>
            <p>Start your journey towards better time management.</p>
            <button id="start-button" class="start-button">Start Using ValueTime</button>
          </div>
        </div>
      `;
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => this.onComplete());
    }
  }
}
