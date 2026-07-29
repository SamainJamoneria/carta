document.addEventListener("DOMContentLoaded", () => {
    // 1. Selección de elementos
    const btnDestino = document.getElementById("btn-destino");
    const modalComensales = document.getElementById("modal-destino");
    const btnCerrarComensales = document.getElementById("cerrar-destino");
    const opcionesComensales = document.querySelectorAll(".opcion-comensales");

    const modalResultado = document.getElementById("resultado-destino");
    const discoRuleta = document.getElementById("disco-ruleta");
    const categoriaEl = document.getElementById("categoria-destino");
    const nombreEl = document.getElementById("nombre-destino");
    const descripcionEl = document.getElementById("descripcion-destino");
    const precioEl = document.getElementById("precio-destino");

    if (!btnDestino || !modalResultado || !discoRuleta) return;

    let girando = false;
    let audioContext = null;

    // Funciones auxiliares para mostrar/ocultar modales independientemente del CSS
    function abrirModal(elem) {
        if (!elem) return;
        elem.classList.add("activo", "abierto", "open", "show");
        elem.classList.remove("hidden");
        elem.style.display = "flex";
    }

    function cerrarModal(elem) {
        if (!elem) return;
        elem.classList.remove("activo", "abierto", "open", "show");
        elem.style.display = "none";
    }

    // Reproductor de sonido (Tick)
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
            // Silenciar si no hay permisos de audio
        }
    }

    // Evento al hacer clic en EL DESTINO SAMAÍN
    btnDestino.addEventListener("click", (e) => {
        e.preventDefault();
        if (modalComensales) {
            abrirModal(modalComensales);
        } else {
            ejecutarRuleta();
        }
    });

    // Cerrar el modal de comensales (botón X)
    if (btnCerrarComensales && modalComensales) {
        btnCerrarComensales.addEventListener("click", () => {
            cerrarModal(modalComensales);
        });
    }

    // Al seleccionar comensales -> Iniciar ruleta
    opcionesComensales.forEach(boton => {
        boton.addEventListener("click", () => {
            if (modalComensales) {
                cerrarModal(modalComensales);
            }
            ejecutarRuleta();
        });
    });

    // Lógica del giro
    function ejecutarRuleta() {
        if (typeof carta === "undefined" || !Array.isArray(carta) || carta.length === 0) {
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

        categoriaEl.textContent = "";
        nombreEl.textContent = "";
        descripcionEl.textContent = "";
        precioEl.textContent = "";

        abrirModal(modalResultado);
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

    // Cerrar resultado al hacer clic
    modalResultado.addEventListener("click", () => {
        if (!girando) {
            cerrarModal(modalResultado);
        }
    });
});
