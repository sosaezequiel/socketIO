function SubmoduleMockLayoutState() {
    function _subscribeModuleAction(e) {
        signal.add(e);
        if (a) {
            _subscribeModuleAction(LayoutAction.MODULE_ADDED);
            _subscribeModuleAction(LayoutAction.MODULE_ADDED);
        }
        if (o)
            _subscribeModuleAction(LayoutAction.MODULE_ACTIVATED);


    }
    function _unsubscribeModuleAction(e) {
        signal.remove(e)
    }
    function _setModuleLayoutState(e, t) {

        if (a != e) {
            a = e;
            if (a)
                signal.dispatch(LayoutAction.MODULE_ADDED);
            else
                signal.dispatch(LayoutAction.MODULE_REMOVED);

            a ? signal.dispatch(LayoutAction.MODULE_ADDED) : signal.dispatch(LayoutAction.MODULE_REMOVED)
        }
        if (o != t) {
            o = t;
            if (o)
                signal.dispatch(LayoutAction.MODULE_ACTIVATED);
            else
                signal.dispatch(LayoutAction.MODULE_DEACTIVATED);
        }

    }
    function _forwardLayoutAction(e) {
        signal.dispatch(e)
    }
    function _dispose() {
        a = false;
        o = false;
        signal.removeAll();
    }
    var a = false
        , o = false
        , signal = new signals.Signal;
    return {
        subscribeModuleAction: _subscribeModuleAction,//e
        unsubscribeModuleAction: _unsubscribeModuleAction,//t
        setModuleLayoutState: _setModuleLayoutState,//r
        forwardLayoutAction: _forwardLayoutAction,//n
        dispose: _dispose//i
    }
}