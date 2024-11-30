const apiKey = "02ba7131593e4ca693044700243011";  // Tu clave API de WeatherAPI

// Variables globales para almacenar los datos de pronóstico
let precipitaciones = []; // mm
let tempMax = []; // °C
let tempMin = []; // °C
let humedad = []; // %

let capacidadAcuifero; // Capacidad total del acuífero en mm
let porcentajeLleno; // Porcentaje de lo lleno del acuífero (0-100)
let diasPronosticados; // Número de días a pronosticar
let eficienciaAbsorcion = 0.8; // Eficiencia de absorción base del acuífero

// Función para calcular la evaporación ajustada por sequía (en mm)
function calcularEvaporacion(tempMax, tempMin, humedadMedia) {
    const temperaturaMedia = (tempMax + tempMin) / 2; // Promedio de la temperatura
    const coefEvaporacionBase = 0.05; // Coeficiente base de evaporación
    const factorSequía = 1 + (100 - humedadMedia) / 100; // Factor de ajuste por falta de humedad (más sequía = más evaporación)
    return temperaturaMedia * (humedadMedia / 100) * coefEvaporacionBase * factorSequía;
}

// Función para calcular la escorrentía ajustada por sequía
function calcularEscorrentia(precipitacion, humedadMedia) {
    // A mayor humedad, menor es la escorrentía
    const escorrentiaBase = 0.05;  // Escorrentía base para condiciones normales
    const factorSequía = 0.25 * (100 - humedadMedia) / 100; // A mayor sequía, mayor escorrentía
    return precipitacion * (escorrentiaBase + factorSequía);
}

// Función para calcular la absorción ajustada por sequía
function calcularAbsorcion(precipitacion, humedadMedia) {
    // A menor humedad, menor es la absorción
    return precipitacion * (eficienciaAbsorcion * (1 - humedadMedia / 100));
}

// Función para calcular el nivel del acuífero ajustado por sequía
function calcularNivelAguas(precipitacion, evaporacion, escorrentia, nivelActual, humedadMedia) {
    const absorcion = calcularAbsorcion(precipitacion, humedadMedia);  // Solo se absorbe una parte de la precipitación
    const cambioNivel = absorcion - (evaporacion + escorrentia);  // El nivel cambia según la absorción
    return nivelActual + cambioNivel;
}

// Función para diagnosticar la cantidad de agua en el acuífero
function diagnosticarNivelAcuifero() {
    let nivelActual = capacidadAcuifero * (porcentajeLleno / 100); // Nivel inicial en mm
    const dias = [];
    const niveles = [];

    // Limpiar la lista de pronósticos antes de insertar los nuevos resultados
    const listaPronostico = document.getElementById("listaPronostico");
    listaPronostico.innerHTML = "";

    for (let dia = 0; dia < diasPronosticados; dia++) {
        let precipitacion = precipitaciones[dia];
        let temperaturaMax = tempMax[dia];
        let temperaturaMin = tempMin[dia];
        let humedadMedia = humedad[dia];

        // Calcular la evaporación ajustada por sequía
        let evaporacion = calcularEvaporacion(temperaturaMax, temperaturaMin, humedadMedia);

        // Calcular la escorrentía ajustada por sequía
        let escorrentia = calcularEscorrentia(precipitacion, humedadMedia);

        // Calcular el nuevo nivel del acuífero
        nivelActual = calcularNivelAguas(precipitacion, evaporacion, escorrentia, nivelActual, humedadMedia);

        // Agregar los resultados para la lista de pronósticos
        dias.push(`Día ${dia + 1}`);
        niveles.push(nivelActual.toFixed(2));

        // Lista resumen
        const item = document.createElement("li");
        item.textContent = `Día ${dia + 1}: Nivel estimado de agua es ${nivelActual.toFixed(2)} mm`;
        listaPronostico.appendChild(item);
    }

    // Verificar que hay datos antes de crear el gráfico
    if (niveles.length > 0) {
        const ctx = document.getElementById('graficoPronostico').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dias,
                datasets: [{
                    label: 'Nivel de Agua del Acuífero (mm)',
                    data: niveles,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }]
            }
        });
    } else {
        console.error("No se han generado datos válidos para el gráfico.");
    }
}

// Función para obtener los datos del clima
function obtenerDatosClima(ciudad) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=${diasPronosticados}&lang=es`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Extraemos los datos de la API
            precipitaciones = [];
            tempMax = [];
            tempMin = [];
            humedad = [];

            for (let i = 0; i < diasPronosticados; i++) {
                precipitaciones.push(data.forecast.forecastday[i].day.totalprecip_mm);
                tempMax.push(data.forecast.forecastday[i].day.maxtemp_c);
                tempMin.push(data.forecast.forecastday[i].day.mintemp_c);
                humedad.push(data.forecast.forecastday[i].day.avghumidity);
            }
            diagnosticarNivelAcuifero(); // Diagnóstico después de obtener los datos
        })
        .catch(err => {
            console.error("Error al obtener los datos: ", err);
        });
}

// Función para tomar entrada del usuario y configurar los parámetros del acuífero
document.getElementById("form-acuifero").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir recarga de la página
    const ciudad = document.getElementById("ciudad").value;
    capacidadAcuifero = parseFloat(document.getElementById("capacidadAcuifero").value);
    porcentajeLleno = parseFloat(document.getElementById("porcentajeLleno").value);
    diasPronosticados = parseInt(document.getElementById("diasPronostico").value);

    obtenerDatosClima(ciudad); // Iniciar el cálculo después de tomar los datos
});
