var SettingsDefaultAccountData = {
    MAE: {
        startup: {
            wlDisclaimerAccepted: !1
        },
        notificationsHistoryFilter: {
            trading: !0,
            tradersTalk: !0,
            news: !0,
            calendar: !0,
            marketSentiment: !0,
            tradersList: !0,
            priceAlerts: !0,
            marginCall: !0,
            warning: !0
        },
        notificationsFilter: {
            trading: !0,
            tradersTalk: !1,
            news: !0,
            calendar: !0,
            marketSentiment: !1,
            tradersList: !1,
            priceAlerts: !0,
            marginCall: !1,
            warning: !0
        },
        priceAlerts: [],
        news: {
            rangeFrom: 2592e5,
            source: {
                tradebeat: !0,
                talk: !1,
                rss: !1,
                rss_wl: !0
            },
            sound: {
                play: !1,
                volume: .75
            },
            open: {
                open: !1
            }
        },
        calendarEconomic: {
            datagridSortsData: {
                id: "time",
                field: "time",
                sortAsc: !0
            },
            datagridColumns: [{
                id: "time"
            }, {
                id: "country"
            }, {
                id: "title"
            }, {
                id: "impact"
            }, {
                id: "currency"
            }, {
                id: "forecast"
            }, {
                id: "current"
            }, {
                id: "previous"
            }]
        },
        calendarDividend: {
            datagridSortsData: {
                id: "exDate",
                field: "exDate",
                sortAsc: !0
            },
            datagridColumns: [{
                id: "country"
            }, {
                id: "description"
            }, {
                id: "symbol"
            }, {
                id: "value"
            }, {
                id: "exDate"
            }, {
                id: "payDate"
            }]
        },
        favoriteSymbols: {
            datagridColumns: [{
                id: "symbol"
            }, {
                id: "dailyChange"
            }, {
                id: "bid"
            }, {
                id: "ask"
            }]
        },
        marketWatch: {
            datagridColumns: [{
                id: "symbol"
            }, {
                id: "dailyChange"
            }, {
                id: "bid"
            }, {
                id: "ask"
            }]
        },
        charts: {
            currentWorkspace: "",
            defaultSymbols: ["EURUSD_1", "OIL_2", "GOLD_2", "DE30_3"],
            defaultSymbols2: ["EURUSD_1", "GOLD_2"],
            toolbar: null,
            placePendingReverse: !1
        },
        marketAnalysis: {},
        screener: {
            datagridColumns: [{
                id: "instrument"
            }, {
                id: "industry"
            }, {
                id: "country"
            }, {
                id: "marketCap"
            }, {
                id: "eps"
            }, {
                id: "pe"
            }, {
                id: "dividendYield"
            }, {
                id: "pbv"
            }, {
                id: "percChange1Y"
            }]
        },
        fundSelector: {
            datagridColumns: [{
                id: "name"
            }, {
                id: "categoryName"
            }, {
                id: "arfTotalExpenseRatio"
            }, {
                id: "ttrReturn1Yr"
            }, {
                id: "ttrReturn3Yr"
            }, {
                id: "ttrReturn5Yr"
            }, {
                id: "returnSinceInception"
            }, {
                id: "ratingOverall"
            }, {
                id: "riskOverall"
            }]
        },
        topMovers: {
            selectedPeriod: "move_d1",
            filters: [1, 2, 3]
        },
        heatmapEquities: {
            selectedHeatmap: "4_US",
            selectedPeriod: "move_d1"
        },
        heatmapForex: {
            selectedHeatmap: "1",
            selectedPeriod: "move_d1"
        },
        marketSentiments: {
            viewType: "list",
            sentimentsType: 1,
            selection: [-1],
            symbols: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "US500", "DE30", "UK100", "SPA35", "GOLD", "SILVER", "OIL", "COFFEE", "USDCAD", "NZDUSD", "EURJPY", "EURGBP", "USDCHF", "USDTRY", "EURTRY", "USDPLN", "EURPLN", "USDCLP", "USDCZK", "USDRON", "US30", "US100", "FRA40", "EU50", "W20", "OIL.WTI", "NATGAS", "SUGAR"]
        },
        openTrades: {
            datagridColumns: [{
                id: "position"
            }, {
                id: "tradeType"
            }, {
                id: "volume"
            }, {
                id: "marketValue"
            }, {
                id: "sl"
            }, {
                id: "tp"
            }, {
                id: "openPrice"
            }, {
                id: "marketPrice"
            }, {
                id: "profit"
            }, {
                id: "totalProfit"
            }, {
                id: "netProfitPercent"
            }, {
                id: "close"
            }]
        },
        pendingTrades: {
            datagridColumns: [{
                id: "order"
            }, {
                id: "type"
            }, {
                id: "volume"
            }, {
                id: "openPrice"
            }, {
                id: "sl"
            }, {
                id: "tp"
            }, {
                id: "marketPrice"
            }, {
                id: "expiration"
            }, {
                id: "delete"
            }]
        },
        closedPositions: {
            datagridSortsData: {
                id: "closeTime",
                field: "closeTime",
                sortAsc: !1
            },
            datagridColumns: [{
                id: "symbol"
            }, {
                id: "position"
            }, {
                id: "type"
            }, {
                id: "lots"
            }, {
                id: "openTime"
            }, {
                id: "openPrice"
            }, {
                id: "closeTime"
            }, {
                id: "closePrice"
            }, {
                id: "profit"
            }, {
                id: "totalProfit"
            }, {
                id: "comment"
            }, {
                id: "positionInfo"
            }]
        },
        cashOperations: {
            datagridColumns: [{
                id: "id"
            }, {
                id: "ledgerType"
            }, {
                id: "timestamp"
            }, {
                id: "symbol"
            }, {
                id: "comment"
            }, {
                id: "nominal"
            }]
        },
        ordersHistory: {
            datagridColumns: [{
                id: "orderId"
            }, {
                id: "openTime"
            }, {
                id: "symbol"
            }, {
                id: "status"
            }, {
                id: "volume"
            }, {
                id: "price"
            }, {
                id: "sl"
            }, {
                id: "tp"
            }, {
                id: "type"
            }, {
                id: "origin"
            }, {
                id: "margin"
            }, {
                id: "orderValue"
            }, {
                id: "systemComment"
            }]
        },
        statisticsModule: {
            symbols: []
        },
        layout: PredefinedLayouts.CFD.layoutDefault,
        layoutContainers: PredefinedLayouts.CFD.containers,
        layoutBasic: PredefinedLayouts.CFD.layoutBasic,
        layoutBasicSizes: PredefinedLayouts.CFD.basicSizes,
        shortcutSettings: {
            "alt+ctrl+c": !1,
            "alt+ctrl+x": !1,
            "alt+ctrl+z": !1,
            "alt+ctrl+b": !1,
            "alt+ctrl+s": !1
        },
        topMoversFilers: [SymbolCategories.FOREX, SymbolCategories.CRYPTO, SymbolCategories.COMMODITIES, SymbolCategories.INDICES]
    }
};