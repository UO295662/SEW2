    document.addEventListener("DOMContentLoaded", function () {
        const kmlFileInput = document.querySelector(".kml-file");
        const mapContainer = document.querySelector(".map-container");
        let map;
        let infoWindow;

        function initMap() {
            map = new google.maps.Map(mapContainer, {
                center: { lat: 44.342189, lng: 11.712222 },
                zoom: 14,
                mapTypeId: 'terrain',
            });
        }

        // Manejador de evento para el archivo KML
        kmlFileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = function (e) {
                const kmlText = e.target.result;
                initMap();

                // Crear un parser XML para leer el archivo KML
                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(kmlText, "application/xml");
                // Obtener las coordenadas de la polilínea del archivo KML
                const coordinates = kmlDoc.querySelectorAll("coordinates");
                let path = [];

                // Extraer las coordenadas
                coordinates.forEach((coordElement) => {
                    const coordText = coordElement.textContent.trim();
                
                    const coordsArray = coordText.split(/\s+/).filter(coord => coord.trim() !== "");
                
                    coordsArray.forEach((coord) => {
                        const [lng, lat] = coord.split(",").map((c) => parseFloat(c.trim()));
                    
                        if (!isNaN(lat) && !isNaN(lng)) {
                            path.push({ lat, lng });
                        }
                    });
                    
                });

                // Validar que haya coordenadas válidas
                if (path.length === 0) {
                    console.error("No se encontraron coordenadas válidas.");
                    return;
                }

                // Crear una polilínea en el mapa con las coordenadas extraídas
                const polyline = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });

                polyline.setMap(map);

                // Opcional: Agregar un listener de clic en la polilínea para mostrar información
                polyline.addListener("click", function () {
                    if (!infoWindow) {
                        infoWindow = new google.maps.InfoWindow();
                    }
                    infoWindow.setContent("Polilínea");
                    infoWindow.setPosition(polyline.getPath().getAt(0)); // Muestra la ventana de información en el primer punto
                    infoWindow.open(map);
                });
                mapContainer.classList.add('show'); 
            };
            reader.readAsText(file);
        });

        const svgFileInput = document.querySelector(".svg-file");
        const svgContainer = document.querySelector(".svg-container");

        svgFileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                svgContainer.innerHTML = e.target.result;
            };
            reader.readAsText(file);
        });

        const xmlFileInput = document.querySelector(".xml-file");
        const xmlContentDisplay = document.querySelector(".xml-content");

        xmlFileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
                    const xmlString = new XMLSerializer().serializeToString(xmlDoc);
                    xmlContentDisplay.textContent = xmlString;
                } catch (error) {
                    xmlContentDisplay.textContent = "Error al procesar el archivo XML.";
                }
            };
            reader.readAsText(file);
        });

        window.initMap = initMap;
    });