let modalConfig = document.getElementById('modalConfig');
let btnCloseModalConfig = modalConfig.getElementsByClassName('close')[0];

let selectBgColor = document.getElementById('bgColor');

if (!localStorage.getItem("bgColor")) {
    setBgColor();
} else {
    selectBgColor.value = localStorage.getItem('bgColor');
    setBgColor()
}

function setBgColor() {
    let color = selectBgColor.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem('bgColor', color)
}

selectBgColor.onchange = setBgColor

function abrirModalConfig() {
    modalConfig.style.display = "block";
}

btnCloseModalConfig.onclick = function() {
    modalConfig.style.display = "none"
}

window.onclick = function(event) {
    if (event.target == modalConfig) {
        modalConfig.style.display = "none"
    }
}