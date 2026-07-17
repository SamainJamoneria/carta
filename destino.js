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

});
