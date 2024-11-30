const apiKey = "02ba7131593e4ca693044700243011";  // Tu clave API de WeatherAPI

// Inicializar el mapa con Leaflet.js
var map = L.map('map').setView([28.6322, -106.0794], 13);  // Iniciar en Chihuahua por defecto

// Agregar capa de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Crear un marcador global
var marker;

// Función para obtener el clima por ciudad
function getWeatherByCity(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=es`;
    fetchWeather(url);
}

// Función para obtener el clima por ubicación actual
function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Centrar el mapa en la ubicación actual y agregar un marcador
                map.setView([lat, lon], 13);

                if (marker) {
                    marker.setLatLng([lat, lon]);
                } else {
                    marker = L.marker([lat, lon]).addTo(map);
                }

                const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=es`;

                fetchWeather(url);
            },
            (error) => {
                alert("No se pudo obtener tu ubicación. Asegúrate de que la geolocalización está habilitada.");
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");
    }
}

// Función para realizar la solicitud y mostrar los resultados del clima
function fetchWeather(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("weatherResult").innerHTML = `<p>No se pudo obtener el clima. Intenta de nuevo.</p>`;
            } else {
                const weather = data.current;
                const location = data.location;

                document.getElementById("weatherResult").innerHTML = ` 
                    <h3>${location.name}, ${location.country}</h3>
                    <p><strong>Condición:</strong> ${weather.condition.text}</p>
                    <p><strong>Temperatura:</strong> ${weather.temp_c} °C</p>
                    <p><strong>Humedad:</strong> ${weather.humidity}%</p>
                    <p><strong>Viento:</strong> ${weather.wind_kph} km/h</p>
                    <p><strong>Presión atmosférica:</strong> ${weather.pressure_mb} mb</p>
                    <p><strong>Punto de Rocío:</strong> ${weather.dewpoint_c} °C</p>
                    <p><strong>Visibilidad:</strong> ${weather.vis_km} km</p>
                `;
            }
        })
        .catch((err) => {
            document.getElementById("weatherResult").innerHTML = `<p>Hubo un error al obtener los datos. Intenta de nuevo más tarde.</p>`;
        });
}

// Función para permitir la búsqueda de ubicación en el mapa
var geocoder = L.Control.Geocoder.nominatim();

// Permitir búsqueda de ubicación en el mapa (input de búsqueda)
document.getElementById("cityInput").addEventListener("input", function() {
    var city = document.getElementById("cityInput").value;
    if (city.length >= 3) {
        geocoder.geocode(city, function(results) {
            if (results.length > 0) {
                var latLon = results[0].center;
                map.setView(latLon, 13);
                if (marker) {
                    marker.setLatLng(latLon);
                } else {
                    marker = L.marker(latLon).addTo(map);
                }
                getWeatherByCity(city);
            }
        });
    }
});

// Agregar un evento de clic en el mapa
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    // Obtener el zoom actual del mapa
    const currentZoom = map.getZoom();

    // Hacer zoom solo un poco al hacer clic
    const newZoom = currentZoom + 1; // Aumentar el zoom en 1 unidad

    // Centrar el mapa en la ubicación clickeada y hacer zoom suavemente
    map.setView([lat, lon], newZoom, { animate: true });

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }

    // Obtener el clima de la ubicación clickeada
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=es`;
    fetchWeather(url);
});
