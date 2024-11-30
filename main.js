// Cambia el contenido del iframe al hacer clic en un botón del sidebar
function changeContent(url) {
    const iframe = document.getElementById('main-iframe');
    if (iframe) {
        console.log('Cambiando el contenido del iframe a:', url);
        iframe.src = url;
    } else {
        console.error('No se pudo encontrar el iframe con id "main-iframe".');
    }
}
