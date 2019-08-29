(function (jq) {

    var maeApi = MAE.MaeApiService;
    var signalInit = new signals.Signal;
    var _list = [];


    function _initSubscriptions(func) {
        signalInit.add(func);

    };

    function _removeSubscriptions(func) {
        signalInit.remove(func);

    };

    function _searchBitacora(data) {
        maeApi.searchBitacora(data);

    }

    function _onBitacora(event, data) {

        signalInit.dispatch(event, data);
    };

    maeApi.subscribeBitacora(_onBitacora);

    var _bitacoraService = {

        initSubscriptions: _initSubscriptions,
        removeSubscriptions: _removeSubscriptions,
        searchBitacora : _searchBitacora
    };


    jq.extend(true, window, {
        MAE: {
            BitacoraService: _bitacoraService
        }
    });


})(jQuery);