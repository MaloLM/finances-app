const { app, BrowserWindow, ipcMain } = require("electron");
const { readJsonFile, writeJsonFile } = require("./services/dataFiles");
const {
  run_tam_optimization,
} = require("./services/targetAllocationMaintenance");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile("./src/renderer/index.html");
}

// Quit the Electron app when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Create the main window when the Electron app is activated.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// IPC communications -----------------------------

ipcMain.on("write-data-channel", (event, data) => {
  writeJsonFile("tam_form_data.json", data);

  let { data: struct, res } = run_tam_optimization(data);

  writeJsonFile("tam_form_data.json", struct);

  event.sender.send("write-response-channel", {
    status: "tam-result",
    message: res,
  });
});

ipcMain.on("request-data-channel", async (event) => {
  try {
    const data = await readJsonFile("tam_form_data.json");
    event.sender.send("response-data-channel", data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    event.sender.send("response-data-channel", {
      error: "Failed to read JSON file",
    });
  }
});
