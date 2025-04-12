// Constants
const REFRESH_INTERVAL = 80; // milliseconds
const DEFAULT_QUOTE = "Make the most of your time.";
const DEFAULT_TIMER = { hour: 24, minute: 0, label: "Day" };
const STORAGE = {
  MODE: "mode",
  ONBOARDED: "onboarded",
  SETTINGS: "settings",
  TIMERS: "timers",
};

// Theme definitions
const THEMES = {
  light: {
    backgroundColor: "#a8a6a0",
    textColor: "#2c3e50",
    themeIcon: chrome.runtime.getURL("assets/theme-light.svg"),
    settingsIcon: chrome.runtime.getURL("assets/settings-light.svg"),
    nextTimerIcon: chrome.runtime.getURL("assets/next-timer-light.svg"),
  },
  dark: {
    backgroundColor: "#1a1a1a",
    textColor: "#ecf0f1",
    themeIcon: chrome.runtime.getURL("assets/theme-dark.svg"),
    settingsIcon: chrome.runtime.getURL("assets/settings-dark.svg"),
    nextTimerIcon: chrome.runtime.getURL("assets/next-timer-dark.svg"),
  },
};

class TimeApp {
  constructor(elementId) {
    // DOM elements
    this.container = document.getElementById(elementId);
    this.buttonsContainer = document.getElementById("buttons-container");
    this.themeButton = document.getElementById("mode");
    this.settingsButton = document.getElementById("settings");
    this.nextTimerButton = document.getElementById("switch-timer");
    this.countElement = null;
    this.quoteLabelElement = null;
    this.timeLabelElement = null;

    // App state
    this.quotes = [];
    this.currentQuote = DEFAULT_QUOTE;
    this.timerInterval = null;
    this.isDarkMode = false;

    // Timers state
    this.timers = {
      current: { index: 0 },
      all: [],
    };

    // Initialize app
    this.init();
  }

