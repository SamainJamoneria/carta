document.addEventListener("DOMContentLoaded", () => {

const menu = document.getElementById("menu-categorias");

carta.forEach(categoria=>{

    menu.innerHTML += `

<a href="#${categoria.id}" class="categoria" data-id="${categoria.id}">

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

    // Intersection Observer

    const observer = new IntersectionObserver((entradas)=>{

        entradas.forEach(entrada=>{

            if(entrada.isIntersecting){

                document.querySelectorAll(".categoria").forEach(boton=>{

                    boton.classList.remove("activa");

                });

                const boton=document.querySelector(`[data-id="${entrada.target.id}"]`);

                if(boton){

                    boton.classList.add("activa");

                    boton.scrollIntoView({

                        behavior:"smooth",

                        inline:"center",

                        block:"nearest"

                    });

                }

            }

        });

    },{

      rootMargin:"-35% 0px -55% 0px",
      threshold:0
        
    });

    document.querySelectorAll(".seccion").forEach(seccion=>{

        observer.observe(seccion);

    });

});

function normalizarTexto(texto){

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

}

const buscador = document.getElementById("buscar");

buscador.addEventListener("input", function(){

    const busqueda = normalizarTexto(this.value);

    document.querySelectorAll(".producto").forEach(producto=>{

        const contenido = normalizarTexto(producto.innerText);

        producto.style.display = contenido.includes(busqueda)
            ? ""
            : "none";

    });

});
