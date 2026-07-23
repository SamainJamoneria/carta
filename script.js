document.addEventListener("DOMContentLoaded", () => {

    // 1. RENDERIZADO DE MENÚ Y CATEGORÍAS
    const menu = document.getElementById("menu-categorias");

    if (menu && typeof carta !== "undefined") {
        carta.forEach(categoria => {
            menu.innerHTML += `
                <a href="#${categoria.id}" class="categoria" data-id="${categoria.id}">
                    <div class="icono">${categoria.icono}</div>
                    <div class="texto">${categoria.titulo}</div>
                </a>
            `;
        });
    }

    const contenedor = document.getElementById("carta");

    // Diccionario oficial de alérgenos
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

    if (contenedor && typeof carta !== "undefined") {
        carta.forEach(categoria => {
            const seccion = document.createElement("section");
            seccion.className = "seccion";
            seccion.id = categoria.id;

            const titulo = document.createElement("h2");
            titulo.textContent = categoria.icono + " " + categoria.titulo;
            seccion.appendChild(titulo);

            categoria.productos.forEach(producto => {
                const tarjeta = document.createElement("div");
                tarjeta.className = "producto";

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
    }

    // 2. INTERSECTION OBSERVER (Scroll suave e indicador activo)
    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                document.querySelectorAll(".categoria").forEach(boton => {
                    boton.classList.remove("activa");
                });

                const boton = document.querySelector(`[data-id="${entrada.target.id}"]`);
                if (boton) {
                    boton.classList.add("activa");
                    boton.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest"
                    });
                }
            }
        });
    }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    });

    document.querySelectorAll(".seccion").forEach(seccion => {
        observer.observe(seccion);
    });

    // 3. FLECHAS DEL MENÚ DE CATEGORÍAS
    const contenedorMenu = document.querySelector(".menu-categorias");
    const flechaIzquierda = document.getElementById("flecha-izquierda");
    const flechaDerecha = document.getElementById("flecha-derecha");

    if (contenedorMenu && flechaIzquierda && flechaDerecha) {
        function actualizarFlechas() {
            const inicio = contenedorMenu.scrollLeft <= 5;
            const fin = contenedorMenu.scrollLeft >= contenedorMenu.scrollWidth - contenedorMenu.clientWidth - 5;

            flechaIzquierda.classList.toggle("oculta", inicio);
            flechaDerecha.classList.toggle("oculta", fin);

            const contPadre = document.querySelector(".contenedor-menu");
            if (contPadre) {
                contPadre.classList.toggle("mostrar-izquierda", !inicio);
                contPadre.classList.toggle("mostrar-derecha", !fin);
            }
        }

        contenedorMenu.addEventListener("scroll", actualizarFlechas);
        window.addEventListener("resize", actualizarFlechas);
        actualizarFlechas();

        flechaIzquierda.addEventListener("click", () => {
            contenedorMenu.scrollBy({ left: -250, behavior: "smooth" });
            setTimeout(actualizarFlechas, 300);
        });

        flechaDerecha.addEventListener("click", () => {
            contenedorMenu.scrollBy({ left: 250, behavior: "smooth" });
            setTimeout(actualizarFlechas, 300);
        });
    }

    // 4. BUSCADOR
    const buscador = document.getElementById("buscar");
    const resultado = document.getElementById("resultado-busqueda");

    if (buscador && resultado) {
        buscador.addEventListener("input", function () {
            const busqueda = normalizarTexto(this.value);
            let totalResultados = 0;

            document.querySelectorAll(".seccion").forEach(seccion => {
                let visibles = 0;
                seccion.querySelectorAll(".producto").forEach(producto => {
                    const contenido = normalizarTexto(producto.innerText);
                    if (contenido.includes(busqueda)) {
                        producto.style.display = "";
                        visibles++;
                        totalResultados++;
                    } else {
                        producto.style.display = "none";
                    }
                });
                seccion.style.display = visibles > 0 ? "" : "none";
            });

            if (busqueda === "") {
                resultado.innerHTML = "";
            } else if (totalResultados === 0) {
                resultado.innerHTML = `
                    <span class="texto-busqueda">🔍 Buscando: <strong>${this.value}</strong></span><br>
                    <span class="sin-resultados">❌ No se encontraron productos</span>
                `;
            } else {
                resultado.innerHTML = `
                    <span class="texto-busqueda">🔍 Buscando: <strong>${this.value}</strong></span><br>
                    <span class="con-resultados">✅ ${totalResultados} ${totalResultados === 1 ? "producto encontrado" : "productos encontrados"}</span>
                `;
            }
        });
    }

    // 5. MODAL ALÉRGENOS
    const modalAlergenos = document.getElementById("modal-alergenos");
    const imagenAlergenos = document.getElementById("imagen-alergenos");
    const cerrarAlergenos = document.getElementById("cerrar-modal");

    if (imagenAlergenos && modalAlergenos && cerrarAlergenos) {
        imagenAlergenos.addEventListener("click", () => modalAlergenos.classList.add("abierto"));
        cerrarAlergenos.addEventListener("click", () => modalAlergenos.classList.remove("abierto"));
        modalAlergenos.addEventListener("click", (e) => {
            if (e.target === modalAlergenos) modalAlergenos.classList.remove("abierto");
        });
    }

    // 6. MODAL CONTACTO
    const btnContacto = document.getElementById('btn-contacto-carta');
    const modalContacto = document.getElementById('modal-contacto');
    const cerrarContacto = document.getElementById('cerrar-contacto');

    if (btnContacto && modalContacto) {
        btnContacto.addEventListener('click', () => modalContacto.classList.remove('hidden'));
    }
    if (cerrarContacto && modalContacto) {
        cerrarContacto.addEventListener('click', () => modalContacto.classList.add('hidden'));
    }

    // 7. MODAL GALERÍA
    const btnGaleria = document.getElementById('btn-galeria');
    const modalGaleria = document.getElementById('modal-galeria');
    const closeGaleria = document.getElementById('close-galeria');

    if (btnGaleria && modalGaleria) {
        btnGaleria.addEventListener('click', (e) => {
            e.preventDefault();
            modalGaleria.classList.remove('hidden');
        });

        if (closeGaleria) {
            closeGaleria.addEventListener('click', () => modalGaleria.classList.add('hidden'));
        }
    }

    // 8. MODAL VISOR DE IMAGEN AMPLIADA (GALERÍA)
    const modalVisor = document.getElementById("modal-visor-imagen");
    const imagenAmpliada = document.getElementById("imagen-ampliada");
    const cerrarVisor = document.getElementById("cerrar-visor");

    if (modalVisor && imagenAmpliada) {
        document.querySelectorAll(".galeria-grid img").forEach((img) => {
            img.addEventListener("click", (e) => {
                e.stopPropagation();
                imagenAmpliada.src = img.src;
                modalVisor.classList.remove("hidden");
            });
        });

        const cerrarModalImagen = () => {
            modalVisor.classList.add("hidden");
            imagenAmpliada.src = "";
        };

        if (cerrarVisor) cerrarVisor.addEventListener("click", cerrarModalImagen);
        modalVisor.addEventListener("click", cerrarModalImagen);
    }

    // 9. MODAL TIENDA / PARA LLEVAR (NUEVO)
    const btnTienda = document.getElementById('btn-tienda');
    const modalTienda = document.getElementById('modal-tienda');
    const closeTienda = document.getElementById('close-tienda');

    if (btnTienda && modalTienda) {
        btnTienda.addEventListener('click', () => modalTienda.classList.remove('hidden'));
    }
    if (closeTienda && modalTienda) {
        closeTienda.addEventListener('click', () => modalTienda.classList.add('hidden'));
    }

    // 10. CIERRE GLOBAL DE MODALES HACIENDO CLIC FUERA
    window.addEventListener('click', (event) => {
        if (event.target === modalContacto) modalContacto.classList.add('hidden');
        if (event.target === modalGaleria) modalGaleria.classList.add('hidden');
        if (event.target === modalTienda) modalTienda.classList.add('hidden');
    });

});

// FUNCIÓN AUXILIAR DE NORMALIZACIÓN
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ======================================================
// CONTROL DEL MODAL TIENDA Y PARA LLEVAR
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnTienda = document.getElementById('btn-tienda');
    const modalTienda = document.getElementById('modal-tienda');
    const cerrarTienda = document.getElementById('cerrar-tienda');

    // Función para abrir el modal
    if (btnTienda && modalTienda) {
        btnTienda.addEventListener('click', (e) => {
            e.preventDefault();
            modalTienda.classList.remove('hidden');
        });
    }

    // Función para cerrar el modal haciendo clic en la X
    if (cerrarTienda && modalTienda) {
        cerrarTienda.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evita interferencias con el contenedor
            modalTienda.classList.add('hidden');
        });
    }

    // Función para cerrar el modal haciendo clic fuera de la tarjeta (fondo oscuro)
    if (modalTienda) {
        modalTienda.addEventListener('click', (e) => {
            if (e.target === modalTienda) {
                modalTienda.classList.add('hidden');
            }
        });
    }
});

// Deshabilitar clic derecho
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Deshabilitar atajos de inspección (F12, Ctrl+Shift+I, Ctrl+U, etc.)
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'u')
    ) {
        e.preventDefault();
    }
});
