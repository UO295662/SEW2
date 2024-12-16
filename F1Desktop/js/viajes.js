"use strict";

class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(
            this.getPosicion.bind(this),
            this.verErrores.bind(this)
        );
        document.addEventListener("DOMContentLoaded", () => {
            this.initCarrusel();
        });
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

    verTodo() {
        const ubicacion = document.querySelector('section');;
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

    getMapaEstaticoGoogle() {
        let mapaEstatico = document.querySelector("article:nth-of-type(1)");
        if (!mapaEstatico) {
            mapaEstatico = document.createElement("article:nth-of-type(1)");
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

    getMapaDinamico() {
        const ubicacion = document.querySelector('section');;
        if (!ubicacion) {
            console.error("No se encuentra el contenedor para el mapa dinámico.");
            return;
        }
        let mapaDinamico = document.querySelector("section div");
        if (!mapaDinamico) {
            mapaDinamico = document.createElement("div");
            mapaDinamico.innerHTML = `<h3>Mapa Dinámico</h3>`;
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
        const mapaDinamicoDiv = document.querySelector("section div");
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
    initCarrusel() {
    const slides = document.querySelectorAll("img");
    const nextSlide = document.querySelector("button:nth-of-type(2)");
    const prevSlide = document.querySelector("button:nth-of-type(1)");

    let curSlide = 0;
    const maxSlide = slides.length - 1;

    nextSlide.addEventListener("click", function () {
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
        });
    });

    prevSlide.addEventListener("click", function () {
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
        });
    });
    }
}
const viaje = new Viajes();
