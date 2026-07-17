// =========================================
// DESTINO SAMAÍN
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const botonDestino = document.getElementById("btn-destino");
    const modalDestino = document.getElementById("modal-destino");
    const cerrarDestino = document.getElementById("cerrar-destino");

    // Abrir ventana
    botonDestino.addEventListener("click", () => {

        modalDestino.classList.add("visible");

    });

    // Botón cerrar
    cerrarDestino.addEventListener("click", () => {

        modalDestino.classList.remove("visible");

    });

    // Cerrar pulsando fuera de la ventana
    modalDestino.addEventListener("click", (e) => {

        if(e.target === modalDestino){

            modalDestino.classList.remove("visible");

        }

    });


/*==================================================
DESTINO SAMAÍN
==================================================*/

const btnDestino = document.getElementById("btn-destino");
const modalDestino = document.getElementById("modal-destino");
const cerrarDestino = document.getElementById("cerrar-destino");

btnDestino.addEventListener("click", () => {

    modalDestino.classList.add("abierto");

});

cerrarDestino.addEventListener("click", () => {

    modalDestino.classList.remove("abierto");

});

modalDestino.addEventListener("click", (e) => {

    if(e.target === modalDestino){

        modalDestino.classList.remove("abierto");

    }

});
       

const iconosRuleta = [
    "🥖",
    "🍽️",
    "🍖",
    "🧀",
    "🌯",
    "🍫",
    "🥪",
    "🍰"
];

const resultadoDestino = document.getElementById("resultado-destino");
const iconoDestino = document.getElementById("icono-destino");

document.querySelectorAll(".opcion-comensales").forEach(boton=>{

    boton.addEventListener("click",()=>{

        document.querySelectorAll(".opcion-comensales").forEach(b=>{

    b.classList.remove("seleccionado");

    });

        boton.classList.add("seleccionado");

        modalDestino.classList.remove("abierto");

        resultadoDestino.classList.add("visible");

                // aquí empieza la ruleta...


       let indice = 0;

let velocidad = 60;

let vueltas = 0;

function girarRuleta(){

    iconoDestino.textContent = iconosRuleta[indice];

    indice++;

    if(indice >= iconosRuleta.length){

        indice = 0;

        vueltas++;

    }

    if(vueltas < 3){

        setTimeout(girarRuleta, velocidad);

        return;

    }

    velocidad += 18;

    if(velocidad < 260){

        setTimeout(girarRuleta, velocidad);

    }else{

        finalizarDestino();

    }

}

girarRuleta();

    });

});

resultadoDestino.addEventListener("click",()=>{

    resultadoDestino.classList.remove("visible");

});

function finalizarDestino(){

    if(navigator.vibrate){

        navigator.vibrate([80,40,80]);

    }

    let categoriasPermitidas=[];

    const personas=document.querySelector(".opcion-comensales.seleccionado")?.dataset.comensales;

    if(personas==="1"){

        categoriasPermitidas=[
            "tostas",
            "piadinas",
            "dulces",
            "bocadillos",
            "postres"
        ];

    }else{

        categoriasPermitidas=carta.map(c=>c.id);

    }

    const categorias=carta.filter(c=>
        categoriasPermitidas.includes(c.id)
    );

    const categoria=categorias[
        Math.floor(Math.random()*categorias.length)
    ];

    const producto=categoria.productos[
        Math.floor(Math.random()*categoria.productos.length)
    ];

    iconoDestino.textContent=categoria.icono;

    document.getElementById("nombre-destino").textContent=
        producto.nombre;

    document.getElementById("descripcion-destino").textContent=
        producto.descripcion;

    document.getElementById("precio-destino").textContent=
        producto.precio;

}
    
});

