import React from 'react';
import ReactDOM from 'react-dom';
import socketService from './services/socketService';

import "./css/estilo.scss";



$.extend(true, window, {
    MAE: {
        SocketService: socketService
    }
});



function App(props) {

    return "········";
}

ReactDOM.render(<App />, document.querySelector("#app"));


socketService.connect(function () {

    console.log("conectado");
    socketService.subscribe("news", function (data) {
        console.log(data);
        socketService.emit("push", { msg: "desde el cliente atravez de servicio" });
    });

});



