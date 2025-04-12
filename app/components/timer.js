export class TimerComponent {
  constructor(uiManager) {
    this.uiManager = uiManager;
  }

  render(label, quote) {
    this.uiManager.domElements.container.innerHTML = `
        <div class="timer-container">
          <h1 class="timer-label">TIME LEFT IN ${label}</h1>
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
            <h1 class="quote-label">${quote}</h1>
          </div>
        </div>
      `;
    this.uiManager.domElements.countElement = document.getElementById("count");
    this.uiManager.domElements.quoteLabelElement =
      document.querySelector(".quote-label");
    this.uiManager.domElements.timeLabelElement =
      document.querySelector(".timer-label");
  }
}
