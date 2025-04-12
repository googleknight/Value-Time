import { TimeApp } from "./timeApp.js";

document.addEventListener("DOMContentLoaded", () => {
  window.timeApp = new TimeApp();
  window.timeApp.init();
});
