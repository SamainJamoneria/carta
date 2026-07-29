/* ======================================================
   LÓGICA DEL DESTINO SAMAÍN (RULETA)
====================================================== */

// 1. Referencias a los elementos del HTML
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

let girando = false;

// 2. Abrir y Cerrar Ventana de Selección de Comensales
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

        // Ocultar modal de comensales usando tu CSS (.visible)
        modalDestino.classList.remove('visible');

        // Extraer los productos de tu carta de menu.js
        const todosLosProductos = [];
        if (typeof carta !== 'undefined' && Array.isArray(carta)) {
            carta.forEach(cat => {
                if (cat.productos) {
                    cat.productos.forEach(prod => todosLosProductos.push(prod));
                }
            });
        }

        if (todosLosProductos.length === 0) return;

        // Seleccionar plato aleatorio
        const platoGanador = todosLosProductos[Math.floor(Math.random() * todosLosProductos.length)];

        // Abrir ruleta y lanzar tiro
        girando = true;
        resultadoDestino.classList.add('visible');
        iniciarGiroRuleta(platoGanador);
    });
});

// 4. Giro de la Ruleta y Animación de Luces
function iniciarGiroRuleta(plato) {
    ruletaContainer.classList.remove('finalizada');
    gajos.forEach(gajo => gajo.classList.remove('iluminado'));

    // Calcular vueltas + ángulo aleatorio
    const vueltas = 360 * (Math.floor(Math.random() * 4) + 5);
    const anguloFinal = vueltas + Math.floor(Math.random() * 360);

    // Parpadeo de gajos mientras gira
    let gajoActual = 0;
    const intervaloGajos = setInterval(() => {
        gajos.forEach(g => g.classList.remove('iluminado'));
        gajos[gajoActual].classList.add('iluminado');
        gajoActual = (gajoActual + 1) % gajos.length;
    }, 100);

    // Girar la flecha (3.5 segundos exactos según tu CSS)
    flechaRuleta.style.transform = `rotate(${anguloFinal}deg)`;

    // Cuando termina de girar
    setTimeout(() => {
        clearInterval(intervaloGajos);
        
        // Animación de rebote final de tu CSS
        ruletaContainer.classList.add('finalizada');

        // Poner datos del plato ganador
        if (elemNombre) elemNombre.textContent = plato.nombre;
        if (elemDesc) elemDesc.textContent = plato.descripcion;
        if (elemPrecio) elemPrecio.textContent = plato.precio;

        // Confeti
        dispararConfeti();

        girando = false;
    }, 3500);
}

// 5. Cerrar Resultado al Hacer Clic Fuera
if (resultadoDestino) {
    resultadoDestino.addEventListener('click', () => {
        if (girando) return;
        
        resultadoDestino.classList.remove('visible');
        
        // Resetear flecha
        flechaRuleta.style.transition = 'none';
        flechaRuleta.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            flechaRuleta.style.transition = 'transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
        }, 50);
    });
}

// 6. Confeti con tus clases CSS
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
