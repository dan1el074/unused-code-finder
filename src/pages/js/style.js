runBtn.addEventListener("click", () => {
  const fileSpan = document.getElementById("new-placeholder");
  const regex = /\.[^.]+$/;

  if (fileSpan.innerHTML) {
    if (fileSpan.innerHTML.match(regex) == ".xlsx") {
      ipcRenderer.send("app/run");
    } else {
      inputSearch.style.border = "2px solid red";
      inputSearch.style.animation =
        "shake 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both";
      error.style.display = "block";
      error.innerHTML = "Arquivo invalido!";
    }
  } else {
    inputSearch.style.border = "2px solid red";
    inputSearch.style.animation =
      "shake 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both";
    error.style.display = "block";
    error.innerHTML = "Selecione um arquivo!";
  }
});
