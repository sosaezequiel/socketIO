(function (jq) {

    var maeApi = MAE.MaeApiService;

    var signalInit = new signals.Signal;

    function _initSubscriptions(func) {
        signalInit.add(func);

    };

    function _removeSubscriptions(func) {
        signalInit.remove(func);

    };

    function _onOpenTrade(data, event) {
        signalInit.dispatch(data, event);
        // switch (event) {
        //     case DataEvent.ITEM_LIST:
        //         signalInit.dispatch(data, event);
        //         breadk;

        // }

    };

    function _reverseTrade(item) {
        if (DEMO) {
            var type = (item.side === OrderType.ASK) ? OrderType.BID : OrderType.ASK;

            if (item.side === OrderType.ASK) {
                type = OrderType.BID;
                item.lowPriceParts = [];
                item.lowPriceParts.push(item.marketPrice);
            }
            else {
                type = OrderType.ASK;
                item.highPriceParts = [];
                item.highPriceParts.push(item.marketPrice);

            }

            item.displayedValue = item.volume;
            item.askVWAP = item.marketPrice;
            item.bidVWAP = item.marketPrice;
            item.name = item.positionId;
            item.positionId = item.positionId;
            item.side = type;
            item.pareja = item.id;
            item.symbo_name = item.name;
        }


        MAE.OrdersMaeService.createOrderEspejo(item);

    };

    function _closeTrade(item) {

    };

    function _getCloseableVolumeData(groupingKey) {
        return 1;
    };

    function _itemDragAndDrop(e, t) {
        MAE.DepthService.itemDragAndDrop(e, t);
    };
    
    maeApi.subscribeOpenTrade(_onOpenTrade);

    var _openTradesService = {
        initSubscriptions: _initSubscriptions,
        removeSubscriptions: _removeSubscriptions,
        getCloseableVolumeData: _getCloseableVolumeData,
        reverseTrade: _reverseTrade,
        closeTrade: _closeTrade,
        itemDragAndDrop : _itemDragAndDrop
    };





    jq.extend(true, window, {
        MAE: {
            OpenTradesService: _openTradesService
        }
    });

})(jQuery)