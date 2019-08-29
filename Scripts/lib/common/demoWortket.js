var myWorket = (function () {
    var productosGlobal;
    var productos;
    var open_traders = [];
    var pendingOrders = [];
    var rejectedOrders = [];
    var historyOrders = [];
    var demo = false;
    var CANTPUNTAS = 5;
    var MILISEGUNDOSTITILANDO = 3000;


    /*worket activo*/
    var travel = {
        type: 10
    };

    self.postMessage(travel);


    function runAllDemo() {
        runDemoOpenTrade();
        runDemoPendingTrade();
        runDemoHistory();
        runDemoRejectd();
        //simula las open trade 
        setInterval(function () {
            runDemoOpenTrade();
        }, 500);

        // setInterval(() => {
        //     runDemoHistory();
        // }, 500);

        setInterval(function () {
            runDemoOpenTradeMatching();
        }, 20000);


        setInterval(function () {
            runDemoPendingTrade();
        }, 500);

        setInterval(function () {
            runDemoRejectd();
        }, 500);
    }

    function updatePending(orden) {
        var pendingOrder = pendingOrders.find(function (el) { return el.id === orden.id; });
        pendingOrder.$updating = true;
        pendingOrder.volume = orden.volume;
        pendingOrder.price = orden.price;
        pendingOrder.total = pendingOrder.price * pendingOrder.volume * pendingOrder.contrato;
        var travel = {
            payload: [pendingOrder],
            type: 3,
            subtype: 1
        };
        self.postMessage(travel);
        setTimeout(function () {
            temp_item = pendingOrders.find(function (el) { return el.id === orden.id; });
            if (temp_item) {
                temp_item.$updating = false;
                travel = {

                    payload: [temp_item],
                    type: 3,
                    subtype: 1
                };
                self.postMessage(travel);
            }
        }, MILISEGUNDOSTITILANDO);
    }

    function deletePending(order) {
        var objIndex = pendingOrders.findIndex(function (obj) { return obj.id === order.id; });
        pendingOrders[objIndex].$deleting = true;
        var travel = {
            payload: [pendingOrders[objIndex]],
            type: 3,
            //A pesar del delete sigue siendo 1 y no 2 para que no la saque de pending, porque eso lo hace desde OrdenRechazoMercado
            subtype: 1
        };
        self.postMessage(travel);
        setTimeout(function () {
            temp_item = pendingOrders.find(function (el) { return el.id === order.id; });
            if (temp_item) {
                temp_item.$updating = false;
                travel = {

                    payload: [temp_item],
                    type: 3,
                    subtype: 1
                };
                self.postMessage(travel);
            }
        }, MILISEGUNDOSTITILANDO);
    }

    function OrdenActivaMercado(order) {
        var pendingOrder = order;
        var regPending;
        pendingOrder.positionId = order.symbol;
        var travel;
        if (order.CommandName === "Trade") {
            if (pendingOrder.pareja) {
                var tmel = open_traders.find(function (el) { return el.id === pendingOrder.pareja; });
                if (tmel) {
                    tmel.pareja = pendingOrder.id;
                    setTimeout(function () {
                        tmel.delete = true;
                        pendingOrder.$deleting = true;

                        travel = {

                            payload: [tmel, pendingOrder],
                            type: 2,
                            subtype: 2
                        };
                        self.postMessage(travel);

                        open_traders.splice(open_traders.indexOf(pendingOrder), 1);
                        open_traders.splice(open_traders.indexOf(tmel), 1);

                        historyOrders.push(pendingOrder);
                        historyOrders.push(tmel);

                        travel = {

                            payload: [order, tmel],
                            type: 6, //history
                            subtype: 0
                        };

                        self.postMessage(travel);

                    }, 2000);
                }
            }
            var regOpenTraders = open_traders.find(function (x) { return x.id === pendingOrder.id; });
            if (!regOpenTraders) {
                var profit = pendingOrder.marketPrice * pendingOrder.executedVolume * pendingOrder.contrato;
                pendingOrder.total = pendingOrder.price * pendingOrder.executedVolume * pendingOrder.contrato;
                var diff = profit - pendingOrder.total;
                var diff_porcentage = diff * 100 / pendingOrder.total;
                pendingOrder.profit = profit;
                pendingOrder.netProfitPercent = diff_porcentage;
                pendingOrder.totalProfit = diff;
                pendingOrder.volume = pendingOrder.executedVolume;
                travel = {
                    payload: [pendingOrder],
                    type: 2,//opentrade
                    subtype: 0//new
                };
                open_traders.push(pendingOrder);
                self.postMessage(travel);
            }

            regPending = pendingOrders.find(function (x) { return x.id === pendingOrder.id; });
            if (regPending) {
                if (pendingOrder.remainingVolume === 0) {
                    pendingOrders.splice(pendingOrders.indexOf(regPending, 1));
                    travel = {
                        payload: [regPending],
                        type: 3,//pending
                        subtype: 2//delete
                    };
                } else {
                    regPending.volume = pendingOrder.remainingVolume;
                    travel = {
                        payload: [regPending],
                        type: 3,//pending
                        subtype: 1//update
                    };
                }
                self.postMessage(travel);
            }
            for (var i = 0; i < open_traders.length; i++) {
                if (pendingOrder.idProducto === open_traders[i].idProducto) {
                    multiplicador = open_traders[i].side === 1 ? -1 : 1;
                    open_traders[i].marketPrice = pendingOrder.marketPrice;
                    var profit = open_traders[i].marketPrice * open_traders[i].volume * open_traders[i].contrato;
                    var diff = multiplicador * (profit - open_traders[i].total);
                    var diff_porcentage = diff * 100 / open_traders[i].total;
                    open_traders[i].profit = profit;
                    open_traders[i].netProfitPercent = diff_porcentage;
                    open_traders[i].totalProfit = diff;
                }
            }
            travel = {
                payload: open_traders,
                type: 2,
                subtype: 1
            };

            self.postMessage(travel);

            for (var i = 0; i < pendingOrders.length; i++) {
                if (pendingOrder.idProducto === pendingOrders[i].idProducto) {
                    pendingOrders[i].marketPrice = pendingOrder.marketPrice;
                }
            }
            travel = {
                payload: pendingOrders,
                type: 3,
                subtype: 6
            };
        } else {
            var temp_item = productosGlobal ? productosGlobal.find(function (x) { return x.key === order.key }) : pendingOrders.find(function (x) { return (x.key === order.key && x.id === pendingOrder.id) });
            if (temp_item) {
                pendingOrder.marketPrice = temp_item.marketPrice;
            }
            pendingOrder.total = pendingOrder.price * pendingOrder.volume * pendingOrder.contrato;
            regPending = pendingOrders.find(function (x) { return x.id === pendingOrder.id; });
            if (regPending) {
                regPending.$updating = false;
                regPending.orderId2 = pendingOrder.orderId2;
                regPending.marketPrice = pendingOrder.marketPrice;
                regPending.Timestamp = pendingOrder.Timestamp;
                travel = {
                    payload: [regPending],
                    type: 3,//pending
                    subtype: 1//update
                };
            } else {
                pendingOrders.push(pendingOrder);
                travel = {
                    payload: [pendingOrder],
                    type: 3,
                    subtype: 0
                };
            }
        }
        self.postMessage(travel);
    }

    function OrdenRechazoMercado(orden) {
        var temp_item = pendingOrders.find(function (obj) { return obj.id === orden.id; });
        if (!temp_item) {
            temp_item = orden;
        }
        if (orden.Estado !== 1 &&
            orden.Estado !== 4 &&
            orden.Estado !== 8) {
            temp_item.delete = true;
            temp_item.orderId2 = orden.orderId2;
            temp_item.comment = orden.comment;
            rejectedOrders.push(temp_item);
            var travel = {
                payload: [temp_item],
                type: 4,
                subtype: 0
            };

            self.postMessage(travel);
            travel = {

                payload: [temp_item],
                type: 3,
                subtype: 2
            };
            if (pendingOrders.indexOf(temp_item) > -1) {
                pendingOrders.splice(pendingOrders.indexOf(temp_item), 1);
            }
            self.postMessage(travel);
        } else {
            travel = {

                payload: [orden.comment],
                type: 11
            };
            temp_item.$updating = false;
            temp_item.$deleting = false;
            self.postMessage(travel);
            travel = {
                payload: [temp_item],
                type: 3,
                subtype: 1
            };
            self.postMessage(travel);
        }
    }

    function OrdenReemplazarMercado(orden) {
        var objIndex = pendingOrders.findIndex(function (obj) { return obj.id === orden.id; });
        pendingOrders[objIndex].$updating = false;
        pendingOrders[objIndex].orderId2 = orden.orderId2;
        pendingOrders[objIndex].volume = orden.volume;
        pendingOrders[objIndex].price = orden.price;
        pendingOrders[objIndex].total = pendingOrders[objIndex].price * pendingOrders[objIndex].volume;
        var travel;

        travel = {
            payload: [pendingOrders[objIndex]],
            type: 3,
            subtype: 1
        };
        self.postMessage(travel);
    }

    function CreateOrder(order) {
        var temp_pareja = pendingOrders.find(function (el) { return el.pareja === order.pareja; });
        if (!temp_pareja || !order.pareja) {
            var temp_item = productosGlobal.find(function (x) { return x.key === order.key; });
            if (temp_item) {
                order.marketPrice = temp_item.marketPrice;
                order.precision = 3;
            }

            pendingOrders.push(order);
            var travel = {

                payload: [order],
                type: 3,
                subtype: 0
            };
            self.postMessage(travel);
        }
    }

    function CancelarOrden(orden) {
        var temp_item = pendingOrders.find(function (el) { return el.id === orden.id; });

        if (temp_item) {
            temp_item.$deleting = true;

            setTimeout(function () {
                temp_item = pendingOrders.find(function (el) { return el.id === orden.id; });//para no tomar una ya tuvo matching
                if (temp_item) {
                    temp_item.delete = true;
                    temp_item.comment = orden.comment;
                    rejectedOrders.push(temp_item);
                    var travel = {

                        payload: [temp_item],
                        type: 4,
                        subtype: 0
                    };

                    self.postMessage(travel);

                    travel = {

                        payload: [temp_item],
                        type: 3,
                        subtype: 2
                    };
                    pendingOrders.splice(pendingOrders.indexOf(temp_item), 1);
                    self.postMessage(travel);
                }
            }, 3000);
        }
    }

    function _onMessage(oEvent) {
        if (oEvent.data.demo) {
            demo = !!oEvent.data.demo;
            if (demo)
                runAllDemo();
        }

        if (oEvent.data.onRejected) {
            runDemoRejectd();
        }

        if (oEvent.data.onOpenTrade) {
            runDemoOpenTrade();
        }

        if (oEvent.data.onHistory) {
            runDemoHistory();
        }

        if (oEvent.data.onPendingTrade) {
            runDemoPendingTrade();
        }

        if (oEvent.data.type === 1) {
            productosGlobal = oEvent.data.productosGlobal;
            productos = oEvent.data.productos;
            if (demo) {
                setInterval(function () {
                    runDemo();
                }, 100);
            }
            return;
        }

        if (oEvent.data.type === 5) {
            runQuote(oEvent.data);
            return;
        }

        if (oEvent.data.type === 6) {
            organizeOrders(oEvent.data);
            return;
        }

        if (oEvent.data.updatePending) {
            updatePending(oEvent.data.updatePending);
            return;
        }

        if (oEvent.data.deletePending) {
            deletePending(oEvent.data.deletePending);
            return;
        }

        if (oEvent.data.OrdenActivaMercado) {
            OrdenActivaMercado(oEvent.data.OrdenActivaMercado);
            return;
        }


        //OrdenRechazoMercado
        if (oEvent.data.OrdenRechazoMercado) {
            OrdenRechazoMercado(oEvent.data.OrdenRechazoMercado);
            return;
        }


        //OrdenReemplazarMercado
        if (oEvent.data.OrdenReemplazarMercado) {
            OrdenReemplazarMercado(oEvent.data.OrdenReemplazarMercado);
            return;
        }

        if (oEvent.data.nuevaOrden) {
            var orden = oEvent.data.nuevaOrden;
            CreateOrder(orden);
            setTimeout(function () {
                temp_item = pendingOrders.find(function (el) { return el.id === orden.id; });//para no tomar una ya tuvo matching
                if (temp_item) {
                    temp_item.$updating = false;
                    travel = {

                        payload: [temp_item],
                        type: 3,
                        subtype: 1
                    };
                    self.postMessage(travel);
                }
            }, MILISEGUNDOSTITILANDO);
            return;
        }

        if (oEvent.data.EstadoSistema) {
            travel = {
                payload: [oEvent.data.EstadoSistema.EstadoSistema],
                type: 12
            };
            self.postMessage(travel);
            if (oEvent.data.EstadoSistema.EstadoSistema === "Abierto") {
                travel = {
                    payload: open_traders,
                    type: 2,//opentrade
                    subtype: 2
                };
                self.postMessage(travel);

                travel = {
                    payload: pendingOrders,
                    type: 3,//pending
                    subtype: 2
                };
                self.postMessage(travel);

                travel = {
                    payload: rejectedOrders,
                    type: 4,//rejected
                    subtype: 2
                };
                self.postMessage(travel);

                limpiarPuntas();
            }

        }

        if (oEvent.data.cancelOrden) {
            CancelarOrden(oEvent.data.cancelOrden);
        }
    }

    var temp_item = {};
    var openTraderOrder = {};
    function organizeOrders(ordenes) {
        if (ordenes.orders && ordenes.orders[0].length > 0) {
            ordenes.orders[0].forEach(function (value) {
                temp_item = {
                    id: value.IdOrden,
                    idProducto: value.IdProducto,
                    key: value.llave,
                    positionId: value.CodigoProducto,//travel.data.name, // campo para agrupar
                    orderId2: value.NumeroOrdenMercado,
                    symbol: value.CodigoProducto,
                    symbo_name: value.CodigoProducto,//travel.data.name,
                    tradeType: 0,
                    volume: value.Ejecutada,//travel.data.displayedValue,
                    side: value.CompraVenta === 'C' ? 1 : 2,//type_Order,
                    openTime: 20,
                    openPrice: 10,
                    marketPrice: value.MarketPrice,
                    price: value.Precio,
                    precision: 3,
                    margin: 123,
                    nominalValue: 1,
                    openOrigin: "1",
                    detalle: "",
                    isNew: false, //Metadata
                    isRun: false, //Metadata
                    delete: false,
                    total: 0,
                    contrato: value.Contrato,
                    date: value.FechaConcertacion,
                    sequenceNumber: value.sequenceNumber,
                    pareja: value.Pareja,
                    comment: value.Comentario,
                    Timestamp: value.Timestamp
                };

                if (value.IdEstado === 1 ||
                    value.IdEstado === 4 ||
                    value.IdEstado === 8
                ) {
                    temp_item.volume = value.Cantidad;
                    pendingOrders.push(temp_item);
                }
                else if (value.IdEstado === 2 ||
                    value.IdEstado === 3 ||
                    value.IdEstado === 7
                ) {
                    temp_item.volume = value.Cantidad;
                    rejectedOrders.push(temp_item);
                }
                else if (value.IdEstado === 5) {
                    openTraderOrder = open_traders.find(function (x) { return x.id === value.IdOrden; });
                    if (openTraderOrder) {
                        openTraderOrder.volume += temp_item.volume;
                    } else {
                        var tp = Object.assign({}, temp_item);
                        tp.volume = value.Ejecutada;
                        open_traders.push(tp);
                    }
                } else if (value.IdEstado === 6) {
                    var pendingOrder = pendingOrders.find(function (x) { return x.id === value.IdOrden; });
                    if (pendingOrder) {
                        pendingOrder.volume -= temp_item.volume;
                    } else {
                        var tpPartialPending = Object.assign({}, temp_item);
                        tpPartialPending.volume = value.Cantidad - value.Ejecutada;
                        pendingOrders.push(tpPartialPending);
                    }
                    var openTraderPartialOrder = open_traders.find(function (x) { return x.id === value.IdOrden; });
                    if (openTraderPartialOrder) {
                        openTraderPartialOrder.volume += temp_item.volume;
                    } else {
                        var tpPartial = Object.assign({}, temp_item);
                        tpPartial.volume = value.Ejecutada;
                        open_traders.push(tpPartial);
                    }
                }
            });
            var multiplicador;
            open_traders.forEach(function (value) {
                multiplicador = value.side === 1 ? -1 : 1;
                value.total = value.volume * value.price * value.contrato;
                var profit = value.marketPrice * value.volume * value.contrato;
                var diff = multiplicador * (profit - value.total);
                var diff_porcentage = diff * 100 / value.total;
                value.profit = profit;
                value.netProfitPercent = diff_porcentage;
                value.totalProfit = diff;
            });

            var travel = {
                payload: open_traders,
                type: 2,
                subtype: 6
            };

            self.postMessage(travel);

            pendingOrders.forEach(function (value) {
                value.total = value.volume * value.price * value.contrato;
                var profit = value.marketPrice * value.volume * value.contrato;
                var diff = profit - value.total;
                var diff_porcentage = diff * 100 / temp_item.total;
                value.profit = profit;
                value.netProfitPercent = diff_porcentage;
                value.totalProfit = diff;
            });
            travel = {
                payload: pendingOrders,
                type: 3,
                subtype: 6
            };

            self.postMessage(travel);



            travel = {
                payload: rejectedOrders,
                type: 4,
                subtype: 6
            };

            self.postMessage(travel);
        }
    }


    function runDemoHistory() {

        var travel = {
            payload: historyOrders,
            type: 6,
            subtype: 6
        };

        self.postMessage(travel);
    }

    function updateOrders(producto, marketPrice) {
        var profit;
        var diff;
        var diff_porcentage;
        for (var i = 0; i < open_traders.length; i++) {
            if (producto === open_traders[i].symbo_name) {
                open_traders[i].marketPrice = marketPrice;
                profit = open_traders[i].marketPrice * open_traders[i].volume * open_traders[i].contrato;
                diff = profit - open_traders[i].total;
                diff_porcentage = diff * 100 / open_traders[i].total;
                open_traders[i].profit = profit;
                open_traders[i].netProfitPercent = diff_porcentage;
                open_traders[i].totalProfit = diff;

            }
        }
        travel = {
            payload: open_traders,
            type: 2,
            subtype: 1
        };
        self.postMessage(travel);
        for (var i = 0; i < pendingOrders.length; i++) {
            if (producto === pendingOrders[i].symbo_name) {
                pendingOrders[i].marketPrice = marketPrice;
                profit = pendingOrders[i].marketPrice * pendingOrders[i].volume * pendingOrders[i].contrato;
                diff = profit - pendingOrders[i].total;
                diff_porcentage = (diff * 100) / pendingOrders[i].total;
                pendingOrders[i].profit = profit;
                pendingOrders[i].netProfitPercent = diff_porcentage;
                pendingOrders[i].totalProfit = diff;

            }
        }
        travel = {
            payload: pendingOrders,
            type: 3,
            subtype: 1
        };
        self.postMessage(travel);
    }

    function runQuote(dataServer) {
        if (productosGlobal) {
            var quote = {
                Producto: dataServer.quote.Producto,
                Moneda: dataServer.quote.Moneda,
                Mercado: dataServer.quote.Mercado,
                marketDepthDataProvider: [],
                Trade: dataServer.quote.Trade,
                PrecioCierre: dataServer.quote.ClosePrice ? dataServer.quote.ClosePrice.Precio : 0
            };

            dataServer.quote.Ofertas.forEach(function (unaOferta) {
                var punta = quote.marketDepthDataProvider.find(function (x) { return x.Posicion === unaOferta.NumeroPosicion; });
                var existe = punta ? true : false;
                if (!existe) {
                    punta = {
                        Posicion: 0,
                        BidVolume: 0,
                        AskVolume: 0,
                        Bid: 0,
                        Ask: 0,
                        TotalOffersBid: 0,
                        SpotRateBid: 0,
                        TotalOffersAsk: 0,
                        SpotRateAsk: 0
                    };
                    punta.Posicion = unaOferta.NumeroPosicion;
                }
                switch (unaOferta.TipoOferta) {
                    case 1:
                        punta.AskVolume = unaOferta.Cantidad;
                        punta.Ask = unaOferta.Precio;
                        punta.TotalOffersAsk = unaOferta.NumeroDeOfertas;
                        punta.SpotRateAsk = unaOferta.SpotRate;
                        break;
                    case 0:
                        //Vino informacion de ofertas
                        punta.BidVolume = unaOferta.Cantidad;
                        punta.Bid = unaOferta.Precio;
                        punta.TotalOffersBid = unaOferta.NumeroDeOfertas;
                        punta.SpotRateBid = unaOferta.SpotRate;
                        break;
                    default:
                        break;
                }
                punta.TotalOffers = unaOferta.NumeroDeOfertas;
                punta.SpotRate = unaOferta.SpotRate;
                if (!existe)
                    quote.marketDepthDataProvider.push(punta);
            });


            var producto;

            for (var op = 0; op < productosGlobal.length; op++) {
                producto = productosGlobal[op];
                if (producto.name === quote.Producto) {
                    quote.IdProducto = producto.id;
                    break;
                }

            }
            if (quote.Trade) {
                quote.DailyChange = quote.PrecioCierre === 0 || isNaN(quote.Trade.Precio) ? 0 : (quote.Trade.Precio * 100 / quote.PrecioCierre) - 100;
                quote.HighPrice = dataServer.quote.Trade.InfoTrade.find(function (it) { return it.TipoOferta === 7; }).Precio;
                quote.LowPrice = dataServer.quote.Trade.InfoTrade.find(function (it) { return it.TipoOferta === 8; }).Precio;
                quote.marketPrice = quote.Trade.Precio;
                updateOrders(producto.name, quote.Trade.Precio);
            } else {
                quote.DailyChange = producto.dailyChange;
                quote.LowPrice = producto.lowPriceParts[0];
                quote.HighPrice = producto.highPriceParts[0];
            }
            if (quote.marketDepthDataProvider.length > 0) {
                quote.AskVWAP = quote.marketDepthDataProvider[0].Ask;
                quote.BidVWAP = quote.marketDepthDataProvider[0].Bid;
            } else {
                quote.AskVWAP = null;
                quote.BidVWAP = null;
            }
            producto.bidVWAP = quote.BidVWAP;
            producto.askVWAP = quote.AskVWAP;
            producto.dailyChange = quote.DailyChange;
            producto.tick.priceChangeDirection = producto.dailyChange === 0 ? "equals": producto.dailyChange > 0 ? "up" : "down";
            producto.id = quote.IdProducto;
            producto.precision = 3;
            producto.dailyChangeDirection = producto.dailyChange === 0 ? "equals" : producto.dailyChange > 0 ? "up" : "down";

            if (quote.marketDepthDataProvider.length > 0) {
                producto.lowPriceParts[1] = quote.marketDepthDataProvider[0].Bid;
                producto.highPriceParts[1] = quote.marketDepthDataProvider[0].Ask;
            }

            producto.lowPriceParts[0] = quote.LowPrice;

            producto.highPriceParts[0] = quote.HighPrice;
            producto.quote.spreadTableVWAP = quote.AskVWAP - quote.BidVWAP;
            for (var i = 0; i < 5; i++) {
                if (i < quote.marketDepthDataProvider.length) {
                    var quoteData = quote.marketDepthDataProvider[i];
                    var askAnterior = 0;
                    var puntaAskAnterior = producto.marketDepthDataProvider.find(function (x) { return x.data.ask === quoteData.Ask; });
                    if (puntaAskAnterior && !isNaN(quoteData.Ask))
                        askAnterior = puntaAskAnterior.data.askVolume;
                    var bidAnterior = 0;
                    var puntaBidAnterior = producto.marketDepthDataProvider.find(function (x) { return x.data.bid === quoteData.Bid; });
                    if (puntaBidAnterior && !isNaN(quoteData.Bid))
                        bidAnterior = puntaBidAnterior.data.bidVolume;
                    var askVolumeChangeDirection = "up";
                    var bidVolumeChangeDirection = "up";
                    if (askAnterior)
                        askVolumeChangeDirection = askAnterior === quoteData.AskVolume ? producto.marketDepthDataProvider[i].data.askVolumeChangeDirection : (askAnterior < quoteData.AskVolume ? "up" : "down");
                    if (bidAnterior)
                        bidVolumeChangeDirection = bidAnterior === quoteData.BidVolume ? producto.marketDepthDataProvider[i].data.bidVolumeChangeDirection : (bidAnterior < quoteData.BidVolume ? "up" : "down");

                    producto.marketDepthDataProvider[i] = {
                        data: {
                            bidVolume: isNaN(quoteData.BidVolume) || quoteData.BidVolume === 0 ? "-" : quoteData.BidVolume,
                            askVolume: isNaN(quoteData.AskVolume) || quoteData.AskVolume === 0 ? "-" : quoteData.AskVolume,
                            bid: isNaN(quoteData.Bid) || quoteData.Bid === 0 ? "-" : quoteData.Bid,
                            ask: isNaN(quoteData.Ask) || quoteData.Ask === 0 ? "-" : quoteData.Ask,
                            askVolumeChangeDirection: askVolumeChangeDirection,
                            bidVolumeChangeDirection: bidVolumeChangeDirection,
                            TotalOffersBid: isNaN(quoteData.TotalOffersBid) || quoteData.TotalOffersBid === 0 ? "-" : quoteData.TotalOffersBid,
                            SpotRateBid: (!quoteData.SpotRateBid) || isNaN(quoteData.SpotRateBid) || quoteData.SpotRateBid === 0 ? "-" : quoteData.SpotRateBid,
                            TotalOffersAsk: isNaN(quoteData.TotalOffersAsk) || quoteData.TotalOffersAsk === 0 ? "-" : quoteData.TotalOffersAsk,
                            SpotRateAsk: (!quoteData.SpotRateAsk) || isNaN(quoteData.SpotRateAsk) || quoteData.SpotRateAsk === 0 ? "-" : quoteData.SpotRateAsk
                        }
                    };
                }
                else {
                    producto.marketDepthDataProvider[i] = {
                        data: {
                            bidVolume: "-",
                            askVolume: "-",
                            bid: "-",
                            ask: "-",
                            TotalOffersBid: "-",
                            SpotRateBid: "-",
                            TotalOffersAsk: "-",
                            SpotRateAsk: "-"
                        }
                    };
                }
            }
            var travel = {
                payload: producto,
                type: 1

            };
            self.postMessage(travel);
        }
    }


    function runDemoOpenTrade() {
        var ite_temp;
        if (demo) {
            for (var i = 0; i < open_traders.length; i++) {
                open_traders[i].openPrice += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                open_traders[i].marketPrice = (Math.random() * 1.0007).toFixed(3);//Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.3);
                if (open_traders[i].marketPrice < 0)
                    open_traders[i].marketPrice = 0.00001;

                ite_temp = open_traders[i];
                var profit = (ite_temp.marketPrice * ite_temp.volume);
                var diff = profit - ite_temp.total;
                var diff_porcentage = (diff * 100) / ite_temp.total;

                ite_temp.netProfitPercent = diff_porcentage;
                ite_temp.totalProfit = diff;
                ite_temp.profit = profit;

                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                // open_traders[i].profit = (open_traders[i].marketPrice * open_traders[i].volume);
                // open_traders[i].totalProfit = (open_traders[i].marketPrice * open_traders[i].volume) - open_traders[i].total;

                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                open_traders[i].isNew = false;
            }
        }

        var travel = {
            payload: open_traders,
            type: 2,
            subtype: 6
        };

        self.postMessage(travel);
    }


    function runDemoPendingTrade() {
        var ite_temp;
        if (demo) {
            for (var i = 0; i < pendingOrders.length; i++) {
                pendingOrders[i].openPrice += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                pendingOrders[i].marketPrice = (Math.random() * 1.007).toFixed(3);//Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.3);

                if (pendingOrders[i].marketPrice < 0)
                    pendingOrders[i].marketPrice = 0.00001;


                ite_temp = pendingOrders[i];
                var profit = (ite_temp.marketPrice * ite_temp.volume);
                var diff = profit - ite_temp.total;
                var diff_porcentage = (diff * 100) / ite_temp.total;
                ite_temp.netProfitPercent = diff_porcentage;
                ite_temp.totalProfit = diff;
                ite_temp.profit = profit;

                pendingOrders[i].nominalValue += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                pendingOrders[i].isNew = false;
            }
        }

        var travel = {
            payload: pendingOrders,
            type: 3,
            subtype: 6
        };

        self.postMessage(travel);
    }

    function runDemoRejectd() {
        if (demo) {
            for (var i = 0; i < rejectedOrders.length; i++) {
                rejectedOrders[i].openPrice += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                rejectedOrders[i].marketPrice = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.3);
                if (rejectedOrders[i].marketPrice < 0)
                    rejectedOrders[i].marketPrice = 0.01;



                rejectedOrders[i].nominalValue += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                // open_traders[i].netProfitPercent += Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
                rejectedOrders[i].isNew = false;
            }
        }

        var travel = {
            payload: rejectedOrders,
            type: 4,
            subtype: 6
        };

        self.postMessage(travel);

    }

    function limpiarPuntas() {

        var producto;// = productosGlobal[parseInt(Math.random() * productosGlobal.length)];
        for (var op = 0; op < productosGlobal.length; op++) {
            producto = productosGlobal[op];
            //var bidVWAP = 0;//Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
            //var askVWAP = 0;//Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);

            producto.bidVWAP = "-";// += parseFloat(bidVWAP);
            producto.askVWAP = "-";//+= parseFloat(askVWAP);

            producto.dailyChange = 0;// Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 1.07);
            producto.tick.priceChangeDirection = "equals";//(producto.dailyChange > 0) ? "up" : "down";

            producto.dailyChangeDirection = "equals";// (producto.dailyChange > 0) ? "up" : "down";

            producto.quote.tick.priceChangeDirection = producto.dailyChangeDirection;

            producto.lowPriceParts[0] =0;// (Math.random() * 1.07).toFixed(3);
            producto.lowPriceParts[1] =0;// (Math.random() * 1.07).toFixed(3);
            producto.lowPriceParts[2] = 0;// (Math.random() * 1.07).toFixed(3);

            producto.highPriceParts[0] =0;// (Math.random() * 1.07).toFixed(3);
            producto.highPriceParts[1] =0;// (Math.random() * 1.07).toFixed(3);
            producto.highPriceParts[2] = 0;// (Math.random() * 1.07).toFixed(3);



            //  producto.lowPriceParts[1] = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
            //  producto.lowPriceParts[2] = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
            producto.quote.spreadTableVWAP = 0;// (Math.random() * 1.07).toFixed(3);

            for (var i = 0; i < producto.marketDepthDataProvider.length; i++) {
                var data = producto.marketDepthDataProvider[i].data;
                data.bidVolume = "-";//(Math.random() * 100.07).toFixed(3) + 1;
                data.askVolume = "-";//(Math.random() * 108.07).toFixed(3) + 1;
                data.bid = "-";//(Math.random() * 108.07).toFixed(3) + 1;
                data.ask = "-";//(Math.random() * 104.07).toFixed(3) + 1;
                TotalOffersBid = "-";//: isNaN(quoteData.TotalOffersBid) || quoteData.TotalOffersBid === 0 ? "-" : quoteData.TotalOffersBid,
                SpotRateBid = "-";//: (!quoteData.SpotRateBid) || isNaN(quoteData.SpotRateBid) || quoteData.SpotRateBid === 0 ? "-" : quoteData.SpotRateBid,
                TotalOffersAsk = "-";//: isNaN(quoteData.TotalOffersAsk) || quoteData.TotalOffersAsk === 0 ? "-" : quoteData.TotalOffersAsk,
                SpotRateAsk = "-";//: (!quoteData.SpotRateAsk) || isNaN(quoteData.SpotRateAsk) || quoteData.SpotRateAsk === 0 ? "-" : quoteData.SpotRateAsk

                // data.bidVolume = data.ask.toFixed(2);
                // data.askVolume = data.askVolume.toFixed(2);
                // data.ask = data.ask.toFixed(2);
                // data.bid = data.bid.toFixed(2);

                data.askVolumeChangeDirection = "equals";// (producto.dailyChange > 0) ? "up" : "down";
                data.oEventbidVolumeChangeDirection = "equals";//(producto.dailyChange < 0) ? "up" : "down";

            }

            // console.log(JSON.stringify(producto));
            var travel = {
                payload: producto,
                type: 1

            };
            self.postMessage(travel);
        }

    }


    function runDemo() {

        var proId = productos[(parseInt(Math.random() * productos.length))];
        var producto = productosGlobal[parseInt(Math.random() * productosGlobal.length)];
        // for (var op = 0; op < productosGlobal.length; op++) {
        //     producto = productosGlobal[op];
        //     if (producto.key === proId) {
        //         break;
        //     }

        // }


        // var producto;
        // producto = productosGlobal[(parseInt(Math.random() * productosGlobal.length))];
        // // console.log("producto " + JSON.stringify(producto));
        //  // data.tiket.bid = producto.bidVWAP + Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 3);
        //  // data.tiket.ask = producto.askVWAP;
        //  // data.tiket.dailyChange = producto.bidVWAP - producto.askVWAP;
        //  // data.tiket.priceChangeDirection =  ((producto.bidVWAP - producto.askVWAP) > 0) ? "up" : "down";
        var bidVWAP = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
        var askVWAP = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);

        producto.bidVWAP += parseFloat(bidVWAP);
        producto.askVWAP += parseFloat(askVWAP);

        producto.bidVWAP = parseFloat(producto.bidVWAP.toFixed(3));
        producto.askVWAP = parseFloat(producto.askVWAP.toFixed(3));

        producto.dailyChange = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 1.07);
        producto.tick.priceChangeDirection = (producto.dailyChange > 0) ? "up" : "down";

        producto.dailyChangeDirection = (producto.dailyChange > 0) ? "up" : "down";

        producto.quote.tick.priceChangeDirection = producto.dailyChangeDirection;

        producto.lowPriceParts[0] = (Math.random() * 1.07).toFixed(3);
        producto.lowPriceParts[1] = (Math.random() * 1.07).toFixed(3);
        producto.lowPriceParts[2] = (Math.random() * 1.07).toFixed(3);

        producto.highPriceParts[0] = (Math.random() * 1.07).toFixed(3);
        producto.highPriceParts[1] = (Math.random() * 1.07).toFixed(3);
        producto.highPriceParts[2] = (Math.random() * 1.07).toFixed(3);



        //  producto.lowPriceParts[1] = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
        //  producto.lowPriceParts[2] = Math.pow(-1, parseInt(Math.random() * 2) + 1) * (Math.random() * 0.003);
        producto.quote.spreadTableVWAP = (Math.random() * 1.07).toFixed(3);

        for (var i = 0; i < producto.marketDepthDataProvider.length; i++) {
            var data = producto.marketDepthDataProvider[i].data;
            data.bidVolume = (Math.random() * 100.07).toFixed(3) + 1;
            data.askVolume = (Math.random() * 108.07).toFixed(3) + 1;
            data.bid = (Math.random() * 108.07).toFixed(3) + 1;
            data.ask = (Math.random() * 104.07).toFixed(3) + 1;

            // data.bidVolume = data.ask.toFixed(2);
            // data.askVolume = data.askVolume.toFixed(2);
            // data.ask = data.ask.toFixed(2);
            // data.bid = data.bid.toFixed(2);

            data.askVolumeChangeDirection = (producto.dailyChange > 0) ? "up" : "down";
            data.oEventbidVolumeChangeDirection = (producto.dailyChange < 0) ? "up" : "down";

        }

        // console.log(JSON.stringify(producto));
        var travel = {
            payload: producto,
            type: 1

        };
        self.postMessage(travel);

    }


    function runDemoOpenTradeMatching() {
        var length = pendingOrders.length;
        var item;
        var index;
        if (length > 0) {
            index = parseInt(Math.random() * length);
            item = pendingOrders[index];

            travel = {

                payload: [item],
                type: 3,//pendingOrder
                subtype: 2
            };

            pendingOrders.splice(pendingOrders.indexOf(item), 1);

            self.postMessage(travel);
            if (item.volume > 1e6) {
                item.comment = "No dispone de garantias suficientes";
                rejectedOrders.push(item);
                var travel = {

                    payload: [item],
                    type: 4,
                    subtype: 0
                };

                self.postMessage(travel);
            }
            else
                nuevaOrdenMatching(item);

        }

    }

    function nuevaOrdenMatching(item) {

        //         id: i + "",
        //         positionId: "PRODUCT" + i, // campo para agrupar
        //         orderId2: i,
        //         symbol: "PRODCUT" + i,
        //         tradeType: 0,
        //         volume: 1,
        //         side : 1,
        //         openTime: 1,
        //         openPrice: 1,
        //         marketPrice: 1,
        //         margin: 1,
        //         nominalValue: 1,
        //         comment: '',
        //         openOrigin: "1"
        //     });

        var travel;
        var profit = (item.marketPrice * item.volume);
        var diff = profit - item.total;
        var diff_porcentage = (diff * 100) / item.total;


        var order = {
            id: (Math.random() * 1000000),
            symbolKey: item.symbol,
            positionId: item.symbo_name,
            orderId2: (Math.random() * 10000),
            symbol: item.symbol,
            side: item.side,
            tradeType: 0,
            volume: item.volume,
            openTime: item.openTime,
            openPrice: item.openPrice,
            sl: 1,
            tp: 1,
            expiryDate: 1,
            marketPrice: item.marketPrice === 0 ? "-" : item.marketPrice,
            margin: 1,
            nominalValue: item.nominalValue,
            marketValue: 1,
            netProfitPercent: 1,
            commission: 1,
            closeCommission: 1,
            storage: 1,
            totalProfit: diff,
            profit: profit,
            comment: 1,
            openOrigin: "1",
            price: item.price,
            //pareja: 0,
            total: item.total,
            date: item.date,
            sequenceNumber: (Math.random() * 1000000)
        };

        if (item.pareja) {
            order.pareja = item.id;
            var tmel = open_traders.find(function (el) { return el.id === item.pareja; });
            if (tmel) {
                tmel.pareja = order.id;
                setTimeout(function () {
                    tmel.delete = true;
                    order.delete = true;

                    travel = {

                        payload: [tmel, order],
                        type: 2,
                        subtype: 2
                    };
                    self.postMessage(travel);

                    open_traders.splice(open_traders.indexOf(order), 1);
                    open_traders.splice(open_traders.indexOf(tmel), 1);

                    // historyOrders.push(order);
                    // historyOrders.push(tmel);

                    // travel = {

                    //     payload: [order, tmel],
                    //     type: 6, //history
                    //     subtype: 0
                    // };

                    // self.postMessage(travel);

                }, 2000);
            }
        }


        open_traders.push(order);
        travel = {

            payload: [order],
            type: 2, //openTrade
            subtype: 0
        };

        self.postMessage(travel);

    }



    var _obj = {

        onmessage: _onMessage,
        postMessage: null
    };

    return _obj;
})();



self.onmessage = myWorket.onmessage;
// myWorket.postMessage = self.postMessage;