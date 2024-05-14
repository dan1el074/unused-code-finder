const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const XLSX = require("xlsx");

let window = null;
let data = {
  path: "",
  savePath: "",
  fileName: "",
  codes: [],
  oldCodes: [],
  allCodes: [],
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
    window.webContents.send("action/notShowDialog");
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

// Executar aplicação
ipcMain.on("app/run", () => {
  runApplication();
});

async function runApplication() {
  const workbook = XLSX.readFile(data.path);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const resExcel = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  window.webContents.send("message/notice", "Processando arquivo");
  data.codes = [];
  data.allCodes = [];
  data.oldCodes = [];
  data.savePath = "";

  resExcel.forEach((array) => {
    let onlyCodes = String(array[0]).match(/\d{3,9}-?\d{1,3}/);
    if (onlyCodes) {
      data.allCodes.push(onlyCodes.input);
    }

    let onlyCodesWithHifen = String(array[0]).match(/\d+-\d+/);
    if (onlyCodesWithHifen) {
      data.codes.push(onlyCodes.input);
    }
  });

  if (data.codes.length <= 0) {
    setTimeout(() => {
      window.webContents.send(
        "message/simpleError",
        "Erro: nenhum código com revisão encontrado!"
      );
    }, 500);

    return
  }

  data.codes.forEach((code) => {
    const codeArray = code.split("-");
    let counter =
      Number(String(codeArray[1])[0]) == 0
        ? Number(String(codeArray[1]).slice(1))
        : Number(String(codeArray[1]));

    if (counter == 1) {
      let verifiedCode = data.allCodes.find((res) => res == codeArray[0]);

      if (verifiedCode) {
        let verifyVerifiedCode = data.oldCodes.find(
          (res) => res == verifiedCode
        );
        if (!verifyVerifiedCode) {
          data.oldCodes.push(verifiedCode);
        }
      }
    }

    let found = data.codes.find((code) => {
      if (counter >= 9) {
        return code == `${codeArray[0]}-${counter + 1}`;
      } else {
        return code == `${codeArray[0]}-0${counter + 1}`;
      }
    });

    if (found) {
      return;
    }

    if (counter == 1) {
      return;
    }

    for (i=counter-1; i>=0; i--) {
      let verifiedCode;

      if (i >= 10) {
        verifiedCode = data.codes.find((res) => res === `${codeArray[0]}-${i}`);
      } else if (i === 0) {
        verifiedCode = data.allCodes.find((res) => res === `${codeArray[0]}`);
      } else {
        verifiedCode = data.codes.find(
          (res) => res === `${codeArray[0]}-0${i}`
        );
      }

      if (verifiedCode) {
        let verifyVerifiedCode = data.oldCodes.find(
          (res) => res === verifiedCode
        );
        if (!verifyVerifiedCode) {
          data.oldCodes.push(verifiedCode);
        }
      }
    }
  });

  if(data.oldCodes.length <= 0) {
    setTimeout(() => {
      window.webContents.send(
        "message/simpleError",
        "Nenhum código obsoleto encontrado!"
      );
    }, 500)
    return
  }

  setTimeout(() => {
    window.webContents.send(
      "message/sucess",
      "Alguns códigos foram encontrados"
    );
  }, 500)

  const newWorkbook = XLSX.utils.book_new();
  const sheetData = data.oldCodes.map((item) => [item]);
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);

  XLSX.utils.book_append_sheet(newWorkbook, sheet, "Result");

  dialog
    .showSaveDialog({
      title: "Salve o novo arquivo!",
      defaultPath: app.getPath("desktop"),
      filters: [{ name: "Arquivos Excel", extensions: ["xlsx"] }],
    })
    .then((result) => {
      return new Promise((resolve, reject) => {
        if (!result.canceled) {
          data.savePath = result.filePath;
          XLSX.writeFile(newWorkbook, data.savePath);
        } else {
          setTimeout(() => {
            window.webContents.send(
              "message/simpleError",
              "Operação cancelada"
            );
          }, 500)
          return
        }

        setTimeout(() => {
          window.webContents.send(
            "message/sucessPlus",
            "Códigos salvos com sucesso!"
          );
          window.webContents.send("action/finished");
        }, 500)
        resolve();
      });
    })
    .catch((err) => {
      setTimeout(() => {
        window.webContents.send(
          "message/error",
          `Ocorreu um erro ao exibir a caixa de diálogo: ${err}`
        );
      }, 1000);
    });
}
