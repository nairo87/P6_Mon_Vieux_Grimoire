const http = require('http');
const app = require('./app');
    
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);

server.listen(port);