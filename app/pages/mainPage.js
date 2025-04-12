import { TimerComponent } from "../components/timer.js";

export class MainPage {
  constructor(uiManager, timerManager, quoteManager, themeManager) {
    this.uiManager = uiManager;
    this.timerManager = timerManager;
    this.quoteManager = quoteManager;
    this.themeManager = themeManager;
    this.timerComponent = new TimerComponent(uiManager);
  }

  render() {
    const quote = this.quoteManager.getRandomQuote();
    const label = this.timerManager.getCurrentTimerLabel();
    this.uiManager.showButtons();
    this.timerComponent.render(label, quote);
    this.uiManager.setQuote(quote);
    this.timerManager.startTimer((time) =>
      this.uiManager.updateTimerDisplay(time)
    );
  }

  destroy() {
    this.timerManager.stopTimer();
    this.uiManager.clearContainer();
  }
}
