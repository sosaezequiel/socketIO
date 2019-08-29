(function (e) {
    e.extend(true, window, {
        Slick: {
            Data: {
                DataView: _DataView,//t
                Aggregators: {
                    Avg: _Avg,//o
                    Min: _Min,//n
                    Max: _Max,//
                    Sum: _Sum,//a
                    Volume: _Volume,//s
                    WeightedAverageByVolume: _WeightedAverageByVolume,//r
                    NetProfit: _NetProfit,//l
                    VolumeAndMargin: _VolumeAndMargin//c
                }
            }
        }
    });
    function _DataView(options) {//t
        var o = this;
        var defaults = {
            disableRowProvider: null,
            groupItemMetadataProvider: null,
            inlineFilters: false,
            sortGroups: false,
            emptyTotalAsLast: false
        };
        var idProperty = "id";//i
        var _items = []; //r
        var rows = [];//l
        var idxById = {};//a
        var rowsById = null;//s
        var c = null;
        var d = null;
        var update_flag = false;// u
        var f = true;
        var g;
        var h;
        var v = {};
        var p = {};
        var m;
        var C = [];
        var w;
        var R;
        var S = [];
        var b = null;
        var y = {
            getter: null,
            formatter: null,
            comparer: function (e, t) {
                return e.value - t.value
            },
            predefinedValues: [],
            aggregators: [],
            aggregateEmpty: false,
            aggregateCollapsed: false,
            aggregateChildGroups: false,
            collapsed: false,
            displayTotalsRow: true,
            sortGroupByField: null,
            sortGroupValue: null
        };
        var k = [];
        var D = [];
        var E = [];
        var I = ":";
        var T = 0;
        var x = 0;
        var $ = 0;
        var _onRowCountChanged = new Slick.Event;
        var _onRowsChanged = new Slick.Event;//P
        var _onPagingInfoChanged = new Slick.Event;///A
        var _onGroupCollapsedExpanded = new Slick.Event;//N
        options = e.extend(true, {}, defaults, options);
        function _getIdProperty() {//H
            return idProperty;
        }
        function _beginUpdate() {//L
            update_flag = true
        }
        function _endUpdate() {//F
            update_flag = false;
            _refresh()
        }
        function _setRefreshHints(e) {//_
            v = e
        }
        function _setFilterArgs(e) {//W
            m = e
        }
        function _updateIdxById(e) {//V
            e = e || 0;
            if (e == 0) {
                idxById = {}
            }
            var t;
            for (var o = e, n = _items.length; o < n; o++) {
                t = _items[o][idProperty];
                if (t === undefined) {
                    throw "Each data element must implement a unique 'id' property"
                }
                idxById[t] = o
            }
        }
        function _updateIdxForElements(e) {//O
            var t = _items.length;
            var o;
            for (var n = 0, l = e.length; n < l; n++) {
                o = e[n][idProperty];
                if (o === undefined) {
                    throw "Each data element must implement a unique 'id' property"
                }
                if (idxById.hasOwnProperty(o)) {
                    t = Math.min(idxById[o], t);
                    delete idxById[o]
                } else {
                    t = 0
                }
            }
            _updateIdxById(t)
        }
        function check_item() {//B
            var e;
            for (var t = 0, o = _items.length; t < o; t++) {
                e = _items[t][idProperty];
                if (e === undefined) {
                    throw "Each data element must implement a unique 'id' property" + " (" + e + ")"
                }
            }
        }
        function _getItems() {//G
            return _items;
        }
        function _setItems(e, t) {//z
            if (t !== undefined) {
                idProperty = t
            }
            _items = C = e;
            idxById = {};
            _updateIdxById();
            check_item();
            _refresh()
        }
        function _setPagingOptions(e) {//U
            if (e.pageSize != undefined) {
                T = e.pageSize;
                x = T ? Math.min(x, Math.max(0, Math.ceil($ / T) - 1)) : 0
            }
            if (e.pageNum != undefined) {
                x = Math.min(e.pageNum, Math.max(0, Math.ceil($ / T) - 1))
            }
            _onPagingInfoChanged.notify(K(), null, o);
            _refresh()
        }
        function _getPagingInfo() {//K
            var e = T ? Math.max(1, Math.ceil($ / T)) : 1;
            return {
                pageSize: T,
                pageNum: x,
                totalRows: $,
                totalPages: e
            }
        }
        function _sort(e, o) {//j
            var n = 0;
            f = o;
            h = e;
            g = null;
            if (t.sortGroups) {
                var i = k[n];
                if (i) {
                    if (b) {
                        if (i.sortGroupByField !== null && b.sortField === i.sortGroupByField) {
                            J()
                        } else {
                            Q()
                        }
                    } else if (o === false) {
                        D.reverse()
                    }
                }
            }
            _items.sort(e);
            if (o === false) {
                _items.reverse()
            }
            idxById = {};
            _updateIdxById();
            _refresh()
        }
        function _resetSort() {//X
            g = null;
            h = null
        }
        function _compareFunction(e, o, n) {//q
            if (t.emptyTotalAsLast && t.sortGroups) {
                var i = e === undefined || e === null
                    , r = o === undefined || o === null
                    , l = typeof n === "boolean" ? n : true;
                if (i && !r) {
                    return 1
                } else if (!i && r) {
                    return -1
                } else if (i && r) {
                    return 0
                }
                if (e > o) {
                    return l ? 1 : -1
                } else if (e < o) {
                    return l ? -1 : 1
                } else {
                    return 0
                }
            } else {
                if (e > o) {
                    return 1
                } else if (e < o) {
                    return -1
                } else {
                    return 0
                }
            }
        }
        function _compareByFieldFunction(e, t, o) {//Y
            return _compareFunction(e[o], t[o])
        }
        function Q() {
            if (!D || D.length < 1 || D[0].totals.sum[b.sortField] === undefined) {
                return
            }
            var e_sort = function (e, t) {
                var o;
                if ((o = _compareFunction(e.totals.sum[b.sortField], t.totals.sum[b.sortField], b.sortAsc)) == 0) {
                    o = _compareFunction(e.value, t.value, b.sortAsc)
                }
                return o
            };
            D.sort(e_sort);
            if (b.sortAsc === false && !t.emptyTotalAsLast) {
                D.reverse()
            }
        }
        function J() {//J
            if (!D || D.length < 1) {
                return
            }
            var e_sort = function (e, t) {
                return _compareFunction(e.valueSort, t.valueSort, b.sortAsc)
            };
            D.sort(e_sort);
            if (b.sortAsc === false && !t.emptyTotalAsLast) {
                D.reverse()
            }
        }
        function _fastSort(e, t) {//Z
            f = t;
            g = e;
            h = null;
            var o = Object.prototype.toString;
            Object.prototype.toString = typeof e == "function" ? e : function () {
                return this[e]
            }
                ;
            if (t === false) {
                r.reverse()
            }
            r.sort();
            Object.prototype.toString = o;
            if (t === false) {
                r.reverse()
            }
            a = {};
            _updateIdxById();
            _refresh()
        }
        function _reSort() {//ee
            if (h) {
                j(h, f)
            } else if (g) {
                Z(g, f)
            }
        }
        function _setFilter(e) {//te
            c = e;
            if (t.inlineFilters) {
                w = _e();
                R = We()
            }
            _refresh()
        }
        function _getFilteredItems() {//oe
            return C
        }
        function _getGrouping() {//ne
            return k
        }
        function _setGrouping(o) {//ie
            if (!options.groupItemMetadataProvider) {
                options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider
            }
            D = [];
            E = [];
            o = o || [];
            k = o instanceof Array ? o : [o];
            for (var n = 0; n < k.length; n++) {
                var i = k[n] = e.extend(true, {}, y, k[n]);
                i.getterIsAFn = typeof i.getter === "function";
                i.compiledAccumulators = [];
                var r = i.aggregators.length;
                while (r--) {
                    i.compiledAccumulators[r] = Fe(i.aggregators[r])
                }
                E[n] = {}
            }
            _refresh();
        }
        function _groupBy(e, t, o) {//re
            if (e == null) {
                _setGrouping([]);
                return
            }
            _setGrouping({
                getter: e,
                formatter: t,
                comparer: o
            })
        }
        function _setAggregators(e, t) {//le
            if (!k.length) {

                throw new Error("At least one grouping must be specified before calling setAggregators().")
            }
            k[0].aggregators = e;
            k[0].aggregateCollapsed = t;
            _setGrouping(k);
        }
        function _setGroupTotalsSort(e, t) {//ae
            b = {
                sortField: e,
                sortAsc: t
            }
        }
        function _clearGroupTotalsSort() {//se
            b = null
        }
        function _getItemByIdx(e) {//ce
            return _items[e]
        }
        function _getIdxById(e) {//de
            return idxById[e]
        }
        function ensureRowsByIdCache() {//ue
            if (!rowsById) {
                rowsById = {};
                for (var e = 0, t = rows.length; e < t; e++) {
                    if (rows[e].__group) {
                        var o = "row" + e;
                        rowsById[o] = e
                    } else {
                        rowsById[rows[e][idProperty]] = e
                    }
                }
            }
        }
        function _getRowById(e) {//fe
            ensureRowsByIdCache();
            return rowsById[e]
        }
        function _getItemById(e) {//ge
            return _items[idxById[e]];
        }
        function _mapIdsToRows(e) {//he
            var t = [];
            ensureRowsByIdCache();
            for (var o = 0; o < e.length; o++) {
                var n = rowsById[e[o]];
                if (n != null) {
                    t[t.length] = n
                }
            }
            return t
        }
        function _mapRowsToIds(e) {//ve
            var t = [];
            for (var o = 0; o < e.length; o++) {
                if (e[o] < rows.length) {
                    if (rows[e[o]].__group) {
                        t[t.length] = "row" + e[o]
                    } else {
                        t[t.length] = rows[e[o]][idProperty]
                    }
                }
            }
            return t
        }
        function _itemExists(index, item) {//pe
            if (idxById[index] === undefined || index !== item[idProperty]) {
                return false
            }
            return true
        }
        function _updateItem(index, item) {//me
            if (idxById[index] === undefined || index !== item[idProperty]) {
                throw "Invalid or non-matching id"
            }
            _items[idxById[index]] = item;
            if (!d) {
                d = {}
            }
            d[index] = true;
            _refresh()
        }
        function _insertItem(e, t) {//Ce
            _items.splice(e, 0, t);
            _updateIdxById(e);
            _refresh()
        }
        function _addItem(e) {//we
            _items.push(e);
            _updateIdxById(_items.length - 1);
            _refresh()
        }
        function _deleteItem(index) {//Re
            var t = idxById[index];
            if (t === undefined) {
                throw "Invalid id"
            }
            delete idxById[index];
            _items.splice(t, 1);
            _updateIdxById(t);
            _refresh()
        }
        function _getLength() {//Se
            return rows.length
        }
        function _getItem(e) {//be
            return rows[e]
        }
        function _getItemMetadata(e) {//ye
            var o = rows[e];
            if (o === undefined) {
                return null
            }
            if (o.__group) {
                return t.groupItemMetadataProvider.getGroupRowMetadata(o)
            }
            if (o.__groupTotals) {
                return t.groupItemMetadataProvider.getTotalsRowMetadata(o)
            }
            if (t.disableRowProvider) {
                return t.disableRowProvider.getDisabledMetadata(o)
            }
            return null
        }
        function ke(e, t) {//expandCollapseAllGroups
            if (e == null) {
                for (var n = 0; n < k.length; n++) {
                    E[n] = {};
                    k[n].collapsed = t
                }
            } else {
                E[e] = {};
                k[e].collapsed = t
            }
            _refresh();
            _onGroupCollapsedExpanded.notify({
                groupName: null,
                collapse: t
            }, null, o)
        }
        function _collapseAllGroups(e) {//De
            ke(e, true)
        }
        function _expandAllGroups(e) {//Ee
            ke(e, false)
        }
        function Ie(e, t, n) {//expandCollapseGroup
            E[e][t] = k[e].collapsed ^ n;
            _refresh();
            _onGroupCollapsedExpanded.notify({
                groupName: t,
                collapse: n
            }, null, o)
        }
        function _collapseGroup(e) {//Te
            var t = Array.prototype.slice.call(arguments);
            var o = t[0];
            if (t.length == 1 && o.indexOf(I) != -1) {
                Ie(o.split(I).length - 1, o, true)
            } else {
                Ie(t.length - 1, t.join(I), true)
            }
        }
        function _expandGroup(e) {//xe
            var t = Array.prototype.slice.call(arguments);
            var o = t[0];
            if (t.length == 1 && o.indexOf(I) != -1) {
                Ie(o.split(I).length - 1, o, false)
            } else {
                Ie(t.length - 1, t.join(I), false)
            }
        }
        function _getGroups() {//$e
            return D
        }
        function Me(e, t) {
            var o;
            var n;
            var i = [];
            var r = [];
            var l;
            var a = t ? t.level + 1 : 0;
            var s = k[a];
            for (var c = 0, d = s.predefinedValues.length; c < d; c++) {
                n = s.predefinedValues[c];
                o = r[n];
                if (!o) {
                    o = new Slick.Group;
                    o.value = n;
                    o.level = a;
                    o.groupingKey = (t ? t.groupingKey + I : "") + n;
                    i[i.length] = o;
                    r[n] = o
                }
            }
            for (var c = 0, d = e.length; c < d; c++) {
                l = e[c];
                n = s.getterIsAFn ? s.getter(l) : l[s.getter];
                o = r[n];
                if (!o) {
                    o = new Slick.Group;
                    o.value = n;
                    o.level = a;
                    o.valueSort = typeof s.sortGroupValue === "function" ? s.sortGroupValue(l).toLowerCase() : null;
                    o.groupingKey = (t ? t.groupingKey + I : "") + n;
                    i[i.length] = o;
                    r[n] = o
                }
                o.rows[o.count++] = l
            }
            if (a < k.length - 1) {
                for (var c = 0; c < i.length; c++) {
                    o = i[c];
                    o.groups = Me(o.rows, o)
                }
            }
            return i
        }
        function Pe(e) {
            var t = k[e.level];
            var o = e.level == k.length;
            var n = new Slick.GroupTotals;
            var i, r = t.aggregators.length;
            while (r--) {
                i = t.aggregators[r];
                i.init();
                t.compiledAccumulators[r].call(i, !o && t.aggregateChildGroups ? e.groups : e.rows);
                i.storeResult(n);
                i.storeDirectlyResult(e);
                if (!d) {
                    d = {}
                }
                d[e.groupingKey] = true
            }
            n.group = e;
            e.totals = n
        }
        function Ae(e, t) {
            t = t || 0;
            var o = k[t];
            var n = e.length, i;
            while (n--) {
                i = e[n];
                if (i.collapsed && !o.aggregateCollapsed) {
                    continue
                }
                if (i.groups) {
                    Ae(i.groups, t + 1)
                }
                if (o.aggregators.length && (o.aggregateEmpty || i.rows.length || i.groups && i.groups.length)) {
                    Pe(i)
                }
            }
        }
        function Ne(e, t) {
            t = t || 0;
            var o = k[t];
            var n = o.collapsed;
            var i = E[t];
            var r = e.length, l;
            while (r--) {
                l = e[r];
                l.collapsed = n ^ i[l.groupingKey];
                l.title = o.formatter ? o.formatter(l) : l.value;
                if (l.groups) {
                    Ne(l.groups, t + 1);
                    l.rows = []
                }
            }
            var a = [];
            if (o.forcedGroupOrder) {
                for (var s = 0; s < o.forcedGroupOrder.length; s++) {
                    var c = o.forcedGroupOrder[s];
                    for (var d = 0; d < e.length; d++) {
                        var u = e[d];
                        if (u.groupingKey == c) {
                            a[a.length] = e.splice(d, 1)[0];
                            break
                        }
                    }
                }
            }
            e.sort(o.comparer);
            if (o.forcedGroupOrder && a.length > 0) {
                Array.prototype.unshift.apply(e, a)
            }
        }
        function He(e, t) {
            t = t || 0;
            var o = k[t];
            var n = [], i, r = 0, l;
            for (var a = 0, s = e.length; a < s; a++) {
                l = e[a];
                n[r++] = l;
                if (!l.collapsed) {
                    i = l.groups ? He(l.groups, t + 1) : l.rows;
                    for (var c = 0, d = i.length; c < d; c++) {
                        n[r++] = i[c]
                    }
                }
                if (l.totals && o.displayTotalsRow && (!l.collapsed || o.aggregateCollapsed)) {
                    n[r++] = l.totals
                }
            }
            return n
        }
        function Le(e) {
            var t = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
            var o = e.toString().match(t);
            return {
                params: o[1].split(","),
                body: o[2]
            }
        }
        function Fe(e) {
            var t = Le(e.accumulate);
            var o = new Function("_items", "for (var " + t.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" + t.params[0] + " = _items[_i]; " + t.body + "}");
            o.displayName = o.name = "compiledAccumulatorLoop";
            return o
        }
        function _e() {
            var e = Le(c);
            var t = e.body.replace(/return false\s*([;}]|$)/gi, "{ continue _coreloop; }$1").replace(/return true\s*([;}]|$)/gi, "{ _retval[_idx++] = $item$; continue _coreloop; }$1").replace(/return ([^;}]+?)\s*([;}]|$)/gi, "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");
            var o = ["var _retval = [], _idx = 0; ", "var $item$, $args$ = _args; ", "_coreloop: ", "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ", "$item$ = _items[_i]; ", "$filter$; ", "} ", "return _retval; "].join("");
            o = o.replace(/\$filter\$/gi, t);
            o = o.replace(/\$item\$/gi, e.params[0]);
            o = o.replace(/\$args\$/gi, e.params[1]);
            var n = new Function("_items,_args", o);
            n.displayName = n.name = "compiledFilter";
            return n
        }
        function We() {
            var e = Le(c);
            var t = e.body.replace(/return false\s*([;}]|$)/gi, "{ continue _coreloop; }$1").replace(/return true\s*([;}]|$)/gi, "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1").replace(/return ([^;}]+?)\s*([;}]|$)/gi, "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");
            var o = ["var _retval = [], _idx = 0; ", "var $item$, $args$ = _args; ", "_coreloop: ", "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ", "$item$ = _items[_i]; ", "if (_cache[_i]) { ", "_retval[_idx++] = $item$; ", "continue _coreloop; ", "} ", "$filter$; ", "} ", "return _retval; "].join("");
            o = o.replace(/\$filter\$/gi, t);
            o = o.replace(/\$item\$/gi, e.params[0]);
            o = o.replace(/\$args\$/gi, e.params[1]);
            var n = new Function("_items,_args,_cache", o);
            n.displayName = n.name = "compiledFilterWithCaching";
            return n
        }
        function Ve(e, t) {
            var o = []
                , n = 0;
            var r;
            for (var i = 0, r = e.length; i < r; i++) {
                if (c(e[i], t)) {
                    o[n++] = e[i]
                }
            }
            return o
        }
        function Oe(e, t, o) {
            var n = [], i = 0, r;
            for (var l = 0, a = e.length; l < a; l++) {
                r = e[l];
                if (o[l]) {
                    n[i++] = r
                } else if (c(r, t)) {
                    n[i++] = r;
                    o[l] = true
                }
            }
            return n
        }
        function Be(e) {
            if (c) {
                var o = t.inlineFilters ? w : Ve;
                var n = t.inlineFilters ? R : Oe;
                if (v.isFilterNarrowing) {
                    C = o(C, m)
                } else if (v.isFilterExpanding) {
                    C = n(e, m, S)
                } else if (!v.isFilterUnchanged) {
                    C = o(e, m)
                }
            } else {
                C = T ? e : e.concat()
            }
            var i;
            if (T) {
                if (C.length < x * T) {
                    x = Math.floor(C.length / T)
                }
                i = C.slice(T * x, T * x + T)
            } else {
                i = C
            }
            return {
                totalRows: C.length,
                rows: i
            }
        }
        function Ge(e, t) {
            var o, n, r, l = [];
            var a = 0
                , s = t.length, u;
            if (v && v.ignoreDiffsBefore) {
                a = Math.max(0, Math.min(t.length, v.ignoreDiffsBefore))
            }
            if (v && v.ignoreDiffsAfter) {
                s = Math.min(t.length, Math.max(0, v.ignoreDiffsAfter))
            }
            for (var c = a, u = e.length; c < s; c++) {
                if (c >= u) {
                    l[l.length] = c
                } else {
                    o = t[c];
                    n = e[c];
                    r = o.__nonDataRow || n.__nonDataRow;
                    if (r && (o.__group || n.__group) && (d && d[o.groupingKey] || o.groupingKey != n.groupingKey) || o[idProperty] != n[idProperty] || d && d[o[idProperty]]) {
                        l[l.length] = c
                    }
                }
            }
            return l
        }
        function ze(e) {
            s = null;
            if (v.isFilterNarrowing != p.isFilterNarrowing || v.isFilterExpanding != p.isFilterExpanding) {
                S = []
            }
            var o = Be(e);
            $ = o.totalRows;
            var n = o.rows;
            var i = 0;
            D = [];
            if (k.length) {
                D = Me(n);
                if (D.length) {
                    Ae(D);
                    Ne(D);
                    if (t.sortGroups) {
                        var r = k[i];
                        if (r) {
                            if (b) {
                                if (r.sortGroupByField !== null && b.sortField === r.sortGroupByField) {
                                    J()
                                } else {
                                    Q()
                                }
                            } else if (f === false) {
                                D.reverse()
                            }
                        }
                    }
                    n = He(D)
                }
            }
            var a = Ge(rows, n);
            rows = n;
            return a
        }
        function _refresh() {//Ue
            if (update_flag) {
                return
            }
            var e = rows.length;
            var t = $;
            var n = ze(_items, c);
            if (T && $ < x * T) {
                x = Math.max(0, Math.ceil($ / T) - 1);
                n = ze(r, c)
            }
            d = null;
            p = v;
            v = {};
            if (t != $) {
                _onPagingInfoChanged.notify(_getPagingInfo(), null, o)
            }
            if (e != rows.length) {
                _onRowCountChanged.notify({
                    previous: e,
                    current: rows.length
                }, null, o)
            }
            if (n.length > 0) {
                _onRowsChanged.notify({
                    rows: n
                }, null, o)
            }
        }
        var Ke;
        function _saveSelectedRowsBeforeUpdate(e) {//je
            Ke = o.mapRowsToIds(e.getSelectedRows())
        }
        function _loadSelectedRowsAfterUpdate(e) {//Xe
            e.resetActiveCell();
            var t = [];
            if (Ke.length > 0) {
                t = o.mapIdsToRows(Ke)
            }
            e.setSelectedRows(t)
        }
        function _updateGridSelection(e, t) {//qe
            var o = this;
            var n = o.mapRowsToIds(e.getSelectedRows());
            if (n.length > 0) {
                var i = o.mapIdsToRows(n);
                if (!t) {
                    n = o.mapRowsToIds(i)
                }
                e.setSelectedRows(i)
            }
        }
        var Ye = false;
        function _syncGridSelection(e, t) {//Qe
            if (Ye) {
                return
            }
            Ye = true;
            var o = this;
            var n = o.mapRowsToIds(e.getSelectedRows());
            var i;
            function onRowsChanged() {//r
                if (n.length > 0) {
                    i = true;
                    var r = o.mapIdsToRows(n);
                    if (!t) {
                        n = o.mapRowsToIds(r)
                    }
                    e.setSelectedRows(r);
                    i = false
                }
            }
            e.onSelectedRowsChanged.subscribe(function (t, r) {
                if (i) {
                    return
                }
                n = o.mapRowsToIds(e.getSelectedRows())
            });
            this.onRowsChanged.subscribe(onRowsChanged);
            this.onRowCountChanged.subscribe(onRowsChanged)
        }
        function _syncGridCellCssStyles(e, t) {//Je
            var o;
            var n;
            r(e.getCellCssStyles(t));
            function r(e) {
                o = {};
                for (var t in e) {
                    var n = l[t][idProperty];
                    o[n] = e[t]
                }
            }
            function onRowsChanged() {
                if (o) {
                    n = true;
                    ue();
                    var i = {};
                    for (var r in o) {
                        var l = s[r];
                        if (l != undefined) {
                            i[l] = o[r]
                        }
                    }
                    e.setCellCssStyles(t, i);
                    n = false
                }
            }
            e.onCellCssStylesChanged.subscribe(function (e, o) {
                if (n) {
                    return
                }
                if (t != o.key) {
                    return
                }
                if (o.hash) {
                    r(o.hash)
                }
            });
            this.onRowsChanged.subscribe(onRowsChanged);
            this.onRowCountChanged.subscribe(onRowsChanged)
        }
        e.extend(this, {
            getIdProperty: _getIdProperty,//H
            beginUpdate: _beginUpdate,//L
            endUpdate: _endUpdate,//F
            setPagingOptions: _setPagingOptions,//U
            getPagingInfo: _getPagingInfo,//K
            getItems: _getItems,//G
            setItems: _setItems,//z
            setFilter: _setFilter,//te
            getFilteredItems: _getFilteredItems,//oe
            sort: _sort,//j
            fastSort: _fastSort,//Z
            reSort: _reSort,//ee
            resetSort: _resetSort,//X
            compareFunction: _compareFunction,//q
            compareByFieldFunction: _compareByFieldFunction,//Y
            setGrouping: _setGrouping,//ie
            getGrouping: _getGrouping,//ne
            groupBy: _groupBy,//re
            setAggregators: _setAggregators,//le
            setGroupTotalsSort: _setGroupTotalsSort,//ae
            clearGroupTotalsSort: _clearGroupTotalsSort,//se
            collapseAllGroups: _collapseAllGroups,//De
            expandAllGroups: _expandAllGroups,//Ee
            collapseGroup: _collapseGroup,//Te
            expandGroup: _expandGroup,//xe
            getGroups: _getGroups,//$e
            getIdxById: _getIdxById,//de
            updateIdxById: _updateIdxById,//V
            updateIdxForElements: _updateIdxForElements,//O
            getRowById: _getRowById,//fe
            getItemById: _getItemById,//ge
            getItemByIdx: _getItemByIdx,//ce
            mapRowsToIds: _mapRowsToIds,//ve
            mapIdsToRows: _mapIdsToRows,//he
            setRefreshHints: _setRefreshHints,//_
            setFilterArgs: _setFilterArgs,//W
            refresh: _refresh,//Ue
            itemExists: _itemExists,//
            updateItem: _updateItem,//me
            insertItem: _insertItem,//Ce
            addItem: _addItem,//we
            deleteItem: _deleteItem,//Re
            saveSelectedRowsBeforeUpdate: _saveSelectedRowsBeforeUpdate,//je
            loadSelectedRowsAfterUpdate: _loadSelectedRowsAfterUpdate,//Xe
            updateGridSelection: _updateGridSelection,//qe
            syncGridSelection: _syncGridSelection,//Qe
            syncGridCellCssStyles: _syncGridCellCssStyles,//Je
            getLength: _getLength,//Se
            getItem: _getItem,//be
            getItemMetadataCallback: null,
            getItemMetadata: _getItemMetadata, //ye
            onRowCountChanged: _onRowCountChanged,//M
            onRowsChanged: _onRowsChanged,//P
            onPagingInfoChanged: _onPagingInfoChanged,//A
            onGroupCollapsedExpanded: _onGroupCollapsedExpanded //N
        })
    }
    function _Avg(e) {//o
        this.field_ = e;
        this.init = function () {
            this.count_ = 0;
            this.nonNullCount_ = 0;
            this.sum_ = 0
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            this.count_++;
            if (t != null && t !== "" && t !== NaN) {
                this.nonNullCount_++;
                this.sum_ += parseFloat(t)
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.avg) {
                e.avg = {}
            }
            if (this.nonNullCount_ != 0) {
                e.avg[this.field_] = this.sum_ / this.nonNullCount_
            }
        }
    }
    function _Min(e) {//n
        this.field_ = e;
        this.init = function () {
            this.min_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            if (t != null && t !== "" && t !== NaN) {
                if (this.min_ == null || t < this.min_) {
                    this.min_ = t
                }
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.min) {
                e.min = {}
            }
            e.min[this.field_] = this.min_
        }
    }
    function _Max(e) {//i
        this.field_ = e;
        this.init = function () {
            this.max_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            if (t != null && t !== "" && t !== NaN) {
                if (this.max_ == null || t > this.max_) {
                    this.max_ = t
                }
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.max) {
                e.max = {}
            }
            e.max[this.field_] = this.max_
        }
    }
    function _WeightedAverageByVolume(e) {//r
        this.field_ = e;
        this.init = function () {
            this.sum_ = null;
            this.totalVolume_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            var o = e["volume"];
            if (t != null && t !== "" && t !== NaN && o != null && o !== "" && o !== NaN) {
                this.sum_ += parseFloat(t) * parseFloat(o);
                this.totalVolume_ += parseFloat(o)
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {}
            }
            e.sum[this.field_] = this.sum_ / this.totalVolume_
        }
            ;
        this.storeDirectlyResult = function (e) {
            e[this.field_] = this.sum_
        }
    }
    function _NetProfit(e) {//l
        this.field_ = e;
        this.init = function () {
            this.sumTotalProfit_ = null;
            this.sumNominalValue_ = null;
            this.sumMarginBuy_ = null;
            this.sumMarginSell_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e["totalProfit"];
            if (t != null) {
                var o = e["nominalValue"];
                if (o > 0) {
                    this.sumTotalProfit_ += t;
                    this.sumNominalValue_ += o
                } else {
                    var n = e["margin"];
                    if (n > 0) {
                        this.sumTotalProfit_ += t;
                        var i = e["side"];
                        if (i == TradeSide.BUY) {
                            this.sumMarginBuy_ += parseFloat(n)
                        } else if (i == TradeSide.SELL) {
                            this.sumMarginSell_ += parseFloat(n)
                        }
                    }
                }
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {}
            }
            var t = 0;
            if (this.sumNominalValue_ != null) {
                t = this.sumNominalValue_
            } else if (this.sumMarginBuy_ != null || this.sumMarginSell_ != null) {
                t = this.sumMarginBuy_ >= this.sumMarginSell_ ? this.sumMarginBuy_ : this.sumMarginSell_
            }
            e.sum[this.field_] = t != 0 ? this.sumTotalProfit_ / t * 100 : null
        }
            ;
        this.storeDirectlyResult = function (e) {
            var t = 0;
            if (this.sumNominalValue_ != null) {
                t = this.sumNominalValue_
            } else if (this.sumMarginBuy_ != null || this.sumMarginSell_ != null) {
                t = this.sumMarginBuy_ >= this.sumMarginSell_ ? this.sumMarginBuy_ : this.sumMarginSell_
            }
            e[this.field_] = t != 0 ? this.sumTotalProfit_ / t * 100 : null
        }
    }
    function _Sum(e) {//a
        this.field_ = e;
        this.init = function () {
            this.sum_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            if (t != null && t !== "" && t !== NaN) {
                this.sum_ += parseFloat(t)
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {}
            }
            e.sum[this.field_] = this.sum_
        }
            ;
        this.storeDirectlyResult = function (e) {
            e[this.field_] = this.sum_
        }
    }
    function _Volume(e) {//a
        this.field_ = e;
        this.init = function () {
            this.sum_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            if (t != null && t !== "" && t !== NaN) {
                if (e.side == 0) {
                    this.sum_ += parseFloat(t)
                } else {
                    this.sum_ -= parseFloat(t)
                }
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {}
            }
            e.sum[this.field_] = this.sum_
        }
            ;
        this.storeDirectlyResult = function (e) {
            e[this.field_] = this.sum_
        }
    }
    function _VolumeAndMargin(e, t) {//c
        this.volumeField_ = e;
        this.marginField_ = t;
        this.init = function () {
            this.volumeBuy_ = null;
            this.volumeSell_ = null;
            this.marginBuy_ = null;
            this.marginSell_ = null
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.marginField_];
            var o = e[this.volumeField_];
            if (t != null && t !== "" && t !== NaN && o != null && o !== "" && o !== NaN) {
                if (e.side == TradeSide.BUY) {
                    this.marginBuy_ += parseFloat(t);
                    this.volumeBuy_ += parseFloat(o)
                } else if (e.side == TradeSide.SELL) {
                    this.marginSell_ += parseFloat(t);
                    this.volumeSell_ += parseFloat(o)
                }
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {}
            }
            var t = parseFloat(this.volumeBuy_) || 0;
            var o = parseFloat(this.volumeSell_) || 0;
            e.sum[this.volumeField_] = t - o;
            if (this.marginBuy_ >= this.marginSell_) {
                e.sum[this.marginField_] = this.marginBuy_
            } else {
                e.sum[this.marginField_] = this.marginSell_
            }
        }
            ;
        this.storeDirectlyResult = function (e) {
            e[this.volumeField_] = parseFloat(this.volumeBuy_) - parseFloat(this.volumeSell_);
            var t = parseFloat(this.volumeBuy_) || 0;
            var o = parseFloat(this.volumeSell_) || 0;
            var n = t - o;
            if (n > 0) {
                e["side"] = 0;
                e["tradeType"] = 0
            } else if (n < 0) {
                e["side"] = 1;
                e["tradeType"] = 0
            }
            if (this.marginBuy_ >= this.marginSell_) {
                e[this.marginField_] = this.marginBuy_;
                e["hedgedSide"] = TradeSide.SELL
            } else {
                e[this.marginField_] = this.marginSell_;
                e["hedgedSide"] = TradeSide.BUY
            }
            var i;
            for (var i = 0; i < e.rows.length; ++i) {
                e.rows[i].isHedged = e["hedgedSide"] == e.rows[i].side
            }
        }
    }
}
)(jQuery);