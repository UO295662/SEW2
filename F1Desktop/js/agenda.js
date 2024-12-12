class Agenda {
    constructor() {
        this.url = 'https://ergast.com/api/f1/current.json';
    }

    obtenerYMostrarCalendario() {
        $.ajax({
            url: this.url,
            method: 'GET',
            dataType: 'json',
            success: (respuesta) => {
                const carreras = respuesta.MRData.RaceTable.Races;
                this.mostrarCarreras(carreras);
            },
            error: (xhr, status, error) => {
                console.error(`Error en la consulta: ${status} - ${error}`);
                $('[data-contenedor="carreras"]').html('<p>Error al cargar la información de las carreras.</p>');
            }
        });
    }

    mostrarCarreras(carreras) {
        const contenedor = $('[data-contenedor="carreras"]');
        contenedor.empty(); 
        carreras.forEach(carrera => {
            const { raceName, date, time, Circuit } = carrera;
            const { circuitName, Location } = Circuit;
            const { lat, long, locality, country } = Location;

            const carreraHTML = `
            <main class="carrera">
                <h2>${raceName}</h2>
                <p><b>Circuito:</b> ${circuitName}</p>
                <p><b>Ubicación:</b> ${locality}, ${country}</p>
                <p><b>Coordenadas:</b> Latitud: ${lat}, Longitud: ${long}</p>
                <p><b>Fecha:</b> ${date}</p>
                <p><b>Hora:</b> ${time}</p>
            </main>
            <hr>`;

            contenedor.append(carreraHTML);
        });
    }
}
