
(function (jq) {



    var _grid;
    var _items;
    var _dataView;
    var current_category;
    var _moduleType = ModulesType.MARKET_WATCH_DEPTH;
    var estaArmado = false;
    var $moduleWrapper;
    var $gridContainer;
    var flag_selected = false;
    var signalSymbol = new signals.Signal();
    var grupoByName = {};//puede servir
    var _priceChangeTrack = {}
    var _ticketSymbol;
    var Gt = false; //flag
    var ht = false;
    var Tt = null;

    var scope = {
        isAlive: false
    };

    function _isLoad() {
        return scope.isAlive;
    };

    function _toggleGridView() {

        scope.toggleGridView();
    };


    function _link(element, attrs) {//n, v, y

        estaArmado = false;

        function _makeBlokAndAppend(template_id, place_holder_id) {
            // var data = _render(template_id);
            // element.find("#" + place_holder_id).html(data);

            var template = jq.templates("#" + template_id);
            template.link(element.find("#" + place_holder_id), scope);
        }

        function _render(id) {

            var template = jq.templates("#" + id);
            var renderOut = template.render(scope);

            return renderOut;

        };

        function _makeBody() {
            var data = jq("#marketWatchDepthtemplate").html();
            //var template = jq.templates(data);
            //template.link(element, scope);
            element.html(data);

        };

        function collapseAllGroups() {//collapseAllGroups
            _dataView && _dataView.collapseAllGroups()
        };


        function armarAndSubscribir() {//b
            var d = MAE.SessionService;
            var c = MAE.MarketWatchService;
            armarEntorno();
            MAE.MarketWatchDepthService.suscribeChangeCategory(onDataProviderEvent);
            MAE.MarketWatchDepthService.subcribePriceChangeUpdate(onPriceChangeUpdate);
            MAE.MarketWatchDepthService.subcribeQuotesLoaded(onQuotesLightLoaded);
            MAE.MarketWatchDepthService.initData();

            estaArmado = true;
        }
        function armarEntorno() {//T

            setmwView();
            slickBuild();
        }
        function setModuleWrapper() {//h
            $moduleWrapper = element.closest(".xs-module-wrapper")
        }
        function selected(e) { //A

            for (var i = 0; i < scope.menuSymbolCategories.length; i++) {
                var t = scope.menuSymbolCategories[i];
                t.selected = t.value == e;
            }

        }


        function set_grupos(e) {//k
            pluingGroupByName.forcedGroupOrder = scope.forcedGroupOrder[e];
            _dataView.setGrouping(pluingGroupByName);

        }

        function onDataProviderEvent(e, t) {//I
            switch (e) {
                case DataProviderEvent.ITEM_UPDATED:
                    item_updated(t);
                    break;
                case DataProviderEvent.ITEMS_LOADED:
                    items_loaded(t);
                    break;

            }
        }
        function item_updated(e) {//w


            var t = _dataView.getItemById(e.key);
            if (t) {
                if (!Gt) {
                    Gt = true;
                    _dataView.beginUpdate();
                    requestAnimationFrame(animar);
                }
                _dataView.updateItem(e.key, e);
                if (Tt && e.key === Tt.key) {
                    Tt = e;
                    ht = true;
                }
            }
        }
        function clear_animar() {//F
            ht = false;
            setCurrentTicketSymbol(Tt);
            Tt = null;
        }
        function animar() {//R
            Gt = false;

            if (_dataView) {
                _dataView.reSort();
                _dataView.endUpdate();
                if (ht)
                    clear_animar();
            }
        }
        function tratar_favoriteGroups() { //_
            var e, t, o, r, a, i = [], s = scope.favoriteGroups;
            if (s)
                for (e = 0, o = s.length; e < o; e++) {
                    for (scope.forcedGroupOrder[SymbolCategories.FAVORITES].push(s[e].id), t = 0, r = s[e].instruments.length; t < r; t++)
                        a = l.getQuote(s[e].instruments[t]), a ? a.favoriteGroup = s[e].id : i.push(t);

                    if (i.length > 0)
                        for (t = i.length - 1; t >= 0; t--)
                            c.removeFavoriteSymbol(s[e].instruments[i[t]]), s[e].instruments.splice(i[t], 1), i = []

                }
        };

        function _updateScopeChild(obj) {
            //MAE.SymbolsSearchBarExtended.update(obj);

        }

        function items_loaded(t) {//O
            if (t && (_items = t, _grid)) {
                _updateScopeChild({ symbols: t });
                var o = MAE.MarketWatchDepthService.getSelectedCategoryName();
                _dataView.beginUpdate();
                _dataView.setItems(_items, "key");
                _dataView.collapseAllGroups();
                _dataView.endUpdate();
                updateRowCountAndrender();
                _grid.invalidate();


                if (1 == _items.length) {
                    setTimeout(function () {
                        scope.delayedGridSizeUpdate()
                    }, 0, true);
                }
                else {
                    efectoheight();

                }

            }
        }
        function menuSymbolCategoriesBuild() {

            var porfolios = MAE.SettingsService.getUserValue(SettingsTypeUser.MARKET_WATCH_PORFOLIOS);
            scope.menuSymbolCategories = [];
            for (var i_p = 0; i_p < porfolios.length; i_p++) {
                scope.menuSymbolCategories.push(porfolios[i_p]);
            }


            scope.categoryBtnWidth = (100 / (scope.menuSymbolCategories.length + 2)).toFixed(3) + "%";
            var selected_category;
            selected_category = MAE.SettingsService.getUserValue(SettingsTypeUser.MARKET_WATCH_CATEGORY);


            var t = false;

            if (null != selected_category) {
                for (var o = 0; o < scope.menuSymbolCategories.length; o++) {
                    var o_ = scope.menuSymbolCategories[o];
                    if (o_.value == selected_category) {
                        o_.selected = true;
                        scope.categorySelected(o_);
                        t = true;
                    }

                }
            }
            if (!t && scope.menuSymbolCategories.length > 0) {
                scope.menuSymbolCategories[0].selected = true;
                scope.categorySelected(scope.menuSymbolCategories[0]);
            }

            _makeBlokAndAppend("marketWatchtemplateCategory", "marketwatch-depth-categories");

            for (var o = 0; o < scope.menuSymbolCategories.length; o++) {
                var o_ = scope.menuSymbolCategories[o];
                jq("#marketwatch-depth-categories #" + o_.value).on("click", function (v) {

                    scope.categorySelected({ value: $(this).attr("id") });
                    jq(".xs-marketwatch-category-button").removeClass("selected");
                    $(this).addClass("selected");
                });

            }

        }

        function setmwView() {//H


        };

        function setGridViewMode() {//K
            _grid && _grid.setGridViewMode(scope.viewMode)
        }
        function L_formatter(e, t, o, r, i) {//L
            if (scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS)
                return "";
            if (i.symbol.name != _grid.getSingleItemRendererData()) {

                var s = ""
                    , u = ""
                    , c = "";
                if (i.sessionType != SymbolSessionType.OPEN) {
                    if (rootScope.sessionType == SymbolSessionType.CLOSED) {
                        s = "mw-session-type-closed-icon mw-session-type-icon";
                        u = " xs-session-closed";
                        c = MAE.I18nService.getFrequentString("SYMBOL_SESSION.MARKET_CLOSED");

                    }
                    else {
                        if (rootScope.sessionType == SymbolSessionType.PRE_OPEN) {
                            s = "mw-session-type-preopen-icon mw-session-type-icon";
                            u = " xs-session-preopen";
                            c = MAE.I18nService.getFrequentString("SYMBOL_SESSION.MARKET_PRE_OPENED");
                        }
                    }

                }
                else {

                    //s = "mw-ct-price-" + i.tick.priceChangeDirection + "-icon mw-price-icon";

                }

                //                return '<div class="' + s + '" title="' + c + '"></div><div class="xs-symbol-name  xs-symbol-full-name ' + u + '" title="' + i.symbol.fullDescription + '">' + i.symbol.name + '</span></div><div class="xs-symbol-desc xs-symbol-full-name"  title="' + i.symbol.fullDescription + '">' + i.symbol.fullDescription + "</div>";
                return '<div class="xs-symbol-name  xs-symbol-full-name ' + u + '" title="' + i.symbol.fullDescription + '">' + i.symbol.name + '</span></div><div class="xs-symbol-desc xs-symbol-full-name"  title="' + i.symbol.fullDescription + '">' + i.symbol.fullDescription + "</div>";

            }
            return ""
        }
        function U_formatter(e, t, o, r, a) {
            return scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS ? "" : a.tick ? rootScope.sessionType != SymbolSessionType.OPEN ? '<span class="xs-session-closed">' + o + "</span>" : o : ""
        }
        function formato_change(e, t, o, r, dataItem) {//V
            var precision = 2;

            if (scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS)
                return "";
            if (!dataItem.symbol)
                return "";
            var i = "";

            if (rootScope.sessionType != SymbolSessionType.OPEN)
                i = " xs-session-closed";

            if (0 == scope.dailyChangeMode) {
                var s = o;
                return isNaN(s) ? '<span class="ct-daily-change-value ' + i + '">-</span>' : s > 0 ? '<span class="ct-daily-change-value-up ' + i + '">+' + s.toFixed(precision) + " pips</span>" : s < 0 ? '<span class="ct-daily-change-value-down ' + i + '">' + s.toFixed(precision) + " pips</span>" : '<span class="ct-daily-change-value ' + i + '">' + s.toFixed(precision) + " pips</span>"
            }
            var l = o;
            var _result = '';

            if (isNaN(l))
                _result = '<span class="ct-daily-change-value ' + i + '">-</span>';
            else {
                if (l > 0)
                    _result = '<span class="ct-daily-change-value-up ' + i + '">+' + l.toFixed(precision) + "%</span>";
                else {
                    if (l < 0)
                        _result = '<span class="ct-daily-change-value-down ' + i + '">' + l.toFixed(precision) + "%</span>";
                    else
                        _result = '<span class="ct-daily-change-value ' + i + '">-</span>';

                }

            }

            return _result;
        }

        function Q_formatter(e, t, o, r, a) {
            var i;
            if (scope.viewMode === Slick.GridAdvancedMode.LIST_OF_ITEMS)
                return "";
            else {
                if (a.tick) {
                    i = FormatUtils.formatThousandSeparator(o, a.symbol.precision);
                    i = +i === 0 ? "-" : i;
                    if (rootScope.sessionType !== SymbolSessionType.OPEN)
                        return '<span class="xs-session-closed">' + i + "</span>";
                    else
                        return i;
                }
                else
                    return "";
            }

        }
        function B_formatter(e, t, o, r, a) {
            if (scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS)
                return "";
            if (!a.tick)
                return "";
            var i = Slick.Formatters.HoursMinutesSeconds(e, t, o, r, a);
            return a.sessionType != SymbolSessionType.OPEN ? '<span class="xs-session-closed">' + i + "</span>" : i
        }
        function Y_formatter() {
            return '<span class="xs-btn xs-btn-gray xs-mw-widget-trade-btn">' + Ht + "</span>"
        }
        function _dataItemColumnValueExtractor(e, t) {//z
            if (e instanceof Slick.Group)
                return e[t.field];
            if (!e.tick)
                return 0;
            switch (t.field) {
                case "bid":
                    return e.tick.bid;
                case "ask":
                    return e.tick.ask;
                case "low":
                    return void 0 !== e.tick.low ? e.tick.low : 0;
                case "high":
                    return void 0 !== e.tick.high ? e.tick.high : 0;
                case "time":
                    return e.tick.timestamp;
                case "dailyChange":
                    var o = _priceChangeTrack[e.tick.key];



            }
            return e[t.field];
        }


        function dragOutside(e, t) {//se
            MAE.MarketWatchDepthService.itemDragAndDrop(e, t);
        }

        function setWidth() {//de

            var e = $moduleWrapper.width();
            $gridContainer.css("width", e + "px");
        }
        function group_comparer(e, t) {//ge
            return e.title < t.title ? -1 : e.title > t.title ? 1 : 0;
        }
        function group_formatter(e) {//me
            return '<div class="slick-group-toggle">' + MAE.I18nService.getFrequentString("MARKET_WATCH_GROUP." + e.value.toUpperCase().replace(" ", "_")) + "</div>"
        }
        function pe(e) {
            return '<div class="slick-group-toggle">' + MAE.I18nService.getFrequentString("MARKET_WATCH_GROUP." + AssetClass[e.value].name) + "</div>"
        }
        function ve(e) {
            return "" == e.value ? '<div class="slick-group-toggle">' + MAE.I18nService.getString("MARKET_WATCH_CATEGORY.FAVORITES") + "</div>" : '<div class="slick-group-toggle">' + MarketWatchUtils.getFavoriteGroupById(scope.favoriteGroups, e.value).name + "</div>"
        }
        function slickBuild() {//ye
            $gridContainer = jq("#mwDepthGrid");

            var pluingDataProvider = new Slick.Data.GroupItemMetadataProvider({
                colspan: "*",
                additionalToggleCssClasses: ["slick-cell", "slick-group-title"],
                groupCssClass: "xs-mw-symbol-group slick-group-toggle"
            });
            _dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: pluingDataProvider,
                inlineFilters: false
            });



            optionsGrid = jq.extend({
                getScrollPosition: function (e) {
                    return _data_jsp ? {
                        top: _data_jsp.getContentPositionY(),
                        left: _data_jsp.getContentPositionX()
                    } : {}
                },
                getScrollDimensions: function (e) {
                    return {
                        width: ScrollDimensions.WIDTH,
                        height: ScrollDimensions.HEIGHT
                    }
                },
                setScrollLeft: function (e, t) {
                    _data_jsp ? _data_jsp.scrollByX(t) : e.scrollLeft(t)
                },
                setScrollTop: function (e, t) {
                    _data_jsp ? setTimeout(function () {
                        _data_jsp.scrollToY(t)
                    }, 0) : e.scrollTop(t)
                },
                gridContainerClass: "slick-mw-drag-container",
                editable: false,
                autoEdit: false,
                enableCellNavigation: true
            }, Pt);
            setWidth();
            t = MAE.DatagridService;
            t.getColumnsFromSettings(_moduleType, _columms_extend);
            _grid = new Slick.GridAdvanced("#mwDepthGrid", _dataView, _columms_extend, optionsGrid);
            // _grid.setNgScope(n);
            // _grid.setNgParse(n);
            // _grid.registerPlugin(xt);
            _grid.registerPlugin(pluingRowManager);
            _grid.registerPlugin(pluingDataProvider);

            MAE.DatagridService.registerDatagrid(_moduleType, _grid, _columms, true);

            var slick_viewport = element.find("div.slick-viewport");
            slick_viewport.jScrollPane({
                showArrows: false,
                contentWidth: "0px"
            });
            _data_jsp = slick_viewport.data("jsp");
            window["data-temp"] = _data_jsp;
            slick_viewport.bind("jsp-scroll-y", function () {
                //scope.closeMWContextMenu()
            });

            _dataView.setItems([], "key");
            _dataView.setGrouping(pluingGroupByName);

            efectoheight();
            _gridSubcribe();
        }
        function updateRowCountAndrender() {//fe
            _grid.updateRowCount();
            _grid.render();
        }
        function efectoheight() {//Se
            if (_grid) {
                $gridContainer.css("height", $moduleWrapper.height() - 77 + "px");
                setWidth();
                _grid.resizeCanvas();
            }
            setTimeout(function () {
                if (_data_jsp && !flag_selected) {
                    _data_jsp.reinitialise();
                    Ee();
                }

            }, 0);
        }


        function onKeyDown(e, data, grid) {

            if (data.row === undefined) {
                _grid.setSelectionModel(new Slick.RowSelectionModel);
                _grid.setSelectedRows([0]);
            }

            if (data.row != undefined && e.keyCode == 13) {

                var n = _grid.getDataItem(data.row);
                if (n && n instanceof Slick.Group) {

                    scope.groupingKey = n.groupingKey;
                    if (n.collapsed) {
                        _grid.getData().expandGroup(n.groupingKey)
                    } else {
                        _grid.getData().collapseGroup(n.groupingKey)
                    }
                    collapseGroup(n.groupingKey);
                    _grid.setSelectionModel(new Slick.RowSelectionModel);

                    var t_g = _dataView.getGroups();

                    for (var i = 0; i < t_g.length; i++) {
                        o = t_g[i];
                        r = true;
                        if (o.groupingKey == n.groupingKey) {
                            _grid.setSelectedRows([i]);
                            break;
                        }
                    }

                    //la primera
                    //t.preventDefault()
                }
                else {


                    _grid.onSingleClick.notify(data, e, _grid);


                }
                //_grid.onClick.notify(data, e, _grid);

            }
            if (data.row != undefined && e.keyCode == 27) {
                if (!rootScope.widgetMode) {
                    var n = _grid.getDataItem(data.row);


                }
            }
            if (data.row != undefined && e.keyCode == 73) {
                if (!rootScope.widgetMode) {
                    var n = _grid.getDataItem(data.row);
                    if (!Slick.GlobalEditorLock.isActive())
                        Slick.GlobalEditorLock.activate();
                }
            }



            if (data.row != undefined && e.keyCode == 49 && e.shiftKey) {
                var n = _grid.getDataItem(data.row);
                MAE.PopupsService.showInfo(n);
            }
            if (data.row != undefined && e.keyCode == 50 && e.shiftKey) {
                var n = _grid.getDataItem(data.row);
                MAE.ChartsService.open(ChartEvent.OPEN_CHART, n.symbol);
            }

            if (data.row != undefined && e.keyCode == 51 && e.shiftKey) {
                var n = _grid.getDataItem(data.row);
                MAE.PopupsService.showTrade(n);
            }
        };

        function onSort(e, t) {//be
            scope.closeTicket(false);
            var o = function (e, o) {
                return Ce(e, o, t.sortCol)
            };
            _dataView.sort(o, t.sortAsc)
        }
        function onClick(e, t) {//Te

            var o = t.grid.getDataItem(t.row);
            if (i.widgetMode)
                void m.click(ModulesType.MARKET_WATCH, "marketWatchModule", null, o.key);
            else {
                if (o instanceof Slick.Group) {
                    e.stopImmediatePropagation();
                    if (o.collapsed || MAE.MarketWatchDepthService.getSelectedCategoryName() !== SymbolCategories.FAVORITES) {
                        collapseGroup(o.groupingKey);
                        scope.groupingKey = o.groupingKey;
                    }

                }
                else {
                    // MAE.DepthService.linkDepth(o);
                    // MAE.LayoutService.activateModule(ModulesType.DEPTH);
                }
            }
        }

        function onSingleClick(e, t) {
            if (rootScope.sessionType != SymbolSessionType.OPEN)
                return;

            _singleClickFlag = true;

            var o = t.grid.getDataItem(t.row);
            o instanceof Slick.Group || scope.apply(function () {
                _onDblClick(o);
            });
        }
        // function __onDblClick(e, t) {//Ae

        //     if (rootScope.sessionType != SymbolSessionType.OPEN)
        //         return;

        //     return i.widgetMode ? void m.click(ModulesType.MARKET_WATCH, "marketWatchModule") : void scope.apply(function () {
        //         var e = t.grid.getDataItem(t.row);
        //         e instanceof Slick.Group //|| scope.openTradePopup(t.grid.getDataItem(t.row).symbol)
        //     })
        // }
        function Ee() {
            i.widgetMode && setTimeout(function () {
                var e = element.find("xs-powered-by-xtb")
                    , t = element.find("#mwDepthGrid").find(".slick-viewport").find(".jspContainer").find(".jspPane")
                    , o = element.find("#mwDepthGrid").find(".slick-header")
                    , r = t[0].clientWidth + 12
                    , a = e[0].clientHeight + t[0].clientHeight + o[0].clientHeight + 30
                    , i = {
                        width: r,
                        height: a
                    };
                m.load(ModulesType.MARKET_WATCH_DEPTH, "marketWatchDepthModule", null, i)
            }, 0)
        }
        function onRowCountChanged(t, o) {//Me
            _grid.invalidateAllRows();
            _grid.updateRowCount(true);
            _grid.render();
            setTimeout(function () {
                if (_data_jsp && !flag_selected)
                    _data_jsp.reinitialise();
            }, 0);
        }
        function onRowsChanged(e, t) {
            _grid.invalidateRowsData(t.rows);
            _grid.render();
        }

        function collapseGroup(e, t) {//Ge
            t = t || _dataView.getGroups();

            for (var o, r, a = !1, i = 0, n = t.length; i < n; i++) {
                o = t[i];
                r = true;
                if (o.groups && collapseGroup(e, o.groups)) {
                    r = false;
                    a = true;
                }

                if (o.groupingKey === e) {
                    r = false;
                    a = true;
                }

                if (r && !o.collapsed) {
                    _dataView.collapseGroup(o.groupingKey);
                }
            }
            return a;
        }
        function Ie(e, t) {
            t = t || _dataView.getGroups();
            for (var o, r = !1, a = 0, i = t.length; a < i; a++)
                o = t[a],
                    o.groups && Ie(e, o.groups) && (_dataView.expandGroup(o.groupingKey),
                        r = !0),
                    o.groupingKey === e && (_dataView.expandGroup(e),
                        r = !0);
            return r;
        }
        function we(e) {
            e = e || _dataView.getGroups();
            for (var t, o = 0, r = e.length; o < r; o++)
                t = e[o],
                    t.groups && we(t.groups),
                    _dataView.expandGroup(t.groupingKey);
        }
        function Fe(e) {
            Ie(e.symbolGroup.name)
        }
        function onGroupCollapsedExpanded(e, t) {//Re


            _data_jsp.scrollToY(0);

            if (null == t.groupName || t.collapse) {
                if (null != t.groupName && t.collapse)
                    MAE.MarketWatchDepthService.unsubscribeGroup(t.groupName);
            }
            else {
                grupoByName[MAE.MarketWatchDepthService.getSelectedCategoryName()] = t.groupName;

                MAE.MarketWatchDepthService.subscribeGroup(t.groupName);



            }

        }
        function _gridSubcribe() {//_e
            _grid.onDblClick.subscribe(__onDblClick);//Ae
            _grid.onClick.subscribe(onClick);//Te
            _grid.onSingleClick.subscribe(onSingleClick);//he
            _dataView.onRowCountChanged.subscribe(onRowCountChanged);//Me
            _dataView.onRowsChanged.subscribe(onRowsChanged);//Ke
            _dataView.onGroupCollapsedExpanded.subscribe(onGroupCollapsedExpanded);//Re
            _grid.onSort.subscribe(onSort);//be

            _grid.onKeyDown.subscribe(onKeyDown);

        }
        function _gridUnSubcribe() {//De

            if (_grid) {
                _grid.onDblClick.unsubscribe(__onDblClick);
                _grid.onClick.unsubscribe(onClick);
                _grid.onSingleClick.unsubscribe(onSingleClick);
                _grid.onSort.unsubscribe(onSort);
                _grid.onKeyDown.subscribe(onKeyDown);

            }

            if (_dataView) {
                _dataView.onRowCountChanged.unsubscribe(onRowCountChanged);
                _dataView.onRowsChanged.unsubscribe(onRowsChanged);
                _dataView.onGroupCollapsedExpanded.unsubscribe(onGroupCollapsedExpanded);
            }

        }

        function module_action(e) {//Pe
            switch (e) {
                case LayoutAction.MODULE_ADDED:
                    module_added();
                    break;
                case LayoutAction.MODULE_REMOVED:
                    unsubscribeAll();
                    break;
                case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                    module_activated_first_time();
                    showEffect();
                    break;
                case LayoutAction.MODULE_ACTIVATED:
                    showEffect();
                    break;
                case LayoutAction.MODULE_DEACTIVATED:
                    break;
                case LayoutAction.MODULE_RESIZED:
                    showEffect();

                    break;
                case LayoutAction.MODULE_CONTAINER_CHANGED:
                    setModuleWrapper();
                    showEffect();

                    break;
                case LayoutAction.LAYOUT_OVERLAY_HIDE:
                    break;
            }
        }
        function module_added() {
            setModuleWrapper()
        }
        function onPriceChangeUpdate(e, t) {

            _priceChangeTrack[t.key] = t

        }

        function unsubscribeAll() {//xe

            MAE.LayoutService.unsubscribeModuleAction(ModulesType.MARKET_WATCH_DEPTH, module_action);
            MAE.MarketWatchDepthService.unsuscribeChangeCategory(onDataProviderEvent);
            MAE.MarketWatchDepthService.unsubcribePriceChangeUpdate(onPriceChangeUpdate);
            MAE.MarketWatchDepthService.unsubcribeQuotesLoaded(onQuotesLightLoaded);
            _gridUnSubcribe();

            MAE.DatagridService.unregisterDatagrid(_moduleType);//ft
            MAE.DatagridService.unsubscribeRefreshColumnFromSettingsEvent(Ne);
            MAE.SettingsService.setUserValueRemoveHandler(SettingsTypeUser.DAILY_CHANGE_MODE, P);
            MAE.SettingsService.setUserValueRemoveHandler(SettingsTypeUser.CHANGE_PERIOD, q);
            scope.destroy();
            pluingGroupByName.destroy();


        }
        function module_activated_first_time() {//We
            estaArmado || armarAndSubscribir()
        }
        function showEffect() {
            setTimeout(efectoheight, 0);
        }
        function onQuotesLightLoaded(e) {//Ve
            MAE.MarketWatchService.removeQuotesLightLoadedHandler(onQuotesLightLoaded);
            scope.quotesLight = e;
            scope.onQuotesLightLoaded();
            menuSymbolCategoriesBuild();
            MAE.LayoutService.moduleIsReady(ModulesType.MARKET_WATCH_DEPTH);
        }
        function onQuoteUpdate(e) {
            item_updated(e)
        }
        function $e(e, t) {
            _dataView.deleteItem(e.key);
            _dataView.insertItem(t, e);
        }
        function Be(e) {
            if (!favoriteGrCoLength) {
                var t = e ? e : "";
                Ie("" + t)
            }
        }
        function Ye(e) {
            if (e) {

                Be(e.favoriteGroup),
                    scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM && _onDblClick(e)
            }
        }
        function ze(e) {
            scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM ? scope.ticketSymbol != e && Ye(e) : favoriteGrCoLength || (e.favoriteGroup ? (Be(e.favoriteGroup),
                _grid.scrollToSymbol(e)) : Be(""))
        }
        function Xe(e) {
            var t = _dataView.getItemById(e);
            if (t) {
                if (favoriteGrCoLengthyt)
                    _dataView.getItemByIdx(0) !== t && $e(t, 0);
                else {
                    var o = _dataView.getItems().filter(function (e) {
                        return e.favoriteGroup === t.favoriteGroup
                    });
                    if (o[0].key !== e) {
                        var r = MarketWatchUtils.getCorrectPosition(_dataView, _dataView.getGroups(), _dataView.getRowById(o[0].key));
                        $e(t, r)
                    }
                }
                c.saveFavoriteSymbolSettings(_dataView.getItems()),
                    ze(t)
            }
        }
        function qe(t) {
            collapseGroup(t.symbolGroup.name);
            Fe(t);
            setTimeout(function () {
                var e = _dataView.getItemById(t.key);
                if (e) {
                    if (scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM)
                        setCurrentTicketSymbol(e);
                    else {
                        if (scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS)
                            _grid.scrollToSymbol(e);

                    }
                }
            }, 0);
        }
        function onFavoriteQuotesInitialized(e) {


            if (Ft = !0, c.removeFavoriteQuotesInitializedHandler(onFavoriteQuotesInitialized),
                c.addFavoritesToCategory(e),
                tratar_favoriteGroups(),
                c.getSelectedCategoryName() === SymbolCategories.FAVORITES && (scope.updateGrouppingSettingsForFavorites = !0,
                    scope.updateFavoritesGrouppingSettings()),
                scope.isNotEmpty = e.length > 0,
                scope.isClickAndTradeWidgetMode) {

                var t = MAE.SettingsService.getModuleValue(ModulesType.MARKET_WATCH, "symbols")[0];
                scope.ticketSymbol = l.getQuote(l.getQuoteLightBySymbolName(t).key)
            }
        }
        function Ze() {
            scope.isNotEmpty = _dataView.getLength() > 0
        }
        function onFavoriteQuoteAdded(t, o) {
            scope.isNotEmpty = !0,
                _dataView.updateIdxById(o),
                _dataView.refresh(),
                _grid.invalidate(),
                1 == _dataView.getLength() && e(function () {
                    scope.delayedGridSizeUpdate()
                }, 0, !0),
                scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM && scope.selectedCategoryName === SymbolCategories.FAVORITES && ze(t)
        }
        function onFavoriteQuoteRemoved(t) {
            scope.changeFavoriteGroupForQuote(t, null),
                scope.updateFavoritesGrouppingSettings(),
                scope.selectedCategoryName === SymbolCategories.FAVORITES && scope.ticketSymbol == t && scope.closeTicket(!1, t),
                Ze(),
                1 == _dataView.getLength() && e(function () {
                    Ze(),
                        scope.delayedGridSizeUpdate()
                }, 0, !0),
                _dataView.updateIdxById(),
                _dataView.refresh(),
                _grid.invalidate()
        }

        var porfolios = MAE.SettingsService.getUserValue(SettingsTypeUser.MARKET_WATCH_PORFOLIOS);
        scope.forcedGroupOrder = {};
        for (var i_p = 0; i_p < porfolios.length; i_p++) {
            var p = porfolios[i_p];
            scope.forcedGroupOrder[p.value] = p.Grupo;
        }
        //Rt
        var _columms = [{
            id: "symbol",
            name: MAE.I18nService.getString("MARKET_WATCH.SYMBOL"),
            field: "name",
            behavior: "move",
            sortable: !0,
            headerCssClass: "xs-mw-symbol-header",
            formatter: L_formatter,
            xsFirstColumn: !0,
            xsShowAlways: !0,
            xsFrozen: !0,
            minWidth: 110,
            type: "string"
        },
        {
            id: "low",
            name: MAE.I18nService.getString("MARKET_WATCH_DEPTH.CP"),
            field: "low",
            behavior: "move",
            editor: Slick.Editors.Number,
            precision: 4,
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        },
        {
            id: "low",
            name: MAE.I18nService.getString("MARKET_WATCH_DEPTH.OP"),
            field: "low",
            behavior: "move",
            editor: Slick.Editors.Number,
            precision: 4,
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }
        , {
            id: "bid",
            name: MAE.I18nService.getString("MARKET_WATCH.BID"),
            field: "bidVWAP",
            behavior: "move",
            editor: Slick.Editors.Number,
            precision: 4,
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }, {
            id: "dailyChange",
            name: MAE.I18nService.getString("MARKET_WATCH.CHANGE"),
            behavior: "move",
            field: "dailyChange",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: formato_change,
            type: "number"
        }, {
            id: "ask",
            name: MAE.I18nService.getString("MARKET_WATCH.ASK"),
            behavior: "move",
            field: "askVWAP",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }, {
            id: "low",
            name: MAE.I18nService.getString("MARKET_WATCH_DEPTH.VV"),
            behavior: "move",
            field: "low",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }, {
            id: "high",
            name: MAE.I18nService.getString("MARKET_WATCH_DEPTH.VC"),
            behavior: "move",
            field: "high",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter, //Q
            type: "number"
        }];
        i.widgetMode && _columms.push({
            id: "trade",
            name: MAE.I18nService.getString("MARKET_ANALYSIS.sentiments.INVEST"),
            field: "trade",
            behavior: "move",
            sortable: !1,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Y_formatter //Y
        });
        //_columms_extend Dt
        var _data_jsp/*_t*/, _columms_extend = _columms.map(function (e) {
            return jQuery.extend(!0, {}, e)
        }), Ot = 30, Nt = 30;
        var Pt = {//Pt
            enableCellNavigation: !0,
            enableColumnReorder: !0,
            forceFitColumns: !0,
            fullWidthRows: !0,
            rowHeight: Ot,
            rowGroupHeight: Nt,
            rowCollapsedHeight: Ot,
            rowNgRendererHeight: 270,
            rowNgRendererExtendedHeight: 265,
            noScrollBarRightPadding: 9,
            ngRendererAdditionalRowClass: "slick-row-mw",
            dataItemColumnValueExtractor: _dataItemColumnValueExtractor,
            draggableDirective: "click-and-trade-panel"
        };

        scope.groupingKey = "";

        scope.addQuotesLightLoaded = function (handle) {

            signalSymbol.add(handle);
        }

        scope.apply = function (fn) {
            fn();
        };

        scope.onQuotesLightLoaded = function () {

            signalSymbol.dispatch(scope.quotesLight);
        }

        scope.categorySelected = function (e) {
            var t = e.value;
            flag_selected = true;
            _data_jsp.getContentPane().addClass("initialization")
            if (current_category === t) {


                if (MAE.MarketWatchDepthService.changeCategory(t)) {
                    selected(t);
                    if (scope.selectedCategoryName !== t) {
                        scope.selectedCategoryName = t;
                    }
                    if (_grid) {
                        _grid.removeNgLineRenderer();
                        It = false;
                    }
                }
            }

            else {
                _grid.pauseRendering();
                if (MAE.MarketWatchDepthService.changeCategory(t)) {
                    selected(t);
                    set_grupos(t);
                    if (scope.selectedCategoryName !== t) {
                        scope.selectedCategoryName = t;
                    }

                    //_grid.unregisterPlugin(pluingRowManager);
                    //_grid.registerPlugin(xt);
                }

                _grid.playRendering();
            }
            flag_selected = false;
            efectoheight();
            _data_jsp.getContentPane().removeClass("initialization");

        };

        scope.delayedGridSizeUpdate = function () {
            setTimeout(function () {
                efectoheight()
            }, 0)
        };

        var pluingRowManager = new Slick.RowMoveManager({
            cancelEditOnDrag: true,
            moveOneRowOnly: true,
            dragOutsideCallback: dragOutside
        });

        pluingRowManager.onBeforeMoveRows.subscribe(function (e, t) {

            if (scope.ticketSymbol) {
                if (scope.ticketSymbol == _grid.getDataItem(t.rows[0])) {
                    _ticketSymbol = scope.ticketSymbol;
                }

            }
            return true;
        });
        pluingRowManager.onMoveRows.subscribe(function (e, t) {
            var o = t.rows;
            var r = t.insertBefore;

        });
        var pluingGroupByName = {//Lt
            getter: function (e) {
                return e.symbolGroup.name
            },
            formatter: group_formatter,
            comparer: group_comparer,
            forcedGroupOrder: null,
            aggregateCollapsed: false,
            lazyTotalsCalculation: false,
            displayTotalsRow: false,
            collapsed: true
        };


        //efectoheight

        setTimeout(function () {
            setTimeout(function () {
                efectoheight();
            }, 0)
        }, 0, true);


        _makeBody();

        setmwView();
        // _makeBlokAndAppend("marketWatchDepthtemplate", "marketwatch-depth-grid");



        MAE.LayoutService.subscribeModuleAction(ModulesType.MARKET_WATCH_DEPTH, module_action, "marketWatchDepthModule");
        scope.destroy = function () {
            scope = {
                widgetMode: rootScope.widgetMode,
                isAlive: false
            };
        };
        //scope.on("$destroy", function() {}),
        scope.quoteSelected = function (e) {
            if (e) {
                _data_jsp.scrollToY(0);
                var t = e.value

                var symbol_category = scope.menuSymbolCategories.filter(function (e) {
                    return e.label === t.symbolGroup.category
                })[0];
                if (null != r) {
                    symbol_category.selected = true;
                    scope.categorySelected(symbol_category);
                    qe(symbol_category);
                }
            }
        };
        scope.isAlive = true;

        scope.selectCallback = function (data) {
            if (rootScope.sessionType != SymbolSessionType.OPEN)
                return;

            _singleClickFlag = true;

            _onDblClick(data.res.value);
            //  alert("selectCallback" + data.res.value.key);
            return true;
        };


        function _onDblClick(item_temp) {//ne

            // Slick.GlobalEditorLock.cancelCurrentEdit();

            if (item_temp || !i.widgetMode) {
               

                //MAE.LayoutService.activateModule(ModulesType.DEPTH);
                MAE.DepthService.linkDepth(item_temp);

            }
        }

        function __onDblClick(e, item_temp) {//ne

            // Slick.GlobalEditorLock.cancelCurrentEdit();

            if (item_temp || !i.widgetMode) {
               
                var item = item_temp.grid.getDataItem(item_temp.row);

                //MAE.DepthService.linkDepth(item);

            }
        }

    };

    function BuyEditor(args) {
        var $buy;
        var scope = this;
        this.init = function () {
            $buy = $("<INPUT type=number style='width:100%' />")
                .appendTo(args.container)
                .bind("keydown", scope.handleKeyDown);

            scope.focus();
        };
        this.handleKeyDown = function (e) {
            if (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT || e.keyCode == $.ui.keyCode.TAB) {
                e.stopImmediatePropagation();
            }
        };
        this.destroy = function () {
            $(args.container).empty();
        };
        this.focus = function () {
            $buy.focus();
        };
        this.serializeValue = function () {
            return { from: parseInt($buy.val(), 10) };
        };
        this.applyValue = function (item, state) {
            item.buy = state.buy;

        };
        this.loadValue = function (item) {
            $buy.val(item.buy);

        };
        this.isValueChanged = function () {
            return args.item.buy != parseInt($buy.val(), 10);
        };
        this.validate = function () {
            if (isNaN(parseInt($buy.val(), 10))) {
                return { valid: false, msg: "Please type in valid numbers." };
            }
            if (parseInt($buy.val(), 10) > -1) {
                return { valid: false, msg: "invalid number'" };
            }
            return { valid: true, msg: null };
        };
        this.init();
    }

    function editCommandHandler(item, column, editCommand) {


    }
    function _focusGrid() {
        if (_grid) {
            _grid.focus();
            showEfectFocusGrid();
            _grid.setSelectionModel(new Slick.RowSelectionModel);
            _grid.setSelectedRows([0]);//la primera
        }

    };

    function showEfectFocusGrid() {
        $gridContainer.removeClass("mode-focus");
        setTimeout(function () {
            $gridContainer.addClass("mode-focus");

        }, 10);


    }


    function _expandGroup(groupName) {
        scope.groupingKey = groupName;
        _dataView.expandGroup(groupName);

    }

    jq.extend(true, window, {
        MAE: {
            MarketWatchDepthModule:
            {
                link: _link,
                isLoad: _isLoad,
                toggleGridView: _toggleGridView,
                focusGrid: _focusGrid,
                expandGroup: _expandGroup
            }
        }
    });

})(jQuery);



