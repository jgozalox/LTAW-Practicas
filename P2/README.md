 # Práctica 2

**MANUAL DE USUARIO**

Para lanzar el servidor de chat, escribe "node tienda.js" en un terminal integrado en la carpeta contenedora del proyecto (P2). Después, accedemos a través de un navegador a "localhost:9090" o "127.0.0.1:9090".

Una vez en la pagina principal, disponemos de los productos, carrito y login.

Para añadir un producto a la cesta es necesario acceder con alguno de los usuarios ya registrados: (User:root, pass:123456) o (User: jgozalo, pass:123456).

En cualquier momento podremos regresar a la página principal a través del enlace correspondiente.

Podremos consultar los productos y la cantidad de estos en el carrito y finzalizar posteriormente el pedido.

**DOCUMENTACIÓN TÉCNICA**

El servidor de chat utiliza la tecnología NODE.

El chat se despliega en el PUERTO 9090 de la direccion de IP local.

Descripción de los ficheros (organizados por carpetas por tipo de archivo)

* css: 
    * css/style.css: hoja de estilos de la tienda

* html: páginas estáticas que componen la tienda
    * html/index.html: pagina principal
    * html/alcarro.html
    * html/compra.html
    * html/compracompletada.html
    * html/error.html: pagina de recurso erroneo o no encontrada
    * html/goldensupreme.html: página de producto
    * html/grannysmith.html: página deproducto
    * html/reddelicious.html: página de producto
    * html/logueado.html

* json:
    * json/pedidos.json: pedidos e informacion relativa
    * json/tienda.json:BBDD de la tienda

* images: contiene las imagenes utilizadas

Para desplegar el chat es necesario importar los siguientes modulos:

* http
* fs
