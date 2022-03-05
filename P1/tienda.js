const http = require('http');
const fs = require('fs');

const PUERTO = 9090;

//-- Texto HTML de la página principal
const pagina_main = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi tienda</title>
</head>
<body style="background-color: lightblue">
    <h1 style="color: green">MI TIENDA</h1>
</body>
</html>
`

//-- Texto HTML de la página de error
const pagina_error = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi tienda</title>
</head>
<body style="background-color: red">
    <h1 style="color: white">ERROR!!!!</h1>
</body>
</html>
`

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
    let page = pagina_main;

    //-- Analizar el recurso
    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL (del recurso solicitado): " + url.href)
    console.log("Ruta: ",url.pathname);

    //-- Cualquier recurso que no sea la página principal
    //-- genera un error
    if (url.pathname != '/') {
        code = 404;
        code_msg = "Not Found";
        page = pagina_error;
    }

    //-- Generar la respusta en función de las variables
    //-- code, code_msg y page
    res.statusCode = code;
    res.statusMessage = code_msg;
    res.setHeader('Content-Type','text/html');
    res.write(page);
    res.end();
});

server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);