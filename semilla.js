// Crop description dictionary with detailed information
const cropDescriptions = {
    "Trigo": {
        description: "El trigo es un cultivo estratégico en Chihuahua, adaptado a climas semi-áridos. Es fundamental para la seguridad alimentaria y la economía agrícola de la región. Temperatura promedio durante el ciclo del cultivo:10°C – 25°C, Cantidad de lluvia necesaria para el desarrollo del cultivo: 300 – 600 mm, Zonas recomendadas según la altitud sobre el nivel del mar: 500 – 2,500 msnm, Estaciones de siembra: Otoño e invierno. Cotizacion: $4.85 KG",
        benefits: [
            "Alto valor nutricional",
            "Resistente a sequías moderadas",
            "Importante para la industria alimentaria local"
        ],
        challengeTips: "Requiere rotación de cultivos y control preciso de riego para mantener su productividad."
    },
    "Algodón": {
        description: "El algodón es un cultivo industrial clave en Chihuahua, conocido por su adaptabilidad a suelos áridos y su importancia económica. Temperatura promedio durante el ciclo del cultivo: 25°C - 35°C, Cantidad de lluvia necesaria para el desarrollo del cultivo': '400 - 700 mm',Zonas recomendadas según la altitud sobre el nivel del mar: '200 - 1,200 msnm, Fechas recomendadas para la siembra: Primavera (cuando el clima es cálido). Cotizacion: $36.53 KG",
        benefits: [
            "Materia prima para textiles",
            "Buena resistencia al calor",
            "Fuente importante de ingreso para agricultores"
        ],
        challengeTips: "Necesita control de plagas y un manejo cuidadoso del agua durante su crecimiento, Evitar temperaturas <10°C."
    },
    "Alfalfa": {
        description: "La alfalfa es un forraje crucial para la ganadería de Chihuahua, destacando por su alto valor nutritivo y adaptabilidad. Rango de temperaturas ideales: '18°C - 28°C, Cantidad de lluvia necesaria para el desarrollo del cultivo: '400 - 600 mm, Zonas recomendadas según la altitud sobre el nivel del mar: '1,000 - 2,500 msnm,Fechas recomendadas para la siembra: Primavera o otoño, Cotizacion: $2.50 KG",
        benefits: [
            "Excelente para alimentación ganadera",
            "Alta eficiencia en el uso del agua",
            "Mejora la salud del suelo"
        ],
        challengeTips: "Requiere un sistema de riego eficiente y rotación con otros cultivos. Evitar temperaturas <5°C'"
    },
    "Nuez": {
        description: "Los huertos de nuez en Chihuahua son reconocidos mundialmente por su calidad y son un cultivo de alto valor económico. Rango de temperaturas ideales:18°C - 30°C, Cantidad de lluvia necesaria para el desarrollo del cultivo.: 400 - 600 mm, Zonas recomendadas según la altitud sobre el nivel del mar: '1,000 - 2,000 msnm, Estación de siembra: Primavera. Cotizacion: $42.50 KG",
        benefits: [
            "Alto valor de exportación",
            "Cultivo perenne con larga vida productiva",
            "Resistente a condiciones climáticas variadas"
        ],
        challengeTips: "Necesita inversión inicial alta y cuidados específicos durante el establecimiento del huerto, Evitar temperaturas <0°C."
    },
    "Jalapeño": {
        description: "El chile jalapeño es un orgullo de la agròcultura chihuahuense, conocido por su sabor intenso y versatilidad culinaria. Rango de temperaturas ideales: 20°C - 30°C, Cantidad de lluvia necesaria para el desarrollo del cultivo: '500 - 700 mm, Zonas recomendadas según la altitud sobre el nivel del mar': '500 - 2,000 msnm, Estación de siembra: Primavera o Verano. Cotizacion: $30.00 KG",
        benefits: [
            "Alto valor en mercados nacionales e internacionales",
            "Adaptable a diferentes microclimas",
            "Demanda constante en la industria alimentaria"
        ],
        challengeTips: "Sensible a cambios bruscos de temperatura, requiere monitoreo constante. Evitar temperaturas <5°C'"
    },
    "Avena": {
        description: "La avena es un cultivo versátil en Chihuahua, importante tanto para consumo humano como para la alimentación ganadera. Temperatura promedio durante el ciclo del cultivo: '10°C - 24°, Cantidad de lluvia necesaria para el desarrollo del cultivo: '600 - 800 mm. Zonas recomendadas según la altitud sobre el nivel del mar: '1,000 - 3,000 msnm', Fechas recomendadas para aprovechar lluvias o riego: 'Otoño o invierno', Cotizacion: 70$ por KG.",
        benefits: [
            "Excelente para rotación de cultivos",
            "Bajo costo de producción",
            "Múltiples usos alimenticios"
        ],
        challengeTips: "Prefiere climas más frescos y requiere un manejo preciso de la humedad del suelo. Evitar temperaturas <5°C"
    },
    "Cacahuate": {
        description: "El cacahuate es un cultivo tradicional en Chihuahua, apreciado por su adaptabilidad y valor nutricional. Temperatura promedio durante el ciclo del cultivo:20°C – 30°C, Cantidad de lluvia necesaria para el desarrollo del cultivo: 500 – 1,200 mm, Zonas recomendadas según la altitud sobre el nivel del mar: 200 – 1,500 msnm, Estaciones de siembra: Primavera, al inicio de la temporada de lluvias. Cotizacion: $24.00 KG.",
        benefits: [
            "Rico en proteínas y grasas saludables",
            "Buen cultivo para suelos arenosos",
            "Importante para la economía agrícola local"
        ],
        challengeTips: "Requiere suelos bien drenados y un control cuidadoso de la humedad."
    },
    "Manzana Roja": {
        description: "Los huertos de manzana de Chihuahua son famosos por su calidad, especialmente en regiones como Cuauhtémoc. Temperatura promedio durante el ciclo del cultivo: '18°C - 24°C, Cantidad de lluvia necesaria para el desarrollo del cultivo: 600 - 1,200 mm, Zonas recomendadas según la altitud sobre el nivel del mar: '1,500 - 2,500 msnm', Fechas recomendadas para la plantación de árboles jóvenes: Invierno (dormancia). Cotizacion: $14 KG.",
        benefits: [
            "Alta demanda en mercados nacionales",
            "Cultivo de alto valor económico",
            "Excelente para exportación"
        ],
        challengeTips: "Necesita un periodo de frío específico y protección contra heladas tardías, Evitar heladas durante la floración y formación del fruto."
    }
};

