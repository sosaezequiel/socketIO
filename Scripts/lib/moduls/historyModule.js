(function (jq) {

    var r = MAE.LayoutService;
    var l = MAE.SessionApiService;
    var d = MAE.I18nService;
    var n = MAE.DatagridService;
    var t = MAE.SettingsService;
    var u = MAE.HistoryService;

    var scope = {};

    var element;
    var $filterPanel;
    var $date_range_picker;
    var $mae_multiselect_combobox_state;
    var $mae_multiselect_combobox_symbol;

    var _maeDateRangePicker;
    var _maeMultiselectComboboxState;
    var _maeMultiselectComboboxSymbol;
    var _pagerGrid;
    var _data_jsp;
    var slick_viewport;

    var options_gid = {};

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
                    i.trackPageView(ModulesType.HISTORY)
            }
        }
        function module_added() {//y
            moduleWrapper = element.closest(".xs-module-wrapper")
        }
        function module_removed() {//C
            r.unsubscribeModuleAction(ModulesType.HISTORY, _moduleAction);
            u.removeSubscriptions(onInit);
            gridUnSubcribe();
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
                _xDataGridView.updateItems(_items);
            }

            update_grid();
           
        }
        function module_deactivated() {//P
            _moduleActivatedFirstTime = false;
            //scope = {};
        }

        function module_resized() {//A
            update_grid();
        }
        function _moduleIsReady() {//b
            if (!_moduleIsReadyFlag) {
                _moduleIsReadyFlag = true;
                r.moduleIsReady(ModulesType.HISTORY)
            }
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
            }
            return e[t.field];
        }

        var _detallePanel;
        function getTemplateDetalle() {

            if (!_detallePanel)
                _detallePanel = new detallePanel(scope, _xDataGridView.getGridView());

            return _detallePanel;
        }

        function ponerTemplateRow(e) {//ie
            var _grid = _xDataGridView.getGridView();
            _grid.showNgLineRenderer(getTemplateDetalle(), true);


        }

        function efectoheight() {//Se
            var _grid = _xDataGridView.getGridView();
            if (_grid) {

                _grid.resizeCanvas();
            }
            setTimeout(function () {
                if (_data_jsp) {
                    _data_jsp.reinitialise();
           
                }

            }, 0);


        }

        var _singleClickFlag;
        var item_click;
        function onDblClick(t, o) {//ne
            var _grid = _xDataGridView.getGridView();



            var _dataView = _xDataGridView.getDataModel();
            var item_temp = _grid.getDataItem(o.row);

            if (!item_temp.IsDetalle)
                return;


            if(item_temp.openDetalle && item_temp.openDetalle === true)
            {
                scope.closeDetalle();
                item_temp.openDetalle = false;
                return;
            }
            if(item_click && item_click != item_temp)
            {
                item_click.openDetalle = false;
            }

            item_temp.openDetalle = true;
            item_click = item_temp;
            _grid.setActiveCell(_dataView.getRowById(item_temp.key), 0);
            _grid.setSingleItemRendererData(item_temp, true);

            ponerTemplateRow();

            setTimeout(function () {
                efectoheight();
                _singleClickFlag = false;
            }, 10);

        }

        function gridSubcribe() {//_e
            var _dataView = _xDataGridView.getDataModel();
            var _grid = _xDataGridView.getGridView();

            _grid.onDblClick.subscribe(onDblClick);//Ae
            _grid.onClick.subscribe(onDblClick);//Te
            _dataView.onRowCountChanged.subscribe(onRowCountChanged);//Me
            _dataView.onRowsChanged.subscribe(onRowsChanged);//Ke

        }
        function gridUnSubcribe() {//De
            var _dataView = _xDataGridView.getDataModel();
            var _grid = _xDataGridView.getGridView();

            if (_grid) {
                _grid.onDblClick.unsubscribe(onDblClick);
                _grid.onClick.unsubscribe(onDblClick);

            }

            if (_dataView) {
                _dataView.onRowCountChanged.unsubscribe(onRowCountChanged);
                _dataView.onRowsChanged.unsubscribe(onRowsChanged);
                
            }
        }

        function onRowCountChanged(t, o) {//Me
            var _dataView = _xDataGridView.getDataModel();
            var _grid = _xDataGridView.getGridView();

            _grid.invalidateAllRows();
            _grid.updateRowCount(true);
            _grid.render();
            setTimeout(function () {
                // if (_data_jsp && !flag_selected)
                //     _data_jsp.reinitialise();
            }, 0);
        }

        function onRowsChanged(e, t) {
            var _dataView = _xDataGridView.getDataModel();
            var _grid = _xDataGridView.getGridView();

            _grid.invalidateRowsData(t.rows);
            _grid.render();
        }



        function onInit(e, data, o) {//v
            var l, t, a, i;
            var current_item;
            switch (e) {
                case DataEvent.EXIST:

                case DataEvent.ITEM_LIST:
                    _data_jsp.scrollToY(0);

                    _data_jsp.getContentPane().addClass("initialization");

                    _.forEach(data, function (ite_for) {
                        var temp_item = _items.find(function (t) { return t.IdOrden == ite_for.IdOrden });
                        if (temp_item === undefined) {
                            _items.push(ite_for);
                        }
                    });

                    var index_to_remove = [];
                    _.forEach(_items, function (ite_for) {
                        var temp_item = data.find(function (t) { return t.IdOrden == ite_for.IdOrden } );
                        if (temp_item === undefined) {
                            index_to_remove.push(ite_for);
                        }
                    });

                    _.forEach(index_to_remove, function (ite_for) {
                        _items.splice(_items.indexOf(ite_for), 1);
                    });

                    scope.items_back = _items.splice();


                    _xDataGridView.getDataModel().setFilterArgs({
                        IdEstados: [],
                        CodigoProductos: []
                    });
                    _xDataGridView.getDataModel().setFilter(filtroGlobal);

                    _xDataGridView.getGridView().hideNgLineRenderer();

                    _xDataGridView.updateItems(data, 100);



                    onChangeList(data);
                    _data_jsp.getContentPane().removeClass("initialization");
                    _moduleIsReady();
                    break;

                case DataEvent.NEW:

                    _.forEach(data, function (ite_for) {
                        if (_items.find(function (t) { return t.id == ite_for.id }) === undefined) {

                            ite_for.isNew = true;
                            ite_for.isRun = false;
                            _items.push(ite_for);
                            current_item = ite_for;
                        }
                    });
                    _xDataGridView.updateItems(data, 100);

                    if (_moduleActivatedFirstTime) {
                        if (current_item) {
                            if (current_item.pareja) {
                                _items.sort(function (row1, row2) {
                                    var value1 = row1["pareja"];
                                    var value2 = row2["pareja"];
                                    return value1 == value2 ? 0 : (value1 > value2 ? 1 : -1);
                                });
                            }

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
                    _items.length = 0;
                    _xDataGridView.updateItems([], 100);
                    onChangeList(data);
                    _moduleIsReady();

                    break;
            }

        }
        function showForSTC(e, s) {//O
            scope.showForSTC = s
        }

        function _setTextResult() {
            //d.getString("HISTORY.EXPIRY_DATE_TOOLTIP")
            element.find("#no_results").text(d.getString("ORDERS_HISTORY.NO_RESULTS"));
            element.find("#no_results_for_selected_filters").text(d.getString("ORDERS_HISTORY.NO_RESULTS_FOR_SELECTED_FILTERS"));
        }

        function sowLabelResult(f_show) {

            if (f_show) {

                element.find("#noDataOrdersHistory").css("display", "none");
                element.find("#ordersHistoryGrid").css("opacity", "1");
            }
            else {
                element.find("#noDataOrdersHistory").css("display", "flex");
                element.find("#ordersHistoryGrid").css("opacity", "0");
            }

        }

        function armar_columnas() {//K
            Pe = [
                {
                    id: "NumeroOrdenInterno",
                    name: "",
                    nameKey: "HISTORY.NumeroOrdenInterno",
                    field: "NumeroOrdenInterno",
                    sortable: !0,
                    formatter: formatter_numero_orden_interno,
                    cssClass: "first-row-field",
                    headerCssClass: "toggleHeaderCellAlignLeft",
                    width: 84,
                    xsFirstColumn: !0,
                    xsShowAlways: !0,
                    xsFrozen: !0,
                    type: "number"
                }
                , {
                    id: "IdEstado",
                    name: "",
                    nameKey: "HISTORY.Estado",
                    field: "IdEstado",
                    width: 95,
                    sortable: !0,
                    formatter: formatter_estado,
                    cssClass: "slickgrid-cell-align-center  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                }
                , {
                    id: "FechaConcertacion",
                    name: "",
                    nameKey: "HISTORY.FechaConcertacion",
                    field: "FechaConcertacion",
                    width: 140,
                    sortable: !0,
                    formatter: _formatter_date,
                    cssClass: "slickgrid-cell-align-center ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "number"
                }
                , {
                    id: "CompraVenta",
                    name: "",
                    nameKey: "HISTORY.CompraVenta",
                    field: "CompraVenta",
                    width: 42,
                    sortable: !0,
                    formatter: _formatter_CompraVenta,
                    cssClass: "slickgrid-cell-align-center  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                }
                , {
                    id: "ProductoDescripcion",
                    name: "",
                    nameKey: "HISTORY.ProductoDescripcion",
                    field: "ProductoDescripcion",
                    width: 160,
                    sortable: !0,
                    formatter: formatter_producto_descripcion,
                    cssClass: "slickgrid-cell-align-center  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                }
                , {
                    id: "PlazoDescripcion",
                    name: "",
                    nameKey: "HISTORY.PlazoDescripcion",
                    field: "PlazoDescripcion",
                    width: 45,
                    sortable: !0,
                    formatter: formatter_plazo_descripcion,
                    cssClass: "slickgrid-cell-align-center  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                }
                , {
                    id: "MonedaDescripcion",
                    name: "",
                    nameKey: "HISTORY.MonedaDescripcion",
                    field: "MonedaDescripcion",
                    width: 78,
                    sortable: !0,
                    formatter: formatter_Moneda_descripcion,
                    cssClass: "slickgrid-cell-align-center  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                },
                {
                    id: "Precio",
                    name: "",
                    nameKey: "HISTORY.Precio",
                    field: "Precio",
                    sortable: !0,
                    formatter: formatter_price,
                    cssClass: "slickgrid-cell-align-right  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center ",
                    type: "number"
                }
                , {
                    id: "Cantidad",
                    name: "",
                    nameKey: "HISTORY.Cantidad",
                    field: "Cantidad",
                    sortable: !0,
                    formatter: _volume,
                    cssClass: "slickgrid-cell-align-right ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "number"
                }
                , {
                    id: "Ejecutada",
                    name: "",
                    nameKey: "HISTORY.Ejecutada",
                    field: "Ejecutada",
                    sortable: !0,
                    formatter: _formatter_ejecutada,
                    cssClass: "slickgrid-cell-align-right ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "number"
                }
                , {
                    id: "Remanente",
                    name: "",
                    nameKey: "HISTORY.Remanente",
                    field: "Remanente",
                    sortable: !0,
                    formatter: _formatter_remanente,
                    cssClass: "slickgrid-cell-align-right ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "number"
                }
                , {
                    id: "PersonaDescripcion",
                    name: "",
                    nameKey: "HISTORY.PersonaDescripcion",
                    field: "PersonaDescripcion",
                    sortable: !0,
                    formatter: _formatter_persona_descripcion,
                    cssClass: "slickgrid-cell-align-center  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                }
                , {
                    id: "NumeroOrdenMercado",
                    name: "",
                    nameKey: "HISTORY.NumeroOrdenMercado",
                    field: "NumeroOrdenMercado",
                    sortable: !0,
                    formatter: formatter_NumeroOrdenMercado,
                    cssClass: "slickgrid-cell-align-right  ot-collapse",
                    headerCssClass: "slickgrid-cell-align-center",
                    type: "string"
                }
  
            ];

            _columns = Pe.map(function (e) {
                return jQuery.extend({}, e);
            });
            traducir();
            _proxy = {
                rowHeight: 40,
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
                dblClickCallback: _dblClickCallback, //te
                gridAdvancedEnabled: true,
                ngRendererScope: scope,
                rowHeight: 45,
                rowGroupHeight: 45,
                rowCollapsedHeight: 45,
                rowNgRendererHeight: 210,
                rowNgRendererExtendedHeight: 265,
                noScrollBarRightPadding: 9,
                ngRendererAdditionalRowClass: "slick-row-detalle",
                dataItemColumnValueExtractor: _dataItemColumnValueExtractor


            };
            var e = n.getSortData(ModulesType.HISTORY);

            if (e && e.id) {
                e.type = n.getTypeField(Pe, e.id);
            }
            var sortCompareFunction = function (s, o) {
                var l = _xDataGridView.getDefaultCompareByFieldFunction()
                    , t = l(s, o, e.field, e.sortAsc, e.type);
                if (0 == t) {
                    var a = _xDataGridView.getBasicCompareByFieldFunction();
                    t = a(s, o, "positionId"),
                        t = e.sortAsc ? t : -t
                }
                return t
            };
            _proxy.sortParams = e;
            _proxy.sortCompareFunction = sortCompareFunction;
            var _metadataProvider = new Slick.Data.GroupItemMetadataProvider({
                //colspan: "*",
                additionalToggleCssClasses: ["slick-cell", "slick-group-title"],
                groupCssClass: "history-symbol-group slick-group-toggle"
            });

            var provider = {//i
                groupItemMetadataProvider: _metadataProvider,
                inlineFilters: true,
                sortGroups: false,
                grouping: false,
                emptyTotalAsLast: true
            };
            n.getColumnsFromSettings(ModulesType.HISTORY, _columns);
            _xDataGridView = new XDataGridView(element.find("#historyGrid"));
            var groupObj = {//r

                getter: function (item) {

                    return item.IdOrden;
                },

                formatter: _formatter_group,
                collapsed: true,
                sortGroupByField: "IdOrden"

            };

            options_gid = {//
                enableCellNavigation: true,
                enableColumnReorder: true,
                forceFitColumns: true,
                fullWidthRows: true
        
            };



            _proxy = jq.extend({
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
                }
                //gridContainerClass: "slick-mw-drag-container"
            }, _proxy);


            _xDataGridView.init(_columns, _proxy, _items, "id", options_gid, null/*groupObj*/);

            _pagerGrid = new Slick.Controls.Pager(_xDataGridView.getDataModel(), _xDataGridView.getGridView(), $("#pager"));

            _pagerGrid.subscribe(onPageChange);

            slick_viewport = element.find("div.slick-viewport");
            slick_viewport.jScrollPane({
                showArrows: false,
                contentWidth: "0px"
            });

            _data_jsp = slick_viewport.data("jsp");


            _xDataGridView.getGridView().onKeyDown.subscribe(function (e, data, grid) {
                var _grid = _xDataGridView.getGridView();
                if (data.row === undefined) {
                    _grid.setSelectionModel(new Slick.RowSelectionModel);
                    _grid.setSelectedRows([0]);
                }
    
                if (data.row != undefined && e.keyCode == 13) {
                    var n = _grid.getDataItem(data.row);
                    _grid.onDblClick.notify(data, e, _grid);
    
                }
                if (data.row != undefined && e.keyCode == 27) {
                    if (!rootScope.widgetMode) {
                        var n = _grid.getDataItem(data.row);
                        _grid.hideNgLineRenderer();
                    }
                }
            });

            gridSubcribe();
            n.registerDatagrid(ModulesType.HISTORY, _xDataGridView.getGridView(), _columns);
            n.subscribeRefreshColumnFromSettingsEvent(refreshColumns);
            addHotkey();
            //t.setModuleValueAddHandler(ModulesType.HISTORY, "datagridColumns", setProfitMode);

            var metadata_Orden = {
                columns: {
                    NumeroOrdenInterno: {
                        colspan: 16
                    }

                }



            }
            var metadata_Orden_Detalle = {


            }

            _xDataGridView.getDataModel().getItemMetadata = function (row) {
                // Get row
                var dvitem = _xDataGridView.getDataModel().getItem(row);

                if (dvitem != undefined) {
                    //     //return  (dvitem.__group &&  dvitem.IsDetalle != undefined)? metadata_Orden: metadata_Orden_Detalle;

                    if (dvitem.__group) {
                        if (dvitem.rows[0].IsDetalle) {//tiene detalles

                            return { 'cssClasses': 'isDetalle' };

                            // if (dvitem._collapsed) {
                            //     return { 'cssClasses': 'isDetalle' };
                            // }
                            // else {
                            //     return { 'cssClasses': 'isDetalle' };
                            // }


                        }
                        else { //no tiene detalles

                        }

                    }
                    else //detalle
                    {


                    }


                }

                // Make sure row is defined (important if using the 'enableAddRow' option)
                // if (dvitem != undefined) {
                //     // Check if row is Dirty
                //     if (dvitem.isNew == true) {
                //         // If row is dirty add CSS class
                //         return { 'cssClasses': 'nuevaOrden' };
                //     }

                //     //if (dvitem.$deleting == true) {
                //     //    // If row is dirty add CSS class
                //     //    return { 'cssClasses': 'deletingOrden' };
                //     //}


                //     //if (dvitem.pareja) {
                //     //    // If row is dirty add CSS class
                //     //    return { 'cssClasses': 'parejaOrden' };
                //     //}

                // }
            };

        }



        function onPageChange(data) {
            scope.search(data);
        }

        function _collapseGroup(e) {//D
            if (_xDataGridView.getDataModel()) {
                _xDataGridView.getDataModel().collapseGroup(e);
                Oe[e] = true;
            }

        }
        function refreshColumns() {//h
            setTimeout(function () {
                n.refreshColumns(Pe, ModulesType.HISTORY, _xDataGridView.getGridView())
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
                return TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType);
            }


            //return t instanceof Slick.Group ? null != dataContext.side && null != dataContext.tradeType ? '<div class="slick-group-toggle">' + TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType) + "</div>" : '<div class="slick-group-toggle"></div>' : TradeUtils.getTradeTypeTranslatedLabel(d, dataContext.side, dataContext.tradeType)



        }

        function _formatter_CompraVenta(row, cell, value, columnDef, dataContext) {
            // if (dataContext instanceof Slick.Group) {
            var color = {};
            color["Sell"] = "#26b276";
            color["Buy"] = "#ea1c24";
            return '<div class="slick-group-toggle" style="color:' + color[dataContext.CompraVenta] + '">' + dataContext.CompraVenta + "</div>";
            // }

            //return "";
        }

        function formatter_close(row, cell, value, columnDef, dataContext)//(e, s, o, l, t) {//N
        {
            var a = "";

            if (!dataContext.pareja)
                return '<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center"><span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="Reverse position"></span></div><div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span></div>'
            //return '<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center"><span data-xsot="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="Double up position"></span><span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="Reverse position"></span></div><div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span></div>'

            return '<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center"><span  class="xs-ot-pareja" title="Closing"></span></div>';
            // return t instanceof Slick.Group ? t.rows && t.rows.length > 0 && (!TradeUtils.isConfirmationRequired(t.rows[0]) || t.rows[0].assetClass == AssetClass.STC) ? t.rows[0].assetClass != AssetClass.STC ? m.closeAll.row === e ? '<div  class="slick-group-toggle"><div style="width:50%; height:17px;" class="slick-sub-cell slickgrid-cell-align-center slick-group-toggle">&#x20;</div><div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left"><div data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn-wrapper"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn"></span></div></div></div>' : '<div  class="slick-group-toggle"><div style="width:50%; height:17px;" class="slick-sub-cell slickgrid-cell-align-center slick-group-toggle">&#x20;</div><div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left slick-group-toggle"><div data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn-wrapper"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-group-close-btn"></span></div></div></div>' : '<div  class="slick-group-toggle"><div style="width:50%; height:17px;" class="slick-sub-cell slickgrid-cell-align-center slick-group-toggle">&#x20;</div><div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left slick-group-toggle"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn  ignore-context-menu"></span></div></div>' : "" : a = t.$deleting ? a.concat('<div style="width:50%" class="slick-sub-cell slickgrid-cell-align-center">', '<span  data-xsot="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="', d.getFrequentString("OPEN_TRADE.DOUBLE_UP_POSITION"), '"></span>', t.assetClass != AssetClass.STC ? '<span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="' + d.getFrequentString("OPEN_TRADE.REVERSE_POSITION") + '"></span>' : '<span class="xs-ot-reverse-place"></span>', "</div>", '<div style="width:50%" class="slick-sub-cell slickgrid-cell-align-left">', t.assetClass != AssetClass.STC ? '<span  data-xsot="ordersCloseTradeBtn" class="xs-ot-close-pending-btn"></span>' : "", "</div>") : a.concat('<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center">', '<span data-xsot="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="', d.getFrequentString("OPEN_TRADE.DOUBLE_UP_POSITION") + '"></span>', t.assetClass != AssetClass.STC ? '<span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="' + d.getFrequentString("OPEN_TRADE.REVERSE_POSITION") + '"></span>' : '<span  class="xs-ot-reverse-place"></span>', "</div>", '<div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left">', t.assetClass != AssetClass.STC ? '<span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span>' : "", "</div>")


        }
        function formatter_numero_orden_interno(row, cell, value, columnDef, dataContext) {//V

            if (dataContext instanceof Slick.Group) {

                if (dataContext.rows[0].IsDetalle) {
                    if (dataContext.collapsed) {
                        return '<span class="slick-group-toggle collapsed"></span><div class="slick-group-toggle">' + dataContext.rows[0].NumeroOrdenInterno + "</div>"
                    }
                    else {
                        return '<span class="slick-group-toggle expanded"></span><div class="slick-group-toggle">' + dataContext.rows[0].NumeroOrdenInterno + "</div>"
                    }

                }
                else {
                    return '<div class="slick-group-toggle" style="margin-left: 23px">' + dataContext.rows[0].NumeroOrdenInterno + "</div>"
                }


            } else {
                if (dataContext.IsDetalle) {
                    // if (dataContext.collapsed) {
                    //     return '<span class="slick-group-toggle collapsed"></span><div class="slick-group-toggle">' + dataContext.NumeroOrdenInterno + "</div>"
                    // }
                    // else {
                    return '<span class="slick-group-toggle collapsed"></span><div class="slick-group-toggle">' + dataContext.NumeroOrdenInterno + "</div>"
                    // }

                }
                else {
                    return '<div class="slick-group-toggle" style="margin-left: 23px">' + dataContext.NumeroOrdenInterno + "</div>"
                }
            }

            // return '<div><span class="ot-position-span" title="' + t.positionId + '">' + o + '</span><span data-xsot="symbolInfo" data-positionid="' + t.positionId + '" class="ot-info-btn" title="' + d.getFrequentString("HISTORY.POSITION_INFO.TITLE") + '"></span></div>'
        }
        function _volume(row, cell, value, columnDef, dataContext) {//_volume
            var cantidad;
            if (dataContext instanceof Slick.Group) {
                 cantidad = dataContext.rows[0].Cantidad;
                return '<div  class="slick-group-toggle" title="' + FormatUtils.formatSimpleVolume(cantidad) + '">' + LongNumberUtils.getShortRepresentation(MAE.I18nService, cantidad, 2) + "</div>"
            } else {
                 cantidad = dataContext.Cantidad;
                return '<div  class="" title="' + FormatUtils.formatSimpleVolume(cantidad) + '">' + LongNumberUtils.getShortRepresentation(MAE.I18nService, cantidad, 2) + "</div>"
            }
        }

        function _formatter_ejecutada(row, cell, value, columnDef, dataContext) {
            if (dataContext instanceof Slick.Group) {
                return '<div  class="slick-group-toggle">' + dataContext.rows[0].Ejecutada + "</div>"
            } else {
                return dataContext.Ejecutada;//FormatUtils.formatVolume(MAE.I18nService, o)
            }

        }

        function _formatter_remanente(row, cell, value, columnDef, dataContext) {
            if (dataContext instanceof Slick.Group) {
                return '<div  class="slick-group-toggle">' + dataContext.rows[0].Remanente + "</div>"
            } else {
                return dataContext.Remanente;//FormatUtils.formatVolume(MAE.I18nService, o)
            }
        }

        function _formatter_persona_descripcion(row, cell, value, columnDef, dataContext) {
            return dataContext instanceof Slick.Group ? '<div  class="slick-group-toggle">' + dataContext.rows[0].PersonaDescripcion + '</div>' : dataContext.PersonaDescripcion; //+ '<span class="xs-btn-asset-class">' + a.ProductoDescripcion + "</span>"
        }

        function formatter_NumeroOrdenMercado(row, cell, value, columnDef, dataContext) {
            return dataContext instanceof Slick.Group ? '<div  class="slick-group-toggle">' + dataContext.rows[0].NumeroOrdenMercado + '</div>' : dataContext.NumeroOrdenMercado; //+ '<span class="xs-btn-asset-class">' + a.ProductoDescripcion + "</span>"
        }

        function formatter_NroOperacionMercado(row, cell, value, columnDef, dataContext) {
            return dataContext instanceof Slick.Group ? '<div  class="slick-group-toggle">' + dataContext.rows[0].NroOperacionMercado + '</div>' : dataContext.NroOperacionMercado; //+ '<span class="xs-btn-asset-class">' + a.ProductoDescripcion + "</span>"
        }

        function formatter_producto_descripcion(row, cell, value, columnDef, dataContext) {//L
            return dataContext instanceof Slick.Group ? '<div  class="slick-group-toggle">' + dataContext.rows[0].ProductoDescripcion + '</div>' : dataContext.ProductoDescripcion; //+ '<span class="xs-btn-asset-class">' + a.ProductoDescripcion + "</span>"
        }

        function formatter_Moneda_descripcion(row, cell, value, columnDef, dataContext) {
            return dataContext instanceof Slick.Group ? '<div  class="slick-group-toggle">' + dataContext.rows[0].MonedaDescripcion + '</div>' : dataContext.MonedaDescripcion; //+ '<span class="xs-btn-asset-class">' + a.ProductoDescripcion + "</span>"

        }

        function formatter_plazo_descripcion(row, cell, value, columnDef, dataContext) {
            return dataContext instanceof Slick.Group ? '<div  class="slick-group-toggle">' + dataContext.rows[0].PlazoDescripcion + '</div>' : dataContext.PlazoDescripcion; //+ '<span class="xs-btn-asset-class">' + a.ProductoDescripcion + "</span>"
        }

        function _formatter_group(dataContext) {
            return '<div  class="slick-group-toggle">******' + '--' + '</div>';

        }
        function _formatter_date(row, cell, value, columnDef, dataContext) {//p

            var date, new_date_from_utc, new_date;
            if (dataContext instanceof Slick.Group) {
                date = new Date(dataContext.rows[0].FechaConcertacion);
                new_date_from_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
                new_date = new Date(new_date_from_utc);
                new_date = FormatDateTimeUtils.formatFullDate(new_date, '</span> <span class="oh-date-hours slick-group-toggle" style="display: flex;justify-content: left;">');

                return '<div  class="slick-group-toggle"><span class="oh-date slick-group-toggle"><span class="oh-date-year slick-group-toggle" style="display: flex;justify-content: left;height:19px">' + new_date + '</span></span></div>';

                //'<span class="oh-date"><span class="oh-date-year">' + s.formatDate(H, DateTimeFormat.ANGULAR.SHORT_DATE_DASH, !0) + '</span><span class="oh-date-hours">' + s.formatDate(H, DateTimeFormat.ANGULAR.LONG_TIME_23H, !0) + "</span></span>")

            } else {
                date = new Date(dataContext.FechaConcertacion);
                new_date_from_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
                new_date = new Date(new_date_from_utc);
                new_date = FormatDateTimeUtils.formatFullDate(new_date, '</span> <span class="oh-date-hours slick-group-toggle" style="display: flex;justify-content: left;">');

                return '<div  class=""><span class="oh-date"><span class="oh-date-year " style="display: flex;justify-content: left;height:19px">' + new_date + '</span></span></div>';
                //return "---";
            }
        }

        function formatter_estado(row, cell, value, columnDef, dataContext) {
            var texto = "";
            var color;

            var estado = dataContext.IdEstado;
            var estados = ["Ingresada", "Cancelada", "Expirada", "Confirmada", "Aplicada", "Aplicada Parcial", "Rechazo Envio Mercado", "En Mercado", "Bloqueada"];
            var colores = ["#CCCCCC", "#AA0433", "#9900FF", "#B76B24", "#082D8C", "#3366FF", "#E0AFAF", "#55916B", "#F7DC6F"];

            texto = estados[estado - 1];
            color = colores[estado - 1];

            return '<div  class="" style="color:' + color + '">' + texto + '</div>';

        }

        function formatter_price(row, cell, value, columnDef, dataContext) {//a
            if (dataContext instanceof Slick.Group) {
                return '<div  class="slick-group-toggle">' + dataContext.rows[0].Precio + "</div>";
            } else {
                return FormatUtils.formatThousandSeparator(dataContext.Precio);
            }
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
            return t instanceof Slick.Group ? '<div  class="slick-group-toggle"">' + formatter_profit_Group(t.totals, l) + "</div>" : formatter_profit_noGroup(o)
        }
        function formatter_profit_noGroup(e) {//x
            return null != e ? e >= 0 ? '<span class="slickgrid-sum-total-positive" ">' + FormatUtils.formatMoney(e) + " %</span>" : '<span class="slickgrid-sum-total-negative" ">' + FormatUtils.formatMoney(e) + " %</span>" : ""
        }
        function formatter_profit_Group(e, s) {//U
            var o = e.sum && e.sum[s.field];
            return null != o ? o >= 0 ? '<span class="slickgrid-sum-total-positive slick-group-toggle">' + FormatUtils.formatMoney(Math.round(100 * parseFloat(o)) / 100) + " %</span>" : '<span class="slickgrid-sum-total-negative slick-group-toggle">' + FormatUtils.formatMoney(Math.round(100 * parseFloat(o)) / 100) + " %</span>" : ""
        }
        function unregisterDatagrid() {//G
            n.unregisterDatagrid(ModulesType.HISTORY);
            t.setModuleValueRemoveHandler(ModulesType.HISTORY, "datagridColumns", setProfitMode);
            n.unsubscribeRefreshColumnFromSettingsEvent(refreshColumns);
            if (_xDataGridView)
                _xDataGridView.dispose();

            _xDataGridView = null;
        }
        function update_grid() {//B
            _xDataGridView && _xDataGridView.getGridView() && _xDataGridView.updateSize()
        }
        function _viewportScrollY() {//Y
            // scope.closePartPopup.visible && (scope.closePartPopup.visible = false),
            //     scope.closeAllVisible && (scope.closeAllVisible = false)
        }
        function _moveRowCallback(e, s) {//X
            //  g.itemDragAndDrop(e, s)
        }
        function _headerButtonClickCallback(e, s) {//q
            "tradeTypeFilter" == s && n.showColumnFilterPopup(ModulesType.HISTORY, e, ce)
        }
        function _headerClickCallback(s, o) { //H
            var column_id = o.column.id;
            if ("close" === column_id && "slick-column-name" === s.originalEvent.target.className) {
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
                    i.eventClick(ModulesType.HISTORY, "openTradesModule", "ordersCloseTradeBtn");
                var temp_item = o.grid.getDataItem(o.row)//l
                    , t = SymbolKeyUtils.getAssetClassFromKey(l.groupingKey);
                if (t == AssetClass.STC)
                    if (l.volumesData && 0 == l.volumesData.closeableVolume)
                        u.showPopupCannotOpenPartialClose();
                    else {
                        l.rows.length > 0 ? l.rows[0].symbol : "";
                        u.closeTradeSTC(l.groupingKey, l.totals.sum)
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
                        scope.closeAllVisible = true,
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
            u.closeTrade(s.grid.getDataItem(s.row));
        
        }
        function doubleUpTradeBtn_click(e, s) {//z
            a.logClick("openTradesModule", "doubleUpTradeBtn"),
                i.eventClick(ModulesType.HISTORY, "openTradesModule", "doubleUpTradeBtn"),
                u.doubleUpTrade(s.grid.getDataItem(s.row))
        }
        function reverseTradeBtn_click(e, s) {//Z

            u.reverseTrade(s.grid.getDataItem(s.row))
        }
        function J(e, s) {
            var o = s.grid.getDataItem(s.row)
                , l = o instanceof Slick.Group;
            if (!l) {
                if (!e.originalEvent.target.dataset || o.$deleting)
                    return;

            }
        }
        function close_handle(e, s) {
            var temp_item = s.grid.getDataItem(s.row)
            var isGroup = temp_item instanceof Slick.Group;
            if (isGroup)
                manjear_close(e, s);
            else {
                if (!e.originalEvent.target.dataset)
                    return;

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
                        addPopup(e, s, e.originalEvent.target.dataset.positionid) //W
                }
        
            }
        }


        function _clickCallback(e, s) {//le
            var o = s.grid.getColumns()[s.cell].id;

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
                    J(e, s)
            }
        }
        function _dblClickCallback(e, s) {//te
            var o = s.grid.getColumns()[s.cell].id
                , l = s.grid.getDataItem(s.row);
        }
        function _showProfitMenu(e) {//ae
            var s = e.pageX - $(e.currentTarget).offset().left
                , o = _xDataGridView.getGridView().getCellFromPoint(s, 0)
                , l = _xDataGridView.getGridView().getColumns()[o.cell].id;
            return "profit" == l
        }




        function _contextMenuCallback(e, s, o, event) {//ie

            event.preventDefault();
            var cell = _xDataGridView.getGridView().getCellFromEvent(event);

            if (cell) {
                var item_cell = _xDataGridView.getDataModel().getItem(cell.row);

                $("#historyCtxMenu .dropdown-menu").css("display", "block");

                $("#historyCtxMenu .dropdown-menu").data("item", item_cell);

                $("#historyCtxMenu")
                    .data("row", cell.row)
                    .css("top", event.pageY)
                    .css("left", event.pageX)
                    .show();

                $("body").one("click", function () {
                    $("#historyCtxMenu").hide();
                });

            }

        }
        function _initControls() {
            $filterPanel = element.find("#filterPanel");
            $date_range_picker = $filterPanel.find("div[date-range-picker]");

            $mae_multiselect_combobox_state = $filterPanel.find("div[mae-multiselect-combobox-state]");
            $mae_multiselect_combobox_symbol = $filterPanel.find("div[mae-multiselect-combobox-symbol]");

            _maeDateRangePicker = new maeDateRangePicker(scope);
            _maeMultiselectComboboxState = new maeMultiselectCombobox(scope, $mae_multiselect_combobox_state);
            _maeMultiselectComboboxSymbol = new maeMultiselectCombobox(scope, $mae_multiselect_combobox_symbol);
            $date_range_picker.append(_maeDateRangePicker.getHtml());

            $mae_multiselect_combobox_state.append(_maeMultiselectComboboxState.getHtml());
            $mae_multiselect_combobox_symbol.append(_maeMultiselectComboboxSymbol.getHtml());



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
            var s = function (s, o) {
                var l = _xDataGridView.getDefaultCompareByFieldFunction();
                var t = l(s, o, e.sortCol.field, e.sortAsc, e.sortCol.type);
                if (0 == t) {
                    var a = _xDataGridView.getBasicCompareByFieldFunction();
                    t = a(s, o, "positionId");
                    t = e.sortAsc ? t : -t
                }
                return t
            };
            _xDataGridView.setSortCompareFunction(s);
            n.setSortData(ModulesType.HISTORY, e.sortCol, e.sortAsc);
        }
        function _loadSelectedRowsAfterUpdate() {//ce
            _xDataGridView.loadSelectedRowsAfterUpdate()
        }
        function setProfitMode() {//de
            scope.showProfitInPips ? scope.setProfitMode(0) : scope.setProfitMode(1)
        }
        function show_popup(s) { //pe
            if (!scope.closePartPopup.visible || scope.closePartPopup.row != ke) {
                scope.closePartPopup.position.pageX = scope.closePartPopup.newPosition.pageX,
                    scope.closePartPopup.position.pageY = scope.closePartPopup.newPosition.pageY;
                var o = _xDataGridView.getData(scope.closePartPopup.row);
                scope.closePartPopup.value = o.volume,
                    o.volumesData && (scope.closePartPopup.value = o.volumesData.closeableVolume),
                    scope.modifiedTrade = scope.modifiedItem,
                    scope.closeAllVisible = false,
                    scope.closeAll.openTrades && scope.closeAll.openTrades.rows && scope.closeAll.openTrades.rows.length > 0 && _xDataGridView.updateItems([scope.closeAll.openTrades.rows[0]], 0),
                    o instanceof Slick.Group ? o.volumesData && 0 == o.volumesData.closeableVolume ? u.showPopupCannotOpenPartialClose() : s ? u.openModifyTradeSTCPopup(o) : scope.closePartPopup.visible = true : scope.closePartPopup.visible = true,
                    setTimeout(function () { }, 0, true)
            }
        }
        function closePartPopup_visible() {//ue
            scope.closePartPopup.visible === true && (scope.closePartPopup.visible = false)
        }
        function close() {//ge
            if (scope.closeAll.openTrades) {
                for (var i_row = 0; i_row < scope.closeAll.openTrades.length; i_row++) {
                    u.reverseTrade(scope.closeAll.openTrades[i_row]);
                }


                _xDataGridView.updateItems(scope.closeAll.openTrades, 0);
                // var e = scope.closeAll.isGroup ? scope.closeAll.openTrades.rows[0] : scope.closeAll.openTrades[0];
                // e && _xDataGridView.updateItems([e], 0)
            }
        }
        var moduleWrapper /*me*/, _xDataGridView/*Te*/, _moduleIsReadyFlag = false/*fe*/, _moduleActivatedFirstTime = false/*ye*/, _initSubcription = false/*Ce*/, _items = []/*Se*/, _onInitEjecutado = false;//Ee
        scope.showProfitInPips = false;
        var Pe, _columns, _proxy /*be*/, ve, Oe = {};
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
        r.subscribeModuleAction(ModulesType.HISTORY, _moduleAction, "openTradesModule");
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
                s.nameKey = "HISTORY.PROFIT_PIPS",
                scope.showProfitInPips = true) : (s.field = "profit",
                    s.nameKey = "HISTORY.PROFIT",
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
                })
        };

        scope.personalizeTable = function () {
            n.showPersonalizationWindow(ModulesType.HISTORY, _xDataGridView.getGridView(), Pe, Te)
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
            scope.closeAllVisible = true;
            close();
        };

        scope.closeAllWinners = function () {

            if (scope.closeAll.openTrades) {
                var winners = _.filter(scope.closeAll.openTrades, function (ite) {
                    return ite.netProfitPercent > 0;
                });

                for (var i_row = 0; i_row < winners.length; i_row++) {
                    u.reverseTrade(winners[i_row]);
                }


                _xDataGridView.updateItems(scope.closeAll.openTrades, 0);
                // var e = scope.closeAll.isGroup ? scope.closeAll.openTrades.rows[0] : scope.closeAll.openTrades[0];
                // e && _xDataGridView.updateItems([e], 0)
            }

        }

        scope.search = function (pageinfo) {
            // this._scopeParent.fromDate = e,
            //     this._scopeParent.toDate = i,
            //     this._scopeParent.chosenRange = a;
            MAE.HistoryService.search({
                fromDate: this.fromDate,
                toDate: this.toDate,
                chosenRange: this.chosenRange,
                pageInfo: pageinfo || {}
            });
        }

        scope.closeAllLosers = function () {

            if (scope.closeAll.openTrades) {
                var winners = _.filter(scope.closeAll.openTrades, function (ite) {
                    return ite.netProfitPercent < 0;
                });

                for (var i_row = 0; i_row < winners.length; i_row++) {
                    u.reverseTrade(winners[i_row]);
                }
                _xDataGridView.updateItems(scope.closeAll.openTrades, 0);

            }

        }

        jq(document).on("click", function () {
            // if (scope.closeAllVisible)
            //     scope.closeAllVisible = false;
            if (_moduleActivatedFirstTime) {
                if (scope.innerCloseHandle)
                    scope.innerCloseHandle();
            }


        });

        // jq(document).on("click", ".slickgrid-cell-align-center.btn", function (e) {
        //    // scope._openTradesCloseAll.close();
        //     e.stopPropagation();
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

                }

            }
        });


        var _fromDate;
        var signal_PropertyChange = new signals.Signal;
        scope.addHandlePropertyChange = function (func) {
            signal_PropertyChange.add(func);
        }

        function onPropertyChange(proName, proValue) {
            signal_PropertyChange.dispatch({ name: proName, value: proValue });

        }

        if (!("fromDate" in scope)) {
            Object.defineProperty(scope, 'fromDate', {
                get: function () {
                    return _fromDate;
                },
                set: function (value) {
                    _fromDate = value;

                    onPropertyChange("fromDate", value);
                }
            });
        }


        var _toDate;
        if (!("toDate" in scope)) {
            Object.defineProperty(scope, 'toDate', {
                get: function () {
                    return _toDate;
                },
                set: function (value) {
                    _toDate = value;
                    onPropertyChange("toDate", value);
                }
            });
        }


        var _dropdownPosition;
        if (!("dropdownPosition" in scope)) {
            Object.defineProperty(scope, 'dropdownPosition', {
                get: function () {
                    return _dropdownPosition;
                },
                set: function (value) {
                    _dropdownPosition = value;
                    onPropertyChange("dropdownPosition", value);
                }
            });
        }


        var _parentSelector;
        if (!("parentSelector" in scope)) {
            Object.defineProperty(scope, 'parentSelector', {
                get: function () {
                    return _parentSelector;
                },
                set: function (value) {
                    _parentSelector = value;
                    onPropertyChange("parentSelector", value);
                }
            });
        }


        var _availableRanges;
        if (!("availableRanges" in scope)) {
            Object.defineProperty(scope, 'availableRanges', {
                get: function () {
                    return scope._availableRanges;
                },
                set: function (value) {
                    _availableRanges = value;
                    onPropertyChange("availableRanges", value);
                }
            });
        }


        var _maxDate;
        if (!("maxDate" in scope)) {
            Object.defineProperty(scope, 'maxDate', {
                get: function () {
                    return scope._maxDate;
                },
                set: function (value) {
                    _maxDate = value;
                    onPropertyChange("maxDate", value);
                }
            });
        }


        var _fullRange;
        if (!("fullRange" in scope)) {
            Object.defineProperty(scope, 'fullRange', {
                get: function () {
                    return _fullRange;
                },
                set: function (value) {
                    _fullRange = value;
                    onPropertyChange("fullRange", value);
                }
            });
        }


        var _chosenRange;
        if (!("chosenRange" in scope)) {
            Object.defineProperty(scope, 'chosenRange', {
                get: function () {
                    return _chosenRange;
                },
                set: function (value) {
                    _chosenRange = value;
                    onPropertyChange("chosenRange", value);
                }
            });
        }

        scope.onIsFilteredChange = function (val) {

            if (val) {
                element.find("#noDataOrdersHistory").show();
                element.find("#no_results").hide();
                element.find("#no_results_for_selected_filters").show();
            }
            else {
                //element.find("#no_results").show();      
                element.find("#noDataOrdersHistory").hide();
                element.find("#no_results_for_selected_filters").hide();
            }
        }

        var _isFiltered = false;
        if (!("isFiltered" in scope))
            Object.defineProperty(scope, 'isFiltered', {
                configurable: true,
                get: function () {
                    return _isFiltered;
                },
                set: function (value) {
                    _isFiltered = value;
                    if (scope.onIsFilteredChange)
                        scope.onIsFilteredChange(value);
                }
            });

        scope.formatSymbolRow = function (e, t) {
            return !t && e ? formatter_row_list(e) : e.ProductoDescripcion
        }

        function formatter_row_list(e) {
            return '<span class="ht-symbol">' + e.ProductoDescripcion + '</span>';// '<span class="xs-btn-asset-class">' + e.key + '</span><span class="ht-symbol-desc symbol-desc">' + e.symbol.description + "</span></span>"
        }



        scope.selectedOrderStatusTypes = [];
        scope.availableOrderStatusTypes = [];
        scope.selectedOrderSymbols = [];
        scope.availableOrderSymbols = [];//productosGlobal;

        this.items_back = [];
        var Estados_data = [];
        var CodigoProductos_data = [];
        scope.selectedOrderStatusTypesFilterChangedHandler = function (data) {
            Estados_data = data;
            _xDataGridView.getDataModel().setFilterArgs({
                IdEstados: Estados_data,
                CodigoProductos: CodigoProductos_data
            });
            _xDataGridView.getDataModel().setFilter(filtroGlobal);
            _xDataGridView.getDataModel().refresh();

            scope.isFiltered = _items.length == 0;
        };

        scope.selectedOrderSymbolsFilterChangedHandler = function (data) {
            CodigoProductos_data = data;
            _xDataGridView.getDataModel().setFilterArgs({
                IdEstados: Estados_data,
                CodigoProductos: CodigoProductos_data
            });
            _xDataGridView.getDataModel().setFilter(filtroGlobal);
            _xDataGridView.getDataModel().refresh();

            scope.isFiltered = _items.length == 0;
        };


        scope._openTradesCloseAll = new openTradesCloseAll(scope);
        element.find("div[open-trades-close-all]").append(scope._openTradesCloseAll.getHtml());

        scope.isFiltered = true;


        function onChangeList(data) {

            scope.availableOrderSymbols = _.uniqBy(_items, function (obj) {
                return obj.CodigoProducto;
            });
            scope.availableOrderStatusTypes = _.uniqBy(_items, function (obj) {
                return obj.IdEstado;
            });

            _maeMultiselectComboboxState.invalidate();
            _maeMultiselectComboboxSymbol.invalidate();


            scope.isFiltered = _items.length == 0;

            _pagerGrid.setData({
                pageSize: data.pageSize,
                pageNum: data.pageNum,
                totalPages: data.totalPages,
                totalRows: data.totalRows
            });



        }

        function updateFilter() {

        }

        function filtroGlobal(item, args) {

            if (args.IdEstados && args.IdEstados.length > 0 && !args.IdEstados.find(function (el) { return el.IdEstado == item.IdEstado })) {
                return false;
            }
            if (args.CodigoProductos && args.CodigoProductos.length > 0 && !args.CodigoProductos.find(function (el) { return el.CodigoProducto == item.CodigoProducto })) {
                return false;
            }
            return true;
        }

        _setTextResult();
        _initControls();
        initMenu();

        scope.closeDetalle =  function ()
        {
            var _grid = _xDataGridView.getGridView();
            _grid.hideNgLineRenderer();

        }
        var self = this;
        function Apply (func, item)
        {
           // return func.bind(self)(item);
        }

        scope.Apply = function(formatter, item)
        {
            // var cuerpo = " return " + formatter + "(null, null, null, item);";

            
            // var func = new Function("item",cuerpo);
            func = eval(formatter);

            return func(undefined,undefined,undefined,undefined,item);
        }
        function initMenu() {
            var _popupsBitacora = new popupsBitacora("popupsBitacoraTemplate");
            //color: #e3e3e3;margin-right: 9px;margin-left: -9px;" class="far fa-bell
            var menuItems = [{
                text: "HISTORY.BITACORA", //Bitacora Orden
                classList: "far fa-bell",
                style: "color: #e3e3e3;margin-right: 9px;margin-left: 6px;",
                onClick: function (e) {
                    var temp_item = $("#historyCtxMenu .dropdown-menu").data("item");
                    if (temp_item) {
    
                        _popupsBitacora.setItem(temp_item);
                        _popupsBitacora.show();
                       
                    }
    
                }
            }];
            var cont = $("#historyCtxMenu .dropdown-menu");
    
    
            cont.html("");
            for (var i = 0; i < menuItems.length; i++)
                cont.append(armarItemMenu(menuItems[i]));
    
        }
    };

    function _render(id) {

        var template = jq("#historyTemplate").html();

        element.append($(template));

    };

    function _toggleGridView() {

    };

    function _focusGrid() {

    };

    function armarItemMenu(itemMenu) {

        //var $temp = '<li><a class="pointer" role="menuitem" tabindex="1"><span style="color: #e3e3e3;margin-right: 9px;margin-left: -9px;" class="far fa-bell"></span>Bitacora Orden</a></li>'
        var $temp = $('<li><a class="pointer" role="menuitem" tabindex="1" ><span style="' + itemMenu.style + '" class="' + itemMenu.classList + '"></span>' + MAE.I18nService.getString(itemMenu.text) + '</a></li>')

        $temp.find("a").on("click", function (e) {
            itemMenu.onClick(e);

        });

        return $temp;

    }


    jq.extend(true, window, {
        MAE: {
            HistoryModule:
            {
                link: _link,
                isLoad: _isLoad,
                toggleGridView: _toggleGridView,
                focusGrid: _focusGrid
            }
        }
    });
})(jQuery);