/* ======================================================
   LÓGICA DEL DESTINO SAMAÍN (RULETA) - FIX GEOMETRÍA
====================================================== */

// 1. Referencias al DOM
const btnDestino = document.querySelector('.btn-destino');
const modalDestino = document.querySelector('.modal-destino');
const cerrarDestino = document.querySelector('.cerrar-destino');
const opcionesComensales = document.querySelectorAll('.opcion-comensales');

const resultadoDestino = document.querySelector('.resultado-destino');
const flechaRuleta = document.querySelector('.flecha-ruleta');
const ruletaContainer = document.querySelector('.ruleta-destino');
const gajos = document.querySelectorAll('.gajo-quesito');

const elemNombre = document.getElementById('nombre-destino');
const elemDesc = document.getElementById('descripcion-destino');
const elemPrecio = document.getElementById('precio-destino');

// Referencias de audio
const sonidoRuleta = document.getElementById('sonido-ruleta');
const sonidoPremio = document.getElementById('sonido-premio');

let girando = false;

// 2. Abrir y Cerrar Ventana de Selección
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

// 3. Selección de Comensales y Elección del Producto
opcionesComensales.forEach(boton => {
    boton.addEventListener('click', () => {
        if (girando) return;

        modalDestino.classList.remove('visible');

        // Mapear categorías de tu variable 'carta'
        if (typeof carta === 'undefined' || !Array.isArray(carta) || carta.length === 0) return;

        // Seleccionar una categoría al azar (0 a 7 según los 8 gajos de la ruleta)
        const totalGajos = gajos.length || 8;
        const gajoGanadorIndice = Math.floor(Math.random() * totalGajos);

        // Elegir una categoría/producto acorde
        const categoria = carta[gajoGanadorIndice % carta.length];
        let platoGanador = null;

        if (categoria && categoria.productos && categoria.productos.length > 0) {
            platoGanador = categoria.productos[Math.floor(Math.random() * categoria.productos.length)];
        } else {
            // Si la categoría no tiene platos, coger de cualquier otra
            const todos = [];
            carta.forEach(c => c.productos && todos.push(...c.productos));
            platoGanador = todos[Math.floor(Math.random() * todos.length)];
        }

        if (!platoGanador) return;

        girando = true;
        resultadoDestino.classList.add('visible');
        iniciarGiroRuleta(platoGanador, gajoGanadorIndice, totalGajos);
    });
});

// 4. Giro de la Ruleta y Alineación Angular Exacta
function iniciarGiroRuleta(plato, gajoIndice, totalGajos) {
    ruletaContainer.classList.remove('finalizada');
    gajos.forEach(gajo => gajo.classList.remove('iluminado'));

    if (sonidoRuleta) {
        sonidoRuleta.currentTime = 0;
        sonidoRuleta.play().catch(() => {});
    }

    // Cada gajo mide 360 / totalGajos (45 grados para 8 gajos)
    const gradosPorGajo = 360 / totalGajos;
    
    // El centro del gajo 'i' está en (i * gradosPorGajo) + (gradosPorGajo / 2)
    // Para que la flecha apunte arriba (0 deg), restamos para alinear el centro exacto:
    const centroGajo = (gajoIndice * gradosPorGajo) + (gradosPorGajo / 2);
    const anguloDestino = 360 - centroGajo;

    // 5 vueltas completas de giro + ángulo exacto del centro del gajo
    const vueltasCompletas = 360 * 5;
    const anguloFinal = vueltasCompletas + anguloDestino;

    // Animación de parpadeo secuencial
    let pasada = 0;
    const intervaloGajos = setInterval(() => {
        gajos.forEach(g => g.classList.remove('iluminado'));
        if (gajos.length > 0) {
            gajos[pasada % gajos.length].classList.add('iluminado');
        }
        pasada++;
    }, 100);

    // Aplicar la rotación a la flecha/ruleta
    flechaRuleta.style.transform = `rotate(${anguloFinal}deg)`;

    // Al finalizar la animación (3.5s)
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

        // Iluminar ÚNICAMENTE el gajo ganador centrado
        gajos.forEach(g => g.classList.remove('iluminado'));
        if (gajos[gajoIndice]) {
            gajos[gajoIndice].classList.add('iluminado');
        }

        ruletaContainer.classList.add('finalizada');

        // Cargar los datos del plato
        if (elemNombre) elemNombre.textContent = plato.nombre;
        if (elemDesc) elemDesc.textContent = plato.descripcion || plato.categoria || '';
        if (elemPrecio) elemPrecio.textContent = plato.precio;

        dispararConfeti();

        girando = false;
    }, 3500);
}

// 5. Cerrar Resultado
if (resultadoDestino) {
    resultadoDestino.addEventListener('click', () => {
        if (girando) return;
        
        resultadoDestino.classList.remove('visible');
        
        flechaRuleta.style.transition = 'none';
        flechaRuleta.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            flechaRuleta.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
        }, 50);
    });
}

// 6. Confeti
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
