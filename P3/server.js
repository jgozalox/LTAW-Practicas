//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('<p style = "text-align: center; margin-top: 20%;">¡Bienvenid@! </p>' + '<p style = "text-align: center; vertical-align: middle;"><a href="/chat.html">Entrar al chat</a></p>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    if (msg == "/help"){
      socket.send("</p>" + "/help: Mostrará una lista con todos los comandos soportados" + "</p>" 
                         + "/list: Devolverá el número de usuarios conectados" + "</p>" 
                         + "/hello: El servidor nos devolverá el saludo" + "</p>" 
                         +"/date: Nos devolverá la fecha" + "</p>");
    } else if (msg == "/list") {
      socket.send("Número de usuarios conectados");
    } else if (msg == "/hello") {
      socket.send("Hola, soy el servidor!");
    } else if (msg == "/date") {
      socket.send("Fecha");
    } else if (msg.startsWith("/")) {
      socket.send("No se reconoce el comando");
    } else {
      //-- Reenviarlo a todos los clientes conectados
      io.send(msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);