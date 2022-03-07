const http = require('http');
const fs = require('fs');

const PUERTO = 9090;


function print_info_req(req) {

    console.log("");
    console.log("Mensaje de solicitud");
    console.log("====================");
    console.log("Método: " + req.method);
    console.log("Recurso: " + req.url);
    console.log("Version: " + req.httpVersion)
    console.log("Cabeceras: ");

    //-- Recorrer todas las cabeceras disponibles
    //-- imprimiendo su nombre y su valor
    for (hname in req.headers)
      console.log(`  * ${hname}: ${req.headers[hname]}`);

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL completa: " + myURL.href);
    console.log("  Ruta: " + myURL.pathname);
}


const server = http.createServer((req, res)=>{
    console.log("Petición recibida!");

    //-- Mostrar informacion de la peticion
    print_info_req(req);

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";

    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL (del recurso solicitado): " + url.href)
    console.log("Ruta: ",url.pathname);

    let petition = "";
    let mimetype = 'text/html';

    if (url.pathname == '/') {//-- Si se pide la pagina principal
      petition = "/html/main.html"
    }else {//-- Si se pide cualquier otra cosa
        petition = url.pathname;
    }

    //-- Se guarda el tipo de recurso pedido, separando su nombre de la extension
    resource = petition.split(".")[1];
    //-- Se añade un punto para que el sistema pueda buscarlo y mostrarlo
    petition = "." + petition;

    console.log("Nombre del recurso servido: " + petition);
    console.log("Extension del recurso: " + resource);

    //-- Generar la respusta en función de las variables
    res.statusCode = code;
    res.statusMessage = code_msg;

    //-- Cambiar el mimetype en funcion de la extensión del recurso
    switch (resource) {
      //Hoja de estilos
      case 'css': 
        mimetype = "text/css";
        break;
      //Imagenes  
      case 'jpg':
      case 'png':
      case 'jpeg':
        mimetype = "image/" + resource;
        break;
      //Archivos Javascript
      case 'js': 
      default:
        console.log("Not recognised resource")
    }
    
    //-- Lectura asincrona de los recursos a mostrar en la pagina
    fs.readFile(petition, (err, data) => {
      console.log(resource);
        if (err) {
            res.statusCode = 404
            res.statusMessage = "Not Found"
            petition = "html/error.html";
            data = fs.readFileSync(petition);
            res.setHeader('Content-Type', mimetype);
            res.write(data);
            return res.end();
        }
      
        //-- Escribo la cabecera del mensaje y muestro la pagina solicitada
        res.setHeader('Content-Type', mimetype);
        res.write(data);
        res.end();
    });
});

server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);