const electron = require('electron');

console.log("Desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const info7 = document.getElementById("info7");
const infoIP = document.getElementById("infoIP");
const accesoChat = document.getElementById("accesoChat");
const infoUSERS = document.getElementById("infoUSERS");
const print = document.getElementById("print");
let msg_prueba = 1;


//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.electron;
info3.textContent = process.versions.chrome;
info4.textContent = process.arch;
info5.textContent = process.platform;
info6.textContent = process.getSystemVersion();
info7.textContent = process.type;

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('print', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + "<p></p>";
    print.textContent = message;
});

//-- Mensaje recibido del proceso MAIN para IP
electron.ipcRenderer.on('ip', (event, message) => {
    console.log("IP: " + message);
    infoIP.innerHTML = message;
    accesoChat.href = message;
});

//-- Mensaje recibido del proceso MAIN para USUARIOS
electron.ipcRenderer.on('infoUSERS', (event, message) => {
    console.log("Usuarios: " + message);
    infoUSERS.innerHTML = message;
});

//-- Mensaje recibido del proceso MAIN para mensajes
electron.ipcRenderer.on('msgs', (event, message) => {
    console.log("Mensaje: " + message);
    display.innerHTML += message;
});