var socket;
var isConnect = false;

const socketService =
    {
        connect: function connect(callback) {
            socket = io.connect('http://192.168.0.7:3000');
            socket.on("connect", function () {
                isConnect = true;
                callback();
            });

        },
        subscribe: function (eventName, callback) {
            if (!isConnect) {
                console.warn("no está conectado");
                return;
            }
            if (socket) {
                socket.on(eventName, function (data) {
                    callback(data);
                });
            }

        },

        emit: function (eventName, payload) {
            socket.emit(eventName, payload);
        }

    }


export default socketService;