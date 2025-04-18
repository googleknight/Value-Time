import { THEMES, STORAGE } from "../utils/constants.js";

export class ThemeManager {
  constructor(storageManager, domElements) {
    this.storageManager = storageManager;
    this.domElements = domElements;
    this.isDarkMode = false;
  }

  async initialize() {
    // Set up event listeners
    if (this.domElements.themeButton) {
      this.domElements.themeButton.addEventListener("click", () =>
        this.toggleTheme()
      );
    }

    // Load theme preference
    const storage = await this.storageManager.get([STORAGE.MODE]);
    this.isDarkMode = storage[STORAGE.MODE] === "1";
  }

  async toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    await this.storageManager.set({
      [STORAGE.MODE]: this.isDarkMode ? "1" : "0",
    });
    this.applyTheme();
  }

  applyTheme() {
    const theme = THEMES[this.isDarkMode ? "dark" : "light"];

    // Apply to body
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.color = theme.textColor;
    document.body.style.setProperty("--bg-color", theme.backgroundColor);

    if (this.isDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    // Update buttons
    this.updateButtonTheme(
      this.domElements.themeButton,
      theme.themeIcon,
      "Theme Icon",
      theme.textColor,
      theme.backgroundColor
    );
    this.updateButtonTheme(
      this.domElements.settingsButton,
      theme.settingsIcon,
      "Settings Icon",
      theme.textColor,
      theme.backgroundColor
    );
    this.updateButtonTheme(
      this.domElements.nextTimerButton,
      theme.nextTimerIcon,
      "Next Timer",
      theme.textColor,
      theme.backgroundColor
    );

    return theme;
  }

  updateButtonTheme(button, iconSrc, altText, textColor, bgColor) {
    if (button) {
      button.innerHTML = `<img src="${iconSrc}" alt="${altText}" width="24" height="24"/>`;
      button.style.color = textColor;
      button.style.borderColor = `${textColor}40`;
      button.style.backgroundColor = `${bgColor}CC`;
    }
  }
}
