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

    // Elegimos el producto ANTES de girar
    const resultado = obtenerProducto();

    ruleta.classList.add("girando");

    const categoriasOrden = [
        "entrantes",
        "raciones",
        "ibericos",
        "quesos",
        "piadinas",
        "dulces",
        "bocadillos",
        "postres"
    ];

    const indice = categoriasOrden.indexOf(resultado.categoria.id);

    // Cada icono ocupa 45º
    const gradosIcono = indice * 45;

    // 6 vueltas completas + posición final
    const gradosFinal = (360 * 6) - gradosIcono;

    disco.style.transform = `rotate(${gradosFinal}deg)`;

    disco.style.transition =
        "transform 4s cubic-bezier(.15,.85,.15,1)";

    disco.addEventListener("transitionend",()=>{

        finalizarRuleta(resultado);

    },{once:true});

}



    //================================================
    // FINALIZAR RULETA
    //================================================

    function finalizarRuleta(resultado){

    ruleta.classList.remove("girando");

    if(navigator.vibrate){

        navigator.vibrate([100,50,100]);

    }

    nombreDestino.textContent =
        resultado.producto.nombre;

    descripcionDestino.textContent =
        resultado.producto.descripcion || "";

    precioDestino.textContent =
        resultado.producto.precio;

    categoriaDestino.textContent =
        resultado.categoria.icono +
        " " +
        resultado.categoria.titulo;

}



    //================================================
    // ELEGIR PRODUCTO
    //================================================

    function obtenerProducto(){

    const personas =
        document.querySelector(".seleccionado").dataset.comensales;

    let categorias;

    if(personas==="1"){

        categorias=carta.filter(c=>

            [
                "tostas",
                "piadinas",
                "dulces",
                "bocadillos",
                "postres"

            ].includes(c.id)

        );

    }else{

        categorias=carta;

    }

    const categoria =
        categorias[Math.floor(Math.random()*categorias.length)];

    const producto =
        categoria.productos[
            Math.floor(Math.random()*categoria.productos.length)
        ];

    return {

        categoria,
        producto

    };

}



    //================================================
    // CERRAR RESULTADO
    //================================================

    resultadoDestino.addEventListener("click",()=>{

        resultadoDestino.classList.remove("visible");

    });

});
