//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const sendUser = document.getElementById("sendUser");
const user_entry = document.getElementById("user_entry");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML +=  "</p>" + msg;
});


user_entry.onchange = () => {
  if (user_entry.value)
    socket.send("USUARIO:" + user_entry.value);

  //-- Borrar el mensaje actual
  user_entry.value = "";
}

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);

  //-- Borrar el mensaje actual
  msg_entry.value = "";
}