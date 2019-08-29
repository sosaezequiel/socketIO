(function (jq) {

    var _receivedSignal = new signals.Signal;
    var _receivedOpentradeSignal = new signals.Signal;
    var _receivedPendingtradeSignal = new signals.Signal;
    var _receivedHistorySignal = new signals.Signal;
    var _receivedRejectdSignal = new signals.Signal;
    var _receivedBitacoraSignal = new signals.Signal;
    var _receivedDetalleSignal = new signals.Signal;
    var _receivedGarantySignal = new signals.Signal;
    var _onPreceChange;
    var _onOpenTrade;
    var _onPendingTrade;
    var _onRejected;
    var _onHistory;
    var _onNotify;
    var _onBitacora;
    var _onDetalle;
    var _onGaranty;

    function _subscribeLoadSymbol(e, func) {
        _receivedSignal.add(func);

    };

    MAE.SocketService.subscribeOnMessage(function (oEvent) {
        if (oEvent.type === 1) {
            producto = oEvent.payload;
            if (_onPriceChange)
                _onPriceChange({}, producto);
        }

        if (oEvent.type === 2) {
            if (_onOpenTrade)
                _onOpenTrade(oEvent);
        }

        if (oEvent.type === 3) {
            if (_onPendingTrade)
                _onPendingTrade(oEvent);
        }


        if (oEvent.type === 4) {
            if (_onRejected)
                _onRejected(oEvent);
        }

        if (oEvent.type === 6) {
            if (_onHistory)
                _onHistory(oEvent);
        }

        if (oEvent.type === 11) {//notify
            if (_onNotify)
                _onNotify(oEvent);
        }

        if (oEvent.type === 12) {//notify
            if (_estadoMercado)
                _estadoMercado();
        }
        if (oEvent.type === 13) {//bitacora
            if (_onBitacora)
                _onBitacora();
        }

        if (oEvent.type === 14) {//bitacora
            if (_onDetalle)
                _onDetalle();
        }

    });



    var timer;
    var _priceChangeTrack = {};

    function _subscribePriceChange(productos, onSuccess, onFail) {
        // var i = {
        //     MAEClientApi: {
        //         endpoint: "mae",
        //         getUserData: {
        //             timestamp: t
        //         }
        //     }
        // };
        myWorker.postMessage({
            productosGlobal: productosGlobal,
            productos: productos,
            type: WorkerMessageType.PRODUCTS

        });

        if (!_onPreceChange)
            _onPriceChange = onSuccess;
        //producto = new ForexQuote(producto.key, producto.symbolGroup, producto.symbol, producto.tick);
        //onSuccess({}, producto);

        // myWorker.postMessage({
        //     productosGlobal: productosGlobal,
        //     productos: productos

        // });

        // myWorker.onmessage = function (oEvent) {

        //     producto = oEvent.data;

        //     //producto = new ForexQuote(producto.key, producto.symbolGroup, producto.symbol, producto.tick);
        //     onSuccess({}, producto);
        // };

        //MAE.ApiService.sendSessionCommand("PriceChange", i, onSuccess, onFail)
    };


    function _onNotify(oEvent) {
        notifyError(oEvent.payload[0]);
    };

    function _unsubscribeLoadSymbol(e, func) {
        _receivedSignal.remove(func);

    };

    function _receiveData(data, type) {



        _receivedSignal.dispatch(data, DataEvent.UPDATED);
    };

    function _receiveDataOpenTrade(data, type) {

        switch (type) {
            case MaeMessageType.OPEN_TRADE_LIST:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW
                            MAE.LayoutService.activateModule(ModulesType.OPEN_TRADES, undefined, undefined, undefined, true);
                            _receivedOpentradeSignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedOpentradeSignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedOpentradeSignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedOpentradeSignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedOpentradeSignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;

        }
    };


    function _subscribeOpenTrade(func) {

        if (!_onOpenTrade) {

            _onOpenTrade = function (data) {
                _receiveDataOpenTrade(data, MaeMessageType.OPEN_TRADE_LIST);
            }
        }


        _receivedOpentradeSignal.add(func);
    };


    MAE.MainService.subscribeInit(function (data) {
        var module = data.Module;
        switch (module) {
            case ModulesType.PENDING_TRADES:
                myWorker.postMessage({
                    onPendingTrade: true
                });
                break;

            case ModulesType.OPEN_TRADES:
                myWorker.postMessage({
                    onOpenTrade: true
                });
                break;

            case ModulesType.HISTORY:
                myWorker.postMessage({
                    onHistory: true
                });
                break;
            case ModulesType.REJECTED:
                myWorker.postMessage({
                    onRejected: true
                });
                break;

            case ModulesType.GARANTY:
                MAE.MaeApiService.searchGaranty({});
                break;

        }


    });


    function _subscribeHistory(func) {
        if (!_onHistory) {


            _onHistory = function (data) {

                _receiveDataHistory(data, MaeMessageType.HISTORY_LIST);
            }
        }


        _receivedHistorySignal.add(func);

    }

    function _subscribeBitacora(func) {
        if (!_onBitacora) {


            _onBitacora = function (data) {

                _receiveDataBitacora(data, MaeMessageType.BITACORA);
            }
        }


        _receivedBitacoraSignal.add(func);

    }

    function _subscribeDetalle(func) {
        if (!_onDetalle) {


            _onDetalle = function (data) {

                _receiveDataDetalle(data, MaeMessageType.DETALLE);
            }
        }


        _receivedDetalleSignal.add(func);

    }

    function _subscribePendingTrade(func) {

        if (!_onPendingTrade) {


            _onPendingTrade = function (data) {


                _receiveDataPendingTrade(data, MaeMessageType.PENDING_TRADE_LIST);
            }
        }


        _receivedPendingtradeSignal.add(func);
    };

    function _subscribeGaranty(func) {

        if (!_onGaranty) {



            _onGaranty = function (data) {

                _receiveDataGaranty(data, MaeMessageType.GARANTY_LIST);
            }
        }


        _receivedGarantySignal.add(func);
    }

    function _subscribeRejectd(func) {
        if (!_onRejected) {



            _onRejected = function (data) {

                _receiveDataRejectd(data, MaeMessageType.REJECTED_LIST);
            }
        }


        _receivedRejectdSignal.add(func);
    };


    function _receiveDataBitacora(data, type) {

        switch (type) {
            case MaeMessageType.BITACORA:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW

                            _receivedBitacoraSignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedBitacoraSignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedBitacoraSignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedBitacoraSignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedBitacoraSignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;
        }
    };

    function _receiveDataDetalle(data, type) {

        switch (type) {
            case MaeMessageType.DETALLE:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW
                            _receivedDetalleSignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedDetalleSignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedDetalleSignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedDetalleSignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedDetalleSignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;
        }
    };

    function _receiveDataGaranty(data, type) {

        switch (type) {
            case MaeMessageType.GARANTY_LIST:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW
                            //MAE.LayoutService.activateModule(ModulesType.GARANTY);
                            _receivedGarantySignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedGarantySignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedGarantySignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedGarantySignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedGarantySignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;
        }
    };

    function _receiveDataRejectd(data, type) {

        switch (type) {
            case MaeMessageType.REJECTED_LIST:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW
                            MAE.LayoutService.activateModule(ModulesType.REJECTED, undefined, undefined, undefined, true);
                            _receivedRejectdSignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedRejectdSignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedRejectdSignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedRejectdSignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedRejectdSignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;
        }
    };
    /**
     * 
     *  NEW: 0,
        UPDATED: 1,
        REMOVED: 2,
        EXIST: 3,
        NO_DATA: 4,
        ERROR: 5,
        ITEM_LIST: 6
    */
    function _receiveDataPendingTrade(data, type) {

        switch (type) {
            case MaeMessageType.PENDING_TRADE_LIST:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW
                            MAE.LayoutService.activateModule(ModulesType.PENDING_TRADES, undefined, undefined, undefined, true);
                            _receivedPendingtradeSignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedPendingtradeSignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedPendingtradeSignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedPendingtradeSignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedPendingtradeSignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;

        }
    };

    function _receiveDataHistory(data, type) {

        switch (type) {
            case MaeMessageType.HISTORY_LIST:
                if (data.payload.length > 0) {
                    switch (data.subtype) {
                        case 0: //NEW
                            //MAE.LayoutService.activateModule(ModulesType.PENDING_TRADES);
                            _receivedHistorySignal.dispatch(DataEvent.NEW, data.payload);
                            break;
                        case 1://UPDATED
                            _receivedHistorySignal.dispatch(DataEvent.UPDATED, data.payload);
                            break;
                        case 2://REMOVED
                            _receivedHistorySignal.dispatch(DataEvent.REMOVED, data.payload);
                            break;
                        case 6:// ITEM_LIST
                            _receivedHistorySignal.dispatch(DataEvent.ITEM_LIST, data.payload);
                            break;
                    }
                }
                else
                    _receivedHistorySignal.dispatch(DataEvent.NO_DATA, data.payload);
                break;

        }
    };

    function _unsubscribeGaranty(func) {
        _onGaranty = null;
        _receivedGarantySignal.remove(func);
    }

    function _unsubscribeRejectd(func) {
        _onRejectd = null;
        _receivedRejectdSignal.remove(func);

    }

    function _unsubscribeOpenTrade(func) {
        _onOpenTrade = null;
        _receivedOpentradeSignal.remove(func);

    }

    function _unsubscribePendingTrade(func) {
        _onPendingTradeTrade = null;
        _receivedPendingtradeSignal.remove(func);
    };

    function _unsubscribeHistory(func) {
        _onHistory = null;
        _receivedHistorySignal.remove(func);
    }

    function _unsubscribeBitacora(func) {
        _onBitacora = null;
        _receivedBitacoraSignal.remove(func);
    }

    function _unsubscribeDetalle(func) {
        _onDetalle = null;
        _receivedDetalleSignal.remove(func);
    }

    function notify(item) {
        MAE.NotifyService.notify(item);
    }

    function notifyError(item, titulo) {
        MAE.NotifyService.notifyError(item, titulo);
    }


    var promise;

    function _loadOrders() {
        if (!DEMO) {
            promise = new Promise(function (resolve, reject) {
                var ordenes = AppContext.getPosicionAgenteLogueado();
                resolve(ordenes);
            });

            promise.then(function (data) {
                myWorker.postMessage({
                    orders: data,
                    type: WorkerMessageType.ORDERS
                });
            }).catch(
                function (reason) {
                    notifyError("qwerty");
                });
        }
    }

    function _createOrder(travel) {
       
        var price;
        if (travel.type === OrderType.ASK) {
            if (travel.data.highPriceParts.length > 1)
                price = travel.data.highPriceParts[travel.data.highPriceParts.length - 2]; //
            else
                price = travel.data.highPriceParts[0];
        }

        if (travel.type === OrderType.BID) {
            if (travel.data.lowPriceParts.length > 1)
                price = travel.data.lowPriceParts[travel.data.lowPriceParts.length - 2]; //
            else
                price = travel.data.lowPriceParts[0];
        }
        //obtengo el separador de decimales dependiendo el lenguage del usuario
        var separator = (1.1).toLocaleString(AppContext.LanguageTag).substring(1, 2);
        if (isNaN(price))
            price = +price.replace(separator, ".");
        var temp_item = {
            key: travel.data.key,
            positionId: travel.data.name, // campo para agrupar
            symbol: travel.data.key,
            symbo_name: travel.data.name,
            tradeType: 0,
            volume: travel.data.displayedValue,
            side: travel.type,
            openTime: 20,
            openPrice: 10,
            marketPrice: "-",
            price: price,
            margin: 123,
            nominalValue: 1,
            comment: '',
            openOrigin: "1",
            detalle: "",
            isNew: true, //Metadata
            isRun: false, //Metadata
            delete: false,
            total: price * travel.data.displayedValue,
            date: new Date()
        };

        if (!DEMO) {
            promise = new Promise(function (resolve, reject) {
                var dto = {
                    CompraOVenta: travel.type === OrderType.BID ? 'C' : 'V',
                    IdMercado: 1,
                    IdProducto: travel.data.id,
                    IdTipoVigencia: 1,
                    Cantidad: travel.data.displayedValue,
                    PrecioLimite: price,
                    CodigoPlazoType: PlazoType.CI,
                    OrderType: TiposOrden.Day,
                    Source: 5,
                    TipoAplicacion: 5
                };

                var options = { requireIdentityFilter: true };
                if (AppContext.JavascriptAllowedCommands.AltaOrdenCommand)
                    Command.execUI(WebURL + 'Services/DMACommandService.svc/Rest/c', AppContext.JavascriptAllowedCommands.AltaOrdenCommand, dto, options, function (data) {
                        if (data.Detalle) {
                            var travel = JSON.parse(data.Detalle);
                            resolve(travel);
                        } else {
                            reject(data);
                        }
                    },
                        function (data) {
                            if (!isNaN(data[2])) {
                                travel = {
                                    IdOrden: data[2],
                                    FechaConcertacion: Date.now()
                                };
                                resolve(travel);
                            } else {
                                reject(data);
                            }

                        }
                    );
                else
                    reject(["", "No tiene permisos"]);
            });

            promise.then(function (data) {
                temp_item.id = data.IdOrden;
                temp_item.$updating = true;
                temp_item.date = data.FechaConcertacion;
                myWorker.postMessage({
                    nuevaOrden: temp_item
                });
                notify(temp_item);
            }).catch(
                function (reason) {
                    notifyError(reason[1]);
                });
        } else {
            temp_item.id = Math.random() * 10000;
            temp_item.date = new Date();
            temp_item.$updating = true;
            myWorker.postMessage({
                nuevaOrden: temp_item
            });
            notify(temp_item);
        }
    }

    function _estadoMercado() {

        if (rootScope.sessionType === SymbolSessionType.CLOSED) {
            rootScope.sessionType = SymbolSessionType.OPEN;
        } else if (rootScope.sessionType === SymbolSessionType.OPEN) {
            rootScope.sessionType = SymbolSessionType.CLOSED;
        }
    }

    function _createOrderEspejo(travel) {
        
        var type = (travel.data.side === OrderType.ASK) ? OrderType.BID : OrderType.ASK;

        //if (travel.data.side === OrderType.ASK) {
        //    type = OrderType.BID;
        //    item.lowPriceParts = [];
        //    item.lowPriceParts.push(item.marketPrice);
        //}
        //else {
        //    type = OrderType.ASK;
        //    travel.data.highPriceParts = [];
        //    travel.data.highPriceParts.push(item.marketPrice);

        //}
        //item.displayedValue = item.volume;
        //item.askVWAP = item.marketPrice;
        //item.bidVWAP = item.marketPrice;
        //item.name = item.positionId;
        //item.positionId = item.positionId;


        var temp_item = {
            key: travel.data.key,
            symbol: travel.data.symbol,
            symbo_name: travel.data.symbo_name,
            tradeType: 0,
            volume: travel.data.volume,
            side: type,
            price: travel.data.marketPrice,
            margin: 123,
            nominalValue: 1,
            comment: '',
            openOrigin: "1",
            detalle: "",
            isNew: true, //Metadata
            isRun: false, //Metadata
            delete: false,
            pareja: travel.data.id,
            total: travel.data.price * travel.data.volume,
            date: new Date(),
            displayedValue: travel.data.volume,
            askVWAP: travel.data.marketPrice,
            bidVWAP: travel.data.marketPrice,
            name: travel.data.positionId,
            positionId: travel.data.positionId
        };


        if (!DEMO) {
            promise = new Promise(function (resolve, reject) {
                var dto = {
                    IdOrden: travel.data.id,
                    NuevoPrecioLimite: travel.data.price,
                    Source: 5,
                    TipoAplicacion: 5
                };

                var options = { requireIdentityFilter: true, "TipoPermiso": 1 };
                if (AppContext.JavascriptAllowedCommands.CloPosOrdDMACom)
                    Command.execUI(WebURL + 'Services/DMACommandService.svc/Rest/c', AppContext.JavascriptAllowedCommands.CloPosOrdDMACom, dto, options, function (data) {
                        if (data.Detalle) {
                            var travel = JSON.parse(data.Detalle);
                            resolve(travel);
                        } else {
                            reject(data);
                        }
                    });
                else
                    reject(["", "No tiene permisos"]);
            });

            promise.then(function (data) {
                temp_item.id = data.IdOrden;
                temp_item.date = data.FechaConcertacion;
                myWorker.postMessage({
                    nuevaOrden: temp_item
                });
                notify(temp_item);
            }).catch(
                function (reason) {
                    notifyError(reason[1]);
                });
        } else {
            temp_item.id = (Math.random() * 10000);
            temp_item.date = new Date();
            myWorker.postMessage({
                nuevaOrden: temp_item
            });
            notify(temp_item);
        }

        // if (_onPendingTrade)
        //     _onPendingTrade(travel);
    }


    function _updateOrder(travel) {
        promise = new Promise(function (resolve, reject) {
            var dto = {
                r_id: travel.data.id,
                PrecioLimite: travel.data.price,
                Cantidad: travel.data.volume,
                Source: 5,
                TipoAplicacion: 5
            };
            //var options = { requireIdentityFilter: true, "TipoPermiso": 1 };
            if (AppContext.JavascriptAllowedCommands.ActualizaOrdenCommand)

                Command.execUI(WebURL + 'Services/DMACommandService.svc/Rest/c', AppContext.JavascriptAllowedCommands.ActualizaOrdenCommand, dto, {}, function (data) {
                    if (data.Detalle) {
                        var travel = data.Detalle[0];
                        resolve(travel);
                    } else {
                        reject(data);
                    }
                });
            else
                reject(["", "No tiene permisos"]);


        });
        promise.then(function (data) {
            myWorker.postMessage({
                updatePending: travel.data
            });

        }).catch(
            function (reason) {
                notifyError(reason[1]);
            });
    }

    function _cancelPending(item) {
        if (!DEMO) {
            promise = new Promise(function (resolve, reject) {
                var dto = {
                    Ordenes: [{ "IdOrden": item.id, "Observaciones": "", "Timestamp": item.Timestamp }],
                    IdMotivo: 10,
                    Source: 5,
                    TipoAplicacion: 5
                };
                if (AppContext.JavascriptAllowedCommands.CancOrdCom) {
                    Command.execUI(WebURL + 'Services/DMACommandService.svc/Rest/c', AppContext.JavascriptAllowedCommands.CancOrdCom, dto, {}, function (data) {
                        if (data.MensajeError && data.MensajeError.length > 0) {
                            reject(data.MensajeError[0]);
                        } else if (data.Detalle) {
                            resolve(item);
                        } else {
                            reject(data[1]);
                        }
                    });
                }
                else { reject(["", "No tiene permisos"]); }

            });
            promise.then(function (data) {
                myWorker.postMessage({
                    deletePending: item
                });
            }).catch(
                function (reason) {
                    notifyError(reason);
                });
        } else {
            myWorker.postMessage({
                cancelOrden: item
            });

        }
    }

    function _searchHistory(data) {

        if (!DEMO) {

            //promise = new Promise(function (resolve, reject) {
            var dto = {
                fromDate: data.fromDate,
                toDate: data.toDate,
                chosenRange: data.chosenRange,
                PageNumber: data.pageInfo.pageNum + 1,
                PageSize: data.pageInfo.pageSize
            };
            Query.execGridUI(AppContext.QueryServices, 'QRY_SCRN_SEARCHHISTORY_GRID_MAIN_ALL', dto, { returnColumnNames: true }, function (str, jqXHR) {
                result = jQuery.parseJSON(JSON.parse(jqXHR.responseText));//JSON.parseWithDate(jqXHR.responseText);

                data.payload = toData(result);
                var i_op = 2;
                _.forEach(data.payload, function (ite_for) {
                    ite_for.id = ite_for.IdOrden;
                    //ite_for.IsDetalle = (i_op % 2) ? 1 : 0;
                });

                var travel = {
                    type: 6,
                    subtype: 6,
                    payload: data.payload
                }

                var tep_arr = (data.payload.length == 0) ? 0 : data.payload[0].pageSize;
                var totalRow = (data.payload.length == 0) ? 0 : data.payload[0].TotalRows;
                var pageNum = (data.payload.length == 0) ? 0 : data.payload[0].pageNum - 1;

                travel.payload.pageSize = data.pageInfo.pageSize || tep_arr;
                travel.payload.pageNum = data.pageInfo.pageNum || pageNum;

                travel.payload.totalRows = totalRow;
                var temp = travel.payload.totalRows / travel.payload.pageSize;
                travel.payload.totalPages = parseInt(temp) + ((travel.payload.totalRows % travel.payload.pageSize) ? 1 : 0);


                _onHistory(travel);
            });
            //});
            //promise.then(function (data) {
            //data.payload = toData(data).Data;

            //_.forEach(data.payload, function (ite_for) {
            //    ite_for.id = ite_for.IdOrden;
            //});

            //var travel = {
            //    type: 6,
            //    subtype: 6,
            //    payload: data.payload
            //}

            //travel.payload = travel.payload.filter(el => new Date(el.FechaConcertacion) >= data.fromDate && new Date(el.FechaConcertacion) <= data.toDate);

            //_onHistory(travel);
            //}).catch(
            //    (reason) => {
            //        notifyError(reason[1]);
            //    });
        } else {
            var str = '{\"draw\":20,\"recordsTotal\":5,\"recordsFiltered\":5,\"Data\":[[5,531,\"V\",531,\"1905171238454\",\"2019-05-17T12:21:12.227\",2000.0000,5.3800000000,\"Pesos\",\"MAE S.A.\",\"OCTGA31MAY19 - \",0.0000,8,0,2000.0000,10760.0000000000000,\"OCTGA31MAY19\",\"$\",\"MAE\",\"DEMO\","",\"En Mercado\",1,\"CI\",\"\",1,2,\"00-00-00-00-00-02-F8-EE\",5],[5,530,\"V\",530,\"1905171238452\",\"2019-05-21T12:16:40.79\",1000.0000,5.3800000000,\"Pesos\",\"MAE S.A.\",\"OCTGA31MAY19 - \",1000.0000,5,1,0.0000,5380.0000000000000,\"OCTGA31MAY19\",\"$\",\"MAE\",\"DEMO\",null,\"Aplicada\",1,\"CI\",null,1,2,\"00-00-00-00-00-02-F8-F8\",5],[5,529,\"C\",529,\"1905171138445\",\"2019-05-21T11:58:47.283\",1000.0000,20.0000000000,\"Pesos\",\"MAE S.A.\",\"OCTGA28JUN19 - \",0.0000,8,0,1000.0000,20000.0000000000000,\"OCTGA28JUN19\",\"$\",\"MAE\",\"DEMO\",null,\"En Mercado\",1,\"CI\",null,1,2,\"00-00-00-00-00-02-F8-D5\",5],[5,528,\"V\",528,\"1905171138442\",\"2019-05-22T11:53:33.137\",300.0000,20.0000000000,\"Pesos\",\"MAE S.A.\",\"OCTGA28JUN19 - \",300.0000,5,1,0.0000,6000.0000000000000,\"OCTGA28JUN19\",\"$\",\"MAE\",\"DEMO\",null,\"Aplicada\",1,\"CI\",null,1,2,\"00-00-00-00-00-02-F8-D1\",5],[5,527,\"V\",527,\"\",\"2019-05-17T11:46:58.763\",200.0000,53.0000000000,\"Pesos\",\"MAE S.A.\",\"OCTGA28JUN19 - \",0.0000,7,0,200.0000,10600.0000000000000,\"OCTGA28JUN19\",\"$\",\"MAE\",\"DEMO\",\"\",\"Rechazo Envio Mercado\",1,\"CI\",null,1,2,\"00-00-00-00-00-02-F8-C6\",5]],\"ColumnNames\":[\"TotalRows\",\"IdOrden\",\"CompraVenta\",\"NumeroOrdenInterno\",\"NumeroOrdenMercado\",\"FechaConcertacion\",\"Cantidad\",\"Precio\",\"MonedaDescripcion\",\"PersonaDescripcion\",\"ProductoDescripcion\",\"Ejecutada\",\"IdEstado\",\"IsDetalle\",\"Remanente\",\"Monto\",\"CodigoProducto\",\"CodigoMoneda\",\"CodigoMercado\",\"NombreParticipante\",\"MotivoBaja\",\"EstadoDescripcion\",\"TipoPlazo\",\"PlazoDescripcion\",\"FechaVencimiento\",\"TipoVigencia\",\"StopType\",\"Timestamp\",\"TotalRows\"],\"MetaData\":null,\"Status\":\"EX0000\",\"RequestId\":\"b2e5e336-be1e-480a-99da-5917aa62b085\"}';

            data.payload = toData2(str).Data;
            var travel = {
                type: 6,
                subtype: 6,
                payload: data.payload
            };
            var i_op = 2;
            var temp_detalle = [];
            _.forEach(data.payload, function (ite_for) {
                ite_for.id = ite_for.IdOrden;
                ite_for.IsDetalle = (++i_op % 2) ? 1 : 0;

                if (ite_for.IsDetalle) {
                    temp_detalle.push(Object.assign({}, ite_for));
                }

            });

            data.payload = data.payload.concat(temp_detalle);

            travel.payload = travel.payload.filter(function (el) { return new Date(el.FechaConcertacion) >= data.fromDate && new Date(el.FechaConcertacion) <= data.toDate });

            travel.payload.pageSize = data.pageInfo.pageSize ? data.pageInfo.pageSize : 5;
            travel.payload.pageNum = data.pageInfo.pageNum || 0;

            travel.payload.totalRows = travel.payload.length;
            var temp = travel.payload.totalRows / travel.payload.pageSize;
            travel.payload.totalPages = parseInt(temp) + ((travel.payload.totalRows % travel.payload.pageSize) ? 1 : 0);

            _onHistory(travel);
            /*
            myWorker.postMessage({
                cancelOrden: item
            });
            */

        }
    }

    function _searchBitacora(data) {
        if (!DEMO) {
            var dto = {
                IdOrden: data.IdOrden
            };
            Query.execGridUI(AppContext.QueryServices, 'QRY_SCRN_DMA_SEARCHBITACORAORDEN_GRID_MAIN_ALL', dto, { returnColumnNames: true }, function (str, jqXHR) {
                result = jQuery.parseJSON(JSON.parse(jqXHR.responseText));

                data.payload = toData(result);

                var id = 1;
                _.forEach(data.payload, function (ite_for) {
                    ite_for.id = ++id;
                });
                var travel = {
                    type: 13,
                    subtype: 6,
                    payload: data.payload
                }

                _onBitacora(travel);
            });
        } else {
            var str = '{\"draw\":0,\"recordsTotal\":0,\"recordsFiltered\":0,\"Data\":[{\"Fecha\":\"2019-05-21T17:38:05.693\",\"EstadoDescripcion\":\"Ingresada\",\"IdEstado\":1,\"UsuarioDescripcion\":\"Administrador\",\"IdUsuario\":2,\"PersonaDescripcion\":\"MAE S.A.\",\"Observaciones\":\"Creación de la orden Nro:661\",\"MotivoRechazo\":null,\"AccionDescripcion\":\"Crear Orden\",\"MotivoCancelacionDescripcion\":null,\"Source\":\"Web\"},{\"Fecha\":\"2019-05-21T17:38:08.363\",\"EstadoDescripcion\":\"En Mercado\",\"IdEstado\":8,\"UsuarioDescripcion\":\"Usuario Proceso\",\"IdUsuario\":1,\"PersonaDescripcion\":\"MAE S.A.\",\"Observaciones\":\"Se ingreso la orden Nro: 661 en el  mercado: MAE\",\"MotivoRechazo\":null,\"AccionDescripcion\":\"Recibir Respuesta del Mercado\",\"MotivoCancelacionDescripcion\":null,\"Source\":null}],\"ColumnNames\":null,\"MetaData\":null,\"Status\":\"EX0000\",\"RequestId\":\"42cc2182-9b55-4e93-8494-72053135fe63\"}';
            data.payload = toData2(str).Data;
            var id = 1;
            _.forEach(data.payload, function (ite_for) {
                ite_for.id = ++id;
                ite_for.Observaciones += "Lorem Ipsum is simply dummy text of the printing and typesetting  Lorem Ipsum is simply dummy text of the printing and typesetting  Lorem Ipsum is simply dummy text of the printing and typesetting  Lorem Ipsum is simply dummy text of the printing and typesetting  Lorem Ipsum is simply dummy text of the printing and typesetting  Lorem Ipsum is simply dummy text of the printing and typesetting ";
            });

            var travel = {
                type: 13,
                subtype: 6,
                payload: data.payload
            }

            //travel.payload = travel.payload.filter(el => el.IdOrden = data.IdOrden);

            _onBitacora(travel);
        }

    }

    function _searchGaranty(data) {
        if (!DEMO) {
            var options = { returnColumnNames: true, requireIdentityFilter: true };

            Query.execGridUI(AppContext.QueryServices, 'DMA_GETGARANTIASAGENTELOGUEADO', null, options, function (str, jqXHR) {
                result = jQuery.parseJSON(JSON.parse(jqXHR.responseText));

                data.payload = toData(result);

                var id = 1;
                _.forEach(data.payload, function (ite_for) {
                    ite_for.id = ++id;
                });
                var travel = {
                    type: 15,
                    subtype: 6,
                    payload: data.payload
                }

                _onGaranty(travel);
            });
        } else {

            data.payload = [];

            data.payload.push({
                id: 2,
                receptor: '1037',
                dador: '1037',
                moneda: 'Pesos',
                montoAsignado: 100000,
                montoConsumido: 90000,
                fichas: "10",
                disponible: 1460000,
                clearingHouse: "1D00"

            });



            //data.payload = data.payload.filter(el => el.IdOrden == data.IdOrden);

            var travel = {
                type: 15,
                subtype: 6,
                payload: data.payload
            }

            //travel.payload = travel.payload.filter(el => el.IdOrden = data.IdOrden);

            _onGaranty(travel);
        }
    }

    function _searchDetalle(data) {
        if (!DEMO) {
            var dto = {
                IdOrden: data.IdOrden
            };
            Query.execGridUI(AppContext.QueryServices, 'QRY_SCRN_DMA_ORDEN_DETALLE', dto, { returnColumnNames: true }, function (str, jqXHR) {
                result = jQuery.parseJSON(JSON.parse(jqXHR.responseText));

                data.payload = toData(result);

                var id = 1;
                _.forEach(data.payload, function (ite_for) {
                    ite_for.id = ++id;
                });
                var travel = {
                    type: 13,
                    subtype: 6,
                    payload: data.payload
                }

                _onDetalle(travel);
            });
        } else {

            data.payload = [];

            data.payload.push({
                id: 2,
                IdOrden: 531,
                NroOperacionMercado: '123456730',
                Precio: "1.23",
                Cantidad: "100030",
                Monto: "200030",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });

            data.payload.push({
                id: 17,
                IdOrden: 531,
                NroOperacionMercado: '123456730',
                Precio: "1.231",
                Cantidad: "100030",
                Monto: "200030",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });

            data.payload.push({
                id: 18,
                IdOrden: 531,
                NroOperacionMercado: '123456730',
                Precio: "1.232",
                Cantidad: "100030",
                Monto: "200030",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });

            data.payload.push({
                id: 19,
                IdOrden: 531,
                NroOperacionMercado: '123456730',
                Precio: "1.233",
                Cantidad: "100030",
                Monto: "200030",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });
            data.payload.push({
                id: 20,
                IdOrden: 531,
                NroOperacionMercado: '123456730',
                Precio: "1.234",
                Cantidad: "100030",
                Monto: "200030",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });

            data.payload.push({
                id: 3,
                IdOrden: 529,
                NroOperacionMercado: '123456729',
                Precio: "1.23",
                Cantidad: "100029",
                Monto: "200029",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });
            data.payload.push({
                id: 4,
                IdOrden: 528,
                NroOperacionMercado: '123456728',
                Precio: "1.23",
                Cantidad: "100028",
                Monto: "200028",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });
            data.payload.push({
                id: 5,
                IdOrden: 527,
                NroOperacionMercado: '123456728',
                Precio: "1.23",
                Cantidad: "100028",
                Monto: "200028",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });
            data.payload.push({
                id: 6,
                IdOrden: 527,
                NroOperacionMercado: '123456728A',
                Precio: "1.24",
                Cantidad: "1000284",
                Monto: "2000284",
                Tasa: "1.23",
                Fecha: new Date().toString()

            });

            data.payload = data.payload.filter(function (el) { return el.IdOrden == data.IdOrden });

            var travel = {
                type: 14,
                subtype: 6,
                payload: data.payload
            }

            //travel.payload = travel.payload.filter(el => el.IdOrden = data.IdOrden);

            _onDetalle(travel);
        }

    }


    jq.extend(true, window, {
        MAE: {
            MaeApiService:
            {
                subscribeLoadSymbol: _subscribeLoadSymbol,
                unsubscribeLoadSymbol: _unsubscribeLoadSymbol,
                receiveData: _receiveData,
                subscribePriceChange: _subscribePriceChange,
                subscribeOpenTrade: _subscribeOpenTrade,
                unsubscribeOpenTrade: _unsubscribeOpenTrade,
                receiveDataOpenTrade: _receiveDataOpenTrade,
                subscribePendingTrade: _subscribePendingTrade,
                createOrder: _createOrder,
                subscribeRejectd: _subscribeRejectd,
                unsubscribeRejectd: _unsubscribeRejectd,
                CancelPending: _cancelPending,
                subscribeHistory: _subscribeHistory,
                unsubscribeHistory: _unsubscribeHistory,
                updateOrder: _updateOrder,
                createOrderEspejo: _createOrderEspejo,
                notiError: notifyError,
                notify: notify,
                loadOrders: _loadOrders,
                estadoMercado: _estadoMercado,
                searchHistory: _searchHistory,
                searchBitacora: _searchBitacora,
                subscribeBitacora: _subscribeBitacora,
                unsubscribeBitacora: _unsubscribeBitacora,
                subscribeDetalle: _subscribeDetalle,
                unsubscribeDetalle: _unsubscribeDetalle,
                searchDetalle: _searchDetalle,
                subscribeGaranty: _subscribeGaranty,
                unsubscribeGaranty: _unsubscribeGaranty,
                searchGaranty: _searchGaranty,

            }
        }
    });

})(jQuery);