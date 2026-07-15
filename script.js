function crearProducto(producto) {

    return `

    <div class="producto">

        <div class="nombre">${producto.nombre}</div>

        <div class="descripcion">${producto.descripcion}</div>

        <div class="precio">${producto.precio}</div>

    </div>

    `;

}

function cargarCategoria(id, categoria) {

    const contenedor = document.getElementById(id);

    if (!contenedor) return;

    categoria.forEach(producto => {

        contenedor.innerHTML += crearProducto(producto);

    });

}

document.addEventListener("DOMContentLoaded", () => {

    cargarCategoria("lista-tostas", carta.tostas);

    cargarCategoria("lista-tablas", carta.tablas);

});
