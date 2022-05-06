//--Importar modulos
const http = require('http');
const fs = require('fs');

//--Definir puertos
const PUERTO = 9090;

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "json/tienda.json"

//-- Leer el fichero JSON
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//--Pagina principal
const INDEX = fs.readFileSync('html/index.html', 'utf-8');

//-- Página para finalizar compra
const COMPRA = fs.readFileSync('html/compra.html', 'utf-8');

//--Alcarro
const ALCARRO = fs.readFileSync('html/alcarro.html', 'utf-8');

//--Productos
const goldensupreme = fs.readFileSync('html/goldensupreme.html', 'utf-8');
const grannysmith = fs.readFileSync('html/grannysmith.html', 'utf-8');
const reddelicious = fs.readFileSync('html/reddelicious.html', 'utf-8');

//--Formulario
const FORMULARIO_LOGIN = fs.readFileSync('html/login.html','utf-8');

//-- Respuesta login
const RESPUESTA_LOGIN = fs.readFileSync('html/logueado.html','utf-8');


//--Funcion para imprimir información de la petición
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

function get_carrito(req) {
  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Variable para guardar el producto
    let carrito;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el producto
      //-- Solo si el nombre es 'carrito'
      if (nombre.trim() === 'carrito') {
        carrito = valor;
        //res.setHeader('Set-Cookie', element + ':' + carrito);
      }
    });
    //-- Si la variable user no está asignada
    //-- se devuelve null
    return carrito || null;
  }
}

//--Función para obtener la información del usuario
function get_user(req) {

  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");
    
    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });
    
    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user || null;

  }
}

