(function (jq) {

    var socket = MAE.SocketService;
    //var u = MAE.SessionApiService;
    var c = MAE.ApiService;
    var signalStatus =new signals.Signal("status");
    var e = rootScope;
    var de = Environment.REAL;
    var _islogin = false; //Te

    function _init() {
        socket = MAE.SocketService;
        socket.init();

    }


    function onSocketStatus(typeStatus, t, n, a) {
        switch (typeStatus) {
            case SocketStatus.CONNECTED:
                prenderSignals();
                break;
            case SocketStatus.DISCONNECTING:
            case SocketStatus.CLOSED:
                signalStatus.dispatch(SessionStatus.RECONNECTING);
                // M(SocketStatus.ERROR);
                break;
            case SocketStatus.ERROR:
            // s.check(k)
        }
    }

    function suscribeStatusSocket() {//w
        socket.isSubscribed(onSocketStatus) || socket.subscribeStatus(onSocketStatus, "sessionService");

        if (socket.isConnected()) {
            if (socket.getEnvironment() == de)
                prenderSignals();
            else
                socket.switchEnvironment(de);

        }
        else
            socket.connect(de);


    }

    function prenderSignals() {//U
        if (e.widgetMode) {
            singalOn();
        }
        else {
            if (socket.isConnected() && socket.getEnvironment() == de) {
                singalOn();

            }
        }

    }

    function _login() {
        /*
        Logica de login        
        */
        suscribeStatusSocket();


    }

    function singalOn() {//P

        c.initSocketSubscribe();
        // if (!u.isSubscribed(P)) {
        //     u.subscribeStatus(P, "sessionService");
        //     u.setEnvironment(de);
        //     if (e.widgetMode)
        //         u.loginRestricted(ie, oe);
        //     else
        //         u.loginWithServiceTicket(ie);
        // }

    }


    function _getIsLogged() {
        return _islogin;

    }

    function _subscribeStatus(e, t) {
        signalStatus.add(e, null, null, t)
    }
    function _unsubscribeStatus(e) {
        signalStatus.remove(e)
    }

    var _sessionService = {
        init: _init,
        subscribeStatus: _subscribeStatus, //T
        unsubscribeStatus: _unsubscribeStatus, //A
        login: _login,
        getIsLogged : _getIsLogged
    };


    jq.extend(true, window, {
        MAE: {
            SessionService: _sessionService

        }
    });
})(jQuery);