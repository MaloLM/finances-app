const { ipcRenderer } = require("electron");

/**
 * Listens for the 'message' event from a specific iframe (feature-iframe) in the window.
 * When a message with the action 'requestData' is received from the iframe,
 * a request is sent via ipcRenderer to the 'request-data-channel'.
 */
window.addEventListener("message", (event) => {
  if (
    event.source === document.getElementById("feature-iframe").contentWindow &&
    event.data.action === "requestData"
  ) {
    ipcRenderer.send("request-data-channel");
  }
});

/**
 * Listens for the 'message' event from a specific iframe (feature-iframe) in the window.
 * When a message with the action 'sendData' is received from the iframe,
 * the included data is sent via ipcRenderer to the 'write-data-channel'.
 *
 * @param {MessageEvent} event - The message event containing data to be sent.
 */
window.addEventListener("message", (event) => {
  if (
    event.source === document.getElementById("feature-iframe").contentWindow &&
    event.data.action === "sendData"
  ) {
    ipcRenderer.send("write-data-channel", event.data.data);
  } else if (
    event.source === document.getElementById("feature-iframe").contentWindow &&
    event.data.action === "updateConfig"
  ) {
    ipcRenderer.send("update-tam-config", event.data.data);
  }
});

/**
 * Event listener for 'response-data-channel' from ipcRenderer.
 * It sends a message to the contentWindow of the 'feature-iframe' element with the received data.
 *
 * @param {Event} event - The event object from ipcRenderer.
 * @param {Object} data - The data received from the main process.
 */
ipcRenderer.on("response-data-channel", (event, data) => {
  const iframe = document.getElementById("feature-iframe");

  iframe.contentWindow.postMessage({ action: "responseData", data: data }, "*");
});

/**
 * Event listener for 'write-response-channel' from ipcRenderer.
 * It sends a message to the contentWindow of the 'feature-iframe' element with the write operation response.
 *
 * @param {Event} event - The event object from ipcRenderer.
 * @param {Object} response - The response data from the main process after a write operation.
 */
ipcRenderer.on("write-response-channel", (event, response) => {
  const iframe = document.getElementById("feature-iframe");
  iframe.contentWindow.postMessage(
    { action: "writeResponse", data: response },
    "*"
  );
});

/**
 * Toggles the display of the menu dropdown.
 * If the menu is currently not visible or has an empty display style, it sets the display to 'flex'.
 * Otherwise, it sets the display to 'none'.
 */
function toggleMenu() {
  var menu = document.getElementById("menuDropdown");
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}

/**
 * Loads a specified feature into the 'feature-iframe' and updates the feature title.
 * Also, hides the menu dropdown.
 *
 * @param {string} featurePath - The path to the feature's HTML file to be loaded into the iframe.
 * @param {string} featureName - The name of the feature to be displayed as the title.
 */
function loadFeature(featurePath, featureName) {
  document.getElementById("feature-iframe").src = featurePath;
  document.getElementById("feature-title").textContent = featureName;
  document.getElementById("menuDropdown").style.display = "none";
}

/**
 * Sets up initial state when the DOM content is fully loaded.
 * It loads the 'Target Allocation Maintenance' feature into the iframe.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadFeature(
    "target_allocation_maintenance/index.html",
    "Target Allocation Maintenance"
  );
});
