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
    // CONTROL DE APERTURA: EL PRIMER PASO
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

        // Orden de porciones físicas en el CSS de la ruleta
        const categoriesOrden = [
            "entrantes",
            "raciones",
            "ibericos",
            "quesos",
            "tostas",
            "piadinas",
            "dulces",
            "bocadillos"
        ];

        let categoriaId = resultado.categoria.id;
        // Mapeo adaptativo para los IDs de inglés y excepciones
        if (categoriaId === "tablas")  categoriaId = "raciones";
        if (categoriaId === "postres") categoriaId = "dulces";

        const indice = categoriesOrden.indexOf(categoriaId);
        const indiceSeguro = indice !== -1 ? indice : 0;

        const gradosPorCategoria = 360 / 8; 
        const gradosIcono = (indiceSeguro * gradosPorCategoria) + 22.5;
        const gradosFinal = (360 * 5) + gradosIcono;

        if (flechaAguja) {
            flechaAguja.style.transition = "none";
            flechaAguja.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
            flechaAguja.getBoundingClientRect(); // Reflow

            requestAnimationFrame(() => {
                flechaAguja.style.transition = "transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)";
                flechaAguja.style.transform = `translate3d(0, 0, 0) rotate(${gradosFinal}deg)`;
            });
        }

        rastrearPasoDeAguja(gradosFinal);

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

    // Efecto Glow dinámico al girar
    function rastrearPasoDeAguja(gradosObjetivo) {
        const tiempoInicial = performance.now();
        const duracionTotal = 3500;

        function obtenerGradosActuales(progreso) {
            return gradosObjetivo * (1 - Math.pow(1 - progreso, 3.5));
        }

        function actualizarGlow() {
            const tiempoActual = performance.now();
            let progreso = (tiempoActual - tiempoInicial) / duracionTotal;
            if (progreso > 1) progreso = 1;

            const gradosActuales = obtenerGradosActuales(progreso);
            const anguloNormalizado = (gradosActuales % 360 + 360) % 360;
            const indiceGajoActual = Math.floor(anguloNormalizado / 45) % 8;

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

    // Efecto partículas de confeti
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

    // Obtención segura del producto aleatorio
    function obtenerProducto(){
        const elSeleccionado = document.querySelector(".seleccionado");
        const personas = elSeleccionado ? elSeleccionado.dataset.comensales : "2";
        
        if (typeof carta === "undefined" || !carta || !Array.isArray(carta)) {
            return null;
        }

        let ServerCategorias;
        if(personas === "1"){
            ServerCategorias = carta.filter(c => [ "tostas", "piadinas", "dulces", "bocadillos" ].includes(c.id));
        } else {
            ServerCategorias = carta;
        }

        if (ServerCategorias.length === 0) ServerCategorias = carta;

        const categoria = ServerCategorias[Math.floor(Math.random()*ServerCategorias.length)];
        
        const productosValidos = categoria.productos.filter(p => {
            const nom = p.nombre.toLowerCase();
            return !nom.includes("extra") && !nom.includes("ingrediente") && !nom.includes("ingredient");
        });

        const listaFinal = productosValidos.length > 0 ? productosValidos : categoria.productos;
        const producto = listaFinal[Math.floor(Math.random()*listaFinal.length)];

        return { categoria, producto };
    }

    // Vaciar datos al cerrar la ventana de resultados
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
