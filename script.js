document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. RENDERIZADO DE MENÚ Y CATEGORÍAS (Blindado)
    // ==========================================
    const menu = document.getElementById("menu-categorias");

    if (menu && typeof carta !== "undefined" && Array.isArray(carta)) {
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

    if (contenedor && typeof carta !== "undefined" && Array.isArray(carta)) {
        carta.forEach(categoria => {
            const seccion = document.createElement("section");
            seccion.className = "seccion";
            seccion.id = categoria.id;

            const titulo = document.createElement("h2");
            titulo.innerHTML = `<img src="${categoria.icono}" alt="${categoria.titulo}" class="img-titulo-cat"> ${categoria.titulo}`;
            seccion.appendChild(titulo);

            if (categoria.productos && Array.isArray(categoria.productos)) {
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
            }

            contenedor.appendChild(seccion);
        });
    }

    // ==========================================
    // 2. INTERSECTION OBSERVER
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
    // 5. GESTIÓN DE MODALES
    // ==========================================
    const modalContacto = document.getElementById('modal-contacto');
    const modalGaleria = document.getElementById('modal-galeria');
    const modalTienda = document.getElementById('modal-tienda');
    const modalAlergenos = document.getElementById('modal-alergenos');
    const modalMenuPrincipal = document.getElementById('modal-menu-principal');

    const imagenAlergenos = document.getElementById("imagen-alergenos");
    const cerrarAlergenos = document.getElementById("cerrar-modal");

    if (imagenAlergenos && modalAlergenos) {
        imagenAlergenos.addEventListener("click", () => modalAlergenos.classList.add("abierto"));
    }
    if (cerrarAlergenos && modalAlergenos) {
        cerrarAlergenos.addEventListener("click", () => modalAlergenos.classList.remove("abierto"));
    }

    const btnContacto = document.getElementById('btn-contacto-carta');
    const cerrarContacto = document.getElementById('cerrar-contacto');

    if (btnContacto && modalContacto) {
        btnContacto.addEventListener('click', () => modalContacto.classList.remove('hidden'));
    }
    if (cerrarContacto && modalContacto) {
        cerrarContacto.addEventListener('click', () => modalContacto.classList.add('hidden'));
    }

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

    const btnHamburguesa = document.getElementById('btn-menu-hamburguesa');
    const cerrarMenuPrincipal = document.getElementById('cerrar-menu-principal');

    if (btnHamburguesa && modalMenuPrincipal) {
        btnHamburguesa.addEventListener('click', (e) => {
            e.preventDefault();
            modalMenuPrincipal.classList.remove('hidden');
            btnHamburguesa.setAttribute('aria-expanded', 'true');
        });
    }

    if (cerrarMenuPrincipal && modalMenuPrincipal) {
        cerrarMenuPrincipal.addEventListener('click', () => {
            modalMenuPrincipal.classList.add('hidden');
            if (btnHamburguesa) btnHamburguesa.setAttribute('aria-expanded', 'false');
        });
    }

    // ==========================================
    // 6. CIERRE GLOBAL DE MODALES
    // ==========================================
    window.addEventListener('click', (event) => {
        if (event.target === modalContacto) modalContacto.classList.add('hidden');
        if (event.target === modalGaleria) modalGaleria.classList.add('hidden');
        if (event.target === modalTienda) modalTienda.classList.add('hidden');
        if (event.target === modalAlergenos) modalAlergenos.classList.remove('abierto');
        if (event.target === modalMenuPrincipal) modalMenuPrincipal.classList.add('hidden');
    });

    // ==========================================
    // 7. EFECTOS DE TEMPORADA AUTOMÁTICOS Y PARTÍCULAS
    // ==========================================
    const body = document.body;
    const contenedorTemporada = document.getElementById("contenedor-temporada");
    const iconoIzq = document.getElementById("icono-izq");
    const iconoDer = document.getElementById("icono-der");
    const detalleEl = document.getElementById("detalle-temporada");
    const contenedorConfeti = document.getElementById("confeti");

    const obtenerEsIngles = () => document.documentElement.lang === "en";

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

    const configuracionTemporadas = {
        "modo-navidad": {
            icono: "santa.png",
            textos: {
                es: "Felices Fiestas de parte del equipo de Samaín",
                en: "Merry Christmas from the Samaín team"
            },
            particulas: ["bola_roja.png", "bola_amarilla.png", "bola_azul.png", "bola_roja.png"]
        },
        "modo-sanjuan": {
            icono: "fuego.png",
            textos: {
                es: "¡Llega la mágica Noche de San Juan!",
                en: "Celebrating San Juan"
            },
            particulas: ["ascuas.png", "ascuas.png", "ascuas.png", "ascuas.png"]
        },
        "modo-carnaval": {
            icono: "bufon.png",
            textos: {
                es: "¡Feliz Carnaval!",
                en: "Happy Carnival Season!"
            },
            particulas: ["confeti.png", "mascara.png", "sombrero.png", "bufon.png"]
        },
        "modo-samain": {
            icono: "calabazza.png",
            textos: {
                es: "¡Feliz Samaín / Halloween!",
                en: "Happy Samain / Halloween!"
            },
            particulas: ["calabaza.png", "fantasma.png", "araña.png", "rip.png"]
        }
    };

    const modoActivo = obtenerModoPorFecha();

    if (modoActivo && configuracionTemporadas[modoActivo]) {
        body.classList.add(modoActivo);
        const config = configuracionTemporadas[modoActivo];
        
        if (contenedorTemporada) contenedorTemporada.style.display = "flex";
        if (iconoIzq) iconoIzq.src = config.icono;
        if (iconoDer) iconoDer.src = config.icono;
        if (detalleEl) {
            detalleEl.textContent = obtenerEsIngles() ? config.textos.en : config.textos.es;
        }

        // Generar partículas deslizándose por toda la pantalla
        if (contenedorConfeti && config.particulas && config.particulas.length > 0) {
            const numeroParticulas = 20;
            for (let i = 0; i < numeroParticulas; i++) {
                const particula = document.createElement("img");
                const imagenAleatoria = config.particulas[Math.floor(Math.random() * config.particulas.length)];
                particula.src = imagenAleatoria;
                particula.className = "particula-flotante";
                
                particula.style.left = Math.random() * 100 + "vw";
                particula.style.top = -10 + "vh";
                particula.style.animationDuration = (Math.random() * 5 + 5) + "s";
                particula.style.animationDelay = (Math.random() * 5) + "s";
                particula.style.opacity = Math.random() * 0.7 + 0.3;
                particula.style.width = (Math.random() * 20 + 20) + "px";
                
                contenedorConfeti.appendChild(particula);
            }
        }
    } else {
        if (contenedorTemporada) contenedorTemporada.style.display = "none";
    }

    // ==========================================
    // 8. FUNCIONES AUXILIARES Y PROTECCIONES
    // ==========================================
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12') {
            e.preventDefault();
        }
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
            e.preventDefault();
        }
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
        }
    });
});
