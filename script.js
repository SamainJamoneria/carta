document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. RENDERIZADO DE MENÚ Y CATEGORÍAS
    // ==========================================
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
    // 5. GESTIÓN DE MODALES
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

    // --- Menú Hamburguesa ---
    const btnHamburguesa = document.getElementById('btn-menu-hamburguesa');
    const cerrarMenuPrincipal = document.getElementById('cerrar-menu-principal');

    if (btnHamburguesa && modalMenuPrincipal) {
        btnHamburguesa.addEventListener('click', (e) => {
            e.preventDefault();
            modalMenuPrincipal.classList.remove('hidden');
        });
    }

    if (cerrarMenuPrincipal && modalMenuPrincipal) {
        cerrarMenuPrincipal.addEventListener('click', () => {
            modalMenuPrincipal.classList.add('hidden');
        });
    }

    // Enlaces dentro del Menú Hamburguesa
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

    // Función que calcula qué modo corresponde según la fecha actual
    function obtenerModoPorFecha() {
        const ahora = new Date();
        const mes = ahora.getMonth() + 1; // 1 = Enero, 12 = Diciembre
        const dia = ahora.getDate();

        // 1. San Juan (15 al 25 de Junio)
        if (mes === 6 && dia >= 15 && dia <= 25) {
            return "modo-sanjuan";
        }

        // 2. Samaín / Halloween (20 de Octubre al 2 de Noviembre)
        if ((mes === 10 && dia >= 20) || (mes === 11 && dia <= 2)) {
            return "modo-samain";
        }

        // 3. Navidad (1 de Diciembre al 7 de Enero)
        if (mes === 12 || (mes === 1 && dia <= 7)) {
            return "modo-navidad";
        }

        // 4. Carnaval / Entroido (Del 10 al 25 de Febrero)
        if (mes === 2 && dia >= 10 && dia <= 25) {
            return "modo-carnaval";
        }

        return null; // Resto del año -> Sin efectos
    }

    // Activar modo automático (si no hay una clase forzada manualmente en el HTML)
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

    if (!modoActivo || !configuracionTemporadas[modoActivo]) return;

    const config = configuracionTemporadas[modoActivo];
    if (detalleEl) {
        detalleEl.textContent = config.texto;
    }

    // Generador de partículas al scroll
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

document.addEventListener('DOMContentLoaded', () => {
  const heartTrigger = document.getElementById('pixelHeart');
  const modal = document.getElementById('easterEggModal');
  const closeBtn = document.getElementById('closeHeartModal');
  const video = document.getElementById('pixelVideo');

// Abrir el Easter Egg al hacer clic/tocar el corazón
heartTrigger.addEventListener('click', () => {
  modal.style.display = 'flex';
  
  video.muted = false; // Nos aseguramos de que el sonido esté activo
  video.volume = 1.0;  // Volumen al máximo
  video.currentTime = 0;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      // Si por política estricta del móvil aún bloquea el sonido, 
      // reproducimos silenciado para que al menos se vea el vídeo.
      console.log("El navegador bloqueó el audio automático. Reproduciendo sin sonido...");
      video.muted = true;
      video.play();
    });
  }
});

  // Función para cerrar la ventana emergente y pausar el vídeo
  const closeModal = () => {
    modal.style.display = 'none';
    video.pause();
  };

  closeBtn.addEventListener('click', closeModal);

  // Cerrar al hacer clic fuera del recuadro del vídeo
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar al pulsar la tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
});
