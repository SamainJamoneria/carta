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
    const disco = document.getElementById("disco-ruleta");

    const nombreDestino = document.getElementById("nombre-destino");
    const descripcionDestino = document.getElementById("descripcion-destino");
    const precioDestino = document.getElementById("precio-destino");
    const categoriaDestino = document.getElementById("categoria-destino");

    // NUEVA VARIABLE GLOBAL PARA CONTROLAR Y CANCELAR EL TEMPORIZADOR
    let timerFinalizacion = null;


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

        const categoriesOrden = [
            "entrantes",
            "raciones",
            "ibericos",
            "quesos",
            "piadinas",
            "dulces",
            "bocadillos"
        ];

        const indice = categoriesOrden.indexOf(resultado.categoria.id);
        const gradosPorCategoria = 360 / categoriesOrden.length;
        const gradosIcono = indice * gradosPorCategoria;

        // Reducimos las vueltas de 6 a 3 para que tarde menos tiempo
        const gradosFinal = (360 * 3) - gradosIcono;

        // PUNTO 1: Cambiamos a 2.5s y usamos un cubic-bezier con un frenado (ease-out) muy elegante y fluido
        disco.style.transition = "transform 2.5s cubic-bezier(0.25, 1, 0.3, 1)";
        disco.style.transform = `rotate(${gradosFinal}deg)`;

        // Guardamos el timeout en la referencia global para poder cancelarlo si cierran la pantalla
        timerFinalizacion = setTimeout(() => {
            finalizarRuleta(resultado);
        }, 2500); // Mismo tiempo que la transición CSS
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

        // Si la pantalla sigue abierta, ejecutamos los efectos visuales y hápticos
        if(navigator.vibrate){
            navigator.vibrate([100,50,100]);
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
    // CERRAR RESULTADO (PUNTO 2: AQUÍ LIMPIAMOS EL TIMER)
    //================================================

    resultadoDestino.addEventListener("click",()=>{
        // Limpiamos el temporizador para abortar confeti/vibración si el usuario decide hacer clic y cerrar antes de los 2.5s
        if (timerFinalizacion) {
            clearTimeout(timerFinalizacion);
            timerFinalizacion = null;
        }
        
        // Limpiamos el estado visual de la ruleta para reiniciar su comportamiento
        ruleta.classList.remove("girando");
        disco.style.transition = "none";
        disco.style.transform = "rotate(0deg)";
        
        resultadoDestino.classList.remove("visible");
    });

});
