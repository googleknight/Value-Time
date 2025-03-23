// Constants for app configuration
const REFRESH_INTERVAL = 80; // Update interval in milliseconds
const DEFAULT_QUOTE = "Make the most of your time.";
const STORAGE_KEYS = {
  ANALYTICS: 'analyticsflag',
  MODE: 'mode'
};

// Analytics constants
const ANALYTICS_EVENTS = {
    NEW_TAB_OPENED: 'new_tab_opened',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    THEME_CHANGE: 'theme_change'
};

const ANALYTICS_CATEGORIES = {
    ENGAGEMENT: 'engagement'
};

const ANALYTICS_LABELS = {
    APP_START: 'app_start',
    FIRST_TIME_USER: 'first_time_user'
};

// Theme configuration for light and dark modes
const THEMES = {
  light: {
    backgroundColor: "#ffffff",
    textColor: "#2c3e50",
    buttonText: "Dark Mode",
    secondaryBg: "#f8f9fa",
    themeIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`
  },
  dark: {
    backgroundColor: "#1a1a1a",
    textColor: "#ecf0f1",
    buttonText: "Light Mode",
    secondaryBg: "#2d2d2d",
    themeIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`
  }
};

class TimeApp {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    this.quotes = {};
    this.currentQuote = DEFAULT_QUOTE;
    this.interval = null;
    this.isOnboarding = !localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    this.boundHandleSubmit = this.handleSubmit.bind(this);
    this.boundToggleTheme = this.toggleTheme.bind(this);
    
    // Set initial mode if not set
    if (!localStorage.getItem(STORAGE_KEYS.MODE)) {
      localStorage.setItem(STORAGE_KEYS.MODE, "0");
    }
    
