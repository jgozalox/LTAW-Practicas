 # Práctica 3

**MANUAL DE USUARIO**

Para lanzar el servidor de chat, escribe "node server.js" en un terminal integrado en la carpeta contenedora del proyecto (P3). Después, accedemos a través de un navegador a "localhost:8080" o "127.0.0.1:8080".

En primer lugar se mostrará una pagina de recibimiento que contiene el enlace al chat.

Una vez dentro de esto, lo primero que se requiere es el nombre de usuario. Una vez registrado, podrá comenzar a mandar mensajes. ¡Bienvenido al chat!


*Comandos especiales*:

* /help: el cual nos mostrará una lista con todos los comandos soportados
* /list: Devolverá el número de usuarios conectados
* /hello: El servidor nos devolverá el saludo
* /date: Nos devolverá la fecha

**MEJORAS**

* *Nickname de usuario*
* *Color de nickname distintivo*
* *Hora de envio de mensaje*
* *Nombre de usuarios conectados*


**DOCUMENTACIÓN TÉCNICA**

El servidor de chat utiliza la tecnología NODE.

El chat se despliega en el PUERTO 8080 de la direccion de IP local.

Descripción de los ficheros:
* public/chat.html: pagina web estática del chat

* package.json -> información sobre el proyecto.

* package-lock.json -> Describe el árbol de dependencias generado para que en otras máquinas se pueda replicar igual (sin tener que guardar en el repositorio el propio arbol de dependencias).

* ids.json: fichero json en el que se almacenan los usuarios y su información correspondiente.

* cliente.js: establece la conexión con el servidor e intercambia mensajes con el.

* style.css: hoja de estilos del chat.

* server.js: servidor que gestiona las distintas peticiones del chat


Para desplegar el chat es necesario importar los siguientes modulos:

* socket 
* http
* express
* colors
* fs

Para instalar los modulos no incluidos utilizar *npm*