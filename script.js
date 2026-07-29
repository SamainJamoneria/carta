/* ======================================================
   SAMAÍN LA CORMELANA - LÓGICA PRINCIPAL JAVASCRIPT
====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. MENÚ HAMBURGUESA Y MODALES PRINCIPALES
    // ======================================================
    const btnHamburguesa = document.getElementById('btn-hamburguesa');
    const modalMenu = document.getElementById('modal-menu');
    const btnCerrarMenu = document.getElementById('btn-cerrar-menu');

    if (btnHamburguesa && modalMenu) {
        btnHamburguesa.addEventListener('click', (e) => {
            e.stopPropagation();
            modalMenu.classList.remove('hidden');
            modalMenu.classList.add('visible');
        });
    }

    if (btnCerrarMenu && modalMenu) {
        btnCerrarMenu.addEventListener('click', () => {
            modalMenu.classList.remove('visible');
            modalMenu.classList.add('hidden');
        });
    }

    // Modal Contacto
    const btnContacto = document.getElementById('btn-contacto');
    const modalContacto = document.getElementById('modal-contacto');
    const btnCerrarContacto = document.getElementById('btn-cerrar-contacto');

    if (btnContacto && modalContacto) {
        btnContacto.addEventListener('click', (e) => {
            e.preventDefault();
            modalContacto.classList.remove('hidden');
        });
    }

    if (btnCerrarContacto && modalContacto) {
        btnCerrarContacto.addEventListener('click', () => {
            modalContacto.classList.add('hidden');
        });
    }

    // Modal Galería
    const btnGaleria = document.getElementById('btn-galeria');
    const modalGaleria = document.getElementById('modal-galeria');
    const btnCerrarGaleria = document.getElementById('btn-cerrar-galeria');

    if (btnGaleria && modalGaleria) {
        btnGaleria.addEventListener('click', (e) => {
            e.preventDefault();
            modalGaleria.classList.remove('hidden');
        });
    }

    if (btnCerrarGaleria && modalGaleria) {
        btnCerrarGaleria.addEventListener('click', () => {
            modalGaleria.classList.add('hidden');
        });
    }

    // Modal Tienda / Llevar
    const btnTienda = document.getElementById('btn-tienda');
    const modalTienda = document.getElementById('modal-tienda');
    const btnCerrarTienda = document.getElementById('btn-cerrar-tienda');

    if (btnTienda && modalTienda) {
        btnTienda.addEventListener('click', (e) => {
            e.preventDefault();
            modalTienda.classList.remove('hidden');
        });
    }

    if (btnCerrarTienda && modalTienda) {
        btnCerrarTienda.addEventListener('click', () => {
            modalTienda.classList.add('hidden');
        });
    }

    // Visor de imágenes de la galería
    const galeriaItems = document.querySelectorAll('.galeria-item img');
    const modalVisor = document.getElementById('modal-visor');
    const imagenVisor = document.getElementById('imagen-visor');
    const btnCerrarVisor = document.getElementById('cerrar-visor');

    if (galeriaItems.length > 0 && modalVisor && imagenVisor) {
        galeriaItems.forEach(img => {
            img.addEventListener('click', () => {
                imagenVisor.src = img.src;
                modalVisor.classList.remove('hidden');
            });
        });

        if (btnCerrarVisor) {
            btnCerrarVisor.addEventListener('click', () => {
                modalVisor.classList.add('hidden');
            });
        }

        modalVisor.addEventListener('click', (e) => {
            if (e.target === modalVisor) {
                modalVisor.classList.add('hidden');
            }
        });
    }

    // Cerrar modales haciendo clic en el fondo oscuro
    window.addEventListener('click', (e) => {
        if (modalContacto && e.target === modalContacto) modalContacto.classList.add('hidden');
        if (modalGaleria && e.target === modalGaleria) modalGaleria.classList.add('hidden');
        if (modalTienda && e.target === modalTienda) modalTienda.classList.add('hidden');
        if (modalMenu && e.target === modalMenu) modalMenu.classList.add('hidden');
    });

    // ======================================================
    // 2. BUSCADOR EN TIEMPO REAL
    // ======================================================
    const inputBuscar = document.getElementById('buscar');
    const secciones = document.querySelectorAll('.seccion');
    const contenedorBusqueda = document.querySelector('.resultado-busqueda');

    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase().trim();
            let encontrados = 0;

            if (texto === '') {
                secciones.forEach(seccion => {
                    seccion.style.display = '';
                    const prods = seccion.querySelectorAll('.producto');
                    prods.forEach(p => p.style.display = '');
                });
                if (contenedorBusqueda) contenedorBusqueda.innerHTML = '';
                return;
            }

            secciones.forEach(seccion => {
                const prods = seccion.querySelectorAll('.producto');
                let tieneCoincidencias = false;

                prods.forEach(producto => {
                    const nombre = producto.querySelector('.nombre')?.textContent.toLowerCase() || '';
                    const desc = producto.querySelector('.descripcion')?.textContent.toLowerCase() || '';

                    if (nombre.includes(texto) || desc.includes(texto)) {
                        producto.style.display = '';
                        tieneCoincidencias = true;
                        encontrados++;
                    } else {
                        producto.style.display = 'none';
                    }
                });

                seccion.style.display = tieneCoincidencias ? '' : 'none';
            });

            if (contenedorBusqueda) {
                if (encontrados > 0) {
                    contenedorBusqueda.innerHTML = `<span class="con-resultados">Se han encontrado ${encontrados} productos</span>`;
                } else {
                    contenedorBusqueda.innerHTML = `<span class="sin-resultados">No se encontraron productos con "${texto}"</span>`;
                }
            }
        });
    }

    // ======================================================
    // 3. CATEGORÍAS STICKY Y SCROLL
    // ======================================================
    const categorias = document.querySelectorAll('.categoria');

    window.addEventListener('scroll', () => {
        let actual = '';
        secciones.forEach(seccion => {
            const top = seccion.offsetTop - 150;
            if (window.scrollY >= top && seccion.style.display !== 'none') {
                actual = seccion.getAttribute('id');
            }
        });

        categorias.forEach(cat => {
            cat.classList.remove('activa');
            if (cat.getAttribute('href') === `#${actual}`) {
                cat.classList.add('activa');
            }
        });
    });

    // ======================================================
    // 4. MODAL DE ALÉRGENOS
    // ======================================================
    const imgAlergenos = document.querySelector('.alergenos img');
    const modalAlergenos = document.querySelector('.modal-alergenos');
    const btnCerrarAlergenos = document.getElementById('cerrar-modal');

    if (imgAlergenos && modalAlergenos) {
        imgAlergenos.addEventListener('click', () => {
            modalAlergenos.classList.add('abierto');
        });
    }

    if (btnCerrarAlergenos && modalAlergenos) {
        btnCerrarAlergenos.addEventListener('click', () => {
            modalAlergenos.classList.remove('abierto');
        });
    }

    if (modalAlergenos) {
        modalAlergenos.addEventListener('click', (e) => {
            if (e.target === modalAlergenos) {
                modalAlergenos.classList.remove('abierto');
            }
        });
    }

});
