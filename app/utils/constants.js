export const REFRESH_INTERVAL = 80; // milliseconds
export const DEFAULT_QUOTE = "Make the most of your time.";
export const DEFAULT_TIMER = { hour: 24, minute: 0, label: "Day" };
export const STORAGE = {
  MODE: "mode",
  ONBOARDED: "onboarded",
  SETTINGS: "settings",
  TIMERS: "timers",
};
export const THEMES = {
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
