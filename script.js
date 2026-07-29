/* ======================================================
   SAMAÍN LA CORMELANA - LÓGICA PRINCIPAL JAVASCRIPT
====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. MENÚ HAMBURGUESA Y MODALES PRINCIPALES
    // ======================================================
    const btnHamburguesa = document.getElementById('btn-hamburguesa');
    const modalMenu = document.getElementById('modal-menu');
    const btnCerrarMenu = document.getElementById('btn-cerrar-menu');

    if (btnHamburguesa && modalMenu) {
        btnHamburguesa.addEventListener('click', (e) => {
            e.stopPropagation();
            modalMenu.classList.remove('hidden');
            modalMenu.classList.add('visible');
        });
    }

    if (btnCerrarMenu && modalMenu) {
        btnCerrarMenu.addEventListener('click', () => {
            modalMenu.classList.remove('visible');
            modalMenu.classList.add('hidden');
        });
    }

    // Modal Contacto
    const btnContacto = document.getElementById('btn-contacto');
    const modalContacto = document.getElementById('modal-contacto');
    const btnCerrarContacto = document.getElementById('btn-cerrar-contacto');

    if (btnContacto && modalContacto) {
        btnContacto.addEventListener('click', (e) => {
            e.preventDefault();
            modalContacto.classList.remove('hidden');
        });
    }

    if (btnCerrarContacto && modalContacto) {
        btnCerrarContacto.addEventListener('click', () => {
            modalContacto.classList.add('hidden');
        });
    }

    // Modal Galería
    const btnGaleria = document.getElementById('btn-galeria');
    const modalGaleria = document.getElementById('modal-galeria');
    const btnCerrarGaleria = document.getElementById('btn-cerrar-galeria');

    if (btnGaleria && modalGaleria) {
        btnGaleria.addEventListener('click', (e) => {
            e.preventDefault();
            modalGaleria.classList.remove('hidden');
        });
    }

    if (btnCerrarGaleria && modalGaleria) {
        btnCerrarGaleria.addEventListener('click', () => {
            modalGaleria.classList.add('hidden');
        });
    }

    // Modal Tienda / Llevar
    const btnTienda = document.getElementById('btn-tienda');
    const modalTienda = document.getElementById('modal-tienda');
    const btnCerrarTienda = document.getElementById('btn-cerrar-tienda');

    if (btnTienda && modalTienda) {
        btnTienda.addEventListener('click', (e) => {
            e.preventDefault();
            modalTienda.classList.remove('hidden');
        });
    }

    if (btnCerrarTienda && modalTienda) {
        btnCerrarTienda.addEventListener('click', () => {
            modalTienda.classList.add('hidden');
        });
    }

    // Visor de imágenes de la galería
    const galeriaItems = document.querySelectorAll('.galeria-item img');
    const modalVisor = document.getElementById('modal-visor');
    const imagenVisor = document.getElementById('imagen-visor');
    const btnCerrarVisor = document.getElementById('cerrar-visor');

    if (galeriaItems.length > 0 && modalVisor && imagenVisor) {
        galeriaItems.forEach(img => {
            img.addEventListener('click', () => {
                imagenVisor.src = img.src;
                modalVisor.classList.remove('hidden');
            });
        });

        if (btnCerrarVisor) {
            btnCerrarVisor.addEventListener('click', () => {
                modalVisor.classList.add('hidden');
            });
        }

        modalVisor.addEventListener('click', (e) => {
            if (e.target === modalVisor) {
                modalVisor.classList.add('hidden');
            }
        });
    }

    // Cerrar modales haciendo clic en el fondo oscuro
    window.addEventListener('click', (e) => {
        if (modalContacto && e.target === modalContacto) modalContacto.classList.add('hidden');
        if (modalGaleria && e.target === modalGaleria) modalGaleria.classList.add('hidden');
        if (modalTienda && e.target === modalTienda) modalTienda.classList.add('hidden');
        if (modalMenu && e.target === modalMenu) modalMenu.classList.add('hidden');
    });

    // ======================================================
    // 2. BUSCADOR EN TIEMPO REAL (CORREGIDO PARA MOSTRAR SECCIONES)
    // ======================================================
    const inputBuscar = document.getElementById('buscar');
    const secciones = document.querySelectorAll('.seccion');
    const contenedorBusqueda = document.querySelector('.resultado-busqueda');

    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            let encontrados = 0;

            if (texto === '') {
                // Restaurar visibilidad completa
                secciones.forEach(seccion => {
                    seccion.style.display = '';
                    const prods = seccion.querySelectorAll('.producto');
                    prods.forEach(p => p.style.display = '');
                });
                if (contenedorBusqueda) contenedorBusqueda.innerHTML = '';
                return;
            }

            secciones.forEach(seccion => {
                const prods = seccion.querySelectorAll('.producto');
                let tieneCoincidencias = false;

                prods.forEach(producto => {
                    const nombre = producto.querySelector('.nombre')?.textContent.toLowerCase() || '';
                    const desc = producto.querySelector('.descripcion')?.textContent.toLowerCase() || '';

                    if (nombre.includes(texto) || desc.includes(texto)) {
                        producto.style.display = '';
                        tieneCoincidencias = true;
                        encontrados++;
                    } else {
                        producto.style.display = 'none';
                    }
                });

                // Si una sección no tiene ningún producto coincidente, la ocultamos entera
                seccion.style.display = tieneCoincidencias ? '' : 'none';
            });

            if (contenedorBusqueda) {
                if (encontrados > 0) {
                    contenedorBusqueda.innerHTML = `<span class="con-resultados">Se han encontrado ${encontrados} productos</span>`;
                } else {
                    contenedorBusqueda.innerHTML = `<span class="sin-resultados">No se encontraron productos con "${texto}"</span>`;
                }
            }
        });
    }

    // ======================================================
    // 3. CATEGORÍAS STICKY Y SCROLL
    // ======================================================
    const categorias = document.querySelectorAll('.categoria');

    window.addEventListener('scroll', () => {
        let actual = '';
        secciones.forEach(seccion => {
            const top = seccion.offsetTop - 150;
            if (window.scrollY >= top && seccion.style.display !== 'none') {
                actual = seccion.getAttribute('id');
            }
        });

        categorias.forEach(cat => {
            cat.classList.remove('activa');
            if (cat.getAttribute('href') === `#${actual}`) {
                cat.classList.add('activa');
            }
        });
    });

    // ======================================================
    // 4. LÓGICA Y ANIMACIÓN DE LA RULETA SAMAÍN
    // ======================================================
    const btnDestino = document.querySelector('.btn-destino');
    const modalDestino = document.querySelector('.modal-destino');
    const cerrarDestino = document.querySelector('.cerrar-destino');
    const opcionesComensales = document.querySelectorAll('.opcion-comensales');
    const resultadoDestino = document.querySelector('.resultado-destino');
    const flechaRuleta = document.querySelector('.flecha-ruleta');

    // Audio sintetizado (AudioContext) para garantizar tics audibles sin archivos externos
    let audioCtx = null;

    function sonarTick() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {
            // Ignorar errores si la política del navegador bloquea el audio
        }
    }

    if (btnDestino && modalDestino) {
        btnDestino.addEventListener('click', () => {
            modalDestino.classList.add('visible');
        });
    }

    if (cerrarDestino && modalDestino) {
        cerrarDestino.addEventListener('click', () => {
            modalDestino.classList.remove('visible');
        });
    }

    // Array de platos para la ruleta
    const platosRuleta = [
        { nombre: "Tabla Samaín de Quesos y Embutidos", precio: "18,50 €", desc: "Selección especial de la casa con jamón ibérico y quesos del país.", cat: "Especialidades" },
        { nombre: "Tostón de Burrata con Jamón Ibérico", precio: "12,00 €", desc: "Pan artesano tostado, crema de burrata fresca y polvo de jamón.", cat: "Tostones" },
        { nombre: "Empanada Gallega del Día", precio: "6,50 €", desc: "Masa tradicional con relleno jugoso artesanal.", cat: "Raciones" },
        { nombre: "Queso Arzúa-Ulloa con Membrillo", precio: "8,00 €", desc: "Clásico postre o entrante gallego suave y cremoso.", cat: "Quesos" },
        { nombre: "Sándwich Completo Samaín", precio: "7,50 €", desc: "Pan brioche, doble jamón, queso fundido y salsa secreta.", cat: "Sándwiches" },
        { nombre: "Tarta de Queso Casera", precio: "5,00 €", desc: "Horneada diariamente con receta tradicional.", cat: "Postres" },
        { nombre: "Laconada con Cachelos", precio: "14,00 €", desc: "Lacón gallego cocido al punto con patatas de la tierra.", cat: "Raciones" },
        { nombre: "Copa de Vino Mencía / Albariño", precio: "3,50 €", desc: "Maridaje perfecto para acompañar cualquier tabla.", cat: "Bebidas" }
    ];

    if (opcionesComensales.length > 0 && resultadoDestino && flechaRuleta) {
        opcionesComensales.forEach(btn => {
            btn.addEventListener('click', () => {
                if (modalDestino) modalDestino.classList.remove('visible');

                // Elegir un plato aleatorio
                const indice = Math.floor(Math.random() * platosRuleta.length);
                const plato = platosRuleta[indice];

                // Calcular grados de giro (mínimo 5 vueltas completas + sector)
                const gradosPorSector = 360 / platosRuleta.length;
                const offsetGiro = (platosRuleta.length - indice) * gradosPorSector - (gradosPorSector / 2);
                const gradosTotales = 1800 + offsetGiro;

                // Cargar datos en la tarjeta final
                document.getElementById('nombre-destino').textContent = plato.nombre;
                document.getElementById('precio-destino').textContent = plato.precio;
                document.getElementById('descripcion-destino').textContent = plato.desc;

                const catElem = document.querySelector('.categoria-destino');
                if (catElem) catElem.textContent = plato.cat;

                // Preparar la ventana de la ruleta y resetear animación
                resultadoDestino.classList.remove('mostrar-resultado');
                resultadoDestino.classList.add('visible');

                flechaRuleta.style.transition = 'none';
                flechaRuleta.style.transform = 'rotate(0deg)';

                // Intervalo de sonido durante el giro
                let tiempoGiro = 0;
                const intervaloSonido = setInterval(() => {
                    sonarTick();
                    tiempoGiro += 120;
                    if (tiempoGiro >= 3400) {
                        clearInterval(intervaloSonido);
                    }
                }, 120);

                // Forzar frame para iniciar el giro de 3.5s
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        flechaRuleta.style.transition = 'transform 3.5s cubic-bezier(0.12, 0.8, 0.2, 1)';
                        flechaRuleta.style.transform = `rotate(${gradosTotales}deg)`;
                    });
                });

                // Al completar el giro (3.5s), ocultar la ruleta y mostrar únicamente la tarjeta con el resultado
                setTimeout(() => {
                    resultadoDestino.classList.add('mostrar-resultado');
                    lanzarConfeti();
                }, 3500);
            });
        });
    }

    if (resultadoDestino) {
        resultadoDestino.addEventListener('click', (e) => {
            if (e.target === resultadoDestino || e.target.closest('.tarjeta-destino')) {
                resultadoDestino.classList.remove('visible', 'mostrar-resultado');
            }
        });
    }

    // ======================================================
    // 5. EFECTO CONFETI
    // ======================================================
    function lanzarConfeti() {
        let contenedor = document.getElementById('confeti');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'confeti';
            document.body.appendChild(contenedor);
        }
        contenedor.innerHTML = '';

        const colores = ['#d8b35c', '#2d2b72', '#8b0000', '#27ae60', '#f39c12'];

        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particula';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
            p.style.animationDuration = (0.7 + Math.random() * 0.6) + 's';
            contenedor.appendChild(p);
        }

        setTimeout(() => {
            contenedor.innerHTML = '';
        }, 1500);
    }

    // ======================================================
    // 6. MODAL DE ALÉRGENOS
    // ======================================================
    const imgAlergenos = document.querySelector('.alergenos img');
    const modalAlergenos = document.querySelector('.modal-alergenos');
    const btnCerrarAlergenos = document.getElementById('cerrar-modal');

    if (imgAlergenos && modalAlergenos) {
        imgAlergenos.addEventListener('click', () => {
            modalAlergenos.classList.add('abierto');
        });
    }

    if (btnCerrarAlergenos && modalAlergenos) {
        btnCerrarAlergenos.addEventListener('click', () => {
            modalAlergenos.classList.remove('abierto');
        });
    }

    if (modalAlergenos) {
        modalAlergenos.addEventListener('click', (e) => {
            if (e.target === modalAlergenos) {
                modalAlergenos.classList.remove('abierto');
            }
        });
    }

});
