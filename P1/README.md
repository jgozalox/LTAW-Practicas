 # Práctica 1

 **MANUAL DE USUARIO**

 Para ejecutar la página web hemos de seguir los siguientes pasos:

 1. Abrir un terminal integrado y escribir en el: 
 > node tienda.js 
 
 2. Posteriormente accedemos a través de la URL de nuestro navegador (podemos usar cualquiera):
 > 127.0.0.1:9090


**DOCUMENTACION TECNICA**

 Para el desarrollo de la tienda, se ha programado un servidor web, parte back-end, y una interfaz web, parte front-end

La tienda cumple con las especificaciones básicas de la tienda y no incluye mejoras:

        
        * Uso de los modulos: 
            * **url** paso de peticiones del cliente al servidor
            * **http** escucha asíncrona de peticiones 
            * **fs** lectura asíncrona de ficheros

        * Se devuelven correctamente las cabeceras de las respuestas (status code,status message,mimetype,etc). Esta información se refleja en la consola.

        * No usa modulos de alto nivel

        * Fichero
            * Nombre: *tienda.js*
            * Puerto escucha: 9090

        * Posibilidad de servir los distintos tipos de archivos: html, javascript, css e imagenes (png,jpg,jpeg).

        * Existencia de pagina de error cuando el recurso solicitado no se encuentra, con su respectivo codigo (404) y mensaje de error (Not Found)

        * Ciertas funcionalidades de la tienda visibles (carrito, contacto) no están accesibles. Se incluyen para dar cuerpo a la primera versión de la tienda.