//--Creación del servidor
const server = http.createServer((req, res)=>{
    console.log("Petición recibida!");

    //-- Mostrar informacion de la peticion
    //print_info_req(req);

    //-- Valores de la respuesta por defecto
    let code = 200;
    let code_msg = "OK";
    let petition = "";
    let mimetype = 'text/html';

    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("URL (del recurso solicitado): " + url.href)
    console.log("Ruta: ",url.pathname);

    if (url.pathname == '/') {//-- Si se pide la pagina principal
      petition = "/html/index.html"
    }else {//-- Si se pide cualquier otra cosa
        petition = url.pathname;
    }

    let info;
    
    //Logins
    let nombre_user = url.searchParams.get('usuario');
    let pass = url.searchParams.get('contraseña');
    let login1_BD = tienda[0]['usuarios'][0]['nick'];
    let pass1_BD = tienda[0]['usuarios'][0]['pass'];
    let login2_BD = tienda[0]['usuarios'][1]['nick'];
    let pass2_BD = tienda[0]['usuarios'][1]['pass'];

    //Golden Supreme
    let golden_supreme = goldensupreme;
    info = tienda[1]['productos'][0]['nombre'];
    golden_supreme = golden_supreme.replace("NOMBRE", info);
    info = tienda[1]['productos'][0]['descripcion'];
    golden_supreme = golden_supreme.replace("DESCRIPCION", info);
    info = tienda[1]['productos'][0]['precio'];
    golden_supreme = golden_supreme.replace("PRECIO", info);
    info = tienda[1]['productos'][0]['stock'];
    golden_supreme = golden_supreme.replace("STOCK", info);

    //Granny Smith
    let granny_smith = grannysmith;
    info = tienda[1]['productos'][1]['nombre'];
    granny_smith = granny_smith.replace("NOMBRE", info);
    info = tienda[1]['productos'][1]['descripcion'];
    granny_smith = granny_smith.replace("DESCRIPCION", info);
    info = tienda[1]['productos'][1]['precio'];
    granny_smith = granny_smith.replace("PRECIO", info);
    info = tienda[1]['productos'][1]['stock'];
    granny_smith = granny_smith.replace("STOCK", info);


    //Red Delicious
    let red_delicious = reddelicious;
    info = tienda[1]['productos'][2]['nombre'];
    red_delicious = red_delicious.replace("NOMBRE", info);
    info = tienda[1]['productos'][2]['descripcion'];
    red_delicious = red_delicious.replace("DESCRIPCION", info);
    info = tienda[1]['productos'][2]['precio'];
    red_delicious = red_delicious.replace("PRECIO", info);
    info = tienda[1]['productos'][2]['stock'];
    red_delicious = red_delicious.replace("STOCK", info);

    //-- Entrega de formulario
    let user = FORMULARIO_LOGIN;
    let user_cookie = get_user(req);
    let html_extra = "";
    let html_extra_condicion = "";

    //-- Reemplazar en "logueado.html"
  user = RESPUESTA_LOGIN.replace("NOMBRE", nombre_user);
  
  if (nombre_user == login1_BD && pass == pass1_BD || nombre_user == login2_BD && pass == pass2_BD) {
    html_extra = "<h2>Está registrad@</h2>";
    html_extra_condicion = "<h2>¡A comprar!</h2>";
    //-- Login correcto --> almaceno cookie
    console.log("------------------------------",nombre_user);
    res.setHeader('Set-Cookie', "user=" + nombre_user);
  } else {
    html_extra = "<h2>Usuario y/o contraseña incorrectos!</h2>";
  }
  user = user.replace("HTML_EXTRA", html_extra);
  user = user.replace("HTML_EXTRA_CONDICION", html_extra_condicion);

 

    let carrito = ALCARRO;
    let carro = "";
    let carrear = get_carrito(req);

    let direccion = url.searchParams.get('direccion');
    let tarjeta = url.searchParams.get('tarjeta');

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
        }else if(petition == "./html/goldensupreme.html"){
            data = golden_supreme;
            tipoProd = "Golden Supreme";
        }else if(petition == "./html/grannysmith.html"){
            data = granny_smith;
            tipoProd = "Granny Smith";
        }else if(petition == "./html/reddelicious.html"){
            data = red_delicious;
            tipoProd = "Red Delicious";
        }else if(petition == "./html/logueado.html"){
            data = user;
        }else if (petition == './html/alcarro.html'){
          if (carrear == null) { //-- Si el carro está vacío
            carro = tipoProd;
            res.setHeader('Set-Cookie', "carrito= " + carro);
            carrito = carrito.replace("PRODUCTO_AÑADIDO", tipoProd);
          } else { //-- Si ya hay productos añadidos
            carro = carrear + ", " + tipoProd;
            res.setHeader('Set-Cookie', "carrito= " + carro);
            carrito = carrito.replace("PRODUCTO_AÑADIDO", tipoProd);
          }
          data = carrito;
        //-- Finalizar compra 
        }else if (petition == './html/compra.html'){
          if (user_cookie == null){
            sinlogin = FORMULARIO_LOGIN;
            data = sinlogin;
          } else {
            let comprado;
            comprado = COMPRA.replace("PRODUCTOS_COMPRADOS", carrear);
            data = comprado;
          }
        } if ((direccion != null) && (tarjeta != null)) {
          let pedido = {
            "nombre usuario": user_cookie,
            "dirección envío": direccion,
            "número de la tarjeta": tarjeta,
            "productos": carrear
          }
          tienda[2]["pedidos"].push(pedido);
          //-- Pasarlo a JSON y almacenarlo en BD
          let myPedido = JSON.stringify(tienda);
          fs.writeFileSync(FICHERO_JSON_OUT, myPedido);
          //-- Confirmar pedido
          comprado = COMPRA_COMPLETADA.replace("PRODUCTOS_COMPRADOS", carrear);
          data = comprado;
  
        //-- BÚSQUEDA CON AUTOCOMPLETADO
        }else if (petition.startsWith == 'productos') {
          //-- Leer fichero JSON con los productos
          const PRODUCTOS_JSON = fs.readFileSync('tienda.json');
          //-- Obtener el array de productos
          let productos = JSON.parse(PRODUCTOS_JSON);
          console.log("Peticion de Productos!")
          content_type = "application/json";
  
          //-- Leer los parámetros
          let param1 = url.searchParams.get('param1');
  
          param1 = param1.toUpperCase();
  
          console.log("  Param: " +  param1);
  
          let result = [];
  
          for (let prod of productos) {
  
            //-- Pasar a mayúsculas
            prodU = prod.toUpperCase();
  
            //-- Si el producto comienza por lo indicado en el parametro
            //-- meter este producto en el array de resultados
            if (prodU.startsWith(param1)) {
                result.push(prod);
            }
              
          }
          console.log(result);
          busqueda = result;
          data = JSON.stringify(result);
          contType = "application/json";
  
          return
      
        } else if(url.pathname.startsWith('cliente.js')){
          //-- Leer fichero javascript
          console.log("recurso: " + petition);
          fs.readFile(recurso, 'utf-8', (err,data) => {
              if (err) {
                  console.log("Error: " + err)
                  return;
              } else {
                res.setHeader('Content-Type', 'application/javascript');
                contType = 'application/javascript';
                res.writeHead(code, {'Content-Type': contType});
                res.write(data);
                res.end();
              }
          });
          return;
        }else if(petition == 'buscar'){
          //-- leer caja
          let busqueda = url.searchParams.get('caja');
          contType = 'application/javascript';
          console.log("Busqueda: " + busqueda);
          if (busqueda == "producto 1"){
            data = prod1;
          } else if (busqueda == "producto 2"){
            data = prod2;
          } else if (busqueda == "producto 3"){
            data = prod3;
          }
  
        //-- Home
        }else if (petition == 'html/tienda.html'){
          user = PAGINA_MAIN.replace("IDENTIFICARSE", user_cookie);
          data = user;
        }
      
        //-- Escribo la cabecera del mensaje y muestro la pagina solicitada
        res.setHeader('Content-Type', mimetype);
        res.write(data);
        res.end();
    });
});

//--Servidor en escucha
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);