import { OnboardingComponent } from "../components/onboarding.js";
import { STORAGE } from "../utils/constants.js";

export class OnboardingPage {
  constructor(uiManager, storageManager, onComplete) {
    this.uiManager = uiManager;
    this.storageManager = storageManager;
    this.onboardingComponent = new OnboardingComponent(uiManager, () =>
      this.completeOnboarding()
    );
    this.onComplete = onComplete;
  }

  render() {
    this.uiManager.hideButtons();
    this.onboardingComponent.render();
  }

  async completeOnboarding() {
    await this.storageManager.set({ [STORAGE.ONBOARDED]: "1" });
    this.onComplete();
  }
}
