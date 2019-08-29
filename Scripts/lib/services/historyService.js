(function (jq) {

    var maeApi = MAE.MaeApiService;

    var signalInit = new signals.Signal;

    function _initSubscriptions(func) {
        signalInit.add(func);

    };

    function _removeSubscriptions(func) {
        signalInit.remove(func);

    };

    function _historyData(data, event) {
        signalInit.dispatch(data, event);
        // switch (event) {
        //     case DataEvent.ITEM_LIST:
        //         signalInit.dispatch(data, event);
        //         breadk;

        // }

    };


    function _search(data)
    {
        maeApi.searchHistory(data);

    }



    maeApi.subscribeHistory(_historyData);

    var _historyService = {
        initSubscriptions: _initSubscriptions,
        removeSubscriptions: _removeSubscriptions,
        search : _search
    };





    jq.extend(true, window, {
        MAE: {
            HistoryService: _historyService
        }
    });

})(jQuery)