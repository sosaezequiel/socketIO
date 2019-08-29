(function (jq){

    var _signalPriceChange = new signals.Signal;


    function _unsubscribePriceChange(t, fnc)
    {


        _signalPriceChange.remove(fnc);

    }

    function _onPriceChange(obj,producto){

        _signalPriceChange.dispatch(obj, producto);
    }


    function _getAndSubscribePriceChange(productos, fnc)
    {
        
        MAE.MaeApiService.subscribePriceChange(productos, _onPriceChange, function () {

            //Error
        });

        _signalPriceChange.add(fnc);
    }

    var _maePriceChangeService = {
        unsubscribePriceChange : _unsubscribePriceChange,
        getAndSubscribePriceChange : _getAndSubscribePriceChange
    };

    jq.extend(true, window, {
        MAE: {
            MaePriceChangeService: _maePriceChangeService
        }
    });
})(jQuery);