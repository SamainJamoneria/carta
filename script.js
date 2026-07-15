// ======================================
// SAMAÍN LA CORMELANA
// Generador automático de la carta
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    generarMenu();

    generarCarta();

});



function generarMenu(){

    const menu=document.querySelector(".menu-categorias");

    if(!menu) return;

    menu.innerHTML="";

    carta.forEach(categoria=>{

        menu.innerHTML+=`

        <a href="#${categoria.id}">

            <div class="emoji">${categoria.nombre.split(" ")[0]}</div>

            <div class="titulo">

                ${categoria.nombre.substring(3)}

            </div>

            <div class="descripcion-menu">

                ${categoria.productos.length} productos

            </div>

        </a>

        `;

    });

}



function generarCarta(){

    const contenedor=document.getElementById("carta");

    contenedor.innerHTML="";

    carta.forEach(categoria=>{

        contenedor.innerHTML+=crearCategoria(categoria);

    });

}



function crearCategoria(categoria){

    let html=`

    <section class="seccion" id="${categoria.id}">

        <h2>

            ${categoria.nombre}

        </h2>

    `;

    categoria.productos.forEach(producto=>{

        html+=crearProducto(producto);

    });

    html+=`

    </section>

    `;

    return html;

}



function crearProducto(producto){

    return`

    <article class="producto">

        <div class="nombre">

            ${producto.nombre}

        </div>

        <div class="descripcion">

            ${producto.descripcion}

        </div>

        <div class="precio">

            ${producto.precio}

        </div>

    </article>

    `;

}
