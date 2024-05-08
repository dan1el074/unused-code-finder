const { ipcRenderer, ipcMain } = require("electron");

const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const newPlaceholder = document.getElementById("new-placeholder");
const inputSearch = document.querySelector(".input-search");
const alertContainer = document.querySelector(".alert-container");
const runBtn = document.getElementById("btn-run");
const temp = 6000;
let contadorAlert = 0;
let showDialog = false;

// mandando att pro backend
searchBtn.addEventListener("click", () => {
  if (!showDialog) {
    alertContainer.innerHTML = "";
    runBtn.style.backgroundColor = "#1689fc";
    runBtn.style.transition = "1s";
    ipcRenderer.send("action/showDialog");
    showDialog = true;
  }
});

inputSearch.addEventListener("click", () => {
  if (!showDialog) {
    ipcRenderer.send("action/showDialog");
    showDialog = true;
  }
});

// recebendo att do backend
ipcRenderer.on("set/fileName", (event, data) => {
  placeholder.style.display = "none";
  inputSearch.style.border = "2px solid #fff";
  newPlaceholder.style.display = "inline";
  newPlaceholder.innerHTML = data;
  error.style.display = "none";
  showDialog = false;
});

ipcRenderer.on("action/notShowDialog", () => {
  showDialog = false;
});

ipcRenderer.on("action/finished", () => {
  runBtn.style.backgroundColor = "#00E500";
  runBtn.style.transition = "1s";
});

ipcRenderer.on("message/notice", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("notice");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);

  setTimeout(() => {
    document.getElementById(`alert${contador}`).remove();
  }, temp)
});

ipcRenderer.on("message/sucess", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("sucess");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);

  setTimeout(() => {
    document.getElementById(`alert${contador}`).remove();
  }, temp)
});

ipcRenderer.on("message/sucessPlus", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("sucess");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);
});

ipcRenderer.on("message/error", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("erro");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);
});

ipcRenderer.on("message/simpleError", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("simple-erro");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);

  setTimeout(() => {
    document.getElementById(`alert${contador}`).remove();
  }, temp)
});
