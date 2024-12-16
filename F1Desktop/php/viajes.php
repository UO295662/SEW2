<?php
class Carrusel {
    private $pais;
    private $capital;
    private $fotos = [];

    public function __construct($capital, $pais) {
        $this->capital = $capital;
        $this->pais = $pais;
    }

    public function obtenerFotos($apiKey) {
        $endpointSearch = "https://api.flickr.com/services/rest/";
        $searchParams = [
            "method" => "flickr.photos.search",
            "api_key" => $apiKey,
            "text" => $this->pais,
            "format" => "json",
            "nojsoncallback" => 1,
            "per_page" => 10,
            "sort" => "relevance"
        ];

        $urlSearch = $endpointSearch . '?' . http_build_query($searchParams);
        $responseSearch = @file_get_contents($urlSearch);
        if ($responseSearch === false) {
            echo "<p>Error al obtener las fotos de Flickr.</p>";
            return;
        }
        $dataSearch = json_decode($responseSearch, true);

        if (isset($dataSearch['photos']['photo'])) {
            foreach ($dataSearch['photos']['photo'] as $photo) {
                $photoId = $photo['id'];
                $photoDetails = $this->obtenerDetallesFoto($photoId, $apiKey);
                if ($photoDetails) {
                    $this->fotos[] = $photoDetails;
                }
            }
        }
    }

    private function obtenerDetallesFoto($photoId, $apiKey) {
        $endpointInfo = "https://api.flickr.com/services/rest/";
        $infoParams = [
            "method" => "flickr.photos.getInfo",
            "api_key" => $apiKey,
            "photo_id" => $photoId,
            "format" => "json",
            "nojsoncallback" => 1
        ];
        $urlInfo = $endpointInfo . '?' . http_build_query($infoParams);
        $responseInfo = @file_get_contents($urlInfo);
        if ($responseInfo === false) return null;

        $dataInfo = json_decode($responseInfo, true);

        if ($dataInfo['stat'] == 'ok') {
            $photoData = $dataInfo['photo'];
            return [
                "url" => "https://live.staticflickr.com/{$photoData['server']}/{$photoData['id']}_{$photoData['secret']}_m.jpg",
                "title" => $photoData['title']['_content'],
                "author" => $photoData['owner']['username'],
                "date" => $photoData['dates']['taken']
            ];
        }
        return null;
    }

    public function mostrarCarrusel() {
        if (!empty($this->fotos)) {
            echo "<article>";
            echo "<h3>Carrusel de Imágenes para {$this->pais}</h3>";
            foreach ($this->fotos as $index => $foto) {
                $style = $index === 0 ? 'display: block;' : 'display: none;';
                echo "<img src='" . htmlspecialchars($foto['url']) . "' alt='Imagen {$index} de {$this->pais}' loading=lazy style='{$style}' />";
            }

            echo "<button onclick='moverCarrusel(-1)'><</button>";
            echo "<button onclick='moverCarrusel(1)'>></button>";
            echo "</article>";
        } else {
            echo "<p>No hay fotos disponibles para {$this->pais}.</p>";
        }
    }
}

class Moneda {
    private $monedaLocal;
    private $monedaObjetivo;

    public function __construct($monedaLocal, $monedaObjetivo) {
        $this->monedaLocal = $monedaLocal;
        $this->monedaObjetivo = $monedaObjetivo;
    }
    public function getMonedaLocal() {
        return $this->monedaLocal;
    }

    public function getMonedaObjetivo() {
        return $this->monedaObjetivo;
    }
    public function convertir($cantidad) {
        $url = "https://open.er-api.com/v6/latest/{$this->monedaLocal}";
        $response = file_get_contents($url);
        
        if ($response === false) {
            echo 'Error al obtener la tasa de cambio.';
            return null;
        }
        $data = json_decode($response, true);
        if (isset($data['rates'][$this->monedaObjetivo])) {
            $tasaDeCambio = $data['rates'][$this->monedaObjetivo];
            $resultado = $cantidad * $tasaDeCambio;
            return $resultado;
        } else {
            echo "Error: La tasa de cambio no está disponible.";
            return null;
        }
    }
}

$apiKeyFlickr = "6f0341683ea3275017c15c42e61ea7a5";
$apiKeyExchange = "2dd697efa0a1cf3e598d54cea4caef21";

$carrusel1 = new Carrusel("Roma", "Italia");
$carrusel1->obtenerFotos($apiKeyFlickr);

$conversion = new Moneda("USD", "EUR");
$monedaLocal=$conversion->getMonedaLocal();
$monedaObjetivo=$conversion->getMonedaObjetivo();
$cantidad=1;
$resultadoConversion = $conversion->convertir($cantidad);
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>F1 Desktop</title>
    <meta name="author" content="Gael Horta Calzada">
    <meta name="description" content="Documento basado en la F1 y Daniel Ricciardo">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../multimedia/imagenes/favicon.ico">
    <link rel="stylesheet" href="../estilo/estilo.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQz2BOIGZarND4L4WVBfRCqCigjJ2f4PU&callback"  defer></script>
</head>
<body>
<header>
        <h1><a href="../index.html" title="Ir a la página principal">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html" title="Inicio F1Dekstop">Inicio</a>
            <a href="../juegos.html" title="Juegos F1Dekstop">Juegos</a>
            <a href="../calendario.html" title="Calendario F1Dekstop">Calendario</a>
            <a href="../circuito.html" title="Circuito F1Dekstop">Circuito</a>
            <a href="viajes.php" title="Viajes F1Dekstop" class="active">Viajes</a>
            <a href="../meteorologia.html" title="Meteorología F1Dekstop">Meteorología</a>
            <a href="../noticias.html" title="Noticias F1Dekstop">Noticias</a>
            <a href="../piloto.html" title="Piloto F1Dekstop">Piloto</a>
        </nav>
    </header>

    <p>Estás en: <a href="../index.html">Inicio</a> >> Viajes</p>
    
    <main>
        <h2>Viajes</h2>
        <section>
            <h3>Mapa Estático</h3>
            <p>Haz clic en el botón para mostrar el mapa estático basado en tu ubicación.</p>
            <input type="button" value="Obtener mapa estático" onclick="viaje.getMapaEstaticoGoogle();">
            
            <h3>Mapa Dinámico</h3>
            <p>Haz clic en el botón para mostrar el mapa dinámico basado en tu ubicación.</p>
            <input type="button" value="Obtener mapa dinámico" onclick="viaje.getMapaDinamico();">
        </section>
        <section>
            <?php $carrusel1->mostrarCarrusel(); ?>
        </section>
        <section>
            <h3>Tasa de Cambio</h3>
            <p>
            <?php echo htmlspecialchars($cantidad); ?> 
            <?php echo htmlspecialchars($monedaLocal); ?> 
            equivale a 
            <?php echo htmlspecialchars($resultadoConversion); ?> 
            <?php echo htmlspecialchars($monedaObjetivo); ?>.
            </p>
    </section>
        
        <script src="../js/viajes.js" async></script>
    </main>
</body>
</html>