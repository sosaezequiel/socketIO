(function (jq){

    var maeApi = MAE.MaeApiService;
    var signalInit = new signals.Signal;
    var _list = [];


    function _initSubscriptions(func) {
        signalInit.add(func);

    };

    function _removeSubscriptions(func) {
        signalInit.remove(func);

    };

    function _onGaranty(event, data)
    {
        //if(_list.length < data.length)
        //{
        //    _list = data;
        //    //MAE.LayoutService.activateModule(ModulesType.GARANTY);
        //}

        signalInit.dispatch(event, data);
        // switch (event) {
        //     case DataEvent.ITEM_LIST:
        //         signalInit.dispatch(data, event);
        //         breadk;

        // }

    };

    function _searchGaranty(data) {

        maeApi.searchGaranty(data);
    }

    maeApi.subscribeGaranty(_onGaranty);


    var _garantyService = {

        initSubscriptions : _initSubscriptions,
        removeSubscriptions: _removeSubscriptions,
        searchGaranty: _searchGaranty
    };


    jq.extend(true, window, {
        MAE: {
            GarantyService: _garantyService
        }
    });

    
})(jQuery);