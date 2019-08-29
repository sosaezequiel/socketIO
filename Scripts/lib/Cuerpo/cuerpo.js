//var myWorker = new Worker("scripts/lib/common/demoWortket.js");

var DEMO = false;

var m_g = 100;
var productosGlobal = [];
var productosGlobalDepth = [];

if (DEMO) {


    for (var d = 0; d < 1; d++)
        armarProducto(productosGlobal, "PFA", d, Math.floor(Math.random() * 20) + 1, m_g);
    for (var d = 0; d < 2; d++)
        armarProducto(productosGlobal, "PFB", d, Math.floor(Math.random() * 20) + 1, m_g + 1000);
    for (var d = 0; d < 3; d++)
        armarProducto(productosGlobal, "PFC", d, Math.floor(Math.random() * 20) + 1, m_g + 2000);


    var symbol, symbolGroup, tick;

    var dolar_simulado = ["DOLAR28Abr19", "DOLAR28May19", "DOLAR28JUN19", "DOLAR31JUL19", "DOLAR28Ago19", "DOLAR28Sep19", "DOLAR8Oct19", "DOLAR28Nov19", "DOLAR28Dic19", "DOLAR28Ene20", "DOLAR28Feb20", "DOLAR28Mar20"];

    var id =  1 ;
    for (var i = 0; i < dolar_simulado.length; i++) {
        
        productosGlobal.push(
            {   
                id : id,
                key: dolar_simulado[i],
                changePeriodLabel: "changePeriodLabel ",
                dailyChangeSign: "%",
                dailyChangeDirection: (i % 2) ? "up" : "down",
                enableVolumeStepper: true,
                displayedValue: (i % 2) ? 0.5 : 1.0,
                porDefecto : true,
                marketDepthDataProvider: [
                    {
                        data: {
                            bidVolume: 1,
                            askVolume: 1,
                            bid: 1,
                            ask: 1,
                            askVolumeChangeDirection: "down",
                            bidVolumeChangeDirection: "up",
                            TotalOffersBid: 1,
                            TotalOffersAsk: 1,
                            SpotRateBid: 1,
                            SpotRateAsk: 1
                        }
                    },
                    {
                        data: {
                            bidVolume: 1,
                            askVolume: 1,
                            bid: 1,
                            ask: 1,
                            askVolumeChangeDirection: "down",
                            bidVolumeChangeDirection: "up",
                            TotalOffersBid: 1,
                            TotalOffersAsk: 1,
                            SpotRateBid: 1,
                            SpotRateAsk: 1
                        }
                    },
                    {
                        data: {
                            bidVolume: 1,
                            askVolume: 1,
                            bid: 1,
                            ask: 1,
                            askVolumeChangeDirection: "up",
                            bidVolumeChangeDirection: "down",
                            TotalOffersBid: 1,
                            TotalOffersAsk: 1,
                            SpotRateBid: 1,
                            SpotRateAsk: 1
                        }
                    },
                    {
                        data: {
                            bidVolume: 1,
                            askVolume: 1,
                            bid: 1,
                            ask: 1,
                            askVolumeChangeDirection: "down",
                            bidVolumeChangeDirection: "up",
                            TotalOffersBid: 1,
                            TotalOffersAsk: 1,
                            SpotRateBid: 1,
                            SpotRateAsk: 1
                        }
                    },
                    {
                        data: {
                            bidVolume: 1,
                            askVolume: 1,
                            bid: 1,
                            ask: 1,
                            askVolumeChangeDirection: "up",
                            bidVolumeChangeDirection: "down",
                            TotalOffersBid: 1,
                            TotalOffersAsk: 1,
                            SpotRateBid: 1,
                            SpotRateAsk: 1
                        }
                    }
                ],
                symbol: {
                    key: dolar_simulado[i],
                    isCloseOnly: false, name: dolar_simulado[i],
                    fullDescription: dolar_simulado[i] + " des",
                    precision: 4,
                    description: dolar_simulado[i] + " *-"

                },
                sessionType: 1,//SymbolSessionType.OPEN,
                tick: {
                    priceChangeDirection: (i % 2) ? "up" : "down",
                    key: dolar_simulado[i],
                    bid: 0,
                    ask: 0,
                    dailyChange: 0
                },
                name: dolar_simulado[i],
                bidVWAP: 1.0001,
                askVWAP: 2.8631,
                dailyChange: 1.003,

                symbolGroup: {
                    name: "MAE",//(Math.floor(Math.random() * 3) + 1),
                    category: "Dolar"//port[Math.floor(Math.random() * 3)]
                },
                lowPriceParts: [1, 2, 3],
                highPriceParts: [1, 2, 3],
                quote: {
                    name: dolar_simulado[i],
                    spreadTableVWAP: 1,
                    symbol: {
                        key: dolar_simulado[i],
                        isCloseOnly: false, name: dolar_simulado[i],
                        fullDescription: dolar_simulado[i] + " des",
                        precision: 4,
                        description: dolar_simulado[i] + " *-"

                    },

                    tick: {
                        priceChangeDirection: (i % 2) ? "up" : "down",
                        key: dolar_simulado[i],
                        bid: 0,
                        ask: 0,
                        dailyChange: 0
                    }

                }
            }
             

        );
        id =  parseInt(Math.random() * 10000);
    }

    
}

    function armarProducto(t_p, porfolio, mercado, cantidad, m_g) {
        //var port= ["PFA","PFB","PFC"];

        for (var t_i = 0; t_i < cantidad; t_i++) {
            var t_m = (m_g + t_i) * (mercado + 1);

            var id =   parseInt(Math.random() * 20000) + 1;

            t_p.push(
                //new ForexQuote("producto_" + t_m, symbolGroup, symbol, tick)

                {
                    id : id,
                    key: "producto_" + t_m,
                    changePeriodLabel: "changePeriodLabel ",
                    dailyChangeSign: "%",
                    dailyChangeDirection: (t_i % 2) ? "up" : "down",
                    enableVolumeStepper: true,
                    displayedValue: (t_i % 2) ? 0.5 : 1.0,
                    porDefecto : true,
                    marketDepthDataProvider: [
                        {
                            data: {
                                bidVolume: 1,
                                askVolume: 1,
                                bid: 1,
                                ask: 1,
                                askVolumeChangeDirection: "down",
                                bidVolumeChangeDirection: "up",
                                TotalOffersBid: 1,
                                TotalOffersAsk: 1,
                                SpotRateBid: 1,
                                SpotRateAsk: 1
                            }
                        },
                        {
                            data: {
                                bidVolume: 1,
                                askVolume: 1,
                                bid: 1,
                                ask: 1,
                                askVolumeChangeDirection: "down",
                                bidVolumeChangeDirection: "up",
                                TotalOffersBid: 1,
                                TotalOffersAsk: 1,
                                SpotRateBid: 1,
                                SpotRateAsk: 1
                            }
                        },
                        {
                            data: {
                                bidVolume: 1,
                                askVolume: 1,
                                bid: 1,
                                ask: 1,
                                askVolumeChangeDirection: "up",
                                bidVolumeChangeDirection: "down",
                                TotalOffersBid: 1,
                                TotalOffersAsk: 1,
                                SpotRateBid: 1,
                                SpotRateAsk: 1
                            }
                        },
                        {
                            data: {
                                bidVolume: 1,
                                askVolume: 1,
                                bid: 1,
                                ask: 1,
                                askVolumeChangeDirection: "down",
                                bidVolumeChangeDirection: "up",
                                TotalOffersBid: 1,
                                TotalOffersAsk: 1,
                                SpotRateBid: 1,
                                SpotRateAsk: 1
                            }
                        },
                        {
                            data: {
                                bidVolume: 1,
                                askVolume: 1,
                                bid: 1,
                                ask: 1,
                                askVolumeChangeDirection: "up",
                                bidVolumeChangeDirection: "down",
                                TotalOffersBid: 1,
                                TotalOffersAsk: 1,
                                SpotRateBid: 1,
                                SpotRateAsk: 1
                            }
                        }
                    ],
                    symbol: {
                        id : id,
                        key: "producto_" + t_m,
                        isCloseOnly: false, name: "PRODUCT " + t_m,
                        fullDescription: "PRODUCT " + t_m + " des",
                        precision: 4,
                        description: "d " + t_m + " *-"

                    },
                    sessionType: 1,//SymbolSessionType.OPEN,
                    tick: {
                        priceChangeDirection: (t_i % 2) ? "up" : "down",
                        key: "producto_" + t_m,
                        bid: 0,
                        ask: 0,
                        dailyChange: 0
                    },
                    name: "PRODUCT " + t_m,
                    plazo : "CI",
                    bidVWAP: 1.0001,
                    askVWAP: 2.8631,
                    dailyChange: 1.003,
                    contractValue : 100,
                    symbolGroup: {
                        name: "MERCADO_" + (mercado + 1),//(Math.floor(Math.random() * 3) + 1),
                        category: porfolio//port[Math.floor(Math.random() * 3)]
                    },
                    lowPriceParts: [1, 2, 3],
                    highPriceParts: [1, 2, 3],
                    quote: {
                        name: "PRODUCT " + t_m,
                        spreadTableVWAP: 1,
                        symbol: {
                            key: "producto_" + t_m,
                            isCloseOnly: false, name: "PRODUCT " + t_m,
                            fullDescription: "PRODUCT " + t_m + " des",
                            precision: 4,
                            description: "d " + t_m + " *-"

                        },

                        tick: {
                            priceChangeDirection: (t_i % 2) ? "up" : "down",
                            key: "producto_" + t_m,
                            bid: 0,
                            ask: 0,
                            dailyChange: 0
                        },

                    },
                }

            );

        }


    }


window.onbeforeunload = function () {
    //AppContext.HubPrecios.server.disconnect(true);
    MAE.SocketService.hub.server.disconnect(true);
};
