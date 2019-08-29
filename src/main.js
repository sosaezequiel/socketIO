import React  from 'react';
import ReactDOM from 'react-dom';
import "./css/estilo.scss";


function App(props){

    return "········";
} 

ReactDOM.render(<App />, document.querySelector("#app"));


var socket = io.connect('http://localhost:3000');
socket.on('news', function (data) {
  console.log(data.msg);
  socket.emit('push', { msg: 'desde el cliente' });
});