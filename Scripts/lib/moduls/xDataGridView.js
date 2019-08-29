function XDataGridView(e) {
    var t;
    var o;
    var _grid; //n
    var _dataView;//i
    var _columns; //r
    var f_setGroup = false;//l
    var _sortGroupByField = "id";
    var s = false;
    var c = {
        tween: null,
        duration: 500,
        row: 0
    };
    var _proxy = {};//d
    var _proxy_extendido = null;//u
    var _provider = {};//f
    var _configuration = null;//g
    var h = null;
    var objSort;//v
    var timerUpdateID = null;//p
    var m = false;
    function extend() {//C
        _proxy_extendido = $.extend({
            getScrollPosition: function(e) {
                if (!t) {
                    return {}
                }
                return {
                    top: t.getContentPositionY(),
                    left: t.getContentPositionX()
                }
            },
            getScrollDimensions: function(e) {
                return {
                    width: ScrollDimensions.WIDTH,
                    height: ScrollDimensions.HEIGHT
                }
            },
            setScrollLeft: function(e, o) {
                if (t) {
                    t.scrollByX(o)
                } else {
                    e.scrollLeft(o)
                }
            },
            setScrollTop: function(e, o) {
                if (t) {
                    setTimeout(function() {
                        t.scrollToY(o)
                    }, 0)
                } else {
                    e.scrollTop(o)
                }
            }
        }, {
            enableCellNavigation: true,
            enableColumnReorder: true,
            forceFitColumns: true,
            forceFitColumnsMinWidth: 101,
            fullWidthRows: true,
            rowHeight: 25,
            noScrollBarRightPadding: 9,
            moveOneRowOnly: true,
            disableKeyHandle: true,
            deselectOnClick: true,
            useTranslate3d: true,
            disableCellKeyHandle: true
        });
        if (_proxy) {
            for (var e in _proxy) {
                _proxy_extendido[e] = _proxy[e];
            }
        }
    }
    function intercambiarPropiedades() {//w
        if (Object.keys(_provider).length === 0) {
            return
        }
        _configuration = {};
        if (_provider) {
            for (var e in _provider) {
                switch (e) {
                case "groupItemMetadataProviderOnData":
                _configuration.groupItemMetadataProvider = _provider[e];
                    break;
                case "grouping":
                    {
                        f_setGroup = Boolean(_provider[e]);
                        break
                    }
                default:
                    {
                        _configuration[e] = _provider[e];
                        break
                    }
                }
            }
        }
    }
    function R(e, t) {
        return _proxy_extendido.sortCompareFunction(e, t, objSort)//v
    }
    function compareByFieldFunction(e, t, o, n, i) {//S
        var r = o || (objSort ? objSort.sortCol.field : null);
        var l = objSort ? objSort.sortAsc : null;
        var a = i || (objSort ? objSort.sortCol.type : null);
        var s;

        if (typeof n === "boolean") {
            l = n
        }
        if (r && typeof l === "boolean" && (a === "number" || a === "string")) {
            var c = l;
            var d = e[r];
            var u = t[r];
            if (a === "number") {
                if (d === undefined || d === null || isNaN(d)) {
                    d = ""
                }
                if (u === undefined || u === null || isNaN(u)) {
                    u = ""
                }
            } else if (a === "string") {
                if (d === undefined || d === null) {
                    d = ""
                } else {
                    d = String(d).toUpperCase().trim()
                }
                if (u === undefined || u === null) {
                    u = ""
                } else {
                    u = String(u).toUpperCase().trim()
                }
            }
            if (d > u) {
                s = 1
            } else if (d < u) {
                s = -1
            } else {
                s = b(e, t)
            }
            s = c ? s : -s;
            if (d === "" && u !== "") {
                s = 1
            } else if (d !== "" && u === "") {
                s = -1
            } else if (d === "" && u === "") {
                s = 0
            }
            return s
        } else {
            s = b(e, t, r);
            if (s !== 0) {
                s = l ? s : -s
            }
            return s
        }
    }
    function b(e, t, o) {
        var n = _sortGroupByField;
        if (o) {
            n = o
        }
        var i = _getBasicCompareByFieldFunction();
        return i(e, t, n)
    }
    function ordenar() {//y
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("sortCompareFunction")) {
            return R
        }
        if (objSort || _proxy_extendido && _proxy_extendido.sortParams) {
            return S
        }
        return b
    }
    function k() {
        var e = [];
        var t = _grid.getSelectedRows();
        for (var o = 0; o < t.length; o++) {
            var i = _grid.getDataItem(t[o]);
            e.push(i)
        }
        return e
    }
    function onRowCountChanged(e, o) {//D
        if (_proxy_extendido && _proxy_extendido.gridAdvancedEnabled) {
            _grid.invalidateRowHeight()
        }
        _grid.updateRowCount();
        _grid.render();
        if (t) {
            t.reinitialise()
        }
    }
    function onRowsChanged(e, t) {//E
        _grid.invalidateRowsData(t.rows);
        _grid.render()
    }
    function onSelectedRowsChanged(e, t) {//I
        if (_proxy_extendido && _proxy_extendido.allowOnlyOneSelection) {
            var o = t.rows;
            if (o.length > 1) {
                _grid.resetActiveCell();
                _grid.setSelectedRows([o[o.length - 1]])
            }
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("selectedRowsChangedCallback")) {
            _proxy_extendido.selectedRowsChangedCallback(k())
        }
    }
    function onColumnsResized(e, t) {//T
        var o = _grid.getSelectedRows();
        if (o.length > 0) {
            _grid.resetActiveCell();
            _grid.setSelectedRows(o)
        }
        e.stopPropagation()
    }
    function onColumnsSet(e, t) {//x
        _updateSize()
    }
    function onScroll(e, t) {//M
        if (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection) {
            _dataView.updateGridSelection(_grid, true)
        }
    }
    function onSort(e, t) {//P
        objSort = t;
        if (_proxy_extendido && _proxy_extendido.sortCallback && typeof _proxy_extendido.sortCallback === "function") {
            _proxy_extendido.sortCallback(objSort)
        }
        F_sort();
        if (_proxy_extendido && _proxy_extendido.gridAdvancedEnabled) {
            if (_grid.getGridViewMode() == Slick.GridAdvancedMode.SINGLE_ITEM && _grid.getSingleItemViewMode() != Slick.GridAdvancedItemViewMode.COLLAPSED) {
                _grid.invalidate()
            }
        }
    }
    function onContextMenu(e) {//A
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("contextMenuCallback")) {
            var t = parseInt($(e.target).closest("div.slick-row").attr("row"));
            var o = _grid.getDataItem(t);
            var i = [];
            if (_proxy_extendido && _proxy_extendido.allowOnlyOneSelection) {
                _grid.setSelectedRows([t]);
                i.push(o)
            } else {
                var r = _grid.getSelectedRows().slice();
                if (r.indexOf(t) < 0) {
                    r.push(t)
                }
                _grid.resetActiveCell();
                _grid.setSelectedRows(r);
                var l;
                for (var a = 0; a < r.length; a++) {
                    l = _grid.getDataItem(r[a]);
                    if (l) {
                        i.push(l)
                    }
                }
            }
            _proxy_extendido.contextMenuCallback(o, i, t, e);
        }
    }
    function onHeaderContextMenu(e) {//N
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerContextMenuCallback")) {
            _proxy_extendido.headerContextMenuCallback(e)
        }
    }
    function subscribeAll() {//H
        _dataView.onRowCountChanged.subscribe(onRowCountChanged);
        _dataView.onRowsChanged.subscribe(onRowsChanged);
        _grid.onSort.subscribe(onSort);
        var e = false;
        if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection) && !_proxy_extendido.hasOwnProperty("checkboxSelectorPlugin")) {
            _grid.onScroll.subscribe(onScroll);
            e = true
        }
        if (_proxy_extendido && _proxy_extendido.allowOnlyOneSelection || _proxy_extendido.hasOwnProperty("selectedRowsChangedCallback")) {
            _grid.onSelectedRowsChanged.subscribe(onSelectedRowsChanged);
            e = true
        }
        if (e) {
            _grid.onColumnsResized.subscribe(onColumnsResized)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("columnsResizedCallback") && typeof _proxy_extendido.columnsResizedCallback === "function") {
            _grid.onColumnsResized.subscribe(u.columnsResizedCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("columnsReorderedCallback") && typeof _proxy_extendido.columnsReorderedCallback === "function") {
            _grid.onColumnsReordered.subscribe(_proxy_extendido.columnsReorderedCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("contextMenuCallback")) {
            _grid.onContextMenu.subscribe(onContextMenu)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerContextMenuCallback")) {
            _grid.onHeaderContextMenu.subscribe(onHeaderContextMenu)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("clickCallback") && typeof _proxy_extendido.clickCallback === "function") {
            _grid.onClick.subscribe(_proxy_extendido.clickCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("dblClickCallback") && typeof _proxy_extendido.dblClickCallback === "function") {
            _grid.onDblClick.subscribe(_proxy_extendido.dblClickCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerClickCallback") && typeof _proxy_extendido.headerClickCallback === "function") {
            _grid.onHeaderClick.subscribe(_proxy_extendido.headerClickCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("columnsSetCallback") && typeof _proxy_extendido.columnsSetCallback === "function") {
            _grid.onColumnsSet.subscribe(_proxy_extendido.columnsSetCallback)
        }
        _grid.onColumnsSet.subscribe(onColumnsSet)
    }
    function _unsubscribeAll() {//L
        _dataView.onRowCountChanged.unsubscribe(onRowCountChanged);
        _dataView.onRowsChanged.unsubscribe(onRowsChanged);
        _grid.onSort.unsubscribe(onSort);
        var e = false;
        if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection) && !_proxy_extendido.hasOwnProperty("checkboxSelectorPlugin")) {
            _grid.onScroll.unsubscribe(onScroll);
            e = true
        }
        if (_proxy_extendido && _proxy_extendido.allowOnlyOneSelection) {
            _grid.onSelectedRowsChanged.unsubscribe(onSelectedRowsChanged);
            e = true
        }
        if (e) {
            _grid.onColumnsResized.unsubscribe(onColumnsResized)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("columnsResizedCallback") && typeof _proxy_extendido.columnsResizedCallback === "function") {
            _grid.onColumnsResized.unsubscribe(_proxy_extendido.columnsResizedCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("columnsReorderedCallback") && typeof _proxy_extendido.columnsReorderedCallback === "function") {
            _grid.onColumnsReordered.unsubscribe(_proxy_extendido.columnsReorderedCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("contextMenuCallback") && typeof _proxy_extendido.contextMenuCallback === "function") {
            _grid.onContextMenu.unsubscribe(onContextMenu)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerContextMenuCallback") && typeof _proxy_extendido.headerContextMenuCallback === "function") {
            _grid.onHeaderContextMenu.unsubscribe(onHeaderContextMenu)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("clickCallback") && typeof _proxy_extendido.clickCallback === "function") {
            _grid.onClick.unsubscribe(_proxy_extendido.clickCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("dblClickCallback") && typeof _proxy_extendido.dblClickCallback === "function") {
            _grid.onDblClick.unsubscribe(_proxy_extendido.dblClickCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerClickCallback") && typeof _proxy_extendido.headerClickCallback === "function") {
            _grid.onHeaderClick.unsubscribe(_proxy_extendido.headerClickCallback)
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("columnsSetCallback") && typeof _proxy_extendido.columnsSetCallback === "function") {
            _grid.onColumnsSet.unsubscribe(_proxy_extendido.columnsSetCallback)
        }
        _grid.onColumnsSet.unsubscribe(onColumnsSet)
    }
    function F_sort() {//F
        if (objSort || _proxy_extendido && _proxy_extendido.sortParams) {
            if (_proxy_extendido.allowSelection) {
                _dataView.saveSelectedRowsBeforeUpdate(n)
            }
            if (f_setGroup && objSort) {
                _dataView.setGroupTotalsSort(objSort.sortCol.field, objSort.sortAsc)
            }
            _dataView.sort(ordenar(), objSort);
            if (_proxy_extendido.allowSelection) {
                _dataView.loadSelectedRowsAfterUpdate(n)
            }
        } else if (m) {
            _dataView.sort(ordenar(), v);
            return
        }
    }
    function crearDataView(e, t) {//_
        if (!_dataView) {
            _dataView = new Slick.Data.DataView(_configuration);
            if(t)
                _dataView.setItems(e, t);
            else
            _dataView.setItems(e);    
        }
    }
    function crearGroup(groupObj) {//W
        o = $(document.createElement("div"));
        o[0].className = "xdata-grid-view-container";
        o.css("opacity", 0);
        o.css("width", "100%");
        o.css("height", "100%");
        e[0].appendChild(o[0]);
        o.on("mouseenter", ye);
        o.on("mouseleave", ke);
        var s = _proxy_extendido && _proxy_extendido.hasOwnProperty("gridAdvancedEnabled") && _proxy_extendido.gridAdvancedEnabled;
        if (s) {
            _grid = new Slick.GridAdvanced(o,_dataView,_columns,_proxy_extendido);
            var c = _proxy_extendido.ngRendererScope;
            if (c) {
                _grid.setNgScope(c);
                _grid.setNgParse(c)
            } else {
                throw "Slick GridAdvanced needs scope to create ngRenderer"
            }
        } else {
            _grid = new Slick.Grid(o,_dataView,_columns,_proxy_extendido)
        }
        var d = o.find("div.slick-viewport");
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("viewportScrollY")) {
            d.bind("jsp-scroll-y", function(e, t, o, n) {
                _proxy_extendido.viewportScrollY()
            })
        }
        var _configuration = {
            showArrows: false
        };
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("blockedScroll")) {
            _configuration.blockedScroll = _proxy_extendido.blockedScroll
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("useTranslate3d")) {
            _configuration.useTranslate3d = _proxy_extendido.useTranslate3d
        }
        d.jScrollPane(_configuration);
        t = d.data("jsp");
        armarEncabezados();
        subscribeAll();
        if (groupObj) {
            _setGrouping(groupObj)
        }
        if (_proxy_extendido && _proxy_extendido.sortParams && _proxy_extendido.sortCompareFunction) {
            if (l) {
                _dataView.setGroupTotalsSort(_proxy_extendido.sortParams.field, _proxy_extendido.sortParams.sortAsc);
                _grid.setSortColumn(_proxy_extendido.sortParams.id, _proxy_extendido.sortParams.sortAsc)
            } else {
                _grid.setSortColumn(_proxy_extendido.sortParams.id, _proxy_extendido.sortParams.sortAsc);
                _dataView.sort(_proxy_extendido.sortCompareFunction, _proxy_extendido.sortParams.sortAsc)
            }
        }
        if (_provider && _provider.hideHeader && _provider.hideHeader == true) {
            e.find(".slick-header-columns").css("height", "0px")
        }
        _updateSize()
    }
    function onCommand(e, t) {//V
        var o = t.column;
        var r = t.command;
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerButtonClickCallback")) {
            if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
                _dataView.saveSelectedRowsBeforeUpdate(_proxy_extendido)
            }
            _proxy_extendido.headerButtonClickCallback(o, r)
        }
    }
    function armarEncabezados() {//O
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("headerButtonClickCallback")) {
            var e = new Slick.Plugins.HeaderButtons;
            e.onCommand.subscribe(onCommand);
            _grid.registerPlugin(e)
        }
        if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
            var t = {};
            if (_proxy_extendido.selectionOptions) {
                for (var o in _proxy_extendido.selectionOptions) {
                    t[o] = _proxy_extendido.selectionOptions[o]
                }
            }
            _grid.setSelectionModel(new Slick.RowSelectionModel(t))
        }
        if (_proxy_extendido && _proxy_extendido.allowAutoTooltip) {
            _grid.registerPlugin(new Slick.AutoTooltips({
                enableForHeaderCells: true,
                enableForCells: false
            }))
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("checkboxSelectorPlugin")) {
            if (_proxy_extendido.checkboxSelectorPlugin instanceof Slick.CheckboxSelectColumn) {
                _grid.registerPlugin(_proxy_extendido.checkboxSelectorPlugin)
            }
        }
        if (_proxy_extendido && _proxy_extendido.hasOwnProperty("moveRowsPlugin")) {
            if (_proxy_extendido.moveRowsPlugin instanceof Slick.RowMoveManager) {
                _grid.registerPlugin(_proxy_extendido.moveRowsPlugin)
            }
        } else if (_proxy_extendido && _proxy_extendido.hasOwnProperty("moveRowCallback")) {
            h = new Slick.RowMoveManager({
                cancelEditOnDrag: true,
                moveOneRowOnly: _proxy_extendido.moveOneRowOnly,
                dragOutsideCallback: _proxy_extendido.dragOutsideCallback
            });
            _grid.registerPlugin(h);
            _grid.onDragInit.subscribe(function(e, t) {
                e.stopImmediatePropagation()
            });
            _grid.onDragStart.subscribe(function(e, t) {
                var o = _grid.getCellFromEvent(e);
                if (!o) {
                    return
                }
                var i;
                t.row = o.row;
                t.item = _grid.getDataItem(t.row);
                t.items = [t.item];
                if (!t.item || t.item instanceof Slick.Group) {
                    return
                }
                if (Slick.GlobalEditorLock.isActive()) {
                    return
                }
                e.stopImmediatePropagation();
                _grid.resetActiveCell();
                if (_proxy_extendido.moveOneRowOnly) {
                    _grid.setSelectedRows([t.row])
                } else {
                    var r = _grid.getDataItems(_grid.getSelectedRows());
                    for (var l = 0, a = r.length; l < a; l++) {
                        i = r[l];
                        if (t.item == i || !i || i instanceof Slick.Group) {
                            continue
                        } else {
                            t.items.push(i)
                        }
                    }
                }
                var s = $("<div class='slick-drag-marker'><span class='slick-drag-marker-label'>" + t.item.symbol + "</span><span class='slick-drag-marker-icon'></span></div>").css("position", "absolute").css("display", "inline-block").css("z-index", 99998).appendTo("body");
                t.helper = s;
                _proxy_extendido.moveRowCallback("ITEM_START_DRAG", {
                    event: e,
                    item: t.item,
                    items: t.items
                });
                return s
            });
            _grid.onDrag.subscribe(function(e, t) {
                t.helper.css({
                    top: e.pageY + 5,
                    left: e.pageX + 5
                })
            });
            _grid.onDragEnd.subscribe(function(e, t) {
                t.helper.remove();
                _proxy_extendido.moveRowCallback("ITEM_DRAG_DROP", {
                    event: e,
                    item: t.item,
                    items: t.items
                });
                _proxy_extendido.moveRowCallback("ITEM_END_DRAG")
            })
        }
        if (_provider && _provider.hasOwnProperty("groupItemMetadataProvider")) {
            _grid.registerPlugin(_provider.groupItemMetadataProvider)
        }
        if (_provider && _provider.hasOwnProperty("disableRowProvider")) {
            _grid.registerPlugin(_provider.disableRowProvider)
        }
    }
    function _init(columns, proxy, items, sortGroupByField, provider, groupObj) {//B
        _columns = columns;
        if (proxy) {
            _proxy = proxy
        }
        a = sortGroupByField;
        if (provider) {
            _provider = provider
        }
        extend();
        intercambiarPropiedades();
        crearDataView(items, sortGroupByField);
        crearGroup(groupObj);
    }
    function _updateSize() {//G
        if (_grid) {
            _grid.resizeCanvas()
        }
        if (t) {
            var e = t.getContentPositionX();
            var r = t.getContentPositionY();
            t.reinitialise();
            if (_grid && e != t.getContentPositionX() || r != t.getContentPositionY()) {
                _grid.resizeCanvas()
            }
        }
        if (!s && o && o[0].clientWidth > 0) {
            s = true;
            _grid.invalidate();
            o.css("opacity", 1)
        }
        if (i && !(_grid instanceof Slick.GridAdvanced)) {
            _updateItems(_dataView.getItems())
        }
        if (f_setGroup && _grid) {
            if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
                _dataView.updateGridSelection(_grid, true)
            }
        }
    }
    function _immediateRefreshView() {//z
        if (_grid) {
            _grid.invalidateAllRows();
            _grid.render();
        }
    }
    function _setItems(e) {//U
        if (_dataView) {
            _dataView.setItems(e);
            if (v || _proxy_extendido && _proxy_extendido.sortParams) {
                F_sort()
            }
            _immediateRefreshView()
        }
    }
    function _updateItems(e, t) {//K
        if (_dataView) {
            _dataView.updateIdxForElements(e);
            if (e && e.length > 0) {
                _dataView.beginUpdate();
                for (var o = 0; o < e.length; o++) {
                    if (_dataView.itemExists(e[o][_sortGroupByField], e[o])) {
                        _dataView.updateItem(e[o][_sortGroupByField], e[o])
                    }
                }
                if (!t) {
                    _endUpdate()
                } else if (timerUpdateID === null) {
                    timerUpdateID = setTimeout(_endUpdate, t)
                }
            } else {
                if (objSort || _proxy_extendido && _proxy_extendido.sortParams) {
                    F_sort()
                } else {
                    _dataView.refresh()
                }
            }
        }
    }
    function _endUpdate() {//j
        clearTimeout(timerUpdateID);
        timerUpdateID = null;
        if (objSort || _proxy_extendido && _proxy_extendido.sortParams) {
            F_sort()
        }
        if (_dataView) {
            _dataView.endUpdate();
            if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
                _dataView.updateGridSelection(_grid, true)
            }
        }
    }
    function _addItems(e) {//X
        if (_dataView) {
            if (e && e.length > 0) {
                _dataView.beginUpdate();
                for (var t = 0; t < e.length; t++) {
                    _dataView.addItem(e[t])
                }
                if (v || _proxy_extendido && _proxy_extendido.sortParams) {
                    F_sort()
                }
                if (_proxy_extendido && _proxy_extendido.gridAdvancedEnabled) {
                    _grid.invalidateRowHeight();
                    _grid.updateRowCount()
                }
                _dataView.endUpdate();
                if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
                    _dataView.updateGridSelection(_grid, true)
                }
            }
        }
    }
    function _removeItems(e) {//q
        if (_dataView) {
            if (e && e.length > 0) {
                _dataView.beginUpdate();
                for (var t = 0; t < e.length; t++) {
                    _dataView.deleteItem(e[t][a])
                }
                _dataView.endUpdate();
                if (_proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
                    _dataView.updateGridSelection(_grid, true)
                }
            }
        }
    }
    function _setGrouping(g_object) {//Y
        if (_dataView) {
            f_setGroup = true;
            _dataView.setGrouping(g_object);
            if (objSort || _proxy_extendido && _proxy_extendido.sortParams) {
                F_sort()
            }
            _immediateRefreshView();
        }
    }
    function _expandCollapseGrouping(e, t) {//Q
        if (f_setGroup && n) {
            if (t) {
                _grid.getData().expandGroup(e)
            } else {
                _grid.getData().collapseGroup(e)
            }
            _immediateRefreshView()
        }
    }
    function _expandAllGroups() {//J
        if (f_setGroup && _dataView) {
            _dataView.expandAllGroups()
        }
    }
    function _collapseAllGroups() {//Z
        if (f_setGroup && _dataView) {
            _dataView.collapseAllGroups()
        }
    }
    function _moveRowOnTop(e) {//ee
        if (_dataView) {
            _dataView.beginUpdate();
            var t = _dataView.getItemById(e);
            if (t) {
                _dataView.deleteItem(e);
                _dataView.insertItem(0, t)
            }
            _dataView.endUpdate();
            if (_proxy_extendido && _proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
                _dataView.updateGridSelection(n, true)
            }
        }
    }
    function _getItemRowIndexByKeyValue(e, t) {//te
        if (!_dataView) {
            return -1
        }
        var o;
        for (var n = 0, r = _dataView.getLength(); n < r; n++) {
            o = _dataView.getItem(n);
            if (o[e] == t) {
                return n
            }
        }
        return -1
    }
    function _getFilteredItems() {//oe
        if (_dataView) {
            return _dataView.getFilteredItems()
        }
        return null
    }
    function _getBasicCompareByFieldFunction() {//ne
        if (_dataView) {
            return _dataView.compareByFieldFunction
        }
        return null
    }
    function _getDefaultCompareByFieldFunction() {//ie
        return compareByFieldFunction
    }
    function _getGridView() {//re
        return _grid;
    }
    function _getData(e) {//le
        if (_grid) {
            if (typeof e == "undefined") {
                return _grid.getData().getItems()
            } else {
                return _grid.getDataItem(e)
            }
        }
        return null
    }
    function _getSelectedRows() {//ae
        if (_grid && _proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
            return _grid.getSelectedRows();
        }
        return null
    }
    function _setSelectedRows(e) {//se
        if (_grid && _proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
            _grid.setSelectedRows(e);
            _grid.render();
        }
    }
    function _setSelectedItems(e) {//ce
        if (_proxy_extendido && _proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
            var t = [];
            for (var o = 0, r = e.length; o < r; o++) {
                t.push(e[o][a])
            }
            var l = _dataView.mapIdsToRows(t);
            if (de(l)) {
                _setSelectedRows(l)
            }
        }
    }
    function de(e) {
        var t = _getSelectedRows();
        if (!t || e.length != t.length) {
            return true
        }
        for (var o = 0, n = t.length; o < n; o++) {
            if (t[o] !== e[o]) {
                return true
            }
        }
        return false
    }
    function _setSortCompareFunction(e) {//ue
        if (typeof e === "function") {
            _proxy_extendido.sortCompareFunction = e
        }
    }
    function _loadSelectedRowsAfterUpdate() {//fe
        if (_proxy_extendido && _proxy_extendido && (_proxy_extendido.allowSelection || _proxy_extendido.allowOnlyOneSelection)) {
            _dataView.loadSelectedRowsAfterUpdate(_grid);
        }
    }
    function ge() {
        if (u && (objSort || _proxy_extendido.sortParams || _proxy_extendido.sortCompareFunction)) {
            delete _proxy_extendido.sortParams;
            delete _proxy_extendido.sortCompareFunction;
            objSort = null;
            _grid.setSortColumn(null, null);
        }
    }
    function _resetSort() {//he
        ge();
        m = true;
        F_sort();
        m = false
    }
    function _forceSort() {//ve
        m = true;
        F_sort();
        m = false
    }
    function _scrollToItem(e, t) {//pe
        if (e) {
            var o = Math.max(0, _getItemRowIndexByKeyValue(a, e[a]));
            if (!t) {
                _grid.scrollRowToTop(o);
                _grid.invalidate();
            } else {
                me(o)
            }
        }
    }
    function me(e) {
        if (!c.tween) {
            c.tween = new TWEEN.Tween(c).onUpdate(_onUpdate).onComplete(_onComplete)
        }
        var t = _grid.getViewport();
        c.row = t.top;
        c.tween.to({
            row: e
        }, c.duration).start()
    }
    function _onUpdate() {//Ce
        var e = Math.floor(this.row);
        _grid.scrollRowToTop(e)
    }
    function _onComplete() {//we
        _grid.invalidate()
    }
    function _resetSelectedRows() {//Re
        if (n) {
            _grid.resetActiveCell();
            _grid.setSelectedRows([])
        }
    }
    function _dispose() {//Se
        _unsubscribeAll();
        if (e && o) {
            e[0].removeChild(o[0]);
            o.off("mouseenter", ye);
            o.off("mouseleave", ke);
            o = null
        }
        if (_grid) {
            _grid.destroy();
            _grid = null
        }
        if (h) {
            h.destroy();
            h = null
        }
        if (c.tween) {
            c.tween.stop();
            c.tween.onUpdate(null);
            c.tween.onComplete(null);
            c.tween = null
        }
        i = null;
        _proxy_extendido = null;
        _configuration = null;
        d = null;
        _provider = null;
        _columns = null;
        t = null;
        s = false;
        f_setGroup = false
    }
    function _getDataModel() {//be
        return _dataView || null
    }
    function ye(e) {
        o.addClass("xs-grid-hover")
    }
    function ke(e) {
        o.removeClass("xs-grid-hover")
    }
    return {
        init: _init, //B
        setItems: _setItems, //U
        updateItems: _updateItems, //K
        addItems: _addItems, //X
        removeItems: _removeItems,//q
        moveRowOnTop: _moveRowOnTop,//ee
        getItemRowIndexByKeyValue: _getItemRowIndexByKeyValue, //te
        setSortCompareFunction: _setSortCompareFunction,//ue
        loadSelectedRowsAfterUpdate: _loadSelectedRowsAfterUpdate, //fe
        getGridView: _getGridView,//re
        getData: _getData,//le
        getDataModel: _getDataModel,//be
        getFilteredItems: _getFilteredItems, //oe
        getBasicCompareByFieldFunction: _getBasicCompareByFieldFunction,//ne
        getDefaultCompareByFieldFunction: _getDefaultCompareByFieldFunction,//ie
        getSelectedRows: _getSelectedRows,//ae
        setSelectedRows: _setSelectedRows,//se
        setSelectedItems: _setSelectedItems,//ce
        setGrouping: _setGrouping,//Y
        expandCollapseGrouping: _expandCollapseGrouping,//Q
        expandAllGroups: _expandAllGroups,//J
        collapseAllGroups: _collapseAllGroups,//Z
        resetSort: _resetSort,//he
        forceSort: _forceSort, //ve
        scrollToItem: _scrollToItem,//pe
        updateSize: _updateSize,//G
        resetSelectedRows: _resetSelectedRows,//Re
        immediateRefreshView: _immediateRefreshView,//z
        dispose: _dispose //Se
    }
}