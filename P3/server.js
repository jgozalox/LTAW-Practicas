//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');

const PUERTO = 8080;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asociado a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- Nombre del fichero JSON a escribir
const FICHERO_JSON_OUT = "ids.json"

//-- Constante para la fecha
const tiempo = Date.now();
let fecha = "";

var h = "";
var m = "";

//--Numero de usuarios
let numUsuarios = 0;

//--Array identificadores
let identificadores = [];

//--Color letras
let colorLetras = "";
let posUser = "";

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

  colorLetras = "";
  posUser = "";

  var letters = '0123456789ABCD';
  var randomColor = '#';
  for (var i = 0; i < 6; i++) {
    randomColor += letters[Math.floor(Math.random() * 16)];
  }

  //--From http://stackoverflow.com/a/5365036/2065702
  randomColor = "#"+((1<<24)*Math.random()|0).toString(16); 
    
  fecha = new Date(tiempo);
  
  console.log('** NUEVA CONEXIÓN **'.yellow);

  //-- Mensaje de nuevo usuario conectado
  //io.send("¡Nuevo usuario conectado!");
  //-- Usuario conectado. Imprimir el identificador de su socket
  console.log('Socket id: ' + socket.id);

  //-- Añadir un usuario
  numUsuarios = numUsuarios++;
  console.log("Número de usuarios: " + numUsuarios);

     //--Almacenar en fichero json
     let identificador = { 
      socket_id: socket.id,
      color: randomColor,
      usuaio: "undefined"
    }
  
  identificadores.push(identificador)
  let data = JSON.stringify(identificadores);
  fs.writeFileSync(FICHERO_JSON_OUT, data);

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);

    if (numUsuarios > 0){
      numUsuarios = numUsuarios--;
      console.log("Número de usuarios: " + numUsuarios);
      //-- Mensaje de nuevo usuario desconectado
      io.send("¡Usuario desconectado!");
    }
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {

    for (let i = 0; i < identificadores.length; i++) {
      if(identificadores[i]["socket_id"].includes(socket.id)){
         colorLetras = identificadores[i]["color"];
         posUser = i;
      }
     }

    h = fecha.getHours();
    m = fecha.getMinutes();

    let hora = h+':'+m;
    console.log("Mensaje Recibido!: " + msg.blue);
    if (msg == "/help"){
      socket.send("</p>" + "/help: Mostrará una lista con todos los comandos soportados" + "</p>" 
                         + "/list: Devolverá el número de usuarios conectados" + "</p>" 
                         + "/hello: El servidor nos devolverá el saludo" + "</p>" 
                         +"/date: Nos devolverá la fecha" + "</p>");
    } else if (msg == "/list") {
      socket.send("Número de usuarios conectados: " + numUsuarios);
    } else if (msg == "/hello") {
      socket.send("Hola, soy el servidor!");
    } else if (msg == "/date") {
      //--Fecha en formato cadena
      socket.send(fecha.toDateString());
    } else if (msg.startsWith("/")) {
      socket.send("No se reconoce el comando");
    }else if (msg.startsWith("USUARIO:")) {
      identificadores[posUser]['usuario'] = msg.split(":")[1];
      let cadena = "<p style='font-style: oblique;'>" + identificadores[posUser]['usuario'] + " se unió al chat" + "</p>";
      io.send(cadena)
      let usuariosActivos = "<p style='font-style: oblique;'> Usuarios chat: ";
      for (let i = 0; i < identificadores.length; i++) {
        if(i==(identificadores.length-1)){
          usuariosActivos +=   identificadores[i]['usuario'];
        }else{
          usuariosActivos +=   identificadores[i]['usuario'] + ", ";
        }
        
      }  
      usuariosActivos += "</p>";
      io.send(usuariosActivos)
    } else {
      //-- Reenviarlo a todos los clientes conectados
      msg = '<div class="mensaje">' + '<p id="nombreUsuario" style="color:' + colorLetras + ';font-weight: bolder;">' + identificadores[posUser]['usuario'] + '</p>' + msg + '</div> ' + '<span id="hora">' + hora + '</span>';
      console.log("Mensaje Recibido!: " + msg.blue);
      io.send(msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);