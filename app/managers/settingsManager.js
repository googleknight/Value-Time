import { STORAGE, DEFAULT_TIMER } from "../utils/constants.js";

export class SettingsManager {
  constructor(storageManager, timerManager) {
    this.storageManager = storageManager;
    this.timerManager = timerManager;
    this.timers = [];
    this.isSettingsOpen = false;
  }

  async initialize() {
    // Get current timers from timerManager
    this.timers = [...this.timerManager.timers.all];

    // Get settings state
    const storage = await this.storageManager.get([STORAGE.SETTINGS]);
    this.isSettingsOpen = storage[STORAGE.SETTINGS] === "1";

    return this.timers;
  }

  async toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    await this.storageManager.set({
      [STORAGE.SETTINGS]: this.isSettingsOpen ? "1" : "0",
    });
    return this.isSettingsOpen;
  }

  async addTimer(timerData) {
    // Add the new timer
    this.timers.push(timerData);
    await this.saveTimers();
    return this.timers;
  }

  async updateTimer(index, timerData) {
    // Don't allow updating the default timer
    if (this.isDefaultTimer(this.timers[index])) {
      throw new Error("The default timer cannot be edited.");
    }

    // Update the timer
    this.timers[index] = timerData;
    await this.saveTimers();
    return this.timers;
  }

  async deleteTimer(index) {
    // Don't allow deleting the default timer
    if (this.isDefaultTimer(this.timers[index])) {
      throw new Error("The default timer cannot be deleted.");
    }

    // Prevent deleting the last timer
    if (this.timers.length <= 1) {
      throw new Error("You must have at least one timer");
    }

    // Remove the timer
    this.timers.splice(index, 1);

    // Handle current timer index updates
    if (index === this.timerManager.timers.current.index) {
      this.timerManager.timers.current.index = 0;
    } else if (index < this.timerManager.timers.current.index) {
      // If we deleted a timer before the current one, decrement the index
      this.timerManager.timers.current.index--;
    }

    await this.saveTimers();
    return this.timers;
  }

  isDefaultTimer(timer) {
    return (
      timer.label === DEFAULT_TIMER.label &&
      timer.hour === DEFAULT_TIMER.hour &&
      timer.minute === DEFAULT_TIMER.minute
    );
  }

  convertTo12Hour(hour24, minute) {
    let period = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;

    // Convert hour 0 to 12 for 12 AM
    if (hour12 === 0) {
      hour12 = 12;
    }

    return {
      hour: hour12,
      minute: minute,
      period: period,
    };
  }

  convertTo24Hour(hour12, minute, period) {
    // Convert hour 12 to 0 for calculation purposes
    if (hour12 === 12) {
      hour12 = 0;
    }

    // If period is PM, add 12 hours
    let hour24 = period.toLowerCase() === "pm" ? hour12 + 12 : hour12;

    return {
      hour: hour24,
      minute: minute,
    };
  }

  async saveTimers() {
    // Update the timer manager's timers
    this.timerManager.timers.all = [...this.timers];

    // Save to storage
    await this.storageManager.set({
      [STORAGE.TIMERS]: this.timerManager.timers,
    });

    return this.timers;
  }
}
