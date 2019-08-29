var AppContext = (function () {
    var promise;
    var CANTPOSICIONES = 10;
    return {
        ClientSecret: null,
        ServerPublic: null,
        Nonce: null,
        MAE_APP_NAME: null,
        WEB_URL_NAME: null,
        SECURITY_TOKEN_ID: null,
        CURRENT_USER_NAME: null,
        CURRENT_SYS_DATE: null,
        CURRENT_SYS_DATE_FORMAT: null,
        CURRENT_SYS_DATE_FORMAT_MOMENT: null,
        CURRENT_SYS_DATETIME_FORMAT: null,
        QueryServices: null,
        CommandServices: null,
        Combos: null,
        Columnas: null,
        Permisos: null,
        ClickedButton: null,
        ABM: null,
        UsarCombosCaheados: true,
        IdCustodio: null,
        IdUsuario: null,
        Global: null,
        CodigoPortfolio: null,
        CantidadMaxima: null,
        JavascriptAllowedCommands: [],
        LanguageTag: null,
        initialize: function (sessionId, global) {

            var me = this;
            WebURL = window.URL_BASE;

            var dto = {};
            dto.IdSession = sessionId;
            dto.TipoAplicacion = 5;
            me.Global = global;

            promise = new Promise(function (resolve, reject) {
                Command.execUI(WebURL + 'Services/DMACommandService.svc/Rest/c', 'AppContextCommand', dto, { "TipoPermiso": 1 }, function (data) {
                    data = jQuery.parseJSON(data);
                    me.DEMO = true;
                    me.PublicKey = data.PublicKey;
                    me.Internal = "encryptionIntVec";
                    me.MAE_APP_NAME = data.MaeAppName;
                    me.WEB_URL_NAME = data.WebUrlName;
                    me.H = window.URL_BASE + "Pantalla/H";
                    me.SECURITY_TOKEN_ID = data.SecurityTokenId;
                    me.CURRENT_USER_NAME = data.UserName;
                    me.CURRENT_SYS_DATE = moment(data.FechaDelSistema)._d;
                    me.CURRENT_SYS_DATE_FORMAT = data.FormatoFechaCorta;
                    me.CURRENT_SYS_DATE_FORMAT_MOMENT = data.FormatoFechaCortaMoment;
                    me.CURRENT_SYS_DATETIME_FORMAT = data.FormatoFechaHora;
                    me.ClientSecret = data.ClientSecret;
                    me.ServerPublic = data.ServerPublic;
                    me.Nonce = data.Nonce;
                    me.EstadoSistema = data.EstadoSistema;
                    if (me.EstadoSistema.FechaApertura !== null)
                        me.EstadoSistema.FechaApertura = moment(me.EstadoSistema.FechaApertura)._d;
                    if (me.EstadoSistema.FechaCierre !== null)
                        me.EstadoSistema.FechaCierre = moment(me.EstadoSistema.FechaCierre)._d;
                    if (me.EstadoSistema.FechaSistema !== null)
                        me.EstadoSistema.FechaSistema = moment(me.EstadoSistema.FechaSistema)._d;
                    me.QueryServices = window.URL_BASE + "Services/OrdenesDMAQueryService.svc/Rest/e";
                    me.CommandServices = window.URL_BASE + "Services/DMACommandService.svc/Rest/c";
                    me.GraphURL = window.URL_BASE;
                    me.JavascriptAllowedCommands = data.JavascriptAllowedCommands;
                    me.Permisos = data.Permisos;
                    me.IdCustodio = data.IdCustodio;
                    me.IdUsuario = data.IdUsuario;
                    me.CodigoPortfolio = data.CodigoPortfolio;
                    me.CantidadMaxima = 100;
                    me.LanguageTag = data.LanguageTag;
                    resolve();
                });

            });


            return promise;

        },

        getProductosIniciales: function () {
            var me = this;
            var promise = new Promise(function (resolve, reject) {
                var options = { requireIdentityFilter: true };
                Query.execCombosUI(me.QueryServices, 'DMA_GETPUNTASBYPORTFOLIOYUSUARIO', options, {}, function (data) {
                    var unique = [];
                    var map = new Map();
                    for (var item of data[0]) {
                        if (!map.has(item.IdProducto)) {
                            map.set(item.IdProducto, true);
                            unique.push({
                                PrId: item.IdProducto,
                                ContractValue: item.ContractValue,
                                Codigo: item.Codigo,
                                PrecioCierre: item.ClosingPrice,
                                Precio: item.PrecioOperacion,
                                llave: item.llave,
                                PorDefecto: item.PorDefecto
                            });
                        }
                    }
                    unique.forEach(function (value) {
                        var newArr = data[0].filter(function (item) {
                            return item.Codigo === value.Codigo;
                        });
                        var puntas = new Array();

                        for (var i = 0; i <= CANTPOSICIONES; i++) {
                            if (i < newArr.length) {

                                var punta = puntas.find(function (x) {
                                    return x.data.NumeroPosicion === newArr[i].NumeroPosicion;
                                });

                                var Compra = newArr[i].CompraVenta === 'C';
                                me.CantidadMaxima = newArr[i].Cantidad > me.CantidadMaxima ? newArr[i].Cantidad : me.CantidadMaxima;
                                if (punta) {
                                    punta.data.bidVolume = Compra ? (newArr[i].Cantidad === 0 ? "-" : newArr[i].Cantidad) : punta.data.bidVolume;
                                    punta.data.askVolume = !Compra ? (newArr[i].Cantidad === 0 ? "-" : newArr[i].Cantidad) : punta.data.askVolume;
                                    punta.data.bid = Compra ? (newArr[i].Precio === 0 ? "-" : newArr[i].Precio) : punta.data.bid;
                                    punta.data.ask = !Compra ? (newArr[i].Precio === 0 ? "-" : newArr[i].Precio) : punta.data.ask;
                                    punta.data.TotalOffersBid = Compra ? (newArr[i].NumeroDeOfertas === 0 ? "-" : newArr[i].NumeroDeOfertas) : punta.data.TotalOffersBid;
                                    punta.data.TotalOffersAsk = !Compra ? (newArr[i].NumeroDeOfertas === 0 ? "-" : newArr[i].NumeroDeOfertas) : punta.data.TotalOffersAsk;
                                    punta.data.SpotRateBid = Compra ? (newArr[i].EquivalentRate === 0 ? "-" : newArr[i].EquivalentRate) : punta.data.SpotRateBid;
                                    punta.data.SpotRateAsk = !Compra ? (newArr[i].EquivalentRate === 0 ? "-" : newArr[i].EquivalentRate) : punta.data.SpotRateAsk;
                                } else {
                                    puntas.push(
                                        {
                                            data: {
                                                bidVolume: (newArr[i].Cantidad && Compra) ? (newArr[i].Cantidad === 0 ? "-" : newArr[i].Cantidad): "-",
                                                askVolume: (!Compra && newArr[i].Cantidad)? (newArr[i].Cantidad === 0 ? "-" : newArr[i].Cantidad) : "-",
                                                bid: (newArr[i].Cantidad && Compra) ? (newArr[i].Precio === 0 ? "-" : newArr[i].Precio) : "-",
                                                ask: (!Compra && newArr[i].Cantidad) ? (newArr[i].Precio === 0 ? "-" : newArr[i].Precio) : "-",
                                                askVolumeChangeDirection: "up",
                                                bidVolumeChangeDirection: "up",
                                                portfolio: newArr[i].CodigoPortfolio,
                                                NumeroPosicion: newArr[i].NumeroPosicion,
                                                TotalOffersBid: (newArr[i].NumeroDeOfertas && Compra) ? (newArr[i].NumeroDeOfertas === 0 ? "-" : newArr[i].NumeroDeOfertas) : "-",
                                                TotalOffersAsk: (!Compra && newArr[i].Cantidad) ? (newArr[i].NumeroDeOfertas === 0 ? "-" : newArr[i].NumeroDeOfertas) : "-",
                                                SpotRateBid: (newArr[i].EquivalentRate && Compra) ? (newArr[i].EquivalentRate === 0 ? "-" : newArr[i].EquivalentRate) : "-",
                                                SpotRateAsk: (!Compra && newArr[i].Cantidad) ? (newArr[i].EquivalentRate === 0 ? "-" : newArr[i].EquivalentRate) : "-"
                                            }
                                        }
                                    );
                                }
                            } else {
                                puntas.push({
                                    data: {
                                        bidVolume: "-",
                                        askVolume: "-",
                                        bid: "-",
                                        ask: "-",
                                        TotalOffersBid: "-",
                                        TotalOffersAsk: "-",
                                        SpotRateBid: "-",
                                        SpotRateAsk: "-"
                                    }
                                });
                                i++;
                            }
                        }
                        if (!value.Precio)
                            value.Precio = 0;
                        if (!value.PrecioCierre)
                            value.PrecioCierre = 0;
                        var dailyChange = value.PrecioCierre === 0 ? 0 : (value.Precio * 100 / value.PrecioCierre) - 100;

                        productosGlobal.push(
                            {
                                id: value.PrId,
                                contractValue: value.ContractValue,
                                key: value.llave,
                                changePeriodLabel: "changePeriodLabel ",
                                dailyChangeSign: "%",
                                dailyChangeDirection: dailyChange > 0 ? "up" : "down",
                                enableVolumeStepper: true,
                                displayedValue: 0,// i % 2 ? 0.5 : 1.0,
                                marketDepthDataProvider: puntas,
                                marketPrice: value.Precio,
                                symbol: {
                                    key: value.Codigo,
                                    isCloseOnly: false,
                                    name: value.Codigo,
                                    fullDescription: value.Codigo + " des",
                                    precision: 3,
                                    description: value.Codigo + " *-"

                                },
                                sessionType: 1,//SymbolSessionType.OPEN,
                                tick: {
                                    priceChangeDirection: dailyChange === 0 ? "equals" : dailyChange > 0 ? "up" : "down",
                                    key: value.Codigo,
                                    bid: 0,
                                    ask: 0,
                                    dailyChange: 0
                                },
                                name: value.Codigo,
                                bidVWAP: puntas[0].data.bid,
                                askVWAP: puntas[0].data.ask,
                                dailyChange: dailyChange,
                                precision: 3,
                                porDefecto: value.PorDefecto,
                                symbolGroup: {
                                    name: puntas[0].data.portfolio,//(Math.floor(Math.random() * 3) + 1),
                                    category: puntas[0].data.portfolio//port[Math.floor(Math.random() * 3)]
                                },
                                lowPriceParts: [newArr[0].LowPrice, puntas[0].data.bid, 3],
                                highPriceParts: [newArr[0].HighPrice, puntas[0].data.ask, 3],
                                quote: {
                                    name: value.Codigo,
                                    spreadTableVWAP: puntas[0].data.ask - puntas[0].data.bid,
                                    symbol: {
                                        key: value.Codigo,
                                        isCloseOnly: false, name: value.Codigo,
                                        fullDescription: value.Codigo + " des",
                                        precision: 4,
                                        description: value.Codigo + " *-",
                                        id: value.PrId
                                    },
                                    tick: {
                                        priceChangeDirection: dailyChange === 0 ? "equals" : dailyChange > 0 ? "up" : "down",
                                        key: value.Codigo,
                                        bid: 0,
                                        ask: 0,
                                        dailyChange: 0
                                    }

                                }
                            }
                        );
                    });
                    
                    resolve(productosGlobal);
                });
            });
            return promise;
        },

        getPortfoliosMercadosProductos: function () {
            var me = this;
            var promise = new Promise(function (resolve, reject) {
                var options = { requireIdentityFilter: true };
                Query.execCombosUI(me.QueryServices, 'DMA_GETPORTFOLIOSMERCADOSPRODUCTOS', options, {}, function (data) {
                    var marketWatch = {};
                    //marketWatch.marketWatchCategory = "DEF"; 
                    var marketWatchPorfolio = [];
                    for (var i = 0; i < data[0].length; i++) {
                        marketWatch.marketWatchCategory = data[0][i].PorDefecto ? data[0][i].Codigo : marketWatch.marketWatchCategory;
                        marketWatchPorfolio.push(
                            { "value": data[0][i].Codigo, "label": data[0][i].Codigo, "transKey": data[0][i].Codigo, "Grupo": [data[0][i].Nombre] }
                        );
                    }
                    marketWatch.marketWatchPorfolio = marketWatchPorfolio;
                    resolve(marketWatch);
                });

            });
            return promise;
        },

        getPosicionAgenteLogueado: function () {
            var me = this;
            var promise = new Promise(function (resolve, reject) {
                var options = { requireIdentityFilter: true };
                var dto = {
                    PageNumber: 1,
                    PageSize: 99999,
                    IdMercado: AppContext.IdMercado
                };
                Query.execCombosUI(me.QueryServices, 'DMA_GetPosicionAgenteLogueado', options, dto, function (data) {
                    resolve(data);
                });

            });
            return promise;
        },

        getCombosDataSources: function () {
            var me = this;
            Query.execCombosUI(me.QueryServices, 'QRY_SCRN_COMBOS_FILTERS_BUNDLE', {}, null, function (dataset) {
                var keys = _.remove(dataset[0]);
                delete dataset['0'];
                var arr = _.values(dataset);
                var obj = {};
                _.zipWith(keys, arr, function (k, a) {
                    obj[k.NombreCampo] = a;
                });
                me.Combos = obj;
            });
        }
    };
}());
