




(function (jq) {


    //var e = MAE. 
    var t = MAE.DatagridService;
    //var o = MAE.
    var r = MAE.SettingsService;
    var a = MAE.I18nService;
    var i = rootScope;
    var n = MAE.PopupsService;
    var s = MAE.LayoutService;
    //var l = MAE.
    //var u = MAE.
    var c = MAE.MarketWatchService;
    var d = MAE.SessionService;

    var m = MAE.WidgetService;
    var p = MAE.GaService;
    var optionsGrid;
    var signalSymbol = new signals.Signal();




    var scope = {
        widgetMode: rootScope.widgetMode,
        isAlive: false,
        onDblClickFromService: function () { }

    };
    var _grid, _items/*rt*/, _dataView/*at*/, it, nt, _clickandtradepanel_st, lt, _clickandtradepanel/*ut*/, ct, dt, gt, mt, pt, vt, favoriteGrCoLength/*yt*/, /*ft*/_moduleType = ModulesType.MARKET_WATCH, St = {
        FAVORITE_SYMBOL_TICKET: 0,
        MW_SYMBOL_TICKET: 1
    }, Ct = false, bt = !1, Tt = null, ht = !1, At = "trade-baskets", estaArmado/*Et*/ = false, Mt = {},
    /*kt*/ _priceChangeTrack = {}, Gt = false, It = !0, /*wt*/flag_selected = false, Ft = !1;


    var _singleClickFlag = false; // para priorizar la animacion
    var scope_search = {};

    function _isLoad() {
        return scope.isAlive;
    }


    function _toggleGridView() {

        scope.toggleGridView();
    }

    function make_scope_search() {
        scope_search = {
            symbols: scope.quotesLight,
            preferredDataProvider: "=?",
            symbolsFilter: function () { },// "&?",
            useSymbolsFilter: "@?",
            selectCallback: function () { },//"&?",
            placeholder: "@",
            openCallback: function () { },//"&?"
            isItemAddedFunction: function () { },//"&?",
            showBtnItemAddedFunction: function () { }, //"&?",
            itemTooltipFunction: function () { },//"&?",
            //selectedCategoryName: "=?",
            addBtnKey: "@?",
            xsDisabled: "=?",
            maxRows: "=?",
            setSymbol: "=?",
            closeCallback: function () { }//"&?"
        }

        jq.extend(true, scope, scope_search);

    }

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

        function _makeEvents() {


            jq(".xs-ct-mode-btn").on("click", function () {
                scope.toggleGridView();

            });

        }

        function _makeBody() {
            var data = _render("marketWatchtemplate");
            //var template = jq.templates(data);
            //template.link(element, scope);
            element.html(data);

        }

        function _updateScopeChild(obj) {
            //MAE.SymbolsSearchBarExtended.update(obj);

        }

        function armarBusqueda() {
            var module = MAE.SymbolsSearchBarExtended;
            //if (!module.isLoad()) {
            var placeHolder = $("div[symbols-search-bar-extended]");
            //make_scope_search();    

            module.link(scope, placeHolder, {});
            scope.onQuotesLightLoaded();

            // }

        }


        function collapseAllGroups() {//collapseAllGroups
            _dataView && _dataView.collapseAllGroups()
        }
        function onSessionStatus(e) {//S
            switch (e) {
                case SessionStatus.LOGIN_SUCCESS_AFTER_RECONNECT:
                    collapseAllGroups();
            }
        }
        function moduleMockLayout() {//C
            if (!pt)
                pt = MAE.BasketsService;

            return pt.getModuleMockLayout();
        }
        function armarAndSubscribir() {//b
            var d = MAE.SessionService;
            var c = MAE.MarketWatchService;
            armarEntorno();
            scope.favoriteGroups = c.getFavoriteSymbolsGroupsSettings();
            favoriteGrCoLength = favoriteGroupsCountLength();
            MAE.MarketWatchService.addDataProviderEventHandler(onDataProviderEvent);
            MAE.MarketWatchService.addPriceChangeUpdateHandler(onPriceChangeUpdate);
            MAE.MarketWatchService.addQuotesLightLoadedHandler(onQuotesLightLoaded);//Ve
            MAE.MarketWatchService.addQuoteUpdateHandler(onQuoteUpdate);//Qe
            MAE.MarketWatchService.addFavoriteQuotesInitializedHandler(onFavoriteQuotesInitialized);//je
            MAE.MarketWatchService.addFavoriteQuoteAddedHandler(onFavoriteQuoteAdded);//Je
            MAE.MarketWatchService.addFavoriteQuoteRemovedHandler(onFavoriteQuoteRemoved);//et
            MAE.MarketWatchService.initData();
            d.subscribeStatus(onSessionStatus, "marketWatch.service");
            estaArmado = true;
        }
        function armarEntorno() {//T

            setmwView();
            slickBuild();

            if (!(_clickandtradepanel && _clickandtradepanel_st))
                compilarTraderPanel();


        }
        function h() {
            nt = element.closest(".xs-module-wrapper")
        }
        function selected(e) { //A

            for (var i = 0; i < scope.menuSymbolCategories.length; i++) {
                var t = scope.menuSymbolCategories[i];
                t.selected = t.value == e;
            }

        }
        function setModuleLayoutState() {//E
            var e;
            e = moduleMockLayout();
            e.setModuleLayoutState(true, scope.basketView);
        }
        function toggleBasketView() {//M
            scope.basketView = !scope.basketView;
            clearTimeout(vt);
            vt = setTimeout(setModuleLayoutState, 0);
        }
        function set_grupos(e) {//k
            Lt.forcedGroupOrder = scope.forcedGroupOrder[e];
            _dataView.setGrouping(Lt);

        }
        function onPriceChangeUpdate(e, t) {
            _priceChangeTrack[t.key] = t
        }
        function onDataProviderEvent(e, t) {//I
            switch (e) {
                case DataProviderEvent.ITEM_UPDATED:
                    //console.log("_singleClickFlag  onDataProviderEvent "  + _singleClickFlag);
                    if (_singleClickFlag) // le doy un timepo a la ui para que anime la accion de click
                    {

                        setTimeout(function () {
                            item_updated(t);
                        }, 1000);
                    }
                    else {

                        item_updated(t);
                    }

                    break;
                case DataProviderEvent.ITEMS_LOADED:
                    if (_singleClickFlag) // le doy un timepo a la ui para que anime la accion de click
                    {
                        setTimeout(function () {
                            items_loaded(t);
                        }, 100);
                    }
                    else {
                        items_loaded(t);
                    }

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

            // _dataView && (_dataView.reSort(),
            //     _dataView.endUpdate(),
            //     ht && F())
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
        }
        function disprarOnDblClick(e) {//D
            // c.getSelectedCategoryName() === SymbolCategories.FAVORITES && e && (scope.viewMode === Slick.GridAdvancedMode.SINGLE_ITEM ? "ForexQuote" === e.constructor.name ? onDblClick(e) : "NonDataItem" === e.constructor.name && Ye(e.rows[0]) : "NonDataItem" === e.constructor.name && Be(e.rows[0].favoriteGroup))
        }
        function items_loaded(t) {//O
            if (t && (_items = t, _grid)) {
                _updateScopeChild({ symbols: t });
                var o = c.getSelectedCategoryName();
                _dataView.beginUpdate();
                _dataView.setItems(_items, "key");
                _dataView.collapseAllGroups();
                _dataView.endUpdate();
                updateRowCountAndrender();
                _grid.invalidate();
                // Ct && o === SymbolCategories.FAVORITES && scope.viewMode === Slick.GridAdvancedMode.SINGLE_ITEM && setTimeout(function () {
                //     disprarOnDblClick(_dataView.getItem(0))
                // }, 100);

                if (1 == _items.length) {
                    setTimeout(function () {
                        scope.delayedGridSizeUpdate()
                    }, 0, true);
                }
                else {
                    efectoheight();
                    // setTimeout(function () {
                    //     o == SymbolCategories.CRYPTO && 1 == _dataView.getGroups().length && we()
                    // }, 0, true);
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

            //var e = i.widgetMode ? SymbolCategories.FAVORITES : r.getUserValue(SettingsTypeUser.MARKET_WATCH_CATEGORY);
            var e;
            if (i.widgetMode)
                e = SymbolCategories.FAVORITES;
            else
                e = MAE.SettingsService.getUserValue(SettingsTypeUser.MARKET_WATCH_CATEGORY);


            var t = false;

            if (null != e) {
                for (var o = 0; o < scope.menuSymbolCategories.length; o++) {
                    var o_ = scope.menuSymbolCategories[o];
                    if (o_.value == e) {
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

            _makeBlokAndAppend("marketWatchtemplateCategory", "marketwatch-categories");
            armarBusqueda();
            for (var o = 0; o < scope.menuSymbolCategories.length; o++) {
                var o_ = scope.menuSymbolCategories[o];
                jq("#" + o_.value).on("click", function (v) {

                    scope.categorySelected({ value: $(this).attr("id") });
                    jq(".xs-marketwatch-category-button").removeClass("selected");
                    $(this).addClass("selected");
                });

            }

        }
        function P(e) {
            scope.dailyChangeMode = e;
            updateRowCountAndrender();
        }
        function setmwView() {//H
            jq(".xs-ct-mode-btn #mwViewModeIconStyle").removeClass();
            if (scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM) {

                jq(".xs-ct-mode-btn #mwViewModeIconStyle").addClass("mw-ct-view-mode-icon");

                scope.mwViewModeIconStyle = "mw-ct-view-mode-icon";

                scope.mwView = a.getString("MARKET_WATCH.CT_VIEW");
            }
            else {
                scope.mwViewModeIconStyle = "mw-list-view-mode-icon";
                jq(".xs-ct-mode-btn #mwViewModeIconStyle").addClass("mw-list-view-mode-icon");
                scope.mwView = a.getString("MARKET_WATCH.NORMAL_VIEW");
            }

        }
        function setClickAndTradePanel() {//x


            gt || (gt = function () {

                return new marketTrade(scope, false, _grid);

            });//o('<click-and-trade-panel id="fsTicket" class="mw-ticket" close-mw-context-menu="closeMWContextMenu" close-ticket="closeTicket(removeItem, symbol)" quote="ticketSymbol" update-ticket-size="updateTicketSize(size)" list-mode-enabled="true" add-fav-symbol-enabled="true" show-cm-depth="setCmDepth(value)"  ct-mode="true"></click-and-trade-panel>')),
            mt || (mt = function () {


                return new marketTrade(scope, false, _grid);

            });//o('<click-and-trade-panel id="fsTicket" class="mw-ticket" close-mw-context-menu="closeMWContextMenu" close-ticket="closeTicket(removeItem, quote)" quote="ticketSymbol" update-ticket-size="updateTicketSize(size)" list-mode-enabled="true" show-cm-depth="setCmDepth(value)"  ct-mode="true"></click-and-trade-panel>'))
        }
        function setNgRendererTemplate(e, t) {//W
            gt && mt || setClickAndTradePanel();

            _grid && (e !== SymbolCategories.FAVORITES ? _grid.setNgRendererTemplate(gt, t) : _grid.setNgRendererTemplate(mt, t));
            _grid.invalidate();
        }
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
                        c = a.getFrequentString("SYMBOL_SESSION.MARKET_CLOSED");

                    }
                    else {
                        if (rootScope.sessionType == SymbolSessionType.PRE_OPEN) {
                            s = "mw-session-type-preopen-icon mw-session-type-icon";
                            u = " xs-session-preopen";
                            c = a.getFrequentString("SYMBOL_SESSION.MARKET_PRE_OPENED");
                        }
                    }

                }
                else {
                    s = "mw-ct-price-" + i.tick.priceChangeDirection + "-icon mw-price-icon";

                }


                // }
                //return '<div class="' + s + '" title="' + c + '"></div><div style="color: #e3e3e3;" class="xs-symbol-name  xs-symbol-full-name ' + u + '" title="' + i.symbol.fullDescription + '">' + i.symbol.name + '</span></div><div class="xs-symbol-desc xs-symbol-full-name"  title="' + i.symbol.fullDescription + '">' + i.symbol.fullDescription + "</div>";
                return '<div class="' + s + '" title="' + c + '"></div><div class="xs-symbol-name  xs-symbol-full-name ' + u + '" title="' + i.symbol.fullDescription + '">' + i.symbol.name + '</span></div><div class="xs-symbol-desc xs-symbol-full-name"  title="' + i.symbol.fullDescription + '">' + i.symbol.fullDescription + "</div>";
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
            if (scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS)
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

            // return scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS ? "" : a.tick ? (i = FormatUtils.formatPrice(o, a.symbol.precision),
            //     a.sessionType != SymbolSessionType.OPEN ? '<span class="xs-session-closed">' + i + "</span>" : i) : ""
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
                    if (o) {


                    }
                    else { }

                // if (o) {
                //     var r = NaN;
                //     if(0 == scope.dailyChangeMode)
                //         {
                //             if(0 == scope.changePeriod)
                //                 r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_d1, e.symbol.pipsPrecision);
                //             else
                //             {
                //                 if( 1 == scope.changePeriod)
                //                 {
                //                     r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_w1, e.symbol.pipsPrecision);
                //                 }
                //                 else
                //                 {
                //                     if(2 == scope.changePeriod)
                //                          r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_mn1, e.symbol.pipsPrecision);


                //                 }
                //             }

                //         }
                //         else
                //         {
                //             if(0 == scope.changePeriod)
                //             r = o.move_d1;
                //             else
                //                 {
                //                     if(1 == scope.changePeriod)
                //                     r = o.move_w1
                //                     else
                //                         {
                //                             if(2 == scope.changePeriod)
                //                             r = o.move_mn1;
                //                         }
                //                 }
                //         }

                //         // 0 == scope.dailyChangeMode ? 
                //         //         0 == scope.changePeriod ? 
                //         //             r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_d1, e.symbol.pipsPrecision) 
                //         //         : 
                //         //         1 == scope.changePeriod ? 
                //         //                 r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_w1, e.symbol.pipsPrecision) 
                //         //         : 
                //         //         2 == scope.changePeriod && (r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_mn1, e.symbol.pipsPrecision)) 
                //         // : 
                //         //         0 == scope.changePeriod ? 
                //         //             r = o.move_d1 : 
                //         //             1 == scope.changePeriod ? 
                //         //                 r = o.move_w1 : 
                //         //                 2 == scope.changePeriod && (r = o.move_mn1),

                //     // return 0 == scope.dailyChangeMode ? 0 == scope.changePeriod ? r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_d1, e.symbol.pipsPrecision) : 1 == scope.changePeriod ? r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_w1, e.symbol.pipsPrecision) : 2 == scope.changePeriod && (r = ForexCalculationUtils.calculatePipsPriceChange(o.diff_mn1, e.symbol.pipsPrecision)) : 0 == scope.changePeriod ? r = o.move_d1 : 1 == scope.changePeriod ? r = o.move_w1 : 2 == scope.changePeriod && (r = o.move_mn1),
                //     //     r

                //     return r;
                // }
                // return NaN
            }
            return e[t.field]
        }
        function X(e) {
            for (var t = 0; t < e.length; t++)
                if ("dailyChange" === e[t].field)
                    return t;
            return -1
        }
        function q(e) {
            var t = _grid.getColumns()
                , o = X(t);
            o >= 0 && (0 == e ? t[o].name = a.getString("MARKET_WATCH.CHANGE_INTERVAL_TEMPL", {
                interval: a.getString("CHART.DAYS")
            }) : 1 == e ? t[o].name = a.getString("MARKET_WATCH.CHANGE_INTERVAL_TEMPL", {
                interval: a.getString("CHART.WEEKS")
            }) : 2 == e && (t[o].name = a.getString("MARKET_WATCH.CHANGE_INTERVAL_TEMPL", {
                interval: a.getString("CHART.MONTHS")
            }))),
                _grid.setColumns(t),
                scope.changePeriod = e
        }
        function j() {
            scope.symbolMenu = !1,
                scope.dailyContextMenu = !1,
                scope.mwTicketMenu = !1,
                scope.showAddGroupInput = !1,
                scope.showAddToFavorites = !1,
                $("#marketWatchCtxMenu").removeClass("open")
        }
        function favoriteGroupsCountLength() {//Z
            var e = 0;
            var t = scope.favoriteGroups;
            var r;
            if (t) {
                for (var o = 0, r = t.length; o < r; o++)
                    e += t[o].instruments.length;
            }

            return 0 === e
        }
        function J(e) {
            var t = 0;
            t += _dataView.getItems().filter(function (e) {
                return null === e.favoriteGroup
            }).length;
            var r;
            for (var o = 0, r = scope.favoriteGroups[o]; r !== e;)
                t += r.instruments.length,
                    r = scope.favoriteGroups[++o];
            return t
        }
        function ee(e, t) {
            if (t) {
                var o = MarketWatchUtils.getFavoriteGroupById(scope.favoriteGroups, t).instruments;
                o.splice(o.indexOf(e), 1)
            }
        }
        function te(e, t) {
            if (t) {
                var o = MarketWatchUtils.getFavoriteGroupById(scope.favoriteGroups, t).instruments;
                o.push(e)
            }
        }

        function dragOutside(e, t) {//se
            c.itemDragAndDrop(e, t)
        }
        function le() {
            setTimeout(function () {
                Kt && (setCurrentTicketSymbol(Kt), Kt = null)
            }, 100)
        }
        function ue(e, t) {
            var o, r, a, i, n, s = [];
            for (o = _items.slice(0, t),
                r = _items.slice(t, _items.length),
                e.sort(function (e, t) {
                    return e - t
                }),
                a = 0; a < e.length; a++)
                s.push(rt[e[a]]);
            for (e.reverse(),
                a = 0; a < e.length; a++)
                i = e[a],
                    i < t ? o.splice(i, 1) : r.splice(i - t, 1);
            _items.length = 0,
                n = o.concat(s.concat(r)),
                Array.prototype.push.apply(_items, n),
                _dataView.setItems(_items, "key"),
                _grid.invalidate(),
                c.saveFavoriteSymbolSettings(_items)
        }
        function ce(e, t) {
            var o, r, a, i, s, l, u, d, g = [], m = MarketWatchUtils.getCorrectPosition(at, _dataView.getGroups(), t);
            if (m >= 0) {
                for (o = _items.slice(0, m),
                    r = _items.slice(m, _items.length),
                    e.sort(function (e, t) {
                        return e - t
                    }),
                    a = 0; a < e.length; a++)
                    s = MarketWatchUtils.getCorrectPosition(_dataView, _dataView.getGroups(), e[a]),
                        g.push(rt[s]),
                        u = _items[s].favoriteGroup,
                        l = MarketWatchUtils.getCorrectFavoriteGroup(_dataView, _dataView.getGroups(), t),
                        u !== l && scope.changeFavoriteGroupForQuote(rt[s], l);
                for (e.reverse(),
                    a = 0; a < e.length; a++)
                    i = MarketWatchUtils.getCorrectPosition(_dataView, _dataView.getGroups(), e[a]),
                        i < m ? o.splice(i, 1) : r.splice(i - m, 1);
                _items.length = 0,
                    d = o.concat(g.concat(r)),
                    Array.prototype.push.apply(rt, d),
                    _dataView.setItems(rt, "key"),
                    _grid.invalidate(),
                    c.saveFavoriteSymbolSettings(rt),
                    scope.updateFavoritesGrouppingSettings()
            }
        }
        function setWidth() {//de

            var e = nt.width();
            it.css("width", e + "px")
        }
        function ge(e, t) {
            return e.title < t.title ? -1 : e.title > t.title ? 1 : 0
        }
        function me(e) {
            return '<div class="slick-group-toggle">' + a.getFrequentString("MARKET_WATCH_GROUP." + e.value.toUpperCase().replace(" ", "_")) + "</div>"
        }
        function pe(e) {
            return '<div class="slick-group-toggle">' + a.getFrequentString("MARKET_WATCH_GROUP." + AssetClass[e.value].name) + "</div>"
        }
        function ve(e) {
            return "" == e.value ? '<div class="slick-group-toggle">' + a.getString("MARKET_WATCH_CATEGORY.FAVORITES") + "</div>" : '<div class="slick-group-toggle">' + MarketWatchUtils.getFavoriteGroupById(scope.favoriteGroups, e.value).name + "</div>"
        }
        function slickBuild() {//ye
            it = jq("#mwGrid");
            var e = new Slick.Data.GroupItemMetadataProvider({
                colspan: "*",
                additionalToggleCssClasses: ["slick-cell", "slick-group-title"],
                groupCssClass: "xs-mw-symbol-group slick-group-toggle"
            });
            _dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: e,
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
                gridContainerClass: "slick-mw-drag-container"
            }, Pt);
            setWidth();
            t = MAE.DatagridService;
            t.getColumnsFromSettings(_moduleType, _columms_extend);
            _grid = new Slick.GridAdvanced("#mwGrid", _dataView, _columms_extend, optionsGrid);
            _grid.setNgScope(n);
            _grid.setNgParse(n);
            _grid.registerPlugin(xt);
            _grid.registerPlugin(Wt);
            _grid.registerPlugin(e);
            t.registerDatagrid(_moduleType, _grid, _columms, true);
            t.subscribeRefreshColumnFromSettingsEvent(Ne);
            var slick_viewport = element.find("div.slick-viewport");
            slick_viewport.jScrollPane({
                showArrows: false,
                contentWidth: "0px"
            });
            _data_jsp = slick_viewport.data("jsp");
            window["data-temp"] = _data_jsp;
            slick_viewport.bind("jsp-scroll-y", function () {
                scope.closeMWContextMenu()
            });

            _dataView.setItems([], "key");
            _dataView.setGrouping(Lt);
            void 0 != scope.changePeriod && q(scope.changePeriod);
            efectoheight();
            _gridSubcribe();
        }
        function updateRowCountAndrender() {//fe
            _grid.updateRowCount();
            _grid.render();
        }
        function efectoheight() {//Se
            if (_grid) {
                it.css("height", nt.height() - 77 + "px");
                setWidth();
                _grid.resizeCanvas();
            }
            setTimeout(function () {
                if (_data_jsp && !flag_selected) {
                    _data_jsp.reinitialise();
                    Ee();
                }
                // _t && !flag_selected && (_t.reinitialise(),
                //     Ee())
            }, 0);

            // _grid && (it.css("height", nt.height() - 77 + "px"),
            //     setWidth(),
            //     _grid.resizeCanvas()),
            //     setTimeout(function () {
            //         _t && !flag_selected && (_t.reinitialise(),
            //             Ee())
            //     }, 0)
        }
        function Ce(e, t, o) {
            var r = Pt.dataItemColumnValueExtractor(e, o)
                , a = Pt.dataItemColumnValueExtractor(t, o);
            return isNaN(r) && (r = -Number.MAX_VALUE),
                isNaN(a) && (a = -Number.MAX_VALUE),
                r < a ? -1 : r > a ? 1 : e.name < t.name ? -1 : e.name > t.name ? 1 : e.name == t.name ? e.idAssetClass < t.idAssetClass ? -1 : e.idAssetClass > t.idAssetClass ? 1 : 0 : 0
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
                    if (t) {
                        scope.closeTicket({
                            removeItem: true,
                            quote: n.symbol
                        });
                    }
                    else {
                        scope.closeTicket({
                            removeItem: false
                        });
                    }

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
                    if (o.collapsed || c.getSelectedCategoryName() !== SymbolCategories.FAVORITES) {
                        collapseGroup(o.groupingKey);
                        scope.groupingKey = o.groupingKey;
                    }

                }
            }

            // return i.widgetMode ? void m.click(ModulesType.MARKET_WATCH, "marketWatchModule", null, o.key) : void (o instanceof Slick.Group && (e.stopImmediatePropagation(),
            //     o.collapsed || c.getSelectedCategoryName() !== SymbolCategories.FAVORITES && collapseGroup(o.groupingKey)))
        }

        function onSingleClick(e, t) {
            if (rootScope.sessionType != SymbolSessionType.OPEN)
                return;

            _singleClickFlag = true;

            var o = t.grid.getDataItem(t.row);
            o instanceof Slick.Group || scope.apply(function () {
                scope.viewMode != Slick.GridAdvancedMode.LIST_OF_ITEMS && /*o instanceof ForexQuote && */ _onDblClick(o);
            });
        }
        function __onDblClick(e, t) {//Ae

            if (rootScope.sessionType != SymbolSessionType.OPEN)
                return;

            return i.widgetMode ? void m.click(ModulesType.MARKET_WATCH, "marketWatchModule") : void scope.apply(function () {
                var e = t.grid.getDataItem(t.row);
                e instanceof Slick.Group || scope.openTradePopup(t.grid.getDataItem(t.row).symbol)
            })
        }
        function Ee() {
            i.widgetMode && setTimeout(function () {
                var e = element.find("xs-powered-by-xtb")
                    , t = element.find("#mwGrid").find(".slick-viewport").find(".jspContainer").find(".jspPane")
                    , o = element.find("#mwGrid").find(".slick-header")
                    , r = t[0].clientWidth + 12
                    , a = e[0].clientHeight + t[0].clientHeight + o[0].clientHeight + 30
                    , i = {
                        width: r,
                        height: a
                    };
                m.load(ModulesType.MARKET_WATCH, "marketWatchModule", null, i)
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

            // for (var o, r, a = !1, i = 0, n = t.length; i < n; i++)
            //     o = t[i],
            //         r = !0,
            //         o.groups && Ge(e, o.groups) && (r = !1,
            //             a = !0),
            //         o.groupingKey === e && (r = !1,
            //             a = !0),
            //         r && !o.collapsed && _dataView.collapseGroup(o.groupingKey);


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
            Ie(e.symbolGroup.category == SymbolCategories.CASH_STOCKS ? e.idAssetClass + ":" + e.symbolGroup.name : e.symbolGroup.name)
        }
        function onGroupCollapsedExpanded(e, t) {//Re
            if (c.getSelectedCategoryName() === SymbolCategories.FAVORITES) {
                var o = _grid.getSingleItemRendererData();
                if (o) {
                    var r = o.symbol.key;
                    l.getQuote(r).favoriteGroup !== t.groupName && (t.groupName || l.getQuote(r).favoriteGroup) || scope.closeTicket()
                }
            } else {
                scope.closeTicket();
                _data_jsp.scrollToY(0);
                scope.closeMWContextMenu();
                if (null == t.groupName || t.collapse) {
                    if (null != t.groupName && t.collapse && c.getSelectedCategoryName() !== SymbolCategories.FAVORITES)
                        c.unsubscribeGroup(t.groupName);
                }
                else {
                    Mt[c.getSelectedCategoryName()] = t.groupName;
                    if (c.getSelectedCategoryName() !== SymbolCategories.FAVORITES) {
                        c.subscribeGroup(t.groupName);

                    }

                }
            }


            //     scope.closeTicket(),
            //         _t.scrollToY(0);
            // scope.closeMWContextMenu(),
            //     null == t.groupName || t.collapse ? null != t.groupName && t.collapse && c.getSelectedCategoryName() !== SymbolCategories.FAVORITES && c.unsubscribeGroup(t.groupName) : (Mt[c.getSelectedCategoryName()] = t.groupName,
            //         c.getSelectedCategoryName() !== SymbolCategories.FAVORITES && c.subscribeGroup(t.groupName))
        }
        function _gridSubcribe() {//_e
            _grid.onDblClick.subscribe(_onDblClick);//Ae
            _grid.onClick.subscribe(onClick);//Te
            _grid.onSingleClick.subscribe(onSingleClick);//he
            _dataView.onRowCountChanged.subscribe(onRowCountChanged);//Me
            _dataView.onRowsChanged.subscribe(onRowsChanged);//Ke
            _dataView.onGroupCollapsedExpanded.subscribe(onGroupCollapsedExpanded);//Re
            _grid.onSort.subscribe(onSort);//be

            _grid.onKeyDown.subscribe(onKeyDown);
            
        }
        function _gridUnSubcribe() {//De
            _grid && (_grid.onDblClick.unsubscribe(_onDblClick),
                _grid.onClick.unsubscribe(onClick),
                _grid.onSingleClick.unsubscribe(onSingleClick),
                _grid.onSort.unsubscribe(onSort)),
                _dataView && (_dataView.onRowCountChanged.unsubscribe(onRowCountChanged),
                    _dataView.onRowsChanged.unsubscribe(onRowsChanged),
                    _dataView.onGroupCollapsedExpanded.unsubscribe(onGroupCollapsedExpanded)),
                    _grid.onKeyDown.subscribe(onKeyDown)

        }

        function loadAllQuotesLight(e) {
            //o.loadAllQuotesLight(e, !0)
        }

        function Oe(e) {
            var t = moduleMockLayout();//loadAllQuotesLight();
            t.forwardLayoutAction(e)
        }
        function Ne() {
            t.refreshColumns(_columms, ModulesType.MARKET_WATCH, _grid)
        }
        function module_action(e) {//Pe
            switch (e) {
                case LayoutAction.MODULE_ADDED:
                    He();
                    break;
                case LayoutAction.MODULE_REMOVED:
                    unsubscribeAll();
                    Oe(e);
                    break;
                case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                    We();
                    Oe(e);
                    Ue();
                    break;
                case LayoutAction.MODULE_ACTIVATED:
                    Ke();
                    Ue();
                    break;
                case LayoutAction.MODULE_DEACTIVATED:
                    Le();
                    break;
                case LayoutAction.MODULE_RESIZED:
                    Ue();
                    Oe(e);
                    break;
                case LayoutAction.MODULE_CONTAINER_CHANGED:
                    h();
                    Ue();
                    Oe(e);
                    break;
                case LayoutAction.LAYOUT_OVERLAY_HIDE:
                    trackPageView();
            }
        }
        function He() {
            h()
        }
        function unsubscribeAll() {//xe

            s.unsubscribeModuleAction(ModulesType.MARKET_WATCH, module_action);
            MAE.MarketWatchService.removeDataProviderEventHandler(onDataProviderEvent);
            MAE.MarketWatchService.removePriceChangeUpdateHandler(onPriceChangeUpdate);
            MAE.MarketWatchService.clearData();
            MAE.MarketWatchService.removeQuoteUpdateHandler(onQuoteUpdate);
            MAE.MarketWatchService.removeFavoriteQuotesInitializedHandler(onFavoriteQuotesInitialized);//Je
            MAE.MarketWatchService.removeQuotesLightLoadedHandler(onQuotesLightLoaded);
            MAE.MarketWatchService.removeFavoriteQuoteAddedHandler(onFavoriteQuoteAdded);
            MAE.MarketWatchService.removeFavoriteQuoteRemovedHandler(onFavoriteQuoteRemoved);
            MAE.MarketWatchService.clearFavoritesData();
            scope.closeTicket();
            xt.destroy();
            Wt.destroy();
            _gridUnSubcribe();

            t.unregisterDatagrid(_moduleType);//ft
            t.unsubscribeRefreshColumnFromSettingsEvent(Ne);
            MAE.SettingsService.setUserValueRemoveHandler(SettingsTypeUser.DAILY_CHANGE_MODE, P);
            MAE.SettingsService.setUserValueRemoveHandler(SettingsTypeUser.CHANGE_PERIOD, q);
            scope.destroy();
        }
        function We() {
            estaArmado || armarAndSubscribir()
        }
        function Ke() {
            trackPageView()
        }
        function Le() { }
        function Ue() {
            setTimeout(efectoheight, 0);
        }
        function onQuotesLightLoaded(e) {//Ve
            c.removeQuotesLightLoadedHandler(onQuotesLightLoaded);
            scope.quotesLight = e;
            scope.onQuotesLightLoaded();
            menuSymbolCategoriesBuild();
            s.moduleIsReady(ModulesType.MARKET_WATCH);
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
        function trackPageView() {//tt


            //scope.selectedCategoryName != At && p.trackPageView(ModulesType.MARKET_WATCH, scope.selectedCategoryName, scope.viewMode === Slick.GridAdvancedMode.SINGLE_ITEM ? "List" : "Detailed")
        }



        scope.basketView = !1,
            scope.selectedCategoryName = c.getSelectedCategoryName(),
            scope.categoryBtnWidth = "0%",
            scope.ticketSymbol = null,
            scope.quoteChangeTimestamp = null,
            scope.isNotEmpty = !0,
            scope.showCmDepth = !1,
            scope.viewMode = Slick.GridAdvancedMode.SINGLE_ITEM,
            scope.isClickAndTradeWidgetMode = i.widgetMode && i.specifiedWidgetType === XsWidgetType.CLICK_AND_TRADE;

        var porfolios = MAE.SettingsService.getUserValue(SettingsTypeUser.MARKET_WATCH_PORFOLIOS);
        scope.forcedGroupOrder = {};
        for (var i_p = 0; i_p < porfolios.length; i_p++) {
            var p = porfolios[i_p];
            scope.forcedGroupOrder[p.value] = p.Grupo;
        }

        // scope.forcedGroupOrder = {},
        // scope.forcedGroupOrder[SymbolCategories.FOREX] = ["Major", "Minor", "Emergings"],
        // scope.forcedGroupOrder[SymbolCategories.FAVORITES] = [""],
        // scope.forcedGroupOrder[SymbolCategories.INDICES] = ["Americas", "Asia-Pacific", "Europe"],
        // scope.forcedGroupOrder[SymbolCategories.COMMODITIES] = ["Agriculture", "Energy", "Industrial Metals", "Precious Metals", "Other"],
        // scope.forcedGroupOrder[SymbolCategories.ETFS] = ["ETFs", "ETF CFD"];
        //Rt
        var _columms = [{
            id: "symbol",
            name: a.getString("MARKET_WATCH.SYMBOL"),
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
        }, {
            id: "bid",
            name: a.getString("MARKET_WATCH.BID"),
            field: "bidVWAP",
            behavior: "move",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }, {
            id: "spreadTable",
            name: a.getString("MARKET_WATCH_TICKET.SPREAD"),
            behavior: "move",
            field: "spreadTableVWAP",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: U_formatter,//U
            type: "number"
        }, {
            id: "dailyChange",
            name: a.getString("MARKET_WATCH.CHANGE"),
            behavior: "move",
            field: "dailyChange",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: formato_change,
            type: "number"
        }, {
            id: "ask",
            name: a.getString("MARKET_WATCH.ASK"),
            behavior: "move",
            field: "askVWAP",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }, {
            id: "low",
            name: a.getString("MARKET_WATCH.LOW"),
            behavior: "move",
            field: "low",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter,
            type: "number"
        }, {
            id: "high",
            name: a.getString("MARKET_WATCH.HIGH"),
            behavior: "move",
            field: "high",
            sortable: !0,
            cssClass: "xs-mw-right-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: Q_formatter, //Q
            type: "number"
        }, {
            id: "time",
            name: a.getString("MARKET_WATCH.TIME"),
            field: "time",
            behavior: "move",
            sortable: !0,
            cssClass: "xs-mw-centered-label",
            headerCssClass: "xs-mw-centered-label",
            formatter: B_formatter,//B
            type: "number"
        }];
        i.widgetMode && _columms.push({
            id: "trade",
            name: a.getString("MARKET_ANALYSIS.sentiments.INVEST"),
            field: "trade",
            behavior: "move",
            sortable: !1,
            cssClass: "xs-mw-centered-label",
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
        scope.changePeriod = MAE.SettingsService.getUserValue(SettingsTypeUser.CHANGE_PERIOD);
        MAE.SettingsService.setUserValueAddHandler(SettingsTypeUser.CHANGE_PERIOD, q);
        scope.dailyContextMenu = false;
        scope.symbolMenu = false;
        scope.showAddToFavorites = true;
        scope.openChartMenu = !1;
        scope.symbolCM = null;
        scope.elementCM = null;
        scope.updateGrouppingSettingsForFavorites = true;
        scope.groupingKey = "";
        scope.setCmDepth = function (e) {
            e = e || !1,
                e ? (scope.showCmDepth = e,
                    bt = !0) : e || bt ? bt = !1 : scope.showCmDepth = e
        };

        scope.apply = function (fn) {
            fn();
        };

        scope.addQuotesLightLoaded = function (handle) {

            signalSymbol.add(handle);
        }

        scope.onQuotesLightLoaded = function () {

            signalSymbol.dispatch(scope.quotesLight);
        }

        scope.categorySelected = function (e) {
            var t = e.value;
            flag_selected = true;
            _data_jsp.getContentPane().addClass("initialization")
            if (At === t) {
                if (!scope.basketView)
                    toggleBasketView();

                if (c.changeCategory(t)) {
                    selected(t);
                    if (scope.selectedCategoryName !== t) {
                        scope.selectedCategoryName = t;
                    }
                    if (_grid) {
                        _grid.removeNgLineRenderer();
                        It = false;
                    }
                }

                // scope.basketView || toggleBasketView(),
                //     c.changeCategory(t) && (selected(t),
                //         scope.selectedCategoryName !== t && (scope.selectedCategoryName = t),
                //         _grid && (_grid.removeNgLineRenderer(),
                //             It = !1));
            }

            else {
                scope.basketView && toggleBasketView();
                _grid.pauseRendering();
                if (c.changeCategory(t)) {
                    selected(t);
                    set_grupos(t);
                    if (scope.selectedCategoryName !== t) {
                        setNgRendererTemplate(t, scope.viewMode);
                        scope.selectedCategoryName = t;
                        if (_grid) {
                            _grid.removeNgLineRenderer();
                            It = false;
                        }
                    }
                    switch (t) {
                        case SymbolCategories.FAVORITES:
                            scope.updateGrouppingSettingsForFavorites = true;
                            scope.updateFavoritesGrouppingSettings();
                            _grid.unregisterPlugin(xt);
                            _grid.registerPlugin(Wt);
                            Ft && Ze();
                            var o = _dataView.getItem(0);
                            if (o)
                                disprarOnDblClick(o);
                            else
                                Ct = true;
                            _dataView.refresh();
                            break;
                        default:
                            _grid.unregisterPlugin(Wt);
                            _grid.registerPlugin(xt);
                        // t == SymbolCategories.CRYPTO && c.subscribeGroup(t);
                    }
                }
                // switch (selected(t),
                // k(t),
                // scope.selectedCategoryName !== t && (W(t, scope.viewMode),
                //     scope.selectedCategoryName = t,
                //     _grid && (_grid.removeNgLineRenderer(),
                //         It = !1)),
                // t) {
                //     case SymbolCategories.FAVORITES:
                //         scope.updateGrouppingSettingsForFavorites = !0,
                //             scope.updateFavoritesGrouppingSettings(),
                //             _grid.unregisterPlugin(xt),
                //             _grid.registerPlugin(Wt),
                //             Ft && Ze();
                //         var o = _dataView.getItem(0);
                //         o ? D(o) : Ct = !0,
                //             _dataView.refresh();
                //         break;
                //     default:
                //     _grid.unregisterPlugin(Wt),
                //     _grid.registerPlugin(xt),
                //             t == SymbolCategories.CRYPTO && c.subscribeGroup(t)
                // }
                _grid.playRendering();
            }
            flag_selected = false;
            efectoheight();
            _data_jsp.getContentPane().removeClass("initialization");
            trackPageView();
        };

        scope.delayedGridSizeUpdate = function () {
            setTimeout(function () {
                efectoheight()
            }, 0)
        };

        scope.dailyChangeMode = MAE.SettingsService.getUserValue(SettingsTypeUser.DAILY_CHANGE_MODE);
        MAE.SettingsService.setUserValueAddHandler(SettingsTypeUser.DAILY_CHANGE_MODE, P);
        scope.toggleGridView = function () {
            if (rootScope.sessionType != SymbolSessionType.OPEN)
                return;

            _data_jsp.scrollToY(0);

            if (scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM) {
                scope.viewMode = Slick.GridAdvancedMode.LIST_OF_ITEMS;
                _grid.setRowNgRendererHeight(125);

                _grid.unregisterPlugin(Wt);

                if (!(gt && mt))
                    setClickAndTradePanel();

                setNgRendererTemplate(scope.selectedCategoryName, Slick.GridAdvancedMode.LIST_OF_ITEMS);
                _dataView.resetSort();
                _grid.resetSortColumns();

                if (scope.ticketSymbol)
                    scope.closeTicket(false, scope.ticketSymbol.symbol);

                $("#mwGrid .slick-header-columns").addClass("no-header");
                $("#mwGrid").addClass("mode-clickandtarede");

                if (_grid) {
                    _grid.removeNgLineRenderer();
                    It = false;
                }

            }
            else {
                scope.viewMode = Slick.GridAdvancedMode.SINGLE_ITEM;
                _grid.registerPlugin(Wt);
                _grid.setRowNgRendererHeight(270);

                $("#mwGrid .slick-header-columns").removeClass("no-header");
                $("#mwGrid").removeClass("mode-clickandtarede");

                if (!(_clickandtradepanel && _clickandtradepanel_st))
                    compilarTraderPanel();

                //u.destroyInvalidValues();


            }

            setmwView();
            setGridViewMode();
            scope.delayedGridSizeUpdate();
            trackPageView();


            // scope.viewMode == Slick.GridAdvancedMode.SINGLE_ITEM ? (scope.viewMode = Slick.GridAdvancedMode.LIST_OF_ITEMS,
            //     _grid.unregisterPlugin(Wt),
            //     gt && mt || x(),
            //     W(scope.selectedCategoryName, Slick.GridAdvancedMode.LIST_OF_ITEMS),
            //     _dataView.resetSort(),
            //     _grid.resetSortColumns(),
            //     scope.ticketSymbol && scope.closeTicket(false, scope.ticketSymbol.symbol),
            //     $("#mwGrid .slick-header-columns").addClass("no-header"),
            //     $("#mwGrid").addClass("mode-clickandtarede"),
            //     _grid && (_grid.removeNgLineRenderer(),
            //         It = !1)) : (scope.viewMode = Slick.GridAdvancedMode.SINGLE_ITEM,
            //             _grid.registerPlugin(Wt),
            //             $("#mwGrid .slick-header-columns").removeClass("no-header"),
            //             $("#mwGrid").removeClass("mode-clickandtarede"),
            //             _clickandtradepanel && _clickandtradepanel_st || compilarTraderPanel(),
            //             u.destroyInvalidValues()),
            //     setmwView(),
            //     K(),
            //     scope.delayedGridSizeUpdate(),
            //     tt()
        };
        var Ht = a.getString("CONTEXT_MENU.TRADE");
        scope.setDailyChangeMode = function (e) {
            MAE.SettingsService.setUserValue(SettingsTypeUser.DAILY_CHANGE_MODE, e);
            scope.dailyChangeMode = e;
            updateRowCountAndrender();
        };

        scope.setDailyChangeInterval = function (e) {
            q(e);
            MAE.SettingsService.setUserValue(SettingsTypeUser.CHANGE_PERIOD, e);
            updateRowCountAndrender();
        };

        scope.onMenuOpen = function (e) {
            scope.dailyContextMenu = !1,
                scope.mwTicketMenu = !1,
                scope.symbolMenu = !1,
                scope.showAddGroupInput = !1,
                scope.showAddToFavorites = !1,
                $(".favorite-groups-ul").hide();
            var t = e.pageX - $(e.currentTarget).offset().left
                , o = _grid.getCellFromPoint(t, 0)
                , r = _grid.getColumns()[o.cell].id
                , s = $(e.target).closest("div.mw-ticket-panel");
            if (s.length > 0 && e.target.id.indexOf("daily") == -1) {
                var l = $(e.target).closest("click-and-trade-panel");
                scope.viewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS ? l.length > 0 && (scope.elementCM = l,
                    scope.symbolCM = angular.element(l[0]).scope().ticketSymbol,
                    scope.symbolMenu = !0,
                    scope.mwTicketMenu = !0) : (scope.symbolCM = _grid.getSingleItemRendererData(),
                        l.length > 0 && (scope.elementCM = l),
                        scope.symbolMenu = !0,
                        scope.mwTicketMenu = !0)
            } else if ("dailyChange" == r && !$(e.target).hasClass("grid-canvas") || e.target.id.indexOf("daily") > -1)
                scope.dailyContextMenu = !0;
            else {
                var u = $(e.target).closest("div.slick-row").attr("row");
                scope.symbolCM = _grid.getDataItem(u),
                    scope.symbolMenu = !(!scope.symbolCM || scope.symbolCM.__group)
            }
            if (scope.symbolMenu) {
                if (i.widgetMode)
                    scope.openChartMenu = !1;
                else {
                    scope.openChartMenu = c.canAddSymbol(scope.symbolCM.key);
                    var d = element.find("#context-menu-market-watch-open-chart");
                    scope.openChartMenu && d.hasClass("disable") ? (d.attr("title", ""),
                        d.removeClass("disable")) : scope.openChartMenu || d.hasClass("disable") || (d.attr("title", a.getString("CHART.MAX_CHARTS", {
                            count: XChartConst.MAX_CHARTS
                        })),
                            d.addClass("disable"))
                }
                scope.showAddToFavorites = !c.isFavoriteSymbol(scope.symbolCM.key)
            }
            scope.setCmDepth(),
                scope.showCmDepth && (scope.dailyContextMenu = false,
                    scope.symbolMenu = false)
        };

        scope.closeMWContextMenu = function () {
            $("#marketWatchCtxMenu").hasClass("open") && j()
        };

        scope.openTradePopup = function (e) {
            c.openTradePopup(e)
        };

        scope.openChart = function (e) {
            c.openChart(e)
        };

        scope.removeFavorite = function (e) {
            scope.removeQuoteFromFavoriteGroup(e),
                c.removeFavoriteSymbol(e)
        };

        scope.areFavoriteGroupsEmpty = function () {
            return void 0 == favoriteGrCoLength && (favoriteGrCoLength = favoriteGroupsCountLength()),
                favoriteGrCoLength
        };

        scope.updateFavoritesGrouppingSettings = function () {
            c.getSelectedCategoryName() === SymbolCategories.FAVORITES && scope.updateGrouppingSettingsForFavorites && (favoriteGrCoLength ? _dataView.setGrouping([]) : (Ut.forcedGroupOrder = scope.forcedGroupOrder[SymbolCategories.FAVORITES],
                _dataView.setGrouping(Ut)),
                _grid.invalidate(),
                scope.updateGrouppingSettingsForFavorites = !1)
        };

        scope.quoteAddedToFavoriteGroupHandler = function (t, o) {
            scope.closeTicket();
            var r = favoriteGrCoLength;
            $e(t, J(o)),
                favoriteGrCoLength = favoriteGroupsCountLength(),
                r !== favoriteGrCoLength && (scope.updateGrouppingSettingsForFavorites = !0),
                scope.updateFavoritesGrouppingSettings(),
                c.saveFavoriteSymbolSettings(_dataView.getItems()),
                e(function () {
                    Ye(t)
                }, 100)
        };

        scope.changeFavoriteGroupForQuote = function (e, t) {
            if (e) {
                var o = favoriteGrCoLength;
                e.favoriteGroup && ee(e.key, e.favoriteGroup),
                    t ? (e.setFavoriteGroup(t),
                        te(e.key, t)) : e.setFavoriteGroup(),
                    favoriteGrCoLength = favoriteGroupsCountLength(),
                    o !== favoriteGrCoLength && (scope.updateGrouppingSettingsForFavorites = !0),
                    c.saveFavoriteSymbolsGroupsSettings(scope.favoriteGroups)
            }
        };

        scope.removeQuoteFromFavoriteGroup = function (e) {
            // var t = l.getQuote(e);
            // t && t.favoriteGroup && (scope.changeFavoriteGroupForQuote(t),
            //     scope.selectedCategoryName === SymbolCategories.FAVORITES && (scope.updateFavoritesGrouppingSettings(),
            //         c.saveFavoriteSymbolSettings(_dataView.getItems())))
        };

        scope.rootScopeHandle = function (data) {
            if ("sessionType" in data) {
                scope.closeTicket(false);
            }

        }


        rootScope.addHandle(scope.rootScopeHandle);

        scope.closeTicket = function (e, t) {


            if (e) {
                if (_grid.getSingleItemRendererData())
                    scope.removeFavorite(_grid.getSingleItemRendererData().symbol.key)
                else {
                    if (t)
                        scope.removeFavorite(t.key)

                }
            }


            if (_grid)
                _grid.hideNgLineRenderer();

            scope.ticketSymbol = null;
            scope.delayedGridSizeUpdate();
            _grid.focus();

        };

        scope.updateTicketSize = function (e) {
            var t;
            t = e > 0 ? Slick.GridAdvancedItemViewMode.VISIBLE_EXTENDED : Slick.GridAdvancedItemViewMode.VISIBLE;
            _grid.setSingleItemViewMode(t);
            efectoheight();
        };
        var xt = new Slick.RowMoveManager({
            cancelEditOnDrag: true,
            moveOneRowOnly: true,
            dragOutsideCallback: dragOutside
        });
        var Wt = new Slick.RowMoveManager({
            cancelEditOnDrag: true,
            moveOneRowOnly: true,
            dragOutsideCallback: dragOutside
        });
        var Kt = null;
        Wt.onBeforeMoveRows.subscribe(function (e, t) {
            return scope.ticketSymbol && (scope.ticketSymbol == _grid.getDataItem(t.rows[0]) && (Kt = scope.ticketSymbol),
                scope.closeTicket(false)),
                scope.closeMWContextMenu(),
                _dataView.resetSort(),
                _grid.resetSortColumns(),
                true
        });
        Wt.onMoveRows.subscribe(function (e, t) {
            var o = t.rows
                , r = t.insertBefore;
            favoriteGrCoLengthyt ? ue(o, r) : ce(o, r),
                le()
        });
        var Lt = {
            getter: function (e) {
                return e.symbolGroup.name
            },
            formatter: me,
            comparer: ge,
            forcedGroupOrder: null,
            aggregateCollapsed: !1,
            lazyTotalsCalculation: !1,
            displayTotalsRow: !1,
            collapsed: !0
        };
        var Ut = {
            getter: function (e) {
                return e.favoriteGroup ? e.favoriteGroup : ""
            },
            formatter: ve,
            comparer: ge,
            forcedGroupOrder: null,
            aggregateCollapsed: !1,
            lazyTotalsCalculation: !1,
            displayTotalsRow: !1,
            collapsed: !0
        };
        var Vt = [{
            getter: function (e) {
                return e.idAssetClass
            },
            formatter: pe,
            comparer: ge,
            forcedGroupOrder: [AssetClass.STC, AssetClass.EQ],
            aggregateCollapsed: !1,
            lazyTotalsCalculation: !1,
            displayTotalsRow: !1,
            collapsed: !0
        }, {
            getter: function (e) {
                return e.symbolGroup.name
            },
            formatter: me,
            comparer: ge,
            forcedGroupOrder: null,
            aggregateCollapsed: false,
            lazyTotalsCalculation: false,
            displayTotalsRow: false,
            collapsed: true
        }];
        scope.personalizeTable = function () {
            t.showPersonalizationWindow(_moduleType, _grid, _columms)
        };
        //efectoheight

        setTimeout(function () {
            setTimeout(function () {
                efectoheight();
            }, 0)
        }, 0, true);


        _makeBody();

        setmwView();
        _makeBlokAndAppend("marketWatchtemplateGrid", "marketwatch-grid");

        _makeEvents();

        s.subscribeModuleAction(ModulesType.MARKET_WATCH, module_action, "marketWatchModule");
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
                    , o = c.isFavoriteSymbol(t.key)
                    , r = o ? scope.menuSymbolCategories[0] : scope.menuSymbolCategories.filter(function (e) {
                        return e.label === t.symbolGroup.category
                    })[0];
                null != r && (r.selected = !0,
                    scope.categorySelected(r),
                    o ? Xe(t.key) : qe(t))
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



        function compilarClickAndTradePanel() {//oe
            ct = scope.new;
            _clickandtradepanel = new marketTrade(scope, true, _grid);//o('<click-and-trade-panel id="fsTicket" class="mw-ticket" close-mw-context-menu="closeMWContextMenu" close-ticket="closeTicket(removeItem, symbol)" update-ticket-size="updateTicketSize(size)" quote-change-timestamp="quoteChangeTimestamp" quote="ticketSymbol" add-fav-symbol-enabled="true" show-cm-depth="setCmDepth(value)"  ct-mode="false"></click-and-trade-panel>')(ct)
        }

        function ponerTemplateRow(e) {//ie

            if (dt === e && It) // si ya lo compile lo uso
                _grid.updateNgLineRenderer();
            else {
                if (e === St.MW_SYMBOL_TICKET) {/*ct.$destroy(),*/
                    compilarClickAndTradePanel();
                    _grid.showNgLineRenderer(_clickandtradepanel, true);
                    _clickandtradepanel.invalidate(true);
                    It = true;
                }
                else {
                    //lt.$destroy();
                    compilarClickAndTradePanel_st();
                    _grid.showNgLineRenderer(_clickandtradepanel_st, true);
                    _clickandtradepanel.invalidate(false);
                    It = true;
                }
                dt = e;
            }
        }

        function compilarClickAndTradePanel_st() {//re
            lt = scope.new;
            _clickandtradepanel_st = new marketTrade(scope, false, _grid);//o('<click-and-trade-panel id="fsTicket" class="mw-ticket" close-mw-context-menu="closeMWContextMenu" close-ticket="closeTicket(removeItem, quote)" update-ticket-size="updateTicketSize(size)" quote-change-timestamp="quoteChangeTimestamp" quote="ticketSymbol" show-cm-depth="setCmDepth(value)"  ct-mode="false"></click-and-trade-panel>')(lt)
        }

        function compilarTraderPanel() { //ae
            compilarClickAndTradePanel();
            compilarClickAndTradePanel_st();
        }

        scope.onDblClickFromService = function (t, o) {
            _onDblClick(t, o);
        }

        function _onDblClick(t, o) {//ne
            if (t || !i.widgetMode)/* && i.specifiedWidgetType !== XsWidgetType.CLICK_AND_TRADE ||*/ {
                _dataView.resetSort();
                _grid.resetSortColumns();
                if (!t.tick) {
                    t = _grid.getDataItem(o.row);
                }

                if (t.tick) {
                    _grid.setActiveCell(_dataView.getRowById(t.key), 0);
                    _grid.setSingleItemRendererData(t, true);
                    scope.ticketSymbol = _grid.getSingleItemRendererData();
                    scope.quoteChangeTimestamp = (new Date).getTime();
                    _clickandtradepanel && _clickandtradepanel_st || compilarTraderPanel();


                    ponerTemplateRow(scope.selectedCategoryName === SymbolCategories.FAVORITES ? St.FAVORITE_SYMBOL_TICKET : St.MW_SYMBOL_TICKET);
                    setTimeout(function () {
                        efectoheight();
                        _singleClickFlag = false;
                    }, 10);

                    //console.log("_singleClickFlag *** onDblClick "  + _singleClickFlag);
                }
                else
                    Tt = t;
            }
        }

    };

    function _focusGrid() {
        if(_grid)
        {
            _grid.focus();
            showEfectFocusGrid();
            _grid.setSelectionModel(new Slick.RowSelectionModel);
            _grid.setSelectedRows([0]);//la primera
        }


    };

    function showEfectFocusGrid() {
        $("#mwGrid").removeClass("mode-focus");
        setTimeout(function () {
            $("#mwGrid").addClass("mode-focus");

        }, 10);


    }



    function _onDblClickService(t, o) {//ne
        scope.onDblClickFromService(t, o);
    }

    function _expandGroup(groupName) {
        scope.groupingKey = groupName;
        _dataView.expandGroup(groupName);

    }

    jq.extend(true, window, {
        MAE: {
            MarketWatchModule:
            {
                link: _link,
                isLoad: _isLoad,
                toggleGridView: _toggleGridView,
                focusGrid: _focusGrid,
                expandGroup: _expandGroup,
                onDblClick: _onDblClickService
            }
        }
    });






})(jQuery);



