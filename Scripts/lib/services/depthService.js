(function (jq) {

    var maeApi = MAE.MaeApiService;
    var signalInit = new signals.Signal;
    var _list = [];

    var signalsDepth = {};
    var _resisedSignal = new signals.Signal;

    var eventos_depth = {
        OPEN_DEPTH: "openDepth",
        DRAG_AND_DROP: "dragAndDrop",
        LINK_DEPTH : "link_depth"
    };
    function obtenerSignal(e) {

        signalsDepth[e] || (signalsDepth[e] = new signals.Signal);

        return signalsDepth[e];

    };


    function _initSubscriptions(func) {
        signalInit.add(func);

    };

    function _removeSubscriptions(func) {
        signalInit.remove(func);

    };

    function _onDepth(event, data) {
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

    function _itemDragAndDrop(e, data) {

        var a;
        switch (e) {
            case "ITEM_START_DRAG":
                a = DepthEvent.ITEM_START_DRAG;
                break;
            case "ITEM_DRAG_DROP":
                a = DepthEvent.ITEM_DRAG_DROP;
                break;
            case "ITEM_END_DRAG":
                a = DepthEvent.ITEM_END_DRAG
        }
        obtenerSignal(eventos_depth.DRAG_AND_DROP).dispatch(a, data);


    };

    function _searchDepth(data) {

        //maeApi.searchGaranty(data);
    }

    // maeApi.subscribeGaranty(_onDepth);
    
    function _unsubscribeDragAndDrop(func) {
        obtenerSignal(eventos_depth.DRAG_AND_DROP).remove(func);
    };

    function _subscribeDragAndDrop(func) {
        obtenerSignal(eventos_depth.DRAG_AND_DROP).add(func);

    }

    function _unsubscribeLinkDepth(func) {
        obtenerSignal(eventos_depth.LINK_DEPTH).remove(func);
    };

    function _subscribeLinkDepth(func) {
        obtenerSignal(eventos_depth.LINK_DEPTH).add(func);

    }

    function _subscribeOpen(func) {
        obtenerSignal(eventos_depth.OPEN_DEPTH).add(func);
    }

    function _subscribeResized(func) {
        _resisedSignal.add(func);
    }

    function _unsubscribeOpen(func) {
        obtenerSignal(eventos_depth.OPEN_DEPTH).remove(func);
    }

    function _open(e, data) {
        obtenerSignal(eventos_depth.OPEN_DEPTH).dispatch(e, data);

    }

    function _init() {
        MAE.LayoutService.subscribeModuleAction(ModulesType.DEPTH, moduleAction_depth, "Depth_Module");

    }



    function moduleAction_depth(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:

                break;
            // case LayoutAction.MODULE_REMOVED:

            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                var module = MAE.LayoutService.getModule(ModulesType.DEPTH);
                _resisedSignal.dispatch({ height: module.content.height(), width: module.content.width() });
                break;
            // case LayoutAction.MODULE_ACTIVATED:

            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            case LayoutAction.MODULE_RESIZED:
                var module = MAE.LayoutService.getModule(ModulesType.DEPTH);

                _resisedSignal.dispatch({ height: module.content.height(), width: module.content.width() });
                break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:

            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:

        }


    };

    function _linkDepth(item)
    {
       
        obtenerSignal(eventos_depth.LINK_DEPTH).dispatch(item);
        
    }

    var _depthService = {

        initSubscriptions: _initSubscriptions,
        removeSubscriptions: _removeSubscriptions,
        searchDepth: _searchDepth,
        itemDragAndDrop: _itemDragAndDrop,
        open : _open,
        subscribeDragAndDrop : _subscribeDragAndDrop,
        unsubscribeDragAndDrop : _unsubscribeDragAndDrop,
        subscribeOpen : _subscribeOpen,
        unsubscribeOpen : _unsubscribeOpen,
        subscribeResized: _subscribeResized,
        unsubscribeLinkDepth : _unsubscribeLinkDepth,
        subscribeLinkDepth: _subscribeLinkDepth,
        linkDepth : _linkDepth,
        init: _init

    };


    jq.extend(true, window, {
        MAE: {
            DepthService: _depthService
        }
    });


})(jQuery);