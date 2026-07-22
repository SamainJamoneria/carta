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
            </a>
        `;
    });
        
    const contenedor = document.getElementById("carta");

    // Diccionario oficial de los 14 alérgenos obligatorios de la UE
    const mapaAlergenos = {
        "g": { icono: "🌾", nombre: "Gluten / Contains Gluten" },
        "l": { icono: "🥛", nombre: "Lácteos / Dairy" },
        "f": { icono: "🥜", nombre: "Frutos de cáscara / Nuts" },
        "p": { icono: "🐟", nombre: "Pescado / Fish" },
        "v": { icono: "🍷", nombre: "Dióxido de azufre y sulfitos / Sulphites" },
        "cr": { icono: "🦀", nombre: "Crustáceos / Crustaceans" },
        "h": { icono: "🥚", nombre: "Huevos / Eggs" },
        "ag": { icono: "🌱", nombre: "Altramuces / Lupins" },
        "m": { icono: "🦪", nombre: "Moluscos / Molluscs" },
        "ca": { icono: "🥦", nombre: "Apio / Celery" },
        "mo": { icono: "🟡", nombre: "Mostaza / Mustard" },
        "s": { icono: "🫘", nombre: "Soja / Soya" },
        "se": { icono: "🌾", nombre: "Granos de sésamo / Sesame" },
        "cac": { icono: "🥜", nombre: "Cacahuetes / Peanuts" }
    };

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

            // PROCESAR LOS ALÉRGENOS AUTOMÁTICAMENTE PARA CADA PRODUCTO
            let htmlAlergenos = "";
            if (producto.alergenos && producto.alergenos.length > 0) {
                htmlAlergenos = `<div class="tags-alergenos" style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;">`;
                producto.alergenos.forEach(letra => {
                    const data = mapaAlergenos[letra.toLowerCase()];
                    if (data) {
                        htmlAlergenos += `<span class="badge-alergeno" title="${data.nombre}" style="font-size:14px; background:rgba(0,0,0,0.05); padding:3px 6px; border-radius:6px; cursor:help; display:inline-flex; align-items:center;">${data.icono}</span>`;
                    }
                });
                htmlAlergenos += `</div>`;
            }

            tarjeta.innerHTML = `
                <div class="cabecera-producto">
                    <div class="nombre">${producto.nombre}</div>
                    <div class="precio">${producto.precio}</div>
                </div>
                ${producto.descripcion ? `<div class="descripcion">${producto.descripcion}</div>` : ""}
                ${htmlAlergenos}
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

    const contenedorMenu = document.querySelector(".menu-categorias");
    const flechaIzquierda = document.getElementById("flecha-izquierda");
    const flechaDerecha = document.getElementById("flecha-derecha");

    function actualizarFlechas(){
        const inicio = contenedorMenu.scrollLeft <= 5;
        const fin = contenedorMenu.scrollLeft >=
            contenedorMenu.scrollWidth - contenedorMenu.clientWidth - 5;

        flechaIzquierda.classList.toggle("oculta", inicio);
        flechaDerecha.classList.toggle("oculta", fin);

        const contenedor = document.querySelector(".contenedor-menu");
        contenedor.classList.toggle("mostrar-izquierda", !inicio);
        contenedor.classList.toggle("mostrar-derecha", !fin);
    }
        
    contenedorMenu.addEventListener("scroll", actualizarFlechas);
    window.addEventListener("resize", actualizarFlechas);
    actualizarFlechas();

    flechaIzquierda.addEventListener("click", ()=>{
        contenedorMenu.scrollBy({
            left:-250,
            behavior:"smooth"
        });
        setTimeout(actualizarFlechas,300);
    });

    flechaDerecha.addEventListener("click", ()=>{
        contenedorMenu.scrollBy({
            left:250,
            behavior:"smooth"
        });
        setTimeout(actualizarFlechas,300);
    });

});

function normalizarTexto(texto){
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");
}

const buscador = document.getElementById("buscar");
const resultado = document.getElementById("resultado-busqueda");

buscador.addEventListener("input", function(){
    const busqueda = normalizarTexto(this.value);
    let totalResultados = 0;

    document.querySelectorAll(".seccion").forEach(seccion=>{
        let visibles = 0;
        seccion.querySelectorAll(".producto").forEach(producto=>{
            const contenido = normalizarTexto(producto.innerText);
            if(contenido.includes(busqueda)){
                producto.style.display = "";
                visibles++;
                totalResultados++;
            }else{
                producto.style.display = "none";
            }
        });
        seccion.style.display = visibles > 0 ? "" : "none";
    });

    if(busqueda===""){
        resultado.innerHTML="";
    }else if(totalResultados===0){
        resultado.innerHTML=`
            <span class="texto-busqueda">
                🔍 Buscando: <strong>${this.value}</strong>
            </span>
            <br>
            <span class="sin-resultados">
                ❌ No se encontraron productos
            </span>
        `;
    }else{
        resultado.innerHTML=`
            <span class="texto-busqueda">
                🔍 Buscando: <strong>${this.value}</strong>
            </span>
            <br>
            <span class="con-resultados">
                ✅ ${totalResultados} ${totalResultados===1 ? "producto encontrado" : "productos encontrados"}
            </span>
        `;
    }
});

const modal = document.getElementById("modal-alergenos");
const imagen = document.getElementById("imagen-alergenos");
const cerrar = document.getElementById("cerrar-modal");

if (imagen && modal && cerrar) {
    imagen.addEventListener("click", ()=>{
        modal.classList.add("abierto");
    });

    cerrar.addEventListener("click", ()=>{
        modal.classList.remove("abierto");
    });

    modal.addEventListener("click",(e)=>{
        if(e.target===modal){
            modal.classList.remove("abierto");
        }
    });

// --- LÓGICA MOSTRAR / OCULTAR CONTACTO ---
document.addEventListener('DOMContentLoaded', () => {
  const btnContacto = document.getElementById('btn-contacto-carta');
  const modalContacto = document.getElementById('modal-contacto');
  const cerrarContacto = document.getElementById('cerrar-contacto');

  // Si existe el botón en esta página, activa la función de abrir
  if (btnContacto && modalContacto) {
    btnContacto.addEventListener('click', () => {
      modalContacto.classList.remove('hidden');
    });
  }

  // Cierra al hacer clic en la X
  if (cerrarContacto && modalContacto) {
    cerrarContacto.addEventListener('click', () => {
      modalContacto.classList.add('hidden');
    });
  }

  // Cierra al hacer clic en la zona oscura fuera del cuadro
  window.addEventListener('click', (event) => {
    if (event.target === modalContacto) {
      modalContacto.classList.add('hidden');
    }
  });
});    
}

// MODAL GALERÍA
const btnGaleria = document.getElementById('btn-galeria');
const modalGaleria = document.getElementById('modal-galeria');
const closeGaleria = document.getElementById('close-galeria');

if (btnGaleria && modalGaleria) {
    btnGaleria.addEventListener('click', (e) => {
        e.preventDefault();
        modalGaleria.classList.remove('hidden');
    });

    closeGaleria.addEventListener('click', () => {
        modalGaleria.classList.add('hidden');
    });

    // Cerrar si hace clic fuera de la ventana
    modalGaleria.addEventListener('click', (e) => {
        if (e.target === modalGaleria) {
            modalGaleria.classList.add('hidden');
        }
    });
}
