document.addEventListener("DOMContentLoaded", () => {
    // 1. Elementos del DOM
    const btnDestino = document.getElementById("btn-destino");
    const modalDestino = document.getElementById("resultado-destino");
    const discoRuleta = document.getElementById("disco-ruleta");
    const categoriaEl = document.getElementById("categoria-destino");
    const nombreEl = document.getElementById("nombre-destino");
    const descripcionEl = document.getElementById("descripcion-destino");
    const precioEl = document.getElementById("precio-destino");

    if (!btnDestino || !modalDestino || !discoRuleta) return;

    // Detectar idioma si estamos en la versión en inglés
    const esIngles = document.documentElement.lang === "en";

    // Iconos por defecto para los gajos
    const iconosRuleta = ["🧀", "🥓", "🍷", "🍺", "🥖", "🥩", "🥐", "☕"];

    let girando = false;
    let audioContext = null;

    // 2. Función para reproducir el tick de sonido sintético al girar
    function reproducirTick() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(1200, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.03);

            gain.gain.setValueAtTime(0.15, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start();
            osc.stop(audioContext.currentTime + 0.03);
        } catch (e) {
            // Ignorar silenciando si el navegador bloquea el audio
        }
    }

    // 3. Renderizar los gajos y los iconos dentro del disco de la ruleta
    function construirRuletaHTML() {
        discoRuleta.innerHTML = ""; // Limpiar contenido previo

        const totalGajos = 8;
        const anguloPaso = 360 / totalGajos;

        // Crear los 8 gajos
        for (let i = 0; i < totalGajos; i++) {
            const gajo = document.createElement("div");
            gajo.className = `gajo-quesito gajo-${i + 1}`;
            gajo.style.transform = `rotate(${i * anguloPaso}deg)`;
            discoRuleta.appendChild(gajo);
        }

        // Crear los 8 iconos centrados en cada sector
        for (let i = 0; i < totalGajos; i++) {
            const icono = document.createElement("div");
            icono.className = `icono-ruleta icono-${i + 1}`;
            const anguloCentro = (i * anguloPaso) + (anguloPaso / 2);
            icono.style.transform = `rotate(${anguloCentro}deg) translateY(-80px) rotate(-${anguloCentro}deg)`;
            icono.textContent = iconosRuleta[i % iconosRuleta.length];
            discoRuleta.appendChild(icono);
        }
    }

    // 4. Lógica de activación al hacer clic en "Elige por mí"
    btnDestino.addEventListener("click", (e) => {
        e.preventDefault();

        // Verificar que la carta existe y tiene productos
        if (typeof carta === "undefined" || !Array.isArray(carta) || carta.length === 0) {
            alert(esIngles ? "Menu items are loading..." : "Cargando carta...");
            return;
        }

        // Obtener todos los productos disponibles
        const todosLosProductos = [];
        carta.forEach(cat => {
            if (cat.productos && cat.productos.length > 0) {
                cat.productos.forEach(prod => {
                    todosLosProductos.push({
                        ...prod,
                        categoriaTitulo: cat.titulo
                    });
                });
            }
        });

        if (todosLosProductos.length === 0) return;

        // Seleccionar producto aleatorio
        const productoGanador = todosLosProductos[Math.floor(Math.random() * todosLosProductos.length)];

        // Construir la ruleta visualmente
        construirRuletaHTML();

        // Resetear textos mientras gira
        categoriaEl.textContent = "";
        nombreEl.textContent = "";
        descripcionEl.textContent = "";
        precioEl.textContent = "";

        // Abrir el modal
        modalDestino.classList.add("activo");
        girando = true;

        // Resetear la rotación inicial sin animación
        discoRuleta.style.transition = "none";
        discoRuleta.style.transform = "rotate(0deg)";

        // Forzar reflow para asegurar el reset de CSS
        void discoRuleta.offsetWidth;

        // Calcular vueltas y ángulo final
        const vueltas = 5 + Math.floor(Math.random() * 3); // Entre 5 y 7 vueltas completas
        const gradosFinales = vueltas * 360 + Math.floor(Math.random() * 360);
        const duracionMs = 4000;

        // Iniciar animación de giro
        discoRuleta.style.transition = `transform ${duracionMs}ms cubic-bezier(0.15, 0.9, 0.2, 1)`;
        discoRuleta.style.transform = `rotate(${gradosFinales}deg)`;

        // Efecto de sonido mientras rueda
        let ticksTotales = 28;
        let tickActual = 0;

        function emitirTicks() {
            if (tickActual < ticksTotales && girando) {
                reproducirTick();
                tickActual++;
                // Los ticks se van ralentizando exponencialmente
                const proximoDelay = 80 + Math.pow(tickActual / ticksTotales, 2.5) * 350;
                setTimeout(emitirTicks, proximoDelay);
            }
        }
        emitirTicks();

        // Al finalizar el giro, mostrar el resultado
        setTimeout(() => {
            girando = false;
            categoriaEl.textContent = productoGanador.categoriaTitulo;
            nombreEl.textContent = productoGanador.nombre;
            descripcionEl.textContent = productoGanador.descripcion || "";
            precioEl.textContent = productoGanador.precio;
        }, duracionMs);
    });

    // 5. Cerrar modal al hacer clic en cualquier lugar tras finalizar
    modalDestino.addEventListener("click", () => {
        if (!girando) {
            modalDestino.classList.remove("activo");
        }
    });
});
