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
    function armarProductosPorCategoria(productos) {//d
        for (var name, o = 0; o < productos.length; o++) {
            var item = productos[o];
            _trackPrecios[item.key] = item;
            if (!item.symbol.isCloseOnly) {
                var categoria_temp = item.symbolGroup.category;
                name = item.symbolGroup.name + "_" + categoria_temp;

                _productoByName[name] ? _productoByName[name].push(item.key) : _productoByName[name] = [item.key];
                _productoByCategoria[categoria_temp] ? _productoByCategoria[categoria_temp].push(item) : _productoByCategoria[categoria_temp] = [item];
            }
        }
    }

    function _changeCategory(categoria) {

        if (_categoria !== categoria) {
            cambiar_categoria();
            _categoria = categoria;
            MAE.SettingsService.setUserValue(SettingsTypeUser.MARKET_WATCH_CATEGORY, categoria);
            signalDataProviderEvent.dispatch(DataProviderEvent.ITEMS_LOADED, _productoByCategoria[categoria]);
            return true;
        }

        return false;
    }
    function _getSelectedCategoryName() {
        return _categoria;
    }

    function _itemDragAndDrop(e, t) {
        MAE.DepthService.itemDragAndDrop(e, t);
    }



    function _cargarProductos(accion) {
        var promise;
        if (productosGlobal.length == 0)
            promise = AppContext.getProductosIniciales();
        else
            promise = new Promise(function (resolve, reject) { resolve({}); });

            

            promise.then(function (p) {
                accion({}, productosGlobal);
            });
        


    }

    function _initData() {
        _cargarProductos(onPrecios);
    }

    function onPrecios(obj, productos) {
        armarProductosPorCategoria(productos);
        signalQuotesLightLoaded.dispatch(productos);
    }

    function getAndSubscribePriceChange(e) {//G
        o.loadAndSubscribeQuotes(e, E);
        var t = e.map(function (e) {
            return SymbolKeyUtils.getTickKeyFromSymbolKey(e);
        });
        MAE.MaePriceChangeService.getAndSubscribePriceChange(t, onPriceChangeUpdate);
    }


    function _clearData() {
        cambiar_categoria();
        _categoria = null;
        _categoria_formada = null;
        _productoByName = {};
        _productoByCategoria = {};
    }


    function cambiar_categoria() {//L
        if (_categoria_formada) {
            var e = _productoByName[_categoria_formada];
            if (e) {
                // for (var t in ye) {
                //     var o = e.indexOf(t);
                //     o !== -1 && e.splice(o, 1)
                // }
                unsubscribeLoadSymbol(e);
                _categoria_formada = null;
            }
        }
    }
    function _subscribeGroup(e) {
        if (_categoria && e) {
            grupo_actual = e;
            var t = e + "_" + _categoria;
            if (null !== _categoria_formada && _categoria.indexOf(e + ":") !== -1)
                return;
            t !== _categoria_formada && cambiar_categoria();
            var o = _productoByName[t];
            if (o) {
                subscribeLoadSymbol(o);
                _categoria_formada = t;
            }

        }
    }
    function _unsubscribeGroup(e) {
        if (_categoria && e) {
            var t = e + "_" + _categoria;
            t === _categoria_formada && cambiar_categoria();
        }
    }


    function subscribeLoadSymbol(e) {//Q
        e.length > 0 && (o.subscribeLoadSymbol(e, disprarDataProviderEvent));
        MAE.MaePriceChangeService.getAndSubscribePriceChange(SymbolKeyUtils.getTickKeysFromSymbolKeys(e), onPriceChangeUpdate);
    }
    function unsubscribeLoadSymbol(e) {//$
        e.length > 0 && (o.unsubscribeLoadSymbol(e, disprarDataProviderEvent));
        MAE.MaePriceChangeService.unsubscribePriceChange(SymbolKeyUtils.getTickKeysFromSymbolKeys(e), onPriceChangeUpdate);
    }

    function _suscribeChangeCategory(e) {
        signalDataProviderEvent.add(e);
    }
    function _unsuscribeChangeCategory(e) {
        signalDataProviderEvent.remove(e);
    }
    function _subcribePriceChangeUpdate(e) {
        signalPriceChangeUpdate.add(e);
    }

    function _unsubcribePriceChangeUpdate(e) {
        signalPriceChangeUpdate.remove(e);
    }

    function _subcribeQuotesLoaded(e) {
        signalQuotesLightLoaded.add(e);
    }
    function _unsubcribeQuotesLoaded(e) {
        signalQuotesLightLoaded.remove(e);
    }


    function _getTrackProductByKey(key)
    {
        return _trackPrecios[key];
    }

    var _categoria = null, _categoria_formada = null/*de */, _productoByName = {}/*ge*/, _productoByCategoria = {}/*me*/
    var signalDataProviderEvent = new signals.Signal,//fe
        signalPriceChangeUpdate = new signals.Signal,//Se
        signalQuotesLightLoaded = new signals.Signal//Te


    _init();


    var _marketWatchDepthService = {

        getSelectedCategoryName: _getSelectedCategoryName,//p---------------------
        changeCategory: _changeCategory, //m----------------------
        suscribeChangeCategory: _suscribeChangeCategory, //Y----------------------------
        unsuscribeChangeCategory: _unsuscribeChangeCategory,//z-------------------
        clearData: _clearData, //P----------------------
        subscribeGroup: _subscribeGroup,//U---------------
        unsubscribeGroup: _unsubscribeGroup,//V-----------------
        subcribePriceChangeUpdate: _subcribePriceChangeUpdate,//X --------------
        unsubcribePriceChangeUpdate: _unsubcribePriceChangeUpdate,//q------------
        itemDragAndDrop: _itemDragAndDrop,//S---------------
        subcribeQuotesLoaded: _subcribeQuotesLoaded,//J-----------
        unsubcribeQuotesLoaded: _unsubcribeQuotesLoaded,//ee---------------
        initData: _initData,//b,
        getTrackProductByKey : _getTrackProductByKey

    };


    jq.extend(true, window, {
        MAE: {
            MarketWatchDepthService: _marketWatchDepthService
        }
    });

})(jQuery);