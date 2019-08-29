import React from 'react';
import ReactDOM from 'react-dom';
import socketService from './services/socketService';
import PanelCards from './componets/PanelCards';

import "./css/estilo.scss";
var namespace = "Demo";



$.extend(true, window, {
    [namespace]: {
        SocketService: socketService
    }
});


ReactDOM.render(<PanelCards />, document.querySelector("#app"));


socketService.connect(function () {

    console.log("conectado");
    socketService.subscribe("conexiones", function (data) {
        console.dir(data);
        socketService.emit("push", { msg: "desde el cliente atravez de servicio" });
    });

});



