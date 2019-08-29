(function (jq) {

    var r = MAE.LayoutService;
    var d = MAE.I18nService;
    var t = MAE.SettingsService;
    var u = MAE.DepthService;

    var scope = {};
    var element;
    var i_cuenta_nuevasOrdenes = 0;

    var moduleWrapper;

    var _moduleIsReadyFlag = false;
    var _moduleActivatedFirstTime = false;
    var _initSubcription = false;
    var _data_jsp;


    function _isLoad() {
        return scope.isAlive;
    };

    function _link(_element, attrs) {
        element = _element;

        _render();



        function _moduleAction(e) {//f
            switch (e) {
                case LayoutAction.MODULE_ADDED:
                    module_added();
                    break;
                case LayoutAction.MODULE_REMOVED:
                    module_removed();
                    break;
                case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                    if (!scope.isAlive) {
                        init_subcription();
                        module_activated_first_time();
                    }

                    break;
                case LayoutAction.MODULE_ACTIVATED:
                    module_activated_first_time();
                    break;
                case LayoutAction.MODULE_DEACTIVATED:
                    module_deactivated();
                    break;
                case LayoutAction.MODULE_RESIZED:
                    module_resized();
                    break;
                case LayoutAction.MODULE_CONTAINER_CHANGED:
                    moduleWrapper = element.closest(".xs-module-wrapper");
                    module_resized();
                    break;
                case LayoutAction.LAYOUT_OVERLAY_HIDE:
                    i.trackPageView(ModulesType.DEPTH)
            }
        }
        function module_added() {//y
            moduleWrapper = element.closest(".xs-module-wrapper");
        }


        function module_removed() {//C
            r.unsubscribeModuleAction(ModulesType.DEPTH, _moduleAction);
            MAE.DepthService.unsubscribeDragAndDrop(_dragAndDrop);
            MAE.DepthService.unsubscribeLinkDepth(_linkDepth);

            scope.isAlive = false;
            _initSubcription = false;
            _moduleIsReadyFlag = false;
        }
        function init_subcription() {//S

            if (!_initSubcription) {
                _initSubcription = true;

            }
            scope.isAlive = true;
        }
        function module_activated_first_time() {//E
            _moduleActivatedFirstTime = true;
            var el_viewport = element.find(".depth-panel");
            el_viewport.jScrollPane({
                contentWidth: '0px'
            });
            _data_jsp = el_viewport.data("jsp");

            _refreshDepth();
        }
        function module_deactivated() {//P
            _moduleActivatedFirstTime = false;
        }
        function module_resized() {//A
            var el_viewport = element.find(".depth-panel");
            el_viewport.jScrollPane({
                contentWidth: '0px'
            });
            _data_jsp = el_viewport.data("jsp");
        }



        MAE.LayoutService.subscribeModuleAction(ModulesType.DEPTH, _moduleAction, "depthModule");

    };
    function _linkDepth(item) {
        if (_data_jsp)
            _data_jsp.scrollToY(0)
    }

    function estaContenido(clientX, clientY) {

        const abajoDeMouse = document.elementFromPoint(clientX, clientY);
        if (moduleWrapper[0].contains(abajoDeMouse))
            return true;
        else
            return false;

    }
    var text_title, text_desc;
    function _dragAndDrop(e, data) {
        switch (e) {
            case "DepthEvent.ITEM_START_DRAG":
                text_title = moduleWrapper.parent().parent().find(".xs-empty-module-container-text-title").html();
                text_desc = moduleWrapper.parent().parent().find(".xs-empty-module-container-text-desc").html();
                moduleWrapper.parent().parent().find(".xs-empty-module-container-text-title").html("drag and drop");
                moduleWrapper.parent().parent().find(".xs-empty-module-container-text-desc").html("---------")

                // MAE.LayoutService.activateModule(ModulesType.DEPTH);
                moduleWrapper.first().addClass("show-drag");
                break;
            case "DepthEvent.ITEM_DRAG_DROP":
                var clientX = data.event.clientX;
                var clientY = data.event.clientY;

                if (estaContenido(clientX, clientY)) {
                    moduleWrapper.first().addClass("show-drag-in");
                }

                break;
            case "DepthEvent.ITEM_END_DRAG":
                moduleWrapper.removeClass("show-drag");

                setTimeout(function () {
                    moduleWrapper.first().removeClass("show-drag show-drag-in");
                    moduleWrapper.parent().parent().find(".xs-empty-module-container-text-title").html(text_title);
                    moduleWrapper.parent().parent().find(".xs-empty-module-container-text-desc").html(text_desc);
                }, 500);

                break;
        }
    }

    function _moduleIsReady() {//b
        if (!_moduleIsReadyFlag) {
            _moduleIsReadyFlag = true;
            MAE.LayoutService.moduleIsReady(ModulesType.DEPTH);
        }
    }

    function _render(id) {

        MAE.DepthRoot.Init("div[depth-module]");
        MAE.DepthService.subscribeDragAndDrop(_dragAndDrop);
        MAE.DepthService.subscribeLinkDepth(_linkDepth);



        // element.find(".depth-panel").css("height", "90%");
        // element.find(".depth-panel").css("width", "90%");

        _moduleIsReady();

    };

    function _toggleGridView() {

    };

    function _focusGrid() {

    };

    function _refreshDepth() {
        myWorker.postMessage({
            onPendingTrade: true
        });
    };

    jq.extend(true, window, {
        MAE: {
            DepthModule:
            {
                link: _link,
                isLoad: _isLoad,
                toggleGridView: _toggleGridView,
                focusGrid: _focusGrid,
                refreshDepth: _refreshDepth
            }
        }
    });
})(jQuery);