(function (jq){

    var signalsChart = {};
    var _resisedSignal = new signals.Signal;

    var eventos_Chart = {
        OPEN_CHART: "openChart",
        OPEN_CHART_REJECTED: "openChartRejected",
        SHOW_OPEN_TRADE: "showOpenTrade",
        SHOW_PENDING_TRADE: "showPendingTrade",
        SHOW_HISTORY_TRADES: "showHistoryTrades",
        SHOW_CALENDAR_EVENT: "showCalendarEvent",
        DRAG_AND_DROP: "dragAndDrop"
    };
    function obtenerSignal(e) {
        
        signalsChart[e] || (signalsChart[e] = new signals.Signal);

        return signalsChart[e];
        
    };

    function _itemDragAndDrop(e, data)
    {

        var a;
        switch (e) {
        case "ITEM_START_DRAG":
            a = ChartEvent.ITEM_START_DRAG;
            break;
        case "ITEM_DRAG_DROP":
            a = ChartEvent.ITEM_DRAG_DROP;
            break;
        case "ITEM_END_DRAG":
            a = ChartEvent.ITEM_END_DRAG
        }
        obtenerSignal(eventos_Chart.DRAG_AND_DROP).dispatch(a, data);
        //alert(data.item.key);

    };

    function _unsubscribeDragAndDrop(func)
    {
        obtenerSignal(eventos_Chart.DRAG_AND_DROP).remove(func);
    };

    function _subscribeDragAndDrop(func)
    {
        obtenerSignal(eventos_Chart.DRAG_AND_DROP).add(func);

    }

    function _subscribeOpen(func)
    {
        obtenerSignal(eventos_Chart.OPEN_CHART).add(func);
    }
    
    function _subscribeResized(func)
    {
        _resisedSignal.add(func);
    }

    function _unsubscribeOpen(func)
    {
        obtenerSignal(eventos_Chart.OPEN_CHART).remove(func);
    }

    function _open(e, data)
    {
        obtenerSignal(eventos_Chart.OPEN_CHART).dispatch(e, data);

    }

    function _init() {
        MAE.LayoutService.subscribeModuleAction(ModulesType.CHARTS, moduleAction_chart, "Chart_Module");

    }

    

    function moduleAction_chart(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                   
                break;
            // case LayoutAction.MODULE_REMOVED:

            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                var module = MAE.LayoutService.getModule(ModulesType.CHARTS);
                _resisedSignal.dispatch({ height : module.content.height(), width: module.content.width() });
                break;
            // case LayoutAction.MODULE_ACTIVATED:

            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
             case LayoutAction.MODULE_RESIZED:
                var module = MAE.LayoutService.getModule(ModulesType.CHARTS);

                _resisedSignal.dispatch({ height : module.content.height(), width: module.content.width() });
            break;    
            // case LayoutAction.MODULE_CONTAINER_CHANGED:

            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
           
        }


    };


    var _chartsService = {
        itemDragAndDrop : _itemDragAndDrop,
        open : _open,
        subscribeDragAndDrop : _subscribeDragAndDrop,
        unsubscribeDragAndDrop : _unsubscribeDragAndDrop,
        subscribeOpen : _subscribeOpen,
        unsubscribeOpen : _unsubscribeOpen,
        subscribeResized: _subscribeResized,
        init : _init

    };

    jq.extend(true, window, {
        MAE: {
            ChartsService: _chartsService
        }
    });

})(jQuery);