// =========================================
// DESTINO SAMAÍN (Con efectos de sonido integrados)
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    //================================================
    // ELEMENTOS
    //================================================
    const btnDestino = document.getElementById("btn-destino");
    const modalDestino = document.getElementById("modal-destino");
    const cerrarDestino = document.getElementById("cerrar-destino");
    const resultadoDestino = document.getElementById("resultado-destino");
    const ruleta = document.querySelector(".ruleta-destino");
    const discoRuleta = document.getElementById("disco-ruleta");
    const gajos = document.querySelectorAll(".gajo-quesito");

    const nombreDestino = document.getElementById("nombre-destino");
    const descripcionDestino = document.getElementById("descripcion-destino");
    const precioDestino = document.getElementById("precio-destino");
    const categoriaDestino = document.getElementById("categoria-destino");

    let timerFinalizacion = null;
    let frameId = null;
    let audioCtx = null; // Contexto de Web Audio API

    console.log("Destino.js cargado e inicializado correctamente.");

    //================================================
    // MOTOR DE SONIDO (Web Audio API)
    //================================================
    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Sonido seco tipo madera/trinquete para cada gajo
    function reproducirSonidoClick() {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.38, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {
            // Ignorar bloqueo de reproducción si el usuario no interactuó
        }
    }

    // Acorde de victoria al revelar el premio
    function reproducirSonidoVictoria() {
        if (!audioCtx) return;
        try {
            const notas = [523.25, 659.25, 783.99, 1046.50]; // Acorde Do Mayor (C5, E5, G5, C6)
            notas.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i * 0.08));

                gain.gain.setValueAtTime(0, audioCtx.currentTime + (i * 0.08));
                gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + (i * 0.08) + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (i * 0.08) + 0.35);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(audioCtx.currentTime + (i * 0.08));
                osc.stop(audioCtx.currentTime + (i * 0.08) + 0.35);
            });
        } catch (e) {}
    }

    //================================================
    // CONTROL DE APERTURA
    //================================================
    if (btnDestino && modalDestino) {
        btnDestino.addEventListener("click", (e) => {
            e.preventDefault();
            initAudio(); // Activa el audio tras gesto del usuario
            modalDestino.classList.add("visible");
        });
    }

    if (cerrarDestino) {
        cerrarDestino.addEventListener("click", cerrarModal);
    }

    if (modalDestino) {
        modalDestino.addEventListener("click", e => {
            if (e.target === modalDestino) cerrarModal();
        });
    }

    function cerrarModal(){
        if (modalDestino) modalDestino.classList.remove("visible");
    }

    // Seleccionar cuántos comensales
    document.querySelectorAll(".opcion-comensales").forEach(boton => {
        boton.addEventListener("click", () => {
            initAudio(); // Confirmación de contexto de audio
            document.querySelectorAll(".opcion-comensales").forEach(b => b.classList.remove("seleccionado"));
            boton.classList.add("seleccionado");
            cerrarModal();
            iniciarRuleta();
        });
    });

    //================================================
    // LOGICA DE GIRO
    //================================================
    function iniciarRuleta(){
        const resultado = obtenerProducto();
        
        if (!resultado) {
            alert("Error: No se pudo cargar los datos de la carta.");
            return;
        }

        if (resultadoDestino) resultadoDestino.classList.add("visible");
        if (ruleta) ruleta.classList.add("girando");

        const categoriesOrden = [
            "tostas",     // Index 0 (🥖)
            "entrantes",  // Index 1 (🍽️)
            "raciones",   // Index 2 (🍖)
            "quesos",     // Index 3 (🧀)
            "piadinas",   // Index 4 (🌯)
            "chocolates", // Index 5 (🍫)
            "bocadillos", // Index 6 (🥪)
            "dulces"      // Index 7 (🍰)
        ];

        let categoriaId = resultado.categoria.id;
        if (categoriaId === "tablas")  categoriaId = "raciones";
        if (categoriaId === "postres") categoriaId = "dulces";

        const indice = categoriesOrden.indexOf(categoriaId);
        const indiceSeguro = indice !== -1 ? indice : 0;

        const gradosPorGajo = 360 / 8;
        const gradosDestino = (360 - (indiceSeguro * gradosPorGajo)) % 360;
        const gradosFinal = (360 * 5) + gradosDestino;

        if (discoRuleta) {
            discoRuleta.style.transition = "none";
            discoRuleta.style.transform = "rotate(0deg)";
            discoRuleta.getBoundingClientRect(); // Reflow

            requestAnimationFrame(() => {
                discoRuleta.style.transition = "transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)";
                discoRuleta.style.transform = `rotate(${gradosFinal}deg)`;
            });
        }

        rastrearPasoDeGajo(gradosFinal);

        timerFinalizacion = setTimeout(() => {
            if (frameId) cancelAnimationFrame(frameId);
            
            if (gajos) {
                gajos.forEach((gajo, i) => {
                    if (i === indiceSeguro) gajo.classList.add("iluminado");
                    else gajo.classList.remove("iluminado");
                });
            }

            finalizarRuleta(resultado);
        }, 3500); 
    }

    // Iluminación y sonido dinámico
    function rastrearPasoDeGajo(gradosObjetivo) {
        const tiempoInicial = performance.now();
        const duracionTotal = 3500;
        let ultimoGajoIndex = -1;

        function obtenerGradosActuales(progreso) {
            return gradosObjetivo * (1 - Math.pow(1 - progreso, 3.5));
        }

        function actualizarGlow() {
            const tiempoActual = performance.now();
            let progreso = (tiempoActual - tiempoInicial) / duracionTotal;
            if (progreso > 1) progreso = 1;

            const gradosActuales = obtenerGradosActuales(progreso);
            const anguloNormalizado = (360 - (gradosActuales % 360)) % 360;
            const indiceGajoActual = Math.floor(anguloNormalizado / 45) % 8;

            // Si cambia de gajo respecto al frame anterior, dispara el sonido de click
            if (indiceGajoActual !== ultimoGajoIndex) {
                reproducirSonidoClick();
                ultimoGajoIndex = indiceGajoActual;
            }

            if (gajos) {
                gajos.forEach((gajo, i) => {
                    if (i === indiceGajoActual) gajo.classList.add("iluminado");
                    else gajo.classList.remove("iluminado");
                });
            }

            if (progreso < 1) {
                frameId = requestAnimationFrame(actualizarGlow);
            }
        }
        frameId = requestAnimationFrame(actualizarGlow);
    }

    // Finalizar tirada
    function finalizarRuleta(resultado){
        if (ruleta) {
            ruleta.classList.remove("girando");
            ruleta.classList.add("finalizada");
            setTimeout(() => ruleta.classList.remove("finalizada"), 450);
        }

        if(navigator.vibrate) navigator.vibrate([120, 60, 120]);
        reproducirSonidoVictoria();
        lanzarConfeti();    

        if (nombreDestino) nombreDestino.textContent = resultado.producto.nombre;
        if (descripcionDestino) descripcionDestino.textContent = resultado.producto.descripcion || "";
        if (precioDestino) precioDestino.textContent = resultado.producto.precio;
        if (categoriaDestino) categoriaDestino.textContent = resultado.categoria.icono + " " + resultado.categoria.titulo;
    }

    // Confeti
    function lanzarConfeti(){
        const contenedor = document.getElementById("confeti");
        if(!contenedor) return;
        const colores = ["#d8b35c", "#2d2b72", "#ffffff"];

        for(let i=0; i<28; i++){
            const pieza = document.createElement("div");
            pieza.className = "particula";
            pieza.style.background = colores[Math.floor(Math.random()*colores.length)];
            pieza.style.left = (window.innerWidth/2-80+Math.random()*160)+"px";
            pieza.style.top = (window.innerHeight/2-60)+"px";
            pieza.style.transform += ` translateX(${(Math.random()-0.5)*220}px)`;
            pieza.style.animationDuration = (700+Math.random()*400)+"ms";

            contenedor.appendChild(pieza);
            setTimeout(() => pieza.remove(), 1200);
        }
    }

    // Obtención de producto
    function obtenerProducto(){
        const elSeleccionado = document.querySelector(".seleccionado");
        const personas = elSeleccionado ? elSeleccionado.dataset.comensales : "2";
        
        if (typeof carta === "undefined" || !carta || !Array.isArray(carta)) {
            return null;
        }

        const cartaFiltrada = carta.filter(c => c.id !== "dulces" && c.id !== "postres" && c.id !== "chocolates");
        if (cartaFiltrada.length === 0) return null;

        const configuracionPesos = {
            "1": { "bocadillos": 4, "tostas": 3, "piadinas": 3, "quesos": 3 },
            "2": { "tostas": 3, "raciones": 3, "tablas": 4, "quesos": 3 },
            "3": { "tablas": 6, "raciones": 3 }
        };

        const pesosActuales = configuracionPesos[personas] || configuracionPesos["2"];

        const categoriasConPeso = cartaFiltrada.map(cat => {
            let idBuscado = cat.id;
            if (idBuscado === "tablas") idBuscado = "raciones";
            const peso = pesosActuales[cat.id] || pesosActuales[idBuscado] || 1;
            return { categoria: cat, peso: peso };
        });

        const sumaPesos = categoriasConPeso.reduce((acc, item) => acc + item.peso, 0);
        let aleatorio = Math.random() * sumaPesos;
        
        let categoriaElegida = categoriasConPeso[0].categoria;
        for (const item of categoriasConPeso) {
            if (aleatorio < item.peso) {
                categoriaElegida = item.categoria;
                break;
            }
            aleatorio -= item.peso;
        }

        const productosValidos = categoriaElegida.productos.filter(p => {
            const nom = p.nombre.toLowerCase();
            return !nom.includes("extra") && !nom.includes("ingrediente") && !nom.includes("ingredient");
        });

        const listaFinal = productosValidos.length > 0 ? productosValidos : categoriaElegida.productos;
        const producto = listaFinal[Math.floor(Math.random() * listaFinal.length)];

        return { categoria: categoriaElegida, producto };
    }

    // Resetear al cerrar
    if (resultadoDestino) {
        resultadoDestino.addEventListener("click", () => {
            if (timerFinalizacion) clearTimeout(timerFinalizacion);
            if (frameId) cancelAnimationFrame(frameId);
            
            if (ruleta) ruleta.classList.remove("girando", "finalizada");
            if (gajos) gajos.forEach(g => g.classList.remove("iluminado"));
            if (discoRuleta) {
                discoRuleta.style.transition = "none";
                discoRuleta.style.transform = "rotate(0deg)";
            }
            
            if (nombreDestino) nombreDestino.textContent = "";
            if (descripcionDestino) descripcionDestino.textContent = "";
            if (precioDestino) precioDestino.textContent = "";
            if (categoriaDestino) categoriaDestino.textContent = "";
            
            resultadoDestino.classList.remove("visible");
        });
    }

});
