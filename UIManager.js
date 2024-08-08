document
  .getElementById("toggleFileListBtn")
  .addEventListener("click", toggleFileListVisibility);

function toggleFileListVisibility() {
  const fileList = document.getElementById("fileList");
  if (fileList.classList.contains("hidden")) {
    fileList.classList.remove("hidden");
  } else {
    fileList.classList.add("hidden");
  }
}

export function printFileList(fileListDOM, ripsFiles) {
  fileListDOM.innerHTML = "";
  for (const { name, code, desc } of ripsFiles) {
    fileListDOM.innerHTML += `
                       <div id="${name}" class="fileRow">                    
                           ${code} - ${desc} 
                           <div class="btn-div"> 
                               <ion-icon name="close-circle-outline"  size="large"></ion-icon>
                           </div>  
                           <div class="btn-div"> 
                               <ion-icon name="reload-circle-outline" size="large"></ion-icon>  
                           </div>  
                       </div>`;
  }
  fileListDOM.parentNode.style.display = "block";
}

export function setErrorAlert(errors) {
  const errorAlert = document.querySelector("#errorAlert");
  if (errors.length > 0) {
    errorAlert.innerHTML = "";
    for (const err of errors) {
      errorAlert.innerHTML += `<div> ${err}</div>`;
    }

    errorAlert.style.display = "block";
  } else {
    errorAlert.style.display = "none";
  }
}

//RIPS DATA

let RipsData = {};

export function renderDataContainer(ripsData) {
  RipsData = ripsData;

  document.querySelectorAll(".nav-link").forEach((navTabs) => {
    navTabs.remove();
  });

  for (const fileName in ripsData) {
    document.querySelector("#ripsDataContainer").style.display = "block";
    document.querySelector("#nav-tab").prepend(createNavTab(fileName));
    document
      .querySelector("#nav-tabContent")
      .appendChild(createTabPanel(fileName));
  }

  // Seleccionar el primer tab y mostrar su contenido
  const firstFileName = Object.keys(ripsData)[0];
  switchTab(firstFileName);
  checkForErrors(firstFileName, ripsData[firstFileName]);
}
export function showValidationOptions() {
  document.querySelector("#validationContainer").classList.remove("hidden");
}

function createNavTab(name) {
  const tabButton = document.createElement("button");
  tabButton.className = "nav-link";
  tabButton.id = `nav-${name}-tab`;
  tabButton.type = "button";
  tabButton.setAttribute("role", "tab");
  tabButton.setAttribute("aria-controls", `nav-${name}`);
  tabButton.setAttribute("aria-selected", "false");
  tabButton.innerText = name;
  tabButton.addEventListener("click", () => switchTab(name));
  return tabButton;
}
function createTabPanel(name) {
  const tabPanel = document.createElement("div");
  tabPanel.className = "tab-pane fade";
  tabPanel.id = `nav-${name}`;
  tabPanel.setAttribute("role", "tabpanel");
  tabPanel.setAttribute("aria-labelledby", `nav-${name}-tab`);
  return tabPanel;
}
function displayRipsData(fileName, rips, page = 1, rowsPerPage = 25) {
  const tabContent = document.getElementById(`nav-${fileName}`);
  tabContent.innerHTML = ""; // Limpiar el contenido anterior
  const totalPages = Math.ceil(rips.length / rowsPerPage);

  const tabData = document.createElement("div");
  tabData.setAttribute("id", "tabData");
  let tableHTML = '<table class="table"><thead><tr>';

  // Agregar encabezados
  const headers = Object.keys(rips[0]);
  headers.forEach((header) => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += "</tr></thead><tbody>";

  // Agregar filas de datos con paginación
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedRows = rips.slice(start, end);

  paginatedRows.forEach((row) => {
    tableHTML += "<tr>";
    headers.forEach((header) => {
      tableHTML += `<td>${row[header]}</td>`;
    });
    tableHTML += "</tr>";
  });

  tableHTML += "</tbody></table>";
  tabData.innerHTML = tableHTML;
  tabContent.append(tabData);

  // Crear y agregar controles de paginación
  const pagination = createPagination(totalPages, page, fileName);
  tabContent.appendChild(pagination);
}

function createPagination(totalPages, currentPage, fileName) {
  const nav = document.createElement("nav");
  nav.setAttribute("id", "nav-pagination");
  const ul = document.createElement("ul");
  ul.className = "pagination";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.innerText = i;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      changePage(fileName, i);
    });

    li.appendChild(a);
    ul.appendChild(li);
  }

  nav.appendChild(ul);
  return nav;
}
function changePage(fileName, page) {
  displayRipsData(fileName, RipsData[fileName], page);
}
function switchTab(name) {
  const tabs = document.querySelectorAll(".nav-link");
  const panels = document.querySelectorAll(".tab-pane");

  tabs.forEach((tab) => {
    if (tab.id === `nav-${name}-tab`) {
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
    } else {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected", "false");
    }
  });

  panels.forEach((panel) => {
    if (panel.id === `nav-${name}`) {
      panel.classList.add("show", "active");
      if (name != "output") displayRipsData(name, RipsData[name], 1);
      else {
      }
    } else {
      panel.classList.remove("show", "active");
    }
  });
}

