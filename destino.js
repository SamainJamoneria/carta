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
    // INICIAR RULETA (CORREGIDA PARA IDIOMAS)
    //================================================

    function iniciarRuleta(){
        const resultado = obtenerProducto();
        
        if (!resultado) {
            alert("Error al cargar la carta. Por favor, inténtelo de nuevo.");
            return;
        }

        resultadoDestino.classList.add("visible");
        ruleta.classList.add("girando");

        // Lista exacta de IDs que espera el orden físico de tus 8 quesitos en el CSS
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

        // MAPEO DE IDS: Si el ID viene en inglés/formato alternativo, lo adaptamos al gajo físico correcto
        let categoriaId = resultado.categoria.id;
        if (categoriaId === "tablas")  categoriaId = "raciones";  // 'tablas' va al quesito de raciones (🍽️)
        if (categoriaId === "postres") categoriaId = "dulces";    // 'postres' va al quesito de dulces (🍰)

        const indice = categoriesOrden.indexOf(categoriaId);
        
        // Si por alguna razón el ID sigue sin cuadrar, por seguridad le asignamos el gajo 0
        const indiceSeguro = indice !== -1 ? indice : 0;

        const gradosPorCategoria = 360 / 8; // 45º exactos por porción
        const gradosIcono = (indiceSeguro * gradosPorCategoria) + 22.5;

        // 5 vueltas completas de inercia hacia adelante más la posición de la categoría
        const gradosFinal = (360 * 5) + gradosIcono;

        // Limpieza de transiciones previas
        flechaAguja.style.transition = "none";
        flechaAguja.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        
        // Forzamos un reflow
        flechaAguja.getBoundingClientRect();

        // Ejecución con aceleración gráfica nativa
        requestAnimationFrame(() => {
            flechaAguja.style.transition = "transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)";
            flechaAguja.style.transform = `translate3d(0, 0, 0) rotate(${gradosFinal}deg)`;
        });

        // Iniciamos el rastreador en tiempo real para iluminar los quesitos al paso de la aguja
        rastrearPasoDeAguja(gradosFinal);

        // Esperamos los 3.5 segundos exactos de la transición
        timerFinalizacion = setTimeout(() => {
            cancelAnimationFrame(frameId);
            
            // Forzamos que al terminar se encienda únicamente el gajo ganador definitivo
            gajos.forEach((gajo, i) => {
                if (i === indiceSeguro) {
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

  //================================================
    // ELEGIR PRODUCTO (SOPORTE MULTI-IDIOMA Y FILTRADO)
    //================================================

    function obtenerProducto(){
        const personas = document.querySelector(".seleccionado").dataset.comensales;
        let categorias;

        // DETECCIÓN AUTOMÁTICA DE IDIOMA:
        // Si 'carta' no existe, busca las variables alternativas de menu-en.js
        let datosCarta = typeof carta !== "undefined" ? carta : 
                         (typeof cartaEn !== "undefined" ? cartaEn : 
                         (typeof menuEn !== "undefined" ? menuEn : null));

        // Si no se encuentra ninguna, lanzamos un aviso controlado en la consola
        if (!datosCarta) {
            console.error("Error: No se ha encontrado el array de datos de la carta en menu.js ni menu-en.js");
            return null;
        }

        if(personas==="1"){
            // Filtramos por las categorías individuales (funciona igual en inglés por ID)
            categorias = datosCarta.filter(c => [ "tostas", "piadinas", "dulces", "bocadillos" ].includes(c.id));
        }else{
            categorias = datosCarta;
        }

        // 1. Elegimos una categoría al azar
        const categoria = categorias[Math.floor(Math.random()*categorias.length)];
        
        // 2. Filtramos la lista de productos para eliminar "Ingrediente extra" o "Extra ingredient"
        const productosValidos = categoria.productos.filter(p => {
            const nombreMinuscula = p.nombre.toLowerCase();
            return !nombreMinuscula.includes("extra") && 
                   !nombreMinuscula.includes("ingrediente") && 
                   !nombreMinuscula.includes("ingredient");
        });

        // 3. Si por seguridad quedara vacía, usamos la lista original de la categoría
        const listaFinalProductos = productosValidos.length > 0 ? productosValidos : categoria.productos;

        // 4. Seleccionamos el producto final
        const producto = listaFinalProductos[Math.floor(Math.random()*listaFinalProductos.length)];

        return { categoria, producto };
    }

    //================================================
    // CERRAR RESULTADO Y REINICIAR ESTADOS
    //================================================

    //================================================
    // CERRAR RESULTADO Y REINICIAR ESTADOS DESDE CERO
    //================================================

    resultadoDestino.addEventListener("click",()=>{
        // 1. Cancelamos los loops de animación y timers activos por si se cierra antes de tiempo
        if (timerFinalizacion) {
            clearTimeout(timerFinalizacion);
            timerFinalizacion = null;
        }
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        
        // 2. Limpiamos las clases de animación y apagamos los brillos de los gajos
        ruleta.classList.remove("girando", "finalizada");
        gajos.forEach(g => g.classList.remove("iluminado"));
        
        // 3. Reseteamos de forma inmediata la aguja a su posición norte nativa (0 grados)
        flechaAguja.style.transition = "none";
        flechaAguja.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        
        // 4. VACIAR TEXTOS: Evita que al reabrir la ruleta se vea el plato que tocó antes
        nombreDestino.textContent = "";
        descripcionDestino.textContent = "";
        precioDestino.textContent = "";
        categoriaDestino.textContent = "";
        
        // 5. Ocultamos la pantalla de resultados
        resultadoDestino.classList.remove("visible");
    });
