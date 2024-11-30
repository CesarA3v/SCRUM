const apiKey = "02ba7131593e4ca693044700243011";  // Tu clave API de WeatherAPI

// Variables globales para almacenar los datos de pronóstico
let precipitaciones = []; // mm
let tempMax = []; // °C
let tempMin = []; // °C
let humedad = []; // %

let capacidadAcuifero; // Capacidad total del acuífero en mm
let porcentajeLleno; // Porcentaje de lo lleno del acuífero (0-100)
let diasPronosticados; // Número de días a pronosticar

// Función para calcular la evaporación diaria (en mm)
function calcularEvaporacion(tempMax, tempMin, humedadMedia) {
    const temperaturaMedia = (tempMax + tempMin) / 2; // Promedio de la temperatura
    const coeficienteEvaporacion = 0.05; // Coeficiente de evaporación ajustable
    return temperaturaMedia * (humedadMedia / 100) * coeficienteEvaporacion;
}

// Función para calcular el nivel del acuífero
function calcularNivelAguas(precipitacion, evaporacion, escorrentia, nivelActual) {
    const cambioNivel = precipitacion - (evaporacion + escorrentia);
    return nivelActual + cambioNivel;
}

// Función para diagnosticar la cantidad de agua en el acuífero
function diagnosticarNivelAcuifero() {
    let nivelActual = capacidadAcuifero * (porcentajeLleno / 100); // Nivel inicial en mm
    let resultadoHTML = `<h3>Pronóstico del Nivel del Acuífero</h3>`;

    for (let dia = 0; dia < diasPronosticados; dia++) {
        let precipitacion = precipitaciones[dia];
        let temperaturaMax = tempMax[dia];
        let temperaturaMin = tempMin[dia];
        let humedadMedia = humedad[dia];

        // Calcular la evaporación usando la humedad media
        let evaporacion = calcularEvaporacion(temperaturaMax, temperaturaMin, humedadMedia);

        // Asumimos un 30% de escorrentía (porcentaje de agua que no es absorbido por el acuífero)
        let escorrentia = precipitacion * 0.3;

        // Calcular el nuevo nivel del acuífero
        nivelActual = calcularNivelAguas(precipitacion, evaporacion, escorrentia, nivelActual);

        // Mostrar el pronóstico del nivel del acuífero para el día
        resultadoHTML += `<p>Día ${dia + 1}: Nivel del acuífero: ${nivelActual.toFixed(2)} mm</p>`;
    }

    document.getElementById("pronostico").innerHTML = resultadoHTML;
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
