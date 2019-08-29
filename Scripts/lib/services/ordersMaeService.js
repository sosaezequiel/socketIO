(function (jq) {

    MAXVOL = 35700000000;

    function _createOrder(item, type) {

        var temp = {
            type: type,
            data: item,
            subtype: 0
        };
        var precioLimite = temp.type === OrderType.ASK ? temp.data.askVWAP : temp.data.bidVWAP;
        //obtengo el separador de decimales dependiendo el lenguage del usuario
        var separator = (1.1).toLocaleString(AppContext.LanguageTag).substring(1, 2);
        if (isNaN(precioLimite))
            precioLimite = +precioLimite.replace(separator, ".");
        //precioLimite = +precioLimite.replace(separator, ".");
        var msg = "Alta Orden";
        if (!precioLimite || isNaN(precioLimite) || precioLimite === 0) {
            MAE.MaeApiService.notiError("El precio no puede ser 0.", msg);
            return;
        }
        var cantidad = +temp.data.displayedValue;
        if (!Number.isInteger(cantidad)) {
            MAE.MaeApiService.notiError("El volumen debe ser un entero.", msg);
            return;
        }
        if (cantidad > MAXVOL) {
            MAE.MaeApiService.notiError("El volumen debe ser menor.", msg);
            return;
        }

        MAE.MaeApiService.createOrder(temp);
        setTimeout(function () {
            MAE.MarketWatchModule.focusGrid();
        }, 100);

    }

    function _createOrderEspejo(item) {

        var temp = {
            data: item
        };


        MAE.MaeApiService.createOrderEspejo(temp);
        setTimeout(function () {
            MAE.MarketWatchModule.focusGrid();
        }, 100);

    }


    function _updateOrder(item, type) {
        var temp = {
            type: type,
            data: item,
            subtype: 1
        };


        MAE.MaeApiService.updateOrder(temp);
        // setTimeout(() => {
        //     MAE.MarketWatchModule.focusGrid();    
        // }, 100);
    }

    var _ordersMaeService = {
        createOrder: _createOrder,
        updateOrder: _updateOrder,
        createOrderEspejo: _createOrderEspejo
    };

    jq.extend(true, window, {
        MAE: {
            OrdersMaeService: _ordersMaeService

        }
    });

})(jQuery);