    this.initializeButtons();
    this.setupEventListeners();
    this.applyTheme();
    this.init();
  }

  // Clean up resources and event listeners
  cleanup() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.el.removeEventListener('submit', this.boundHandleSubmit);
    if (this.modeButton) {
      this.modeButton.removeEventListener('click', this.boundToggleTheme);
    }
  }

  // Initialize theme toggle button
  initializeButtons() {
    this.modeButton = document.getElementById("mode");
    if (this.modeButton) {
      this.modeButton.removeEventListener('click', this.boundToggleTheme);
      this.modeButton.addEventListener('click', this.boundToggleTheme);
      this.modeButton.style.display = this.isOnboarding ? 'none' : 'flex';
    }
  }

  // Set up event listeners for the app
  setupEventListeners() {
    this.el.removeEventListener('submit', this.boundHandleSubmit);
    this.el.addEventListener('submit', this.boundHandleSubmit);
  }

  // Initialize the app and load quotes
  async init() {
    try {
      await this.loadQuotes();
      this.setupEventListeners();
      
      if (localStorage.getItem(STORAGE_KEYS.ANALYTICS) === "on") {
        this.refreshQuote();
        this.startTimeLoop();
        // Track new tab opened
        if (window.analytics) {
          window.analytics.trackEvent(ANALYTICS_EVENTS.NEW_TAB_OPENED, {
            event_category: ANALYTICS_CATEGORIES.ENGAGEMENT,
            event_label: ANALYTICS_LABELS.APP_START
          });
        }
      } else {
        this.renderOnboarding();
      }
    } catch (error) {
      console.error('Failed to initialize TimeApp:', error);
    }
  }

  // Load quotes from JSON file
  async loadQuotes() {
    try {
      const response = await fetch('app/quotes.json');
      this.quotes = await response.json();
    } catch (error) {
      console.error('Error loading quotes:', error);
      this.quotes = {};
    }
  }

  // Refresh the current quote randomly
  refreshQuote() {
    const allQuotes = Object.values(this.quotes).flatMap(data => data.quotes);
    this.currentQuote = allQuotes.length > 0 
      ? allQuotes[Math.floor(Math.random() * allQuotes.length)]
      : DEFAULT_QUOTE;
  }

  // Handle form submissions
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (form.id === 'onboardingForm') {
      this.handleOnboardingSubmit(form);
    } else {
      this.startApp();
    }
  }

  // Handle onboarding form submission
  handleOnboardingSubmit(form) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, "on");
    this.isOnboarding = false;
    
    this.initializeButtons(); // Reinitialize buttons after onboarding
    
    this.refreshQuote();
    this.startTimeLoop();
    this.updateTime();

    // Track onboarding completion
    if (window.analytics) {
      window.analytics.trackEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETE, {
        event_category: ANALYTICS_CATEGORIES.ENGAGEMENT,
        event_label: ANALYTICS_LABELS.FIRST_TIME_USER
      });
    }
  }

  // Start the main app functionality
  startApp() {
    this.cleanup();
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, "on");
    this.isOnboarding = false;
    
    this.initializeButtons(); // Reinitialize buttons when starting app
    
    this.refreshQuote();
    this.startTimeLoop();
  }

  // Toggle between light and dark themes
  toggleTheme(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const currentMode = localStorage.getItem(STORAGE_KEYS.MODE);
    const newMode = currentMode === "0" ? "1" : "0";
    localStorage.setItem(STORAGE_KEYS.MODE, newMode);
    
    this.applyTheme();
    this.updateTime();

    // Track theme change
    if (window.analytics) {
      window.analytics.trackEvent(ANALYTICS_EVENTS.THEME_CHANGE, {
        theme: newMode === "1" ? 'dark' : 'light'
      });
    }
  }

  // Render the onboarding screen
  renderOnboarding() {
    this.cleanup();
    const theme = THEMES[localStorage.getItem(STORAGE_KEYS.MODE) === "0" ? 'light' : 'dark'];
    
    if (this.modeButton) this.modeButton.style.display = 'none';
    
    this.el.innerHTML = `
      <div class="onboarding">
        <div class="onboarding-content" style="color: ${theme.textColor}">
          <h1>Welcome to ValueTime!</h1>
          <p>Start your journey towards better time management.</p>
          <form id="onboardingForm">
            <button type="submit" class="start-button">Start Using ValueTime</button>
          </form>
        </div>
      </div>
    `;

    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.setProperty('--bg-color', theme.backgroundColor);

    const form = document.getElementById('onboardingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleOnboardingSubmit(form);
      });
    }
  }

  // Start the time update loop
  startTimeLoop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.updateTime(), REFRESH_INTERVAL);
  }

  // Update the displayed time
  updateTime() {
    if (!this.isOnboarding) {
      const timeLeft = this.calculateTimeLeft();
      this.render(timeLeft);
    }
  }

  // Calculate remaining time in the day
  calculateTimeLeft() {
    const now = new Date();
    const hours = this.formatTimeUnit(24 - now.getHours() - (now.getMinutes() > 0 || now.getSeconds() > 0 ? 1 : 0));
    const minutes = this.formatTimeUnit(now.getSeconds() > 0 ? 59 - now.getMinutes() : 60 - now.getMinutes());
    const seconds = this.formatTimeUnit(60 - now.getSeconds());
    const milliseconds = this.formatMilliseconds(1000 - now.getMilliseconds());

    return { hours, minutes, seconds, milliseconds };
  }

  // Format time units with leading zeros
  formatTimeUnit(value) {
    return value.toString().padStart(2, '0');
  }

  // Format milliseconds with leading zeros
  formatMilliseconds(value) {
    const normalizedValue = Math.max(0, Math.min(999, value));
    return normalizedValue.toString().padStart(3, '0');
  }

  // Apply the current theme
  applyTheme() {
    const currentMode = localStorage.getItem(STORAGE_KEYS.MODE);
    const theme = THEMES[currentMode === "0" ? 'light' : 'dark'];
    
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
    document.body.style.setProperty('--bg-color', theme.backgroundColor);
    
    if (this.modeButton) {
      this.modeButton.innerHTML = theme.themeIcon;
      this.modeButton.style.color = theme.textColor;
      this.modeButton.style.borderColor = `${theme.textColor}40`;
      this.modeButton.style.backgroundColor = `${theme.backgroundColor}CC`;
    }
  }

  // Render the main app view
  render({ hours, minutes, seconds, milliseconds }) {
    if (!this.isOnboarding) {
      this.el.innerHTML = `
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
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.timeApp = new TimeApp('timeapp');
});
