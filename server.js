const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir el archivo HTML
app.use(express.static(__dirname)); // Asegúrate de que el archivo HTML esté en la misma carpeta que server.js

// Configuración del puerto serial
const port = new SerialPort({
  path: 'COM5', // Cambia por el puerto de tu Arduino
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Leer datos del puerto serial y enviarlos al cliente
parser.on('data', (data) => {
  console.log(`Datos recibidos: ${data}`);
  io.emit('arduinoData', data); // Enviar los datos al cliente
});

// Manejo de errores del puerto serial
port.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