  async init() {
    // Set up event listeners for buttons
    if (this.themeButton) {
      this.themeButton.addEventListener("click", () => this.toggleTheme());
    }
    if (this.settingsButton) {
      this.settingsButton.addEventListener("click", () =>
        this.toggleSettings()
      );
    }
    if (this.nextTimerButton) {
      this.nextTimerButton.addEventListener("click", () => this.changeTimer());
    }

    // Load storage
    const storage = await this.getStorage([
      STORAGE.MODE,
      STORAGE.ONBOARDED,
      STORAGE.TIMERS,
    ]);

    this.isDarkMode = storage[STORAGE.MODE] === "1";
    const isOnboarded = storage[STORAGE.ONBOARDED] === "1";

    // Initialize timers
    if (
      storage[STORAGE.TIMERS] &&
      Array.isArray(storage[STORAGE.TIMERS].all) &&
      storage[STORAGE.TIMERS].all.length > 0
    ) {
      this.timers = storage[STORAGE.TIMERS];
      // Ensure current index is within bounds
      if (this.timers.current.index >= this.timers.all.length) {
        this.timers.current.index = 0;
      }
    } else {
      this.initializeDefaultTimers();
      await this.setStorage({ [STORAGE.TIMERS]: this.timers });
    }

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

  initializeDefaultTimers() {
    const defaultTimer = DEFAULT_TIMER;
    this.timers.current = { index: 0 };
    this.timers.all = [defaultTimer];
  }

  async getStorage(keys) {
    try {
      return await chrome.storage.local.get(keys);
    } catch (error) {
      console.error("Storage error:", error);
      return {};
    }
  }

  async setStorage(data) {
    try {
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error("Storage error:", error);
    }
  }

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

  getRandomQuote() {
    return this.quotes.length > 0
      ? this.quotes[Math.floor(Math.random() * this.quotes.length)]
      : DEFAULT_QUOTE;
  }

  showOnboarding() {
    if (this.buttonsContainer) {
      this.buttonsContainer.style.display = "none";
    }

    this.container.innerHTML = `
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
      startButton.addEventListener("click", () => this.completeOnboarding());
    }
  }

  async completeOnboarding() {
    await this.setStorage({ [STORAGE.ONBOARDED]: "1" });
    const startButton = document.getElementById("start-button");
    if (startButton) {
      startButton.removeEventListener("click", () => this.completeOnboarding());
    }
    this.startApp();
  }

  startApp() {
    if (this.buttonsContainer) {
      this.buttonsContainer.style.display = "flex";
    }
    this.currentQuote = this.getRandomQuote();
    this.renderInitialApp();
    this.startTimer();
  }

  renderInitialApp() {
    const currentIndex = this.timers.current.index;
    this.container.innerHTML = `
      <div class="timer-container">
        <h1 class="time-label">TIME LEFT IN ${this.timers.all[currentIndex].label}</h1>
        <div id="count">
          <div class="time-unit">00</div>
          <div class="time-separator">:</div>
          <div class="time-unit">00</div>
          <div class="time-separator">:</div>
          <div class="time-unit">00</div>
          <div class="time-separator">:</div>
          <div class="time-unit milliseconds">000</div>
        </div>
        <div class="quote-container">
          <h1 class="quote-label">${this.currentQuote}</h1>
        </div>
      </div>
    `;
    this.countElement = document.getElementById("count");
    this.quoteLabelElement = document.querySelector(".quote-label");
    this.timeLabelElement = document.querySelector(".time-label");
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.updateTimerDisplay(this.getTimeLeft());
    this.timerInterval = setInterval(
      () => this.updateTimerDisplay(this.getTimeLeft()),
      REFRESH_INTERVAL
    );
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.container.innerHTML = "";
    this.countElement = null;
    this.quoteLabelElement = null;
    this.timeLabelElement = null;
  }

  updateTimerDisplay({ hours, minutes, seconds, milliseconds }) {
    if (this.countElement) {
      const timeUnits = this.countElement.querySelectorAll(".time-unit");
      if (timeUnits.length === 4) {
        timeUnits[0].textContent = hours;
        timeUnits[1].textContent = minutes;
        timeUnits[2].textContent = seconds;
        timeUnits[3].textContent = milliseconds;
      }
    }
    if (this.quoteLabelElement) {
      this.quoteLabelElement.textContent = this.currentQuote;
    }
  }

  getTimeLeft() {
    const now = new Date();
    const currentIndex = this.timers.current.index;
    const targetTimer = this.timers.all[currentIndex];
    const targetDate = new Date();
    targetDate.setHours(targetTimer.hour);
    targetDate.setMinutes(targetTimer.minute);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);

    const timeLeftMs = targetDate.getTime() - now.getTime();

    if (timeLeftMs <= 0) {
      return {
        hours: "00",
        minutes: "00",
        seconds: "00",
        milliseconds: "000",
      };
    }

    const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const minutesLeft = Math.floor(
      (timeLeftMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsLeft = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
    const msLeft = Math.floor(timeLeftMs % 1000);

    return {
      hours: hoursLeft.toString().padStart(2, "0"),
      minutes: minutesLeft.toString().padStart(2, "0"),
      seconds: secondsLeft.toString().padStart(2, "0"),
      milliseconds: Math.max(0, Math.min(999, msLeft))
        .toString()
        .padStart(3, "0"),
    };
  }

  async toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    await this.setStorage({ [STORAGE.MODE]: this.isDarkMode ? "1" : "0" });
    this.applyTheme();
  }

  applyTheme() {
    const theme = THEMES[this.isDarkMode ? "dark" : "light"];

    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
    document.body.style.setProperty("--bg-color", theme.backgroundColor);

    this.updateButtonTheme(
      this.themeButton,
      theme.themeIcon,
      "Theme Icon",
      theme.textColor,
      theme.backgroundColor
    );
    this.updateButtonTheme(
      this.settingsButton,
      theme.settingsIcon,
      "Settings Icon",
      theme.textColor,
      theme.backgroundColor
    );
    this.updateButtonTheme(
      this.nextTimerButton,
      theme.nextTimerIcon,
      "Next Timer",
      theme.textColor,
      theme.backgroundColor
    );
  }

  updateButtonTheme(button, iconSrc, altText, textColor, bgColor) {
    if (button) {
      button.innerHTML = `<img src="${iconSrc}" alt="${altText}" width="24" height="24"/>`;
      button.style.color = textColor;
      button.style.borderColor = `${textColor}40`;
      button.style.backgroundColor = `${bgColor}CC`;
    }
  }

  async toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    await this.setStorage({
      [STORAGE.SETTINGS]: this.isSettingsOpen ? "1" : "0",
    });
    this.stopTimer();
    // Here you would likely show your settings UI
    // For this example, we'll just log it.
    console.log("Settings toggled:", this.isSettingsOpen);
  }

  async changeTimer() {
    if (this.timers.all.length > 0) {
      this.timers.current.index =
        (this.timers.current.index + 1) % this.timers.all.length;
      await this.setStorage({ [STORAGE.TIMERS]: this.timers });
      if (this.timeLabelElement) {
        this.timeLabelElement.textContent = `TIME LEFT IN ${
          this.timers.all[this.timers.current.index].label
        }`;
      }
      this.updateTimerDisplay(this.getTimeLeft());
    }
  }

  // Method to add or update a timer (for user configuration)
  // async setCustomTimer(hour, minute, label) {
  //   const newTimer = {
  //     hour: parseInt(hour, 10),
  //     minute: parseInt(minute, 10),
  //     label,
  //   };
  //   this.timers.all = this.timers.all.push(newTimer);
  //   this.timers.current.index = 0;
  //   await this.setStorage({ [STORAGE.TIMERS]: this.timers });
  //   if (this.timeLabelElement) {
  //     this.timeLabelElement.textContent = `TIME LEFT IN ${newTimer.label}`;
  //   }
  //   this.startTimer();
  // }

  // Example of how you might call setCustomTimer from a UI interaction:
  // document.getElementById('save-timer').addEventListener('click', () => {
  //   const hourInput = document.getElementById('hour-input').value;
  //   const minuteInput = document.getElementById('minute-input').value;
  //   const labelInput = document.getElementById('label-input').value;
  //   window.timeApp.setCustomTimer(hourInput, minuteInput, labelInput);
  // });
}

document.addEventListener("DOMContentLoaded", () => {
  window.timeApp = new TimeApp("time-app");
});
