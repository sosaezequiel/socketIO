(function (jq) {

    var e = MAE.SettingsService;
    var t = MAE.PopupsService;
    var n = MAE.I18nService;
    var a = MAE.SessionApiService;

    function _refreshColumns(e, t, a) {
        var i, o = e.map(function (e) {
            return jQuery.extend({}, e)
        });
        for (i = o.length - 1; i > -1; i--)
            o[i].name || (o[i].name = n.getFrequentString(e[i].nameKey));
        I(t, o),
            a.setColumns(o)
    }
    var o = {}
        , r = new MapWithSignals
        , s = {}
        , c = {}
        , u = {}
        , l = new signals.Signal
        ,
        //new MapWithSignals
        _getSortData = function (t) {
            if (c[t])
                return c[t];
            var n = e.getModuleValue(t, "datagridSortsData");
            if (!n || "" == n) {
                n = null;
                var i = "MAE";//a.getCurrentAccount().endpointType
                var o = SettingsDefaultAccountData[i][t];
                if (o && o.datagridSortsData) {
                    n = o.datagridSortsData || null;
                }
            }
            return n
        };


    _setSortData = function (t, n, a) {
        var i;
        i = n ? {
            id: n.id,
            field: n.field,
            sortAsc: a
        } : "";
        c[t] = i;
        e.setModuleValue(t, "datagridSortsData", i);
    },

        _getTypeField = function (e, t) {
            var n = 0
                , a = null;
            for (n; n < e.length; n++)
                if (e[n].id === t) {
                    a = e[n].type;
                    break
                }
            return a
        },

        _getCollapseData = function (t) {
            if (u[t])
                return u[t];
            var n = e.getModuleValue(t, "datagridCollapseData");
            return u[t] = n,
                n
        },

        _setCollapseData = function (t, n, a) {
            var i = n.split(".");
            u[t] || (u[t] = {});
            for (var o = u[t], r = 0; r < i.length; r++)
                o[i[r]] || (r === i.length - 1 ? o[i[r]] = !!a : o[i[r]] = {}),
                    o = o[i[r]];
            e.setModuleValue(t, "datagridCollapseData." + n, !!a)
        },
        _resetCollapseData = function (t) {
            u[t] && (u[t] = null,
                e.setModuleValue(t, "datagridCollapseData", null))
        },

        _showPersonalizationWindow = function (e, n, a, i, o, r) {
            r = r || !1,
                t.addPopup("popupPersonalizeDatagrid", !0, !0, PopupsType.POPUP_PERSONALIZE_DATAGRID, {
                    moduleName: e,
                    grid: n,
                    defaultColumns: a,
                    gridWrapper: i,
                    postActionFnc: o,
                    noResetFilters: r
                })
        },
        _showColumnFilterPopup = function (e, n, a) {
            t.addPopup("popupFilterDatagridColumn", !0, !0, PopupsType.POPUP_FILTER_DATAGRID_COLUMN, {
                moduleName: e,
                column: n,
                afterFunction: "function" == typeof a ? a : null
            })
        },
        _registerDatagrid = function (e, t, n, a) {
            o[e] = {
                grid: t,
                defaultColumns: n,
                allowFiltersOnInvisibleColumns: a
            },
                filters(e),
                t.onColumnsReordered.subscribe(C),
                t.onColumnsResized.subscribe(y)
        },
        _subscribeRefreshColumnFromSettingsEvent = function (e) {
            l.add(e)
        },
        _unsubscribeRefreshColumnFromSettingsEvent = function (e) {
            l.remove(e)
        },
        C = function (e, t) {
            var n = U(t.grid);
            n && A(n)
        },
        y = function (e, t) {
            var n = U(t.grid);
            n && A(n)
        },
        _unregisterDatagrid = function (e) {
            o[e] && o[e].grid.onColumnsReordered.unsubscribe(C),
                delete o[e]
        },
        A = function (t) {//A
            var n = o[t].grid
                , a = [];
            if (n) {
                for (var i = n.getColumns(), r = 0; r < i.length; r++) {
                    var s = i[r];
                    a.push({
                        id: s.id,
                        width: s.width
                    })
                }
                e.setModuleValue(t, "datagridColumns", a)
            }
        },
        _getColumnsFromSettings = function (t, n) {
            var a = n.length
                , i = e.getModuleValue(t, "datagridColumns")
                , o = 0;
            if (i) {
                for (var r = i.length - 1; r >= 0; r--) {
                    var s = i[r];
                    var c = _getColumn(s.id, n);
                    if (c) {
                        quitarCampo(s.id, n);
                        n.splice(0, 0, c);
                        o++;
                    }
                }
                n.splice(o, a - o)
            }
        },
        _toggleColumnsVisibility = function (e, t) {
            var n = o[e] ? o[e].grid : void 0;
            if (n) {
                var a, i, r = n.getColumns(), s = !1;
                for (a = 0; a < t.length; a++)
                    if (i = t[a],
                        _(i, r)) {
                        s = !0;
                        break
                    }
                if (s)
                    for (a = 0; a < t.length; a++) {
                        i = t[a];
                        quitarCampo(i, r);
                    }

                else {
                    var c = o[e].defaultColumns;
                    for (a = 0; a < t.length; a++) {
                        i = t[a];
                        var u = w(i, c);
                        u && R(r, u)
                    }
                }
                n.setColumns(r),
                    A(e)
            }
        },
        quitarCampo = function (e, t) {//O
            for (var n = 0; n < t.length; n++) {
                var a = t[n];
                if (a.id == e) {
                    t.splice(n, 1);
                    break;
                }
            }
        },

        R = function (e, t) {
            var n = k(e);
            n > -1 ? e.splice(n, 0, t) : e.push(t)
        },

        _getColumn = function (e, t) {
            for (var n = 0; n < t.length; n++) {
                var a = t[n];
                if (a.id == e)
                    return a
            }
        },

        _hasColumn = function (e, t) {
            return void 0 != w(e, t)
        },
        k = function (e) {
            for (var t = 0; t < e.length; t++) {
                var n = e[t];
                if (n.xsLastColumn)
                    return t
            }
            return -1
        },

        U = function (e) {
            for (var t in o)
                if (o[t].grid === e)
                    return t
        },

        _restoreDefaultSettings = function () {
            angular.forEach(ModulesType, function (e) {
                _setDefaultColumns(e)
            }),
                l.dispatch()
        },

        _setDefaultColumns = function (t) {
            var n = a.getCurrentAccount().endpointType
                , i = SettingsDefaultAccountData[n][t];
            if (i && i.datagridColumns)
                e.setModuleValue(t, "datagridColumns", i.datagridColumns);
            else {
                var o = e.getModuleValue(t, "datagridColumns");
                o && e.removeModuleValue(t, "datagridColumns")
            }
            if (i && i.datagridSortsData)
                e.setModuleValue(t, "datagridSortsData", i.datagridSortsData);
            else {
                var r = e.getModuleValue(t, "datagridSortsData");
                r && e.removeModuleValue(t, "datagridSortsData")
            }
        },

        B = function (e, t) {
            for (var n = o[e].grid.getColumns(), a = 0, i = n.length; a < i; a++)
                if (n[a].id == t)
                    return !0;
            return !1
        },
        _subscribeFilteredData = function (e, t) {
            r.addSubscribtion(e, t)
        },
        _unsubscribeFilteredData = function (e, t) {
            r.removeSubscribtion(e, t)
        },
        F = function (e, t) {
            var n;
            if (t == FilterType.LIST || t == FilterType.LIST_OR)
                if (Array.isArray(e))
                    n = e.slice();
                else {
                    n = [];
                    for (var a in e)
                        e[a] && n.push(a)
                }
            else
                t == FilterType.TEXT ? n = e.text : t == FilterType.NUMBER && (n = {
                    value1: e.value1,
                    value2: e.value2,
                    mathOperator: e.mathOperator
                });
            return n
        },

        W = function (e) {
            if (e.type == FilterType.LIST || e.type == FilterType.LIST_OR) {
                for (var t = {}, n = 0; n < e.value.length; n++) {
                    var a = e.value[n];
                    t[a] = !0
                }
                return t
            }
            return e.type == FilterType.TEXT ? {
                text: e.value
            } : e.type == FilterType.NUMBER ? {
                value1: e.value.value1,
                value2: e.value.value2,
                mathOperator: e.value.mathOperator
            } : void 0
        },
        V = function (e, t) {
            var n = []
                , a = o[e].allowFiltersOnInvisibleColumns
                , i = a ? a.length : 0;
            for (var c in s[e]) {
                var u = B(e, c);
                if (!u && a)
                    for (var l = 0; l < i; l++)
                        if (a[l].id == c) {
                            u = !0;
                            break
                        }
                u && (n[n.length] = s[e][c])
            }
            var d = o[e].grid.getData();
            if (!(d instanceof Slick.Data.DataView))
                throw new Error("Column filter can only be set on Slick.Data.DataView");
            n.length > 0 ? (d.setFilterArgs(n),
                d.setFilter(function (e, t) {
                    for (var n, a, i, o = !0, r = !1, s = !0, c = 0, u = t.length; c < u; c++) {
                        var l = t[c];
                        switch (n = l.field,
                        a = l.type,
                        i = l.flags,
                        e[n]) {
                            case "":
                            case null:
                            case void 0:
                                if (!i.noEmpty)
                                    continue;
                                s = !1
                        }
                        if (s && o)
                            if (a == FilterType.LIST)
                                void 0 != e[n] && l.value.indexOf(e[n].toString()) != -1 || (o = !1);
                            else if (a == FilterType.TEXT)
                                void 0 != e[n] && e[n].indexOf(l.value) != -1 || (o = !1);
                            else if (a == FilterType.NUMBER) {
                                var d;
                                switch (l.value.mathOperator) {
                                    case FilterMathOperator.EQUAL_TO:
                                        d = e[n] == l.value.value1;
                                        break;
                                    case FilterMathOperator.BIGGER_THAN:
                                        d = e[n] > l.value.value1;
                                        break;
                                    case FilterMathOperator.SMALLER_THAN:
                                        d = e[n] < l.value.value1;
                                        break;
                                    case FilterMathOperator.BIGGER_OR_EQUAL_TO:
                                        d = e[n] >= l.value.value1;
                                        break;
                                    case FilterMathOperator.SMALLER_OR_EQUAL_TO:
                                        d = e[n] <= l.value.value1;
                                        break;
                                    case FilterMathOperator.DIFFERENT_THAN:
                                        d = e[n] != l.value.value1;
                                        break;
                                    case FilterMathOperator.BETWEEN:
                                        d = e[n] > l.value.value1 && e[n] < l.value.value2;
                                        break;
                                    case FilterMathOperator.BETWEEN_OR_EQUAL_TO:
                                        d = e[n] >= l.value.value1 && e[n] <= l.value.value2
                                }
                                d || (o = !1)
                            }
                        a == FilterType.LIST_OR && l.value.indexOf(e[n].toString()) != -1 && (r || (r = !0))
                    }
                    return !!(s && o || r)
                }),
                r.dispatch(e, d.getFilteredItems()),
                t && t()) : (d.setFilterArgs(null),
                    d.setFilter(function (e) {
                        return !0
                    }),
                    r.dispatch(e, d.getFilteredItems()),
                    t && t())
        },

        _refreshGridFilters = function (e) {
            for (var t in o)
                if (o[t].grid === e)
                    return void filters(t)
        },

        _addColumnFilter = function (e, t, n, a, i, r) {
            var c = t.filterField;
            s[e] || (s[e] = {});
            var u = F(a, n);
            s[e][t.id] = {
                type: n,
                field: c,
                value: u,
                flags: r || {}
            },
                t.header && (t.header.buttons[0].cssClass = "icon-filter-on"),
                o[e].grid.updateColumnHeader(t.id),
                j(e),
                "function" != typeof i && (i = null),
                V(e, i)
        },

        _removeColumnFilter = function (e, t, n) {
            t.header && (t.header.buttons[0].cssClass = "icon-filter-off"),
                o[e].grid.updateColumnHeader(t.id),
                j(e),
                "function" != typeof n && (n = null),
                s[e] && (delete s[e][t.id],
                    V(e, n))
        },

        _resetFilters = function (e, t) {
            for (var n = o[e].grid, a = n.getColumns(), i = 0; i < a.length; i++)
                if (void 0 != a[i].header && void 0 != a[i].header.buttons)
                    for (var r = a[i], c = 0; c < r.header.buttons.length; c++)
                        "filter" === r.header.buttons[c].type && (r.header.buttons[c].cssClass = "icon-filter-off",
                            o[e].grid.updateColumnHeader(r.id),
                            j(e),
                            "function" != typeof t && (t = null),
                            s[e] && (delete s[e][r.id],
                                V(e, t)))
        },

        q = function (e, t, n) {
            if (t.header && (t.header.buttons[0].cssClass = "icon-filter-off"),
                !n) {
                if (!t.id)
                    return;
                n = t.id
            }
            o[e].grid.updateColumnHeader(n),
                s[e] && delete s[e][n]
        },

        Q = function (e, t, n, a, i, r, c, u) {
            if (!r || !c) {
                if (!t.id)
                    return;
                if (!t.filterField)
                    return;
                r = t.id,
                    c = t.filterField
            }
            var l = c;
            s[e] || (s[e] = {});
            var d = F(a, n);
            s[e][r] = {
                type: n,
                field: l,
                value: d,
                flags: u || {}
            },
                t.header && (t.header.buttons[0].cssClass = "icon-filter-on"),
                o[e].grid.updateColumnHeader(r),
                "function" != typeof i && (i = null)
        },

        j = function (t) {
            var n = o[t].grid;
            n ? e.setModuleValue(t, "datagridFilters", s[t]) : e.setModuleValue(t, "datagridFilters", s[t])
        },

        filters = function (t) {//$
            var n = o[t].grid;
            if (n && (s[t] = e.getModuleValue(t, "datagridFilters"),
                s[t])) {
                for (var a = n.getColumns(), i = 0; i < a.length; i++)
                    s[t][a[i].id] && a[i].header && (a[i].header.buttons[0].cssClass = "icon-filter-on",
                        o[t].grid.updateColumnHeader(a[i].id));
                V(t)
            }
        },
        _resetDatagridSortAndFilters = function (e, t, n) {
            var a, i, o = t.getColumns();
            if (s[e])
                for (a = 0,
                    i = o.length; a < i; a++)
                    q(e, o[a]);
            S(e, null, null),
                n ? n.resetSort() : t.setSortColumn(null, null),
                V(e),
                j(e)
        },

        _resetDatagridSort = function (e, t, n) {
            t.getColumns();
            S(e, null, null),
                n ? n.resetSort() : t.setSortColumn(null, null)
        },

        _setNewGroupFilters = function (e, t, n) {
            var a = []
                , i = {};
            s[e] || (s[e] = {});
            for (var o in s[e])
                t[o] ? (i[o] = t[o],
                    delete t[o]) : a.push(o);
            for (var r = 0; r < a.length; r++)
                n ? q(e, n[a[r]], a[r]) : q(e, !1, a[r]);
            var c;
            for (c in i)
                n ? Q(e, n[c], i[c].type, i[c].value, null, null, null, i[c].flags) : Q(e, !1, i[c].type, i[c].value, null, c, i[c].field, i[c].flags);
            for (c in t)
                n ? Q(e, n[c], t[c].type, t[c].value, null, null, null, t[c].flags) : Q(e, !1, t[c].type, t[c].value, null, c, t[c].field, t[c].flags);
            V(e, null)
        },

        _getColumnFilter = function (e, t) {
            return s[e] && s[e][t] ? W(s[e][t]) : null
        },
        _getModuleFilter = function (e) {
            return s[e] ? s[e] : null
        },

        _setFilterListItems = function (e, t, n) {
            if (o[e] && o[e].grid)
                for (var a = o[e].grid.getColumns(), i = 0; i < a.length; i++)
                    if (a[i].id === t)
                        return void (a[i].filterListItems && (a[i].filterListItems = n,
                            o[e].grid.setColumns(a)))
        },

        _isExistOnFilteredList = function (e, t) {
            var n = _getModuleFilter(e)
                , a = !0;
            for (var i in n)
                if (n.hasOwnProperty(i)) {
                    var o = !1;
                    switch (n[i].type) {
                        case FilterType.LIST:
                        case FilterType.LIST_OR:
                            for (var r = 0; r < n[i].value.length; r++)
                                if (n[i].value[r] == t[i]) {
                                    o = !0;
                                    break
                                }
                            break;
                        case FilterType.NUMBER:
                            switch (n[i].value.mathOperator) {
                                case FilterMathOperator.EQUAL_TO:
                                    o = t[i] == n[i].value.value1;
                                    break;
                                case FilterMathOperator.BIGGER_THAN:
                                    o = t[i] > n[i].value.value1;
                                    break;
                                case FilterMathOperator.SMALLER_THAN:
                                    o = t[i] < n[i].value.value1;
                                    break;
                                case FilterMathOperator.BIGGER_OR_EQUAL_TO:
                                    o = t[i] >= n[i].value.value1;
                                    break;
                                case FilterMathOperator.SMALLER_OR_EQUAL_TO:
                                    o = t[i] <= n[i].value.value1;
                                    break;
                                case FilterMathOperator.DIFFERENT_THAN:
                                    o = t[i] != n[i].value.value1;
                                    break;
                                case FilterMathOperator.BETWEEN:
                                    o = t[i] > n[i].value.value1 && t[i] < n[i].value.value2;
                                    break;
                                case FilterMathOperator.BETWEEN_OR_EQUAL_TO:
                                    o = t[i] >= n[i].value.value1 && t[i] <= n[i].value.value2
                            }
                            break;
                        case FilterType.TEXT:
                            o = !(void 0 == t[i] || t[i].indexOf(n[i].value) == -1);
                            break;
                        default:
                            o = !0
                    }
                    a &= o
                }
            return a
        };
    var _datagridService = {
        registerDatagrid: _registerDatagrid, //E
        unregisterDatagrid: _unregisterDatagrid,//T
        toggleColumnsVisibility: _toggleColumnsVisibility, //N
        showPersonalizationWindow: _showPersonalizationWindow,//v
        showColumnFilterPopup: _showColumnFilterPopup,//b
        getColumnsFromSettings: _getColumnsFromSettings,//I
        subscribeRefreshColumnFromSettingsEvent: _subscribeRefreshColumnFromSettingsEvent, //D
        unsubscribeRefreshColumnFromSettingsEvent: _unsubscribeRefreshColumnFromSettingsEvent, //h
        hasColumn: _hasColumn, //_
        getColumn: _getColumn,//w
        restoreDefaultSettings: _restoreDefaultSettings, //L
        refreshColumns: _refreshColumns,//i
        setDefaultColumns: _setDefaultColumns, //P
        addColumnFilter: _addColumnFilter, //X
        removeColumnFilter: _removeColumnFilter, //G
        resetDatagridSortAndFilters: _resetDatagridSortAndFilters,//J
        resetDatagridSort: _resetDatagridSort, //Y
        resetFilters: _resetFilters,//K
        isExistOnFilteredList: _isExistOnFilteredList,//ne
        getColumnFilter: _getColumnFilter,//Z
        getModuleFilter: _getModuleFilter, //ee
        refreshGridFilters: _refreshGridFilters, //H
        setFilterListItems: _setFilterListItems,//te
        setNewGroupFilters: _setNewGroupFilters,//z
        getSortData: _getSortData, //d
        setSortData: _setSortData, //S
        getTypeField: _getTypeField,//p
        getCollapseData: _getCollapseData, //g
        setCollapseData: _setCollapseData,//f
        resetCollapseData: _resetCollapseData,//m
        subscribeFilteredData: _subscribeFilteredData,//M
        unsubscribeFilteredData: _unsubscribeFilteredData //x
    };


    jq.extend(true, window, {
        MAE: {
            DatagridService: _datagridService
        }
    });

})(jQuery);