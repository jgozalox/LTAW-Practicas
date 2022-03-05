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

    //print_info_req(req);

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";

    //-- Analizar el recurso
    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL (del recurso solicitado): " + url.href)
    console.log("Ruta: ",url.pathname);

    let petition = "";
    if (url.pathname == '/') {
        // ./main.html buscamos en toda la P1 , con html/main.html buscamos en la carpeta html
        petition = "html/main.html"
    }

    //-- Generar la respusta en función de las variables
    //-- code, code_msg y page
    res.statusCode = code;
    res.statusMessage = code_msg;
    //-- Lectura asincrona de los recursos a mostrar en la pagina
    fs.readFile(petition, (err, data) => {
        if (err) {
            console.log("NO");
            petition = "html/error.html";
            data = fs.readFileSync(petition);
            res.write(data);
            return res.end();
        }
        console.log("SI");
        //-- Escribo la cabecera del mensaje y muestro la pagina solicitada
        res.setHeader('Content-Type','text/html')
        res.write(data);
        res.end();
    });
});

server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);