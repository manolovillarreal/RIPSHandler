let formProducto = document.formProducto;
let contenedorProductos = document.getElementById("listaProductos");


formProducto.onsubmit = function(e) {
    e.preventDefault();

    let nombre = formProducto.nombre.value.toUpperCase();
    let precio = formProducto.precio.value;
    let categoria = formProducto.categoria.value;

    let producto = {
        nombre,
        categoria,
        precio
    }
    let res = agregarProducto(producto);

    if (res) {
        refrescarProductos();
    }


}

function onClickBtnEliminarProducto() {
    //No existe en el script BD
    eliminarProducto(this.parentElement.id);
    refrescarProductos();
}

function refrescarProductos() {
    contenedorProductos.innerHTML = "";
    for (let i = 0; i < listaProductos.length; i++) {
        let elemento = document.createElement('div');
        elemento.setAttribute("id", "producto_" + i);
        elemento.setAttribute("class", "categoria");
        elemento.innerHTML = "<span>" + listaProductos[i].nombre + "</span>";
        //Agregar elementos que muestren el precio y la categoria

        let btnBorrar = document.createElement("button");
        btnBorrar.addEventListener("click", onClickBtnEliminarProducto)
        btnBorrar.innerHTML = "Eliminar";
        elemento.append(btnBorrar);

        contenedorProductos.append(elemento);
    }
}