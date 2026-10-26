// =========================================
// COMPARTIR EL DESTINO SAMAÍN EN INSTAGRAM
// =========================================
document.addEventListener("DOMContentLoaded", () => {

    const EN = (document.documentElement.lang || "es").toLowerCase().startsWith("en");
    const T = EN ? {
        btn: "Share on Insta",
        decidido: "Fate has decided…",
        lema: "- Iberian Specialists -",
        caption: "My destiny today:",
        copiado: "Text copied: paste it when you post and tag @samaincormelana 😉",
        descargada: "Image saved and text copied. Upload it to your story and tag us: @samaincormelana"
    } : {
        btn: "Comparte en Insta",
        decidido: "El destino ha decidido…",
        lema: "- Especialistas en Ibéricos -",
        caption: "Mi destino de hoy:",
        copiado: "Texto copiado: pégalo al publicar y etiqueta a @samaincormelana 😉",
        descargada: "Imagen guardada y texto copiado. Súbela a tu historia y etiquétanos: @samaincormelana"
    };

    const CUENTA = "@samaincormelana";
    const LOCAL  = "Jamonería Samaín · A Coruña";

    const nombreEl = document.getElementById("nombre-destino");
    const catEl    = document.getElementById("categoria-destino");
    const tarjeta  = document.querySelector(".tarjeta-destino");
    if (!nombreEl || !tarjeta) return;

    // ---------- Botón + aviso (se insertan solos en la tarjeta) ----------
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-compartir-insta";
    btn.innerHTML = '<img src="instagram.svg" alt=""> ' + T.btn;

    const aviso = document.createElement("p");
    aviso.className = "aviso-compartir";

    const small = tarjeta.querySelector("small");
    tarjeta.insertBefore(btn, small);
    tarjeta.insertBefore(aviso, small);

    // ---------- Utilidades ----------
    const css = (v, def) =>
        getComputedStyle(document.documentElement).getPropertyValue(v).trim() || def;

    const cargar = src => new Promise(res => {
        if (!src) return res(null);
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => res(null);
        i.src = src;
    });

    function rr(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function lineas(ctx, texto, ancho) {
        const out = [];
        let l = "";
        texto.split(" ").forEach(w => {
            const t = l ? l + " " + w : w;
            if (ctx.measureText(t).width > ancho && l) { out.push(l); l = w; }
            else l = t;
        });
        if (l) out.push(l);
        return out;
    }

    // ---------- Generación de la imagen (1080x1920, formato historia) ----------
    async function generar() {
        const nombre = nombreEl.textContent.trim();
        if (!nombre) return null;

        const catTexto = catEl ? catEl.textContent.trim() : "";
        const catImg   = catEl ? catEl.querySelector("img") : null;

        const cont = document.getElementById("contenedor-temporada");
        const temporada = cont && getComputedStyle(cont).display !== "none";
        const elIco = document.getElementById("icono-izq");
        const elDet = document.getElementById("detalle-temporada");
        const icoTempSrc = temporada && elIco ? elIco.getAttribute("src") : null;
        const textoTemp  = temporada && elDet ? elDet.textContent.trim() : "";

        const [logo, dados, icoCat, icoTemp] = await Promise.all([
            cargar("LOGO.png"), cargar("dados.png"),
            cargar(catImg ? catImg.getAttribute("src") : null),
            cargar(icoTempSrc)
        ]);

        const azul = css("--color-principal", "#2d2b72");
        const oro  = css("--color-dorado", "#d8b35c");

        const W = 1080, H = 1920;
        const c = document.createElement("canvas");
        c.width = W; c.height = H;
        const x = c.getContext("2d");
        x.textAlign = "center";

        // Fondo y marcos
        const g = x.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, azul);
        g.addColorStop(1, "#14133d");
        x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.strokeStyle = oro; x.lineWidth = 6; x.strokeRect(50, 50, W - 100, H - 100);
        x.globalAlpha = 0.4; x.lineWidth = 2; x.strokeRect(72, 72, W - 144, H - 144);
        x.globalAlpha = 1;

        // Logo con brillo dorado (como en la cabecera)
        if (logo) {
            const h = 280, w = logo.width / logo.height * h;
            x.save();
            x.shadowColor = oro; x.shadowBlur = 40;
            x.drawImage(logo, (W - w) / 2, 130, w, h);
            x.restore();
        } else {
            x.fillStyle = oro; x.font = "bold 110px Arial, Helvetica, sans-serif";
            x.fillText("SAMAÍN", W / 2, 330);
        }

        x.fillStyle = oro; x.font = "italic 46px Arial, Helvetica, sans-serif";
        x.fillText(T.lema, W / 2, 500);

        // Texto de temporada (si hay decoración activa)
        if (textoTemp) {
            x.font = "bold 38px Arial, Helvetica, sans-serif";
            const pw = x.measureText(textoTemp).width + 70;
            rr(x, (W - pw) / 2, 560, pw, 70, 35);
            x.fillStyle = "rgba(255,255,255,0.08)"; x.fill();
            x.strokeStyle = oro; x.lineWidth = 2; x.stroke();
            x.fillStyle = oro; x.textBaseline = "middle";
            x.fillText(textoTemp, W / 2, 596);
            x.textBaseline = "alphabetic";
        }

        // Dados (y iconos de temporada a los lados)
        if (dados) {
            const h = 200, w = dados.width / dados.height * h;
            x.drawImage(dados, (W - w) / 2, 690, w, h);
        }
        if (icoTemp) {
            const s = 170, hh = icoTemp.height / icoTemp.width * s;
            x.drawImage(icoTemp, 130, 705, s, hh);
            x.drawImage(icoTemp, W - 130 - s, 705, s, hh);
        }

        x.fillStyle = "#ffffff"; x.font = "48px Arial, Helvetica, sans-serif";
        x.fillText(T.decidido, W / 2, 1000);

        // Etiqueta de categoría
        if (catTexto) {
            x.font = "bold 46px Arial, Helvetica, sans-serif";
            const tw = x.measureText(catTexto).width;
            const is = icoCat ? 60 : 0, gap = icoCat ? 18 : 0;
            const pw = tw + is + gap + 90, px = (W - pw) / 2;
            rr(x, px, 1040, pw, 96, 48);
            x.fillStyle = oro; x.fill();
            if (icoCat) x.drawImage(icoCat, px + 45, 1058, is, is);
            x.fillStyle = "#ffffff"; x.textBaseline = "middle";
            x.fillText(catTexto, px + 45 + is + gap + tw / 2, 1090);
            x.textBaseline = "alphabetic";
        }

        // Nombre del plato (ajusta el tamaño si es largo). Sin precio.
        let y = 1290, tam = 92, ls = [];
        for (const t of [92, 80, 68, 58]) {
            tam = t;
            x.font = "bold " + t + "px Arial, Helvetica, sans-serif";
            ls = lineas(x, nombre, W - 200);
            if (ls.length <= (t >= 80 ? 2 : 3)) break;
        }
        x.fillStyle = "#ffffff";
        ls.forEach(l => { x.fillText(l, W / 2, y); y += tam * 1.2; });

        // Pie: cuenta y local
        x.fillStyle = oro; x.font = "bold 78px Arial, Helvetica, sans-serif";
        x.fillText(CUENTA, W / 2, 1720);
        x.fillStyle = "#ffffff"; x.font = "40px Arial, Helvetica, sans-serif";
        x.fillText(LOCAL, W / 2, 1790);

        return new Promise(res => c.toBlob(
            b => res(b ? new File([b], "mi-destino-samain.png", { type: "image/png" }) : null),
            "image/png"
        ));
    }

    // ---------- Pre-generar la imagen en cuanto sale el resultado ----------
    // (así el botón puede abrir "compartir" al instante, que es lo que exige iPhone)
    let listo = null, token = 0;

    async function preparar() {
        const t = ++token;
        const f = await generar();
        if (t === token) listo = f;
    }

    new MutationObserver(() => {
        listo = null; aviso.textContent = ""; token++;
        if (nombreEl.textContent.trim()) preparar();
    }).observe(nombreEl, { childList: true, characterData: true, subtree: true });

    // ---------- Compartir ----------
    const caption = () =>
        T.caption + " " + nombreEl.textContent.trim() + " 🎲 📍" + CUENTA + " #SamaínCormelana #ACoruña";

    function descargar(file) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        document.body.appendChild(a); a.click(); a.remove();
    }

    btn.addEventListener("click", async e => {
        e.stopPropagation(); // la tarjeta se cierra al pulsar en cualquier sitio; aquí no
        const texto = caption();
        try { if (navigator.clipboard) navigator.clipboard.writeText(texto).catch(() => {}); } catch (_) {}

        const file = listo || await generar();
        if (!file) return;

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file], text: texto });
                aviso.textContent = T.copiado;
            } catch (err) {
                if (err.name !== "AbortError") { descargar(file); aviso.textContent = T.descargada; }
            }
        } else {
            descargar(file);
            aviso.textContent = T.descargada;
        }
    });

    aviso.addEventListener("click", e => e.stopPropagation());
});
