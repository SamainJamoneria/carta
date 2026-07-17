// =========================================
// DESTINO SAMAÍN
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Elementos
    // ==========================

    const btnDestino = document.getElementById("btn-destino");
    const modalDestino = document.getElementById("modal-destino");
    const cerrarDestino = document.getElementById("cerrar-destino");

    const resultadoDestino = document.getElementById("resultado-destino");

    const iconoDestino = document.getElementById("icono-destino");
    const nombreDestino = document.getElementById("nombre-destino");
    const descripcionDestino = document.getElementById("descripcion-destino");
    const precioDestino = document.getElementById("precio-destino");
    const categoriaDestino = document.getElementById("categoria-destino");

    // ==========================
    // Iconos de la ruleta
    // ==========================

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

    // ==========================
    // Abrir modal
    // ==========================

    btnDestino.addEventListener("click", () => {

        modalDestino.classList.add("visible");

    });

    // ==========================
    // Cerrar modal
    // ==========================

    cerrarDestino.addEventListener("click", () => {

        modalDestino.classList.remove("visible");

    });

    modalDestino.addEventListener("click", (e) => {

        if (e.target === modalDestino) {

            modalDestino.classList.remove("visible");

        }

    });

    // ==========================
    // Selección de comensales
    // ==========================

    document.querySelectorAll(".opcion-comensales").forEach(boton => {

        boton.addEventListener("click", () => {

            document
                .querySelectorAll(".opcion-comensales")
                .forEach(b => b.classList.remove("seleccionado"));

            boton.classList.add("seleccionado");

            modalDestino.classList.remove("visible");

            iniciarRuleta();

        });

    });

    // ==========================
    // Ruleta
    // ==========================

    function iniciarRuleta() {

        resultadoDestino.classList.add("visible");

        let indice = 0;
        let velocidad = 60;
        let vueltas = 0;

        function girar() {

            iconoDestino.textContent = iconosRuleta[indice];

            indice++;

            if (indice >= iconosRuleta.length) {

                indice = 0;
                vueltas++;

            }

            if (vueltas < 3) {

                setTimeout(girar, velocidad);
                return;

            }

            velocidad += 18;

            if (velocidad < 260) {

                setTimeout(girar, velocidad);

            } else {

                mostrarResultado();

            }

        }

        girar();

    }

    // ==========================
    // Resultado
    // ==========================

    function mostrarResultado() {

        if (navigator.vibrate) {

            navigator.vibrate([80, 40, 80]);

        }

        const personas = document.querySelector(".opcion-comensales.seleccionado").dataset.comensales;

        let categoriasValidas;

        if (personas === "1") {

            categoriasValidas = carta.filter(c =>
                ["tostas", "piadinas", "dulces", "bocadillos", "postres"].includes(c.id)
            );

        } else {

            categoriasValidas = carta;

        }

        const categoria = categoriasValidas[
            Math.floor(Math.random() * categoriasValidas.length)
        ];

        const producto = categoria.productos[
            Math.floor(Math.random() * categoria.productos.length)
        ];

        iconoDestino.textContent = categoria.icono;

        nombreDestino.textContent = producto.nombre;

        descripcionDestino.textContent = producto.descripcion;

        precioDestino.textContent = producto.precio;

        categoriaDestino.textContent =
        categoria.icono + " " + categoria.titulo;

    }

    // ==========================
    // Cerrar resultado
    // ==========================

    resultadoDestino.addEventListener("click", () => {

        resultadoDestino.classList.remove("visible");

    });

});
