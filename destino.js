// =========================================
// DESTINO SAMAÍN
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
    const flechaAguja = document.querySelector(".flecha-ruleta");
    const gajos = document.querySelectorAll(".gajo-quesito");

    const nombreDestino = document.getElementById("nombre-destino");
    const descripcionDestino = document.getElementById("descripcion-destino");
    const precioDestino = document.getElementById("precio-destino");
    const categoriaDestino = document.getElementById("categoria-destino");

    // Temporizadores y variables de control de animación
    let timerFinalizacion = null;
    let frameId = null;


    //================================================
    // ABRIR / CERRAR MODAL
    //================================================

    btnDestino.addEventListener("click", () => {
        modalDestino.classList.add("visible");
    });

    cerrarDestino.addEventListener("click", cerrarModal);

    modalDestino.addEventListener("click", e => {
        if (e.target === modalDestino) cerrarModal();
    });

    function cerrarModal(){
        modalDestino.classList.remove("visible");
    }


    //================================================
    // SELECCIÓN DE COMENSALES
    //================================================

    document.querySelectorAll(".opcion-comensales").forEach(boton=>{
        boton.addEventListener("click",()=>{
            document.querySelectorAll(".opcion-comensales")
            .forEach(b=>b.classList.remove("seleccionado"));

            boton.classList.add("seleccionado");
            cerrarModal();
            iniciarRuleta();
        });
    });


    //================================================
    // INICIAR RULETA
    //================================================

    function iniciarRuleta(){
        resultadoDestino.classList.add("visible");

        const resultado = obtenerProducto();
        ruleta.classList.add("girando");

        // Lista exacta de las 8 categorías mapeadas en orden según tus 8 quesitos visuales
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

        const indice = categoriesOrden.indexOf(resultado.categoria.id);
        const gradosPorCategoria = 360 / 8; // 45º exactos por porción
        
        // Calculamos los grados exactos del centro de la porción ganadora.
        // Sumamos 22.5º para clavar el centro exacto del quesito.
        const gradosIcono = (indice * gradosPorCategoria) + 22.5;

        // 5 vueltas completas de inercia hacia adelante (sentido horario) más la posición de la categoría
        const gradosFinal = (360 * 5) + gradosIcono;

        // Forzamos un reflow antes de iniciar para limpiar estilos previos
        flechaAguja.style.transform = "rotate(0deg)";
        flechaAguja.getBoundingClientRect();

        // Rotamos la aguja central con la transición fluida definida en CSS
        flechaAguja.style.transition = "transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)";
        flechaAguja.style.transform = `rotate(${gradosFinal}deg)`;

        // Iniciamos el rastreador en tiempo real para iluminar los quesitos al paso de la aguja
        rastrearPasoDeAguja(gradosFinal);

        // Esperamos los 3.5 segundos exactos de la transición
        timerFinalizacion = setTimeout(() => {
            cancelAnimationFrame(frameId);
            
            // Forzamos que al terminar se encienda únicamente el gajo ganador definitivo
            gajos.forEach((gajo, i) => {
                if (i === indice) {
                    gajo.classList.add("iluminado");
                } else {
                    gajo.classList.remove("iluminado");
                }
            });

            finalizarRuleta(resultado);
        }, 3500); 
    }

    //================================================
    // DETECCIÓN DINÁMICA DE GAJOS (EFECTO GLOW)
    //================================================

    function rastrearPasoDeAguja(gradosObjetivo) {
        const tiempoInicial = performance.now();
        const duracionTotal = 3500; // Mismos ms que la animación CSS

        function obtenerGradosActuales(progreso) {
            // Curva bezier de frenado simulada por software para aproximar el CSS
            const factor = 1 - Math.pow(1 - progreso, 3.5); 
            return gradosObjetivo * factor;
        }

        function actualizarGlow() {
            const tiempoActual = performance.now();
            let progreso = (tiempoActual - tiempoInicial) / duracionTotal;

            if (progreso > 1) progreso = 1;

            const gradosActuales = obtenerGradosActuales(progreso);
            
            // Reducimos a una única vuelta de 0 a 359.99 para saber en qué ángulo exacto se encuentra la punta
            const anguloNormalizado = (gradosActuales % 360 + 360) % 360;

            // Al girar la aguja en sentido horario, dividimos directamente por 45 para obtener el índice real
            const indiceGajoActual = Math.floor(anguloNormalizado / 45) % 8;

            // Añadimos y removemos la clase CSS iluminado de forma reactiva y limpia
            gajos.forEach((gajo, i) => {
                if (i === indiceGajoActual) {
                    gajo.classList.add("iluminado");
                } else {
                    gajo.classList.remove("iluminado");
                }
            });

            if (progreso < 1) {
                frameId = requestAnimationFrame(actualizarGlow);
            }
        }

        frameId = requestAnimationFrame(actualizarGlow);
    }

    //================================================
    // FINALIZAR RULETA
    //================================================

    function finalizarRuleta(resultado){
        ruleta.classList.remove("girando");
        ruleta.classList.add("finalizada");

        setTimeout(() => {
            ruleta.classList.remove("finalizada");
        }, 450);

        // Feedback háptico en dispositivos móviles
        if(navigator.vibrate){
            navigator.vibrate([120, 60, 120]);
        }

        lanzarConfeti();    

        nombreDestino.textContent = resultado.producto.nombre;
        descripcionDestino.textContent = resultado.producto.descripcion || "";
        precioDestino.textContent = resultado.producto.precio;
        categoriaDestino.textContent = resultado.categoria.icono + " " + resultado.categoria.titulo;
    }

    //================================================
    // LANZAR CONFETI
    //================================================
    
    function lanzarConfeti(){
        const contenedor = document.getElementById("confeti");
        const colores = ["#d8b35c", "#2d2b72", "#ffffff"];

        for(let i=0;i<28;i++){
            const pieza=document.createElement("div");
            pieza.className="particula";
            pieza.style.background= colores[Math.floor(Math.random()*colores.length)];
            pieza.style.left= (window.innerWidth/2-80+Math.random()*160)+"px";
            pieza.style.top= (window.innerHeight/2-60)+"px";
            pieza.style.transform+= ` translateX(${(Math.random()-0.5)*220}px)`;
            pieza.style.animationDuration= (700+Math.random()*400)+"ms";

            contenedor.appendChild(pieza);
            setTimeout(()=>pieza.remove(),1200);
        }
    }


    //================================================
    // ELEGIR PRODUCTO
    //================================================

    function obtenerProducto(){
        const personas = document.querySelector(".seleccionado").dataset.comensales;
        let categorias;

        if(personas==="1"){
            categorias=carta.filter(c=> [ "tostas", "piadinas", "dulces", "bocadillos" ].includes(c.id));
        }else{
            categorias=carta;
        }

        const categoria = categorias[Math.floor(Math.random()*categorias.length)];
        const producto = categoria.productos[Math.floor(Math.random()*categoria.productos.length)];

        return { categoria, producto };
    }


    //================================================
    // CERRAR RESULTADO Y REINICIAR ESTADOS
    //================================================

    resultadoDestino.addEventListener("click",()=>{
        // Cancelamos los loops de animación y timers activos por si se cierra antes de tiempo
        if (timerFinalizacion) {
            clearTimeout(timerFinalizacion);
            timerFinalizacion = null;
        }
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        
        // Limpiamos los estados de las clases y apagamos los brillos residuales de los gajos
        ruleta.classList.remove("girando");
        gajos.forEach(g => g.classList.remove("iluminado"));
        
        // Reseteamos de forma inmediata la aguja a su posición norte
        flechaAguja.style.transition = "none";
        flechaAguja.style.transform = "rotate(0deg)";
        
        resultadoDestino.classList.remove("visible");
    });

});
