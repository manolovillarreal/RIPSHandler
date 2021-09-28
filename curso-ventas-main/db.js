let fileDB = document.getElementById("fileDB");

let listaProductos = [];
let listaCategorias = [];


fileDB.onchange = function() {
    let file = this.files[0];

    let reader = new FileReader();

    reader.onload = function() {
        console.log(reader.result);

        let obj = JSON.parse(reader.result);

        listaProductos = obj.productos;
        listaCategorias = obj.categorias;

        refrescarCategorias();
        refrescarProductos();
    }

    reader.readAsText(file);

}

function guardarDB() {

    let db = {
        productos: listaProductos,
        categorias: listaCategorias
    }

    console.log(db);
    console.log('.............');
    console.log(JSON.stringify(db));
    let blob = new Blob([JSON.stringify(db)], { type: 'json' });
    let fileName = "db.json";

    saveAs(blob, fileName);







}

//#region Productos
function agregarProducto(producto) {
    if (producto) {

        if (!listaProductos.find(p => p.nombre == producto.nombre)) {
            listaProductos.push(producto);
            listaProductos.sort(p => p.nombre);

            let index = listaProductos.findIndex(p => p.nombre == p.nombre);
            return {
                ...producto,
                index
            }
        } else {
            return undefined;
        }
    } else
        return undefined
}
//#endregion

//#region  Categorias
function agregarCategoria(categoria) {
    if (categoria != "") {
        categoria = categoria.toUpperCase();
        if (!listaCategorias.includes(categoria)) {
            listaCategorias.push(categoria);
            listaCategorias.sort();

            let index = listaCategorias.indexOf(categoria);
            return {
                nombre: categoria,
                index
            }
        } else {
            return { err: "Ya existe la categoria" };
        }
    } else
        return { err: "Debe enviar la categoria" };
}

function eliminarCategoria(index) {
    if (index >= 0 && index < listaCategorias.length) {
        listaCategorias.splice(index, 1);
    }
}
//#endregion