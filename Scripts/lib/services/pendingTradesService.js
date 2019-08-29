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

    function _onPendingTrade( event, data)
    {

        // if(_list.length < data.length)
        // {
        //     _list = data;
        //     MAE.LayoutService.activateModule(ModulesType.PENDING_TRADES);
        // }

        signalInit.dispatch( event, data);
        // switch (event) {
        //     case DataEvent.ITEM_LIST:
        //         signalInit.dispatch(data, event);Pope
        //         breadk;

        // }

    };

    function _cancelPending(item)
    {

        maeApi.CancelPending(item);
    };
    
    function _itemDragAndDrop(e, t) {
        MAE.DepthService.itemDragAndDrop(e, t);
    };


    maeApi.subscribePendingTrade(_onPendingTrade);


    var _pendingTradesService = {

        initSubscriptions : _initSubscriptions,
        removeSubscriptions : _removeSubscriptions,
        CancelPending : _cancelPending,
        itemDragAndDrop: _itemDragAndDrop
    };


    jq.extend(true, window, {
        MAE: {
            PendingTradesService: _pendingTradesService
        }
    });

    
})(jQuery);