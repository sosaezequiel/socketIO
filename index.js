var express = require('express');
var app = express();

app.use(express.static('dist'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});



var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000, function(){
  console.log('listening on *:3000');
});


io.on('connection', function (socket) {
  socket.emit('news', { msg: 'desde el server' });
  socket.on('push', function (data) {
    console.log(data.msg);
  });
});