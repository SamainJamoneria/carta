// =========================================
// DESTINO SAMAÍN
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    //================================================
    // ELEMENTOS (Con selectores seguros)
    //================================================
    const btnDestino = document.getElementById("btn-destino");
    const modalDestino = document.getElementById("modal-destino");
    const cerrarDestino = document.getElementById("cerrar-destino");
    const resultadoDestino = document.getElementById("resultado-destino");
    const ruleta = document.querySelector(".ruleta-destino");
    const flechaAguja = document.getElementById("flecha-ruleta");
    const gajos = document.querySelectorAll(".gajo-quesito");

    const nombreDestino = document.getElementById("nombre-destino");
    const descripcionDestino = document.getElementById("descripcion-destino");
    const precioDestino = document.getElementById("precio-destino");
    const categoriaDestino = document.getElementById("categoria-destino");

    let timerFinalizacion = null;
    let frameId = null;

    console.log("Destino.js cargado e inicializado correctamente.");

    //================================================
    // CONTROL DE APERTURA
    //================================================
    if (btnDestino && modalDestino) {
        btnDestino.addEventListener("click", (e) => {
            e.preventDefault();
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

        // Buscar el gajo en el HTML que coincida con la categoría elegida
        let indiceObjetivo = 0;
        let categoriaId = resultado.categoria.id;

        if (gajos && gajos.length > 0) {
            gajos.forEach((gajo, index) => {
                const catGajo = gajo.dataset.categoria || gajo.id || "";
                if (catGajo.toLowerCase().includes(categoriaId.toLowerCase())) {
                    indiceObjetivo = index;
                }
            });
        }

        // CÁLCULO DE ÁNGULO ABSOLUTO
        const totalGajos = gajos.length || 8;
        const gradosPorGajo = 360 / totalGajos;

        // Calculamos los grados necesarios para que la aguja pare en el índice objetivo
        const gradosDestino = (indiceObjetivo * gradosPorGajo) + (gradosPorGajo / 2);
        const gradosFinal = (360 * 5) + gradosDestino;

        if (flechaAguja) {
            flechaAguja.style.transition = "none";
            flechaAguja.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
            flechaAguja.getBoundingClientRect(); // Reflow

            requestAnimationFrame(() => {
                flechaAguja.style.transition = "transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)";
                flechaAguja.style.transform = `translate3d(0, 0, 0) rotate(${gradosFinal}deg)`;
            });
        }

        rastrearPasoDeAguja(gradosFinal, totalGajos);

        timerFinalizacion = setTimeout(() => {
            if (frameId) cancelAnimationFrame(frameId);
            
            if (gajos) {
                gajos.forEach((gajo, i) => {
                    if (i === indiceObjetivo) gajo.classList.add("iluminado");
                    else gajo.classList.remove("iluminado");
                });
            }

            finalizarRuleta(resultado);
        }, 3500); 
    }

    // Efecto Glow dinámico al girar
    function rastrearPasoDeAguja(gradosObjetivo, totalGajos) {
        const tiempoInicial = performance.now();
        const duracionTotal = 3500;
        const gradosPorGajo = 360 / totalGajos;

        function obtenerGradosActuales(progreso) {
            return gradosObjetivo * (1 - Math.pow(1 - progreso, 3.5));
        }

        function actualizarGlow() {
            const tiempoActual = performance.now();
            let progreso = (tiempoActual - tiempoInicial) / duracionTotal;
            if (progreso > 1) progreso = 1;

            const gradosActuales = obtenerGradosActuales(progreso);
            const anguloNormalizado = (gradosActuales % 360 + 360) % 360;
            
            // Sincronización matemática directa con los índices del HTML
            const indiceGajoActual = Math.floor(anguloNormalizado / gradosPorGajo) % totalGajos;

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

    // Finalizar tirada y mostrar textos
    function finalizarRuleta(resultado){
        if (ruleta) {
            ruleta.classList.remove("girando");
            ruleta.classList.add("finalizada");
            setTimeout(() => ruleta.classList.remove("finalizada"), 450);
        }

        if(navigator.vibrate) navigator.vibrate([120, 60, 120]);
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

    // Obtención ponderada del producto
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
            if (flechaAguja) {
                flechaAguja.style.transition = "none";
                flechaAguja.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
            }
            
            if (nombreDestino) nombreDestino.textContent = "";
            if (descripcionDestino) descripcionDestino.textContent = "";
            if (precioDestino) precioDestino.textContent = "";
            if (categoriaDestino) categoriaDestino.textContent = "";
            
            resultadoDestino.classList.remove("visible");
        });
    }

});
