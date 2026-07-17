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

        ruleta.classList.add("girando");

        disco.style.animation="girarRuleta 2.8s cubic-bezier(.18,.82,.18,1) forwards";

        disco.addEventListener("animationend", finalizarRuleta,{once:true});

    }



    //================================================
    // FINALIZAR RULETA
    //================================================

    function finalizarRuleta(){

        ruleta.classList.remove("girando");

        disco.style.animation="";

        if(navigator.vibrate){

            navigator.vibrate([80,40,80]);

        }

        mostrarProducto();

    }



    //================================================
    // ELEGIR PRODUCTO
    //================================================

    function mostrarProducto(){

        const personas=document.querySelector(".seleccionado").dataset.comensales;

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

        const categoria=categorias[
            Math.floor(Math.random()*categorias.length)
        ];

        const producto=categoria.productos[
            Math.floor(Math.random()*categoria.productos.length)
        ];

        nombreDestino.textContent=producto.nombre;

        descripcionDestino.textContent=producto.descripcion || "";

        precioDestino.textContent=producto.precio;

        categoriaDestino.textContent=
            categoria.icono+" "+categoria.titulo;

    }



    //================================================
    // CERRAR RESULTADO
    //================================================

    resultadoDestino.addEventListener("click",()=>{

        resultadoDestino.classList.remove("visible");

    });

});
