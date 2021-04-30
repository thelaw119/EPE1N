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


        case 'public/registrar.html':
        {
            guardarUsuario(pedido, respuesta);
            break;
        }
        
        case 'public/login.html':
        {
            validar(pedido , respuesta);
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

        const pagina = `
                <h3>DNI :${formulario['dni']}<h3><br>
                <h3>Nombre :${formulario['nombre']}<h3><br>
                <h3>Apellido :${formulario['apellido']}<h3><br>
                <h3>Direccion :${formulario['direccion']}<h3><br>
                <h3>Numero Expediente :${formulario['numero_expediente']}<h3><br>
                <h3>Estado :${formulario['estado']}<h3><br>
                <h3>Fecha Inicio :${formulario['fecha_i']}<h3><br>
                <h3>Fecha termino :${formulario['fecha_t']}<h3><br>
                `;
        respuesta.end(pagina);
        DatosAlmacenados(formulario);
    });
}


function DatosAlmacenados(formulario) {
    const datos = `Nombre:${formulario['nombre']}<br>
                Email:${formulario['email']}<br>
                Mensaje:${formulario['mensaje']}<hr>`;
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
        const pagina = `<html>
    <head>
        <title>Registro Usuario</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
        <link href="css/login.css" rel="stylesheet" type="text/css"/>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </head>
    <body>
        <div id="login">
            <h3 class="text-center text-white pt-5">Registro Usuario</h3>
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12">
                            <form id="login-form" class="form" action="" method="post">
                                <h3 class="text-center text-info">REGISTRO</h3>
                                <div class="form-group">
                                    <label for="username" class="text-info">Nombre:</label><br>
                                    <input type="text" name="nombre" id="username" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-info">Password:</label><br>
                                    <input type="text" name="password" id="password" class="form-control">
                                </div>
                                <div class="form-group">
                                    <br>
                                    <input type="submit" name="submit" class="btn btn-info btn-md" value="Registro">

                                </div>
                                <div id="register-link" class="text-right">
                                    <a href="login.html" class="text-info">Volver</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
        respuesta.end(pagina);
        
        respuesta.end();
        guardarArchivo(formulario);
    })
}
function guardarArchivo(formulario) {
    const datos = [formulario['nombre'] ,formulario['password']];

    fs.appendFile('public/Usuarios.txt', datos, error => {
        if (error) {
            console.log(error);
        }
    })
}

// validar usuario y contraseña

function validar(pedido ,respuesta){
   let  datos = fs.readFileSync('public/Usuarios.txt').toString().split(",");
    
    
     let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;

    });

    pedido.on('end', function () {

        const formulario = querystring.parse(info);
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        const pagina = `<html>
    <head>
        <title>Ingreso Usuario</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
        <link href="css/login.css" rel="stylesheet" type="text/css"/>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </head>
    <body>
        <div id="login">
            <h3 class="text-center text-white pt-5">Ingreso de Usuario</h3>
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12">
                            <form id="login-form" class="form" action="" method="post">
                                <h3 class="text-center text-info">Ingreso</h3>
                                <div class="form-group">
                                    <label for="username" class="text-info">Nombre:</label><br>
                                    <input type="text" name="nombre" id="username" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="text-info">Password:</label><br>
                                    <input type="text" name="password" id="password" class="form-control">
                                </div>
                                <div class="form-group">
                                    <br>
                                    <input type="submit" name="submit" class="btn btn-info btn-md" value="Ingresar">
                                </div>
                                <div id="register-link" class="text-right">
                                    <a href="registrar.html" class="text-info">Registrar Aqui</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>`;
        respuesta.end(pagina);
         
      //  console.log(formulario);  
        validacion(formulario , datos);
    })
   // console.log(datos);
    
}

function validacion(formulario, datos){
    
    if (datos[0]===formulario['nombre']) {
        console.log("wena wena")
    }
}
servidor.listen(8888);

console.log('Servidor web iniciado');