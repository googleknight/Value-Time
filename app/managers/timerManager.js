import { DEFAULT_TIMER, STORAGE } from "../utils/constants.js";
import { REFRESH_INTERVAL } from "../utils/constants.js";

export class TimerManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.timers = { current: { index: 0 }, all: [] };
    this.timerInterval = null;
  }

  async initialize() {
    const storage = await this.storageManager.get([STORAGE.TIMERS]);
    if (
      storage[STORAGE.TIMERS] &&
      Array.isArray(storage[STORAGE.TIMERS].all) &&
      storage[STORAGE.TIMERS].all.length > 0
    ) {
      this.timers = storage[STORAGE.TIMERS];
      if (this.timers.current.index >= this.timers.all.length) {
        this.timers.current.index = 0;
      }
    } else {
      this.initializeDefaultTimers();
      await this.storageManager.set({ [STORAGE.TIMERS]: this.timers });
    }
  }

  initializeDefaultTimers() {
    this.timers.current = { index: 0 };
    this.timers.all = [DEFAULT_TIMER];
  }

  startTimer(callback) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    callback(this.getTimeLeft());
    this.timerInterval = setInterval(
      () => callback(this.getTimeLeft()),
      REFRESH_INTERVAL
    );
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
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

  async changeTimer() {
    if (this.timers.all.length > 0) {
      this.timers.current.index =
        (this.timers.current.index + 1) % this.timers.all.length;
      await this.storageManager.set({ [STORAGE.TIMERS]: this.timers });
      return this.timers.all[this.timers.current.index].label;
    }
    return "";
  }

  getCurrentTimerLabel() {
    return this.timers.all[this.timers.current.index]?.label || "";
  }
}
