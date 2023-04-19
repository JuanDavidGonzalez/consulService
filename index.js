const Consul = require('consul');
const express = require('express');

const SERVICE_NAME='mymicroservice';
const SERVICE_ID='m'+process.argv[3];
const SCHEME='http';
const HOST= process.argv[2];
const PORT= process.argv[3];
const PID = process.pid;

/* Inicializacion del server */
const app = express();

const consul = new Consul({
    host: '192.168.10.41', // dirección IP del servidor Consul
    port: 8500, // puerto en el que se está ejecutando el agente Consul
});

app.get('/health', function (req, res) {
    console.log('Health check!');
    res.end( "Ok." );
    });

app.get('/', (req, res) => {
    res.send('Hello World! From: '+ SERVICE_ID)
});

app.listen(PORT, function () {
    console.log('Servicio iniciado en:'+SCHEME+'://'+HOST+':'+PORT+'!');
});

/* Registro del servicio */
var check = {
    id: SERVICE_ID,
    name: SERVICE_NAME,
    address: HOST,
    port: PORT, 
    check: {
        http: SCHEME+'://'+HOST+':'+PORT+'/health',
        ttl: '5s',
        interval: '5s',
        timeout: '5s',
        deregistercriticalserviceafter: '1m'
    }
  };
 
consul.agent.service.register(check, function(err) {
  	if (err) throw err;
});