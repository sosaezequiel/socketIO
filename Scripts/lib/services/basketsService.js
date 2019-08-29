(function (jq){

    var t = new SubmoduleMockLayoutState;
    function _getModuleMockLayout() {
        return t;
    }
    


    var _basketsService = {
        getModuleMockLayout : _getModuleMockLayout
    };


    jq.extend(true, window, {
        MAE: {
            BasketsService: _basketsService
        }
    });

})(jQuery);