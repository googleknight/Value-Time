export class SettingsComponent {
  constructor(uiManager, settingsManager) {
    this.uiManager = uiManager;
    this.settingsManager = settingsManager;
    this.domElements = uiManager.domElements;
    this.timers = [];
    this.editingIndex = null;
  }

  async initialize() {
    // Get the current timers
    this.timers = await this.settingsManager.initialize();
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.domElements.container.innerHTML = `
      <div class="settings-container">
        <h1 class="settings-title">Timer Settings</h1>
        
        <div class="add-timer-section">
          <h2>Add New Timer</h2>
          <div class="add-timer-form">
            <div class="input-group">
              <label for="new-timer-label">Label:</label>
              <input type="text" id="new-timer-label" placeholder="e.g. Work, Break, Lunch">
            </div>
            <div class="input-group time-inputs">
              <label>Time:</label>
              <div class="time-selector">
                <input type="number" id="new-timer-hour" min="1" max="12" placeholder="Hour" class="hour-input">
                <span>:</span>
                <input type="number" id="new-timer-minute" min="0" max="59" placeholder="Min" class="minute-input">
                <select id="new-timer-period" class="period-select">
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </div>
            </div>
            <button id="add-timer-btn" class="action-button add-button">Add Timer</button>
          </div>
        </div>
        
        <div class="timers-list-section">
          <h2>Your Timers</h2>
          <div id="timers-list" class="timers-list">
            ${this.renderTimersList()}
          </div>
        </div>
      </div>
    `;

    // Update DOM references
    this.domElements.updateSettingsElements();
  }

  renderTimersList() {
    if (this.timers.length === 0) {
      return `<div class="no-timers-message">No timers added yet. Create your first timer above!</div>`;
    }

    return this.timers
      .map((timer, index) => {
        const isCurrentTimer =
          index === this.settingsManager.timerManager.timers.current.index;
        const currentClass = isCurrentTimer ? "current-timer" : "";
        const timeObject = this.settingsManager.convertTo12Hour(
          timer.hour,
          timer.minute
        );

        // Check if this is the default timer (first timer at index 0)
        const isDefaultTimer =
          index === 0 && this.settingsManager.isDefaultTimer(timer);
        const defaultTimerClass = isDefaultTimer ? "default-timer" : "";

        return `
        <div class="timer-item ${currentClass} ${defaultTimerClass}" data-index="${index}">
          <div class="timer-info">
            <div class="timer-label">${timer.label}${
          isDefaultTimer ? " (Default)" : ""
        }</div>
            <div class="timer-time">${timeObject.hour}:${timeObject.minute
          .toString()
          .padStart(2, "0")} ${timeObject.period}</div>
            ${
              isCurrentTimer
                ? '<div class="timer-current-tag">Current Timer</div>'
                : ""
            }
          </div>
          <div class="timer-actions">
            <button class="edit-btn" data-action="edit" data-index="${index}" ${
          isDefaultTimer ? "disabled" : ""
        }>
              Edit
            </button>
            <button class="delete-btn" data-action="delete" data-index="${index}" ${
          this.timers.length <= 1 || isDefaultTimer ? "disabled" : ""
        }>Delete</button>
          </div>
          ${
            this.editingIndex === index ? this.renderEditForm(timer, index) : ""
          }
        </div>
      `;
      })
      .join("");
  }

  renderEditForm(timer, index) {
    const timeObject = this.settingsManager.convertTo12Hour(
      timer.hour,
      timer.minute
    );

    return `
      <div class="edit-container" data-edit-index="${index}">
        <div class="input-group">
          <label for="edit-label-${index}">Label:</label>
          <input type="text" id="edit-label-${index}" value="${timer.label}">
        </div>
        <div class="input-group">
          <label>Time:</label>
          <div class="time-selector">
            <input type="number" id="edit-hour-${index}" min="1" max="12" value="${
      timeObject.hour
    }" class="hour-input">
            <span>:</span>
            <input type="number" id="edit-minute-${index}" min="0" max="59" value="${
      timeObject.minute
    }" class="minute-input">
            <select id="edit-period-${index}" class="period-select">
              <option value="am" ${
                timeObject.period === "AM" ? "selected" : ""
              }>AM</option>
              <option value="pm" ${
                timeObject.period === "PM" ? "selected" : ""
              }>PM</option>
            </select>
          </div>
        </div>
        <div class="edit-actions">
          <button class="action-button cancel-btn" data-action="cancel" data-index="${index}">Cancel</button>
          <button class="action-button save-btn" data-action="save" data-index="${index}">Save</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Add timer button
    if (this.domElements.addTimerButton) {
      this.domElements.addTimerButton.addEventListener("click", () =>
        this.handleAddTimer()
      );
    }

    // Input validation for hours
    const hourInputs = document.querySelectorAll(".hour-input");
    hourInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
          e.target.value = "";
        } else if (value > 12) {
          e.target.value = "12";
        }
      });
    });

    // Input validation for minutes
    const minuteInputs = document.querySelectorAll(".minute-input");
    minuteInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
          e.target.value = "0";
        } else if (value > 59) {
          e.target.value = "59";
        }
      });
    });

    // Delegate event listeners for timer actions
    if (this.domElements.timersListElement) {
      this.domElements.timersListElement.addEventListener("click", (e) => {
        const target = e.target;
        if (target.dataset.action) {
          const action = target.dataset.action;
          const index = parseInt(target.dataset.index);

          switch (action) {
            case "edit":
              this.handleEditTimer(index);
              break;
            case "delete":
              this.handleDeleteTimer(index);
              break;
            case "save":
              this.handleSaveTimer(index);
              break;
            case "cancel":
              this.handleCancelEdit();
              break;
          }
        }
      });
    }
  }

  async handleAddTimer() {
    const label = this.domElements.newTimerLabelInput.value.trim();
    const hour12 = parseInt(this.domElements.newTimerHourInput.value);
    const minute = parseInt(this.domElements.newTimerMinuteInput.value);
    const period = this.domElements.newTimerPeriodSelect.value;

    // Validate inputs
    if (!label) {
      alert("Please enter a label for your timer");
      return;
    }

    if (isNaN(hour12) || hour12 < 1 || hour12 > 12) {
      alert("Please enter a valid hour (1-12)");
      return;
    }

    if (isNaN(minute) || minute < 0 || minute > 59) {
      alert("Please enter a valid minute (0-59)");
      return;
    }

    // Convert to 24-hour time format
    const time24 = this.settingsManager.convertTo24Hour(hour12, minute, period);

    try {
      // Add the new timer using the settings manager
      this.timers = await this.settingsManager.addTimer({
        label,
        hour: time24.hour,
        minute: time24.minute,
      });

      // Clear the form
      this.domElements.newTimerLabelInput.value = "";
      this.domElements.newTimerHourInput.value = "";
      this.domElements.newTimerMinuteInput.value = "";
      this.domElements.newTimerPeriodSelect.value = "am";

      // Re-render the list
      this.domElements.timersListElement.innerHTML = this.renderTimersList();
    } catch (error) {
      alert(error.message);
    }
  }

  handleEditTimer(index) {
    // Check if trying to edit the default timer
    if (
      index === 0 &&
      this.settingsManager.isDefaultTimer(this.timers[index])
    ) {
      alert("The default timer cannot be edited.");
      return;
    }

    this.editingIndex = index;
    this.domElements.timersListElement.innerHTML = this.renderTimersList();

    // Get the edit form elements for this index and set up validation
    const formElements = this.domElements.getEditFormElements(index);

    if (formElements.hourInput) {
      formElements.hourInput.addEventListener("input", (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
          e.target.value = "1";
        } else if (value > 12) {
          e.target.value = "12";
        }
      });
    }

    if (formElements.minuteInput) {
      formElements.minuteInput.addEventListener("input", (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
          e.target.value = "0";
        } else if (value > 59) {
          e.target.value = "59";
        }
      });
    }
  }

  handleCancelEdit() {
    this.editingIndex = null;
    this.domElements.timersListElement.innerHTML = this.renderTimersList();
  }

  async handleSaveTimer(index) {
    const formElements = this.domElements.getEditFormElements(index);
    const label = formElements.labelInput.value.trim();
    const hour12 = parseInt(formElements.hourInput.value);
    const minute = parseInt(formElements.minuteInput.value);
    const period = formElements.periodSelect.value;

    // Validate inputs
    if (!label) {
      alert("Please enter a label for your timer");
      return;
    }

    if (isNaN(hour12) || hour12 < 1 || hour12 > 12) {
      alert("Please enter a valid hour (1-12)");
      return;
    }

    if (isNaN(minute) || minute < 0 || minute > 59) {
      alert("Please enter a valid minute (0-59)");
      return;
    }

    // Convert to 24-hour time format
    const time24 = this.settingsManager.convertTo24Hour(hour12, minute, period);

    try {
      // Update the timer using the settings manager
      this.timers = await this.settingsManager.updateTimer(index, {
        label,
        hour: time24.hour,
        minute: time24.minute,
      });

      this.editingIndex = null;

      // Re-render the list
      this.domElements.timersListElement.innerHTML = this.renderTimersList();
    } catch (error) {
      alert(error.message);
    }
  }

  async handleDeleteTimer(index) {
    try {
      if (confirm("Are you sure you want to delete this timer?")) {
        // Delete the timer using the settings manager
        this.timers = await this.settingsManager.deleteTimer(index);

        // Re-render the list
        this.domElements.timersListElement.innerHTML = this.renderTimersList();
      }
    } catch (error) {
      alert(error.message);
    }
  }
}
