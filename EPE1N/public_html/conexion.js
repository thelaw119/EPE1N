/* 
 * Autor: Pedro Gatica Guajardo (law)
 * Servidor Local
 * Fecha: 26-04-2021
 * version 1.0
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');


const mime = {
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'png': 'image/png',
    'woff2': 'image/woff2',
    'woff': 'image/woff',
    'ttf': 'image/ttf',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg3',
    'mp4': 'video/mp4'
};

const servidor = http.createServer((pedido, respuesta) => {
    const objetourl = url.parse(pedido.url);
    let camino = 'public' + objetourl.pathname;
    if (camino == 'public/')
        camino = 'public/index.html';
    encaminar(pedido, respuesta, camino);
});

function encaminar(pedido, respuesta, camino) {
    switch (camino) {

        case 'public/GuardarDatos':
        {
            GuardarContacto(pedido, respuesta);
            break;
        }


        case 'public/guardarUsuario':
        {
            guardarUsuario(pedido, respuesta);
            break;
        }

        case 'public/validar':
        {
            validar(pedido, respuesta);
            break;
        }

        default :
        {
            fs.stat(camino, error => {
                if (!error) {
                    fs.readFile(camino, (error, contenido) => {
                        if (error) {
                            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
                            respuesta.write('Error interno');
                            respuesta.end();
                        } else {
                            const vec = camino.split('.');
                            const extension = vec[vec.length - 1];
                            const mimearchivo = mime[extension];
                            respuesta.writeHead(200, {'Content-Type': mimearchivo});
                            respuesta.write(contenido);
                            respuesta.end();
                        }
                    });
                } else {
                    respuesta.writeHead(404, {'Content-Type': 'text/html'});
                    respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
                    respuesta.end();
                }
            });
        }
    }
}

function GuardarContacto(pedido, respuesta) {
    let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;
    });
    pedido.on('end', function () {
        const formulario = querystring.parse(info);
        respuesta.writeHead(200, {'Content-Type': 'text/html'});

        const pagina = `<script>alert ("Datos Enviados!");
                        window.location.href='http://localhost:8888/pagina5.html'; </script>`;

        respuesta.end(pagina);
        DatosAlmacenados(formulario);
    });
}


function DatosAlmacenados(formulario) {
    const datos = `
                Nombre:${formulario['nombre']}
                Email:${formulario['correo']}
                Mensaje:${formulario['mensaje']}
                ********************************`;
    fs.appendFile('public/Contacto.txt', datos, error => {
        if (error)
            console.log(error);
    });
}

//funcion de guardar el usuario que se esta registrando

function guardarUsuario(pedido, respuesta) {
    let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;

    });

    pedido.on('end', function () {

        const formulario = querystring.parse(info);
        respuesta.writeHead(200, {'Content-Type': 'text/html'});

        const pagina = `<script>alert ("Datos Enviados!");
                        window.location.href='http://localhost:8888/login.html'; </script>`;

        respuesta.end(pagina);
        guardarArchivo(formulario);


    })
}
function guardarArchivo(formulario) {
    const datos = [formulario['nombre'], formulario['password'], ''];

    fs.appendFile('public/Usuarios.txt', datos, error => {
        if (error) {
            console.log(error);
        }
    })

}

// validar usuario y contraseña

function validar(pedido, respuesta) {
    let  datos = fs.readFileSync('public/Usuarios.txt').toString().split(",");


    let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;

    });

    pedido.on('end', function () {

        const formulario = querystring.parse(info);
        respuesta.writeHead(200, {'Content-Type': 'text/html'});


        let usuario;
        let contrasena;
        for (let i = 0; i <= datos.length; i++) {
            if (datos[i] === formulario['nombre']) {

                console.log("usuario correcto");

                console.log(datos[i]);
                usuario = datos[i];
            }

            if (datos[i] === formulario['password']) {
                console.log("contraseña correcta");

                console.log(datos[i]);

                contrasena = datos[i];
               
            }




        }
        if (usuario === formulario['nombre'] && contrasena === formulario['password']) {
            const pagina = `<script>alert ("Datos Correctos");
                        window.location.href='http://localhost:8888/login.html'; </script>`
            respuesta.end(pagina);
        }else{
            const pagina = `<script>alert ("Usuario o contraseña incorrectos");
                        window.location.href='http://localhost:8888/login.html'; </script>`
            respuesta.end(pagina);
        }


    })
    // console.log(datos);

}

//function validacion(formulario, datos, respuesta){
//    
//    
//    if (datos[0]===formulario['nombre']) {
//        console.log("wena wena")
//        const pagina =`<script>alert ("Datos Enviados!");
//                        window.location.href='http://localhost:8888/login.html'; </script>`
//        
//        respuesta.end(pagina);
//    }
//}
servidor.listen(8888);

console.log('Servidor web iniciado');