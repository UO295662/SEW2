"use strict";

class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(
            this.getPosicion.bind(this),
            this.verErrores.bind(this)
        );
    }
    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo = posicion.coords.heading;
        this.velocidad = posicion.coords.speed;
    }
    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización";
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible";
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado";
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido";
                break;
        }
    }

    getLongitud() {
        return this.longitud;
    }

    getLatitud() {
        return this.latitud;
    }

    getAltitud() {
        return this.altitud;
    }

    verTodo(dondeVerlo) {
        const ubicacion = document.querySelector(`.${dondeVerlo}`);
        let datos = `<p>${this.mensaje}</p>`;
        datos += `<p>Longitud: ${this.longitud} grados</p>`;
        datos += `<p>Latitud: ${this.latitud} grados</p>`;
        datos += `<p>Precisión de la longitud y latitud: ${this.precision} metros</p>`;
        datos += `<p>Altitud: ${this.altitud || "No disponible"} metros</p>`;
        datos += `<p>Precisión de la altitud: ${this.precisionAltitud || "No disponible"} metros</p>`;
        datos += `<p>Rumbo: ${this.rumbo || "No disponible"} grados</p>`;
        datos += `<p>Velocidad: ${this.velocidad || "No disponible"} metros/segundo</p>`;
        ubicacion.innerHTML = datos;
    }

    getMapaEstaticoGoogle(dondeVerlo) {
        const ubicacion = document.querySelector(`.${dondeVerlo}`);
        if (!ubicacion) {
            console.error("El contenedor especificado no existe.");
            return;
        }
        let mapaEstatico = document.querySelector(".mapaEstatico");
        if (!mapaEstatico) {
            mapaEstatico = document.createElement("article");
            mapaEstatico.classList.add("mapaEstatico");
            ubicacion.appendChild(mapaEstatico);
        }
        const apiKey = "&key=AIzaSyAQz2BOIGZarND4L4WVBfRCqCigjJ2f4PU";
        const url = "https://maps.googleapis.com/maps/api/staticmap?";
        const centro = `center=${this.latitud},${this.longitud}`;
        const zoom = "&zoom=15";
        const tamaño = "&size=250x200";
        const marcador = `&markers=color:red%7Clabel:S%7C${this.latitud},${this.longitud}`;
        const sensor = "&sensor=false";
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        const contenido = `
            <h3>Mapa Estático</h3>
            <img src="${this.imagenMapa}" alt="Mapa estático de Google" loading=lazy/>`;
        mapaEstatico.innerHTML = contenido;
    }

    getMapaDinamico(dondeVerlo) {
        const ubicacion = document.querySelector(`.${dondeVerlo}`);
        if (!ubicacion) {
            console.error("No se encuentra el contenedor para el mapa dinámico.");
            return;
        }
        let mapaDinamico = document.querySelector(".mapaDinamico");
        if (!mapaDinamico) {
            mapaDinamico = document.createElement("div");
            mapaDinamico.innerHTML = `<h3>Mapa Dinámico</h3>`;
            mapaDinamico.classList.add("mapaDinamico");
            mapaDinamico.style.width = "90%";
            mapaDinamico.style.height = "30vh";
            ubicacion.appendChild(mapaDinamico);
        }
        if (this.latitud && this.longitud) {
            this.initMapaDinamico();
            mapaDinamico.classList.add("show");
        } else {
            setTimeout(() => this.initMapaDinamico(), 1000);
        }
    }

    initMapaDinamico() {
        if (!this.latitud || !this.longitud) {
            console.error("No se han obtenido las coordenadas para el mapa dinámico.");
            return;
        }
        const mapaDinamicoDiv = document.querySelector(".mapaDinamico");
        if (!mapaDinamicoDiv) {
            console.error("No se encuentra el div del mapa dinámico.");
            return;
        }
        var mapaGeoposicionado = new google.maps.Map(mapaDinamicoDiv, {
            zoom: 15,
            center: { lat: this.latitud, lng: this.longitud },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        var infoWindow = new google.maps.InfoWindow({
            content: "Estás aquí",
        });
        var marcador = new google.maps.Marker({
            position: { lat: this.latitud, lng: this.longitud },
            map: mapaGeoposicionado,
            title: "Tu ubicación",
        });
        marcador.addListener("click", function () {
            infoWindow.open(mapaGeoposicionado, marcador);
        });
    }
}
const viaje = new Viajes();

let currentIndex = 0;

function moverCarrusel(direction) {
    const images = document.querySelectorAll('section img');
    
    // Oculta la imagen actual
    images[currentIndex].style.display = 'none';
    
    // Calcula el siguiente índice
    currentIndex = (currentIndex + direction + images.length) % images.length;
    
    // Muestra la siguiente imagen
    images[currentIndex].style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('button[onclick="moverCarrusel(-1)"]');
    const nextButton = document.querySelector('button[onclick="moverCarrusel(1)"]');
    
    prevButton.addEventListener('click', () => moverCarrusel(-1));
    nextButton.addEventListener('click', () => moverCarrusel(1));

    // Muestra la primera imagen al inicio
    const images = document.querySelectorAll('section img');
    if (images.length > 0) {
        images[0].style.display = 'block';
    }
});