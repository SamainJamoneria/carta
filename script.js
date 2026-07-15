document.addEventListener("DOMContentLoaded", () => {

const menu = document.getElementById("menu-categorias");

carta.forEach(categoria=>{

    menu.innerHTML += `

        <a href="#${categoria.id}" class="categoria">

            <div class="icono">

                ${categoria.icono}

            </div>

            <div class="texto">

                ${categoria.titulo}

            </div>

            <div class="cantidad">

                ${categoria.productos.length} productos

            </div>

        </a>

    `;

});
    
    const contenedor = document.getElementById("carta");

    carta.forEach(categoria => {

       const seccion = document.createElement("section");

       seccion.className="seccion";

       seccion.id=categoria.id;

        const titulo = document.createElement("h2");
        titulo.textContent = categoria.icono + " " + categoria.titulo;

        seccion.appendChild(titulo);

        categoria.productos.forEach(producto => {

            const tarjeta = document.createElement("div");
            tarjeta.className = "producto";

          tarjeta.innerHTML = `

                <div class="cabecera-producto">

                    <div class="nombre">${producto.nombre}</div>

                    <div class="precio">${producto.precio}</div>

                </div>

            ${producto.descripcion ? `<div class="descripcion">${producto.descripcion}</div>` : ""}

        `;

            seccion.appendChild(tarjeta);

        });

        contenedor.appendChild(seccion);

    });

});

const buscador = document.getElementById("buscar");

buscador.addEventListener("input", function () {

    const texto = this.value.toLowerCase();

    document.querySelectorAll(".producto").forEach(producto => {

        const contenido = producto.innerText.toLowerCase();

        if (contenido.includes(texto)) {

            producto.style.display = "";

        } else {

            producto.style.display = "none";

        }

    });

});
