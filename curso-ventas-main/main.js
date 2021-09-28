//#region  HOME
let panelHome = document.getElementById('panelHome');
let PanelProductos = document.getElementById('panelProductos');
let panelVentas = document.getElementById('panelVentas');
let panelCategorias = document.getElementById('panelCategorias');

let botonesAtras = document.getElementsByClassName("btnAtras")

for (const btn of botonesAtras) {
    btn.addEventListener("click", mostrarPanelHome);
    //btn.addEventListener("dbclick", () => { alert("Esto no hace nada";) });
}

function mostrarPanelProductos() {
    panelHome.style.display = "none";
    PanelProductos.style.display = "block";
}

function mostrarPanelVentas() {
    panelHome.style.display = "none";
    panelVentas.style.display = "block";
}

function mostrarPanelCategorias() {
    panelHome.style.display = "none";
    panelCategorias.style.display = "block";
}

function mostrarPanelHome() {
    PanelProductos.style.display = "none";
    panelVentas.style.display = "none";
    panelCategorias.style.display = "none";

    panelHome.style.display = "block";
}