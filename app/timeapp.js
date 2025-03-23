// Constants
const REFRESH_INTERVAL = 80;
const DEFAULT_QUOTE = "Make the most of your time.";
const THEMES = {
  light: {
    backgroundColor: "white",
    textColor: "black",
    buttonText: "Dark Mode"
  },
  dark: {
    backgroundColor: "black",
    textColor: "white",
    buttonText: "Light Mode"
  }
};

class TimeApp {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    this.quotes = [];
    this.currentQuote = DEFAULT_QUOTE;
    this.interval = null;
    
    this.init();
  }

  async init() {
    try {
      await this.loadQuotes();
      this.setupEventListeners();
      
      if (localStorage.analyticsflag === "on") {
        this.refreshQuote();
        this.startTimeLoop();
      } else {
        this.renderWelcome();
      }
    } catch (error) {
      console.error('Failed to initialize TimeApp:', error);
    }
  }

  async loadQuotes() {
    try {
      const response = await fetch('app/quotes.json');
      this.quotes = await response.json();
    } catch (error) {
      console.error('Error loading quotes:', error);
      this.quotes = [DEFAULT_QUOTE];
    }
  }

  setupEventListeners() {
    this.el.addEventListener('submit', this.handleSubmit.bind(this));
    window.addEventListener('load', () => {
      if (localStorage.analyticsflag === "on") {
        this.refreshQuote();
      }
    });
  }

  refreshQuote() {
    if (this.quotes.length > 0) {
      const index = Math.floor(Math.random() * this.quotes.length);
      this.currentQuote = this.quotes[index];
    } else {
      this.currentQuote = DEFAULT_QUOTE;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const modeButton = document.getElementById("mode");
    modeButton.style.display = 'block';
    modeButton.addEventListener("click", this.toggleTheme);
    
    localStorage.analyticsflag = "on";
    localStorage.mode = "0";
    
    this.refreshQuote();
    this.startTimeLoop();
  }

  toggleTheme() {
    localStorage.mode = localStorage.mode === "0" ? "1" : "0";
  }

  startTimeLoop() {
    this.interval = setInterval(() => this.updateTime(), REFRESH_INTERVAL);
  }

  updateTime() {
    const timeLeft = this.calculateTimeLeft();
    this.applyTheme();
    this.render(timeLeft);
  }

  calculateTimeLeft() {
    const now = new Date();
    const hours = this.formatTimeUnit(24 - now.getHours() - (now.getMinutes() > 0 || now.getSeconds() > 0 ? 1 : 0));
    const minutes = this.formatTimeUnit(now.getSeconds() > 0 ? 59 - now.getMinutes() : 60 - now.getMinutes());
    const seconds = this.formatTimeUnit(60 - now.getSeconds());
    const milliseconds = this.formatMilliseconds(1000 - now.getMilliseconds());

    return { hours, minutes, seconds, milliseconds };
  }

  formatTimeUnit(value) {
    return value.toString().padStart(2, '0');
  }

  formatMilliseconds(value) {
    return value.toString().padStart(3, '0');
  }

  applyTheme() {
    const theme = THEMES[localStorage.mode === "0" ? 'light' : 'dark'];
    const modeButton = document.getElementById("mode");
    
    document.body.style.backgroundColor = theme.backgroundColor;
    modeButton.value = theme.buttonText;
    modeButton.style.color = theme.textColor;
    modeButton.style.backgroundColor = theme.backgroundColor;
    modeButton.style.borderColor = theme.textColor;
  }

  render({ hours, minutes, seconds, milliseconds }) {
    requestAnimationFrame(() => {
      this.el.innerHTML = `
        <h1 class="time-label">TIME LEFT IN DAY</h1>
        <div id="count">
          <h2 class="count">${hours}:${minutes}:${seconds}:${milliseconds}</h2>
        </div>
        <br>
        <h1 class="quote-label">${this.currentQuote}</h1>
      `;
    });
  }

  renderWelcome() {
    this.el.innerHTML = `
      <form>
        <footer>
          <button type="submit" id="welcomebutton">Let's begin!</button>
        </footer>
      </form>
    `;
  }
}

// Initialize the app
new TimeApp('timeapp');
