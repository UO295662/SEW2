document.addEventListener("DOMContentLoaded", function () {
    const kmlInput = document.querySelector('section:nth-of-type(1) input[type="file"]');
    const mapDiv = document.querySelector('section:nth-of-type(1) div');
    const svgInput = document.querySelector('section:nth-of-type(2) input[type="file"]');
    const xmlInput = document.querySelector('section:nth-of-type(3) input[type="file"]');
    const xmlContent = document.querySelector('section:nth-of-type(3)'); 
    let map, infoWindow;

    function initMap() {
        map = new google.maps.Map(mapDiv, {
            center: { lat: 44.342189, lng: 11.712222 },
            zoom: 14,
            mapTypeId: 'terrain',
        });
    }

    kmlInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const kmlText = e.target.result;
            initMap();

            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(kmlText, "application/xml");
            const coordinates = kmlDoc.querySelectorAll("coordinates");
            let path = [];

            coordinates.forEach((coordElement) => {
                const coordsArray = coordElement.textContent.trim().split(/\s+/);

                coordsArray.forEach((coord) => {
                    const [lng, lat] = coord.split(",").map(Number);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        path.push({ lat, lng });
                    }
                });
            });

            if (path.length === 0) {
                console.error("No se encontraron coordenadas válidas.");
                return;
            }

            const polyline = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });

            polyline.setMap(map);

            polyline.addListener("click", function () {
                if (!infoWindow) {
                    infoWindow = new google.maps.InfoWindow();
                }
                infoWindow.setContent("Polilínea");
                infoWindow.setPosition(polyline.getPath().getAt(0));
                infoWindow.open(map);
            });

            
        };

        reader.readAsText(file);
    });

    svgInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function (e) {
            const svgContent = e.target.result;
            const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
            const header = document.createElement('h3');
            header.textContent = "SVG Cargado";  
            const section = svgInput.closest('section');
            section.appendChild(header);
            section.appendChild(svgElement); 
        };
    
        reader.readAsText(file);
    });

    // Manejo del archivo XML
    xmlInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
                const xmlString = new XMLSerializer().serializeToString(xmlDoc);
                convertirXMLaHTML(xmlString);
            } catch (error) {
                console.log(error);
                xmlContent.innerHTML = "<p>Error al procesar el archivo XML.</p>";
            }
        };

        reader.readAsText(file);
    });

    // Convertir XML a HTML
    function convertirXMLaHTML(xmlString) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlString, "application/xml");

        function recorrerXML(xmlElement) {
            var htmlContent = '';

            $(xmlElement).children().each(function() {
                var tagName = this.tagName;
                var content = $(this).text();
                var $this = $(this);

                switch (tagName) {
                    case 'nombre':
                        htmlContent += "<h3>Nombre:</h3><p>" + content + "</p>";
                        break;
                    case 'localidad':
                        htmlContent += "<h3>Localidad:</h3><p>" + content + "</p>";
                        break;
                    case 'pais':
                        htmlContent += "<h3>País:</h3><p>" + content + "</p>";
                        break;
                    case 'bibliografia':
                        htmlContent += "<h3>Bibliografía</h3><ul>";
                        $this.children('referencia').each(function() {
                            htmlContent += "<li><a href='" + $(this).text() + "' target='_blank'>" + $(this).text() + "</a></li>";
                        });
                        htmlContent += "</ul>";
                        break;
                    case 'galeria_fotos':
                        htmlContent += "<h3>Galería de fotos</h3><ul>";
                        $this.children('foto').each(function() {
                            var archivo = "xml/" + $(this).attr('archivo');
                            htmlContent += "<li><img src='" + archivo + "' loading='lazy' alt='Imagen' width='712' height='400'></li>";
                        });
                        htmlContent += "</ul>";
                        break;
                    case 'galeria_videos':
                        htmlContent += "<h3>Galería de videos</h3>";
                        $this.children('video').each(function() {
                            var archivo = "xml/" + $(this).attr('archivo');
                            htmlContent += "<video controls width='600'>";
                            htmlContent += "<source src='" + archivo + "' type='video/mp4'>";
                            htmlContent += "</video>";
                        });
                        break;
                    case 'coordenadas_centro':
                        htmlContent += "<h3>Coordenadas del centro</h3><ul>";
                        htmlContent += "<li>Latitud: " + $(this).children('latitud').text() + "</li>";
                        htmlContent += "<li>Longitud: " + $(this).children('longitud').text() + "</li>";
                        htmlContent += "<li>Altitud: " + $(this).children('altitud').text() + " m</li>";
                        htmlContent += "</ul>";
                        break;
                    case 'tramos':
                        htmlContent += "<h3>Tramos del circuito</h3><ul>";
                        $this.children('tramo').each(function() {
                            htmlContent += "<li>Distancia: " + $(this).children('distancia').children('valor').text() + " " + $(this).children('distancia').children('unidad').text() + "<br>";
                            htmlContent += "Coordenadas: Latitud " + $(this).children('coordenadas').children('latitud').text() +
                                ", Longitud " + $(this).children('coordenadas').children('longitud').text() +
                                ", Altitud " + $(this).children('coordenadas').children('altitud').text() + " m";
                            htmlContent += "</li>";
                        });
                        htmlContent += "</ul>";
                        break;
                }

                htmlContent += recorrerXML(this);
            });

            return htmlContent;
        }

        var html = recorrerXML(xmlDoc.documentElement);

        // Insertamos el contenido generado en el contenedor de XML
        xmlContent.innerHTML = html;
        xmlContent.style.display = "block";
    }
});