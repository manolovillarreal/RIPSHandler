let txtCategoria = document.getElementById("txtCategoria");
let btnGuardarCategoria = document.getElementById("btnGuardarCategoria");
let contenedorCategorias = document.getElementById("listaCategorias");
let selectCategorias = document.getElementById("selectCategoria");
btnGuardarCategoria.addEventListener("click", guardarCategoria);
txtCategoria.addEventListener("keydown", onKeyDownTxtCategoria);


function onKeyDownTxtCategoria(e) {
    if (e.keyCode == 13) {
        guardarCategoria();
        txtCategoria.value = "";
    }
}

function guardarCategoria() {
    let res = agregarCategoria(txtCategoria.value)
    if (!res.err) {
        refrescarCategorias();
    } else {
        alert(res.err)
    }
}

function onClickBtnEliminarCategoria() {
    eliminarCategoria(this.parentElement.id);
    refrescarCategorias();

}

function refrescarCategorias() {
    contenedorCategorias.innerHTML = ""
    selectCategoria.innerHTML = "<option  >Sin Categoria </option>";
    for (let i = 0; i < listaCategorias.length; i++) {
        let elemento = document.createElement('div');
        elemento.setAttribute("id", i);
        elemento.setAttribute("class", "categoria");
        elemento.innerHTML = "<span>" + listaCategorias[i] + "</span>";


        let btnBorrar = document.createElement("button");
        btnBorrar.addEventListener("click", onClickBtnEliminarCategoria)
        btnBorrar.innerHTML = "Eliminar";
        elemento.append(btnBorrar);

        contenedorCategorias.append(elemento);
        selectCategoria.innerHTML += "<option>" + listaCategorias[i] + "</option>";

    }
}