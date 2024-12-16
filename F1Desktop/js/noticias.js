class Noticias {
    constructor() {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            alert("Este navegador no soporta la API File.");
        }
    }

    // Leer el archivo de texto de noticias
    readInputFile(files) {
        const archivo = files[0];
        const [nombreArchivo, tamañoArchivo, tipoArchivo, ultimaModificacion, errorLectura] = document.querySelectorAll("main > p");

        if (!archivo.type.match(/text.*/)) {
            errorLectura.innerText = "Error: ¡Archivo no válido!";
            return;
        }
        const lector = new FileReader();
        lector.onload = (e) => this.procesarContenido(e.target.result);
        lector.readAsText(archivo);
    }

    // Procesar el contenido del archivo
    procesarContenido(contenido) {
        const contenedor = document.querySelector("main > section:nth-of-type(1)");
        contenido.split("\n").forEach(linea => {
            if (linea.trim()) {
                const partes = linea.split("_");
                if (partes.length >= 3) {
                    const [titular, entradilla, autor] = partes;
    
                    const noticiaElemento = document.createElement("article");
    
                    const titularElemento = document.createElement("h4");
                    titularElemento.innerText = titular.trim();
    
                    const entradillaElemento = document.createElement("p");
                    entradillaElemento.innerText = entradilla.trim();
    
                    const autorElemento = document.createElement("p");
                    autorElemento.innerText = `Autor: ${autor.trim()}`;

                    const salto=document.createElement("hr");
    
                    // Añadir los elementos al artículo
                    noticiaElemento.appendChild(titularElemento);
                    noticiaElemento.appendChild(entradillaElemento);
                    noticiaElemento.appendChild(autorElemento);
                    noticiaElemento.appendChild(salto);
    
                    contenedor.appendChild(noticiaElemento);
                } else {
                    console.error("Línea mal formateada: ", linea);
                }
            }
        });
    }
    agregarNoticiaUsuario() {
        const formulario = document.querySelector("main > section:nth-of-type(2)");
        const [titulo, autor, descripcion] = formulario.querySelectorAll("input, textarea");

        if (titulo.value && autor.value && descripcion.value) {
            const contenedor = document.querySelector("main > section:nth-of-type(1)");
            const noticiaElemento = document.createElement("article");

            const tituloElemento = document.createElement("h4");
            tituloElemento.innerText = titulo.value;

            const autorElemento = document.createElement("p");
            autorElemento.innerText = `Autor: ${autor.value}`;

            const descripcionElemento = document.createElement("p");
            descripcionElemento.innerText = descripcion.value;

            const salto=document.createElement("hr");
            noticiaElemento.appendChild(tituloElemento);
            noticiaElemento.appendChild(autorElemento);
            noticiaElemento.appendChild(descripcionElemento);
            noticiaElemento.appendChild(salto);

            contenedor.appendChild(noticiaElemento);

            titulo.value = "";
            autor.value = "";
            descripcion.value = "";
        } else {
            alert("Por favor, completa todos los campos: título, autor y descripción.");
        }
    }
}