document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("carta");

    carta.forEach(categoria => {

        const seccion = document.createElement("section");
        seccion.className = "seccion";

        const titulo = document.createElement("h2");
        titulo.textContent = categoria.icono + " " + categoria.titulo;

        seccion.appendChild(titulo);

        categoria.productos.forEach(producto => {

            const tarjeta = document.createElement("div");
            tarjeta.className = "producto";

            tarjeta.innerHTML = `
                <div class="nombre">${producto.nombre}</div>
                <div class="descripcion">${producto.descripcion}</div>
                <div class="precio">${producto.precio}</div>
            `;

            seccion.appendChild(tarjeta);

        });

        contenedor.appendChild(seccion);

    });

});