const apiKey = "02ba7131593e4ca693044700243011";  // Tu clave API de WeatherAPI

// Función para obtener el clima por ubicación actual
function getWeatherByCurrentLocation() {
    // Cambiar el texto del botón a "Cargando..." y deshabilitarlo mientras se obtiene la ubicación
    const locationButton = document.querySelector(".btn");
    locationButton.innerHTML = "Cargando...";
    locationButton.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Hacer visible el contenedor de datos del clima mientras se cargan
                document.getElementById("weatherResult").style.display = 'block';  // Hacer visible el div de clima
                document.getElementById("weatherResult").innerHTML = `
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Cargando...</span>
                    </div>
                    <p>Cargando datos...</p>
                `;

                // Ocultar el div de sugerencias de cultivos hasta que se muestren los datos
                document.getElementById("cropSuggestions").style.display = 'none';
                document.getElementById("cropSuggestions").innerHTML = ''; // Limpiar sugerencias previas

                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&lang=es`;
                fetchWeather(url);  // Llamar a la función que obtiene el clima
            },
            (error) => {
                alert("No se pudo obtener tu ubicación. Asegúrate de que la geolocalización está habilitada.");

                // Restaurar el estado del botón en caso de error
                const locationButton = document.querySelector(".btn");
                locationButton.innerHTML = "Usar ubicación actual";
                locationButton.disabled = false;
            }
        );
    } else {
        alert("Tu navegador no soporta geolocalización.");

        // Restaurar el estado del botón en caso de que la geolocalización no sea soportada
        const locationButton = document.querySelector(".btn");
        locationButton.innerHTML = "Usar ubicación actual";
        locationButton.disabled = false;
    }
}

// Función para realizar la solicitud y mostrar los resultados del clima
function fetchWeather(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Restaurar el estado del botón después de la solicitud
            const locationButton = document.querySelector(".btn");
            locationButton.innerHTML = "Usar ubicación actual";
            locationButton.disabled = false;

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
            // Restaurar el estado del botón después de la solicitud
            const locationButton = document.querySelector(".btn");
            locationButton.innerHTML = "Usar ubicación actual";
            locationButton.disabled = false;

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
    
    crops.forEach(crop => {
        const cropElement = document.createElement("li");
        cropElement.classList.add("crop-element");  // Agregar la clase para el borde dinámico

        const successRate = crop.successRate;
        let color = getColorForSuccess(successRate);
        
        cropElement.innerHTML = `
            <div class="d-flex align-items-center" id="miDiv">
                <div class="crop-icon">${crop.icon}</div>
                <div class="flex-grow-1">
                    <span class="crop-name">${crop.name}</span>
                    <div class="success-rate">Tasa de éxito: ${successRate.toFixed(2)}%</div>
                    <div class="success-bar">
                        <div class="success-fill" style="width: ${successRate}%; background-color: ${color};"></div>
                    </div>
                </div>
            </div>
            <div class="crop-details" style="display: none; padding: 10px; background-color: #f8f9fa; border-radius: 5px; margin-top: 10px;">
                <h5>Detalles del Cultivo</h5>
                <p><strong>Descripción:</strong> ${cropDescriptions[crop.name].description}</p>
                <div class="row">
                    <div class="col-md-6">
                        <h6>Beneficios</h6>
                        <ul>
                            ${cropDescriptions[crop.name].benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6>Consejos de Cultivo</h6>
                        <p>${cropDescriptions[crop.name].challengeTips}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to toggle details
        cropElement.addEventListener('click', function() {
            const detailsDiv = this.querySelector('.crop-details');
            detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
        });

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