//OUTPUT

export function renderOutputData(results) {
  // Crear el tab para output si no existe
  let outputTab = document.getElementById(`nav-output-tab`);
  if (!outputTab) {
    document.querySelector("#nav-tab").prepend(createNavTab("output"));
    document
      .querySelector("#nav-tabContent")
      .appendChild(createTabPanel("output"));
  }

  document.querySelector("#generateFileBtn").classList.remove("hidden");
  const outputContent = document.getElementById("nav-output");
  outputContent.innerHTML = ""; // Limpiar el contenido anterior

  for (const fileName in results) {
    const fileResults = results[fileName];

    if (fileResults.length === 0) {
      continue; // Omitir archivos sin cambios
    }

    const fileSection = document.createElement("div");
    fileSection.className = "file-section";

    const fileHeader = document.createElement("h3");
    fileHeader.innerHTML = fileName;

    const toggleIcon = fileHeader.appendChild(
      createToggleIcon(fileName, "chevron-down-outline")
    );
    fileSection.appendChild(fileHeader);

    const collapseDiv = document.createElement("div");
    collapseDiv.id = `collapse-${fileName}`;
    collapseDiv.className = "collapse show";

    fileResults.forEach((result) => {
      const resultDiv = document.createElement("div");
      resultDiv.className = "result";
      resultDiv.innerHTML = `<p>${result.msg}</p>`;

      if (result.errors && result.errors.length > 0) {
        const errorList = document.createElement("ul");
        result.errors.forEach((error) => {
          const errorItem = document.createElement("li");
          errorItem.innerHTML = `Error en la línea ${error.line}: ${error.msg}`;
          errorList.appendChild(errorItem);
        });
        resultDiv.appendChild(errorList);
      }

      collapseDiv.appendChild(resultDiv);
    });

    fileSection.appendChild(collapseDiv);
    outputContent.appendChild(fileSection);
  }
  // Cambiar al tab de output
  switchTab("output");
}

function toggleCollapse(fileName) {
  const collapseDiv = document.getElementById(`collapse-${fileName}`);
  const fileHeader = collapseDiv.previousElementSibling;
  const toggleIcon = fileHeader.querySelector("ion-icon");

  if (collapseDiv.classList.contains("show")) {
    collapseDiv.classList.remove("show");
    collapseDiv.classList.add("hide");
    fileHeader.removeChild(toggleIcon);
    fileHeader.appendChild(
      createToggleIcon(fileName, "chevron-forward-outline")
    );
  } else {
    collapseDiv.classList.remove("hide");
    collapseDiv.classList.add("show");
    fileHeader.removeChild(toggleIcon);
    fileHeader.appendChild(createToggleIcon(fileName, "chevron-down-outline"));
  }
}

function createToggleIcon(fileName, iconName) {
  const toggleIcon = document.createElement("ion-icon");
  toggleIcon.name = iconName;
  toggleIcon.className = "toggle-icon";
  toggleIcon.addEventListener("click", () => {
    toggleCollapse(fileName);
  });

  return toggleIcon;
}
function printOutput(rips, name) {
  const output = document.getElementById("nav-" + name);
  output.innerHTML = "";
  let outputLine = "";
  for (let i = 0; i < rips.length; i++) {
    let ripsLine = rips[i];
    let str = i + 1 + ")";
    for (const field in ripsLine) {
      str += ripsLine[field] + ",";
    }

    const className = ripsLine.error ? "error" : "data";
    const data = ripsLine.error ? ripsLine.line + ")" + ripsLine.msg : str;
    outputLine += `<div class="${className}">  ${data}  </div>`;
  }
  output.innerHTML += outputLine;
}
function checkForErrors(name, rips) {
  const _errors = rips.filter((i) => i.error);

  if (_errors.length > 0) {
    document.getElementById(`nav-${name}-tab`).style.color = "red";
    for (const error of _errors) {
      // Manejar los errores como sea necesario
    }
  }
}

function showOutput() {}

function createOutputNavTab() {
  const tabButton = document.createElement("button");
  const name = "output";
  tabButton.className = "nav-link";
  tabButton.id = `nav-${name}-tab`;
  tabButton.type = "button";
  tabButton.setAttribute("role", "tab");
  tabButton.setAttribute("aria-controls", `nav-${name}`);
  tabButton.setAttribute("aria-selected", "false");
  tabButton.innerText = name;
  tabButton.addEventListener("click", () => switchTab(name));
  return tabButton;
}
