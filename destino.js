/* ======================================================
   LÓGICA DEL DESTINO SAMAÍN 
====================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const btnDestino = document.querySelector('.btn-destino');
    const modalDestino = document.querySelector('.modal-destino');
    const cerrarDestino = document.querySelector('.cerrar-destino');
    const opcionesComensales = document.querySelectorAll('.opcion-comensales');

    const resultadoDestino = document.querySelector('.resultado-destino');
    const flechaRuleta = document.querySelector('.flecha-ruleta');
    const ruletaContainer = document.querySelector('.ruleta-destino');
    const discoRuleta = document.getElementById('disco-ruleta');
    const gajos = document.querySelectorAll('.gajo-quesito');

    const elemCategoria = document.getElementById('categoria-destino');
    const elemNombre = document.getElementById('nombre-destino');
    const elemDesc = document.getElementById('descripcion-destino');
    const elemPrecio = document.getElementById('precio-destino');

    const sonidoRuleta = document.getElementById('sonido-ruleta');
    const sonidoPremio = document.getElementById('sonido-premio');

    let girando = false;

    // 1. Abrir / Cerrar Modal de Elección de Comensales
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

            modalDestino.classList.remove('visible');

            const totalGajos = gajos.length || 8;
            const indiceGajoGanador = Math.floor(Math.random() * totalGajos);
            const gajoSeleccionado = gajos[indiceGajoGanador];

            const nombreCategoriaHTML = gajoSeleccionado ? gajoSeleccionado.dataset.categoria : null;

            let productosFiltrados = [];
            let tituloCategoriaReal = '';

            if (typeof carta !== 'undefined' && Array.isArray(carta)) {
                const catEncontrada = carta.find(c => 
                    c.titulo && nombreCategoriaHTML && 
                    c.titulo.toLowerCase().trim() === nombreCategoriaHTML.toLowerCase().trim()
                );

                if (catEncontrada && catEncontrada.productos && catEncontrada.productos.length > 0) {
                    productosFiltrados = catEncontrada.productos;
                    tituloCategoriaReal = catEncontrada.titulo;
                }
            }

            // Fallback si no encuentra productos en esa sección exacta
            if (productosFiltrados.length === 0 && typeof carta !== 'undefined') {
                carta.forEach(c => {
                    if (c.productos) productosFiltrados.push(...c.productos);
                });
                tituloCategoriaReal = nombreCategoriaHTML || 'Sugerencia Samaín';
            }

            if (productosFiltrados.length === 0) return;

            const platoGanador = productosFiltrados[Math.floor(Math.random() * productosFiltrados.length)];

            girando = true;
            
            // MANTENER OCULTO EL RESULTADO HASTA QUE ACABE DE GIRAR
            if (resultadoDestino) resultadoDestino.classList.remove('visible');

            iniciarGiroRuleta(platoGanador, tituloCategoriaReal, indiceGajoGanador, totalGajos);
        });
    });

    // 3. Giro de Ruleta y Centrado Angular
    function iniciarGiroRuleta(plato, categoriaNombre, gajoIndice, totalGajos) {
        if (ruletaContainer) ruletaContainer.classList.remove('finalizada');
        gajos.forEach(g => g.classList.remove('iluminado'));

        if (sonidoRuleta) {
            sonidoRuleta.currentTime = 0;
            sonidoRuleta.play().catch(() => {});
        }

        const gradosPorGajo = 360 / totalGajos;
        const centroGajo = (gajoIndice * gradosPorGajo) + (gradosPorGajo / 2);
        const anguloDestino = 360 - centroGajo;
        const anguloFinal = (360 * 5) + anguloDestino;

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
            elementoGiro.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
            elementoGiro.style.transform = `rotate(${anguloFinal}deg)`;
        }

        // AL TERMINAR EL GIRO (3.5 segundos)
        setTimeout(() => {
            clearInterval(intervaloGajos);

            if (sonidoRuleta) {
                sonidoRuleta.pause();
                sonidoRuleta.currentTime = 0;
            }
            if (sonidoPremio) {
                sonidoPremio.currentTime = 0;
                sonidoPremio.play().catch(() => {});
            }

            gajos.forEach(g => g.classList.remove('iluminado'));
            if (gajos[gajoIndice]) {
                gajos[gajoIndice].classList.add('iluminado');
            }

            if (ruletaContainer) ruletaContainer.classList.add('finalizada');

            // Cargar datos del plato
            if (elemCategoria) elemCategoria.textContent = categoriaNombre;
            if (elemNombre) elemNombre.textContent = plato.nombre;
            if (elemDesc) elemDesc.textContent = plato.descripcion || '';
            if (elemPrecio) elemPrecio.textContent = plato.precio;

            // AHORA SÍ: MOSTRAR TARJETA DE RESULTADO
            if (resultadoDestino) resultadoDestino.classList.add('visible');

            dispararConfeti();
            girando = false;
        }, 3500);
    }

    // 4. Cerrar Resultado al Hacer Clic
    if (resultadoDestino) {
        resultadoDestino.addEventListener('click', (e) => {
            e.stopPropagation();
            if (girando) return;
            resultadoDestino.classList.remove('visible');

            const elementoGiro = discoRuleta || flechaRuleta;
            if (elementoGiro) {
                elementoGiro.style.transition = 'none';
                elementoGiro.style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    elementoGiro.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
                }, 50);
            }
        });
    }

    // 5. Confeti
    function dispararConfeti() {
        const contenedorConfeti = document.getElementById('confeti');
        if (!contenedorConfeti) return;
        contenedorConfeti.innerHTML = '';
        const colores = ['#2d2b72', '#d8b35c', '#8b0000', '#ffffff'];
        for (let i = 0; i < 40; i++) {
            const particula = document.createElement('div');
            particula.classList.add('particula');
            particula.style.left = Math.random() * 100 + 'vw';
            particula.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
            particula.style.animationDelay = Math.random() * 300 + 'ms';
            contenedorConfeti.appendChild(particula);
        }
    }
});
