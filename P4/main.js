  //-- Cargar el módulo de electron
  const electron = require('electron');
  //-- Cargar las dependencias
  const socket = require('socket.io');
  const http = require('http');
  const express = require('express');
  const colors = require('colors');
  const fs = require('fs');
  const ip = require('ip');

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

//-- Dirección IP
let dir_ip = ip.address();

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
  
  console.log('** NUEVA CONEXION **'.yellow);

  //-- Mensaje de nuevo usuario conectado
  //io.send("¡Nuevo usuario conectado!");
  //-- Usuario conectado. Imprimir el identificador de su socket
  console.log('Socket id: ' + socket.id);

  //-- Añadir un usuario
  numUsuarios = numUsuarios + 1;
  console.log("Numero de usuarios: " + numUsuarios);

  //Enviar a la ventana (index.js)
  win.webContents.send('infoUSERS',numUsuarios);

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
    console.log('** CONEXION TERMINADA **'.yellow);

    if (numUsuarios > 0){
      numUsuarios = numUsuarios--;
      console.log("Número de usuarios: " + numUsuarios);
      //-- Mensaje de nuevo usuario desconectado
      io.send("¡Usuario desconectado!");
    }
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    let banderaSocketId = socket.id;
    for (let i = 0; i < identificadores.length; i++) {
      if(identificadores[i]["socket_id"].includes(socket.id)){
         colorLetras = identificadores[i]["color"];
         posUser = i;
      }
     }

    h = fecha.getHours();
    if (h < 10){
      h = "0" + h;
    }

    if (m < 10){
      m = "0" + m;
    }
    m = fecha.getMinutes();

    let hora = h+':'+ m;
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
        if( (identificadores[i]['usuario']) != undefined){
          if(i==(identificadores.length-1)){
            usuariosActivos +=   identificadores[i]['usuario'];
          }else{
            usuariosActivos +=   identificadores[i]['usuario'] + ", ";
          }
        }
      }  
      usuariosActivos += "</p>";
      io.send(usuariosActivos)
    } else {
      //-- Reenviarlo a todos los clientes conectados
      
        
        //Enviar a la ventana (index.js)
        msgForApp = '<p id="nombreUsuario" style="color:' + colorLetras + ';font-weight: bolder;">' + identificadores[posUser]['usuario'] + ":" + msg + "(" + hora + ")</p>";
        win.webContents.send('msgs',msgForApp);
        msg = '<div class="mensaje">' + '<p id="nombreUsuario" style="color:' + colorLetras + ';font-weight: bolder;">' + identificadores[posUser]['usuario'] + '</p>' + msg + '</div> ' + '<span id="hora">' + hora + '</span>' + " ////" + socket.id;
        console.log("Mensaje Recibido!: " + msgForApp.blue);
        io.send(msg);
    }
  });

});

console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    win = new electron.BrowserWindow({
      width: 800,   //-- Anchura 
      height: 600,  //-- Altura

      //-- Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });

    //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //-------->win.setMenuBarVisibility(false)

  //-- Cargar contenido web en la ventana
  //-- La ventana es en realidad.... ¡un navegador!
  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

//-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    let msg_IP = "http://" + dir_ip + ":" + PUERTO + "/chat.html";
    win.webContents.send('ip', msg_IP);
    console.log(msg_IP.red);
  });

});

//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
