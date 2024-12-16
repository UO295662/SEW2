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
        this.url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.coordenadasMetaLat}&lon=${this.coordenadasMetaLon}&appid=${this.apikey}${this.unidades}`;
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
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: (datos) => {
                const ciudad = datos.city.name || "Coordenadas indicadas";
                const pronosticos = datos.list;
                let pronosticoHTML='';
                let diasProcesados = {};
        
                pronosticos.forEach((pronostico) => {
                    const fecha = new Date(pronostico.dt * 1000);
                    const dia = fecha.toLocaleDateString();
                    const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
                    const tempMax = pronostico.main.temp_max;
                    const tempMin = pronostico.main.temp_min;
                    const humedad = pronostico.main.humidity;
                    const cantidadLluvia = pronostico.rain?.["3h"] || 0;
                    const icono = pronostico.weather[0].icon;
                    const descripcion = pronostico.weather[0].description;
                    const urlIcono = `https://openweathermap.org/img/wn/${icono}@2x.png`;
        
                    if (!diasProcesados[dia]) {
                        diasProcesados[dia] = true;
                        console.log(urlIcono);
                        pronosticoHTML += `
                                <aside>
                                <p>${dia}</p>
                                    <img src="${urlIcono}" alt="${descripcion}">
                                    <ul>
                                        <li>Temperatura Máxima: ${tempMax}°C</li>
                                        <li>Temperatura Mínima: ${tempMin}°C</li>
                                        <li>Humedad: ${humedad}%</li>
                                        <li>Cantidad de Lluvia: ${cantidadLluvia} mm</li>
                                    </ul>
                                </aside>
                        `;
                    }
                });
                document.querySelector("section").innerHTML += pronosticoHTML;
            },
        });
    }    
}