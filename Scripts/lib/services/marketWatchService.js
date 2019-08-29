(function (jq) {

    var e = rootScope;
    var n = MAE.LayoutService;
    var s = MAE.LogsService;
    var a = MAE.SettingsService;
    var i = MAE.PopupsService;
    var o = MAE.MaeApiService;
    var r = MAE.MaePriceChangeService;
    var _trackPrecios = {};

    var grupo_actual = null;
    function _init() {

        if (!e.widgetMode)
            se = MAE.ChartsService;

    }
    function disprarDataProviderEvent(e, t) {//u
        switch (e) {
            case DataEvent.NEW:
            case DataEvent.EXIST:
            case DataEvent.UPDATED:
                var o = t;
                signalDataProviderEvent.dispatch(DataProviderEvent.ITEM_UPDATED, o);
                break;
            case DataEvent.NO_DATA:
        }
    }
    function onPriceChangeUpdate(e, producto) {//c
        _trackPrecios[producto.key] = producto;
        signalPriceChangeUpdate.dispatch(e, producto);
        if (producto.symbolGroup.category === _categoria && producto.symbolGroup.name === grupo_actual) {
            disprarDataProviderEvent(DataEvent.UPDATED, producto);

        }

    }
    function armarProductosPorCategoria(e) {//d
        for (var t, o = 0; o < e.length; o++) {
            var r = e[o];
            _trackPrecios[r.key] = r;
            if (!r.symbol.isCloseOnly) {
                var a = r.symbolGroup.category;
                switch (a) {
                    case SymbolCategories.CASH_STOCKS:
                        t = r.idAssetClass + ":" + r.symbolGroup.name + "_" + a;
                        break;
                    case SymbolCategories.CRYPTO:
                        t = a + "_" + a;
                        break;
                    default:
                        t = r.symbolGroup.name + "_" + a;
                }
                ge[t] ? ge[t].push(r.key) : ge[t] = [r.key],
                    me[a] ? me[a].push(r) : me[a] = [r];
            }
        }
        me[SymbolCategories.FAVORITES] = [];
    }
    function _addFavoritesToCategory(e) {
        me[SymbolCategories.FAVORITES] = e;
        if (_categoria === SymbolCategories.FAVORITES)
            signalDataProviderEvent.dispatch(DataProviderEvent.ITEMS_LOADED, me[SymbolCategories.FAVORITES]);
        //_categoria === SymbolCategories.FAVORITES && fe.dispatch(DataProviderEvent.ITEMS_LOADED, me[SymbolCategories.FAVORITES])
    }
    function _changeCategory(categoria) {

        if (_categoria !== categoria) {
            cambiar_categoria();
            _categoria = categoria;
            a.setUserValue(SettingsTypeUser.MARKET_WATCH_CATEGORY, categoria);
            signalDataProviderEvent.dispatch(DataProviderEvent.ITEMS_LOADED, me[categoria]);
            return true;
        }

        return false;
    }
    function _getSelectedCategoryName() {
        return _categoria;
    }
    function _openTradePopup(e) {
        i.addPopup("popupTradeTicket", !0, !0, PopupsType.POPUP_TRADE_TICKET, {
            symbolKey: e.key
        });
    }
    function _canAddSymbol(e) {
        return se.canAddSymbol(e);
    }
    function _openChart(e) {
        se.openChart(e, void 0, !0);
    }
    function _itemDragAndDrop(e, t) {
        se = MAE.ChartsService;
        se && se.itemDragAndDrop(e, t);

        MAE.DepthService.itemDragAndDrop(e, t);
    }



    function _loadAllQuotesLight(e) {
        var promise;
        if (productosGlobal.length == 0)
             promise = AppContext.getProductosIniciales();
        else
            promise = new Promise(function (resolve, reject) { resolve({}); });
                    

            promise.then(function (p) {
                T({}, productosGlobal);

                setTimeout(function () {
                    if (productosGlobal.length > 0) {
                        var item_temp = productosGlobal.find(function (x) { return x.porDefecto; });
                        var name = item_temp ? item_temp.symbolGroup.name : productosGlobal[0].symbolGroup.name;
                        _expandFirst(name);
                    }
                }, 0);


            });
        


        //o.loadAllQuotesLight(e, !0)
    }

    function _initData() {
        _loadAllQuotesLight(T);
    }
    function T(e, t) {
        le = _getFavoriteQuotesKeys();
        armarProductosPorCategoria(t);
        if (le.length > 0) {
            ue = le.slice();
            _saveFavoriteSymbolSettings(le.slice());
        }
        else {
            ue = [];
            h();
        }

        signalQuotesLightLoaded.dispatch(t);
    }
    function h() {
        if (!pe) {
            if (0 === le.length) {
                pe = true;
                A();
                signalFavoriteQuotesInitialized.dispatch(ve);
            }
        }


        // pe || 0 === le.length && (pe = !0,
        //     A(),
        //     be.dispatch(ve))
    }
    function A() {
        for (var e = 0; e < ue.length; e++) {
            var t = ue[e];
            ye[t] && (ve[ve.length] = ye[t]);
        }
    }
    function E(e, t) {
        switch (e) {
            case DataEvent.NEW:
            case DataEvent.EXIST:
            case DataEvent.UPDATED:
                var o = t;
                ye[o.key] ? pe && signalQuoteUpdate.dispatch(o) : (M(o),
                    signalFavoriteSymbol.dispatch(o.key, DataEvent.UPDATED, {
                        isFav: !0,
                        symbolKey: o.key
                    }));
                break;
            case DataEvent.NO_DATA:
                var r = t;
                if (s.logWarn("marketWatch.service", "favoriteQuoteUpdate", "NO_DATA", r),
                    !pe) {
                    var a = le.indexOf(r);
                    a !== -1 && le.splice(a, 1),
                        h();
                }
                break;
            case DataEvent.REMOVED:
        }
    }
    function M(e) {
        if (ye[e.key] = e,
            le.length > 0) {
            var t = le.indexOf(e.key);
            t !== -1 && (le.splice(t, 1),
                h());
        } else {
            ve.splice(0, 0, e);
            K(ve);
            signalFavoriteQuoteAdded.dispatch(e, 0);
        }
        // ve.splice(0, 0, e),
        //     K(ve),
        //     signalFavoriteQuoteAdded.dispatch(e, 0)
    }
    function _saveFavoriteSymbolSettings(e) {
        return ke(e);
    }
    function getAndSubscribePriceChange(e) {//G
        o.loadAndSubscribeQuotes(e, E);
        var t = e.map(function (e) {
            return SymbolKeyUtils.getTickKeyFromSymbolKey(e);
        });
        r.getAndSubscribePriceChange(t, onPriceChangeUpdate);
    }
    function I(e) {
        ye[e.key] && (delete ye[e.key],
            B([e.key]));
    }
    function w(e) {
        var t = ye[e];
        if (t)
            for (var o = 0; o < ve.length; o++) {
                var r = ve[o];
                if (r.key === e) {
                    ve.splice(o, 1),
                        I(r),
                        K(ve),
                        signalFavoriteQuote.dispatch(r),
                        signalFavoriteSymbol.dispatch(e, DataEvent.UPDATED, {
                            isFav: !1,
                            symbolKey: e
                        });
                    break;
                }
            }
    }
    function _addFavoriteSymbol(e) {
        if (MAE.LayoutService.getModuleIsShown(ModulesType.MARKET_WATCH) && pe)
            getAndSubscribePriceChange([e]);
        else {
            var t = _getFavoriteQuotesKeys();
            _isFavoriteSymbol(e) || (t.splice(0, 0, e),
                a.setModuleValue(ModulesType.MARKET_WATCH, "symbols", t),
                signalFavoriteSymbol.dispatch(e, DataEvent.UPDATED, {
                    isFav: !0,
                    symbolKey: e
                }));
        }
    }
    function _removeFavoriteSymbol(e) {
        // var n = MAE.LayoutService;
        // if (n.getModuleIsShown(ModulesType.MARKET_WATCH) && pe)
        //     w(e);
        // else {
        //     var t = _getFavoriteQuotesKeys();
        //     _isFavoriteSymbol(e) && (t.splice(t.indexOf(e), 1),
        //         a.setModuleValue(ModulesType.MARKET_WATCH, "symbols", t),
        //         signalFavoriteSymbol.dispatch(e, DataEvent.UPDATED, {
        //             isFav: !1,
        //             symbolKey: e
        //         }))
        // }
    }
    function _toggleFavoriteSymbol(e) {
        _isFavoriteSymbol(e) ? _removeFavoriteSymbol(e) : _addFavoriteSymbol(e);
    }
    function _isFavoriteSymbol(e) {
        return n.getModuleIsShown(ModulesType.MARKET_WATCH) && pe ? void 0 !== ye[e] : _getFavoriteQuotesKeys().indexOf(e) !== -1;
    }
    function _loadAndSubscribeIsFavoriteSymbol(e, t) {
        signalFavoriteSymbol.addSubscribtion(e, t),
            t(DataEvent.EXIST, {
                isFav: D(e),
                symbolKey: e
            });
    }
    function _unsubscribeIsFavoriteSymbol(e, t) {
        signalFavoriteSymbol.removeSubscribtion(e, t);
    }
    function _clearData() {
        cambiar_categoria(),
            _categoria = null,
            de = null,
            ge = {},
            me = {};
    }
    function _clearFavoritesData() {
        var e = ve.map(function (e) {
            return e.key;
        });
        B(e),
            ve = [],
            ye = {},
            pe = !1;
    }
    function _getFavoriteSymbolsGroupsSettings() {
        a = MAE.SettingsService;
        return a.getModuleValue(ModulesType.MARKET_WATCH, "symbolsGroups") || []
    }
    function _saveFavoriteSymbolsGroupsSettings(e) {
        a.setModuleValue(ModulesType.MARKET_WATCH, "symbolsGroups", e)
    }
    function K(e) {
        var t, o;
        void 0 === e && (e = ve);
        var r = [];
        for (t = 0,
            o = e.length; t < o; t++)
            r.indexOf(e[t].key) === -1 && (r[r.length] = e[t].key);
        a.setModuleValue(ModulesType.MARKET_WATCH, "symbols", r);
    }
    function cambiar_categoria() {//L
        if (de) {
            var e = ge[de];
            if (e) {
                for (var t in ye) {
                    var o = e.indexOf(t);
                    o !== -1 && e.splice(o, 1)
                }
                unsubscribeLoadSymbol(e);
                de = null;
            }
        }
    }
    function _subscribeGroup(e) {
        if (_categoria && e) {
            grupo_actual = e;
            var t = e + "_" + _categoria;
            if (null !== de && de.indexOf(e + ":") !== -1)
                return;
            t !== de && cambiar_categoria();
            var o = ge[t];
            if (o) {
                subscribeLoadSymbol(o);
                de = t;
            }

        }
    }
    function _unsubscribeGroup(e) {
        if (_categoria && e) {
            var t = e + "_" + _categoria;
            t === de && cambiar_categoria();
        }
    }
    function subscribeLoadSymbol(e) {//Q
        e.length > 0 && (o.subscribeLoadSymbol(e, disprarDataProviderEvent));
        r.getAndSubscribePriceChange(SymbolKeyUtils.getTickKeysFromSymbolKeys(e), onPriceChangeUpdate);
    }
    function unsubscribeLoadSymbol(e) {//$
        e.length > 0 && (o.unsubscribeLoadSymbol(e, disprarDataProviderEvent));
        r.unsubscribePriceChange(SymbolKeyUtils.getTickKeysFromSymbolKeys(e), onPriceChangeUpdate);
    }
    function B(e) {
        o.unsubscribeLoadSymbol(e, E);
        var t = e.map(function (e) {
            return SymbolKeyUtils.getTickKeyFromSymbolKey(e);
        });
        r.unsubscribePriceChange(t, onPriceChangeUpdate);
    }
    function _addDataProviderEventHandler(e) {
        signalDataProviderEvent.add(e);
    }
    function _removeDataProviderEventHandler(e) {
        signalDataProviderEvent.remove(e);
    }
    function _addPriceChangeUpdateHandler(e) {
        signalPriceChangeUpdate.add(e);
    }
    function _removePriceChangeUpdateHandler(e) {
        signalPriceChangeUpdate.remove(e);
    }
    function _addFavoriteQuotesInitializedHandler(e) {
        signalFavoriteQuotesInitialized.add(e);
    }
    function _removeFavoriteQuotesInitializedHandler(e) {
        signalFavoriteQuotesInitialized.remove(e);
    }
    function _addQuotesLightLoadedHandler(e) {
        signalQuotesLightLoaded.add(e);
    }
    function _removeQuotesLightLoadedHandler(e) {
        signalQuotesLightLoaded.remove(e);
    }
    function _addFavoriteQuoteAddedHandler(e) {
        signalFavoriteQuoteAdded.add(e);
    }
    function _addFavoriteQuoteRemovedHandler(e) {
        signalFavoriteQuote.add(e);
    }
    function _removeFavoriteQuoteAddedHandler(e) {
        signalFavoriteQuoteAdded.remove(e);
    }
    function _removeFavoriteQuoteRemovedHandler(e) {
        signalFavoriteQuote.remove(e);
    }
    function _addQuoteUpdateHandler(e) {
        signalQuoteUpdate.add(e);
    }
    function _removeQuoteUpdateHandler(e) {
        signalQuoteUpdate.remove(e);
    }
    var se, le, ue, /*ce*/ _categoria = null, de = null, ge = {}, me = {}, pe = !1, ve = [], ye = {};
    var signalDataProviderEvent = new signals.Signal,//fe
        signalPriceChangeUpdate = new signals.Signal,//Se
        signalQuoteUpdate = new signals.Signal,//Ce
        signalFavoriteQuotesInitialized = new signals.Signal,//be
        signalQuotesLightLoaded = new signals.Signal,//Te
        signalFavoriteQuoteAdded = new signals.Signal,//he
        signalFavoriteQuote = new signals.Signal,//Ae
        signalFavoriteSymbol = new MapWithSignals;//Ee

    _init();
    var _getFavoriteQuotesKeys = function () {
        var e = []
            , t = a.getModuleValue(ModulesType.MARKET_WATCH, "symbols");

        return e;
    };
    var ke = function (e) {
        for (var t = [], a = 0; a < e.length; a++)
            t[t.length] = SymbolKeyUtils.getTickKeyFromSymbolKey(e[a]);
        MAE.MaeApiService.subscribeLoadSymbol(e, E);
        MAE.MaePriceChangeService.getAndSubscribePriceChange(t, onPriceChangeUpdate);
    };
    var Ge = function () {
        /*Aca esta el link al servicio del server*/
        var e = [];//o.getAllQuotesLight()
        var t = [];
        var r = [];
        var a = function (e, t) {
            return e.symbol.ordinalNumber > t.symbol.ordinalNumber ? 1 : e.symbol.ordinalNumber < t.symbol.ordinalNumber ? -1 : 0;
        };
        if (e.length > 0) {
            for (var i = 0; i < e.length; i++) {
                var n = e[i];
                n.symbol.defaultGroup && (t[t.length] = n);
            }
            for (t.sort(a),
                i = 0; i < t.length; i++)
                r[r.length] = t[i].key,
                    signalFavoriteSymbol.dispatch(t[i].key, DataEvent.UPDATED, {
                        isFav: !0,
                        symbolKey: t[i].key
                    });
            return r;
        }
        return [];
    };

    function _expandFirst(groupName) {
        MAE.MarketWatchModule.expandGroup(groupName);
        
        var porDefecto = productosGlobal.find(function (x) { return x.porDefecto; });
        MAE.MarketWatchModule.onDblClick(porDefecto, null);
       

        MAE.ChartsService.open(ChartEvent.OPEN_CHART, porDefecto);
        window.AppComponent.ShowGraphs(porDefecto.id + '/' + porDefecto.name);
        MAE.LayoutService.moduleIsReady(ModulesType.CHARTS);
        var module = MAE.LayoutService.getModule(ModulesType.CHARTS);
        var h = module.content.css("height");
        $("#tv_chart_container").css("height", h);


        MAE.ChartsService.subscribeResized(function (data) {
            $("#tv_chart_container").css("height", data.height + "px");

        });
    }

    function _getTrackProductByKey(key)
    {
        return _trackPrecios[key];
    }

    var _marketWatchService = {

        getSelectedCategoryName: _getSelectedCategoryName,//p
        changeCategory: _changeCategory, //m
        addDataProviderEventHandler: _addDataProviderEventHandler, //Y
        removeDataProviderEventHandler: _removeDataProviderEventHandler,//z
        clearData: _clearData, //P
        subscribeGroup: _subscribeGroup,//U
        unsubscribeGroup: _unsubscribeGroup,//V
        addPriceChangeUpdateHandler: _addPriceChangeUpdateHandler,//X
        removePriceChangeUpdateHandler: _removePriceChangeUpdateHandler,//q
        addFavoritesToCategory: _addFavoritesToCategory,//g
        saveFavoriteSymbolsGroupsSettings: _saveFavoriteSymbolsGroupsSettings,//W
        openTradePopup: _openTradePopup,//v
        openChart: _openChart, //f
        canAddSymbol: _canAddSymbol,//y
        itemDragAndDrop: _itemDragAndDrop,//S
        addFavoriteSymbol: _addFavoriteSymbol, //F
        removeFavoriteSymbol: _removeFavoriteSymbol,//R
        toggleFavoriteSymbol: _toggleFavoriteSymbol,//_
        isFavoriteSymbol: _isFavoriteSymbol,//D
        addFavoriteQuoteAddedHandler: _addFavoriteQuoteAddedHandler, //te
        removeFavoriteQuoteAddedHandler: _removeFavoriteQuoteAddedHandler,//re
        addFavoriteQuoteRemovedHandler: _addFavoriteQuoteRemovedHandler,//oe
        removeFavoriteQuoteRemovedHandler: _removeFavoriteQuoteRemovedHandler,//ae
        loadAndSubscribeIsFavoriteSymbol: _loadAndSubscribeIsFavoriteSymbol,//O
        unsubscribeIsFavoriteSymbol: _unsubscribeIsFavoriteSymbol,//N
        getFavoriteQuotesKeys: _getFavoriteQuotesKeys, //Me
        addFavoriteQuotesInitializedHandler: _addFavoriteQuotesInitializedHandler,//j
        removeFavoriteQuotesInitializedHandler: _removeFavoriteQuotesInitializedHandler,//Z
        addQuotesLightLoadedHandler: _addQuotesLightLoadedHandler,//J
        removeQuotesLightLoadedHandler: _removeQuotesLightLoadedHandler,//ee
        addQuoteUpdateHandler: _addQuoteUpdateHandler, //ie
        removeQuoteUpdateHandler: _removeQuoteUpdateHandler, //ne
        getFavoriteSymbolsGroupsSettings: _getFavoriteSymbolsGroupsSettings,//x
        saveFavoriteSymbolSettings: _saveFavoriteSymbolSettings,//k
        initData: _initData,//b
        clearFavoritesData: _clearFavoritesData,//H
        getTrackProductByKey : _getTrackProductByKey,
        favoriteQuotes: function () {
            return ve;
        },
        expandFirst: _expandFirst
    };


    jq.extend(true, window, {
        MAE: {
            MarketWatchService: _marketWatchService
        }
    });

})(jQuery);