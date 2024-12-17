class Pais {
    // Atributos iniciales
    nombre;
    capital;
    circuito;
    poblacion;
    formaGobierno;
    coordenadasMetaLat;
    coordenadasMetaLon;
    religionMayoritaria;
    apikey;
    unidades;
    tipo;
    url;

    // Constructor para inicializar atributos principales
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;

        // Valores por defecto que pueden ser inicializados posteriormente
        this.circuito = null;
        this.formaGobierno = null;
        this.coordenadasMetaLat = null;
        this.coordenadasMetaLon = null;
        this.religionMayoritaria = null;
        this.tipo = "&mode=xml";
        this.apikey = "d03054a9e5b1d0670ed0163050447076"; 
        this.unidades = "&units=metric"; 
    }

    // Método para inicializar el resto de los atributos
    inicializarDetalles(circuito, formaGobierno, coordenadasMetaLat, coordenadasMetaLon, religionMayoritaria) {
        this.circuito = circuito;
        this.formaGobierno = formaGobierno;
        this.coordenadasMetaLat = coordenadasMetaLat;
        this.coordenadasMetaLon = coordenadasMetaLon;
        this.religionMayoritaria = religionMayoritaria;
        this.url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.coordenadasMetaLat}&lon=${this.coordenadasMetaLon}&appid=${this.apikey}${this.unidades}${this.tipo}`;
    }

    // Métodos que devuelven información principal
    getNombre() {
        return `País: ${this.nombre}`;
    }

    getCapital() {
        return `Capital: ${this.capital}`;
    }

    getInformacionSecundaria() {
        const datos = `
            <ul>
                <li>Nombre del circuito: ${this.circuito || "No disponible"}</li>
                <li>Población: ${this.poblacion} habitantes</li>
                <li>Forma de Gobierno: ${this.formaGobierno || "No disponible"}</li>
                <li>Religión Mayoritaria: ${this.religionMayoritaria || "No disponible"}</li>
            </ul>
        `;
        return datos;
    }

    // Método para escribir las coordenadas de la línea de meta en el documento
    escribirCoordenadasMeta() {
        if (this.coordenadasMetaLat && this.coordenadasMetaLon) {
            const coordenadas = `<p>Línea de meta: ${this.coordenadasMetaLat}, ${this.coordenadasMetaLon}</p>`;
            document.querySelector("article").innerHTML += coordenadas; 
        } else {
            console.warn("Coordenadas de la línea de meta no disponibles.");
        }
    }
    obtenerClima() {
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: (datos) => {
                let pronosticoHTML = '';
                let diasProcesados = {};

                $('time', datos).each(function () {
                    const fechaHora = $(this).attr("from");
                    const fechaObj = new Date(fechaHora);
                    const dia = fechaObj.toLocaleDateString();
                    const hora = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const tempMin = $('temperature', this).attr("min");
                    const tempMax = $('temperature', this).attr("max");
                    const humedad = $('humidity', this).attr("value");
                    const viento = $('windSpeed', this).attr("mps");
                    const descripcion = $('symbol', this).attr("name");
                    const icono = $('symbol', this).attr("var");
                    const urlIcono = `https://openweathermap.org/img/wn/${icono}@2x.png`;

                    // Evita repetir días ya procesados
                    if (!diasProcesados[dia]) {
                        diasProcesados[dia] = true;

                        pronosticoHTML += `
                            <aside>
                                <p>${dia}</p>
                                <img src="${urlIcono}" alt="${descripcion}">
                                <ul>
                                    <li>Hora: ${hora}</li>
                                    <li>Temperatura Máxima: ${tempMax}°C</li>
                                    <li>Temperatura Mínima: ${tempMin}°C</li>
                                    <li>Humedad: ${humedad}%</li>
                                    <li>Velocidad del Viento: ${viento} m/s</li>
                                    <li>Descripción: ${descripcion}</li>
                                </ul>
                            </aside>
                        `;
                    }
                });

                // Muestra el resultado en una sección HTML
                document.querySelector("section").innerHTML += pronosticoHTML;
            },
        });
    }    
}