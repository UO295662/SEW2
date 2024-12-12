class F1App {
    constructor() {
        this.apiUrl = 'https://ergast.com/api/f1/current/drivers.json';  // API para obtener la lista de pilotos
        this.pilotSelector = document.querySelector('select');  // Seleccionamos el primer <select> del documento
        this.resultChartCanvas = document.querySelector('canvas'); // Seleccionamos el primer <canvas> del documento
        this.fullscreenButtons = document.querySelectorAll('button'); // Seleccionamos todos los botones
        this.init();
    }

    // Método para inicializar la aplicación
    init() {
        // Cargar los pilotos y configurar el evento de selección
        this.loadPilots();

        // Evento para cargar los resultados del piloto seleccionado
        this.pilotSelector.addEventListener('change', (e) => {
            this.loadResults(e.target.value);
        });

        // Evento para poner la página en pantalla completa
        this.fullscreenButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.toggleFullScreen();
            });
        });
    }

    // Método para cargar los pilotos desde la API
    loadPilots() {
        fetch(this.apiUrl)
            .then(response => response.json())
            .then(data => {
                const pilotos = data.MRData.DriverTable.Drivers;
                pilotos.forEach(piloto => {
                    const option = document.createElement('option');
                    option.value = piloto.driverId;
                    option.textContent = `${piloto.givenName} ${piloto.familyName}`;
                    this.pilotSelector.appendChild(option);
                });

                // Inicializamos el gráfico con el primer piloto seleccionado
                const initialPilot = pilotos[0].driverId;
                this.loadResults(initialPilot);
            });
    }

    loadResults(driverId) {
        const resultsUrl = `https://ergast.com/api/f1/current/drivers/${driverId}/results.json`;
        const storageKey = `f1Results_${driverId}`;  
    
        const storedResults = localStorage.getItem(storageKey);
    
        if (storedResults) {
            const data = JSON.parse(storedResults);
            this.processResults(data);
        } else {
            fetch(resultsUrl)
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem(storageKey, JSON.stringify(data));
                    this.processResults(data);
                });
        }
    }

    processResults(data) {
        const results = data.MRData.RaceTable.Races;
        const carreras = results.map(race => race.raceName.replace(" Grand Prix", ""));
        const posiciones = results.map(race => parseInt(race.Results[0].positionText));
    
        this.drawChart(carreras, posiciones);
    }

    drawChart(carreras, posiciones) {
        const ctx = this.resultChartCanvas.getContext('2d');
        const barWidth = 50;
        const gap = 45;
        const chartHeight = this.resultChartCanvas.height;
        const chartWidth = this.resultChartCanvas.width;
        
        ctx.clearRect(0, 0, chartWidth, chartHeight);
    
        // Dibuja las barras
        for (let i = 0; i < carreras.length; i++) {
            const x = (i * (barWidth + gap)) + 100;  // Ajustamos la posición X para que las barras estén centradas
            const y = chartHeight - (posiciones[i] * 25);  // Multiplicamos la posición por un factor de escala mayor
            const height = posiciones[i] * 25;  // Escala de la altura de la barra
            const color = '#1f3541';
    
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, height);
    
            // Dibuja la posición dentro de la barra
            ctx.fillStyle = 'white';
            ctx.font = '2em Arial';
            const positionText = posiciones[i]; // El número de la posición
            const textWidth = ctx.measureText(positionText).width; // Medir el ancho del texto para centrarlo
    
            // Posicionamos el texto dentro de la barra, centrado
            const textX = x + (barWidth / 2) - (textWidth / 2); // Centrar el número en la barra
            const textY = y + height / 2 + 5; // Colocamos el número un poco arriba del centro de la barra
    
            ctx.fillText(positionText, textX, textY);  // Dibuja la posición en el centro de la barra
        }
    
        // Dibuja las etiquetas en el eje X (Carreras)
        ctx.fillStyle = 'white';
        ctx.font = '1em  Arial';
    
        for (let i = 0; i < carreras.length; i++) {
            const x = (i * (barWidth + gap)) + 100;  // Ajustamos la posición X de las etiquetas
            const labelWidth = ctx.measureText(carreras[i]).width;  // Medimos el ancho de la etiqueta
    
            // Posicionamos las etiquetas ligeramente debajo de la barra para evitar que se superpongan
            const labelX = x + (barWidth / 2) - (labelWidth / 2);  // Centrar la etiqueta debajo de la barra
            const labelY = chartHeight - 20;  // Espacio suficiente debajo de la barra para la etiqueta
    
            ctx.fillText(carreras[i], labelX, labelY);  // Dibuja la etiqueta centrada debajo de la barra
        }
    }

    // Método para activar pantalla completa
    toggleFullScreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }
}

// Instanciamos la clase F1App cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    new F1App();
});