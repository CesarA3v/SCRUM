const porcentajeInput = document.getElementById('porcentaje');
const mensajeDiv = document.getElementById('mensaje');

porcentajeInput.addEventListener('input', actualizarMensaje);

function actualizarMensaje() {
    const porcentaje = parseInt(porcentajeInput.value);
    let mensaje = '';

    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        mensaje = 'Actualmente no contamos con agua disponible, lo cual imposibilita continuar con nuestras actividades como de costumbre.';
    } else if (porcentaje < 10) {
        mensaje = 'La cantidad de agua disponible es muy crítica y esto está afectando seriamente nuestras actividades. Es urgente que implementemos medidas inmediatas para conservar agua y buscar alternativas que nos ayuden a sobrellevar este período.';
    } else if (porcentaje < 20) {
        mensaje = 'La disponibilidad de agua está empezando a disminuir, y esto podría afectar nuestras operaciones.';
    } else if (porcentaje < 50) {
        mensaje = 'Parece que estamos en un punto medio; no tenemos exceso, pero tampoco estamos escasos. Sería prudente empezar a gestionar nuestros recursos hídricos de manera más eficiente para asegurar que no enfrentemos problemas más adelante.';
    } else if (porcentaje < 70) {
        mensaje = 'He notado que, aunque tenemos suficiente agua por ahora, no es tan abundante como en otras ocasiones. Sería bueno considerar formas de optimizar su uso y quizás pensar en estrategias para conservar agua por si las condiciones cambian';
    } else {
        mensaje = 'En este momento tenemos abundancia de agua, lo cual es excelente para nuestras actividades agrícolas/ganaderas. Creo que podríamos aprovechar esta oportunidad para implementar prácticas que nos ayuden a almacenar agua y prepararnos para posibles períodos de sequía en el futuro.';
    }

    mensajeDiv.textContent = mensaje;
}
