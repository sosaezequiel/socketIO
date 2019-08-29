(function (jq) {
    var signalGlobal = new signals.Signal;

    function _addHandle(f)
    {
        signalGlobal.add(f);

    }

    function removeHandle(f)
    {
        signalGlobal.remove(f);
    }


    function _broadcast(mainEvent)
    {
        console.log("mainEvent " + mainEvent);
        signalGlobal.dispatch(mainEvent);
    }

    var _rootScope = {
        widgetMode: false,
        detachMode: false,
        searchParams: {
            activateModule: null
        },
        broadcast :_broadcast,
        specifiedModuleMode : false,
        specifiedModuleId : null,
        desktopMode : "",
        specifiedWidgetType : null,
        basketView: false,
        addHandle : _addHandle
        //sessionType : SymbolSessionType.OPEN
    };

    // var _sessionType = SymbolSessionType.OPEN;
    // Object.defineProperty(_rootScope, "sessionType" , {
    //     get : function()
    //     {
    //         return _sessionType;
    //     },
    //     set : function(value)
    //     {
    //         _sessionType = value;
    //         signalGlobal.dispatch({ sessionType : _sessionType });


    //     }
    // });

    jq.extend(true, window, {
        rootScope: _rootScope
    });

    var _sessionType = SymbolSessionType.OPEN;
    Object.defineProperty(rootScope, "sessionType" , {
        get : function()
        {
            return _sessionType;
        },
        set : function(value)
        {
            _sessionType = value;
            signalGlobal.dispatch({ sessionType : _sessionType });


        }
    });

})(jQuery);