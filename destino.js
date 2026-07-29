/* ======================================================
   LÓGICA DEL DESTINO SAMAÍN (RULETA Y CATEGORÍAS REALES)
====================================================== */

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

const sonidoRuleta = document.getElementById('sonido-ruleta');
const sonidoPremio = document.getElementById('sonido-premio');

let girando = false;

// 1. Abrir / Cerrar Modal
if (btnDestino && modalDestino) {
    btnDestino.addEventListener('click', () => modalDestino.classList.add('visible'));
}
if (cerrarDestino && modalDestino) {
    cerrarDestino.addEventListener('click', () => modalDestino.classList.remove('visible'));
}

// 2. Selección de Comensales
opcionesComensales.forEach(boton => {
    boton.addEventListener('click', () => {
        if (girando) return;

        modalDestino.classList.remove('visible');

        // Elegir un gajo/icono al azar de los 8 disponibles
        const totalGajos = gajos.length || 8;
        const indiceGajoGanador = Math.floor(Math.random() * totalGajos);
        const gajoSeleccionado = gajos[indiceGajoGanador];

        // Leer la categoría asociada a ese icono en el HTML (data-categoria)
        const nombreCategoria = gajoSeleccionado ? gajoSeleccionado.dataset.categoria : null;

        // Buscar los productos de ESA categoría en la variable 'carta'
        let productosFiltrados = [];
        if (typeof carta !== 'undefined' && Array.isArray(carta)) {
            const catEncontrada = carta.find(c => 
                c.titulo && nombreCategoria && 
                c.titulo.toLowerCase().trim() === nombreCategoria.toLowerCase().trim()
            );
            if (catEncontrada && catEncontrada.productos) {
                productosFiltrados = catEncontrada.productos;
            }
        }

        // Si la categoría no existe o está vacía, coger cualquier producto como respaldo
        if (productosFiltrados.length === 0) {
            carta.forEach(c => c.productos && productosFiltrados.push(...c.productos));
        }

        // Elegir plato de esa categoría concreta
        const platoGanador = productosFiltrados[Math.floor(Math.random() * productosFiltrados.length)];

        girando = true;
        resultadoDestino.classList.add('visible');
        iniciarGiroRuleta(platoGanador, indiceGajoGanador, totalGajos);
    });
});

// 3. Giro y Animación de Ruleta
function iniciarGiroRuleta(plato, gajoIndice, totalGajos) {
    ruletaContainer.classList.remove('finalizada');
    gajos.forEach(g => g.classList.remove('iluminado'));

    if (sonidoRuleta) {
        sonidoRuleta.currentTime = 0;
        sonidoRuleta.play().catch(() => {});
    }

    // Centrado angular exacto del gajo
    const gradosPorGajo = 360 / totalGajos;
    const centroGajo = (gajoIndice * gradosPorGajo) + (gradosPorGajo / 2);
    const anguloDestino = 360 - centroGajo;
    const anguloFinal = (360 * 5) + anguloDestino;

    // Parpadeo de luces
    let pasada = 0;
    const intervaloGajos = setInterval(() => {
        gajos.forEach(g => g.classList.remove('iluminado'));
        if (gajos.length > 0) {
            gajos[pasada % gajos.length].classList.add('iluminado');
        }
        pasada++;
    }, 100);

    flechaRuleta.style.transform = `rotate(${anguloFinal}deg)`;

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

        // Iluminar el gajo/icono del icono ganador
        gajos.forEach(g => g.classList.remove('iluminado'));
        if (gajos[gajoIndice]) {
            gajos[gajoIndice].classList.add('iluminado');
        }

        ruletaContainer.classList.add('finalizada');

        // Mostrar datos en la tarjeta
        if (elemNombre) elemNombre.textContent = plato.nombre;
        if (elemDesc) elemDesc.textContent = plato.descripcion || '';
        if (elemPrecio) elemPrecio.textContent = plato.precio;

        dispararConfeti();
        girando = false;
    }, 3500);
}

// 4. Cerrar Resultado
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
