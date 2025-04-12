import { STORAGE } from "./utils/constants.js";
import { EventBus } from "./utils/eventBus.js";
import { DOMElements } from "./utils/domElements.js";
import { StorageManager } from "./managers/storageManager.js";
import { QuoteManager } from "./managers/quoteManager.js";
import { TimerManager } from "./managers/timerManager.js";
import { ThemeManager } from "./managers/themeManager.js";
import { UIManager } from "./managers/uiManager.js";
import { MainPage } from "./pages/mainPage.js";
import { OnboardingPage } from "./pages/onboardingPage.js";
import { SettingsPage } from "./pages/settingsPage.js";

export class TimeApp {
  constructor() {
    // Create shared DOM elements instance first
    this.domElements = DOMElements.getInstance();

    // Initialize core components
    this.eventBus = new EventBus();
    this.storageManager = new StorageManager();
    this.quoteManager = new QuoteManager();
    this.timerManager = new TimerManager(this.storageManager);
    this.themeManager = new ThemeManager(this.storageManager, this.domElements);
    this.uiManager = new UIManager(
      this.themeManager,
      this.timerManager,
      this.domElements
    );

    // Make app instance globally available for UI event handlers
    window.timeApp = this;

    this.mainPage = new MainPage(
      this.uiManager,
      this.timerManager,
      this.quoteManager,
      this.themeManager
    );
    this.onboardingPage = new OnboardingPage(
      this.uiManager,
      this.storageManager,
      () => this.startMainApp()
    );
    this.settingsPage = new SettingsPage(this.uiManager, this.timerManager);

    this.isSettingsOpen = false;
  }

  async init() {
    // Initialize managers
    await Promise.all([
      this.themeManager.initialize(),
      this.timerManager.initialize(),
      this.quoteManager.loadQuotes(),
      this.uiManager.initialize(),
    ]);

    // Apply theme
    this.themeManager.applyTheme();

    // Check onboarding status
    const storage = await this.storageManager.get([STORAGE.ONBOARDED]);
    const isOnboarded = storage[STORAGE.ONBOARDED] === "1";
    if (isOnboarded) {
      this.startMainApp();
    } else {
      this.onboardingPage.render();
    }
  }

  async handleSettingsToggle() {
    this.isSettingsOpen = !this.isSettingsOpen;
    await this.storageManager.set({
      [STORAGE.SETTINGS]: this.isSettingsOpen ? "1" : "0",
    });
    if (this.isSettingsOpen) {
      this.mainPage.destroy();
      this.settingsPage.render();
    } else {
      this.startMainApp();
    }
  }

  startMainApp() {
    this.isSettingsOpen = false;
    this.mainPage.render();
  }
}
