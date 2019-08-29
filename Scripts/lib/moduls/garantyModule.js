(function (jq) {

    var r = MAE.LayoutService;
    var l = MAE.SessionApiService;
    var d = MAE.I18nService;
    var n = MAE.DatagridService;
    var t = MAE.SettingsService;
    var u = MAE.GarantyService;

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
                    i.trackPageView(ModulesType.GARANTY)
            }
        }
        function module_added() {//y
            moduleWrapper = element.closest(".xs-module-wrapper")
        }
        function module_removed() {//C
            r.unsubscribeModuleAction(ModulesType.GARANTY, _moduleAction);
            u.removeSubscriptions(onInit);
            unregisterDatagrid();
  
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
                r.moduleIsReady(ModulesType.GARANTY)
            }
        }

        function setItemRun(item, val) {
            _items.filter(function (ite) {
                return ite.id === item.id;
            })[0].isRun = val;
        }

        function onInit(e, data, o) {//v
            var l, t, a, i;
            var current_item;
            switch (e) {
                case DataEvent.EXIST:

                case DataEvent.ITEM_LIST:
                    _.forEach(data, function (ite_for) {
                        if (_items.find(function (t) {
                            return t.id == ite_for.id;
                        }) === undefined) {
                            _items.push(ite_for);
                        }
                    });
                    _xDataGridView.updateItems(data, 100);
                    _moduleIsReady();
                    break;

                case DataEvent.NEW:

                    _.forEach(data, function (ite_for) {
                        if (_items.find(function (t) {
                            return t.id == ite_for.id;
                        }) === undefined) {
                            ite_for.isNew = true;
                            ite_for.isRun = false;

                            _items.push(ite_for);

                            current_item = ite_for;
                        }
                    });
                    
 
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
                    _moduleIsReady();
                    break;
                case DataEvent.UPDATED:
                    _moduleActivatedFirstTime ? _xDataGridView.updateItems(data, 100) : _onInitEjecutado = true;
                    break;
                case DataEvent.REMOVED:
                    for (l = 0, t = data.length; l < t; l++) {
                        a = data[l];
                        i = _items.indexOf(a);
                        i > -1 && _items.splice(i, 1);

                    }

                    _moduleActivatedFirstTime ? _xDataGridView.updateItems(data, 100) : _onInitEjecutado = true;
                    break;
                case DataEvent.NO_DATA:
                    _moduleIsReady();
            }
        }

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
                    return TradeUtils.getTradeTypeTranslatedLabel(d, a.side, a.tradeType)
            }
        };

        function formatter_nominalValue(e, t, r, i, a) {
            if (a instanceof Slick.Group) {
                var s = a.rows[0].assetClass;
                return s === AssetClass.STC ? Slick.Formatters.Margin(e, t, r, i, a) : '<span class="slickgrid-sum-total  slick-group-toggle">-</span>'
            }
            return a.assetClass === AssetClass.STC ? Slick.Formatters.Margin(e, t, r, i, a) : "-"
        };
        function armar_columnas() {//K
            Pe = [{
                id: "receptor",
                name: "",
                nameKey: "GARANTY.receptor",
                field: "receptor",
                sortable: !0,
                //formatter: //Slick.Formatters.GroupRowFirstCell,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "toggleHeaderCellAlignLeft ",
                minWidth: 60,
                xsFirstColumn: !0,
                xsShowAlways: !0,
                xsFrozen: !0,
                type: "string"
            }, {
                id: "dador",
                name: "",
                nameKey: "GARANTY.dador",
                field: "dador",
                sortable: !0,
                //formatter: formatter_symbol,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            },
            {

                id: "moneda",
                name: "",
                nameKey: "GARANTY.moneda",
                field: "moneda",
                sortable: !0,
                //formatter: formatter_symbol_name,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "string"
            },
            {
                id: "montoAsignado",
                name: "",
                nameKey: "GARANTY.montoAsignado",
                field: "montoAsignado",
                sortable: !0,
                formatter: Slick.Formatters.Volume,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "number"
            },
            {
                id: "montoConsumido",
                name: "",
                nameKey: "GARANTY.montoConsumido",
                field: "montoConsumido",
                sortable: !0,
                formatter: Slick.Formatters.Volume,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "number"
            },
            {
                id: "fichas",
                name: "",
                nameKey: "GARANTY.fichas",
                field: "fichas",
                sortable: !0,
                //formatter: formatter_type,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "string"
            }, {
                id: "disponible",
                name: "",
                nameKey: "GARANTY.disponible",
                i18nService: MAE.I18nService, //traductor
                field: "disponible",
                sortable: !0,
                formatter: Slick.Formatters.Volume,
                cssClass: "slickgrid-cell-align-center ot-collapse",
                headerCssClass: "slickgrid-cell-align-center",
                type: "number"
            }, 
             {
                id: "clearingHouse",
                name: "",
                nameKey: "GARANTY.clearingHouse",
                field: "clearingHouse",
                sortable: !0,
                //formatter: Slick.Formatters.Volume,
                cssClass: "slickgrid-cell-align-center  ot-collapse",
                headerCssClass: "slickgrid-cell-align-center ",
                type: "string"
            }];
            _columns = Pe.map(function (e) {
                return jQuery.extend({}, e)
            });
            traducir();
            _proxy = {
                rowHeight: 30,
                allowAutoTooltip: true,
                allowOnlyOneSelection: true
                // viewportScrollY: _viewportScrollY,//Y
                // moveRowCallback: _moveRowCallback,//X
                // headerButtonClickCallback: _headerButtonClickCallback, //q
                // sortCallback: _sortCallback, //ne
                // headerClickCallback: _headerClickCallback,//H
                // contextMenuCallback: _contextMenuCallback, //ie
                // headerContextMenuCallback: _headerContextMenuCallback,//re
                // clickCallback: _clickCallback,//le
                // dblClickCallback: _dblClickCallback //te
            };
            var e = n.getSortData(ModulesType.GARANTY);

            if (e && e.id) {
                e.type = n.getTypeField(Pe, e.id);
            }

            _proxy.sortParams = e;
           
            var a = new Slick.Data.GroupItemMetadataProvider;
            var provider = {//i
                groupItemMetadataProvider: a,
                inlineFilters: false,
                sortGroups: true,
                grouping: true,
                emptyTotalAsLast: true
            };
            n.getColumnsFromSettings(ModulesType.GARANTY, _columns);
            _xDataGridView = new XDataGridView(element.find("#garantyGrid"));

            //columns, proxy, o, n, provider, container
            _xDataGridView.init(_columns, _proxy, _items, "id", provider, undefined/*container*/);

            n.registerDatagrid(ModulesType.GARANTY, _xDataGridView.getGridView(), _columns);



        }
        function _collapseGroup(e) {//D
            if (_xDataGridView.getDataModel()) {
                _xDataGridView.getDataModel().collapseGroup(e);
                _groupsCollapsed[e] = true;
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

        }
        function formatter_close(row, cell, value, columnDef, dataContext)//(e, s, o, l, t) {//N
        {
            var a = "";
            return '<div style="width:70%" class="slick-sub-cell slickgrid-cell-align-center"><span data-xsot="reverseTradeBtn" class="xs-ot-reverse-btn" title="Reverse position"></span></div><div style="width:30%" class="slick-sub-cell slickgrid-cell-align-left"><span data-xsot="ordersCloseTradeBtn" class="xs-ot-close-btn ignore-context-menu"></span></div>'

        }
        function formatter_position(e, s, o, l, t) {//V
            return '<div><span class="ot-position-span" title="' + t.positionId + '">' + o + '</span><span data-xsot="symbolInfo" data-positionid="' + t.positionId + '" class="ot-info-btn" title="' + d.getFrequentString("OPEN_TRADES.POSITION_INFO.TITLE") + '"></span></div>'
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
            n.unregisterDatagrid(ModulesType.GARANTY);
            
            _xDataGridView && _xDataGridView.dispose();
            _xDataGridView = null;
        }
        function update_grid() {//B
            _xDataGridView && _xDataGridView.getGridView() && _xDataGridView.updateSize()
        }


        var ke = null;
        scope.modifiedItem = {};

        scope.expandAllGroups = function () {
            _xDataGridView.expandAllGroups()
        };

        scope.collapseAllGroups = function () {
            _xDataGridView.collapseAllGroups()
        };

        MAE.LayoutService.subscribeModuleAction(ModulesType.GARANTY, _moduleAction, "garantysModule")

        var btn_refresh = element.find("#btn_refresh");
        btn_refresh.on("click", function(){
            btn_refresh.toggleClass("garanty-search");
            MAE.GarantyService.searchGaranty({});
            setTimeout(function(){
                btn_refresh.toggleClass("garanty-search");
            }, 250);

            
        })
    };

    function _render(id) {

        var template = jq("#garantyTemplate").html();

        element.append($(template));

    };

    function _toggleGridView() {

    };

    function _focusGrid() {

    };

    jq.extend(true, window, {
        MAE: {
            GarantyModule:
            {
                link: _link,
                isLoad: _isLoad,
                toggleGridView: _toggleGridView,
                focusGrid: _focusGrid
            }
        }
    });
})(jQuery);