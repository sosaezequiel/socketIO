//Layout
(function (t) {
    var e = {
        TAB_ADD: "tabAdd",
        TAB_REMOVE: "tabRemove",
        TAB_MOVE: "tabMove",
        TAB_SELECT: "tabSelect",
        TAB_MAXIMIZE: "tabMaximize",
        TAB_MINIMIZE: "tabMinimize",
        TAB_DETACH: "tabDetach",
        CONTAINERS_RESIZE: "containersResize",
        TRANSLATIONS_REQUEST: "translationsRequest",
        RESIZE_CONSTRAINT_REACHED: "resizeConstraintReached",
        RESIZE_CONSTRAINT_RELEASED: "resizeConstraintReleased"
    };
    var i = {
        FORCE_TAB_NAVIGATION_PREFERRED_SIZE: true,
        DEBUG_COMPONENTS_MEASUREMENTS: false,
        DEBUG_NAVIGATION_PREFERRED_SIZE_CALCULATIONS: false
    };
    var n = {
        hideMaximizeButtons: false,
        hideCloseTabButtons: false,
        hideTabNavigation: false
    };
    t.extend(true, window, {
        MAE: {
            Layout: _Layout, //o
            LayoutChangeRequestEvent: e,
            LayoutOptions: i,
            LayoutTranslations: {},
            LayoutConfig: {
                widgetMode: false
            }
        }
    });
    function _Layout(element) {
        if (!element) {
            throw "MAE.Layout needs to be configured with root DOM element";
        }
        var _xDividedContainerColl = [];//o
        var index = null;//r
        var _element = element;
        var _LayoutUtils = new MAE.LayoutUtils; //s
        var signal = new signals.Signal;
        function init() {
            agregarClassLayout();
            suscribirEventos()
        }
        function disparar() {
            signal.dispatch(e.TRANSLATIONS_REQUEST, ["LAYOUT.DETACH", "LAYOUT.MAXIMIZE", "LAYOUT.MINIMALIZE", "LAYOUT.CLOSE", "LAYOUT.EMPTY_CONTAINER", "LAYOUT.ADD_MODULE_OR_CHANGE_LAYOUT"])
        }
        function agregarClassLayout() {
            _element.addClass("xs-layout")
        }
        function suscribirEventos() {
            _element.on(e.TAB_ADD, addTab);//f
            _element.on(e.TAB_REMOVE, removeTab);//v
            _element.on(e.TAB_MOVE, moveTab);//m
            _element.on(e.TAB_MAXIMIZE, maximizeTab);//b
            _element.on(e.TAB_MINIMIZE, minimizeTab);//g
            _element.on(e.TAB_SELECT, selectTab);//E
            _element.on(e.TAB_DETACH, detachTab);//D
            _element.on(e.CONTAINERS_RESIZE, containers_resize);//y
            _element.on(e.RESIZE_CONSTRAINT_REACHED, resize_constraint_reached);//M
            _element.on(e.RESIZE_CONSTRAINT_RELEASED, resize_constraint_released);//T
            t(window).resize(function () {
                resize()
            })
        }
        function resize() {
            var t = {};
            var i = _xDividedContainerColl[index];
            t[i.id] = i.percentSize;
            signal.dispatch(e.CONTAINERS_RESIZE, t);
            _LayoutUtils.recalculateDividedContainersSize(i)
        }
        function addTab(t, e, i) {
            void 0;
            signal.dispatch(t.type, e, i)
        }
        function removeTab(t, e) {
            void 0;
            signal.dispatch(t.type, e)
        }
        function moveTab(t, e, i, n) {
            void 0;
            signal.dispatch(t.type, e, i, n)
        }
        function maximizeTab(t, e) {
            void 0;
            signal.dispatch(t.type, e)
        }
        function minimizeTab(t, e) {
            void 0;
            signal.dispatch(t.type, e)
        }
        function selectTab(t, e) {
            void 0;
            signal.dispatch(t.type, e)
        }
        function detachTab(t, e, i, n) {
            void 0;
            signal.dispatch(t.type, e, i, n)
        }
        function containers_resize(t, e) {
            void 0;
            void 0;
            signal.dispatch(t.type, e)
        }
        function resize_constraint_reached(t, e) {
            void 0;
            signal.dispatch(t.type, e)
        }
        function resize_constraint_released(t, e) {
            void 0;
            signal.dispatch(t.type, e)
        }
        function _registerActionHandler(t) {
            signal.add(t);
            disparar()
        }
        function _unregisterActionHandler(t) {
            signal.remove(t)
        }
        function _buildLayout(containerRoot, i, opt) {// e i d
            opt = t.extend({}, n, opt);
            i = i == undefined ? 0 : i;
            var _xDividedContainer = _xDividedContainerColl[i];
            if (_xDividedContainer) {
                _xDividedContainer.destroy()
            }
            _xDividedContainer = _LayoutUtils.parseLayout(containerRoot);
            _xDividedContainer.getDOMElement().addClass("content-layer");
            _xDividedContainer.getDOMElement().addClass("active-content-layer");
            index = i;
            _xDividedContainer.getDOMElement().attr("id", "contentLayer" + i);
            if (opt.hideTabNavigation) {
                _xDividedContainer.getDOMElement().addClass("hidden-tabs-container")
            }
            if (opt.hideCloseTabButtons) {
                _xDividedContainer.getDOMElement().addClass("hidden-close-tab-buttons")
            }
            if (opt.hideMaximizeButtons) {
                _xDividedContainer.getDOMElement().addClass("hidden-maximize-tab-buttons")
            }
            _xDividedContainerColl[i] = _xDividedContainer;
            noActivo();
            _element.append(_xDividedContainer.getDOMElement());
            _LayoutUtils.refreshTabbedContainersConstraints(_xDividedContainer);
            _LayoutUtils.recalculateDividedContainersSize(_xDividedContainer);
        }
        function noActivo() { //S
            _element.find(".content-layer").removeClass("active-content-layer")
        }
        function _destroyLayout(t) {
            var e = _xDividedContainerColl[t];
            if (e) {
                e.destroy();
                delete _xDividedContainerColl[t];
                if (index == t) {
                    index = null
                }
            }
        }
        function _setActiveLayoutLevel(t) {
            var e = _xDividedContainerColl[t];
            if (!e) {
                return
            } else {
                _element.find(".content-layer").removeClass("active-content-layer");
                index = t;
                e.getDOMElement().addClass("active-content-layer");
                resize()
            }
        }
        function _addTab(t, i) {
            i = i == undefined ? index : i;
            var n = _xDividedContainerColl[i];
            if (!n) {
                return
            }
            var a = _LayoutUtils.findContainer(t.parentId, n);
            if (a) {
                a.addModuleContainer(t);
                var d = _LayoutUtils.getMaximizedContainer(n);
                if (d && d != a) {
                    d.DOMElement.trigger(e.TAB_MINIMIZE, [d.getActiveModuleId()])
                }
            }
        }
        function _addSubTab(t, e) { }
        function _removeTab(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            var n = _LayoutUtils.findModuleTabbedContainer(t, i);
            if (n) {
                n.removeModule(t)
            }
        }
        function _removeSubTab(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            var n = _LayoutUtils.findSubmodulesContainer(t, i);
            if (n) {
                n.removeModule(t)
            }
        }
        function _moveTab(t, e, i, n) {
            n = n == undefined ? index : n;
            var a = _xDividedContainerColl[n];
            if (!a) {
                return
            }
            var d = _LayoutUtils.findModuleTabbedContainer(t, a);
            var h = _LayoutUtils.findContainer(e, a);
            if (!d || !h) {
                return
            }
            if (d.id == h.id) {
                d.changeTabIndex(t, i)
            } else {
                var l = d.detachModuleContainer(t);
                h.insertModuleContainer(l, i)
            }
        }
        function _selectTab(t, i, Z) {
            i = i == undefined ? index : i;
            var n = _xDividedContainerColl[i];
            if (!n) {
                return
            }
            var a = _LayoutUtils.findModuleTabbedContainer(t, n);
            if (a) {
                if (!a.isMaximized) {
                    var d = _LayoutUtils.getMaximizedContainer(n);
                    if (d) {
                        d.DOMElement.trigger(e.TAB_MINIMIZE, [d.getActiveModuleId()])
                    }
                }
                a.selectModule(t, Z)
            }
        }
        function _setTabContent(t, e, i) {
            i = i == undefined ? index : i;
            var n = _xDividedContainerColl[i];
            if (!n) {
                return
            }
            var a = _LayoutUtils.findModuleTabbedContainer(t, n);
            if (a) {
                a.setModuleContent(t, e)
            }
        }
        function _setTabHeader(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            var n = _LayoutUtils.findModuleTabbedContainer(t.id, i);
            if (n) {
                n.setTabHeader(t.id, t.headerLabel, t.headerElement, t.headerTooltip)
            }
        }
        function _maximizeTab(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            var n = _LayoutUtils.findModuleTabbedContainer(t, i);
            if (n) {
                _LayoutUtils.hideAllTabs(i);
                n.maximize()
            }
        }
        function _minimizeTab(t) {
            t = t == undefined ? index : t;
            var e = _xDividedContainerColl[t];
            if (!e) {
                return
            }
            _LayoutUtils.minimizeAllTabs(e)
        }
        function _isTabMaximized(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            return _LayoutUtils.isTabMaximized(t, i)
        }
        function _getCurrentMaximizedTabId(t) {
            t = t == undefined ? index : t;
            var e = _xDividedContainerColl[t];
            if (!e) {
                return
            }
            var i = _LayoutUtils.getMaximizedContainer(e);
            if (i) {
                return i.getActiveModuleId()
            } else {
                return null
            }
        }
        function _getCurrentMaximizedContainerId() {
            var t = _xDividedContainerColl[index];
            if (!t) {
                return null
            }
            var e = _LayoutUtils.getMaximizedContainer(t);
            if (e) {
                return e.id
            } else {
                return null
            }
        }
        function _setAvailableTabs(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            var n = _LayoutUtils.getMaximizedContainer(i) != null;
            _LayoutUtils.setAvailableTabs(i, t, !n)
        }
        function _hideAvailableTabsDropdown(t) {
            t = t == undefined ? index : t;
            var e = _xDividedContainerColl[t];
            if (!e) {
                return
            }
            _LayoutUtils.hideAvailableTabsDropdown(e)
        }
        function _setTranslations(t) {
            for (var e in t) {
                MAE.LayoutTranslations[e] = t[e]
            }
        }
        function _setConfig(e) {
            t.extend(MAE.LayoutConfig, e)
        }
        function _hideModuleLoader(t, e) {
            e = e == undefined ? index : e;
            var i = _xDividedContainerColl[e];
            if (!i) {
                return
            }
            void 0;
            var n = _LayoutUtils.findModuleContainer(t, i);
            if (n) {
                n.hideLoader()
            }
        }
        init();
        return {
            registerActionHandler: _registerActionHandler,//C
            unregisterActionHandler: _unregisterActionHandler,//O,
            setConfig: _setConfig,//k,
            buildLayout: _buildLayout, //x,
            destroyLayout: _destroyLayout,//I,
            setActiveLayoutLevel: _setActiveLayoutLevel,//_,
            addTab: _addTab, //A,
            addSubTab: _addSubTab,// R,
            removeTab: _removeTab,// L,
            removeSubTab: _removeSubTab,//B,
            moveTab: _moveTab, //H,
            selectTab: _selectTab,//N,
            setTabContent: _setTabContent, //z,
            setTabHeader: _setTabHeader, //w,
            maximizeTab: _maximizeTab, //X,
            minimizeTab: _minimizeTab, //P,
            isTabMaximized: _isTabMaximized, //W,
            getCurrentMaximizedTabId: _getCurrentMaximizedTabId, //U,
            getCurrentMaximizedContainerId: _getCurrentMaximizedContainerId, //G,
            setAvailableTabs: _setAvailableTabs, //Z,
            setTranslations: _setTranslations, //V,
            hideModuleLoader: _hideModuleLoader, //q,
            hideAvailableTabsDropdown: _hideAvailableTabsDropdown //j
        }
    }
}
)(jQuery);