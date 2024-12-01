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

    // Definir los cultivos comunes en Chihuahua con parámetros más realistas
    const crops = [
        { name: "Trigo", icon: "🌾", tempRange: [10, 25], humidityRange: [50, 70], soilType: "arcilloso", baseSuccess: 90 },
        { name: "Algodón", icon: "🌿", tempRange: [20, 35], humidityRange: [40, 60], soilType: "arenoso", baseSuccess: 80 },
        { name: "Alfalfa", icon: "🌱", tempRange: [15, 30], humidityRange: [40, 70], soilType: "limoso", baseSuccess: 85 },
        { name: "Nuez", icon: "🌰", tempRange: [10, 25], humidityRange: [60, 80], soilType: "arcilloso", baseSuccess: 75 },
        { name: "Jalapeño", icon: "🌶️", tempRange: [20, 35], humidityRange: [50, 70], soilType: "arenoso", baseSuccess: 85 },
        { name: "Avena", icon: "🌾", tempRange: [10, 20], humidityRange: [60, 80], soilType: "limoso", baseSuccess: 90 },
        { name: "Cacahuate", icon: "🥜", tempRange: [20, 30], humidityRange: [50, 70], soilType: "arenoso", baseSuccess: 80 },
        { name: "Manzana Roja", icon: "🍎", tempRange: [15, 25], humidityRange: [60, 80], soilType: "arcilloso", baseSuccess: 85 }
    ];

    // Evaluar cada cultivo y su tasa de éxito
    crops.forEach(crop => {
        const tempSuccess = calculateTemperatureSuccess(temperature, crop.tempRange);
        const humiditySuccess = calculateHumiditySuccess(humidity, crop.humidityRange);
        const soilSuccess = calculateSoilSuccess(soilType, crop.soilType);

        const cropSuccess = (tempSuccess + humiditySuccess + soilSuccess) / 3;

        // Solo agregar cultivos con tasa de éxito mayor a 30% para mantener la relevancia
        if (cropSuccess >= 30) {
            suggestedCrops.push({ name: crop.name, successRate: cropSuccess, icon: crop.icon, explanation: getExplanation(cropSuccess, tempSuccess, humiditySuccess, soilSuccess) });
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
            <div class="d-flex align-items-center" onclick="showExplanation('${crop.name}')">
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

// Función para mostrar la explicación al hacer clic en un cultivo
function showExplanation(cropName) {
    const crop = crops.find(c => c.name === cropName);
    const explanationText = document.getElementById("explanationText");
    explanationText.innerHTML = crop.explanation;
    
    document.getElementById("cropExplanation").style.display = 'block';  // Mostrar la explicación
}

// Función para obtener la explicación del cultivo
function getExplanation(cropSuccess, tempSuccess, humiditySuccess, soilSuccess) {
    let explanation = "Este cultivo tiene una tasa de éxito de " + cropSuccess.toFixed(2) + "%.";

    // Explicación de la tasa de éxito
    if (cropSuccess >= 80) {
        explanation += " Es un excelente cultivo para las condiciones actuales.";
    } else if (cropSuccess >= 50) {
        explanation += " Es un cultivo adecuado, aunque no ideal.";
    } else {
        explanation += " No es el mejor cultivo para estas condiciones.";
    }

    return explanation;
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
    const diff = Math.abs(temperature - (tempRange[0] + tempRange[1]) / 2);  // Desviación de la temperatura media
    if (diff <= 5) return 100;
    if (diff <= 10) return 80;
    if (diff <= 15) return 60;
    return 40;  // Baja tasa de éxito si la desviación es muy grande
}

// Función para calcular la tasa de éxito de la humedad para cada cultivo
function calculateHumiditySuccess(humidity, humidityRange) {
    const diff = Math.abs(humidity - (humidityRange[0] + humidityRange[1]) / 2);  // Desviación de la humedad media
    if (diff <= 5) return 100;
    if (diff <= 10) return 75;
    if (diff <= 15) return 50;
    return 30;  // Baja tasa de éxito si la desviación es muy grande
}

// Función para calcular la tasa de éxito de acuerdo con el tipo de suelo
function calculateSoilSuccess(soilType, cropSoilType) {
    return soilType === cropSoilType ? 100 : 50;  // 100% si el tipo de suelo coincide, 50% si no
}
