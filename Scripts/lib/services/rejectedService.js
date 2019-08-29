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

    function _onRejectd(event, data)
    {
        if(_list.length < data.length)
        {
            _list = data;
            MAE.LayoutService.activateModule(ModulesType.REJECTED);
        }

        signalInit.dispatch(event, data);
        // switch (event) {
        //     case DataEvent.ITEM_LIST:
        //         signalInit.dispatch(data, event);
        //         breadk;

        // }

    };

    function _itemDragAndDrop(e, t) {
        MAE.DepthService.itemDragAndDrop(e, t);
    };

    maeApi.subscribeRejectd(_onRejectd);


    var _rejectedService = {

        initSubscriptions : _initSubscriptions,
        removeSubscriptions : _removeSubscriptions,
        itemDragAndDrop : _itemDragAndDrop
    };


    jq.extend(true, window, {
        MAE: {
            RejectedService: _rejectedService
        }
    });

    
})(jQuery);