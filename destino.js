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

    const esIngles = document.documentElement.lang === "en";
    const iconosRuleta = ["🧀", "🥓", "🍷", "🍺", "🥖", "🥩", "🥐", "☕"];
    
    // Paleta de colores elegantes para los 8 gajos alternados
    const coloresGajos = [
        "#c0392b", "#e67e22", "#f1c40f", "#27ae60", 
        "#2980b9", "#8e44ad", "#d35400", "#16a085"
    ];

    let girando = false;
    let audioContext = null;

    // 2. Audio sintetizado para el "tick" al girar
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
            // Silenciar si hay bloqueo de auto-play en el navegador
        }
    }

    // 3. Renderizar la ruleta con CSS dinámico (Garantiza los colores y gajos al 100%)
    function construirRuletaHTML() {
        discoRuleta.innerHTML = "";

        const totalGajos = 8;
        const anguloPaso = 360 / totalGajos;

        // Crear el fondo multicolor de sectores usando Conic Gradient
        let degradadoCss = "conic-gradient(";
        coloresGajos.forEach((color, i) => {
            const inicio = i * anguloPaso;
            const fin = (i + 1) * anguloPaso;
            degradadoCss += `${color} ${inicio}deg ${fin}deg${i === totalGajos - 1 ? "" : ", "}`;
        });
        degradadoCss += ")";

        // Aplicar estilos base directos al disco
        discoRuleta.style.background = degradadoCss;
        discoRuleta.style.borderRadius = "50%";
        discoRuleta.style.position = "relative";
        discoRuleta.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.3)";

        // Colocar los 8 iconos centrados dentro de cada sector
        for (let i = 0; i < totalGajos; i++) {
            const contenedorIcono = document.createElement("div");
            const anguloCentro = (i * anguloPaso) + (anguloPaso / 2);

            contenedorIcono.style.position = "absolute";
            contenedorIcono.style.top = "50%";
            contenedorIcono.style.left = "50%";
            contenedorIcono.style.width = "30px";
            contenedorIcono.style.height = "30px";
            contenedorIcono.style.marginLeft = "-15px";
            contenedorIcono.style.marginTop = "-15px";
            contenedorIcono.style.fontSize = "1.3rem";
            contenedorIcono.style.display = "flex";
            contenedorIcono.style.alignItems = "center";
            contenedorIcono.style.justifyContent = "center";
            contenedorIcono.style.pointerEvents = "none";
            
            // Posicionar mediante rotación y desplazamiento vertical
            contenedorIcono.style.transform = `rotate(${anguloCentro}deg) translateY(-85px) rotate(-${anguloCentro}deg)`;
            contenedorIcono.textContent = iconosRuleta[i % iconosRuleta.length];

            discoRuleta.appendChild(contenedorIcono);
        }
    }

    // 4. Lógica de activación al hacer clic en el botón
    btnDestino.addEventListener("click", (e) => {
        e.preventDefault();

        // Validar existencia de la carta
        if (typeof carta === "undefined" || !Array.isArray(carta) || carta.length === 0) {
            alert(esIngles ? "Menu items are loading..." : "Cargando carta...");
            return;
        }

        // Unificar todos los productos en una sola lista
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

        // Elegir ganador al azar
        const productoGanador = todosLosProductos[Math.floor(Math.random() * todosLosProductos.length)];

        // Dibujar el disco visualmente
        construirRuletaHTML();

        // Resetear textos mientras gira
        categoriaEl.textContent = "";
        nombreEl.textContent = "";
        descripcionEl.textContent = "";
        precioEl.textContent = "";

        // Mostrar modal
        modalDestino.classList.add("activo");
        girando = true;

        // Resetear animación de giro
        discoRuleta.style.transition = "none";
        discoRuleta.style.transform = "rotate(0deg)";
        void discoRuleta.offsetWidth; // Forzar repaint

        // Calcular vueltas y ángulo final de parada
        const vueltas = 5 + Math.floor(Math.random() * 3);
        const gradosFinales = vueltas * 360 + Math.floor(Math.random() * 360);
        const duracionMs = 4000;

        // Iniciar giro fluido con Bezier
        discoRuleta.style.transition = `transform ${duracionMs}ms cubic-bezier(0.15, 0.9, 0.2, 1)`;
        discoRuleta.style.transform = `rotate(${gradosFinales}deg)`;

        // Control de efectos de sonido secuenciales
        let ticksTotales = 28;
        let tickActual = 0;

        function emitirTicks() {
            if (tickActual < ticksTotales && girando) {
                reproducirTick();
                tickActual++;
                const proximoDelay = 80 + Math.pow(tickActual / ticksTotales, 2.5) * 350;
                setTimeout(emitirTicks, proximoDelay);
            }
        }
        emitirTicks();

        // Al finalizar la animación, revelar el premio
        setTimeout(() => {
            girando = false;
            categoriaEl.textContent = productoGanador.categoriaTitulo;
            nombreEl.textContent = productoGanador.nombre;
            descripcionEl.textContent = productoGanador.descripcion || "";
            precioEl.textContent = productoGanador.precio;
        }, duracionMs);
    });

    // 5. Cerrar el modal al hacer clic en la pantalla al terminar
    modalDestino.addEventListener("click", () => {
        if (!girando) {
            modalDestino.classList.remove("activo");
        }
    });
});
