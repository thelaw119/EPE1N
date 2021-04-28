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
            GuardarContado(pedido, respuesta);
            break;
        }
        
        
        case 'public/Login':
        {
            recuperar(pedido, respuesta);
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

servidor.listen(8888);

console.log('Servidor web iniciado');