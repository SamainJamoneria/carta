const carta = [
{
    id:"tostas",
    titulo:"Premium Toasts",
    icono:"🥖",
    productos:[
        {
            nombre:"Burrata with Iberian Ham Powder",
            descripcion:"Tomato, burrata, EVOO, pesto and Iberian ham powder",
            precio:"12,50 €",
            alergenos: ["g", "l", "f"]
        },
        {
            nombre:"Pork Cracklings with Local Cheese",
            descripcion:"",
            precio:"11,00 €",
            alergenos: ["g", "l"]
        },
        {
            nombre:"Cecina with Gorgonzola",
            descripcion:"Tomato, cecina, Gorgonzola cheese and grated Parmigiano",
            precio:"12,00 €",
            alergenos: ["g", "l"]
        },
        {
            nombre:"Ham with Parmigiano & Isbilya Olive Oil",
            descripcion:"Tomato, cured ham and grated Parmigiano",
            precio:"10,00 €",
            alergenos: ["g", "l"]
        },
        {
            nombre:"Anchovies with Local Cheese",
            descripcion:"",
            precio:"12,00 €",
            alergenos: ["g", "l", "p"]
        },
        {
            nombre:"Vegetarian",
            descripcion:"Cream cheese, guacamole, tomato jam, cherry tomatoes and poppy seeds",
            precio:"11,00 €",
            alergenos: ["g", "l"]
        }
    ]
},
{
    id:"tablas",
    titulo:"Sharing Boards",
    icono:"🍽️",
    productos:[
        {
            nombre:"Samaín Board",
            descripcion:"Iberian chorizo, Iberian salchichón, Granada cured ham, Iberian pork loin and three cheeses of your choice",
            precio:"23,00 €",
            alergenos: ["l"]
        },
        {
            nombre:"Iberian Board",
            descripcion:"100% Iberian ham, Iberian pork loin, Iberian chorizo, Iberian salchichón and cecina",
            precio:"25,00 €",
            alergenos: []
        },
        {
            nombre:"Cheese Board",
            descripcion:"Five different cheeses served with their ideal pairings",
            precio:"23,50 €",
            alergenos: ["l", "f"]
        }
    ]
},
{
    id:"raciones",
    titulo:"Sharing Plates",
    icono:"🍖",
    productos:[
        { nombre:"Iberian Pork Loin", descripcion:"Half / Whole", precio:"8,00 € / 15,00 €", alergenos: [] },
        { nombre:"Iberian Salchichón", descripcion:"Half / Whole", precio:"7,00 € / 14,00 €", alergenos: [] },
        { nombre:"Iberian Chorizo", descripcion:"Half / Whole", precio:"7,00 € / 14,00 €", alergenos: [] },
        { nombre:"100% Duroc Ham", descripcion:"Half / Whole", precio:"8,00 € / 15,00 €", alergenos: [] },
        { nombre:"Granada Cured Ham", descripcion:"Half / Whole", precio:"7,00 € / 14,00 €", alergenos: [] },
        { nombre:"Cecina (Dry-cured Beef)", descripcion:"Half / Whole", precio:"9,00 € / 16,00 €", alergenos: [] },
        { nombre:"Pork Cracklings with Local Cheese", descripcion:"Half / Whole", precio:"6,50 € / 13,00 €", alergenos: ["l"] },
        {
            nombre:"Tuna Belly Salad",
            descripcion:"With Pedro Ximénez reduction",
            precio:"14,00 €",
            alergenos: ["p", "v"]
        },
        {
            nombre:"Cherry Tomato Salad",
            descripcion:"Cherry tomatoes with homemade pesto and Parmigiano",
            precio:"8,00 €",
            alergenos: ["l", "f"]
        },
        {
            nombre:"Piquillo Pepper Salad",
            descripcion:"Piquillo peppers with anchovies and local cheese",
            precio:"14,50 €",
            alergenos: ["l", "p"]
        },
        { nombre:"Marinated Anchovies", descripcion:"", precio:"10,00 €", alergenos: ["p"] },
        { nombre:"Gildas", descripcion:"Price per unit", precio:"2,70 €", alergenos: ["p", "v"] }
    ]
},
{
    id:"quesos",
    titulo:"Cheese Selection",
    icono:"🧀",
    productos:[
        { nombre:"Stilton", descripcion:"Half / Whole", precio:"6,00 € / 12,00 €", alergenos: ["l"] },
        { nombre:"Truffle Gouda", descripcion:"Half / Whole", precio:"7,00 € / 12,50 €", alergenos: ["l"] },
        { nombre:"Gorgonzola", descripcion:"Half / Whole", precio:"6,00 € / 10,00 €", alergenos: ["l"] },
        { nombre:"Appenzeller", descripcion:"Half / Whole", precio:"6,00 € / 12,00 €", alergenos: ["l"] },
        { nombre:"Comté", descripcion:"Half / Whole", precio:"6,00 € / 12,00 €", alergenos: ["l"] },
        { nombre:"Parmigiano Reggiano", descripcion:"Half / Whole", precio:"5,50 € / 10,00 €", alergenos: ["l"] },
        { nombre:"Goat Cheese Roll", descripcion:"", precio:"5,00 €", alergenos: ["l"] },
        { nombre:"Pría Blue Cheese", descripcion:"Half / Whole", precio:"7,00 € / 13,00 €", alergenos: ["l"] },
        { nombre:"Paulus", descripcion:"Half / Whole", precio:"6,50 € / 12,50 €", alergenos: ["l"] }
    ]
},
{
    id:"piadinas",
    titulo:"Piadinas",
    icono:"🌯",
    productos:[
        { nombre:"Tuna", descripcion:"Tomato, cheese and tuna", precio:"8,00 €", alergenos: ["g", "l", "p"] },
        { nombre:"Iberian", descripcion:"Tomato, cheese and hand-carved Iberian ham", precio:"12,50 €", alergenos: ["g", "l"] },
        { nombre:"Serrana", descripcion:"Tomato, cheese and Granada cured ham", precio:"9,50 €", alergenos: ["g", "l"] },
        { nombre:"Smoked Salmon", descripcion:"Smoked salmon and local cheese", precio:"12,50 €", alergenos: ["g", "l", "p"] },
        { nombre:"Samaín", descripcion:"Cecina, tomato, local cheese, Gorgonzola and Parmigiano", precio:"12,00 €", alergenos: ["g", "l"] },
        { nombre:"Bacon", descripcion:"Cheese, tomato and bacon", precio:"10,00 €", alergenos: ["g", "l"] },
        { nombre:"Anchovies", descripcion:"Tomato, cheese, olive oil and anchovies", precio:"10,00 €", alergenos: ["g", "l", "p"] },
        { nombre:"Turkey Breast", descripcion:"Cheese, tomato and turkey breast", precio:"7,50 €", alergenos: ["g", "l"] },
        { nombre:"Mortadella", descripcion:"Local cheese, fresh tomato, homemade pesto and mortadella", precio:"12,00 €", alergenos: ["g", "l", "f"] },
        { nombre:"Pork Cracklings", descripcion:"Cheese, pork cracklings and BBQ sauce", precio:"12,00 €", alergenos: ["g", "l"] },
        { nombre:"Stracciatella", descripcion:"Fresh tomato with EVOO, Pedro Ximénez reduction, stracciatella and Iberian ham powder", precio:"12,00 €", alergenos: ["g", "l", "v"] }
    ]
},
{
    id:"dulces",
    titulo:"Sweet Piadinas",
    icono:"🍫",
    productos:[
        { nombre:"Quince", descripcion:"Two cheeses with thin slices of quince", precio:"8,00 €", alergenos: ["g", "l"] },
        { nombre:"Nutella", descripcion:"", precio:"6,00 €", alergenos: ["g", "l", "f"] },
        { nombre:"Extra Ingredient", descripcion:"", precio:"0,50 €", alergenos: [] }
    ]
},
{
    id:"bocadillos",
    titulo:"Sandwiches",
    icono:"🥪",
    productos:[
        { nombre:"100% Acorn-fed Iberian Ham", descripcion:"", precio:"12,00 €", alergenos: ["g"] },
        { nombre:"Granada Cured Ham", descripcion:"", precio:"6,50 €", alergenos: ["g"] },
        { nombre:"Iberian Salchichón", descripcion:"", precio:"5,00 €", alergenos: ["g"] },
        { nombre:"Iberian Chorizo", descripcion:"", precio:"5,00 €", alergenos: ["g"] },
        { nombre:"Iberian Pork Loin", descripcion:"", precio:"6,50 €", alergenos: ["g"] },
        { nombre:"Cheese", descripcion:"", precio:"4,00 €", alergenos: ["g", "l"] },
        { nombre:"Mortadella", descripcion:"", precio:"4,50 €", alergenos: ["g"] },
        { nombre:"Bacon", descripcion:"", precio:"5,00 €", alergenos: ["g"] },
        { nombre:"Extra Ingredient", descripcion:"", precio:"0,50 €", alergenos: [] }
    ]
},
{
    id:"postres",
    titulo:"Desserts",
    icono:"🍰",
    productos:[
        { nombre:"Cheese with Quince", descripcion:"", precio:"5,00 €", alergenos: ["l"] },
        { nombre:"Ice Cream", description:"Please, ask about our available flavors", precio:"Please ask", alergenos: ["l"] }
    ]
}
];
