document.addEventListener("DOMContentLoaded", () => {
    // 1. Elementos del DOM
    const btnDestino = document.getElementById("btn-destino");
    const modalSeleccion = document.getElementById("modal-destino");
    const btnCerrarSeleccion = document.getElementById("cerrar-destino");
    const opcionesComensales = document.querySelectorAll(".opcion-comensales");

    const modalRuleta = document.getElementById("resultado-destino");
    const discoRuleta = document.getElementById("disco-ruleta");
    const categoriaEl = document.getElementById("categoria-destino");
    const nombreEl = document.getElementById("nombre-destino");
    const descripcionEl = document.getElementById("descripcion-destino");
    const precioEl = document.getElementById("precio-destino");

    if (!btnDestino || !modalRuleta || !discoRuleta) return;

    const esIngles = document.documentElement.lang === "en";
    const iconosRuleta = ["🧀", "🥓", "🍷", "🍺", "🥖", "🥩", "🥐", "☕"];
    const coloresGajos = [
        "#c0392b", "#e67e22", "#f1c40f", "#27ae60", 
        "#2980b9", "#8e44ad", "#d35400", "#16a085"
    ];

    let girando = false;
    let audioContext = null;

    // 2. Audio sintetizado para los clicks del giro
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
            // Silenciar si hay restricciones de audio
        }
    }

    // 3. Renderizar el disco visualmente (Colores e iconos)
    function construirRuletaHTML() {
        discoRuleta.innerHTML = "";

        const totalGajos = 8;
        const anguloPaso = 360 / totalGajos;

        let degradadoCss = "conic-gradient(";
        coloresGajos.forEach((color, i) => {
            const inicio = i * anguloPaso;
            const fin = (i + 1) * anguloPaso;
            degradadoCss += `${color} ${inicio}deg ${fin}deg${i === totalGajos - 1 ? "" : ", "}`;
        });
        degradadoCss += ")";

        discoRuleta.style.background = degradadoCss;
        discoRuleta.style.borderRadius = "50%";
        discoRuleta.style.position = "relative";
        discoRuleta.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.3)";

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
            
            contenedorIcono.style.transform = `rotate(${anguloCentro}deg) translateY(-85px) rotate(-${anguloCentro}deg)`;
            contenedorIcono.textContent = iconosRuleta[i % iconosRuleta.length];

            discoRuleta.appendChild(contenedorIcono);
        }
    }

    // 4. PASO 1: Abrir modal de selección de comensales
    btnDestino.addEventListener("click", (e) => {
        e.preventDefault();
        if (modalSeleccion) {
            modalSeleccion.style.display = "flex";
            modalSeleccion.classList.add("activo");
        } else {
            iniciarRuleta(); // Si no existe el modal de comensales, salta directo
        }
    });

    // Cerrar modal de comensales
    if (btnCerrarSeleccion && modalSeleccion) {
        btnCerrarSeleccion.addEventListener("click", () => {
            modalSeleccion.style.display = "none";
            modalSeleccion.classList.remove("activo");
        });
    }

    // PASO 2: Elegir comensales e iniciar la ruleta
    opcionesComensales.forEach(boton => {
        boton.addEventListener("click", () => {
            if (modalSeleccion) {
                modalSeleccion.style.display = "none";
                modalSeleccion.classList.remove("activo");
            }
            iniciarRuleta();
        });
    });

    // 5. PASO 3: Ejecución de la Ruleta
    function iniciarRuleta() {
        if (typeof carta === "undefined" || !Array.isArray(carta) || carta.length === 0) {
            alert(esIngles ? "Menu items are loading..." : "Cargando carta...");
            return;
        }

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

        const productoGanador = todosLosProductos[Math.floor(Math.random() * todosLosProductos.length)];

        construirRuletaHTML();

        categoriaEl.textContent = "";
        nombreEl.textContent = "";
        descripcionEl.textContent = "";
        precioEl.textContent = "";

        // Mostrar la ventana de la ruleta (Asegurando display y clase)
        modalRuleta.style.display = "flex";
        modalRuleta.classList.add("activo", "open", "show");
        girando = true;

        discoRuleta.style.transition = "none";
        discoRuleta.style.transform = "rotate(0deg)";
        void discoRuleta.offsetWidth;

        const vueltas = 5 + Math.floor(Math.random() * 3);
        const gradosFinales = vueltas * 360 + Math.floor(Math.random() * 360);
        const duracionMs = 4000;

        discoRuleta.style.transition = `transform ${duracionMs}ms cubic-bezier(0.15, 0.9, 0.2, 1)`;
        discoRuleta.style.transform = `rotate(${gradosFinales}deg)`;

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

        setTimeout(() => {
            girando = false;
            categoriaEl.textContent = productoGanador.categoriaTitulo;
            nombreEl.textContent = productoGanador.nombre;
            descripcionEl.textContent = productoGanador.descripcion || "";
            precioEl.textContent = productoGanador.precio;
        }, duracionMs);
    }

    // 6. Cerrar modal al hacer clic tras terminar
    modalRuleta.addEventListener("click", () => {
        if (!girando) {
            modalRuleta.style.display = "none";
            modalRuleta.classList.remove("activo", "open", "show");
        }
    });
});
