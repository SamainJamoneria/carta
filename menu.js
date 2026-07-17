const carta = [
{
    id:"tostas",
    titulo:"Tostas Premium",
    icono:"🥖",
    productos:[
        {
            nombre:"Burrata con Polvo de Jamón Ibérico",
            descripcion:"Tomate, burrata, AOVE, pesto y polvo de jamón ibérico",
            precio:"12,50 €",
            alergenos: ["g", "l", "f"]
        },
        {
            nombre:"Chicharrones con Queso del País",
            descripcion:"",
            precio:"11,00 €",
            alergenos: ["g", "l"]
        },
        {
            nombre:"Cecina con Gorgonzola",
            descripcion:"Tomate, cecina, queso Gorgonzola y Parmigiano rallado",
            precio:"12,00 €",
            alergenos: ["g", "l"]
        },
        {
            nombre:"Jamón con Parmigiano y Aceite Isbilya",
            descripcion:"Tomate, jamón curado y Parmigiano rallado",
            precio:"10,00 €",
            alergenos: ["g", "l"]
        },
        {
            nombre:"Anchoas con Queso del País",
            descripcion:"",
            precio:"12,00 €",
            alergenos: ["g", "l", "p"]
        },
        {
            nombre:"Vegetariana",
            descripcion:"Queso crema, guacamole, mermelada de tomate, tomates cherry y semillas de amapola",
            precio:"11,00 €",
            alergenos: ["g", "l"]
        }
    ]
},
{
    id:"tablas",
    titulo:"Tablas para Compartir",
    icono:"🍽️",
    productos:[
        {
            nombre:"Tabla Samaín",
            descripcion:"Chorizo ibérico, salchichón ibérico, jamón curado de Granada, lomo ibérico y tres quesos a elegir",
            precio:"23,00 €",
            alergenos: ["l"]
        },
        {
            nombre:"Tabla Ibérica",
            descripcion:"Jamón 100% ibérico, lomo ibérico, chorizo ibérico, salchichón ibérico y cecina",
            precio:"25,00 €",
            alergenos: []
        },
        {
            nombre:"Tabla de Quesos",
            descripcion:"Cinco quesos diferentes servidos con sus maridajes ideales",
            precio:"23,50 €",
            alergenos: ["l", "f"]
        }
    ]
},
{
    id:"raciones",
    titulo:"Raciones",
    icono:"🍖",
    productos:[
        { nombre:"Lomo Ibérico", descripcion:"Media / Entera", precio:"8,00 € / 15,00 €", alergenos: [] },
        { nombre:"Salchichón Ibérico", descripcion:"Media / Entera", precio:"7,00 € / 14,00 €", alergenos: [] },
        { nombre:"Chorizo Ibérico", descripcion:"Media / Entera", precio:"7,00 € / 14,00 €", alergenos: [] },
        { nombre:"Jamón 100% Duroc", descripcion:"Media / Entera", precio:"8,00 € / 15,00 €", alergenos: [] },
        { nombre:"Jamón Curado de Granada", descripcion:"Media / Entera", precio:"7,00 € / 14,00 €", alergenos: [] },
        { nombre:"Cecina (Curada de Vacuno)", descripcion:"Media / Entera", precio:"9,00 € / 16,00 €", alergenos: [] },
        { nombre:"Chicharrones con Queso del País", descripcion:"Media / Entera", precio:"6,50 € / 13,00 €", alergenos: ["l"] },
        {
            nombre:"Ensalada de Ventresca de Atún",
            descripcion:"Con reducción de Pedro Ximénez",
            precio:"14,00 €",
            alergenos: ["p", "v"]
        },
        {
            nombre:"Ensalada de Tomates Cherry",
            descripcion:"Tomates cherry con pesto casero y Parmigiano",
            precio:"8,00 €",
            alergenos: ["l", "f"]
        },
        {
            nombre:"Ensalada de Pimientos del Piquillo",
            descripcion:"Pimientos del piquillo con anchoas y queso del país",
            precio:"14,50 €",
            alergenos: ["l", "p"]
        },
        { nombre:"Anchoas Marinadas", descripcion:"", precio:"10,00 €", alergenos: ["p"] },
        { nombre:"Gildas", descripcion:"Precio por unidad", precio:"2,70 €", alergenos: ["p", "v"] }
    ]
},
{
    id:"quesos",
    titulo:"Selección de Quesos",
    icono:"🧀",
    productos:[
        { nombre:"Stilton", descripcion:"Media / Entera", precio:"6,00 € / 12,00 €", alergenos: ["l"] },
        { nombre:"Gouda con Trufa", descripcion:"Media / Entera", precio:"7,00 € / 12,50 €", alergenos: ["l"] },
        { nombre:"Gorgonzola", descripcion:"Media / Entera", precio:"6,00 € / 10,00 €", alergenos: ["l"] },
        { nombre:"Appenzeller", descripcion:"Media / Entera", precio:"6,00 € / 12,00 €", alergenos: ["l"] },
        { nombre:"Comté", descripcion:"Media / Entera", precio:"6,00 € / 12,00 €", alergenos: ["l"] },
        { nombre:"Parmigiano Reggiano", descripcion:"Media / Entera", precio:"5,50 € / 10,00 €", alergenos: ["l"] },
        { nombre:"Rulo de Cabra", descripcion:"", precio:"5,00 €", alergenos: ["l"] },
        { nombre:"Queso Azul de Pría", descripcion:"Media / Entera", precio:"7,00 € / 13,00 €", alergenos: ["l"] },
        { nombre:"Paulus", descripcion:"Media / Entera", precio:"6,50 € / 12,50 €", alergenos: ["l"] }
    ]
},
{
    id:"piadinas",
    titulo:"Piadinas",
    icono:"🌯",
    productos:[
        { nombre:"Atún", descripcion:"Tomate, queso y atún", precio:"8,00 €", alergenos: ["g", "l", "p"] },
        { nombre:"Ibérica", descripcion:"Tomate, queso y jamón ibérico al corte", precio:"12,50 €", alergenos: ["g", "l"] },
        { nombre:"Serrana", descripcion:"Tomate, queso y jamón curado de Granada", precio:"9,50 €", alergenos: ["g", "l"] },
        { nombre:"Salmón Ahumado", descripcion:"Salmón ahumado y queso del país", precio:"12,50 €", alergenos: ["g", "l", "p"] },
        { nombre:"Samaín", descripcion:"Cecina, tomate, queso del país, Gorgonzola y Parmigiano", precio:"12,00 €", alergenos: ["g", "l"] },
        { nombre:"Bacon", descripcion:"Queso, tomate y bacon", precio:"10,00 €", alergenos: ["g", "l"] },
        { nombre:"Anchoas", descripcion:"Tomate, queso, aceite de oliva y anchoas", precio:"10,00 €", alergenos: ["g", "l", "p"] },
        { nombre:"Pechuga de Pavo", descripcion:"Queso, tomate y pechuga de pavo", precio:"7,50 €", alergenos: ["g", "l"] },
        { nombre:"Mortadela", descripcion:"Queso del país, tomate fresco, pesto casero y mortadela", precio:"12,00 €", alergenos: ["g", "l", "f"] },
        { nombre:"Chicharrones", descripcion:"Queso, chicharrones y salsa barbacoa", precio:"12,00 €", alergenos: ["g", "l"] },
        { nombre:"Stracciatella", descripcion:"Tomate fresco con AOVE, reducción de Pedro Ximénez, stracciatella y polvo de jamón ibérico", precio:"12,00 €", alergenos: ["g", "l", "v"] }
    ]
},
{
    id:"dulces",
    titulo:"Piadinas Dulces",
    icono:"🍫",
    productos:[
        { nombre:"Membrillo", descripcion:"Dos quesos con finas láminas de membrillo", precio:"8,00 €", alergenos: ["g", "l"] },
        { nombre:"Nutella", descripcion:"", precio:"6,00 €", alergenos: ["g", "l", "f"] },
        { nombre:"Ingrediente Extra", descripcion:"", precio:"0,50 €", alergenos: [] }
    ]
},
{
    id:"bocadillos",
    titulo:"Bocadillos",
    icono:"🥪",
    productos:[
        { nombre:"Jamón Ibérico 100% de Bellota", descripcion:"", precio:"12,00 €", alergenos: ["g"] },
        { nombre:"Jamón Curado de Granada", descripcion:"", precio:"6,50 €", alergenos: ["g"] },
        { nombre:"Salchichón Ibérico", descripcion:"", precio:"5,00 €", alergenos: ["g"] },
        { nombre:"Chorizo Ibérico", descripcion:"", precio:"5,00 €", alergenos: ["g"] },
        { nombre:"Lomo Ibérico", descripcion:"", precio:"6,50 €", alergenos: ["g"] },
        { nombre:"Queso", descripcion:"", precio:"4,00 €", alergenos: ["g", "l"] },
        { nombre:"Mortadela", descripcion:"", precio:"4,50 €", alergenos: ["g"] },
        { nombre:"Bacon", descripcion:"", precio:"5,00 €", alergenos: ["g"] },
        { nombre:"Ingrediente Extra", descripcion:"", precio:"0,50 €", alergenos: [] }
    ]
},
{
    id:"postres",
    titulo:"Postres",
    icono:"🍰",
    productos:[
        { nombre:"Queso con Membrillo", descripcion:"", precio:"5,00 €", alergenos: ["l"] },
        { nombre:"Helados", descripcion:"Por favor, pregunte por nuestros sabores disponibles", precio:"Consultar", alergenos: ["l"] }
    ]
}
];
