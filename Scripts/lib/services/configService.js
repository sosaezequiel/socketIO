(function (jq){

    var e, t = 0, signal = new signals.Signal, a = {};

    this.setConfigPath = function(t) {
        e = t
    }
    ,
    //$http", "$rootScope
    get = function(i, o) {
        _init(e);
 
    };
    
    function _init(e) {
        t++;

        jq.extend(a, e.data);    
        // i.get(e).then(function(e) {
        //     angular.extend(a, e.data),
        //     window.buildNumber ? o.appVersion = a.VERSION + " (Build: " + window.buildNumber + ")" : o.appVersion = a.VERSION,
        //     o.appName = a.WL ? a.WL.TITLE : a.NAME;
        //     var n = _getConfigParam("WL.SETTINGS_DEFAULT_USER_DATA_PATH");
        //     n && s(n),
        //     n = _getConfigParam("WL.SETTINGS_DEFAULT_ACCOUNT_DATA_PATH"),
        //     n && c(n),
        //     t--,
        //     u()
        // }, function(e) {
        //     throw "Error while loading config: " + e.statusText
        // }).catch(xErrorHandler.throwErrorFromCatch)
    };
    function s(e) {
        t++;
        disparar()
        // i.get(e).then(function(e) {
        //     SettingsUtils.applyDefaultUserSettingsFromFile(SettingsDefaultUserData, e.data),
        //     t--,
        //     u()
        // }, function(e) {
        //     throw "Error while loading config: " + e.statusText
        // }).catch(xErrorHandler.throwErrorFromCatch)
    };
    function c(e) {
        t++;
        // i.get(e).then(function(e) {
        //     SettingsUtils.applyDefaultAccountSettingsFromFile(SettingsDefaultAccountData.CFD, e.data),
        //     t--,
        //     u()
        // }, function(e) {
        //     throw "Error while loading config: " + e.statusText
        // }).catch(xErrorHandler.throwErrorFromCatch)
    };
    function disparar() { //u
        0 === t && n.dispatch(a)
    };
    function _addConfigLoadedHandler(e) {
        signal.add(e)
    };
    function _removeConfigLoadedHandler(e) {
        signal.remove(e)
    };
    function _isConfigLoaded() {
        return 0 === t
    };
    function _getConfigParam(e) {
        return ObjectUtils.getFinalObjByPathStr(a, e, false);
    };
    

    jq.extend(true, window, {
        MAE: {
            ConfigService: {
                init : _init,
                addConfigLoadedHandler: _addConfigLoadedHandler,//l
                removeConfigLoadedHandler: _removeConfigLoadedHandler,//d
                isConfigLoaded: _isConfigLoaded,//S
                getConfigParam: _getConfigParam//p

            }
        }
    });

})(jQuery);