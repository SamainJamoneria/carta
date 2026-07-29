/* ======================================================
    LÓGICA DEL DESTINO SAMAÍN (Español / Inglés)
====================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const btnDestino = document.getElementById('btn-destino') || document.querySelector('.btn-destino');
    const modalDestino = document.getElementById('modal-destino') || document.querySelector('.modal-destino');
    const cerrarDestino = document.getElementById('cerrar-destino') || document.querySelector('.cerrar-destino');
    const opcionesComensales = document.querySelectorAll('.opcion-comensales');

    const resultadoDestino = document.getElementById('resultado-destino') || document.querySelector('.resultado-destino');
    const flechaRuleta = document.getElementById('flecha-ruleta') || document.querySelector('.flecha-ruleta');
    const ruletaContainer = document.querySelector('.ruleta-destino');
    const discoRuleta = document.getElementById('disco-ruleta');
    const gajos = document.querySelectorAll('.gajo-quesito');

    const elemCategoria = document.getElementById('categoria-destino') || document.querySelector('.categoria-destino');
    const elemNombre = document.getElementById('nombre-destino');
    const elemDesc = document.getElementById('descripcion-destino');
    const elemPrecio = document.getElementById('precio-destino');

    let audioCtx = null;
    let girando = false;

    // Función de sonido sintético tipo TIC
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
            // Ignorar políticas de audio
        }
    }

    // Obtener la carta según el idioma activo
    function obtenerCartaActiva() {
        if (typeof carta !== 'undefined' && Array.isArray(carta) && carta.length > 0) return carta;
        if (typeof cartaEn !== 'undefined' && Array.isArray(cartaEn) && cartaEn.length > 0) return cartaEn;
        return [];
    }

    // 1. Abrir y Cerrar Modal de Comensales
    if (btnDestino && modalDestino) {
        btnDestino.addEventListener('click', (e) => {
            e.stopPropagation();
            modalDestino.classList.add('visible');
        });
    }

    if (cerrarDestino && modalDestino) {
        cerrarDestino.addEventListener('click', (e) => {
            e.stopPropagation();
            modalDestino.classList.remove('visible');
        });
    }

    // 2. Selección de Comensales y Búsqueda de Producto
    opcionesComensales.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (girando) return;

            if (modalDestino) modalDestino.classList.remove('visible');

            const cartaActiva = obtenerCartaActiva();
            const totalGajos = gajos.length || 8;
            const indiceGajoGanador = Math.floor(Math.random() * totalGajos);
            const gajoSeleccionado = gajos[indiceGajoGanador];
            const nombreCategoriaHTML = gajoSeleccionado ? gajoSeleccionado.dataset.categoria : null;

            let productosFiltrados = [];
            let tituloCategoriaReal = '';

            if (cartaActiva.length > 0) {
                let catEncontrada = cartaActiva[indiceGajoGanador % cartaActiva.length];

                if (nombreCategoriaHTML) {
                    const porNombre = cartaActiva.find(c => 
                        c.titulo && c.titulo.toLowerCase().trim() === nombreCategoriaHTML.toLowerCase().trim()
                    );
                    if (porNombre) catEncontrada = porNombre;
                }

                if (catEncontrada && catEncontrada.productos && catEncontrada.productos.length > 0) {
                    productosFiltrados = catEncontrada.productos;
                    tituloCategoriaReal = catEncontrada.titulo;
                }
            }

            // Fallback si no hay coincidencias directas
            if (productosFiltrados.length === 0 && cartaActiva.length > 0) {
                const catAzar = cartaActiva[Math.floor(Math.random() * cartaActiva.length)];
                productosFiltrados = catAzar.productos || [];
                tituloCategoriaReal = catAzar.titulo || 'Sugerencia';
            }

            if (productosFiltrados.length === 0) return;

            const platoGanador = productosFiltrados[Math.floor(Math.random() * productosFiltrados.length)];

            girando = true;
            if (resultadoDestino) {
                resultadoDestino.classList.remove('mostrar-resultado');
                resultadoDestino.classList.add('visible');
            }

            iniciarGiroRuleta(platoGanador, tituloCategoriaReal, indiceGajoGanador, totalGajos);
        });
    });

    // 3. Animación y Giro de Ruleta
    function iniciarGiroRuleta(plato, categoriaNombre, gajoIndice, totalGajos) {
        if (ruletaContainer) ruletaContainer.classList.remove('finalizada');
        gajos.forEach(g => g.classList.remove('iluminado'));

        const gradosPorGajo = 360 / totalGajos;
        const centroGajo = (gajoIndice * gradosPorGajo) + (gradosPorGajo / 2);
        const anguloDestino = 360 - centroGajo;
        const anguloFinal = (360 * 5) + anguloDestino;

        let tiempoSonido = 0;
        const intervaloSonido = setInterval(() => {
            sonarTick();
            tiempoSonido += 120;
            if (tiempoSonido >= 3400) {
                clearInterval(intervaloSonido);
            }
        }, 120);

        let pasada = 0;
        const intervaloGajos = setInterval(() => {
            gajos.forEach(g => g.classList.remove('iluminado'));
            if (gajos.length > 0) {
                gajos[pasada % gajos.length].classList.add('iluminado');
            }
            pasada++;
        }, 100);

        const elementoGiro = discoRuleta || flechaRuleta;
        if (elementoGiro) {
            elementoGiro.style.transition = 'none';
            elementoGiro.style.transform = 'rotate(0deg)';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    elementoGiro.style.transition = 'transform 3.5s cubic-bezier(0.12, 0.8, 0.2, 1)';
                    elementoGiro.style.transform = `rotate(${anguloFinal}deg)`;
                });
            });
        }

        setTimeout(() => {
            clearInterval(intervaloGajos);
            clearInterval(intervaloSonido);

            gajos.forEach(g => g.classList.remove('iluminado'));
            if (gajos[gajoIndice]) {
                gajos[gajoIndice].classList.add('iluminado');
            }

            if (ruletaContainer) ruletaContainer.classList.add('finalizada');

            if (elemCategoria) elemCategoria.textContent = categoriaNombre;
            if (elemNombre) elemNombre.textContent = plato.nombre;
            if (elemDesc) elemDesc.textContent = plato.descripcion || '';
            if (elemPrecio) elemPrecio.textContent = plato.precio;

            if (resultadoDestino) resultadoDestino.classList.add('mostrar-resultado');

            dispararConfeti();
            girando = false;
        }, 3500);
    }

    // 4. Cerrar Resultado al Hacer Clic
    if (resultadoDestino) {
        resultadoDestino.addEventListener('click', (e) => {
            e.stopPropagation();
            if (girando) return;
            resultadoDestino.classList.remove('visible', 'mostrar-resultado');

            const elementoGiro = discoRuleta || flechaRuleta;
            if (elementoGiro) {
                elementoGiro.style.transition = 'none';
                elementoGiro.style.transform = 'rotate(0deg)';
            }
        });
    }

    // 5. Confeti
    function dispararConfeti() {
        let contenedorConfeti = document.getElementById('confeti');
        if (!contenedorConfeti) {
            contenedorConfeti = document.createElement('div');
            contenedorConfeti.id = 'confeti';
            document.body.appendChild(contenedorConfeti);
        }
        contenedorConfeti.innerHTML = '';
        const colores = ['#2d2b72', '#d8b35c', '#8b0000', '#ffffff', '#27ae60'];

        for (let i = 0; i < 40; i++) {
            const particula = document.createElement('div');
            particula.classList.add('particula');
            particula.style.left = Math.random() * 100 + 'vw';
            particula.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
            particula.style.animationDuration = (0.7 + Math.random() * 0.6) + 's';
            contenedorConfeti.appendChild(particula);
        }

        setTimeout(() => {
            if (contenedorConfeti) contenedorConfeti.innerHTML = '';
        }, 1500);
    }
});
