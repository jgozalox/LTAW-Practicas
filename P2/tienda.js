const http = require('http');
const fs = require('fs');


const PUERTO = 9090;


//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "json/tienda.json"

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Página de productos
const goldensupreme = fs.readFileSync('html/goldensupreme.html', 'utf-8');

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
    //print_info_req(req);

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";

    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL (del recurso solicitado): " + url.href)
    console.log("Ruta: ",url.pathname);

    let petition = "";
    let mimetype = 'text/html';

    let info;
    console.log("------------->",tienda[1]['productos'][1]['descripcion']);
    info = tienda[1]['productos'][1]['descripcion'];
    let golden_supreme = goldensupreme;
    golden_supreme = golden_supreme.replace("NOMBRE", info);

    if (url.pathname == '/') {//-- Si se pide la pagina principal
      petition = "/html/index.html"
    }else {//-- Si se pide cualquier otra cosa
        petition = url.pathname;
    }

      //-- Se guarda el tipo de recurso pedido, separando su nombre de la extension
      resource = petition.split(".")[1];
      //-- Se añade un punto para que el sistema pueda buscarlo y mostrarlo
      petition = "." + petition;

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
          mimetype = "application/javascript";
          break;
      }



    console.log("Nombre del recurso servido: " + petition);
    console.log("Extension del recurso: " + resource);

    //-- Generar la respusta en función de las variables
    res.statusCode = code;
    res.statusMessage = code_msg;

 

    //-- Lectura asincrona de los recursos a mostrar en la pagina
    fs.readFile(petition, (err, data) => {
      
        if (err) {
            res.statusCode = 404
            res.statusMessage = "Not Found"
            petition = "html/error.html";
            data = fs.readFileSync(petition);
            res.setHeader('Content-Type', mimetype);
            res.write(data);
            return res.end();
        }else{
          if(petition == "./html/goldensupreme.html"){
            console.log(".--------------------------",petition);
            data = golden_supreme;
          }
        }
      
        //-- Escribo la cabecera del mensaje y muestro la pagina solicitada
        res.setHeader('Content-Type', mimetype);

        
        res.write(data);
        res.end();
    });
});

server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);