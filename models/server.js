const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
        }

        //Conectar a base de datos
        this.conectarDB();
 
        // Middlewares
        this.middlewares();

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Rutas de mi aplicación
        this.routes();

        //Sockets
        // this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        
        //CORS
        this.app.use( cors() );

        //Directorio público
        this.app.use( express.static('public') );

    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.usuarios, require('../routes/usuarios') );
    }

    listen() {
        
        this.server.listen( this.port, () => {
            console.log('Servidor corriento en puerto', this.port);
        });

    }

}


module.exports = Server;