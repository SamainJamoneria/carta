/**
 * @file script.js
 * @description Lógica principal para la carta digital de Jamonería Samaín.
 * Incluye renderizado dinámico, observadores de scroll, buscador, control de alérgenos
 * y gestión de modales con menú hamburguesa defensivo.
 * @author Principal Software Engineer & Web Architect
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. RENDERIZADO DE MENÚ Y CATEGORÍAS
    // ==========================================
    const menu = document.getElementById("menu-categorias");

    if (menu && typeof carta !== "undefined") {
        carta.forEach(categoria => {
            menu.innerHTML += `
                <a href="#${categoria.id}" class="categoria" data-id="${categoria.id}">
                    <div class="icono"><img src="${categoria.icono}" alt="${categoria.titulo}" class="img-icono-cat"></div>
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
            titulo.innerHTML = `<img src="${categoria.icono}" alt="${categoria.titulo}" class="img-titulo-cat"> ${categoria.titulo}`;
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

    // ==========================================
    // 2. INTERSECTION OBSERVER (Scroll e indicador activo)
    // ==========================================
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

    // ==========================================
    // 3. FLECHAS DEL MENÚ DE CATEGORÍAS
    // ==========================================
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

    // ==========================================
    // 4. BUSCADOR
    // ==========================================
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

    // ==========================================
    // 5. GESTIÓN DE MODALES Y MENÚ HAMBURGUESA BLINDADO
    // ==========================================
    const modalContacto = document.getElementById('modal-contacto');
    const modalGaleria = document.getElementById('modal-galeria');
    const modalTienda = document.getElementById('modal-tienda');
    const modalAlergenos = document.getElementById('modal-alergenos');
    const modalMenuPrincipal = document.getElementById('modal-menu-principal');

    // --- Modal Alérgenos ---
    const imagenAlergenos = document.getElementById("imagen-alergenos");
    const cerrarAlergenos = document.getElementById("cerrar-modal");

    if (imagenAlergenos && modalAlergenos) {
        imagenAlergenos.addEventListener("click", () => modalAlergenos.classList.add("abierto"));
    }
    if (cerrarAlergenos && modalAlergenos) {
        cerrarAlergenos.addEventListener("click", () => modalAlergenos.classList.remove("abierto"));
    }

    // --- Modal Contacto ---
    const btnContacto = document.getElementById('btn-contacto-carta');
    const cerrarContacto = document.getElementById('cerrar-contacto');

    if (btnContacto && modalContacto) {
        btnContacto.addEventListener('click', () => modalContacto.classList.remove('hidden'));
    }
    if (cerrarContacto && modalContacto) {
        cerrarContacto.addEventListener('click', () => modalContacto.classList.add('hidden'));
    }

    // --- Modal Galería ---
    const btnGaleria = document.getElementById('btn-galeria');
    const closeGaleria = document.getElementById('close-galeria');

    if (btnGaleria && modalGaleria) {
        btnGaleria.addEventListener('click', (e) => {
            e.preventDefault();
            modalGaleria.classList.remove('hidden');
        });
    }
    if (closeGaleria && modalGaleria) {
        closeGaleria.addEventListener('click', () => modalGaleria.classList.add('hidden'));
    }

    // --- Modal Visor Galería ---
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

    // --- Modal Tienda / Para Llevar ---
    const btnTienda = document.getElementById('btn-tienda');
    const closeTienda = document.getElementById('close-tienda') || document.getElementById('cerrar-tienda');

    if (btnTienda && modalTienda) {
        btnTienda.addEventListener('click', (e) => {
            e.preventDefault();
            modalTienda.classList.remove('hidden');
        });
    }
    if (closeTienda && modalTienda) {
        closeTienda.addEventListener('click', (e) => {
            e.preventDefault();
            modalTienda.classList.add('hidden');
        });
    }

    // --- Menú Hamburguesa Robusto (Multiselector Defensivo) ---
    // Soporta tanto el ID principal como clases alternativas por si hubiera diferencias en el HTML
    const btnHamburguesa = document.getElementById('btn-menu-hamburguesa') || document.querySelector('.btn-hamburguesa') || document.querySelector('.hamburger');
    const cerrarMenuPrincipal = document.getElementById('cerrar-menu-principal') || document.querySelector('#modal-menu-principal .close-btn');

    if (btnHamburguesa && modalMenuPrincipal) {
        btnHamburguesa.addEventListener('click', (e) => {
            e.preventDefault();
            modalMenuPrincipal.classList.remove('hidden');
            btnHamburguesa.setAttribute('aria-expanded', 'true');
        });
    } else {
        console.warn('Aviso: El botón del menú hamburguesa o el modal principal no se detectaron en esta vista.');
    }

    if (cerrarMenuPrincipal && modalMenuPrincipal) {
        cerrarMenuPrincipal.addEventListener('click', () => {
            modalMenuPrincipal.classList.add('hidden');
            if (btnHamburguesa) btnHamburguesa.setAttribute('aria-expanded', 'false');
        });
    }

    // Enlaces internos dentro del Menú Hamburguesa
    const btnContactoModal = document.querySelector('#modal-menu-principal #btn-contacto-carta');
    const btnGaleriaModal = document.querySelector('#modal-menu-principal #btn-galeria');
    const btnTiendaModal = document.querySelector('#modal-menu-principal #btn-tienda');

    if (btnContactoModal && modalContacto) {
        btnContactoModal.addEventListener('click', () => {
            modalMenuPrincipal.classList.add('hidden');
            modalContacto.classList.remove('hidden');
        });
    }

    if (btnGaleriaModal && modalGaleria) {
        btnGaleriaModal.addEventListener('click', () => {
            modalMenuPrincipal.classList.add('hidden');
            modalGaleria.classList.remove('hidden');
        });
    }

    if (btnTiendaModal && modalTienda) {
        btnTiendaModal.addEventListener('click', () => {
            modalMenuPrincipal.classList.add('hidden');
            modalTienda.classList.remove('hidden');
        });
    }

    // ==========================================
    // 6. CIERRE GLOBAL DE MODALES (Clic fuera)
    // ==========================================
    window.addEventListener('click', (event) => {
        if (event.target === modalContacto) modalContacto.classList.add('hidden');
        if (event.target === modalGaleria) modalGaleria.classList.add('hidden');
        if (event.target === modalTienda) modalTienda.classList.add('hidden');
        if (event.target === modalAlergenos) modalAlergenos.classList.remove('abierto');
        if (event.target === modalMenuPrincipal) modalMenuPrincipal.classList.add('hidden');
    });

    // ==========================================
    // 7. EFECTOS DE TEMPORADA AUTOMÁTICOS
    // ==========================================
    const body = document.body;
    const detalleEl = document.getElementById("detalle-temporada");
    const esIngles = document.documentElement.lang === "en";

    function obtenerModoPorFecha() {
        const ahora = new Date();
        const mes = ahora.getMonth() + 1;
        const dia = ahora.getDate();

        if (mes === 6 && dia >= 15 && dia <= 25) return "modo-sanjuan";
        if ((mes === 10 && dia >= 20) || (mes === 11 && dia <= 2)) return "modo-samain";
        if (mes === 12 || (mes === 1 && dia <= 7)) return "modo-navidad";
        if (mes === 2 && dia >= 10 && dia <= 25) return "modo-carnaval";

        return null;
    }

    let modoActivo = obtenerModoPorFecha();

    if (modoActivo) {
        body.classList.add(modoActivo);
    }

    const configuracionTemporadas = {
        "modo-navidad": {
            texto: esIngles 
                ? "🎄 Merry Christmas from the Samaín team" 
                : "🎄 Felices Fiestas de parte del equipo de Samaín",
            particulas: ["❄", "❅", "❆", "🤍"]
        },
        "modo-sanjuan": {
            texto: esIngles 
                ? "🔥 Celebrating San Juan" 
                : "🔥 ¡Llega la mágica Noche de San Juan!",
            particulas: ["💥", "✨", "🔥", "⚡"]
        },
        "modo-carnaval": {
            texto: esIngles 
                ? "🎭 Happy Carnival Season!" 
                : "🎭 ¡Feliz Carnaval!",
            particulas: ["🎉", "🎊", "✨", "🎈", "🔴", "🟡", "🔵"]
        },
        "modo-samain": {
            texto: esIngles 
                ? "🎃 Happy Samain / Halloween!" 
                : "🎃 ¡Feliz Samaín / Halloween!",
            particulas: ["🎃", "👻", "🍂", "✨"]
        }
    };

    if (modoActivo && configuracionTemporadas[modoActivo]) {
        const config = configuracionTemporadas[modoActivo];
        if (detalleEl) {
            detalleEl.textContent = config.texto;
        }

        let ultimoScroll = window.scrollY;
        let contadorScroll = 0;

        window.addEventListener("scroll", () => {
            const scrollActual = window.scrollY;

            if (scrollActual > ultimoScroll) {
                contadorScroll++;
                if (contadorScroll % 5 === 0) {
                    crearParticulaScroll(config.particulas);
                }
            }
            ultimoScroll = scrollActual;
        }, { passive: true });

        function crearParticulaScroll(listaSimbolos) {
            const particula = document.createElement("div");
            particula.className = "particula-scroll";

            const simbolo = listaSimbolos[Math.floor(Math.random() * listaSimbolos.length)];
            particula.textContent = simbolo;

            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * 80 + 20;

            const tamano = (Math.random() * 0.8 + 0.8).toFixed(2);
            const duracion = (Math.random() * 800 + 1000).toFixed(0);

            particula.style.left = `${posX}px`;
            particula.style.top = `${posY}px`;
            particula.style.fontSize = `${tamano}rem`;
            particula.style.animationDuration = `${duracion}ms`;

            document.body.appendChild(particula);

            setTimeout(() => particula.remove(), parseInt(duracion));
        }
    }

});

// ==========================================
// 8. FUNCIONES AUXILIARES Y PROTECCIONES
// ==========================================
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Deshabilitar clic derecho
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Deshabilitar atajos de inspección (F12, Ctrl+Shift+I, etc.)
document.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'u')
    ) {
        e.preventDefault();
    }
});
