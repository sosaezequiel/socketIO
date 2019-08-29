/*
Dependecias :logsService
*/
(function (jq) {
    var e = rootScope; //rootScope
    var t = MAE.ConfigService;
    var n = MAE.LogsService;//logsService;
    var a = MAE.GaService;

    var hub = null;

    var portfolio;


    function _init() {

        function notifyAddTrade(item) {

            MAE.NotifyService.notifyAddTrade(item);
        }

        function notifyAddRejectMarket(item) {

            MAE.NotifyService.notifyAddRejectMarket(item);
        }

        function notifyAddCancelMarket(item) {

            MAE.NotifyService.notifyAddCancelMarket(item);
        }

        ordenesDmaHub = jq.connection.ordenesDmaHub;
     
        hub = jq.connection.preciosHub;

        hub.client.Puntaspush = function (pModel) {
            var maxVolAsk = Math.max.apply(Math, pModel.Ofertas.map(function (o) { return o.Cantidad; }));
            AppContext.CantidadMaxima = Math.max(maxVolAsk, AppContext.CantidadMaxima);
            myWorker.postMessage({
                quote: pModel,
                type: WorkerMessageType.QUOTE
            });
        };

        ordenesDmaHub.client.OrdenActivaMercado = function (notificacion) {
            myWorker.postMessage({
                OrdenActivaMercado: notificacion
            });
            notifyAddTrade(notificacion);
        };

        ordenesDmaHub.client.OrdenRechazoMercado = function (notificacion) {
            myWorker.postMessage({
                OrdenRechazoMercado: notificacion

            });
            notifyAddRejectMarket(notificacion);
        };

        ordenesDmaHub.client.OrdenCancelarMercado = function (notificacion) {
            myWorker.postMessage({
                cancelOrden: notificacion
            });
            notifyAddCancelMarket(notificacion);
        };

        ordenesDmaHub.client.EstadoSistema = function (estadoSistema) {
            myWorker.postMessage({
                EstadoSistema: estadoSistema
            });
        };

        ordenesDmaHub.client.OrdenReemplazarMercado = function (notificacion) {
            myWorker.postMessage({
                OrdenReemplazarMercado: notificacion
            });
        };

        hub.client.addNewMessageToPage = function (name, message) {
            // Add the message to the page.  
            //<div class="msg-receive"> Received message </div>
            if (AppContext.CURRENT_USER_NAME === name) {
                $('#msg-insert').prepend("<div class='msg-send'>" + name + '</strong>: ' + message + "</div>");
            }
            else {
                $('#msg-insert').prepend("<div class='msg-receive'>" + name + '</strong>: ' + message + "</div>");
            }
        };

        jq.connection.hub.start().done(function () {
            if (AppContext.CodigoPortfolio) {
                hub.server.notify(AppContext.SECURITY_TOKEN_ID, jq.connection.hub.id, AppContext.CodigoPortfolio);
            }

            $('#sendmessage').keypress(function (event) {
                var $this = $(this);
                if (event.keyCode === 13) {
                    var msg = $this.val();
                    $this.val('');
                    hub.server.send(AppContext.CURRENT_USER_NAME, msg);
                }
            });
            ordenesDmaHub.server.notifyOrdenes(AppContext.SECURITY_TOKEN_ID, jq.connection.hub.id, AppContext.IdUsuario);

        });

        myWorker.onmessage = function (oEvent) {

            //producto = oEvent.data;
            var travel = {
                type: oEvent.data.type,
                payload: oEvent.data.payload,
                subtype: oEvent.data.subtype
            };

            signalMessage.dispatch(travel);
            //producto = new ForexQuote(producto.key, producto.symbolGroup, producto.symbol, producto.tick);
            // onSuccess({}, producto);
        };
    }

    function _setPortfolio(port) {
        portfolio = port;
    }

    function _getPortfolio() {
        return portfolio;
    }

    function onStatusChange(e, t, a, i) {//o
        n.log("socketService", "socketStatusCallback", "status=" + e + ", isReconnecting=" + t + ", isSwitchingEnvironment=" + a + ", isError=" + i),
            signalStatus.dispatch(e, t, a, i);
    }
    function onMessage(e) {//r
        signalMessage.dispatch(e);
    }
    function onPing(e, t, n, a) {//s
        w = e;
        var i = performance.now() - a;
        signalPing.dispatch(w, t, n, i);
    }
    function log() {//c
        n.log.apply(this, Array.prototype.slice.call(arguments));
    }
    function warn() {//u
        n.logWarn.apply(this, Array.prototype.slice.call(arguments));
    }
    function _isConnected() {
        return true;
        //return socket.isConnected()
    }
    function _getEnvironment() {
        return "Real";
        //return socket.getEnvironment()
    }
    function _connect(e) {
        n.log("socketService", "connect", "environment=" + e);
        n.log("socketService", "connect");
        //socket.connect(e)
    }
    function _disconnect(e) {
        n.log("socketService", "disconnect", "afterLogout=" + e);
        //socket.disconnect(e)
    }
    function _reconnect() {
        n.log("socketService", "reconnect"),
            socket.reconnect();
    }
    function _switchEnvironment(e) {
        n.log("socketService", "switchEnvironment", "environment=" + e),
            socket.switchEnvironment(e);
    }
    function _send(e) {
        n.log("socketService", "_send");
        /*
            Simulado 
        */
        var obj_str = '{"accountId":"meta1_10610655","userId":"2760096","priceAlerts":false,"layout":{"id":"Default","type":"vertical","percentSize":100,"activeChildIndex":0,"children":[{"id":"Default/0","type":"horizontal","percentSize":75.05773672055427,"activeChildIndex":0,"children":[{"id":"1","type":"tabs","percentSize":39.55696202531646,"activeChildIndex":0},{"id":"2","type":"tabs","percentSize":60.44303797468354,"activeChildIndex":-1}]},{"id":"3","type":"tabs","percentSize":24.94226327944573,"activeChildIndex":0}],"layoutType":"Default"},"timestamp":1550526374704,"news":{"source":{},"sound":{"play":false,"volume":0.75}},"baskets":{"data":{"b1549644779448b770":{"key":"b1549644779448b770","name":"New investment basket ","symbols":{"1_AUDCHF_5":{"symbolKey":"1_AUDCHF_5","volume":0.5,"side":0,"order":1549644786541}},"extendedSymbol":null,"timestamp":1549644824637},"b1549644795378b574":{"key":"b1549644795378b574","name":"jhhhh","symbols":{"1_AUDUSD_5":{"symbolKey":"1_AUDUSD_5","volume":0.5,"side":0,"order":1549644808068}},"extendedSymbol":null,"timestamp":1549644809613}}},"heatmap":{"selectedHeatmap":"1","selectedPeriod":"move_d1"},"layoutContainers":{"1":[{"id":"marketWatch","parentId":"1","activeChildIndex":0}],"2":[],"3":[{"id":"openTrades","parentId":"3","activeChildIndex":0},{"id":"pendingTrades","parentId":"3","activeChildIndex":0}]},"marketSentiments":{"symbols":["1_EURUSD_5","1_GBPUSD_5","1_USDJPY_5","1_AUDUSD_5","3_US500_5","3_DE30_5","3_UK100_5","3_SPA35_5","2_GOLD_5","2_SILVER_5","2_OIL_5","2_COFFEE_5","1_USDCAD_5","1_NZDUSD_5","1_EURJPY_5","1_EURGBP_5","1_USDCHF_5","1_USDTRY_5","1_EURTRY_5","1_USDPLN_5","1_EURPLN_5","1_USDCLP_5","1_USDCZK_5","1_USDRON_5","3_US30_5","3_US100_5","3_FRA40_5","3_EU50_5","3_W20_5","2_OIL.WTI_5","2_NATGAS_5","2_SUGAR_5"],"selection":[-1],"sentimentsType":1,"viewType":"list"},"marketWatch":{"datagridColumns":[{"id":"symbol","width":348},{"id":"dailyChange","width":93},{"id":"bid","width":93},{"id":"ask","width":95}]},"openTrades":{"datagridColumns":[{"id":"position","width":220},{"id":"tradeType","width":52},{"id":"volume","width":64},{"id":"marketValue","width":64},{"id":"sl","width":46},{"id":"tp","width":46},{"id":"openPrice","width":65},{"id":"marketPrice","width":65},{"id":"profit","width":65},{"id":"totalProfit","width":65},{"id":"netProfitPercent","width":65},{"id":"close","width":100}]},"notificationsFilter":{"trading":true,"tradersTalk":false,"news":true,"calendar":true,"marketSentiment":false,"tradersList":false,"priceAlerts":true,"marginCall":false,"warning":true}}';
        var obj = JSON.parse(obj_str);
        onMessage(obj);
        //socket.send(e)
    }
    function _subscribeStatus(e, t) {
        signalStatus.add(e, null, null, t);
    }
    function _unsubscribeStatus(e) {
        signalStatus.remove(e);
    }
    function _isSubscribed(e) {
        return signalStatus.has(e);
    }
    function _subscribeOnMessage(e, t) {
        signalMessage.add(e, null, null, t);
    }
    function _unsubscribeOnMessage(e) {
        signalMessage.remove(e);
    }
    function _subscribePingStatus(e, t) {
        signalPing.add(e, null, null, t);
    }
    function _unsubscribePingStatus(e) {
        signalPing.remove(e);
    }
    function _getPingLatency() {
        return w;
    }
    function getSubscriptionStatus() {
        return signalStatus.toStringNames() + " | " + signalMessage.toStringNames() + " | " + signalPing.toStringNames();
    }
    var socket, signalStatus = new signals.Signal("status"), signalMessage = new signals.Signal("onMessage"), signalPing = new signals.Signal("ping"), w = 0;
    var _SocketService = {
        _getSubscriptionStatus: getSubscriptionStatus, //A
        init: _init, //i
        isConnected: _isConnected,//l
        getEnvironment: _getEnvironment, //d
        connect: _connect, //S
        disconnect: _disconnect,//p
        reconnect: _reconnect, //g
        switchEnvironment: _switchEnvironment,//f
        send: _send, //m
        subscribeStatus: _subscribeStatus, //v
        unsubscribeStatus: _unsubscribeStatus,//b
        isSubscribed: _isSubscribed, //E
        subscribeOnMessage: _subscribeOnMessage,//D
        unsubscribeOnMessage: _unsubscribeOnMessage,//h
        subscribePingStatus: _subscribePingStatus,//C
        unsubscribePingStatus: _unsubscribePingStatus, //y
        getPingLatency: _getPingLatency,//T
        setPortfolio: _setPortfolio,
        getPortfolio: _getPortfolio
    };

    jq.extend(true, window, {
        MAE: {
            SocketService: _SocketService
        }
    });

})(jQuery);