const { ipcRenderer } = require("electron");

window.addEventListener("message", (event) => {
  if (
    event.source === document.getElementById("feature-iframe").contentWindow &&
    event.data.action === "requestData"
  ) {
    ipcRenderer.send("request-data-channel");
  }
});

window.addEventListener("message", (event) => {
  if (
    event.source === document.getElementById("feature-iframe").contentWindow &&
    event.data.action === "sendData"
  ) {
    ipcRenderer.send("write-data-channel", event.data.data);
  }
});

// Recevoir la réponse du processus principal
ipcRenderer.on("response-data-channel", (event, data) => {
  const iframe = document.getElementById("feature-iframe");
  iframe.contentWindow.postMessage({ action: "responseData", data: data }, "*");
});

ipcRenderer.on('write-response-channel', (event, response) => {
  const iframe = document.getElementById('feature-iframe');
  iframe.contentWindow.postMessage({ action: 'writeResponse', data: response }, '*');
});

function toggleMenu() {
  var menu = document.getElementById("menuDropdown");
  if (menu.style.display === "none" || menu.style.display === "") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}

function loadFeature(featurePath, featureName) {
  document.getElementById("feature-iframe").src = featurePath;
  document.getElementById("feature-title").textContent = featureName;
  document.getElementById("menuDropdown").style.display = "none";
}

// renderer.js
document.addEventListener("DOMContentLoaded", () => {
  loadFeature(
    "features/target_allocation_maintenance/index.html",
    "Target Allocation Maintenance"
  );
});
