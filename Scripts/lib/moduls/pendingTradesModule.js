(function (jq) {

    var r = MAE.LayoutService;
    var l = MAE.SessionApiService;
    var d = MAE.I18nService;
    var n = MAE.DatagridService;
    var t = MAE.SettingsService;
    var u = MAE.PendingTradesService;

    var scope = {};
    var element;
    var i_cuenta_nuevasOrdenes = 0;
    var noEjecutadasComoNuevas = [];

    var moduleWrapper/*me*/,
        _xDataGridView/*Te*/,
        _moduleIsReadyFlag = false/*fe*/,
        _moduleActivatedFirstTime = false/*ye*/,
        _initSubcription = false/*Ce*/,
        _items = []/*Se*/,
        _onInitEjecutado = false;//Ee

    function _isLoad() {
        return scope.isAlive;
    };

    function _link(_element, attrs) {
        element = _element;
        _render();



        function _moduleAction(e) {//f
            switch (e) {
                case LayoutAction.MODULE_ADDED:
                    module_added();
                    break;
                case LayoutAction.MODULE_REMOVED:
                    module_removed();
                    break;
                case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                    if (!scope.isAlive) {
                        init_subcription();
                        module_activated_first_time();
                    }

                    break;
                case LayoutAction.MODULE_ACTIVATED:
                    module_activated_first_time();
                    break;
                case LayoutAction.MODULE_DEACTIVATED:
                    module_deactivated();
                    break;
                case LayoutAction.MODULE_RESIZED:
                    module_resized();
                    break;
                case LayoutAction.MODULE_CONTAINER_CHANGED:
                    moduleWrapper = element.closest(".xs-module-wrapper");
                    module_resized();
                    break;
                case LayoutAction.LAYOUT_OVERLAY_HIDE:
                    i.trackPageView(ModulesType.PENDING_TRADES)
            }
        }
        function module_added() {//y
            moduleWrapper = element.closest(".xs-module-wrapper")
        }
        function module_removed() {//C
            r.unsubscribeModuleAction(ModulesType.PENDING_TRADES, _moduleAction);
            u.removeSubscriptions(onInit);
            unregisterDatagrid();
            removeHotkey();
            scope.isAlive = false;
            _initSubcription = false;
            _moduleIsReadyFlag = false;
        }
        function init_subcription() {//S
            armar_columnas();
            if (!_initSubcription) {
                _initSubcription = true;
                u.initSubscriptions(onInit);
            }
            scope.isAlive = true;
        }
        function module_activated_first_time() {//E
            _moduleActivatedFirstTime = true;
            if (_initSubcription && _onInitEjecutado) {
                _onInitEjecutado = false;
            }
            _xDataGridView.updateItems(_items);

            update_grid();
            //i.trackPageView(ModulesType.OPEN_TRADES);
        }
        function module_deactivated() {//P
            _moduleActivatedFirstTime = false;
        }
        function module_resized() {//A
            update_grid();
        }
        function _moduleIsReady() {//b
            if (!_moduleIsReadyFlag) {
                _moduleIsReadyFlag = true;
                r.moduleIsReady(ModulesType.PENDING_TRADES)
            }
        }

        function setItemRun(item, val) {
            _items.filter(function (ite) { return ite.id === item.id })[0].isRun = val;
        }

        function onInit(e, data, o) {//v
            var l, t, a, i;
            var current_item;
            switch (e) {
                case DataEvent.EXIST:
                    break;
                case DataEvent.ITEM_LIST:
                    _.forEach(data, function (ite_for) {
                        if (_items.find(function (t) { return t.id === ite_for.id }) === undefined) {
                            _items.push(ite_for);

                        }

                    });

                    _xDataGridView.updateItems(data, 100);
                    _moduleIsReady();
                    break;
                case DataEvent.NEW:

                    _.forEach(data, function (ite_for) {
                        if (_items.find(function (t) { return t.id === ite_for.id }) === undefined) {

                            ite_for.isNew = true;
                            ite_for.isRun = false;
                            _items.push(ite_for);
                            current_item = ite_for;
                        }
                    });



                    setTimeout(function () {
                        if (_moduleActivatedFirstTime) {

                            _xDataGridView.updateItems(data, 100);
                            if (current_item) {


                                setTimeout(function () {


                                    var row = _xDataGridView.getDataModel().getRowByItem(current_item);
                                    _xDataGridView.getGridView().setSelectionModel(new Slick.RowSelectionModel);
                                    _xDataGridView.getGridView().setSelectedRows([row]);
                                    _xDataGridView.getGridView().setActiveCell(row, 0);
                                    _xDataGridView.getGridView().scrollRowToTop(row);
                                    current_item.isRun = true;

                                }, 300)

                            }
                        }
                        else {

                            _onInitEjecutado = true;

                        }

                    }, 0);

                    _moduleIsReady();
                    break;
                case DataEvent.UPDATED:
                    _moduleActivatedFirstTime ? _xDataGridView.updateItems(data, 100) : _onInitEjecutado = true;
                    break;
                case DataEvent.REMOVED:

                    for (l = 0, t = data.length; l < t; l++) {
                        a = data[l];

                        _.remove(_items, function (ite) {
                            return ite.id == a.id;

                        });

                    }

                    _moduleActivatedFirstTime ? _xDataGridView.updateItems([], 100) : _onInitEjecutado = true;

                    break;
                case DataEvent.NO_DATA:
                    _moduleIsReady();
            }
        }
        function showForSTC(e, s) {//O
            scope.showForSTC = s
        };
        function formatter_symbol(e, t, r, a, s) {
            return s instanceof Slick.Group ? '<div  class="slick-group-toggle"></div>' : r + '<span class="xs-btn-asset-class">' + i.getAssetClassLabelBySymbolKey(s.symbolKey) + "</span>"
        };

        function formatter_symbol_name(e, t, r, a, s) {
            return s instanceof Slick.Group ? '<div  class="slick-group-toggle"></div>' : r;//+ '<span class="xs-btn-asset-class">' + s.symbolKey + "</span>"
        };

        function formatter_type(e, t, r, i, a) {
            if (a instanceof Slick.Group)
                return '<div  class="slick-group-toggle"></div>';
            switch (a.dictPosReferenceId) {
                case 1:
                    return s.getFrequentString("SLTP_TYPE.TAKE_PROFIT");
                case 2:
                    return s.getFrequentString("SLTP_TYPE.STOP_LOSS");
                default:
                    return TradeUtils.getTradeTypeTranslatedLabel(d, a.side, a.tradeType);
            }
        };

        function formatter_nominalValue(e, t, r, i, a) {
            if (a instanceof Slick.Group) {
                var s = a.rows[0].assetClass;
                return s === AssetClass.STC ? Slick.Formatters.Margin(e, t, r, i, a) : '<span class="slickgrid-sum-total  slick-group-toggle">-</span>'
            }
            return a.assetClass === AssetClass.STC ? Slick.Formatters.Margin(e, t, r, i, a) : "-"
        };

        function _formatter_update(e, t, o, n, i) {//A
            if (i instanceof Slick.Group) {
                return '<span id="ordersCloseTradeBtn" class="xs-ot-group-close-btn"></span>'
            }

            return '<span id="updateTradeBtn" class="xs-ot-reverse-btn"></span>'

        }

        // var pluingRowManager = new Slick.RowMoveManager({
        //     cancelEditOnDrag: true,
        //     moveOneRowOnly: true,
        //     dragOutsideCallback: dragOutside
        // });

        function dragOutside(e, t) {//se
            MAE.PendingTradesService.itemDragAndDrop(e, t);
        }

        function armar_columnas() {//K
            Pe = [{
                id: "activa",
                name: "",
                nameKey: "",
                field: "orderId2",
                sortable: !0,
                formatter: formatter_activa,//Slick.Formatters.GroupRowFirstCell,
                cssClass: "slickgrid-cell-align-left activa ot-collapse",
                headerCssClass: "slickgrid-cell-align-center activa",
                minWidth: 5,
                maxWidth: 60,
                width: 60,
                xsFirstColumn: !0,
                xsShowAlways: !0,
                xsFrozen: !0,
                type: "number"
            },
            {
                id: "order",
                name: "",
                nameKey: "PENDING_TRADES.ORDER",
                field: "orderId2",
                sortable: !0,
                formatter: formatter_position,//Slick.Formatters.GroupRowFirstCell,
                cssClass: "slickgrid-cell-align-left  ot-collapse",
                headerCssClass: "toggleHeaderCellAlignLeft ",
                minWidth: 60,
                xsFirstColumn: !0,
                xsShowAlways: !0,
                xsFrozen: !0,
                type: "number"
            },
            {

                id: "symbo_name",
                name: "",
                nameKey: "PENDING_TRADES.SYMBOL",
                field: "symbo_name",
                sortable: !0,
                formatter: formatter_symbol_name,
                cssClass: "slickgrid-cell-align-left  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            },
            {
                id: "symbol",
                name: "",
                nameKey: "PENDING_TRADES.SYMBOL",
                field: "symbol",
                sortable: !0,
                formatter: formatter_symbol,
                cssClass: "slickgrid-cell-align-left  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            },
            {
                id: "type",
                name: "",
                nameKey: "PENDING_TRADES.TYPE",
                field: "tradeType",
                sortable: !0,
                formatter: formatter_trade_type,
                cssClass: "slickgrid-cell-align-left  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "number"
            },
            {
                id: "price",
                name: "",
                nameKey: "PENDING_TRADES.PRICE",
                field: "price",
                sortable: !0,
                precision: 3,
                formatter: Slick.Formatters.Price,
                cssClass: "slickgrid-cell-align-right  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "number"
            },
            {
                id: "volume",
                name: "",
                nameKey: "PENDING_TRADES.VOLUME",
                i18nService: MAE.I18nService, //traductor
                field: "volume",
                sortable: !0,
                formatter: Slick.Formatters.Volume,
                cssClass: "slickgrid-cell-align-right ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "number"
            }, {
                id: "openTime",
                name: "",
                nameKey: "PENDING_TRADES.OPEN_TIME",
                field: "openTime",
                sortable: !0,
                formatter: Slick.Formatters.Date,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "number"
            }, {
                id: "Timestamp",
                name: "",
                nameKey: "PENDING_TRADES.TIMESTAMP",
                field: "Timestamp",
                sortable: !0,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            }, {
                id: "openPrice",
                name: "",
                nameKey: "PENDING_TRADES.OPEN_PRICE",
                field: "openPrice",
                sortable: !0,
                formatter: Slick.Formatters.Price,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "number"
            },
            //  {
            //     id: "sl",
            //     name: "",
            //     nameKey: "PENDING_TRADES.SL",
            //     rendererTitle: d.getString("OPEN_TRADE.ADD_STOP_LOSS"),
            //     field: "sl",
            //     sortable: !0,
            //     formatter: Slick.Formatters.StopLoss,
            //     cssClass: "slickgrid-cell-align-center  ot-collapse",
            //     headerCssClass: "slickgrid-cell-align-center ",
            //     type: "number"
            // }, {
            //     id: "tp",
            //     name: "",
            //     nameKey: "PENDING_TRADES.TP",
            //     rendererTitle: d.getString("OPEN_TRADE.ADD_TAKE_PROFIT"),
            //     field: "tp",
            //     sortable: !0,
            //     formatter: Slick.Formatters.TakeProfit,
            //     cssClass: "slickgrid-cell-align-center  ot-collapse",
            //     headerCssClass: "slickgrid-cell-align-center ",
            //     type: "number"
            // }, 
            // {
            //     id: "expiration",
            //     name: "",
            //     nameKey: "PENDING_TRADES.EXPIRATION",
            //     field: "expiration",
            //     sortable: !0,
            //     formatter: Slick.Formatters.ExpirationDate,
            //     cssClass: "slickgrid-cell-align-center ot-collapse",
            //     headerCssClass: "slickgrid-cell-align-center",
            //     type: "number"
            // },            
            {
                id: "marketPrice",
                name: "",
                nameKey: "PENDING_TRADES.MARKET_PRICE",
                field: "marketPrice",
                sortable: !0,
                formatter: Slick.Formatters.MarketPrice,
                cssClass: "slickgrid-cell-align-right ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "number"
            },
            {
                id: "total",
                name: "",
                nameKey: "PENDING_TRADES.TOTAL",
                field: "total",
                sortable: !0,
                formatter: Slick.Formatters.Volume,
                cssClass: "slickgrid-cell-align-right ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "number"
            },
            {
                id: "margin",
                name: "",
                nameKey: "PENDING_TRADES.MARGIN",
                field: "margin",
                sortable: !0,
                formatter: Slick.Formatters.Money,
                cssClass: "slickgrid-cell-align-center ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "number"
            }, {
                id: "nominalValue",
                name: "",
                nameKey: "PENDING_TRADES.NOMINAL_VALUE",
                i18nService: MAE.I18nService,//traductor
                field: "nominalValue",
                sortable: !0,
                formatter: formatter_nominalValue,
                cssClass: "slickgrid-cell-align-center ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                toolTip: d.getString("PENDING_TRADES.NOMINAL_VALUE_TOOLTIP"),
                type: "number"
            }, {
                id: "comment",
                name: "",
                nameKey: "PENDING_TRADES.COMMENT",
                field: "comment",
                sortable: !0,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            }, {
                id: "openOrigin",
                name: "",
                nameKey: "OPEN_TRADES.OPEN_ORIGIN",
                i18nService: MAE.I18nService,//traductor
                field: "openOrigin",
                sortable: !0,
                formatter: Slick.Formatters.Origin,
                cssClass: "slickgrid-cell-align-center ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            },
            {
                id: "update",
                name: "",
                nameKey: "PENDING_TRADES.UPDATE",
                width: 90,
                maxWidth: 90,
                minWidth: 30,
                formatter: _formatter_update,
                cssClass: "slickgrid-cell-align-center ot-collapse",
                headerCssClass: "slickgrid-cell-align-center"
            },
            {
                id: "delete",
                name: "",
                nameKey: "PENDING_TRADES.DELETE",
                width: 80,
                maxWidth: 80,
                minWidth: 80,
                formatter: Slick.Formatters.DeleteColumn,
                cssClass: "slickgrid-cell-align-center ot-collapse",
                headerCssClass: "slickgrid-cell-align-center btn",
                xsLastColumn: !0,
                xsShowAlways: !0,
                xsFrozen: !0
            }

            ];
            _columns = Pe.map(function (e) {
                return jQuery.extend({}, e);
            });
            traducir();
            _proxy = {
                rowHeight: 30,
                allowAutoTooltip: true,
                allowOnlyOneSelection: true,
                viewportScrollY: _viewportScrollY,//Y
                moveRowCallback: _moveRowCallback,//X
                headerButtonClickCallback: _headerButtonClickCallback, //q
                sortCallback: _sortCallback, //ne
                headerClickCallback: _headerClickCallback,//H
                contextMenuCallback: _contextMenuCallback, //ie
                headerContextMenuCallback: _headerContextMenuCallback,//re
                clickCallback: _clickCallback,//le
                dblClickCallback: _dblClickCallback //te
            };
            var e = n.getSortData(ModulesType.PENDING_TRADES);

            if (e && e.id) {
                e.type = n.getTypeField(Pe, e.id);
            }
            var sortCompareFunction = function (s, o) {
                var l = _xDataGridView.getDefaultCompareByFieldFunction()
                    , t = l(s, o, e.field, e.sortAsc, e.type);
                if (0 == t) {
                    var a = _xDataGridView.getBasicCompareByFieldFunction();
                    t = a(s, o, "orderId2"),
                        t = e.sortAsc ? t : -t;
                }
                return t;
            };
            _proxy.sortParams = e;
            _proxy.sortCompareFunction = sortCompareFunction;
            var a = new Slick.Data.GroupItemMetadataProvider;
            var provider = {//i
                groupItemMetadataProvider: a,
                inlineFilters: false,
                sortGroups: true,
                grouping: true,
                emptyTotalAsLast: true
            };
            n.getColumnsFromSettings(ModulesType.PENDING_TRADES, _columns);
            _xDataGridView = new XDataGridView(element.find("#pendingTradesGrid"));
            var container = {//r
                getter: "symbolKey",
                sortGroupValue: function (e) {
                    // var o = e.assetClass;
                    // if (o === AssetClass.ETF || o === AssetClass.STC || o === AssetClass.EQ) {
                    //     //var l = s.getValueLight(e.symbolKey);
                    //     return e.symbol// l.description + " " + e.symbol
                    // }
                    return e.symbol;
                },
                sortGroupByField: "id",
                formatter: function (e) {
                    var l = u.getCloseableVolumeData(e.groupingKey);
                    null !== l && (e.volumesData = l),
                        e.recordType = e.rows.length > 0 ? e.rows[0].recordType : null;
                    var t = e.rows[0].assetClass;
                    // switch (t) {
                    //     case AssetClass.ETF:
                    //     case AssetClass.STC:
                    //     case AssetClass.EQ:
                    //     case AssetClass.CRT:
                    var a = {
                        description: e.rows[0].symbolKey
                    };
                    //s.getValueLight(e.rows[0].symbolKey);
                    return '<div class="slick-group-toggle" title="' + a.description + " ; " + (e.rows.length > 0 ? e.rows[0].symbol : e.value) + '">' + a.description + '<span class="xs-btn-asset-class" onclick="this.parentNode.click()">' + e.rows[0].symbolKey /* o.getAssetClassLabelBySymbolKey(e.rows[0].symbolKey)*/ + '</span><span class="slick-group-rectangle" onclick="this.parentNode.click()">' + e.count + "</span></div>";
                    //default:
                    // return '<div class="slick-group-toggle" title="' + (e.rows.length > 0 ? e.rows[0].symbol : e.value) + '">' + (e.rows.length > 0 ? e.rows[0].symbol : e.value) + '<span class="xs-btn-asset-class" onclick="this.parentNode.click()">' + o.getAssetClassLabelBySymbolKey(e.rows[0].symbolKey) + '</span><span class="slick-group-rectangle" onclick="this.parentNode.click()">' + e.count + "</span></div>"
                    //}
                },
                aggregators: [new Slick.Data.Aggregators.Volume("volume"), new Slick.Data.Aggregators.Sum("nominalValue"), new Slick.Data.Aggregators.Sum("margin"), new Slick.Data.Aggregators.Sum("commission"), new Slick.Data.Aggregators.Sum("storage"), new Slick.Data.Aggregators.Sum("profit")],
                aggregateCollapsed: false,
                lazyTotalsCalculation: true,
                displayTotalsRow: false
            };
            //columns, proxy, o, n, provider, container
            _xDataGridView.init(_columns, _proxy, _items, "id", provider, undefined/*container*/);


            //_xDataGridView.getGridView().registerPlugin(pluingRowManager);

            n.registerDatagrid(ModulesType.PENDING_TRADES, _xDataGridView.getGridView(), _columns);
            n.subscribeRefreshColumnFromSettingsEvent(refreshColumns);
            addHotkey();
            //t.setModuleValueAddHandler(ModulesType.PENDING_TRADES, "datagridColumns", setProfitMode);

            _xDataGridView.getDataModel().getItemMetadata = function (row) {
                // Get row
                var dvitem = _xDataGridView.getDataModel().getItem(row);
                // Make sure row is defined (important if using the 'enableAddRow' option)
                if (dvitem !== undefined) {

                    if (dvitem.$deleting === true) {
                        // If row is dirty add CSS class
                        return { 'cssClasses': 'deletingOrden' };
                    }

                    if (dvitem.$updating === true) {
                        // If row is dirty add CSS class
                        return { 'cssClasses': 'updatingOrden' };
                    }

                    // Check if row is Dirty
                    if (dvitem.isNew === true) {
                        // If row is dirty add CSS class
                        return { 'cssClasses': 'nuevaOrden' };
                    }




                }
            };


        }
        function _collapseGroup(e) {//D
            if (_xDataGridView.getDataModel()) {
                _xDataGridView.getDataModel().collapseGroup(e);
                _groupsCollapsed[e] = true;
            }

        }
        function refreshColumns() {//h
            setTimeout(function () {
                n.refreshColumns(Pe, ModulesType.PENDING_TRADES, _xDataGridView.getGridView())
            }, 0)
        }
        function addHotkey() {//w
            // c.addHotkey(HotkeysCombo.OPEN_TRADES_CLOSE_ALL, "keyup", keyup);
            // c.addHotkey(HotkeysCombo.OPEN_TRADES_CLOSE_WINNERS, "keyup", keyup);
            // c.addHotkey(HotkeysCombo.OPEN_TRADES_CLOSE_LOSERS, "keyup", keyup);
        }
        function removeHotkey() {//_
            // c.removeHotkey(HotkeysCombo.OPEN_TRADES_CLOSE_ALL, "keyup", keyup);
            // c.removeHotkey(HotkeysCombo.OPEN_TRADES_CLOSE_WINNERS, "keyup", keyup);
            // c.removeHotkey(HotkeysCombo.OPEN_TRADES_CLOSE_LOSERS, "keyup", keyup);
        }
        function keyup(e, s) {//I
            if (e.preventDefault(),
                c.isShortcutTradingEnabled())
                switch (s) {
                    case HotkeysCombo.OPEN_TRADES_CLOSE_ALL:
                        // scope.$broadcast(OpenTradesEvent.CLOSE_ALL, _xDataGridView.getData());
                        break;
                    case HotkeysCombo.OPEN_TRADES_CLOSE_WINNERS:
                        // scope.$broadcast(OpenTradesEvent.CLOSE_WINNERS, _xDataGridView.getData());
                        break;
                    case HotkeysCombo.OPEN_TRADES_CLOSE_LOSERS:
                    //scope.$broadcast(OpenTradesEvent.CLOSE_LOSERS, _xDataGridView.getData())
                }
        }
        function traducir() {//R
            for (var e = _columns.length - 1; e > -1; e--)
                _columns[e].name = d.getFrequentString(_columns[e].nameKey)
        }
        function formatter_trade_type(row, cell, value, columnDef, dataContext)//(e, s, o, l, t) {//M
        {
            if (dataContext instanceof Slick.Group) {
                if (null != dataContext.side && null != dataContext.tradeType) {
                    return '<div class="slick-group-toggle">' + TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType) + "</div>";
                }
                else {
                    return '<div class="slick-group-toggle"></div>';
                }
            }
            else {
                var color = dataContext.side === OrderType.BID ? "#ea1c24" : "#26b276;";
                return "<span style=color:" + color + ">" + TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType) + "</span>";
            }


            //return t instanceof Slick.Group ? null != dataContext.side && null != dataContext.tradeType ? '<div class="slick-group-toggle">' + TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType) + "</div>" : '<div class="slick-group-toggle"></div>' : TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType)



        }
        function formatter_close(row, cell, value, columnDef, dataContext)//(e, s, o, l, t) {//N
        {
            var a = "";
            return '<div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span></div>'
            //return '<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center"><span data-xsot="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="Double up position"></span><span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="Reverse position"></span></div><div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span></div>'

            // return t instanceof Slick.Group ? t.rows && t.rows.length > 0 && (!TradeUtils.isConfirmationRequired(t.rows[0]) || t.rows[0].assetClass == AssetClass.STC) ? t.rows[0].assetClass != AssetClass.STC ? m.closeAll.row === e ? '<div  class="slick-group-toggle"><div style="width:50%; height:17px;" class="slick-sub-cell slickgrid-cell-align-center slick-group-toggle">&#x20;</div><div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left"><div data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn-wrapper"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn"></span></div></div></div>' : '<div  class="slick-group-toggle"><div style="width:50%; height:17px;" class="slick-sub-cell slickgrid-cell-align-center slick-group-toggle">&#x20;</div><div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left slick-group-toggle"><div data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn-wrapper"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn"></span></div></div></div>' : '<div  class="slick-group-toggle"><div style="width:50%; height:17px;" class="slick-sub-cell slickgrid-cell-align-center slick-group-toggle">&#x20;</div><div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left slick-group-toggle"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn  ignore-context-menu"></span></div></div>' : "" : a = t.$deleting ? a.concat('<div style="width:50%" class="slick-sub-cell slickgrid-cell-align-center">', '<span  data-xsot="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="', d.getFrequentString("OPEN_TRADE.DOUBLE_UP_POSITION"), '"></span>', t.assetClass != AssetClass.STC ? '<span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="' + d.getFrequentString("OPEN_TRADE.REVERSE_POSITION") + '"></span>' : '<span class="xs-ot-reverse-place"></span>', "</div>", '<div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left">', t.assetClass != AssetClass.STC ? '<span  data-xsot="ordersCloseTradeBtn" class="xs-ot-close-pending-btn"></span>' : "", "</div>") : a.concat('<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center">', '<span data-xsot="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="', d.getFrequentString("OPEN_TRADE.DOUBLE_UP_POSITION") + '"></span>', t.assetClass != AssetClass.STC ? '<span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="' + d.getFrequentString("OPEN_TRADE.REVERSE_POSITION") + '"></span>' : '<span  class="xs-ot-reverse-place"></span>', "</div>", '<div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left">', t.assetClass != AssetClass.STC ? '<span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span>' : "", "</div>")


        }
        function formatter_position(e, s, o, l, t) {//V
            if (!o)
                return '<div><span class="ot-position-span" title="' + t.positionId + '"></span></div>';
            return '<div><span class="ot-position-span" title="' + t.positionId + '">' + o + '</span></div>';
        }
        function formatter_activa(e, s, o, l, t) {//V
            if (!o)
                return '<div><span class="ot-position-span" title="' + t.positionId + '"></span><span data-xsot="symbolInfo" data-positionid="' + t.positionId + '" class="ot-info-btn" title="Orden no activa en el mercado."></span></div>';
            return '';//'<div><span class="ot-position-span" title="' + t.positionId + '">' + o + '</span></div>';
        }
        function formatter_symbol(e, s, l, t, a) {//L
            return a instanceof Slick.Group ? '<div  class="slick-group-toggle"></div>' : l + '<span class="xs-btn-asset-class">' + o.getAssetClassLabelBySymbolKey(a.symbolKey) + "</span>"
        }
        function formatter_nominal_Value(e, s, o, l, t) {//K
            if (t instanceof Slick.Group) {
                var a = t.totals.sum && t.totals.sum[l.field]
                    , i = t.rows[0].assetClass;
                return null !== a && i === AssetClass.STC ? Slick.Formatters.Money(e, s, o, l, t) : '<span class="slickgrid-sum-total  slick-group-toggle">-</span>'
            }
            return null !== o && t.assetClass === AssetClass.STC ? Slick.Formatters.Money(e, s, o, l, t) : "-"
        }
        function formatter_profit(e, s, o, l, t) {//F
            return t instanceof Slick.Group ? '<div  class="slick-group-toggle"">' + formatter_profit_group(t.totals, l) + "</div>" : formatter_profit_no_group(o)
        }
        function formatter_profit_no_group(e) {//x
            return null != e ? e >= 0 ? '<span class="slickgrid-sum-total-positive" ">' + FormatUtils.formatMoney(e) + " %</span>" : '<span class="slickgrid-sum-total-negative" ">' + FormatUtils.formatMoney(e) + " %</span>" : ""
        }
        function formatter_profit_group(e, s) {//U
            var o = e.sum && e.sum[s.field];
            return null != o ? o >= 0 ? '<span class="slickgrid-sum-total-positive slick-group-toggle">' + FormatUtils.formatMoney(Math.round(100 * parseFloat(o)) / 100) + " %</span>" : '<span class="slickgrid-sum-total-negative slick-group-toggle">' + FormatUtils.formatMoney(Math.round(100 * parseFloat(o)) / 100) + " %</span>" : ""
        }
        function unregisterDatagrid() {//G
            n.unregisterDatagrid(ModulesType.PENDING_TRADES);
            t.setModuleValueRemoveHandler(ModulesType.PENDING_TRADES, "datagridColumns", setProfitMode);
            n.unsubscribeRefreshColumnFromSettingsEvent(refreshColumns);
            _xDataGridView && _xDataGridView.dispose();
            _xDataGridView = null;
        }
        function update_grid() {//B
            _xDataGridView && _xDataGridView.getGridView() && _xDataGridView.updateSize()
        }
        function _viewportScrollY() {//Y
            scope.closePartPopup.visible && (scope.closePartPopup.visible = false),
                scope.closeAllVisible && (scope.closeAllVisible = false)
        }
        function _moveRowCallback(e, s) {//X
            MAE.PendingTradesService.itemDragAndDrop(e, s);
        }
        function _headerButtonClickCallback(e, s) {//q
            "tradeTypeFilter" == s && n.showColumnFilterPopup(ModulesType.PENDING_TRADES, e, ce);
        }
        function _headerClickCallback(s, o) { //H
            var column_id = o.column.id;
            if ("delete" === column_id && "slick-column-name" === s.originalEvent.target.className) {
                var t = $(s.originalEvent.target).offset();
                if (scope.closeAllVisible === false || "all" !== scope.closeAll.idElement) {
                    scope.closeAll.openTrades = _xDataGridView.getData();
                    scope.closeAll.isGroup = false;
                    scope.closeAll.pageX = t.left + 50;
                    scope.closeAll.pageY = t.top + 13;
                    scope.closeAll.row = -1;
                    scope.closeAllVisible = true;
                    scope.closeAll.idElement = "all";
                    scope.closeAll.keyboardAction = null;
                    ve = setTimeout(function () { }, 0, true);
                }
                else {

                    scope.closeAllVisible = false;
                    ve = setTimeout(function () { }, 0, true);
                }
            }
        }
        function manjear_close(s, o) {//Q
            if (s.originalEvent.target.dataset && "ordersCloseTradeBtn" == s.originalEvent.target.dataset.xsot) {
                a.logClick("openTradesModule", "ordersCloseTradeBtn"),
                    i.eventClick(ModulesType.PENDING_TRADES, "openTradesModule", "ordersCloseTradeBtn");
                var temp_item = o.grid.getDataItem(o.row)//l
                    , t = SymbolKeyUtils.getAssetClassFromKey(l.groupingKey);
                if (t == AssetClass.STC)
                    if (l.volumesData && 0 == l.volumesData.closeableVolume)
                        u.showPopupCannotOpenPartialClose();
                    else {
                        l.rows.length > 0 ? l.rows[0].symbol : "";
                        u.closeTradeSTC(l.groupingKey, l.totals.sum);
                    }
                else
                    scope.closeAll.openTrades = temp_item;
                temp_item.rows.length > 0 && (scope.closeAll.openTrades.symbolName = temp_item.rows[0].symbol);

                scope.closeAllVisible === false || scope.closeAll.idElement !== "row" + o.row ? e(function () {
                    m.closeAll.isGroup = true;
                    var e;
                    e = "xs-ot-group-close-btn-wrapper" === s.originalEvent.target.className ? $(s.originalEvent.target.children[0]).offset() : $(s.originalEvent.target).offset(),
                        scope.closeAll.pageX = e.left,
                        scope.closeAll.pageY = e.top + 3,
                        scope.closeAllVisible = !0,
                        scope.closeAll.idElement = "row" + o.row,
                        scope.closeAll.row = o.row,
                        scope.closeAll.keyboardAction = null,
                        _xDataGridView.updateItems([temp_item.rows[0]], 0)
                }, 10) : (m.closeAll.row = -1,
                    scope.closeAllVisible = false,
                    _xDataGridView.updateItems([l.rows[0]], 0),
                    setTimeout(function () { }, 0, true))
            }
        }
        function addPopup(e, s, o) {//W
            p.addPopup("popupOpenTradesSymbolInfo", true, true, PopupsType.POPUP_OPEN_TRADES_POSITION_INFO, {
                positionId: o,
                id: "popupOpenTradesSymbolInfo",
                alone: !0
            })
        }
        function ordersCloseTradeBtn_click(e, s) {//j
            var o = s.grid.getDataItem(s.row);
            // a.logClick("openTradesModule", "ordersCloseTradeBtn"),
            //     i.eventClick(ModulesType.OPEN_TRADES, "openTradesModule", "ordersCloseTradeBtn"),
            //     //o.$deleting = !0,
            //     scope.closePartPopup.visible && s.row == scope.closePartPopup.row ? scope.closePartPopup.validValue && (u.closeTrade(s.grid.getDataItem(s.row), scope.closePartPopup.value),
            //         closePartPopup_visible()) : u.closeTrade(s.grid.getDataItem(s.row))

            u.closeTrade(s.grid.getDataItem(s.row));
            //o.$deleting = !1
        }
        function doubleUpTradeBtn_click(e, s) {//z
            a.logClick("openTradesModule", "doubleUpTradeBtn"),
                i.eventClick(ModulesType.PENDING_TRADES, "openTradesModule", "doubleUpTradeBtn"),
                u.doubleUpTrade(s.grid.getDataItem(s.row))
        }
        function reverseTradeBtn_click(e, s) {//Z
            // a.logClick("openTradesModule", "reverseTradeBtn"),
            //     i.eventClick(ModulesType.OPEN_TRADES, "openTradesModule", "reverseTradeBtn"),
            u.reverseTrade(s.grid.getDataItem(s.row));
        }
        function J(e, s) {
            var o = s.grid.getDataItem(s.row)
                , l = o instanceof Slick.Group;
            if (!l) {
                if (!e.originalEvent.target.dataset || o.$deleting)
                    return;
                // m.$apply(function () {
                //     switch (e.originalEvent.target.dataset.xsot) {
                //         case "symbolInfo":
                //             W(e, s, e.originalEvent.target.dataset.positionid)
                //     }
                // })
            }
        }

        function del(e, s) {
            var item = s.grid.getDataItem(s.row);
            var isGroup = item instanceof Slick.Group;
            if (!isGroup) {
                if (!e.originalEvent.target.dataset || item.$deleting)
                    return;

                MAE.PendingTradesService.CancelPending(item);
            }
        }

        function update(e, s) {
            var item = s.grid.getDataItem(s.row);
            var isGroup = item instanceof Slick.Group;
            if (!isGroup) {
                if (!e.originalEvent.target.dataset || item.$deleting)
                    return;

                MAE.PopupsService.showTradeUpdate(item);
            }
        }

        function close_handle(e, s) {
            if (rootScope.sessionType != SymbolSessionType.OPEN)
                return;

            var temp_item = s.grid.getDataItem(s.row)
            var isGroup = temp_item instanceof Slick.Group;
            if (isGroup)
                manjear_close(e, s);
            else {
                if (!e.originalEvent.target.dataset)
                    return;
                // if (temp_item.$deleting)
                //     return;
                // m.$apply(function () {
                switch (e.originalEvent.target.dataset.xsot) {
                    case "doubleUpTradeBtn":
                        doubleUpTradeBtn_click(e, s);//z
                        break;
                    case "reverseTradeBtn":
                        reverseTradeBtn_click(e, s);//Z
                        break;
                    case "ordersCloseTradeBtn":
                        ordersCloseTradeBtn_click(e, s);//j
                        break;
                    case "symbolInfo":
                        addPopup(e, s, e.originalEvent.target.dataset.positionid); //W
                }
                // })
            }
        }
        function se(e, s) {
            var o = s.grid.getDataItem(s.row)
                , l = o instanceof Slick.Group;
            // if (l) {
            //     var t = SymbolKeyUtils.getAssetClassFromKey(o.groupingKey) == AssetClass.STC;
            //     return void (t && u.openPendingTradePopup(o.groupingKey, TradeInputType.SL))
            // }
            o.assetClass != AssetClass.STC && m.$apply(function () {
                if ("removeSlButton" == e.originalEvent.target.id)
                    a.logClick("openTradesModule", "removeSlButton"),
                        i.eventClick(ModulesType.PENDING_TRADES, "openTradesModule", "removeSlButton"),
                        u.deleteTradeParam(s.grid.getDataItem(s.row), TradeInputType.SL, {
                            x: e.clientX,
                            y: e.clientY
                        });
                else {
                    a.logClick("openTradesModule", "sl"),
                        i.eventClick(ModulesType.PENDING_TRADES, "openTradesModule", "sl");
                    var o, l = $(e.originalEvent.target).offset(), t = s.grid.getDataItem(s.row);
                    o = $(e.originalEvent.target).hasClass("xs-ot-sltp-add-btn") ? {
                        x: l.left + 4,
                        y: l.top - 3
                    } : $(e.originalEvent.target).hasClass("xs-ot-sltp-value") ? {
                        x: l.left + $(e.originalEvent.target).width() / 2 + 10,
                        y: l.top + $(e.originalEvent.target).height() / 2 - 8
                    } : {
                                x: l.left + $(e.originalEvent.target).width() / 2 + 3,
                                y: l.top + $(e.originalEvent.target).height() / 2 - 9
                            },
                        u.modifyPosition(t, TradeInputType.SL, o);
                }
            });
        }
        function oe(e, s) {
            var o = s.grid.getDataItem(s.row);
            var l = o instanceof Slick.Group;
            if (l) {
                var t = SymbolKeyUtils.getAssetClassFromKey(o.groupingKey) === AssetClass.STC;
                return void (t && u.openPendingTradePopup(o.groupingKey, TradeInputType.TP));
            }
            o.assetClass != AssetClass.STC && m.$apply(function () {
                if ("removeTpButton" == e.originalEvent.target.id)
                    a.logClick("openTradesModule", "removeTpButton"),
                        i.eventClick(ModulesType.PENDING_TRADES, "openTradesModule", "removeTpButton"),
                        u.deleteTradeParam(s.grid.getDataItem(s.row), TradeInputType.TP, {
                            x: e.clientX,
                            y: e.clientY
                        });
                else {
                    a.logClick("openTradesModule", "tp"),
                        i.eventClick(ModulesType.PENDING_TRADES, "openTradesModule", "tp");
                    var o, l = $(e.originalEvent.target).offset(), t = s.grid.getDataItem(s.row);
                    o = $(e.originalEvent.target).hasClass("xs-ot-sltp-add-btn") ? {
                        x: l.left + 4,
                        y: l.top - 3
                    } : $(e.originalEvent.target).hasClass("xs-ot-sltp-value") ? {
                        x: l.left + $(e.originalEvent.target).width() / 2 + 10,
                        y: l.top + $(e.originalEvent.target).height() / 2 - 8
                    } : {
                                x: l.left + $(e.originalEvent.target).width() / 2 + 3,
                                y: l.top + $(e.originalEvent.target).height() / 2 - 9
                            },
                        u.modifyPosition(t, TradeInputType.TP, o);
                }
            });
        }
        function _clickCallback(e, s) {//le
            var o = s.grid.getColumns()[s.cell].id;
            if (scope.closePartPopup.visible && s.row != scope.closePartPopup.row)
                closePartPopup_visible();

            switch (o) {
                case "close":
                    close_handle(e, s);
                    break;
                case "sl":
                    se(e, s);
                    break;
                case "tp":
                    oe(e, s);
                    break;
                case "position":
                    J(e, s);
                    break;
                case "delete":
                    del(e, s);
                    break;
                case "update":
                    update(e, s);
                    break;

            }
        }
        function _dblClickCallback(e, s) {//te
            var o = s.grid.getColumns()[s.cell].id
                , l = s.grid.getDataItem(s.row);
            // scope.$apply(function() {
            //     "sl" != o && "tp" != o && "close" != o ? u.openModifyTradePopup(s.grid.getDataItem(s.row)) : l instanceof XCFDTrade && l.assetClass === AssetClass.STC && ("sl" === o || "tp" === o) && u.openModifyTradePopup(s.grid.getDataItem(s.row))
            // })
        }
        function _showProfitMenu(e) {//ae
            var s = e.pageX - $(e.currentTarget).offset().left
                , o = _xDataGridView.getGridView().getCellFromPoint(s, 0)
                , l = _xDataGridView.getGridView().getColumns()[o.cell].id;
            return "profit" === l;
        }
        function _contextMenuCallback(e, s, o, l) {//ie
            // if (scope.modifiedItem = e,
            //     !(scope.showProfitMenu = _showProfitMenu(l))) {
            //     ke = scope.closePartPopup.row,
            //         scope.closePartPopup.row = o,
            //         scope.closePartPopup.newPosition.pageX = l.clientX,
            //         scope.closePartPopup.newPosition.pageY = l.clientY;
            //     var t = "";
            //     var a = null;
            //     if (scope.modifiedItem) {
            //         t = scope.modifiedItem instanceof Slick.Group ? scope.modifiedItem.groupingKey : scope.modifiedItem.symbolKey,
            //             a = SymbolKeyUtils.getAssetClassFromKey(t)
            //     }
            //     else
            //         scope.modifiedItem = null;


            //     if (null == scope.modifiedItem || scope.modifiedItem instanceof Slick.Group) {
            //         if (null != scope.modifiedItem && scope.modifiedItem instanceof Slick.Group && a == AssetClass.STC) {
            //             scope.showTradeMenu = false;
            //             scope.showSymbolInfo = false;
            //             scope.showPartialCloseMenu = true;
            //             scope.showChart = false;
            //             scope.showPositionInfo = false;
            //             scope.showExecutionList = false;
            //         }
            //         else {
            //             m.showTradeMenu = false;
            //             scope.showPartialCloseMenu = false;
            //             scope.showSymbolInfo = false;
            //             scope.showChart = false;
            //             scope.showPositionInfo = false;
            //             scope.showExecutionList = false;
            //         }
            //     }
            //     else {
            //         m.showTradeMenu = a != AssetClass.STC;
            //         scope.showSymbolInfo = true;
            //         scope.showPartialCloseMenu = a != AssetClass.STC;
            //         scope.showChart = true;
            //         scope.showPositionInfo = true;
            //         scope.isShowOnChartEnabled = g.canAddSymbol(m.modifiedItem.symbolKey);
            //         if (scope.isShowOnChartEnabled)
            //             m.showOnChartTooltip = "";
            //         else {
            //             m.showOnChartTooltip = d.getString("CHART.MAX_CHARTS", {
            //                 count: XChartConst.MAX_CHARTS
            //             })
            //         }

            //         // scope.showExecutionList = a == AssetClass.ETF || a == AssetClass.STC;
            //     }
            // }
        }
        function _headerContextMenuCallback(e) {//re
            scope.showTradeMenu = false;
            scope.showPartialCloseMenu = false;
            scope.showChart = false;
            scope.showPositionInfo = false;
            scope.showExecutionList = false;
            scope.showProfitMenu = _showProfitMenu(e);
        }
        function _sortCallback(e) {//ne
            var s_compare = function (s, o) {
                var l = _xDataGridView.getDefaultCompareByFieldFunction();
                var t = l(s, o, e.sortCol.field, e.sortAsc, e.sortCol.type);
                if (0 == t) {
                    var a = _xDataGridView.getBasicCompareByFieldFunction();
                    t = a(s, o, "positionId");
                    t = e.sortAsc ? t : -t;
                }
                return t
            };
            _xDataGridView.setSortCompareFunction(s_compare);
            n.setSortData(ModulesType.PENDING_TRADES, e.sortCol, e.sortAsc);
        }
        function _loadSelectedRowsAfterUpdate() {//ce
            _xDataGridView.loadSelectedRowsAfterUpdate();
        }
        function setProfitMode() {//de
            scope.showProfitInPips ? scope.setProfitMode(0) : scope.setProfitMode(1);
        }
        function show_popup(s) { //pe
            if (!scope.closePartPopup.visible || scope.closePartPopup.row !== ke) {
                scope.closePartPopup.position.pageX = scope.closePartPopup.newPosition.pageX,
                    scope.closePartPopup.position.pageY = scope.closePartPopup.newPosition.pageY;
                var o = _xDataGridView.getData(scope.closePartPopup.row);
                scope.closePartPopup.value = o.volume,
                    o.volumesData && (scope.closePartPopup.value = o.volumesData.closeableVolume),
                    scope.modifiedTrade = scope.modifiedItem,
                    scope.closeAllVisible = false,
                    scope.closeAll.openTrades && scope.closeAll.openTrades.rows && scope.closeAll.openTrades.rows.length > 0 && _xDataGridView.updateItems([scope.closeAll.openTrades.rows[0]], 0),
                    o instanceof Slick.Group ? o.volumesData && 0 === o.volumesData.closeableVolume ? u.showPopupCannotOpenPartialClose() : s ? u.openModifyTradeSTCPopup(o) : scope.closePartPopup.visible = true : scope.closePartPopup.visible = true,
                    setTimeout(function () { }, 0, true);
            }
        }
        function closePartPopup_visible() {//ue
            scope.closePartPopup.visible === true && (scope.closePartPopup.visible = false);
        }
        function close() {//ge
            if (scope.closeAll.openTrades) {
                for (var i_row = 0; i_row < scope.closeAll.openTrades.length; i_row++) {
                    var it = scope.closeAll.openTrades[i_row];
                    if (it.$deleting)
                        return;

                    MAE.PendingTradesService.CancelPending(it);
                }
                _xDataGridView.updateItems([], 0);
                // var e = scope.closeAll.isGroup ? scope.closeAll.openTrades.rows[0] : scope.closeAll.openTrades[0];
                // e && _xDataGridView.updateItems([e], 0)
            }
        }

        scope.showProfitInPips = false;
        var Pe, _columns, _proxy /*be*/, ve, _groupsCollapsed = {};//Oe
        scope.closeAll = {
            pageX: 0,
            pageY: 0,
            idElement: "all",
            row: -1,
            isGroup: false
        };
        scope.closeAllVisible = false;
        scope.showProfitMenu = true;
        scope.showTradeMenu = false;
        scope.showPartialCloseMenu = false;
        scope.showChart = false;
        scope.showPositionInfo = false;
        scope.showSymbolInfo = false;
        scope.showForSTC = false;
        scope.showExecutionList = false;
        scope.isShowOnChartEnabled = false;
        scope.closePartPopup = {
            position: {
                pageX: 0,
                pageY: 0
            },
            newPosition: {
                pageX: 0,
                pageY: 0
            },
            row: 0,
            visible: false,
            value: "",
            validValue: !0
        };
        var ke = null;
        scope.modifiedItem = {};
        scope.currencyObject = {
            currency: "$$"//l.getCurrentAccount().getCurrency()
        };
        r.subscribeModuleAction(ModulesType.PENDING_TRADES, _moduleAction, "pendingTradesModule"),
            scope.showStocksSummary = function () {
                u.openStocksSummary()
            };

        scope.showExecutionListPopup = function () {
            p.addPopup("popupExecutionList", !0, !0, PopupsType.POPUP_EXECUTION_LIST, {
                openTrades: [scope.modifiedItem]
            })
        };

        scope.setProfitMode = function (e) {
            _columns = _xDataGridView.getGridView().getColumns();
            var s = n.getColumn("profit", _columns);
            void 0 != s && (0 == e ? (s.field = "pipsProfit",
                s.nameKey = "OPEN_TRADES.PROFIT_PIPS",
                scope.showProfitInPips = true) : (s.field = "profit",
                    s.nameKey = "OPEN_TRADES.PROFIT",
                    scope.showProfitInPips = false),


                s.name = d.getFrequentString(s.nameKey),
                _xDataGridView.getGridView().setColumns(Ae))
        };

        scope.expandAllGroups = function () {
            _xDataGridView.expandAllGroups()
        };

        scope.collapseAllGroups = function () {
            _xDataGridView.collapseAllGroups()
        };

        scope.showModifyTicket = function () {
            scope.modifiedItem && u.openModifyTradePopup(scope.modifiedItem)
        };

        scope.showTradeOnChart = function () {
            scope.isShowOnChartEnabled && g.showOpenTrade(scope.modifiedItem)
        };

        scope.openSymbolInfo = function () {
            var e;
            e = scope.modifiedItem instanceof Slick.Group ? scope.modifiedItem.groupingKey : scope.modifiedItem.symbolKey,
                p.addPopup("popupTradeSymbolInfoOT", !0, !0, "popup-symbol-info", {
                    symbolKey: e,
                    id: "popupTradeSymbolInfoOT",
                    alone: true
                });
        };

        scope.personalizeTable = function () {
            n.showPersonalizationWindow(ModulesType.PENDING_TRADES, _xDataGridView.getGridView(), Pe, Te)
        };

        scope.showClosePartPopupFromMenu = function () {
            setTimeout(function () {
                show_popup(true);
            }, 1)
        };

        scope.showPositionInfoFromMenu = function (e) {
            addPopup(e, null, scope.modifiedItem.positionId);
        };

        scope.showClosePartPopupFromButton = function (e, s) {
            ke = scope.closePartPopup.row;
            scope.closePartPopup.row = $(s.target).closest("div.slick-row").attr("row");
            scope.modifiedItem = _xDataGridView.getData(scope.closePartPopup.row);
            var o = $(s.target).offset();
            scope.closePartPopup.newPosition.pageX = o.left + 7;
            scope.closePartPopup.newPosition.pageY = o.top + 4;
            show_popup();
        };

        scope.closeAllCallback = function () {
            scope.closeAllVisible = false;
            close();
        };

        // jq(document).on("click", ".slickgrid-cell-align-center.btn", function (e) {
        //     scope._openTradesCloseAll.close();

        // });

        scope._closeAllVisible = false;
        Object.defineProperty(scope, 'closeAllVisible', {
            get: function () {
                return scope._closeAllVisible;
            },
            set: function (value) {
                scope._closeAllVisible = value;

                if (!value) {
                    scope.closeAll.row = -1;
                    //close();
                }

                close();
            }
        });

        // scope._openTradesCloseAll = new openTradesCloseAll(scope);
        // element.find("div[open-trades-close-all]").append(scope._openTradesCloseAll.getHtml());


        // scope.$watch("closeAllVisible", function(e, s) {
        //     e === !1 && (m.closeAll.row = -1),
        //     ge()
        // }),
        // m.$on(ContextMenuEvent.ON_RIGHT_CLICK, m.showClosePartPopupFromButton)

    };

    function _render(id) {

        var template = jq("#pendingTradesTemplate").html();

        element.append($(template));

    };

    function _toggleGridView() {

    };

    function _focusGrid() {

    };

    jq.extend(true, window, {
        MAE: {
            PendingTradesModule:
            {
                link: _link,
                isLoad: _isLoad,
                toggleGridView: _toggleGridView,
                focusGrid: _focusGrid
            }
        }
    });
})(jQuery);