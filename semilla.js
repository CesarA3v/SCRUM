const apiKey = "02ba7131593e4ca693044700243011";  // Tu clave API de WeatherAPI

// Función para obtener el clima por ubicación actual
function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Hacer visible el contenedor de datos del clima mientras se cargan
                document.getElementById("weatherResult").style.display = 'block';  // Hacer visible el div de clima
                document.getElementById("weatherResult").innerHTML = `<p>Cargando datos...</p>`;

                // Ocultar el div de sugerencias de cultivos hasta que se muestren los datos
                document.getElementById("cropSuggestions").style.display = 'none';
                document.getElementById("cropSuggestions").innerHTML = ''; // Limpiar sugerencias previas

                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&lang=es`;
                fetchWeather(url);  // Llamar a la función que obtiene el clima
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
                const current = data.current;
                const location = data.location;

                // Mostrar los datos del clima
                document.getElementById("weatherResult").innerHTML = `
                    <h3>${location.name}, ${location.country}</h3>
                    <p><strong>Última actualización:</strong> ${forecast.date}</p>
                    <p><strong>Condición:</strong> ${forecast.day.condition.text}</p>
                    <p><strong>Temperatura actual:</strong> ${current.temp_c} °C (${current.temp_f} °F)</p>
                    <p><strong>Humedad:</strong> ${forecast.day.avghumidity}%</p>
                `;

                // Hacer visible el contenedor de sugerencias de cultivos
                document.getElementById("cropSuggestions").style.display = 'block'; 
                suggestCrops(current.temp_c, forecast.day.avghumidity, document.getElementById("soilType").value);
            }
        })
        .catch((err) => {
            document.getElementById("weatherResult").innerHTML = `<p>Hubo un error al obtener los datos. Intenta de nuevo más tarde.</p>`;
            console.error(err);
        });
}

// Función para sugerir cultivos según el clima y tipo de suelo
function suggestCrops(temperature, humidity, soilType) {
    let suggestedCrops = [];

    // Calcular la tasa de éxito para cada cultivo basado en condiciones
    const crops = [
        { name: "Maíz", icon: "🌽", tempRange: [18, 30], humidityRange: [50, 80], soilType: "arcilloso", baseSuccess: 80 },
        { name: "Tomate", icon: "🍅", tempRange: [20, 30], humidityRange: [60, 80], soilType: "arenoso", baseSuccess: 85 },
        { name: "Frijol", icon: "🌱", tempRange: [20, 30], humidityRange: [50, 70], soilType: "limoso", baseSuccess: 75 },
        { name: "Arroz", icon: "🍚", tempRange: [22, 35], humidityRange: [70, 90], soilType: "arcilloso", baseSuccess: 70 },
        { name: "Lechuga", icon: "🥬", tempRange: [15, 22], humidityRange: [60, 80], soilType: "limoso", baseSuccess: 80 },
        { name: "Cebolla", icon: "🧅", tempRange: [18, 25], humidityRange: [50, 70], soilType: "arenoso", baseSuccess: 70 },
        { name: "Zanahoria", icon: "🥕", tempRange: [15, 22], humidityRange: [50, 60], soilType: "limoso", baseSuccess: 80 },
        { name: "Espárragos", icon: "🌿", tempRange: [10, 20], humidityRange: [50, 70], soilType: "limoso", baseSuccess: 60 },
        { name: "Pepino", icon: "🥒", tempRange: [22, 30], humidityRange: [60, 80], soilType: "arenoso", baseSuccess: 75 },
        { name: "Acelgas", icon: "🌿", tempRange: [15, 25], humidityRange: [50, 70], soilType: "arcilloso", baseSuccess: 65 },
        { name: "Berenjena", icon: "🍆", tempRange: [20, 30], humidityRange: [60, 80], soilType: "arenoso", baseSuccess: 70 }
    ];

    // Evaluar cada cultivo y su tasa de éxito
    crops.forEach(crop => {
        const tempSuccess = calculateTemperatureSuccess(temperature, crop.tempRange);
        const humiditySuccess = calculateHumiditySuccess(humidity, crop.humidityRange);
        const soilSuccess = calculateSoilSuccess(soilType, crop.soilType);

        const cropSuccess = (tempSuccess + humiditySuccess + soilSuccess) / 3;

        // Solo agregar cultivos con tasa de éxito mayor a 30% para mantener la relevancia
        if (cropSuccess >= 30) {
            suggestedCrops.push({ name: crop.name, successRate: cropSuccess, icon: crop.icon });
        }
    });

    // Ordenar los cultivos por tasa de éxito de mayor a menor
    suggestedCrops.sort((a, b) => b.successRate - a.successRate);

    displayCropSuggestions(suggestedCrops);
}

// Función para mostrar las sugerencias de cultivos
function displayCropSuggestions(crops) {
    const cropSuggestionsDiv = document.getElementById("cropSuggestions");
    cropSuggestionsDiv.innerHTML = "";  // Limpiar las sugerencias anteriores

    // Mostrar cada cultivo y su tasa de éxito
    crops.forEach(crop => {
        const cropElement = document.createElement("li");
        cropElement.classList.add("crop-element");  // Agregar la clase para el borde dinámico

        const successRate = crop.successRate;
        let color = getColorForSuccess(successRate);

        cropElement.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="crop-icon">${crop.icon}</div>
                <div class="flex-grow-1">
                    <span class="crop-name">${crop.name}</span>
                    <div class="success-rate">Tasa de éxito: ${successRate.toFixed(2)}%</div>
                    <div class="success-bar">
                        <div class="success-fill" style="width: ${successRate}%; background-color: ${color};"></div>
                    </div>
                </div>
            </div>
        `;
        cropSuggestionsDiv.appendChild(cropElement);
    });
}

// Función para obtener el color correspondiente a la tasa de éxito
function getColorForSuccess(successRate) {
    if (successRate >= 90) return "#2C6B2F";        // Verde oscuro (90-100%)
    if (successRate >= 70) return "#4CAF50";        // Verde brillante (70-89%)
    if (successRate >= 50) return "#FFB300";        // Amarillo dorado (50-69%)
    if (successRate >= 30) return "#FF5722";        // Naranja fuerte (30-49%)
    return "#D32F2F";                               // Rojo oscuro (0-29%)
}

// Función para calcular la tasa de éxito de la temperatura para cada cultivo
function calculateTemperatureSuccess(temperature, tempRange) {
    if (temperature >= tempRange[0] && temperature <= tempRange[1]) {
        return 100;  // Tasa de éxito máxima si está en el rango ideal
    } else if (temperature >= tempRange[0] - 5 && temperature <= tempRange[1] + 5) {
        return 70;  // Tasa de éxito moderada si está cerca del rango ideal
    } else {
        return 40;  // Baja tasa de éxito si está fuera de los rangos ideales
    }
}

// Función para calcular la tasa de éxito de la humedad para cada cultivo
function calculateHumiditySuccess(humidity, humidityRange) {
    if (humidity >= humidityRange[0] && humidity <= humidityRange[1]) {
        return 100;  // Tasa de éxito máxima si está en el rango ideal
    } else if (humidity >= humidityRange[0] - 10 && humidity <= humidityRange[1] + 10) {
        return 70;  // Tasa de éxito moderada si está cerca del rango ideal
    } else {
        return 40;  // Baja tasa de éxito si está fuera de los rangos ideales
    }
}

// Función para calcular la tasa de éxito de acuerdo con el tipo de suelo
function calculateSoilSuccess(soilType, cropSoilType) {
    return soilType === cropSoilType ? 100 : 50;  // 100% si el tipo de suelo coincide, 50% si no
}
