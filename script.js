const carta = {

    tostas: [

        {
            nombre: "Burrata con polvo de jamón ibérico",
            descripcion: "Burrata cremosa acompañada de polvo de jamón ibérico.",
            precio: "12,50 €"
        },

        {
            nombre: "Tosta de Cecina",
            descripcion: "",
            precio: "12,00 €"
        }

    ],

    tablas: [

        {
            nombre: "Tabla Ibérica",
            descripcion: "",
            precio: "18,00 €"
        },

        {
            nombre: "Tabla de Quesos",
            descripcion: "",
            precio: "16,00 €"
        }

    ]

    function crearProducto(producto){

    return `

    <div class="producto">

        <div class="nombre">${producto.nombre}</div>

        <div class="descripcion">${producto.descripcion}</div>

        <div class="precio">${producto.precio}</div>

    </div>

    `;

}

function cargarCategoria(id,categoria){

    const contenedor=document.getElementById(id);

    categoria.forEach(producto=>{

        contenedor.innerHTML+=crearProducto(producto);

    });

}

document.addEventListener("DOMContentLoaded",()=>{

    cargarCategoria("lista-tostas",carta.tostas);

    cargarCategoria("lista-tablas",carta.tablas);

});

};
