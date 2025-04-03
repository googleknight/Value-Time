// Constants
const REFRESH_INTERVAL = 80; // milliseconds
const DEFAULT_QUOTE = "Make the most of your time.";
const STORAGE = {
  MODE: "mode",
  ONBOARDED: "onboarded",
  SETTINGS: "settings",
};

// Theme definitions
const THEMES = {
  light: {
    backgroundColor: "#ffffff",
    textColor: "#2c3e50",
    themeIcon: chrome.runtime.getURL("assets/theme-light.svg"),
    settingsIcon: chrome.runtime.getURL("assets/settings-light.svg"),
  },
  dark: {
    backgroundColor: "#1a1a1a",
    textColor: "#ecf0f1",
    themeIcon: chrome.runtime.getURL("assets/theme-dark.svg"),
    settingsIcon: chrome.runtime.getURL("assets/settings-dark.svg"),
  },
};

class TimeApp {
  constructor(elementId) {
    // DOM elements
    this.container = document.getElementById(elementId);
    this.buttonsContainer = document.getElementById("buttons-container");
    this.themeButton = document.getElementById("mode");
    this.settingsButton = document.getElementById("settings");

    // App state
    this.quotes = [];
    this.currentQuote = DEFAULT_QUOTE;
    this.timerInterval = null;
    this.isDarkMode = false;

    // Initialize app
    this.init();
  }

  async init() {
    // Set up theme toggle
    if (this.themeButton) {
      this.themeButton.addEventListener("click", () => this.toggleTheme());
    }

    if (this.settingsButton) {
      this.settingsButton.addEventListener("click", () =>
        this.toggleSettings()
      );
    }

    // Load storage
    const storage = await this.getStorage([STORAGE.MODE, STORAGE.ONBOARDED]);
    this.isDarkMode = storage[STORAGE.MODE] === "1";
    const isOnboarded = storage[STORAGE.ONBOARDED] === "1";

    // Apply current theme
    this.applyTheme();

    // Load quotes
    await this.loadQuotes();

    // Show either onboarding or main app
    if (isOnboarded) {
      this.startApp();
    } else {
      this.showOnboarding();
    }
  }

  // Storage helper
  async getStorage(keys) {
    try {
      return await chrome.storage.local.get(keys);
    } catch (error) {
      console.error("Storage error:", error);
      return {};
    }
  }

  // Set storage helper
  async setStorage(data) {
    try {
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error("Storage error:", error);
    }
  }

  // Load quotes from JSON file
  async loadQuotes() {
    try {
      const response = await fetch("app/quotes.json");
      const data = await response.json();
      this.quotes = Object.values(data).flatMap((category) => category.quotes);
    } catch (error) {
      console.error("Error loading quotes:", error);
      this.quotes = [];
    }
  }

  // Get a random quote
  getRandomQuote() {
    return this.quotes.length > 0
      ? this.quotes[Math.floor(Math.random() * this.quotes.length)]
      : DEFAULT_QUOTE;
  }

  // Show onboarding screen
  showOnboarding() {
    // Hide theme button during onboarding
    if (this.buttonsContainer) {
      this.buttonsContainer.style.display = "none";
    }

    // Render onboarding UI
    this.container.innerHTML = `
      <div class="onboarding">
        <div class="onboarding-content">
          <h1>Welcome to ValueTime!</h1>
          <p>Start your journey towards better time management.</p>
          <button id="start-button" class="start-button">Start Using ValueTime</button>
        </div>
      </div>
    `;

    // Add event listener for start button
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.addEventListener("click", () => this.completeOnboarding());
    }
  }

  // Complete onboarding and start app
  async completeOnboarding() {
    await this.setStorage({ [STORAGE.ONBOARDED]: "1" });
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.removeEventListener("click", () => this.completeOnboarding());
    }

    this.startApp();
  }

  // Start the main app
  startApp() {
    // Show buttons
    if (this.buttonsContainer) {
      this.buttonsContainer.style.display = "flex";
    }

    // Get a random quote
    this.currentQuote = this.getRandomQuote();

    // Start the timer
    this.startTimer();
  }

  // Start timer update loop
  startTimer() {
    // Clear any existing interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Update immediately
    this.updateTimer();

    // Set interval for updates
    this.timerInterval = setInterval(
      () => this.updateTimer(),
      REFRESH_INTERVAL
    );
  }

  // Update timer display
  updateTimer() {
    const timeLeft = this.getTimeLeft();
    this.renderApp(timeLeft);
  }

  // Calculate time left in day
  getTimeLeft() {
    const now = new Date();

    // Calculate hours, minutes, seconds left
    const hoursLeft =
      24 -
      now.getHours() -
      (now.getMinutes() > 0 || now.getSeconds() > 0 ? 1 : 0);
    const minutesLeft =
      now.getSeconds() > 0 ? 59 - now.getMinutes() : 60 - now.getMinutes();
    const secondsLeft = 60 - now.getSeconds();
    const msLeft = 1000 - now.getMilliseconds();

    // Format with leading zeros
    return {
      hours: hoursLeft.toString().padStart(2, "0"),
      minutes: minutesLeft.toString().padStart(2, "0"),
      seconds: secondsLeft.toString().padStart(2, "0"),
      milliseconds: Math.max(0, Math.min(999, msLeft))
        .toString()
        .padStart(3, "0"),
    };
  }

  // Render the main app view
  renderApp({ hours, minutes, seconds, milliseconds }) {
    this.container.innerHTML = `
      <div class="timer-container">
        <h1 class="time-label">TIME LEFT IN DAY</h1>
        <div id="count">
          <div class="time-unit">${hours}</div>
          <div class="time-separator">:</div>
          <div class="time-unit">${minutes}</div>
          <div class="time-separator">:</div>
          <div class="time-unit">${seconds}</div>
          <div class="time-separator">:</div>
          <div class="time-unit milliseconds">${milliseconds}</div>
        </div>
        <div class="quote-container">
          <h1 class="quote-label">${this.currentQuote}</h1>
        </div>
      </div>
    `;
  }

  // Toggle between light and dark themes
  async toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    await this.setStorage({ [STORAGE.MODE]: this.isDarkMode ? "1" : "0" });
    this.applyTheme();
  }

  // Apply the current theme
  applyTheme() {
    const theme = THEMES[this.isDarkMode ? "dark" : "light"];

    // Apply to body
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
    document.body.style.setProperty("--bg-color", theme.backgroundColor);

    // Update theme button
    if (this.themeButton) {
      this.themeButton.innerHTML = `<img src="${theme.themeIcon}" alt="Theme Icon" width="24" height="24"/>`;
      this.themeButton.style.color = theme.textColor;
      this.themeButton.style.borderColor = `${theme.textColor}40`;
      this.themeButton.style.backgroundColor = `${theme.backgroundColor}CC`;
    }

    // Update settings button
    if (this.settingsButton) {
      this.settingsButton.innerHTML = `<img src="${theme.settingsIcon}" alt="Settings Icon" width="24" height="24"/>`;
      this.settingsButton.style.color = theme.textColor;
      this.settingsButton.style.borderColor = `${theme.textColor}40`;
      this.settingsButton.style.backgroundColor = `${theme.backgroundColor}CC`;
    }
  }

  async toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    await this.setStorage({
      [STORAGE.SETTINGS]: this.isSettingsOpen ? "1" : "0",
    });
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.timeApp = new TimeApp("time-app");
});
