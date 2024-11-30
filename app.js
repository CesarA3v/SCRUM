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
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&lang=es&hour=1`;  // Solicitar pronóstico de 1 día con datos por hora
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

                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&lang=es&hour=1`;  // Solicitar pronóstico de 1 día con datos por hora

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
                const forecast = data.forecast.forecastday[0];  // Accede al primer día del pronóstico
                const current = data.current;  // Datos actuales
                const location = data.location;
                
                // Información del viento actual
                const currentWind = current.wind_kph;  // Velocidad del viento actual en km/h
                const currentWindDir = current.wind_dir;  // Dirección del viento

                // Información por hora (obteniendo el viento en la hora actual)
                const currentHour = data.forecast.forecastday[0].hour[0];  // Datos de la primera hora del pronóstico
                const windHour = currentHour.wind_kph;  // Viento en km/h de esa hora
                const windDirHour = currentHour.wind_dir;  // Dirección del viento de esa hora

                // Mostrar la información actualizada en el HTML
                document.getElementById("weatherResult").innerHTML = ` 
                    <h3>${location.name}, ${location.country}</h3>
                    <p><strong>Última actualización:</strong> ${forecast.date}</p>
                    <p><strong>Condición:</strong> ${forecast.day.condition.text}</p>
                    
                    <!-- Temperatura actual -->
                    <p><strong>Temperatura actual:</strong> ${current.temp_c} °C (${current.temp_f} °F)</p>

                    <!-- Temperaturas máxima y mínima -->
                    <p><strong>Temperatura máxima:</strong> ${forecast.day.maxtemp_c} °C (${forecast.day.maxtemp_f} °F)</p>
                    <p><strong>Temperatura mínima:</strong> ${forecast.day.mintemp_c} °C (${forecast.day.mintemp_f} °F)</p>
                    
                    <!-- Humedad -->
                    <p><strong>Humedad promedio:</strong> ${forecast.day.avghumidity}%</p>
                    
                    <!-- Precipitación -->
                    <p><strong>Precipitación total:</strong> ${forecast.day.totalprecip_mm} mm (${forecast.day.totalprecip_in} in)</p>
                    
                    <!-- Otros detalles -->
                    <p><strong>Viento máximo:</strong> ${forecast.day.maxwind_kph} km/h (${forecast.day.maxwind_mph} mph)</p>
                    <p><strong>Visibilidad promedio:</strong> ${forecast.day.avgvis_km} km (${forecast.day.avgvis_miles} miles)</p>
                    <p><strong>Índice UV:</strong> ${forecast.day.uv}</p>
                    <p><strong>Probabilidad de lluvia:</strong> ${forecast.day.daily_chance_of_rain}%</p>
                    <p><strong>Probabilidad de nieve:</strong> ${forecast.day.daily_chance_of_snow}%</p>

                    <!-- Viento actual y viento en la hora -->
                    <p><strong>Viento actual:</strong> ${currentWind} km/h, Dirección: ${currentWindDir}</p>
                    <p><strong>Viento en la hora actual:</strong> ${windHour} km/h, Dirección: ${windDirHour}</p>
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
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&lang=es&hour=1`;  // Solicitar pronóstico de 1 día con datos por hora
    fetchWeather(url);
});
