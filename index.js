var express = require('express');
var app = express();

app.use(express.static('dist'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var numero_de_clientes = 0;

var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000, function () {
  console.log('listening on *:3000');
});


io.on('connection', function (socket) {

  numero_de_clientes += 1;

  socket.broadcast.emit('conexiones', { type : 1 ,msg: 'nueva conexion ', numero_de_clientes });

  socket.on('push', function (data) {
    console.log(data.msg);
  });

  socket.on('disconnect', function () {
    numero_de_clientes -= 1;
    socket.broadcast.emit('conexiones', { type : 2 , msg: 'un cliente desconectado ', numero_de_clientes });
  });
});

