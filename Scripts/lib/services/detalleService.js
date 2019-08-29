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

    function _searchDetalle(data) {
        maeApi.searchDetalle(data);

    }

    function _onDetalle(event, data) {

        signalInit.dispatch(event, data);
    };

    maeApi.subscribeDetalle(_onDetalle);

    var _detalleService = {

        initSubscriptions: _initSubscriptions,
        removeSubscriptions: _removeSubscriptions,
        searchDetalle : _searchDetalle
    };


    jq.extend(true, window, {
        MAE: {
            DetalleService: _detalleService
        }
    });


})(jQuery);