const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const XLSX = require("xlsx");

let window = null;
let data = {
  path: "",
  fileName: "",
  printers: [],
  printer: "",
  codes: [],
  temporaryFile: "resources/app/temp/result.pdf",
};

app.whenReady().then(createWindow);

async function createWindow() {
  window = new BrowserWindow({
    icon: path.join(__dirname, "/src/images/icon.ico"),
    width: 500,
    height: 300,
    maxWidth: 500,
    maxHeight: 300,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  await window.loadFile("./src/pages/index.html");
  getPrinters();
}

// comandos dos botões da janela
ipcMain.on("app/minimize", () => {
  window.minimize();
});

ipcMain.on("app/close", () => {
  app.quit();
});

// menu bar
const menuTemplate = [];
const menu = new Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// recuperar pasta
ipcMain.on("action/showDialog", () => {
  getPath();
});

async function getPath() {
  let dialogPath = await dialog.showOpenDialog({
    defaultPath: app.getPath("desktop"),
  });

  if (dialogPath.canceled) {
    window.webContents.send("notShow/dialog");
    return false;
  }

  const folderPath = String(dialogPath.filePaths).replace("\\\\", "\\");
  const arrayFolder = folderPath.split("\\");
  const fileName = arrayFolder[arrayFolder.length - 1];

  if (arrayFolder[1] === "metaro-server") {
    data.path = "\\" + folderPath;
  } else {
    data.path = folderPath;
  }

  data.fileName = fileName;
  window.webContents.send("set/fileName", fileName);
}