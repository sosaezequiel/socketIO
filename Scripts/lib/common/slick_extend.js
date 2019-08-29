(function ($) {
    $.extend(true, window, {
        Slick: {
            GridAdvanced: GridAdvanced,
            GridAdvancedMode: {
                SINGLE_ITEM: "SINGLE_ITEM",
                MULTIPLE_ITEMS: "MULTIPLE_ITEMS",
                LIST_OF_ITEMS: "LIST_OF_ITEMS"
            },
            GridAdvancedItemViewMode: {
                COLLAPSED: "COLLAPSED",
                VISIBLE: "VISIBLE",
                VISIBLE_EXTENDED: "VISIBLE_EXTENDED"
            }
        }
    });
    var scrollbarDimensions;
    var maxSupportedCssHeight;
    function GridAdvanced(container, data, columns, options) {
        var defaults = {
            explicitInitialization: false,
            rowHeight: 25,
            defaultColumnWidth: 80,
            enableAddRow: false,
            leaveSpaceForNewRows: false,
            editable: false,
            autoEdit: true,
            enableCellNavigation: true,
            enableColumnReorder: true,
            asyncEditorLoading: false,
            asyncEditorLoadDelay: 100,
            forceFitColumns: false,
            enableAsyncPostRender: false,
            asyncPostRenderDelay: 50,
            autoHeight: false,
            editorLock: Slick.GlobalEditorLock,
            showHeaderRow: false,
            headerRowHeight: 25,
            showTopPanel: false,
            topPanelHeight: 25,
            formatterFactory: null,
            editorFactory: null,
            cellFlashingCssClass: "flashing",
            selectedCellCssClass: "selected",
            multiSelect: true,
            enableTextSelectionOnCells: false,
            dataItemColumnValueExtractor: null,
            fullWidthRows: false,
            multiColumnSort: false,
            defaultFormatter: defaultFormatter,
            forceSyncScrolling: false,
            ngRendererUnderHtmlRow: false,
            ngRendererClean: false,
            disableKeyHandle: false,
            disableCellKeyHandle: false
        };
        var columnDefaults = {
            name: "",
            resizable: true,
            sortable: false,
            minWidth: 30,
            rerenderOnResize: false,
            headerCssClass: null,
            defaultSortAsc: true,
            focusable: true,
            selectable: true
        };
        var _rowHeightSum;//th
        var h;
        var ph;
        var n;
        var cj;
        var page = 0;
        var offset = 0;
        var vScrollDir = 1;
        var initialized = false;
        var $container;
        var uid = "slickgrid_" + Math.round(1e6 * Math.random());
        var self = this;
        var $focusSink, $focusSink2;
        var $headerScroller;
        var $headers;
        var $headerRow, $headerRowScroller, $headerRowSpacer;
        var $topPanelScroller;
        var $topPanel;
        var $viewport;
        var $canvas;
        var $dragContainer;
        var $style;
        var $boundAncestors;
        var stylesheet, columnCssRulesL, columnCssRulesR;
        var viewportH, viewportW;
        var canvasWidth;
        var viewportHasHScroll, viewportHasVScroll;
        var headerColumnWidthDiff = 0
            , headerColumnHeightDiff = 0
            , cellWidthDiff = 0
            , cellHeightDiff = 0;
        var absoluteColumnMinWidth;
        var numberOfRows = 0;
        var tabbingDirection = 1;
        var activePosX;
        var activeRow, activeCell;
        var activeCellNode = null;
        var currentEditor = null;
        var serializedEditorValue;
        var editController;
        var rowsCache = {};
        var renderedRows = 0;
        var numVisibleRows;
        var prevScrollTop = 0;
        var scrollTop = 0;
        var lastRenderedScrollTop = 0;
        var lastRenderedScrollLeft = 0;
        var prevScrollLeft = 0;
        var scrollLeft = 0;
        var selectionModel;
        var selectedRows = [];
        var plugins = [];
        var cellCssClasses = {};
        var columnsById = {};
        var sortColumns = [];
        var columnPosLeft = [];
        var columnPosRight = [];
        var h_editorLoader = null;
        var h_render = null;
        var h_postrender = null;
        var postProcessedRows = {};
        var postProcessToRow = null;
        var postProcessFromRow = null;
        var counter_rows_rendered = 0;
        var counter_rows_removed = 0;
        var rowHeightArray;
        var rowHeightSum = 0;
        var singleItemNgRenderer;
        var singleItemNgRendererData;
        var isSingleItemNgRenderer = false;
        var gridViewMode = Slick.GridAdvancedMode.SINGLE_ITEM;
        var singleItemViewMode = Slick.GridAdvancedItemViewMode.COLLAPSED;
        var ngScope;
        var ngParse;
        var ngTemplate;
        var templateChanged = false;
        var listNgRenderers = [];
        var listNgScopes = [];
        var areListNgRenderersInDOM = false;
        var suspend = false;
        var delay = 300
            , clicks = 0
            , timer = null;
        function init() {
            $container = $(container);
            if ($container.length < 1) {
                throw new Error("SlickGrid requires a valid container, " + container + " does not exist in the DOM.")
            }
            maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
            if (typeof options.getScrollDimensions == "function") {
                scrollbarDimensions = options.getScrollDimensions.call(this)
            }
            scrollbarDimensions = scrollbarDimensions || measureScrollbar();
            options = $.extend({}, defaults, options);
            validateAndEnforceOptions();
            columnDefaults.width = options.defaultColumnWidth;
            columnsById = {};
            for (var e = 0; e < columns.length; e++) {
                var t = columns[e] = $.extend({}, columnDefaults, columns[e]);
                columnsById[t.id] = e;
                if (t.minWidth && t.width < t.minWidth) {
                    t.width = t.minWidth
                }
                if (t.maxWidth && t.width > t.maxWidth) {
                    t.width = t.maxWidth
                }
            }
            if (options.enableColumnReorder && !$.fn.sortable) {
                throw new Error("SlickGrid's 'enableColumnReorder = true' option requires jquery-ui.sortable module to be loaded")
            }
            editController = {
                commitCurrentEdit: commitCurrentEdit,
                cancelCurrentEdit: cancelCurrentEdit
            };
            $container.empty().css("overflow", "hidden").css("outline", 0).addClass(uid).addClass("ui-widget");
            if (!/relative|absolute|fixed/.test($container.css("position"))) {
                $container.css("position", "relative")
            }
            $focusSink = $("<div tabIndex='0' hideFocus style='position:fixed;width:0;height:0;top:0;left:0;outline:0;'></div>").appendTo($container);
            $headerScroller = $("<div class='slick-header ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headers = $("<div class='slick-header-columns' style='left:-1000px' />").appendTo($headerScroller);
            $headers.width(getHeadersWidth());
            $headerRowScroller = $("<div class='slick-headerrow ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $headerRow = $("<div class='slick-headerrow-columns' />").appendTo($headerRowScroller);
            $headerRowSpacer = $("<div style='display:block;height:1px;position:absolute;top:0;left:0;'></div>").css("width", getCanvasWidth() + scrollbarDimensions.width + "px").appendTo($headerRowScroller);
            $topPanelScroller = $("<div class='slick-top-panel-scroller ui-state-default' style='overflow:hidden;position:relative;' />").appendTo($container);
            $topPanel = $("<div class='slick-top-panel' style='width:10000px' />").appendTo($topPanelScroller);
            if (!options.showTopPanel) {
                $topPanelScroller.hide()
            }
            if (!options.showHeaderRow) {
                $headerRowScroller.hide()
            }
            $viewport = $("<div class='slick-viewport' style='width:100%;overflow:auto;outline:0;position:relative;;'>").appendTo($container);
            $viewport.css("overflow-y", options.autoHeight ? "hidden" : "auto");
            $canvas = $("<div class='grid-canvas' />").appendTo($viewport);
            if (options.gridContainerClass) {
                $dragContainer = $("<div class='grid-drag-container " + options.gridContainerClass + "'/>").appendTo($("body"))
            } else {
                $dragContainer = $("<div class='grid-drag-container' />").appendTo($("body"))
            }
            $focusSink2 = $focusSink.clone().appendTo($container);
            if (!options.explicitInitialization) {
                finishInitialization()
            }
        }
        function finishInitialization() {
            if (!initialized) {
                initialized = true;
                viewportW = parseFloat($.css($container[0], "width", true));
                measureCellPaddingAndBorder();
                disableSelection($headers);
                if (!options.enableTextSelectionOnCells) {
                    $viewport.bind("selectstart.ui", function (e) {
                        return $(e.target).is("input,textarea")
                    })
                }
                updateColumnCaches();
                createColumnHeaders();
                setupColumnSort();
                createCssRules();
                resizeCanvas();
                bindAncestorScrollEvents();
                var e;
                $container.bind("resize.slickgrid", resizeCanvas);
                $viewport.bind("scroll jsp-scroll-y jsp-scroll-x", function () {
                    clearTimeout(e);
                    e = setTimeout(handleScroll, 1)
                });
                $headerScroller.bind("contextmenu", handleHeaderContextMenu).bind("click", handleHeaderClick).delegate(".slick-header-column", "mouseenter", handleHeaderMouseEnter).delegate(".slick-header-column", "mouseleave", handleHeaderMouseLeave);
                $headerRowScroller.bind("scroll", handleHeaderRowScroll);
                $focusSink.add($focusSink2).bind("keydown", handleKeyDown);
                $canvas.bind("keydown", handleKeyDown).bind("click", handleClick).bind("dblclick", handleDblClick).bind("contextmenu", handleContextMenu).bind("draginit", handleDragInit).bind("dragstart", {
                    distance: 3
                }, handleDragStart).bind("drag", handleDrag).bind("dragend", handleDragEnd).delegate(".slick-cell", "mouseenter", handleMouseEnter).delegate(".slick-cell", "mouseleave", handleMouseLeave)
            }
        }
        function registerPlugin(e) {
            plugins.unshift(e);
            e.init(self)
        }
        function unregisterPlugin(e) {
            for (var t = plugins.length; t >= 0; t--) {
                if (plugins[t] === e) {
                    if (plugins[t].destroy) {
                        plugins[t].destroy()
                    }
                    plugins.splice(t, 1);
                    break
                }
            }
        }
        function setSelectionModel(e) {
            if (selectionModel) {
                selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
                if (selectionModel.destroy) {
                    selectionModel.destroy()
                }
            }
            selectionModel = e;
            if (selectionModel) {
                selectionModel.init(self);
                selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged)
            }
        }
        function getSelectionModel() {
            return selectionModel
        }
        function getCanvasNode() {
            return $canvas[0]
        }
        function getDragContainer() {
            return $dragContainer[0]
        }
        function measureScrollbar() {
            var e = $("<div style='position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;'></div>").appendTo("body");
            var t = {
                width: e.width() - e[0].clientWidth || 17,
                height: e.height() - e[0].clientHeight
            };
            e.remove();
            return t
        }
        function getHeadersWidth() {
            var e = 0;
            for (var t = 0, o = columns.length; t < o; t++) {
                var n = columns[t].width;
                e += n
            }
            e += scrollbarDimensions.width;
            return Math.max(e, viewportW) + 1e3
        }
        function getCanvasWidth() {
            var e = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW - options.noScrollBarRightPadding;
            var t = 0;
            var o = columns.length;
            while (o--) {
                t += columns[o].width
            }
            return options.fullWidthRows ? Math.max(t, e) : t
        }
        function updateHeaderWidth(e) {
            $canvas.width(e);
            $headerRow.width(e);
            $headers.width(getHeadersWidth());
            viewportHasHScroll = e > viewportW - scrollbarDimensions.width
        }
        function updateCanvasWidth(e) {
            var t = canvasWidth;
            canvasWidth = getCanvasWidth();
            if (canvasWidth != t) {
                updateHeaderWidth(canvasWidth)
            }
            $headerRowSpacer.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
            if (canvasWidth != t || e) {
                applyColumnWidths()
            }
        }
        function disableSelection(e) {
            if (e && e.jquery) {
                e.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function () {
                    return false
                })
            }
        }
        function getMaxSupportedCssHeight() {
            var e = 1e6;
            var t = navigator.userAgent.toLowerCase().match(/firefox/) ? 6e6 : 1e9;
            var o = $("<div style='display:none' />").appendTo(document.body);
            while (true) {
                var n = e * 2;
                o.css("height", n);
                if (n > t || o.height() !== n) {
                    break
                } else {
                    e = n
                }
            }
            o.remove();
            return e
        }
        function bindAncestorScrollEvents() {
            var e = $canvas[0];
            while ((e = e.parentNode) != document.body && e != null) {
                if (e == $viewport[0] || e.scrollWidth != e.clientWidth || e.scrollHeight != e.clientHeight) {
                    var t = $(e);
                    if (!$boundAncestors) {
                        $boundAncestors = t
                    } else {
                        $boundAncestors = $boundAncestors.add(t)
                    }
                    t.bind("scroll." + uid, handleActiveCellPositionChange)
                }
            }
        }
        function unbindAncestorScrollEvents() {
            if (!$boundAncestors) {
                return
            }
            $boundAncestors.unbind("scroll." + uid);
            $boundAncestors = null
        }
        function updateColumnHeader(e, t, o) {
            if (!initialized) {
                return
            }
            var n = getColumnIndex(e);
            if (n == null) {
                return
            }
            var i = columns[n];
            var r = $headers.children().eq(n);
            if (r) {
                if (t !== undefined) {
                    columns[n].name = t
                }
                if (o !== undefined) {
                    columns[n].toolTip = o
                }
                trigger(self.onBeforeHeaderCellDestroy, {
                    node: r[0],
                    column: i
                });
                r.attr("title", o || "").children().eq(0).html(t);
                trigger(self.onHeaderCellRendered, {
                    node: r[0],
                    column: i
                })
            }
        }
        function getHeaderRow() {
            return $headerRow[0]
        }
        function getHeaderRowColumn(e) {
            var t = getColumnIndex(e);
            var o = $headerRow.children().eq(t);
            return o && o[0]
        }
        function createColumnHeaders() {
            function e() {
                $(this).addClass("ui-state-hover")
            }
            function t() {
                $(this).removeClass("ui-state-hover")
            }
            $headers.find(".slick-header-column").each(function () {
                var e = $(this).data("column");
                if (e) {
                    trigger(self.onBeforeHeaderCellDestroy, {
                        node: this,
                        column: e
                    })
                }
            });
            $headers.empty();
            $headers.width(getHeadersWidth());
            $headerRow.find(".slick-headerrow-column").each(function () {
                var e = $(this).data("column");
                if (e) {
                    trigger(self.onBeforeHeaderRowCellDestroy, {
                        node: this,
                        column: e
                    })
                }
            });
            $headerRow.empty();
            for (var o = 0; o < columns.length; o++) {
                var n = columns[o];
                var i = $("<div class='ui-state-default slick-header-column' id='" + uid + n.id + "' />").html("<span class='slick-column-name'>" + n.name.toUpperCase() + "</span>").width(n.width - headerColumnWidthDiff).attr("title", n.toolTip || "").data("column", n).addClass(n.headerCssClass || "").appendTo($headers);
                if (options.enableColumnReorder || n.sortable) {
                    i.on("mouseenter", e).on("mouseleave", t)
                }
                if (n.sortable) {
                    i.addClass("slick-header-sortable");
                    i.append("<span class='slick-sort-indicator' />")
                }
                trigger(self.onHeaderCellRendered, {
                    node: i[0],
                    column: n
                });
                if (options.showHeaderRow) {
                    var r = $("<div class='ui-state-default slick-headerrow-column l" + o + " r" + o + "'></div>").data("column", n).appendTo($headerRow);
                    trigger(self.onHeaderRowCellRendered, {
                        node: r[0],
                        column: n
                    })
                }
            }
            setSortColumns(sortColumns);
            setupColumnResize();
            if (options.enableColumnReorder) {
                setupColumnReorder()
            }
        }
        function setupColumnSort() {
            $headers.click(function (e) {
                e.metaKey = e.metaKey || e.ctrlKey;
                if ($(e.target).hasClass("slick-resizable-handle")) {
                    return
                }
                var t = $(e.target).closest(".slick-header-column");
                if (!t.length) {
                    return
                }
                var o = t.data("column");
                if (o.sortable) {
                    if (!getEditorLock().commitCurrentEdit()) {
                        return
                    }
                    var n = null;
                    var i = 0;
                    for (; i < sortColumns.length; i++) {
                        if (sortColumns[i].columnId == o.id) {
                            n = sortColumns[i];
                            n.sortAsc = !n.sortAsc;
                            break
                        }
                    }
                    if (e.metaKey && options.multiColumnSort) {
                        if (n) {
                            sortColumns.splice(i, 1)
                        }
                    } else {
                        if (!e.shiftKey && !e.metaKey || !options.multiColumnSort) {
                            sortColumns = []
                        }
                        if (!n) {
                            n = {
                                columnId: o.id,
                                sortAsc: o.defaultSortAsc
                            };
                            sortColumns.push(n)
                        } else if (sortColumns.length == 0) {
                            sortColumns.push(n)
                        }
                    }
                    setSortColumns(sortColumns);
                    if (!options.multiColumnSort) {
                        trigger(self.onSort, {
                            multiColumnSort: false,
                            sortCol: o,
                            sortAsc: n.sortAsc
                        }, e)
                    } else {
                        trigger(self.onSort, {
                            multiColumnSort: true,
                            sortCols: $.map(sortColumns, function (e) {
                                return {
                                    sortCol: columns[getColumnIndex(e.columnId)],
                                    sortAsc: e.sortAsc
                                }
                            })
                        }, e)
                    }
                }
            })
        }
        function setupColumnReorder() {
            $headers.filter(":ui-sortable").sortable("destroy");
            $headers.sortable({
                containment: "parent",
                distance: 3,
                axis: "x",
                cursor: "default",
                tolerance: "intersection",
                helper: "clone",
                placeholder: "slick-sortable-placeholder ui-state-default slick-header-column",
                forcePlaceholderSize: true,
                start: function (e, t) {
                    $(t.helper).addClass("slick-header-column-active")
                },
                beforeStop: function (e, t) {
                    $(t.helper).removeClass("slick-header-column-active")
                },
                stop: function (e) {
                    if (!getEditorLock().commitCurrentEdit()) {
                        $(this).sortable("cancel");
                        return
                    }
                    var t, o = $headers.sortable("toArray");
                    for (t = 0; t < columns.length; t++) {
                        var n = columns[t];
                        if (n.xsFrozen) {
                            if (!(o[t].indexOf(n.id) > -1)) {
                                $(this).sortable("cancel");
                                return
                            }
                        }
                    }
                    var i = [];
                    for (t = 0; t < o.length; t++) {
                        i.push(columns[getColumnIndex(o[t].replace(uid, ""))])
                    }
                    setColumns(i);
                    trigger(self.onColumnsReordered, {});
                    e.stopPropagation();
                    setupColumnResize()
                }
            })
        }
        function setupColumnResize() {
            var e, t, o, n, i, r, l, a, s;
            i = $headers.children();
            i.find(".slick-resizable-handle").remove();
            i.each(function (e, t) {
                if (columns[e].resizable) {
                    if (a === undefined) {
                        a = e
                    }
                    s = e
                }
            });
            if (a === undefined) {
                return
            }
            i.each(function (c, d) {
                if (c < a || options.forceFitColumns && c >= s) {
                    return
                }
                e = $(d);
                $("<div class='slick-resizable-handle' />").appendTo(d).bind("dragstart", function (e, a) {
                    if (!getEditorLock().commitCurrentEdit()) {
                        return false
                    }
                    n = e.pageX;
                    $(this).parent().addClass("slick-header-column-active");
                    var s = null
                        , d = null;
                    i.each(function (e, t) {
                        columns[e].previousWidth = $(t).outerWidth()
                    });
                    if (options.forceFitColumns) {
                        s = 0;
                        d = 0;
                        for (t = c + 1; t < i.length; t++) {
                            o = columns[t];
                            if (o.resizable) {
                                if (d !== null) {
                                    if (o.maxWidth) {
                                        d += o.maxWidth - o.previousWidth
                                    } else {
                                        d = null
                                    }
                                }
                                s += o.previousWidth - Math.max(o.minWidth || 0, absoluteColumnMinWidth)
                            }
                        }
                    }
                    var u = 0
                        , f = 0;
                    for (t = 0; t <= c; t++) {
                        o = columns[t];
                        if (o.resizable) {
                            if (f !== null) {
                                if (o.maxWidth) {
                                    f += o.maxWidth - o.previousWidth
                                } else {
                                    f = null
                                }
                            }
                            u += o.previousWidth - Math.max(o.minWidth || 0, absoluteColumnMinWidth)
                        }
                    }
                    if (s === null) {
                        s = 1e5
                    }
                    if (u === null) {
                        u = 1e5
                    }
                    if (d === null) {
                        d = 1e5
                    }
                    if (f === null) {
                        f = 1e5
                    }
                    l = n + Math.min(s, f);
                    r = n - Math.min(u, d)
                }).bind("drag", function (e, a) {
                    var s, d = Math.min(l, Math.max(r, e.pageX)) - n, u;
                    if (d < 0) {
                        u = d;
                        for (t = c; t >= 0; t--) {
                            o = columns[t];
                            if (o.resizable) {
                                s = Math.max(o.minWidth || 0, absoluteColumnMinWidth);
                                if (u && o.previousWidth + u < s) {
                                    u += o.previousWidth - s;
                                    o.width = s
                                } else {
                                    o.width = o.previousWidth + u;
                                    u = 0
                                }
                            }
                        }
                        if (options.forceFitColumns) {
                            u = -d;
                            for (t = c + 1; t < i.length; t++) {
                                o = columns[t];
                                if (o.resizable) {
                                    if (u && o.maxWidth && o.maxWidth - o.previousWidth < u) {
                                        u -= o.maxWidth - o.previousWidth;
                                        o.width = o.maxWidth
                                    } else {
                                        o.width = o.previousWidth + u;
                                        u = 0
                                    }
                                }
                            }
                        }
                    } else {
                        u = d;
                        for (t = c; t >= 0; t--) {
                            o = columns[t];
                            if (o.resizable) {
                                if (u && o.maxWidth && o.maxWidth - o.previousWidth < u) {
                                    u -= o.maxWidth - o.previousWidth;
                                    o.width = o.maxWidth
                                } else {
                                    o.width = o.previousWidth + u;
                                    u = 0
                                }
                            }
                        }
                        if (options.forceFitColumns) {
                            u = -d;
                            for (t = c + 1; t < i.length; t++) {
                                o = columns[t];
                                if (o.resizable) {
                                    s = Math.max(o.minWidth || 0, absoluteColumnMinWidth);
                                    if (u && o.previousWidth + u < s) {
                                        u += o.previousWidth - s;
                                        o.width = s
                                    } else {
                                        o.width = o.previousWidth + u;
                                        u = 0
                                    }
                                }
                            }
                        }
                    }
                    applyColumnHeaderWidths();
                    if (options.syncColumnCellResize) {
                        applyColumnWidths()
                    }
                }).bind("dragend", function (e, n) {
                    var r;
                    $(this).parent().removeClass("slick-header-column-active");
                    for (t = 0; t < i.length; t++) {
                        o = columns[t];
                        r = $(i[t]).outerWidth();
                        if (o.previousWidth !== r && o.rerenderOnResize) {
                            invalidateAllRows()
                        }
                    }
                    updateCanvasWidth(true);
                    render();
                    trigger(self.onColumnsResized, {})
                })
            })
        }
        function getVBoxDelta(e) {
            var t = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
            var o = 0;
            $.each(t, function (t, n) {
                o += parseFloat(e.css(n)) || 0
            });
            return o
        }
        function measureCellPaddingAndBorder() {
            var e;
            var t = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"];
            var o = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"];
            e = $("<div class='ui-state-default slick-header-column' style='visibility:hidden'>-</div>").appendTo($headers);
            headerColumnWidthDiff = headerColumnHeightDiff = 0;
            $.each(t, function (t, o) {
                headerColumnWidthDiff += parseFloat(e.css(o)) || 0
            });
            $.each(o, function (t, o) {
                headerColumnHeightDiff += parseFloat(e.css(o)) || 0
            });
            e.remove();
            var n = $("<div class='slick-row' />").appendTo($canvas);
            e = $("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(n);
            cellWidthDiff = cellHeightDiff = 0;
            $.each(t, function (t, o) {
                cellWidthDiff += parseFloat(e.css(o)) || 0
            });
            n.remove();
            absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff)
        }
        function createCssRules() {
            $style = $("<style type='text/css' rel='stylesheet' />").appendTo($("head"));
            var e = ["." + uid + " .slick-header-column { left: 1000px; }", "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }", "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }"];
            for (var t = 0; t < columns.length; t++) {
                e.push("." + uid + " .l" + t + " { }");
                e.push("." + uid + " .r" + t + " { }")
            }
            if ($style[0].styleSheet) {
                $style[0].styleSheet.cssText = e.join(" ")
            } else {
                $style[0].appendChild(document.createTextNode(e.join(" ")))
            }
        }
        function getColumnCssRules(e) {
            if (!stylesheet) {
                var t = document.styleSheets;
                for (var o = 0; o < t.length; o++) {
                    if ((t[o].ownerNode || t[o].owningElement) == $style[0]) {
                        stylesheet = t[o];
                        break
                    }
                }
                if (!stylesheet) {
                    throw new Error("Cannot find stylesheet.")
                }
                columnCssRulesL = [];
                columnCssRulesR = [];
                var n = stylesheet.cssRules || stylesheet.rules;
                var i, r;
                for (var o = 0; o < n.length; o++) {
                    var l = n[o].selectorText;
                    if (i = /\.l\d+/.exec(l)) {
                        r = parseInt(i[0].substr(2, i[0].length - 2), 10);
                        columnCssRulesL[r] = n[o]
                    } else if (i = /\.r\d+/.exec(l)) {
                        r = parseInt(i[0].substr(2, i[0].length - 2), 10);
                        columnCssRulesR[r] = n[o]
                    }
                }
            }
            return {
                left: columnCssRulesL[e],
                right: columnCssRulesR[e]
            }
        }
        function removeCssRules() {
            $style.remove();
            stylesheet = null
        }
        function destroy() {
            if ($dragContainer) {
                $dragContainer.remove();
                $dragContainer = null
            }
            getEditorLock().cancelCurrentEdit();
            trigger(self.onBeforeDestroy, {});
            var e = plugins.length;
            while (e--) {
                unregisterPlugin(plugins[e])
            }
            if (options.enableColumnReorder) {
                $headers.filter(":ui-sortable").sortable("destroy")
            }
            unbindAncestorScrollEvents();
            $container.unbind(".slickgrid");
            removeCssRules();
            $canvas.unbind("draginit dragstart dragend drag");
            $container.empty().removeClass(uid)
        }
        function trigger(e, t, o) {
            o = o || new Slick.EventData;
            t = t || {};
            t.grid = self;
            return e.notify(t, o, self)
        }
        function getEditorLock() {
            return options.editorLock
        }
        function getEditController() {
            return editController
        }
        function getColumnIndex(e) {
            return columnsById[e]
        }
        function autosizeColumns() {
            var e, t, o = [], n = 0, i = 0, r, l = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW - options.noScrollBarRightPadding;
            for (e = 0; e < columns.length; e++) {
                t = columns[e];
                o.push(t.width);
                i += t.width;
                if (t.resizable) {
                    n += t.width - Math.max(t.minWidth, absoluteColumnMinWidth)
                }
            }
            r = i;
            while (i > l && n) {
                var a = (i - l) / n;
                for (e = 0; e < columns.length && i > l; e++) {
                    t = columns[e];
                    var s = o[e];
                    if (!t.resizable || s <= t.minWidth || s <= absoluteColumnMinWidth) {
                        continue
                    }
                    var c = Math.max(t.minWidth, absoluteColumnMinWidth);
                    var d = Math.floor(a * (s - c)) || 1;
                    d = Math.min(d, s - c);
                    i -= d;
                    n -= d;
                    o[e] -= d
                }
                if (r == i) {
                    break
                }
                r = i
            }
            r = i;
            while (i < l) {
                var u = l / i;
                for (e = 0; e < columns.length && i < l; e++) {
                    t = columns[e];
                    if (!t.resizable || t.maxWidth <= t.width || t.maxWidth <= o[e]) {
                        continue
                    }
                    var f = Math.min(Math.floor(u * t.width) - t.width, t.maxWidth - t.width || 1e6) || 1;
                    i += f;
                    o[e] += f
                }
                if (r == i) {
                    break
                }
                r = i
            }
            var g = false;
            for (e = 0; e < columns.length; e++) {
                if (columns[e].rerenderOnResize && columns[e].width != o[e]) {
                    g = true
                }
                columns[e].width = o[e]
            }
            applyColumnHeaderWidths();
            updateCanvasWidth(true);
            if (g) {
                invalidateAllRows();
                render()
            }
        }
        function applyColumnHeaderWidths() {
            if (!initialized) {
                return
            }
            var e;
            for (var t = 0, o = $headers.children(), n = o.length; t < n; t++) {
                e = $(o[t]);
                if (e.width() !== columns[t].width - headerColumnWidthDiff) {
                    e.width(columns[t].width - headerColumnWidthDiff)
                }
            }
            updateColumnCaches()
        }
        function applyColumnWidths() {
            var e = 0, t, o;
            for (var n = 0; n < columns.length; n++) {
                t = columns[n].width;
                o = getColumnCssRules(n);
                o.left.style.left = e + "px";
                o.right.style.right = canvasWidth - e - t + "px";
                e += columns[n].width
            }
        }
        function setSortColumn(e, t) {
            setSortColumns([{
                columnId: e,
                sortAsc: t
            }])
        }
        function resetSortColumns() {
            var e = $headers.children();
            e.removeClass("slick-header-column-sorted").find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc slick-sort-indicator-desc")
        }
        function setSortColumns(e) {
            sortColumns = e;
            var t = $headers.children();
            t.removeClass("slick-header-column-sorted").find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");
            $.each(sortColumns, function (e, o) {
                if (o.sortAsc == null) {
                    o.sortAsc = true
                }
                var n = getColumnIndex(o.columnId);
                if (n != null) {
                    t.eq(n).addClass("slick-header-column-sorted").find(".slick-sort-indicator").addClass(o.sortAsc ? "slick-sort-indicator-asc" : "slick-sort-indicator-desc")
                }
            })
        }
        function getSortColumns() {
            return sortColumns
        }
        function handleSelectedRangesChanged(e, t) {
            selectedRows = [];
            var o = {};
            for (var n = 0; n < t.length; n++) {
                for (var i = t[n].fromRow; i <= t[n].toRow; i++) {
                    if (!o[i]) {
                        selectedRows.push(i);
                        o[i] = {}
                    }
                    for (var r = t[n].fromCell; r <= t[n].toCell; r++) {
                        if (canCellBeSelected(i, r)) {
                            o[i][columns[r].id] = options.selectedCellCssClass
                        }
                    }
                }
            }
            setCellCssStyles(options.selectedCellCssClass, o);
            trigger(self.onSelectedRowsChanged, {
                rows: getSelectedRows()
            }, e)
        }
        function getColumns() {
            return columns
        }
        function updateColumnCaches() {
            columnPosLeft = [];
            columnPosRight = [];
            var e = 0;
            for (var t = 0, o = columns.length; t < o; t++) {
                columnPosLeft[t] = e;
                columnPosRight[t] = e + columns[t].width;
                e += columns[t].width
            }
        }
        function setColumns(e) {
            columns = e;
            columnsById = {};
            for (var t = 0; t < columns.length; t++) {
                var o = columns[t] = $.extend({}, columnDefaults, columns[t]);
                columnsById[o.id] = t;
                if (o.minWidth && o.width < o.minWidth) {
                    o.width = o.minWidth
                }
                if (o.maxWidth && o.width > o.maxWidth) {
                    o.width = o.maxWidth
                }
            }
            updateColumnCaches();
            if (initialized) {
                invalidateAllRows();
                createColumnHeaders();
                removeCssRules();
                createCssRules();
                resizeCanvas();
                applyColumnWidths();
                handleScroll()
            }
            trigger(self.onColumnsSet, {})
        }
        function getOptions() {
            return options
        }
        function setOptions(e) {
            if (!getEditorLock().commitCurrentEdit()) {
                return
            }
            makeActiveCellNormal();
            if (options.enableAddRow !== e.enableAddRow) {
                invalidateRow(getDataLength())
            }
            options = $.extend(options, e);
            validateAndEnforceOptions();
            $viewport.css("overflow-y", options.autoHeight ? "hidden" : "auto");
            render()
        }
        function validateAndEnforceOptions() {
            if (options.autoHeight) {
                options.leaveSpaceForNewRows = false
            }
            if (!options.noScrollBarRightPadding) {
                options.noScrollBarRightPadding = 0
            }
            if (options.hasOwnProperty("rowNgRendererHeight") && options.hasOwnProperty("ngRendererUnderHtmlRow")) {
                if (options.ngRendererUnderHtmlRow) {
                    options.rowNgRendererHeight = options.rowNgRendererHeight + options.rowHeight
                }
            }
        }
        function setData(e, t) {
            data = e;
            invalidateAllRows();
            updateRowCount();
            if (t) {
                scrollTo(0)
            }
        }
        function getData() {
            return data
        }
        function getDataLength() {
            if (data.getLength) {
                return data.getLength()
            } else {
                return data.length
            }
        }
        function getDataItem(e) {
            if (data.getItem) {
                return data.getItem(e)
            } else {
                return data[e]
            }
        }
        function getDataItems(e) {
            var t = [];
            var o;
            for (var n = 0, i = e.length; n < i; n++) {
                o = getDataItem(e[n]);
                if (o) {
                    t.push(o)
                }
            }
            return t
        }
        function getTopPanel() {
            return $topPanel[0]
        }
        function setTopPanelVisibility(e) {
            if (options.showTopPanel != e) {
                options.showTopPanel = e;
                if (e) {
                    $topPanelScroller.slideDown("fast", resizeCanvas)
                } else {
                    $topPanelScroller.slideUp("fast", resizeCanvas)
                }
            }
        }
        function setHeaderRowVisibility(e) {
            if (options.showHeaderRow != e) {
                options.showHeaderRow = e;
                if (e) {
                    $headerRowScroller.slideDown("fast", resizeCanvas)
                } else {
                    $headerRowScroller.slideUp("fast", resizeCanvas)
                }
            }
        }
        function getContainerNode() {
            return $container.get(0)
        }
        function getRowTop(e) {
            var t = 0;
            for (var o = 0; o < rowHeightArray.length; o++) {
                if (o < e) {
                    t += rowHeightArray[o]
                } else {
                    return t - offset
                }
            }
            return t - offset
        }
        function getRowFromPosition(e) {
            var t = offset;
            var o = 0;
            if (rowHeightArray && rowHeightArray.length > 0) {
                for (o; o < rowHeightArray.length; o++) {
                    t += rowHeightArray[o];
                    if (t > e) {
                        return o
                    }
                }
            }
            return o
        }
        function scrollTo(e) {
            e = Math.max(e, 0);
            e = Math.min(e, _rowHeightSum - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0));
            var t = offset;
            page = Math.min(n - 1, Math.floor(e / ph));
            if (isNaN(page)) { }
            offset = Math.round(page * cj);
            if (isNaN(offset)) { }
            var o = e - offset;
            if (offset != t) {
                var i = getVisibleRange(o);
                cleanupRows(i);
                updateRowPositions()
            }
            if (prevScrollTop != o) {
                vScrollDir = prevScrollTop + t < o + offset ? 1 : -1;
                setScrollTop(lastRenderedScrollTop = scrollTop = prevScrollTop = o);
                trigger(self.onViewportChanged, {})
            }
        }
        function defaultFormatter(e, t, o, n, i) {
            if (o == null) {
                return ""
            } else {
                return (o + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }
        }
        function getFormatter(e, t) {
            var o = data.getItemMetadata && data.getItemMetadata(e);
            var n = data.getItemMetadataCallback && data.getItemMetadataCallback(e);
            if (n && n.cssClasses) {
                if (o) {
                    if (o.cssClasses) {
                        o.cssClasses = o.cssClasses.concat(" " + n.cssClasses)
                    } else {
                        o.cssClasses = n.cssClasses
                    }
                } else {
                    o = n
                }
            }
            var i = o && o.columns && (o.columns[t.id] || o.columns[getColumnIndex(t.id)]);
            return i && i.formatter || o && o.formatter || t.formatter || options.formatterFactory && options.formatterFactory.getFormatter(t) || options.defaultFormatter
        }
        function getEditor(e, t) {
            var o = columns[t];
            var n = data.getItemMetadata && data.getItemMetadata(e);
            var i = data.getItemMetadataCallback && data.getItemMetadataCallback(e);
            if (i && i.cssClasses) {
                if (n) {
                    if (n.cssClasses) {
                        n.cssClasses = n.cssClasses.concat(" " + i.cssClasses)
                    } else {
                        n.cssClasses = i.cssClasses
                    }
                } else {
                    n = i
                }
            }
            var r = n && n.columns;
            if (r && r[o.id] && r[o.id].editor !== undefined) {
                return r[o.id].editor
            }
            if (r && r[t] && r[t].editor !== undefined) {
                return r[t].editor
            }
            return o.editor || options.editorFactory && options.editorFactory.getEditor(o)
        }
        function getDataItemValueForColumn(e, t) {
            if (options.dataItemColumnValueExtractor) {
                return options.dataItemColumnValueExtractor(e, t)
            }
            return e[t.field]
        }
        function appendRowHtml(e, t, o, n) {
            var i = false;
            var r = getDataItem(t);
            var l = t < getDataLength() && !r;
            var a = data.getIdProperty();
            var s = "slick-row" + (l ? " loading" : "") + (t === activeRow ? " active" : "") + (t % 2 == 1 ? " odd" : " even") + (t === 0 ? " first-row" : "");
            if (singleItemViewMode != Slick.GridAdvancedItemViewMode.COLLAPSED || gridViewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                s += " " + options.ngRendererAdditionalRowClass
            }
            var c = data.getItemMetadata && data.getItemMetadata(t);
            var d = data.getItemMetadataCallback && data.getItemMetadataCallback(t);
            if (d && d.cssClasses) {
                if (c) {
                    if (c.cssClasses) {
                        c.cssClasses = c.cssClasses.concat(" " + d.cssClasses)
                    } else {
                        c.cssClasses = d.cssClasses
                    }
                } else {
                    c = d
                }
            }
            if (c && c.cssClasses) {
                s += " " + c.cssClasses
            }
            var u = getRowTop(t);
            e.push("<div class='ui-widget-content " + s + "' row='" + t + "' style='top:" + u + "px; height: " + rowHeightArray[t] + "px'>");
            if (gridViewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                if (r instanceof Slick.Group) { } else {
                    if (u <= scrollTop + viewportH && u + (options.rowNgRendererHeight - 7) >= scrollTop) {
                        var f = (n + 1) % (numVisibleRows + 1);
                        if (listNgRenderers[f]) {
                            listNgRenderers[f].getHtml().css("top", u + "px");
                            var g = listNgScopes[f].setData(getDataItem(t));
                            i = true;
                            if (g && areListNgRenderersInDOM) {
                                setTimeout(function () {
                                    listNgScopes[f].$digest()
                                }, 0)
                            }
                        }
                    } else { }
                }
            }
            var h = false;
            if ((singleItemViewMode == Slick.GridAdvancedItemViewMode.VISIBLE || singleItemViewMode == Slick.GridAdvancedItemViewMode.VISIBLE_EXTENDED) && singleItemNgRendererData && r[a] === singleItemNgRendererData[a]) {
                if (!options.ngRendererUnderHtmlRow) {
                    e.push("<div class='l0'></div>")
                }
                if (singleItemNgRenderer) {
                    if (options.ngRendererUnderHtmlRow) {
                        u += options.rowHeight
                    }

                    singleItemNgRenderer.getHtml().css("top", u + "px");
                    singleItemNgRenderer.getHtml().css("display", "block");
                    singleItemNgRenderer.setData(getDataItem(t));

                    rowsCache[t].cellRenderQueue.push(0);
                    rowsCache[t].cellColSpans[0] = 10;

                    h = true;
                    isSingleItemNgRenderer = true
                }
            }
            if (h && options.ngRendererUnderHtmlRow || !h) {
                var v, p;
                for (var m = 0, C = columns.length; m < C; m++) {
                    p = columns[m];
                    v = 1;
                    if (c && c.columns) {
                        var w = c.columns[p.id] || c.columns[m];
                        v = w && w.colspan || 1;
                        if (v === "*") {
                            v = C - m
                        }
                    }
                    if (columnPosRight[Math.min(C - 1, m + v - 1)] > o.leftPx) {
                        if (columnPosLeft[m] > o.rightPx) {
                            break
                        }
                        appendCellHtml(e, t, m, v)
                    }
                    if (v > 1) {
                        m += v - 1
                    }
                }
            }
            e.push("</div>");
            return i
        }
        function appendCellHtml(e, t, o, n) {
            var i = columns[o];
            var r = getDataItem(t);
            var l = "slick-cell l" + o + " r" + Math.min(columns.length - 1, o + n - 1) + (i.cssClass ? " " + i.cssClass : "");
            if (t === activeRow && o === activeCell) {
                l += " active"
            }
            for (var a in cellCssClasses) {
                if (cellCssClasses[a][t] && cellCssClasses[a][t][i.id]) {
                    l += " " + cellCssClasses[a][t][i.id]
                }
            }
            e.push("<div class='" + l + "' style='height: " + rowHeightArray[t] + "px'>");
            if (r) {
                var s = getDataItemValueForColumn(r, i);
                e.push(getFormatter(t, i)(t, o, s, i, r))
            }
            e.push("</div>");
            rowsCache[t].cellRenderQueue.push(o);
            rowsCache[t].cellColSpans[o] = n
        }
        function cleanupRows(e) {
            for (var t in rowsCache) {
                if ((t = parseInt(t, 10)) !== activeRow && (t < e.top || t > e.bottom)) {
                    removeRowFromCache(t)
                }
            }
        }
        function invalidate() {
            if (singleItemNgRenderer) {
                singleItemNgRenderer.getHtml().css("top", _rowHeightSum + "px");
                singleItemNgRenderer.getHtml().css("display", "none")
                singleItemNgRenderer.clear();
            }
            isSingleItemNgRenderer = false;
            invalidateRowHeight();
            updateRowCount();
            invalidateAllRows();
            render()
        }
        function invalidateAllRows() {
            if (currentEditor) {
                makeActiveCellNormal()
            }
            for (var e in rowsCache) {
                removeRowFromCache(e)
            }
        }
        function removeRowFromCache(e) {
            var t = rowsCache[e];
            if (!t) {
                return
            }
            $canvas[0].removeChild(t.rowNode);
            delete rowsCache[e];
            delete postProcessedRows[e];
            renderedRows--;
            counter_rows_removed++
        }
        function invalidateRows(e) {
            var t, o;
            if (!e || !e.length) {
                return
            }
            vScrollDir = 0;
            for (t = 0,
                o = e.length; t < o; t++) {
                if (currentEditor && activeRow === e[t]) {
                    makeActiveCellNormal()
                }
                if (rowsCache[e[t]]) {
                    removeRowFromCache(e[t])
                }
            }
        }
        function invalidateRowsData(e) {
            var t, o;
            if (!e || !e.length) {
                return
            }
            vScrollDir = 0;
            for (t = 0,
                o = e.length; t < o; t++) {
                if (rowsCache[e[t]]) {
                    rowsCache[e[t]].dataDirty = true
                }
            }
        }
        function invalidateRow(e) {
            invalidateRows([e])
        }
        function updateCell(e, t) {
            var o = getCellNode(e, t);
            if (!o) {
                return
            }
            var n = columns[t]
                , i = getDataItem(e);
            if (currentEditor && activeRow === e && activeCell === t) {
                currentEditor.loadValue(i)
            } else {
                o.innerHTML = i ? getFormatter(e, n)(e, t, getDataItemValueForColumn(i, n), n, i) : "";
                invalidatePostProcessingResults(e)
            }
        }
        function updateRow(e) {
            var t = rowsCache[e];
            if (!t) {
                return
            }
            ensureCellNodesInRowsCache(e);
            for (var o in t.cellNodesByColumnIdx) {
                if (!t.cellNodesByColumnIdx.hasOwnProperty(o)) {
                    continue
                }
                o = o | 0;
                var n = columns[o]
                    , i = getDataItem(e)
                    , r = t.cellNodesByColumnIdx[o];
                if (e === activeRow && o === activeCell && currentEditor) {
                    currentEditor.loadValue(i)
                } else if (i) {
                    r.innerHTML = getFormatter(e, n)(e, o, getDataItemValueForColumn(i, n), n, i)
                } else {
                    r.innerHTML = ""
                }
            }
            invalidatePostProcessingResults(e)
        }
        function getViewportHeight() {
            return parseFloat($.css($container[0], "height", true)) - parseFloat($.css($container[0], "paddingTop", true)) - parseFloat($.css($container[0], "paddingBottom", true)) - parseFloat($.css($headerScroller[0], "height")) - getVBoxDelta($headerScroller) - (options.showTopPanel ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0) - (options.showHeaderRow ? options.headerRowHeight + getVBoxDelta($headerRowScroller) : 0)
        }
        function resizeCanvas() {
            if (!initialized) {
                return
            }
            if (options.autoHeight) {
                viewportH = rowHeightSum
            } else {
                viewportH = getViewportHeight()
            }
            if (gridViewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                numVisibleRows = Math.ceil(viewportH / (options.rowNgRendererHeight - 7));
                createNgItemRenderers()
            } else {
                numVisibleRows = Math.ceil(viewportH / options.rowHeight)
            }
            viewportW = parseFloat($.css($container[0], "width", true));
            if (!options.autoHeight) {
                $viewport.height(viewportH)
            }
            if (options.forceFitColumns) {
                autosizeColumns()
            }
            updateRowCount();
            handleScroll();
            updateHeaderWidth(getCanvasWidth());
            render()
        }
        function invalidateRowHeight() {
            rowHeightArray = null
        }
        function updateRowCount(e) {
            var t = data.getIdProperty();
            var o = e == undefined ? false : e;
            if (!initialized) {
                return
            }
            if ((!rowHeightArray || o) && getDataLength() != 0) {
                rowHeightArray = [];
                rowHeightSum = 0;
                for (var i = 0; i < getDataLength(); i++) {
                    var r = getDataItem(i);
                    if (r instanceof Slick.Group) {
                        rowHeightArray[rowHeightArray.length] = options.rowGroupHeight ? options.rowGroupHeight : options.rowHeight
                    } else if (gridViewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                        rowHeightArray[rowHeightArray.length] = options.rowNgRendererHeight - 7;
                    } else if (singleItemNgRendererData && r[t] === singleItemNgRendererData[t]) {
                        if (singleItemViewMode == Slick.GridAdvancedItemViewMode.VISIBLE) {
                            rowHeightArray[rowHeightArray.length] = options.rowNgRendererHeight
                        } else if (singleItemViewMode == Slick.GridAdvancedItemViewMode.VISIBLE_EXTENDED) {
                            rowHeightArray[rowHeightArray.length] = options.rowNgRendererExtendedHeight
                        }
                    } else {
                        rowHeightArray[rowHeightArray.length] = options.rowCollapsedHeight
                    }
                    rowHeightSum += rowHeightArray[rowHeightArray.length - 1]
                }
            }
            if (n == undefined) { }
            numberOfRows = getDataLength() + (options.enableAddRow ? 1 : 0) + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
            var l = viewportHasVScroll;
            viewportHasVScroll = !options.autoHeight && rowHeightSum > viewportH;
            var a = options.enableAddRow ? getDataLength() : getDataLength() - 1;
            for (var i in rowsCache) {
                if (i >= a) {
                    removeRowFromCache(i)
                }
            }
            if (activeCellNode && activeRow > a) {
                resetActiveCell()
            }
            var s = h;
            _rowHeightSum = Math.max(rowHeightSum, viewportH - scrollbarDimensions.height);
            if (isNaN(_rowHeightSum)) { }
            if (_rowHeightSum < maxSupportedCssHeight) {
                h = ph = _rowHeightSum;
                n = 1;
                cj = 0
            } else {
                h = maxSupportedCssHeight;
                ph = h / 100;
                n = Math.floor(_rowHeightSum / ph);
                if (n == undefined) { }
                cj = (_rowHeightSum - h) / (n - 1)
            }
            if (h !== s) {
                $canvas.css("height", h);
                scrollTop = getScrollPosition().top
            }
            var c = scrollTop + offset <= _rowHeightSum - viewportH;
            if (_rowHeightSum == 0 || scrollTop == 0) {
                page = offset = 0
            } else if (c) {
                scrollTo(scrollTop + offset)
            } else {
                scrollTo(_rowHeightSum - viewportH)
            }
            if (h != s && options.autoHeight) {
                resizeCanvas()
            }
            if (options.forceFitColumns && l != viewportHasVScroll) {
                autosizeColumns()
            }
            updateCanvasWidth(false)
        }
        function getVisibleRange(e, t) {
            if (e == null) {
                e = scrollTop
            }
            if (t == null) {
                t = scrollLeft
            }
            return {
                top: getRowFromPosition(e),
                bottom: getRowFromPosition(e + viewportH) + 1,
                leftPx: t,
                rightPx: t + viewportW
            }
        }
        function getRenderedRange(e, t) {
            var o = getVisibleRange(e, t);
            var n = gridViewMode != Slick.GridAdvancedMode.SINGLE_ITEM ? Math.round(viewportH / options.rowHeight) : Math.round(viewportH / (options.rowNgRendererHeight - 7));
            var i = 3;
            if (vScrollDir == -1) {
                o.top -= n;
                o.bottom += i
            } else if (vScrollDir == 1) {
                o.top -= i;
                o.bottom += n
            } else {
                o.top -= i;
                o.bottom += i
            }
            o.top = Math.max(0, o.top);
            o.bottom = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, o.bottom);
            o.leftPx -= viewportW;
            o.rightPx += viewportW;
            o.leftPx = Math.max(0, o.leftPx);
            o.rightPx = Math.min(canvasWidth, o.rightPx);
            return o
        }
        function ensureCellNodesInRowsCache(e) {
            var t = rowsCache[e];
            if (t) {
                if (t.cellRenderQueue.length) {
                    var o = t.rowNode.lastChild;
                    while (t.cellRenderQueue.length) {
                        var n = t.cellRenderQueue.pop();
                        t.cellNodesByColumnIdx[n] = o;
                        o = o.previousSibling
                    }
                }
            }
        }
        function prepareRowCacheNode() {
            return {
                rowNode: null,
                cellColSpans: [],
                cellNodesByColumnIdx: [],
                cellRenderQueue: []
            }
        }
        function renderRows(e) {
            var t = 0;
            var o = $canvas[0]
                , n = []
                , i = [];
            if (areListNgRenderersInDOM) {
                for (var r = 0; r < listNgRenderers.length; r++) {
                    listNgRenderers[r].getHtml().css("top", "-300px")
                }
            }
            for (var l = e.top; l <= e.bottom; l++) {
                if (rowsCache[l]) { }
                renderedRows++;
                i.push(l);
                if (!rowsCache[l]) {
                    rowsCache[l] = prepareRowCacheNode()
                } else {
                    rowsCache[l].cellRenderQueue.length = 0
                }
                if (appendRowHtml(n, l, e, t)) {
                    t++
                }
                counter_rows_rendered++
            }
            if (!i.length) {
                return
            }
            var a = document.createElement("div");
            a.innerHTML = n.join("");
            var s = htmlCollToArr(a.children);
            for (var l = 0, c = i.length; l < c; l++) {
                updateRowData(o, rowsCache[i[l]], s[l])
            }
        }
        function htmlCollToArr(e) {
            var t = [];
            for (var o = 0; o < e.length; o++) {
                t.push(e[o])
            }
            return t
        }
        function updateRowData(e, t, o) {
            var n = t.rowNode;
            if (!n) {
                t.rowNode = e.appendChild(o)
            } else {
                n.className = o.className;
                var i = n.children;
                var r = o.children;
                if (i.length != r.length) {
                    n.innerHTML = o.innerHTML
                } else {
                    var l;
                    var a;
                    for (var s = 0, c = n.children.length; s < c; s++) {
                        l = o.children[s];
                        a = n.children[s];
                        a.className = l.className;
                        if (!isCellEqual(l, a)) {
                            a.innerHTML = l.innerHTML
                        }
                    }
                }
            }
        }
        function isCellEqual(e, t) {
            if (e.innerHTML != t.innerHTML) {
                return false
            }
            return true
        }
        function startPostProcessing() {
            if (!options.enableAsyncPostRender) {
                return
            }
            clearTimeout(h_postrender);
            h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay)
        }
        function invalidatePostProcessingResults(e) {
            delete postProcessedRows[e];
            postProcessFromRow = Math.min(postProcessFromRow, e);
            postProcessToRow = Math.max(postProcessToRow, e);
            startPostProcessing()
        }
        function updateRowPositions() {
            for (var e in rowsCache) {
                rowsCache[e].rowNode.style.top = getRowTop(e) + "px"
            }
        }
        function pauseRendering() {
            suspend = true
        }
        function playRendering() {
            suspend = false;
            invalidate()
        }
        function render() {
            if (!initialized || suspend || templateChanged) {
                return
            }
            var e = getVisibleRange();
            var t = getRenderedRange();
            cleanupRows(t);
            renderRows(t);
            postProcessFromRow = e.top;
            postProcessToRow = Math.min(options.enableAddRow ? getDataLength() : getDataLength() - 1, e.bottom);
            startPostProcessing();
            lastRenderedScrollTop = scrollTop;
            lastRenderedScrollLeft = scrollLeft;
            h_render = null
        }
        function handleHeaderRowScroll() {
            var e = $headerRowScroller[0].scrollLeft;
            if (e != $viewport[0].scrollLeft) {
                $viewport[0].scrollLeft = e
            }
        }
        function getScrollPosition() {
            if (typeof options.getScrollPosition == "function") {
                return $.extend({
                    top: 0,
                    left: 0
                }, options.getScrollPosition.call(this, $viewport))
            }
            return {
                top: $viewport[0].scrollTop,
                left: $viewport[0].scrollLeft
            }
        }
        function setScrollLeft(e) {
            if (typeof options.setScrollLeft == "function") {
                options.setScrollLeft.call(this, $viewport, e)
            } else {
                $viewport.scrollLeft(e)
            }
        }
        function setScrollTop(e) {
            if (typeof options.setScrollTop == "function") {
                options.setScrollTop.call(this, $viewport, e)
            } else {
                $viewport.scrollTop(e)
            }
        }
        function handleScroll() {
            var e = getScrollPosition();
            scrollTop = e.top;
            scrollLeft = e.left;
            var t = Math.abs(scrollTop - prevScrollTop);
            var o = Math.abs(scrollLeft - prevScrollLeft);
            if (o) {
                prevScrollLeft = scrollLeft;
                $headerScroller[0].scrollLeft = scrollLeft;
                $topPanelScroller[0].scrollLeft = scrollLeft;
                $headerRowScroller[0].scrollLeft = scrollLeft
            }
            if (t) {
                vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
                prevScrollTop = scrollTop;
                if (t < viewportH) { } else {
                    var i = offset;
                    if (h == viewportH) {
                        page = 0
                    } else {
                        page = Math.min(n - 1, Math.floor(scrollTop * ((_rowHeightSum - viewportH) / (h - viewportH)) * (1 / ph)));
                        if (isNaN(page)) { }
                    }
                    offset = Math.round(page * cj);
                    if (isNaN(offset)) { }
                    if (i != offset) {
                        invalidateAllRows()
                    }
                }
            }
            if (o || t) {
                if (h_render) {
                    clearTimeout(h_render)
                }
                if (Math.abs(lastRenderedScrollTop - scrollTop) > 20 || Math.abs(lastRenderedScrollLeft - scrollLeft) > 20) {
                    if (options.forceSyncScrolling || Math.abs(lastRenderedScrollTop - scrollTop) < viewportH && Math.abs(lastRenderedScrollLeft - scrollLeft) < viewportW) {
                        render()
                    } else {
                        h_render = setTimeout(render, 50)
                    }
                    trigger(self.onViewportChanged, {})
                }
            }
            trigger(self.onScroll, {
                scrollLeft: scrollLeft,
                scrollTop: scrollTop
            })
        }
        function asyncPostProcessRows() {
            while (postProcessFromRow <= postProcessToRow) {
                var e = vScrollDir >= 0 ? postProcessFromRow++ : postProcessToRow--;
                var t = rowsCache[e];
                if (!t || e >= getDataLength()) {
                    continue
                }
                if (!postProcessedRows[e]) {
                    postProcessedRows[e] = {}
                }
                ensureCellNodesInRowsCache(e);
                for (var o in t.cellNodesByColumnIdx) {
                    if (!t.cellNodesByColumnIdx.hasOwnProperty(o)) {
                        continue
                    }
                    o = o | 0;
                    var n = columns[o];
                    if (n.asyncPostRender && !postProcessedRows[e][o]) {
                        var i = t.cellNodesByColumnIdx[o];
                        if (i) {
                            n.asyncPostRender(i, e, getDataItem(e), n)
                        }
                        postProcessedRows[e][o] = true
                    }
                }
                h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
                return
            }
        }
        function updateCellCssStylesOnRenderedRows(e, t) {
            var o, n, i, r;
            for (var l in rowsCache) {
                r = t && t[l];
                i = e && e[l];
                var a = $(rowsCache[l].rowNode);
                if (r) {
                    a.removeClass("selected");
                    for (n in r) {
                        if (!i || r[n] != i[n]) {
                            o = getCellNode(l, getColumnIndex(n));
                            if (o) {
                                $(o).removeClass(r[n])
                            }
                        }
                    }
                }
                if (i) {
                    a.addClass("selected");
                    for (n in i) {
                        if (!r || r[n] != i[n]) {
                            o = getCellNode(l, getColumnIndex(n));
                            if (o) {
                                $(o).addClass(i[n])
                            }
                        }
                    }
                }
            }
        }
        function addCellCssStyles(e, t) {
            if (cellCssClasses[e]) {
                throw "addCellCssStyles: cell CSS hash with key '" + e + "' already exists."
            }
            cellCssClasses[e] = t;
            updateCellCssStylesOnRenderedRows(t, null);
            trigger(self.onCellCssStylesChanged, {
                key: e,
                hash: t
            })
        }
        function removeCellCssStyles(e) {
            if (!cellCssClasses[e]) {
                return
            }
            updateCellCssStylesOnRenderedRows(null, cellCssClasses[e]);
            delete cellCssClasses[e];
            trigger(self.onCellCssStylesChanged, {
                key: e,
                hash: null
            })
        }
        function setCellCssStyles(e, t) {
            var o = cellCssClasses[e];
            cellCssClasses[e] = t;
            updateCellCssStylesOnRenderedRows(t, o);
            trigger(self.onCellCssStylesChanged, {
                key: e,
                hash: t
            })
        }
        function getCellCssStyles(e) {
            return cellCssClasses[e]
        }
        function flashCell(e, t, o) {
            o = o || 100;
            if (rowsCache[e]) {
                var n = $(getCellNode(e, t));
                function i(e) {
                    if (!e) {
                        return
                    }
                    setTimeout(function () {
                        n.queue(function () {
                            n.toggleClass(options.cellFlashingCssClass).dequeue();
                            i(e - 1)
                        })
                    }, o)
                }
                i(4)
            }
        }
        function handleDragInit(e, t) {
            var o = getCellFromEvent(e);
            if (!o || !cellExists(o.row, o.cell)) {
                return false
            }
            var n = trigger(self.onDragInit, t, e);
            if (e.isImmediatePropagationStopped()) {
                return n
            }
            return false
        }
        function handleDragStart(e, t) {
            var o = getCellFromEvent(e);
            if (!o || !cellExists(o.row, o.cell)) {
                return false
            }
            var n = trigger(self.onDragStart, t, e);
            if (e.isImmediatePropagationStopped()) {
                return n
            }
            return false
        }
        function handleDrag(e, t) {
            return trigger(self.onDrag, t, e)
        }
        function handleDragEnd(e, t) {
            trigger(self.onDragEnd, t, e)
        }
        function handleKeyDown(e) {
            if (options.disableKeyHandle) {
                return
            }
            if ($(e.target).hasClass("ignore-slickgrid-key-handle") || $(e.target).parents(".ignore-slickgrid-key-handle").length > 0) {
                return
            }
            trigger(self.onKeyDown, {
                row: activeRow,
                cell: activeCell
            }, e);
            var t = e.isImmediatePropagationStopped();
            if (!t) {
                if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
                    if (e.which == 27) {
                        if (!getEditorLock().isActive()) {
                            return
                        }
                        cancelEditAndSetFocus()
                    } else if (e.which == 37) {
                        if (!options.disableCellKeyHandle) {
                            t = navigateLeft()
                        }
                    } else if (e.which == 39) {
                        if (!options.disableCellKeyHandle) {
                            t = navigateRight()
                        }
                    } else if (e.which == 38) {
                        t = navigateUp()
                    } else if (e.which == 40) {
                        t = navigateDown()
                    } else if (e.which == 9) {
                        t = navigateNext()
                    } else if (e.which == 13) {
                        if (options.editable) {
                            if (currentEditor) {
                                if (activeRow === getDataLength()) {
                                    navigateDown()
                                } else {
                                    commitEditAndSetFocus()
                                }
                            } else {
                                if (getEditorLock().commitCurrentEdit()) {
                                    makeActiveCellEditable()
                                }
                            }
                        }
                        t = true
                    }
                } else if (e.which == 9 && e.shiftKey && !e.ctrlKey && !e.altKey) {
                    t = navigatePrev()
                }
            }
            if (t) {
                e.stopPropagation();
                e.preventDefault();
                try {
                    e.originalEvent.keyCode = 0
                } catch (e) { }
            }
        }
        function handleClick(e) {
            if (!currentEditor) {
                if (e.target != document.activeElement) {
                    setFocus()
                }
            }
            var t = getCellFromEvent(e);
            if (!t || currentEditor !== null && activeRow == t.row && activeCell == t.cell) {
                var o = options.ignoreDeselectOnClickForClass ? $(e.target).hasClass(options.ignoreDeselectOnClickForClass) || $(e.target).parents("." + options.ignoreDeselectOnClickForClass).length > 0 || t === null : false;
                if (selectionModel && options.deselectOnClick && !o) {
                    setSelectedRows([]);
                    resetActiveCell()
                }
                return
            }
            trigger(self.onClick, {
                row: t.row,
                cell: t.cell
            }, e);
            clicks++;
            if (clicks === 1) {
                timer = setTimeout(function () {
                    trigger(self.onSingleClick, {
                        row: t.row,
                        cell: t.cell
                    }, e);
                    clicks = 0
                }, delay)
            } else {
                clearTimeout(timer);
                clicks = 0
            }
            if (e.isImmediatePropagationStopped()) {
                return
            }
            var n = $.inArray(t.row, selectedRows);
            if (selectionModel && options.deselectOnClick && n != -1 && (!options.multiSelect || selectedRows.length == 1)) {
                selectedRows.splice(n, 1);
                setSelectedRows(selectedRows);
                resetActiveCell()
            } else if ((activeCell != t.cell || activeRow != t.row) && canCellBeActive(t.row, t.cell)) {
                if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
                    if (singleItemNgRenderer && isSingleItemNgRenderer) {
                        scrollRowIntoViewSingle(t.row, true);//, options.rowNgRendererHeight - options.rowHeight);


                    } else {
                        scrollRowIntoView(t.row, false)

                    }

                    setActiveCellInternal(getCellNode(t.row, t.cell), t.row === getDataLength() || options.autoEdit)
                }
            }
        }
        function handleContextMenu(e) {
            var t = $(e.target).closest(".slick-cell", $canvas);
            if (t.length === 0) {
                return
            }
            if (activeCellNode === t[0] && currentEditor !== null) {
                return
            }
            trigger(self.onContextMenu, {}, e)
        }
        function handleDblClick(e) {
            var t = getCellFromEvent(e);
            if (!t || currentEditor !== null && activeRow == t.row && activeCell == t.cell) {
                return
            }
            trigger(self.onDblClick, {
                row: t.row,
                cell: t.cell
            }, e);
            if (e.isImmediatePropagationStopped()) {
                return
            }
            if (options.editable) {
                gotoCell(t.row, t.cell, true)
            }
        }
        function handleHeaderMouseEnter(e) {
            trigger(self.onHeaderMouseEnter, {
                column: $(this).data("column")
            }, e)
        }
        function handleHeaderMouseLeave(e) {
            trigger(self.onHeaderMouseLeave, {
                column: $(this).data("column")
            }, e)
        }
        function handleHeaderContextMenu(e) {
            var t = $(e.target).closest(".slick-header-column", ".slick-header-columns");
            var o = t && t.data("column");
            trigger(self.onHeaderContextMenu, {
                column: o
            }, e)
        }
        function handleHeaderClick(e) {
            var t = $(e.target).closest(".slick-header-column", ".slick-header-columns");
            var o = t && t.data("column");
            if (o) {
                trigger(self.onHeaderClick, {
                    column: o
                }, e)
            }
        }
        function handleMouseEnter(e) {
            trigger(self.onMouseEnter, {}, e)
        }
        function handleMouseLeave(e) {
            trigger(self.onMouseLeave, {}, e)
        }
        function cellExists(e, t) {
            return !(e < 0 || e >= getDataLength() || t < 0 || t >= columns.length)
        }
        function getCellFromPoint(e, t) {
            var o = getRowFromPosition(t);
            var n = 0;
            var i = 0;
            for (var r = 0; r < columns.length && i < e; r++) {
                i += columns[r].width;
                n++
            }
            if (n < 0) {
                n = 0
            }
            return {
                row: o,
                cell: n - 1
            }
        }
        function getCellFromNode(e) {
            var t = /l\d+/.exec(e.className);
            if (!t) {
                throw "getCellFromNode: cannot get cell - " + e.className
            }
            return parseInt(t[0].substr(1, t[0].length - 1), 10)
        }
        function getRowFromNode(e) {
            for (var t in rowsCache) {
                if (rowsCache[t].rowNode === e) {
                    return t | 0
                }
            }
            return null
        }
        function getCellFromEvent(e) {
            var t = $(e.target).closest(".slick-cell", $canvas);
            if (!t.length) {
                if (options.draggableDirective) {
                    if (e.type.indexOf("drag") !== -1) {
                        var o = $(e.target).parents(options.draggableDirective);
                        var n = $(o.siblings(".slick-row.active")[0]).attr("row");
                        if (o && n) {
                            return {
                                row: parseInt(n),
                                cell: 0
                            }
                        }
                    }
                    return null
                } else {
                    return null
                }
            }
            var n = getRowFromNode(t[0].parentNode);
            var i = getCellFromNode(t[0]);
            if (n == null || i == null) {
                return null
            } else {
                return {
                    row: n,
                    cell: i
                }
            }
        }
        function getCellNodeBox(e, t) {
            if (!cellExists(e, t)) {
                return null
            }
            var o = getRowTop(e);
            var n = o + options.rowHeight - 1;
            var i = 0;
            for (var r = 0; r < t; r++) {
                i += columns[r].width
            }
            var l = i + columns[t].width;
            return {
                top: o,
                left: i,
                bottom: n,
                right: l
            }
        }
        function resetActiveCell() {
            setActiveCellInternal(null, false)
        }
        function setFocus() {
            if (tabbingDirection == -1) {
                $focusSink[0].focus()
            } else {
                $focusSink2[0].focus()
            }
        }
        function scrollCellIntoView(e, t, o) {
            if (singleItemNgRenderer && isSingleItemNgRenderer) {
                scrollRowIntoViewSingle(e, o);//, options.rowNgRendererHeight - options.rowHeight)
            } else {

                if (gridViewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                    // var temp_options = options.rowHeight;
                    // var _temp_offset = offset;
                    // options.rowHeight = options.rowNgRendererHeight;
                    //offset = options.rowNgRendererHeight;
                    //scrollClickAndTradeRowIntoViewGetRow(e);
                    scrollRowIntoViewListOfItems(e, false);
                    // options.rowHeight = temp_options;
                    // offset = _temp_offset;

                } else {
                        scrollRowIntoView(e, o)
                }


            }
            var n = getColspan(e, t);
            var i = columnPosLeft[t]
                , r = columnPosRight[t + (n > 1 ? n - 1 : 0)]
                , l = scrollLeft + viewportW;
            if (i < scrollLeft) {
                setScrollLeft(i);
                handleScroll();
                render()
            } else if (r > l) {
                setScrollLeft(Math.min(i, r - $viewport[0].clientWidth));
                handleScroll();
                render()
            }
        }
        function setActiveCellInternal(e, t) {
            if (activeCellNode !== null) {
                makeActiveCellNormal();
                $(activeCellNode).removeClass("active");
                if (rowsCache[activeRow]) {
                    $(rowsCache[activeRow].rowNode).removeClass("active")
                }
            }
            var o = activeCellNode !== e;
            activeCellNode = e;
            if (activeCellNode != null) {
                activeRow = getRowFromNode(activeCellNode.parentNode);
                activeCell = activePosX = getCellFromNode(activeCellNode);
                $(activeCellNode).addClass("active");
                $(rowsCache[activeRow].rowNode).addClass("active");
                if (options.editable && t && isCellPotentiallyEditable(activeRow, activeCell)) {
                    clearTimeout(h_editorLoader);
                    if (options.asyncEditorLoading) {
                        h_editorLoader = setTimeout(function () {
                            makeActiveCellEditable()
                        }, options.asyncEditorLoadDelay)
                    } else {
                        makeActiveCellEditable()
                    }
                }
            } else {
                activeRow = activeCell = null
            }
            if (o) {
                trigger(self.onActiveCellChanged, getActiveCell())
            }
        }
        function clearTextSelection() {
            if (document.selection && document.selection.empty) {
                document.selection.empty()
            } else if (window.getSelection) {
                var e = window.getSelection();
                if (e && e.removeAllRanges) {
                    e.removeAllRanges()
                }
            }
        }
        function isCellPotentiallyEditable(e, t) {
            if (e < getDataLength() && !getDataItem(e)) {
                return false
            }
            if (columns[t].cannotTriggerInsert && e >= getDataLength()) {
                return false
            }
            if (!getEditor(e, t)) {
                return false
            }
            return true
        }
        function makeActiveCellNormal() {
            if (!currentEditor) {
                return
            }
            trigger(self.onBeforeCellEditorDestroy, {
                editor: currentEditor
            });
            currentEditor.destroy();
            currentEditor = null;
            if (activeCellNode) {
                var e = getDataItem(activeRow);
                $(activeCellNode).removeClass("editable invalid");
                if (e) {
                    var t = columns[activeCell];
                    var o = getFormatter(activeRow, t);
                    activeCellNode.innerHTML = o(activeRow, activeCell, getDataItemValueForColumn(e, t), t, getDataItem(activeRow));
                    invalidatePostProcessingResults(activeRow)
                }
            }
            if (navigator.userAgent.toLowerCase().match(/msie/)) {
                clearTextSelection()
            }
            getEditorLock().deactivate(editController)
        }
        function makeActiveCellEditable(e) {
            if (!activeCellNode) {
                return
            }
            if (!options.editable) {
                throw "Grid : makeActiveCellEditable : should never get called when options.editable is false"
            }
            clearTimeout(h_editorLoader);
            if (!isCellPotentiallyEditable(activeRow, activeCell)) {
                return
            }
            var t = columns[activeCell];
            var o = getDataItem(activeRow);
            if (trigger(self.onBeforeEditCell, {
                row: activeRow,
                cell: activeCell,
                item: o,
                column: t
            }) === false) {
                setFocus();
                return
            }
            getEditorLock().activate(editController);
            $(activeCellNode).addClass("editable");
            if (!e) {
                activeCellNode.innerHTML = ""
            }
            currentEditor = new (e || getEditor(activeRow, activeCell))({
                grid: self,
                gridPosition: absBox($container[0]),
                position: absBox(activeCellNode),
                container: activeCellNode,
                column: t,
                item: o || {},
                commitChanges: commitEditAndSetFocus,
                cancelChanges: cancelEditAndSetFocus
            });
            if (o) {
                currentEditor.loadValue(o)
            }
            serializedEditorValue = currentEditor.serializeValue();
            if (currentEditor.position) {
                handleActiveCellPositionChange()
            }
        }
        function commitEditAndSetFocus() {
            if (getEditorLock().commitCurrentEdit()) {
                setFocus();
                if (options.autoEdit) {
                    navigateDown()
                }
            }
        }
        function cancelEditAndSetFocus() {
            if (getEditorLock().cancelCurrentEdit()) {
                setFocus()
            }
        }
        function absBox(e) {
            var t = {
                top: e.offsetTop,
                left: e.offsetLeft,
                bottom: 0,
                right: 0,
                width: $(e).outerWidth(),
                height: $(e).outerHeight(),
                visible: true
            };
            t.bottom = t.top + t.height;
            t.right = t.left + t.width;
            var o = e.offsetParent;
            while ((e = e.parentNode) != document.body) {
                if (t.visible && e.scrollHeight != e.offsetHeight && $(e).css("overflowY") != "visible") {
                    t.visible = t.bottom > e.scrollTop && t.top < e.scrollTop + e.clientHeight
                }
                if (t.visible && e.scrollWidth != e.offsetWidth && $(e).css("overflowX") != "visible") {
                    t.visible = t.right > e.scrollLeft && t.left < e.scrollLeft + e.clientWidth
                }
                t.left -= e.scrollLeft;
                t.top -= e.scrollTop;
                if (e === o) {
                    t.left += e.offsetLeft;
                    t.top += e.offsetTop;
                    o = e.offsetParent
                }
                t.bottom = t.top + t.height;
                t.right = t.left + t.width
            }
            return t
        }
        function getActiveCellPosition() {
            return absBox(activeCellNode)
        }
        function getGridPosition() {
            return absBox($container[0])
        }
        function handleActiveCellPositionChange() {
            if (!activeCellNode) {
                return
            }
            trigger(self.onActiveCellPositionChanged, {});
            if (currentEditor) {
                var e = getActiveCellPosition();
                if (currentEditor.show && currentEditor.hide) {
                    if (!e.visible) {
                        currentEditor.hide()
                    } else {
                        currentEditor.show()
                    }
                }
                if (currentEditor.position) {
                    currentEditor.position(e)
                }
            }
        }
        function getCellEditor() {
            return currentEditor
        }
        function getActiveCell() {
            if (!activeCellNode) {
                return null
            } else {
                return {
                    row: activeRow,
                    cell: activeCell
                }
            }
        }
        function getActiveCellNode() {
            return activeCellNode
        }
        function scrollClickAndTradeRowIntoView(e) {
            var t = scrollClickAndTradeRowIntoViewGetRow(e);
            scrollTo(t);
            render()
        }
        function scrollClickAndTradeRowIntoViewGetRow(e, t) {
            t = t || data.getGroups();
            var o = 0;
            var n;
            if (t.length > 0) {
                var i = t[0];
                if (i instanceof Slick.Group) {
                    for (var r = 0; r < t.length; r++) {
                        i = t[r];
                        o += options.rowHeight;
                        if (i.collapsed == 0) {
                            if (i.groups) {
                                n = scrollClickAndTradeRowIntoViewGetRow(e, i.groups);
                                if (n != -1) {
                                    o += n;
                                    return o
                                }
                            }
                            if (i.rows) {
                                n = scrollClickAndTradeRowIntoViewGetRow(e, i.rows);
                                if (n != -1) {
                                    o += n;
                                    return o
                                }
                            }
                        }
                    }
                } else {
                    for (var r = 0; r < t.length; r++) {
                        i = t[r];
                        if (e.name == i.name) {
                            return o
                        }
                        o += options.rowNgRendererHeight - 7
                    }
                }
            } else { }
            return -1
        }

        function scrollRowIntoViewListOfItems(e, t, o) {
            var o = o == undefined ? 0 : o;
            var n = e * options.rowHeight;
            var cantidad = 0;
            var temp_item;

            for (var i_p = 0; i_p < e + 1; i_p++) {
                temp_item = getDataItem(i_p);
                if (temp_item && temp_item instanceof Slick.Group)
                    cantidad += options.rowHeight;
                else
                    cantidad += options.rowNgRendererHeight - 7;

            }

            var i = (cantidad) - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0) + o;
            if (cantidad + o > scrollTop + viewportH + offset) {
                scrollTo(t ? cantidad - options.rowNgRendererHeight : i);
                render()
            } else if (cantidad < scrollTop + offset) {
                scrollTo(t ? i : cantidad - options.rowNgRendererHeight);
                render()
            }

        }

        function scrollRowIntoView(e, t, o) {
            var o = o == undefined ? 0 : o;
            var n = e * options.rowHeight;
            var i = (e + 1) * options.rowHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0) + o;
            if ((e + 1) * options.rowHeight + o > scrollTop + viewportH + offset) {
                scrollTo(t ? n : i);
                render()
            } else if (e * options.rowHeight < scrollTop + offset) {
                scrollTo(t ? i : n);
                render()
            }
        }
        function scrollRowIntoViewSingle(e, t, o) {
            var o = o == undefined ? 0 : o;
            //var n = e * options.rowHeight;
            var cantidad = e * options.rowHeight;//5 * (options.rowNgRendererHeight - 7);
            var temp_item;

            // for (var i_p = 0; i_p < e + 1; i_p++) {
            //     temp_item = getDataItem(i_p);
            //     cantidad += options.rowHeight;
            //     // if (temp_item && temp_item instanceof Slick.Group)
            //     //     cantidad += options.rowHeight;
            //     // else
            //     //     cantidad += options.rowNgRendererHeight - 7;

            // }
            //_rowHeightSum += options.rowNgRendererHeight;
            // var i = (cantidad + options.rowHeight) - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0) + o;
            // if (cantidad + options.rowHeight + o > scrollTop + viewportH + offset) {
            //     scrollTo(t ? cantidad - options.rowNgRendererHeight : i);                
            //     render();
            // } else if (cantidad < scrollTop + offset) {                
            //     scrollTo(t ? i : cantidad - options.rowNgRendererHeight);
            //     render();
            // }
            setTimeout(function (){
                setScrollTop(cantidad - 20 );
            }, 0);
            
        }

        function scrollRowToTop(e) {
            scrollTo(e * options.rowHeight);
            render()
        }
        function getColspan(e, t) {
            var o = data.getItemMetadata && data.getItemMetadata(e);
            var n = data.getItemMetadataCallback && data.getItemMetadataCallback(e);
            if (n && n.cssClasses) {
                if (o) {
                    if (o.cssClasses) {
                        o.cssClasses = o.cssClasses.concat(" " + n.cssClasses)
                    } else {
                        o.cssClasses = n.cssClasses
                    }
                } else {
                    o = n
                }
            }
            if (!o || !o.columns) {
                return 1
            }
            var i = o.columns[columns[t].id] || o.columns[t];
            var r = i && i.colspan;
            if (r === "*") {
                r = columns.length - t
            } else {
                r = r || 1
            }
            return Number(r)
        }
        function findFirstFocusableCell(e) {
            var t = 0;
            while (t < columns.length) {
                if (canCellBeActive(e, t)) {
                    return t
                }
                t += getColspan(e, t)
            }
            return null
        }
        function findLastFocusableCell(e) {
            var t = 0;
            var o = null;
            while (t < columns.length) {
                if (canCellBeActive(e, t)) {
                    o = t
                }
                t += getColspan(e, t)
            }
            return o
        }
        function gotoRight(e, t, o) {
            if (t >= columns.length) {
                return null
            }
            do {
                t += getColspan(e, t)
            } while (t < columns.length && !canCellBeActive(e, t)); if (t < columns.length) {
                return {
                    row: e,
                    cell: t,
                    posX: t
                }
            }
            return null
        }
        function gotoLeft(e, t, o) {
            if (t <= 0) {
                return null
            }
            var n = findFirstFocusableCell(e);
            if (n === null || n >= t) {
                return null
            }
            var i = {
                row: e,
                cell: n,
                posX: n
            };
            var r;
            while (true) {
                r = gotoRight(i.row, i.cell, i.posX);
                if (!r) {
                    return null
                }
                if (r.cell >= t) {
                    return i
                }
                i = r
            }
        }
        function gotoDown(e, t, o) {
            var n;
            while (true) {
                if (++e >= getDataLength() + (options.enableAddRow ? 1 : 0)) {
                    return null
                }
                n = t = 0;
                while (t <= o) {
                    n = t;
                    t += getColspan(e, t)
                }
                if (canCellBeActive(e, n)) {
                    return {
                        row: e,
                        cell: n,
                        posX: o
                    }
                }
            }
        }
        function gotoUp(e, t, o) {
            var n;
            while (true) {
                if (--e < 0) {
                    return null
                }
                n = t = 0;
                while (t <= o) {
                    n = t;
                    t += getColspan(e, t)
                }
                if (canCellBeActive(e, n)) {
                    return {
                        row: e,
                        cell: n,
                        posX: o
                    }
                }
            }
        }
        function gotoNext(e, t, o) {
            if (e == null && t == null) {
                e = t = o = 0;
                if (canCellBeActive(e, t)) {
                    return {
                        row: e,
                        cell: t,
                        posX: t
                    }
                }
            }
            var n = gotoRight(e, t, o);
            if (n) {
                return n
            }
            var i = null;
            while (++e < getDataLength() + (options.enableAddRow ? 1 : 0)) {
                i = findFirstFocusableCell(e);
                if (i !== null) {
                    return {
                        row: e,
                        cell: i,
                        posX: i
                    }
                }
            }
            return null
        }
        function gotoPrev(e, t, o) {
            if (e == null && t == null) {
                e = getDataLength() + (options.enableAddRow ? 1 : 0) - 1;
                t = o = columns.length - 1;
                if (canCellBeActive(e, t)) {
                    return {
                        row: e,
                        cell: t,
                        posX: t
                    }
                }
            }
            var n;
            var i;
            while (!n) {
                n = gotoLeft(e, t, o);
                if (n) {
                    break
                }
                if (--e < 0) {
                    return null
                }
                t = 0;
                i = findLastFocusableCell(e);
                if (i !== null) {
                    n = {
                        row: e,
                        cell: i,
                        posX: i
                    }
                }
            }
            return n
        }
        function navigateRight() {
            return navigate("right")
        }
        function navigateLeft() {
            return navigate("left")
        }
        function navigateDown() {
            return navigate("down")
        }
        function navigateUp() {
            return navigate("up")
        }
        function navigateNext() {
            return navigate("next")
        }
        function navigatePrev() {
            return navigate("prev")
        }
        function navigate(e) {
            if (!options.enableCellNavigation) {
                return false
            }
            if (!activeCellNode && e != "prev" && e != "next") {
                return false
            }
            if (!getEditorLock().commitCurrentEdit()) {
                return true
            }
            setFocus();
            var t = {
                up: -1,
                down: 1,
                left: -1,
                right: 1,
                prev: -1,
                next: 1
            };
            tabbingDirection = t[e];
            var o = {
                up: gotoUp,
                down: gotoDown,
                left: gotoLeft,
                right: gotoRight,
                prev: gotoPrev,
                next: gotoNext
            };
            var n = o[e];
            var i = n(activeRow, activeCell, activePosX);
            if (i) {
                var r = i.row == getDataLength();
                scrollCellIntoView(i.row, i.cell, !r);
                setActiveCellInternal(getCellNode(i.row, i.cell), r || options.autoEdit);
                activePosX = i.posX;

                return true
            } else {
                setActiveCellInternal(getCellNode(activeRow, activeCell), activeRow == getDataLength() || options.autoEdit);
                return false
            }
        }
        function getCellNode(e, t) {
            if (rowsCache[e]) {
                ensureCellNodesInRowsCache(e);
                return rowsCache[e].cellNodesByColumnIdx[t]
            }
            return null
        }
        function setActiveCell(e, t) {
            if (!initialized) {
                return
            }
            if (e > getDataLength() || e < 0 || t >= columns.length || t < 0) {
                return
            }
            if (!options.enableCellNavigation) {
                return
            }
            scrollCellIntoView(e, t, false);
            setActiveCellInternal(getCellNode(e, t), false)
        }
        function canCellBeActive(e, t) {
            if (!options.enableCellNavigation || e >= getDataLength() + (options.enableAddRow ? 1 : 0) || e < 0 || t >= columns.length || t < 0) {
                return false
            }
            var o = data.getItemMetadata && data.getItemMetadata(e);
            var n = data.getItemMetadataCallback && data.getItemMetadataCallback(e);
            if (n && n.cssClasses) {
                if (o) {
                    if (o.cssClasses) {
                        o.cssClasses = o.cssClasses.concat(" " + n.cssClasses)
                    } else {
                        o.cssClasses = n.cssClasses
                    }
                } else {
                    o = n
                }
            }
            if (o && typeof o.focusable === "boolean") {
                return o.focusable
            }
            var i = o && o.columns;
            if (i && i[columns[t].id] && typeof i[columns[t].id].focusable === "boolean") {
                return i[columns[t].id].focusable
            }
            if (i && i[t] && typeof i[t].focusable === "boolean") {
                return i[t].focusable
            }
            return columns[t].focusable
        }
        function canCellBeSelected(e, t) {
            if (e >= getDataLength() || e < 0 || t >= columns.length || t < 0) {
                return false
            }
            var o = data.getItemMetadata && data.getItemMetadata(e);
            var n = data.getItemMetadataCallback && data.getItemMetadataCallback(e);
            if (n && n.cssClasses) {
                if (o) {
                    if (o.cssClasses) {
                        o.cssClasses = o.cssClasses.concat(" " + n.cssClasses)
                    } else {
                        o.cssClasses = n.cssClasses
                    }
                } else {
                    o = n
                }
            }
            if (o && typeof o.selectable === "boolean") {
                return o.selectable
            }
            var i = o && o.columns && (o.columns[columns[t].id] || o.columns[t]);
            if (i && typeof i.selectable === "boolean") {
                return i.selectable
            }
            return columns[t].selectable
        }
        function gotoCell(e, t, o) {
            if (!initialized) {
                return
            }
            if (!canCellBeActive(e, t)) {
                return
            }
            if (!getEditorLock().commitCurrentEdit()) {
                return
            }
            scrollCellIntoView(e, t, false);
            var n = getCellNode(e, t);
            setActiveCellInternal(n, o || e === getDataLength() || options.autoEdit);
            if (!currentEditor) {
                setFocus()
            }
        }
        function commitCurrentEdit() {
            var e = getDataItem(activeRow);
            var t = columns[activeCell];
            if (currentEditor) {
                if (currentEditor.isValueChanged()) {
                    var o = currentEditor.validate();
                    if (o.valid) {
                        if (activeRow < getDataLength()) {
                            var n = {
                                row: activeRow,
                                cell: activeCell,
                                editor: currentEditor,
                                serializedValue: currentEditor.serializeValue(),
                                prevSerializedValue: serializedEditorValue,
                                execute: function () {
                                    this.editor.applyValue(e, this.serializedValue);
                                    updateRow(this.row)
                                },
                                undo: function () {
                                    this.editor.applyValue(e, this.prevSerializedValue);
                                    updateRow(this.row)
                                }
                            };
                            if (options.editCommandHandler) {
                                makeActiveCellNormal();
                                options.editCommandHandler(e, t, n)
                            } else {
                                n.execute();
                                makeActiveCellNormal()
                            }
                            trigger(self.onCellChange, {
                                row: activeRow,
                                cell: activeCell,
                                item: e
                            })
                        } else {
                            var i = {};
                            currentEditor.applyValue(i, currentEditor.serializeValue());
                            makeActiveCellNormal();
                            trigger(self.onAddNewRow, {
                                item: i,
                                column: t
                            })
                        }
                        return !getEditorLock().isActive()
                    } else {
                        $(activeCellNode).addClass("invalid");
                        $(activeCellNode).stop(true, true).effect("highlight", {
                            color: "red"
                        }, 300);
                        trigger(self.onValidationError, {
                            editor: currentEditor,
                            cellNode: activeCellNode,
                            validationResults: o,
                            row: activeRow,
                            cell: activeCell,
                            column: t
                        });
                        currentEditor.focus();
                        return false
                    }
                }
                makeActiveCellNormal()
            }
            return true
        }
        function cancelCurrentEdit() {
            makeActiveCellNormal();
            return true
        }
        function rowsToRanges(e) {
            var t = [];
            var o = columns.length - 1;
            for (var n = 0; n < e.length; n++) {
                t.push(new Slick.Range(e[n], 0, e[n], o))
            }
            return t
        }
        function getSelectedRows() {
            if (!selectionModel) {
                throw "Selection model is not set"
            }
            return selectedRows
        }
        function setSelectedRows(e) {
            if (!selectionModel) {
                throw "Selection model is not set"
            }
            selectionModel.setSelectedRanges(rowsToRanges(e));
            if (!activeCellNode && e.length > 0) {
                setActiveCellInternal(getCellNode(e[e.length - 1], 0), false)
            }
        }
        function setSingleItemRendererData(e, t) {
            singleItemNgRendererData = e;
            setSingleItemViewMode(Slick.GridAdvancedItemViewMode.VISIBLE);
            if (t) {
                scrollToItemNgRenderer(e)
            }
        }
        function scrollToSymbol(e) {
            scrollToItemNgRenderer(e)
        }
        function getSingleItemRendererData() {
            return singleItemNgRendererData
        }
        function setSingleItemViewMode(e) {
            singleItemViewMode = e;
            invalidate();
        }
        function getSingleItemViewMode() {
            return singleItemViewMode
        }
        function setGridViewMode(e) {
            gridViewMode = e;
            if (gridViewMode == Slick.GridAdvancedMode.SINGLE_ITEM) {
                for (var t = 0; t < listNgRenderers.length; t++) {
                    listNgRenderers[t].remove()
                }
                areListNgRenderersInDOM = false
            }
            invalidate();
        }
        function getGridViewMode() {
            return gridViewMode
        }
        function setNgScope(e) {
            ngScope = e
        }
        function setNgParse(e) {
            ngParse = e
        }
        function removeNgScope() {
            ngScope = null
        }
        function setNgRendererTemplate(e, t) {
            if (ngTemplate && t == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                templateChanged = true
            }
            ngTemplate = e
        }
        function hasNgRendererTemplate() {
            return ngTemplate != null
        }

        function _setRowNgRendererHeight(value) {
            options.rowNgRendererHeight = value;

        }

        function createNgItemRenderers() {
            var e, t;
            if (templateChanged) {
                t = numVisibleRows + 1;
                for (e = 0; e < listNgRenderers.length; e++) {
                    listNgRenderers[e].remove()
                }
                listNgRenderers = [];
                listNgScopes = [];
                void 0;
                for (e = 0; e < t; e++) {
                    listNgRenderers[e] = ngTemplate();//ngScope.$new(), function() {});
                    $canvas.append(listNgRenderers[e].getHtml());
                    listNgScopes[e] = listNgRenderers[e];//.children().scope()
                }
                areListNgRenderersInDOM = true;
                templateChanged = false
            } else {
                if (numVisibleRows + 1 > listNgRenderers.length) {
                    t = numVisibleRows + 1 - listNgRenderers.length;
                    void 0;
                    for (e = 0; e < t; e++) {
                        listNgRenderers[listNgRenderers.length] = ngTemplate();//ngScope.$new(), function() {});
                        $canvas.append(listNgRenderers[listNgRenderers.length - 1].getHtml());
                        listNgScopes[listNgScopes.length] = listNgRenderers[listNgRenderers.length - 1];//.children().scope()
                    }
                    areListNgRenderersInDOM = true
                }
            }
        }
        function updateNgLineRenderer() {
            $canvas.append(singleItemNgRenderer);
            singleItemNgRenderer.invalidate(true);
            invalidateAllRows()
        }
        function getItemNgRendererDataIndex(e, t) {
            t = t || data.getGroups();
            var o = 0;
            var n;
            if (t.length > 0) {
                var i = t[0];
                if (i instanceof Slick.Group) {
                    for (var r = 0; r < t.length; r++) {
                        i = t[r];
                        o += 1;
                        if (i.collapsed == 0) {
                            if (i.groups) {
                                n = getItemNgRendererDataIndex(e, i.groups);
                                if (n != -1) {
                                    o += n;
                                    return o
                                }
                            }
                            if (i.rows) {
                                n = getItemNgRendererDataIndex(e, i.rows);
                                if (n != -1) {
                                    o += n;
                                    return o
                                }
                            }
                        }
                    }
                } else {
                    for (var r = 0; r < t.length; r++) {
                        i = t[r];
                        o += 1;
                        if (i.name == e.name) {
                            return o
                        }
                    }
                }
                return -1
            } else { }
            return -1
        }
        function scrollToItemNgRenderer(e) {
            if (!e) {
                return
            }
            var t = getItemNgRendererDataIndex(e);
            if (gridViewMode == Slick.GridAdvancedMode.SINGLE_ITEM) {
                if (t != -1) {
                    scrollRowIntoViewSingle(t, true);//, options.rowNgRendererHeight - options.rowHeight)
                }
            } else if (gridViewMode == Slick.GridAdvancedMode.LIST_OF_ITEMS) {
                if (t != -1) {
                    scrollClickAndTradeRowIntoView(e)
                }
            }
        }
        function showNgLineRenderer(e, t) {
            singleItemNgRenderer = e;
            if (t) {
                scrollToItemNgRenderer(singleItemNgRendererData)
            }
            $canvas.append(singleItemNgRenderer.getHtml());
            invalidateAllRows()
        }
        function hasNgLineRenderer() {
            return singleItemNgRenderer != null
        }
        function removeNgLineRenderer() {
            hideNgLineRenderer();
            if (!options.ngRendererClean && singleItemNgRenderer) {
                singleItemNgRenderer.remove();
                singleItemNgRenderer = null
            }
        }
        function hideNgLineRenderer() {
            if (singleItemNgRendererData) {
                singleItemNgRendererData = null;
                if (singleItemNgRenderer) {
                    if (options.ngRendererClean) {
                        singleItemNgRenderer.remove();
                        singleItemNgRenderer = null
                    } else {
                        singleItemNgRenderer.detach()
                    }
                }
                setSingleItemViewMode(Slick.GridAdvancedItemViewMode.COLLAPSED)
            }
        }
        this.debug = function () {
            var e = "";
            e += "\n" + "counter_rows_rendered:  " + counter_rows_rendered;
            e += "\n" + "counter_rows_removed:  " + counter_rows_removed;
            e += "\n" + "renderedRows:  " + renderedRows;
            e += "\n" + "numVisibleRows:  " + numVisibleRows;
            e += "\n" + "maxSupportedCssHeight:  " + maxSupportedCssHeight;
            e += "\n" + "n(umber of pages):  " + n;
            e += "\n" + "(current) page:  " + page;
            e += "\n" + "page height (ph):  " + ph;
            e += "\n" + "vScrollDir:  " + vScrollDir;
            void 0
        }
            ;
        this.eval = function (expr) {
            return eval(expr)
        }
            ;
        $.extend(this, {
            slickGridVersion: "2.1",
            onScroll: new Slick.Event,
            onSort: new Slick.Event,
            onHeaderMouseEnter: new Slick.Event,
            onHeaderMouseLeave: new Slick.Event,
            onHeaderContextMenu: new Slick.Event,
            onHeaderClick: new Slick.Event,
            onHeaderCellRendered: new Slick.Event,
            onBeforeHeaderCellDestroy: new Slick.Event,
            onHeaderRowCellRendered: new Slick.Event,
            onBeforeHeaderRowCellDestroy: new Slick.Event,
            onMouseEnter: new Slick.Event,
            onMouseLeave: new Slick.Event,
            onClick: new Slick.Event,
            onSingleClick: new Slick.Event,
            onDblClick: new Slick.Event,
            onContextMenu: new Slick.Event,
            onKeyDown: new Slick.Event,
            onAddNewRow: new Slick.Event,
            onValidationError: new Slick.Event,
            onViewportChanged: new Slick.Event,
            onColumnsReordered: new Slick.Event,
            onColumnsResized: new Slick.Event,
            onColumnsSet: new Slick.Event,
            onCellChange: new Slick.Event,
            onBeforeEditCell: new Slick.Event,
            onBeforeCellEditorDestroy: new Slick.Event,
            onBeforeDestroy: new Slick.Event,
            onActiveCellChanged: new Slick.Event,
            onActiveCellPositionChanged: new Slick.Event,
            onDragInit: new Slick.Event,
            onDragStart: new Slick.Event,
            onDrag: new Slick.Event,
            onDragEnd: new Slick.Event,
            onSelectedRowsChanged: new Slick.Event,
            onCellCssStylesChanged: new Slick.Event,
            onMenuGroupByChange: new Slick.Event,
            registerPlugin: registerPlugin,
            unregisterPlugin: unregisterPlugin,
            getColumns: getColumns,
            setColumns: setColumns,
            getColumnIndex: getColumnIndex,
            updateColumnHeader: updateColumnHeader,
            setSortColumn: setSortColumn,
            setSortColumns: setSortColumns,
            getSortColumns: getSortColumns,
            resetSortColumns: resetSortColumns,
            autosizeColumns: autosizeColumns,
            getOptions: getOptions,
            setOptions: setOptions,
            getData: getData,
            getDataLength: getDataLength,
            getDataItem: getDataItem,
            getDataItems: getDataItems,
            setData: setData,
            getSelectionModel: getSelectionModel,
            setSelectionModel: setSelectionModel,
            getSelectedRows: getSelectedRows,
            setSelectedRows: setSelectedRows,
            pauseRendering: pauseRendering,
            playRendering: playRendering,
            render: render,
            invalidate: invalidate,
            invalidateRow: invalidateRow,
            invalidateRows: invalidateRows,
            invalidateRowsData: invalidateRowsData,
            invalidateAllRows: invalidateAllRows,
            invalidateRowHeight: invalidateRowHeight,
            updateCell: updateCell,
            updateRow: updateRow,
            getViewport: getVisibleRange,
            getRenderedRange: getRenderedRange,
            resizeCanvas: resizeCanvas,
            updateRowCount: updateRowCount,
            scrollRowIntoView: scrollRowIntoView,
            scrollRowToTop: scrollRowToTop,
            scrollCellIntoView: scrollCellIntoView,
            scrollToSymbol: scrollToSymbol,
            getCanvasNode: getCanvasNode,
            getDragContainer: getDragContainer,
            focus: setFocus,
            getCellFromPoint: getCellFromPoint,
            getCellFromEvent: getCellFromEvent,
            getActiveCell: getActiveCell,
            setActiveCell: setActiveCell,
            getActiveCellNode: getActiveCellNode,
            getActiveCellPosition: getActiveCellPosition,
            resetActiveCell: resetActiveCell,
            editActiveCell: makeActiveCellEditable,
            getCellEditor: getCellEditor,
            getCellNode: getCellNode,
            getCellNodeBox: getCellNodeBox,
            canCellBeSelected: canCellBeSelected,
            canCellBeActive: canCellBeActive,
            navigatePrev: navigatePrev,
            navigateNext: navigateNext,
            navigateUp: navigateUp,
            navigateDown: navigateDown,
            navigateLeft: navigateLeft,
            navigateRight: navigateRight,
            gotoCell: gotoCell,
            getTopPanel: getTopPanel,
            setTopPanelVisibility: setTopPanelVisibility,
            setHeaderRowVisibility: setHeaderRowVisibility,
            getHeaderRow: getHeaderRow,
            getHeaderRowColumn: getHeaderRowColumn,
            getGridPosition: getGridPosition,
            flashCell: flashCell,
            addCellCssStyles: addCellCssStyles,
            setCellCssStyles: setCellCssStyles,
            removeCellCssStyles: removeCellCssStyles,
            getCellCssStyles: getCellCssStyles,
            init: finishInitialization,
            destroy: destroy,
            getEditorLock: getEditorLock,
            getEditController: getEditController,
            showNgLineRenderer: showNgLineRenderer,
            hasNgLineRenderer: hasNgLineRenderer,
            updateNgLineRenderer: updateNgLineRenderer,
            hideNgLineRenderer: hideNgLineRenderer,
            removeNgLineRenderer: removeNgLineRenderer,
            setGridViewMode: setGridViewMode,
            getGridViewMode: getGridViewMode,
            setSingleItemRendererData: setSingleItemRendererData,
            getSingleItemRendererData: getSingleItemRendererData,
            setSingleItemViewMode: setSingleItemViewMode,
            getSingleItemViewMode: getSingleItemViewMode,
            setNgScope: setNgScope,
            setNgParse: setNgParse,
            removeNgScope: removeNgScope,
            setNgRendererTemplate: setNgRendererTemplate,
            hasNgRendererTemplate: hasNgRendererTemplate,
            setRowNgRendererHeight: _setRowNgRendererHeight
        });
        init()
    }
}
)(jQuery);
(function ($) {
    $.extend(true, window, {
        Slick: {
            Data: {
                DataView: DataView,
                Aggregators: {
                    Avg: AvgAggregator,
                    Min: MinAggregator,
                    Max: MaxAggregator,
                    Sum: SumAggregator,
                    Volume: _Volume,//s
                    WeightedAverageByVolume: _WeightedAverageByVolume,//r
                    NetProfit: _NetProfit,//l
                    VolumeAndMargin: _VolumeAndMargin//c

                }
            }
        }
    });


    /***
     * A sample Model implementation.
     * Provides a filtered view of the underlying data.
     *
     * Relies on the data item having an "id" property uniquely identifying it.
     */
    function DataView(options) {
        var self = this;

        var defaults = {
            disableRowProvider: null,
            groupItemMetadataProvider: null,
            inlineFilters: false,
            sortGroups: false,
            emptyTotalAsLast: false
        };


        // private
        var idProperty = "id";  // property holding a unique row id
        var items = [];         // data by index
        var rows = [];          // data by row
        var idxById = {};       // indexes by id
        var rowsById = null;    // rows by id; lazy-calculated
        var filter = null;      // filter function
        var updated = null;     // updated item ids
        var suspend = false;    // suspends the recalculation
        var sortAsc = true;
        var fastSortField;
        var sortComparer;
        var refreshHints = {};
        var prevRefreshHints = {};
        var filterArgs;
        var filteredItems = [];
        var compiledFilter;
        var compiledFilterWithCaching;
        var filterCache = [];

        // grouping
        var groupingInfoDefaults = {
            getter: null,
            formatter: null,
            comparer: function (a, b) {
                return (a.value === b.value ? 0 :
                    (a.value > b.value ? 1 : -1)
                );
            },
            predefinedValues: [],
            aggregators: [],
            aggregateEmpty: false,
            aggregateCollapsed: false,
            aggregateChildGroups: false,
            collapsed: false,
            displayTotalsRow: true,
            lazyTotalsCalculation: false
        };
        var groupingInfos = [];
        var groups = [];
        var toggledGroupsByLevel = [];
        var groupingDelimiter = ':|:';

        var pagesize = 0;
        var pagenum = 0;
        var totalRows = 0;

        // events
        var onRowCountChanged = new Slick.Event();
        var onRowsChanged = new Slick.Event();
        var onPagingInfoChanged = new Slick.Event();
        var onGroupCollapsedExpanded = new Slick.Event;//N

        options = $.extend(true, {}, defaults, options);


        function beginUpdate() {
            suspend = true;
        }

        function endUpdate() {
            suspend = false;
            refresh();
        }

        function setRefreshHints(hints) {
            refreshHints = hints;
        }

        function setFilterArgs(args) {
            filterArgs = args;
        }

        function updateIdxById(startingIndex) {
            startingIndex = startingIndex || 0;
            var id;
            for (var i = startingIndex, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id === undefined) {
                    throw new Error("Each data element must implement a unique 'id' property");
                }
                idxById[id] = i;
            }
        }

        function ensureIdUniqueness() {
            var id;
            for (var i = 0, l = items.length; i < l; i++) {
                id = items[i][idProperty];
                if (id === undefined || idxById[id] !== i) {
                    throw new Error("Each data element must implement a unique 'id' property");
                }
            }
        }

        function getItems() {
            return items;
        }

        function setItems(data, objectIdProperty) {
            if (objectIdProperty !== undefined) {
                idProperty = objectIdProperty;
            }
            items = filteredItems = data;
            idxById = {};
            updateIdxById();
            ensureIdUniqueness();
            refresh();
        }

        function setPagingOptions(args) {
            if (args.pageSize != undefined) {
                pagesize = args.pageSize;
                pagenum = pagesize ? Math.min(pagenum, Math.max(0, Math.ceil(totalRows / pagesize) - 1)) : 0;
            }

            if (args.pageNum != undefined) {
                pagenum = Math.min(args.pageNum, Math.max(0, Math.ceil(totalRows / pagesize) - 1));
            }

            onPagingInfoChanged.notify(getPagingInfo(), null, self);

            refresh();
        }

        function getPagingInfo() {
            var totalPages = pagesize ? Math.max(1, Math.ceil(totalRows / pagesize)) : 1;
            return { pageSize: pagesize, pageNum: pagenum, totalRows: totalRows, totalPages: totalPages, dataView: self };
        }

        function sort(comparer, ascending) {
            sortAsc = ascending;
            sortComparer = comparer;
            fastSortField = null;
            if (ascending === false) {
                items.reverse();
            }
            items.sort(comparer);
            if (ascending === false) {
                items.reverse();
            }
            idxById = {};
            updateIdxById();
            refresh();
        }

        /***
         * Provides a workaround for the extremely slow sorting in IE.
         * Does a [lexicographic] sort on a give column by temporarily overriding Object.prototype.toString
         * to return the value of that field and then doing a native Array.sort().
         */
        function fastSort(field, ascending) {
            sortAsc = ascending;
            fastSortField = field;
            sortComparer = null;
            var oldToString = Object.prototype.toString;
            Object.prototype.toString = (typeof field == "function") ? field : function () {
                return this[field]
            };
            // an extra reversal for descending sort keeps the sort stable
            // (assuming a stable native sort implementation, which isn't true in some cases)
            if (ascending === false) {
                items.reverse();
            }
            items.sort();
            Object.prototype.toString = oldToString;
            if (ascending === false) {
                items.reverse();
            }
            idxById = {};
            updateIdxById();
            refresh();
        }

        function reSort() {
            if (sortComparer) {
                sort(sortComparer, sortAsc);
            } else if (fastSortField) {
                fastSort(fastSortField, sortAsc);
            }
        }

        function getFilteredItems() {
            return filteredItems;
        }


        function getFilter() {
            return filter;
        }

        function setFilter(filterFn) {
            filter = filterFn;
            if (options.inlineFilters) {
                compiledFilter = compileFilter();
                compiledFilterWithCaching = compileFilterWithCaching();
            }
            refresh();
        }

        function getGrouping() {
            return groupingInfos;
        }

        function setGrouping(groupingInfo) {
            if (!options.groupItemMetadataProvider) {
                options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            }

            groups = [];
            toggledGroupsByLevel = [];
            groupingInfo = groupingInfo || [];
            groupingInfos = (groupingInfo instanceof Array) ? groupingInfo : [groupingInfo];

            for (var i = 0; i < groupingInfos.length; i++) {
                var gi = groupingInfos[i] = $.extend(true, {}, groupingInfoDefaults, groupingInfos[i]);
                gi.getterIsAFn = typeof gi.getter === "function";

                // pre-compile accumulator loops
                gi.compiledAccumulators = [];
                var idx = gi.aggregators.length;
                while (idx--) {
                    gi.compiledAccumulators[idx] = compileAccumulatorLoop(gi.aggregators[idx]);
                }

                toggledGroupsByLevel[i] = {};
            }

            refresh();
        }

        /**
         * @deprecated Please use {@link setGrouping}.
         */
        function groupBy(valueGetter, valueFormatter, sortComparer) {
            if (valueGetter == null) {
                setGrouping([]);
                return;
            }

            setGrouping({
                getter: valueGetter,
                formatter: valueFormatter,
                comparer: sortComparer
            });
        }

        /**
         * @deprecated Please use {@link setGrouping}.
         */
        function setAggregators(groupAggregators, includeCollapsed) {
            if (!groupingInfos.length) {
                throw new Error("At least one grouping must be specified before calling setAggregators().");
            }

            groupingInfos[0].aggregators = groupAggregators;
            groupingInfos[0].aggregateCollapsed = includeCollapsed;

            setGrouping(groupingInfos);
        }

        function getItemByIdx(i) {
            return items[i];
        }

        function getIdxById(id) {
            return idxById[id];
        }

        function ensureRowsByIdCache() {
            if (!rowsById) {
                rowsById = {};
                for (var i = 0, l = rows.length; i < l; i++) {
                    rowsById[rows[i][idProperty]] = i;
                }
            }
        }

        function getRowByItem(item) {
            ensureRowsByIdCache();
            return rowsById[item[idProperty]];
        }

        function getRowById(id) {
            ensureRowsByIdCache();
            return rowsById[id];
        }

        function getItemById(id) {
            return items[idxById[id]];
        }

        function mapItemsToRows(itemArray) {
            var rows = [];
            ensureRowsByIdCache();
            for (var i = 0, l = itemArray.length; i < l; i++) {
                var row = rowsById[itemArray[i][idProperty]];
                if (row != null) {
                    rows[rows.length] = row;
                }
            }
            return rows;
        }

        function mapIdsToRows(idArray) {
            var rows = [];
            ensureRowsByIdCache();
            for (var i = 0, l = idArray.length; i < l; i++) {
                var row = rowsById[idArray[i]];
                if (row != null) {
                    rows[rows.length] = row;
                }
            }
            return rows;
        }

        function mapRowsToIds(rowArray) {
            var ids = [];
            for (var i = 0, l = rowArray.length; i < l; i++) {
                if (rowArray[i] < rows.length) {
                    ids[ids.length] = rows[rowArray[i]][idProperty];
                }
            }
            return ids;
        }

        function updateItem(id, item) {
            if (idxById[id] === undefined || id !== item[idProperty]) {
                throw new Error("Invalid or non-matching id");
            }
            items[idxById[id]] = item;
            if (!updated) {
                updated = {};
            }
            updated[id] = true;
            refresh();
        }

        function insertItem(insertBefore, item) {
            items.splice(insertBefore, 0, item);
            updateIdxById(insertBefore);
            refresh();
        }

        function addItem(item) {
            items.push(item);
            updateIdxById(items.length - 1);
            refresh();
        }

        function deleteItem(id) {
            var idx = idxById[id];
            if (idx === undefined) {
                throw new Error("Invalid id");
            }
            delete idxById[id];
            items.splice(idx, 1);
            updateIdxById(idx);
            refresh();
        }

        function sortedAddItem(item) {
            if (!sortComparer) {
                throw new Error("sortedAddItem() requires a sort comparer, use sort()");
            }
            insertItem(sortedIndex(item), item);
        }

        function sortedUpdateItem(id, item) {
            if (idxById[id] === undefined || id !== item[idProperty]) {
                throw new Error("Invalid or non-matching id " + idxById[id]);
            }
            if (!sortComparer) {
                throw new Error("sortedUpdateItem() requires a sort comparer, use sort()");
            }
            var oldItem = getItemById(id);
            if (sortComparer(oldItem, item) !== 0) {
                // item affects sorting -> must use sorted add
                deleteItem(id);
                sortedAddItem(item);
            }
            else { // update does not affect sorting -> regular update works fine
                updateItem(id, item);
            }
        }

        function sortedIndex(searchItem) {
            var low = 0, high = items.length;

            while (low < high) {
                var mid = low + high >>> 1;
                if (sortComparer(items[mid], searchItem) === -1) {
                    low = mid + 1;
                }
                else {
                    high = mid;
                }
            }
            return low;
        }

        function getLength() {
            return rows.length;
        }

        function getItem(i) {
            var item = rows[i];

            // if this is a group row, make sure totals are calculated and update the title
            if (item && item.__group && item.totals && !item.totals.initialized) {
                var gi = groupingInfos[item.level];
                if (!gi.displayTotalsRow) {
                    calculateTotals(item.totals);
                    item.title = gi.formatter ? gi.formatter(item) : item.value;
                }
            }
            // if this is a totals row, make sure it's calculated
            else if (item && item.__groupTotals && !item.initialized) {
                calculateTotals(item);
            }

            return item;
        }

        function getItemMetadata(i) {
            var item = rows[i];
            if (item === undefined) {
                return null;
            }

            // overrides for grouping rows
            if (item.__group) {
                return options.groupItemMetadataProvider.getGroupRowMetadata(item);
            }

            // overrides for totals rows
            if (item.__groupTotals) {
                return options.groupItemMetadataProvider.getTotalsRowMetadata(item);
            }

            return null;
        }

        function expandCollapseAllGroups(level, collapse) {
            if (level == null) {
                for (var i = 0; i < groupingInfos.length; i++) {
                    toggledGroupsByLevel[i] = {};
                    groupingInfos[i].collapsed = collapse;
                }
            } else {
                toggledGroupsByLevel[level] = {};
                groupingInfos[level].collapsed = collapse;
            }
            refresh();

            onGroupCollapsedExpanded.notify({
                groupName: null,
                collapse: collapse
            }, null, self);

        }

        /**
         * @param level {Number} Optional level to collapse.  If not specified, applies to all levels.
         */
        function collapseAllGroups(level) {
            expandCollapseAllGroups(level, true);
        }

        /**
         * @param level {Number} Optional level to expand.  If not specified, applies to all levels.
         */
        function expandAllGroups(level) {
            expandCollapseAllGroups(level, false);
        }

        function expandCollapseGroup(level, groupingKey, collapse) {
            toggledGroupsByLevel[level][groupingKey] = groupingInfos[level].collapsed ^ collapse;
            refresh();
            onGroupCollapsedExpanded.notify({
                groupName: groupingKey,
                collapse: collapse
            }, null, self);
        }

        /**
         * @param varArgs Either a Slick.Group's "groupingKey" property, or a
         *     variable argument list of grouping values denoting a unique path to the row.  For
         *     example, calling collapseGroup('high', '10%') will collapse the '10%' subgroup of
         *     the 'high' group.
         */
        function collapseGroup(varArgs) {
            var args = Array.prototype.slice.call(arguments);
            var arg0 = args[0];
            if (args.length == 1 && arg0.indexOf(groupingDelimiter) != -1) {
                expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, true);
            } else {
                expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), true);
            }
        }

        /**
         * @param varArgs Either a Slick.Group's "groupingKey" property, or a
         *     variable argument list of grouping values denoting a unique path to the row.  For
         *     example, calling expandGroup('high', '10%') will expand the '10%' subgroup of
         *     the 'high' group.
         */
        function expandGroup(varArgs) {
            var args = Array.prototype.slice.call(arguments);
            var arg0 = args[0];
            if (args.length == 1 && arg0.indexOf(groupingDelimiter) != -1) {
                expandCollapseGroup(arg0.split(groupingDelimiter).length - 1, arg0, false);
            } else {
                expandCollapseGroup(args.length - 1, args.join(groupingDelimiter), false);
            }
        }

        function getGroups() {
            return groups;
        }

        function extractGroups(rows, parentGroup) {
            var group;
            var val;
            var groups = [];
            var groupsByVal = {};
            var r;
            var level = parentGroup ? parentGroup.level + 1 : 0;
            var gi = groupingInfos[level];

            for (var i = 0, l = gi.predefinedValues.length; i < l; i++) {
                val = gi.predefinedValues[i];
                group = groupsByVal[val];
                if (!group) {
                    group = new Slick.Group();
                    group.value = val;
                    group.level = level;
                    group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
                    groups[groups.length] = group;
                    groupsByVal[val] = group;
                }
            }

            for (var i = 0, l = rows.length; i < l; i++) {
                r = rows[i];
                val = gi.getterIsAFn ? gi.getter(r) : r[gi.getter];
                group = groupsByVal[val];
                if (!group) {
                    group = new Slick.Group();
                    group.value = val;
                    group.level = level;
                    group.groupingKey = (parentGroup ? parentGroup.groupingKey + groupingDelimiter : '') + val;
                    groups[groups.length] = group;
                    groupsByVal[val] = group;
                }

                group.rows[group.count++] = r;
            }

            if (level < groupingInfos.length - 1) {
                for (var i = 0; i < groups.length; i++) {
                    group = groups[i];
                    group.groups = extractGroups(group.rows, group);
                }
            }

            groups.sort(groupingInfos[level].comparer);

            return groups;
        }

        function calculateTotals(totals) {
            var group = totals.group;
            var gi = groupingInfos[group.level];
            var isLeafLevel = (group.level == groupingInfos.length);
            var agg, idx = gi.aggregators.length;

            if (!isLeafLevel && gi.aggregateChildGroups) {
                // make sure all the subgroups are calculated
                var i = group.groups.length;
                while (i--) {
                    if (!group.groups[i].totals.initialized) {
                        calculateTotals(group.groups[i].totals);
                    }
                }
            }

            while (idx--) {
                agg = gi.aggregators[idx];
                agg.init();
                if (!isLeafLevel && gi.aggregateChildGroups) {
                    gi.compiledAccumulators[idx].call(agg, group.groups);
                } else {
                    gi.compiledAccumulators[idx].call(agg, group.rows);
                }
                agg.storeResult(totals);
            }
            totals.initialized = true;
        }

        function addGroupTotals(group) {
            var gi = groupingInfos[group.level];
            var totals = new Slick.GroupTotals();
            totals.group = group;
            group.totals = totals;
            if (!gi.lazyTotalsCalculation) {
                calculateTotals(totals);
            }
        }

        function addTotals(groups, level) {
            level = level || 0;
            var gi = groupingInfos[level];
            var groupCollapsed = gi.collapsed;
            var toggledGroups = toggledGroupsByLevel[level];
            var idx = groups.length, g;
            while (idx--) {
                g = groups[idx];

                if (g.collapsed && !gi.aggregateCollapsed) {
                    continue;
                }

                // Do a depth-first aggregation so that parent group aggregators can access subgroup totals.
                if (g.groups) {
                    addTotals(g.groups, level + 1);
                }

                if (gi.aggregators.length && (
                    gi.aggregateEmpty || g.rows.length || (g.groups && g.groups.length))) {
                    addGroupTotals(g);
                }

                g.collapsed = groupCollapsed ^ toggledGroups[g.groupingKey];
                g.title = gi.formatter ? gi.formatter(g) : g.value;
            }
        }

        function flattenGroupedRows(groups, level) {
            level = level || 0;
            var gi = groupingInfos[level];
            var groupedRows = [], rows, gl = 0, g;
            for (var i = 0, l = groups.length; i < l; i++) {
                g = groups[i];
                groupedRows[gl++] = g;

                if (!g.collapsed) {
                    rows = g.groups ? flattenGroupedRows(g.groups, level + 1) : g.rows;
                    for (var j = 0, jj = rows.length; j < jj; j++) {
                        groupedRows[gl++] = rows[j];
                    }
                }

                if (g.totals && gi.displayTotalsRow && (!g.collapsed || gi.aggregateCollapsed)) {
                    groupedRows[gl++] = g.totals;
                }
            }
            return groupedRows;
        }

        function getFunctionInfo(fn) {
            var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
            var matches = fn.toString().match(fnRegex);
            return {
                params: matches[1].split(","),
                body: matches[2]
            };
        }

        function compileAccumulatorLoop(aggregator) {
            var accumulatorInfo = getFunctionInfo(aggregator.accumulate);
            var fn = new Function(
                "_items",
                "for (var " + accumulatorInfo.params[0] + ", _i=0, _il=_items.length; _i<_il; _i++) {" +
                accumulatorInfo.params[0] + " = _items[_i]; " +
                accumulatorInfo.body +
                "}"
            );
            fn.displayName = fn.name = "compiledAccumulatorLoop";
            return fn;
        }

        function compileFilter() {
            var filterInfo = getFunctionInfo(filter);

            var filterPath1 = "{ continue _coreloop; }$1";
            var filterPath2 = "{ _retval[_idx++] = $item$; continue _coreloop; }$1";
            // make some allowances for minification - there's only so far we can go with RegEx
            var filterBody = filterInfo.body
                .replace(/return false\s*([;}]|\}|$)/gi, filterPath1)
                .replace(/return!1([;}]|\}|$)/gi, filterPath1)
                .replace(/return true\s*([;}]|\}|$)/gi, filterPath2)
                .replace(/return!0([;}]|\}|$)/gi, filterPath2)
                .replace(/return ([^;}]+?)\s*([;}]|$)/gi,
                "{ if ($1) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");

            // This preserves the function template code after JS compression,
            // so that replace() commands still work as expected.
            var tpl = [
                //"function(_items, _args) { ",
                "var _retval = [], _idx = 0; ",
                "var $item$, $args$ = _args; ",
                "_coreloop: ",
                "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
                "$item$ = _items[_i]; ",
                "$filter$; ",
                "} ",
                "return _retval; "
                //"}"
            ].join("");
            tpl = tpl.replace(/\$filter\$/gi, filterBody);
            tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
            tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

            var fn = new Function("_items,_args", tpl);
            fn.displayName = fn.name = "compiledFilter";
            return fn;
        }

        function compileFilterWithCaching() {
            var filterInfo = getFunctionInfo(filter);

            var filterPath1 = "{ continue _coreloop; }$1";
            var filterPath2 = "{ _cache[_i] = true;_retval[_idx++] = $item$; continue _coreloop; }$1";
            // make some allowances for minification - there's only so far we can go with RegEx
            var filterBody = filterInfo.body
                .replace(/return false\s*([;}]|\}|$)/gi, filterPath1)
                .replace(/return!1([;}]|\}|$)/gi, filterPath1)
                .replace(/return true\s*([;}]|\}|$)/gi, filterPath2)
                .replace(/return!0([;}]|\}|$)/gi, filterPath2)
                .replace(/return ([^;}]+?)\s*([;}]|$)/gi,
                "{ if ((_cache[_i] = $1)) { _retval[_idx++] = $item$; }; continue _coreloop; }$2");

            // This preserves the function template code after JS compression,
            // so that replace() commands still work as expected.
            var tpl = [
                //"function(_items, _args, _cache) { ",
                "var _retval = [], _idx = 0; ",
                "var $item$, $args$ = _args; ",
                "_coreloop: ",
                "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
                "$item$ = _items[_i]; ",
                "if (_cache[_i]) { ",
                "_retval[_idx++] = $item$; ",
                "continue _coreloop; ",
                "} ",
                "$filter$; ",
                "} ",
                "return _retval; "
                //"}"
            ].join("");
            tpl = tpl.replace(/\$filter\$/gi, filterBody);
            tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
            tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

            var fn = new Function("_items,_args,_cache", tpl);
            fn.displayName = fn.name = "compiledFilterWithCaching";
            return fn;
        }

        function uncompiledFilter(items, args) {
            var retval = [], idx = 0;

            for (var i = 0, ii = items.length; i < ii; i++) {
                if (filter(items[i], args)) {
                    retval[idx++] = items[i];
                }
            }

            return retval;
        }

        function uncompiledFilterWithCaching(items, args, cache) {
            var retval = [], idx = 0, item;

            for (var i = 0, ii = items.length; i < ii; i++) {
                item = items[i];
                if (cache[i]) {
                    retval[idx++] = item;
                } else if (filter(item, args)) {
                    retval[idx++] = item;
                    cache[i] = true;
                }
            }

            return retval;
        }

        function getFilteredAndPagedItems(items) {
            if (filter) {
                var batchFilter = options.inlineFilters ? compiledFilter : uncompiledFilter;
                var batchFilterWithCaching = options.inlineFilters ? compiledFilterWithCaching : uncompiledFilterWithCaching;

                if (refreshHints.isFilterNarrowing) {
                    filteredItems = batchFilter(filteredItems, filterArgs);
                } else if (refreshHints.isFilterExpanding) {
                    filteredItems = batchFilterWithCaching(items, filterArgs, filterCache);
                } else if (!refreshHints.isFilterUnchanged) {
                    filteredItems = batchFilter(items, filterArgs);
                }
            } else {
                // special case:  if not filtering and not paging, the resulting
                // rows collection needs to be a copy so that changes due to sort
                // can be caught
                filteredItems = pagesize ? items : items.concat();
            }

            // get the current page
            var paged;
            if (pagesize) {
                if (filteredItems.length <= pagenum * pagesize) {
                    if (filteredItems.length === 0) {
                        pagenum = 0;
                    } else {
                        pagenum = Math.floor((filteredItems.length - 1) / pagesize);
                    }
                }
                paged = filteredItems.slice(pagesize * pagenum, pagesize * pagenum + pagesize);
            } else {
                paged = filteredItems;
            }
            return { totalRows: filteredItems.length, rows: paged };
        }

        function getRowDiffs(rows, newRows) {
            var item, r, eitherIsNonData, diff = [];
            var from = 0, to = newRows.length;

            if (refreshHints && refreshHints.ignoreDiffsBefore) {
                from = Math.max(0,
                    Math.min(newRows.length, refreshHints.ignoreDiffsBefore));
            }

            if (refreshHints && refreshHints.ignoreDiffsAfter) {
                to = Math.min(newRows.length,
                    Math.max(0, refreshHints.ignoreDiffsAfter));
            }

            for (var i = from, rl = rows.length; i < to; i++) {
                if (i >= rl) {
                    diff[diff.length] = i;
                } else {
                    item = newRows[i];
                    r = rows[i];

                    if ((groupingInfos.length && (eitherIsNonData = (item.__nonDataRow) || (r.__nonDataRow)) &&
                        item.__group !== r.__group ||
                        item.__group && !item.equals(r))
                        || (eitherIsNonData &&
                            // no good way to compare totals since they are arbitrary DTOs
                            // deep object comparison is pretty expensive
                            // always considering them 'dirty' seems easier for the time being
                            (item.__groupTotals || r.__groupTotals))
                        || item[idProperty] != r[idProperty]
                        || (updated && updated[item[idProperty]])
                    ) {
                        diff[diff.length] = i;
                    }
                }
            }
            return diff;
        }

        function recalc(_items) {
            rowsById = null;

            if (refreshHints.isFilterNarrowing != prevRefreshHints.isFilterNarrowing ||
                refreshHints.isFilterExpanding != prevRefreshHints.isFilterExpanding) {
                filterCache = [];
            }

            var filteredItems = getFilteredAndPagedItems(_items);
            totalRows = filteredItems.totalRows;
            var newRows = filteredItems.rows;

            groups = [];
            if (groupingInfos.length) {
                groups = extractGroups(newRows);
                if (groups.length) {
                    addTotals(groups);
                    newRows = flattenGroupedRows(groups);
                }
            }

            var diff = getRowDiffs(rows, newRows);

            rows = newRows;

            return diff;
        }

        function refresh() {
            if (suspend) {
                return;
            }

            var countBefore = rows.length;
            var totalRowsBefore = totalRows;

            var diff = recalc(items, filter); // pass as direct refs to avoid closure perf hit

            // if the current page is no longer valid, go to last page and recalc
            // we suffer a performance penalty here, but the main loop (recalc) remains highly optimized
            if (pagesize && totalRows < pagenum * pagesize) {
                pagenum = Math.max(0, Math.ceil(totalRows / pagesize) - 1);
                diff = recalc(items, filter);
            }

            updated = null;
            prevRefreshHints = refreshHints;
            refreshHints = {};

            if (totalRowsBefore !== totalRows) {
                onPagingInfoChanged.notify(getPagingInfo(), null, self);
            }
            if (countBefore !== rows.length) {
                onRowCountChanged.notify({ previous: countBefore, current: rows.length, dataView: self }, null, self);
            }
            if (diff.length > 0) {
                onRowsChanged.notify({ rows: diff, dataView: self }, null, self);
            }
        }

        /***
         * Wires the grid and the DataView together to keep row selection tied to item ids.
         * This is useful since, without it, the grid only knows about rows, so if the items
         * move around, the same rows stay selected instead of the selection moving along
         * with the items.
         *
         * NOTE:  This doesn't work with cell selection model.
         *
         * @param grid {Slick.Grid} The grid to sync selection with.
         * @param preserveHidden {Boolean} Whether to keep selected items that go out of the
         *     view due to them getting filtered out.
         * @param preserveHiddenOnSelectionChange {Boolean} Whether to keep selected items
         *     that are currently out of the view (see preserveHidden) as selected when selection
         *     changes.
         * @return {Slick.Event} An event that notifies when an internal list of selected row ids
         *     changes.  This is useful since, in combination with the above two options, it allows
         *     access to the full list selected row ids, and not just the ones visible to the grid.
         * @method syncGridSelection
         */
        function syncGridSelection(grid, preserveHidden, preserveHiddenOnSelectionChange) {
            var self = this;
            var inHandler;
            var selectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
            var onSelectedRowIdsChanged = new Slick.Event();

            function setSelectedRowIds(rowIds) {
                if (selectedRowIds.join(",") == rowIds.join(",")) {
                    return;
                }

                selectedRowIds = rowIds;

                onSelectedRowIdsChanged.notify({
                    "grid": grid,
                    "ids": selectedRowIds,
                    "dataView": self
                }, new Slick.EventData(), self);
            }

            function update() {
                if (selectedRowIds.length > 0) {
                    inHandler = true;
                    var selectedRows = self.mapIdsToRows(selectedRowIds);
                    if (!preserveHidden) {
                        setSelectedRowIds(self.mapRowsToIds(selectedRows));
                    }
                    grid.setSelectedRows(selectedRows);
                    inHandler = false;
                }
            }

            grid.onSelectedRowsChanged.subscribe(function (e, args) {
                if (inHandler) { return; }
                var newSelectedRowIds = self.mapRowsToIds(grid.getSelectedRows());
                if (!preserveHiddenOnSelectionChange || !grid.getOptions().multiSelect) {
                    setSelectedRowIds(newSelectedRowIds);
                } else {
                    // keep the ones that are hidden
                    var existing = $.grep(selectedRowIds, function (id) { return self.getRowById(id) === undefined; });
                    // add the newly selected ones
                    setSelectedRowIds(existing.concat(newSelectedRowIds));
                }
            });

            this.onRowsChanged.subscribe(update);

            this.onRowCountChanged.subscribe(update);

            return onSelectedRowIdsChanged;
        }

        function syncGridCellCssStyles(grid, key) {
            var hashById;
            var inHandler;

            // since this method can be called after the cell styles have been set,
            // get the existing ones right away
            storeCellCssStyles(grid.getCellCssStyles(key));

            function storeCellCssStyles(hash) {
                hashById = {};
                for (var row in hash) {
                    var id = rows[row][idProperty];
                    hashById[id] = hash[row];
                }
            }

            function update() {
                if (hashById) {
                    inHandler = true;
                    ensureRowsByIdCache();
                    var newHash = {};
                    for (var id in hashById) {
                        var row = rowsById[id];
                        if (row != undefined) {
                            newHash[row] = hashById[id];
                        }
                    }
                    grid.setCellCssStyles(key, newHash);
                    inHandler = false;
                }
            }

            grid.onCellCssStylesChanged.subscribe(function (e, args) {
                if (inHandler) { return; }
                if (key != args.key) { return; }
                if (args.hash) {
                    storeCellCssStyles(args.hash);
                } else {
                    grid.onCellCssStylesChanged.unsubscribe(styleChanged);
                    self.onRowsChanged.unsubscribe(update);
                    self.onRowCountChanged.unsubscribe(update);
                }
            });

            this.onRowsChanged.subscribe(update);

            this.onRowCountChanged.subscribe(update);
        }

        function getIdProperty() {//H
            return idProperty;
        }

        function updateGridSelection(e, t) {//qe
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

        function updateIdxForElements(e) {//O
            var t = items.length;
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
            updateIdxById(t);
        }

        function itemExists(index, item) {//pe
            if (idxById[index] === undefined || index !== item[idProperty]) {
                return false
            }
            return true
        }

        function resetSort() {//X
            fastSortField = null;
            sortComparer = null;
        }

        function setGroupTotalsSort(e, t) {//ae
            b = {
                sortField: e,
                sortAsc: t
            }
        }

        function compareByFieldFunction(e, t, o) {//Y
            return _compareFunction(e[o], t[o])
        }

        function _compareFunction(e, o, n) {//q
            if (options.emptyTotalAsLast && options.sortGroups) {
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

        $.extend(this, {
            // methods
   
            "getIdProperty":getIdProperty,
            "beginUpdate": beginUpdate,
            "endUpdate": endUpdate,
            "setPagingOptions": setPagingOptions,
            "getPagingInfo": getPagingInfo,
            "getItems": getItems,
            "setItems": setItems,
            "setFilter": setFilter,
            "getFilter": getFilter,
            "getFilteredItems": getFilteredItems,
            "sort": sort,
            "fastSort": fastSort,
            "reSort": reSort,
            "setGrouping": setGrouping,
            "getGrouping": getGrouping,
            "groupBy": groupBy,
            "setAggregators": setAggregators,
            "collapseAllGroups": collapseAllGroups,
            "expandAllGroups": expandAllGroups,
            "collapseGroup": collapseGroup,
            "expandGroup": expandGroup,
            "getGroups": getGroups,
            "getIdxById": getIdxById,
            "getRowByItem": getRowByItem,
            "getRowById": getRowById,
            "getItemById": getItemById,
            "getItemByIdx": getItemByIdx,
            "mapItemsToRows": mapItemsToRows,
            "mapRowsToIds": mapRowsToIds,
            "mapIdsToRows": mapIdsToRows,
            "setRefreshHints": setRefreshHints,
            "setFilterArgs": setFilterArgs,
            "refresh": refresh,
            "updateItem": updateItem,
            "insertItem": insertItem,
            "addItem": addItem,
            "deleteItem": deleteItem,
            "sortedAddItem": sortedAddItem,
            "sortedUpdateItem": sortedUpdateItem,
            "syncGridSelection": syncGridSelection,
            "syncGridCellCssStyles": syncGridCellCssStyles,

            // data provider methods
            "getLength": getLength,
            "getItem": getItem,
            "getItemMetadata": getItemMetadata,

            // events
            "onRowCountChanged": onRowCountChanged,
            "onRowsChanged": onRowsChanged,
            "onPagingInfoChanged": onPagingInfoChanged,
            "onGroupCollapsedExpanded": onGroupCollapsedExpanded, //N,
            "updateGridSelection" : updateGridSelection,
            "updateIdxForElements" : updateIdxForElements,
            "itemExists" : itemExists,
            "resetSort" : resetSort,
            "setGroupTotalsSort" : setGroupTotalsSort,
            "compareByFieldFunction" : compareByFieldFunction
        });
    }

    function AvgAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.count_ = 0;
            this.nonNullCount_ = 0;
            this.sum_ = 0;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            this.count_++;
            if (val != null && val !== "" && !isNaN(val)) {
                this.nonNullCount_++;
                this.sum_ += parseFloat(val);
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.avg) {
                groupTotals.avg = {};
            }
            if (this.nonNullCount_ != 0) {
                groupTotals.avg[this.field_] = this.sum_ / this.nonNullCount_;
            }
        };
    }

    function MinAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.min_ = null;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            if (val != null && val !== "" && !isNaN(val)) {
                if (this.min_ == null || val < this.min_) {
                    this.min_ = val;
                }
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.min) {
                groupTotals.min = {};
            }
            groupTotals.min[this.field_] = this.min_;
        }
    }

    function MaxAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.max_ = null;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            if (val != null && val !== "" && !isNaN(val)) {
                if (this.max_ == null || val > this.max_) {
                    this.max_ = val;
                }
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.max) {
                groupTotals.max = {};
            }
            groupTotals.max[this.field_] = this.max_;
        }
    }

    function SumAggregator(field) {
        this.field_ = field;

        this.init = function () {
            this.sum_ = null;
        };

        this.accumulate = function (item) {
            var val = item[this.field_];
            if (val != null && val !== "" && !isNaN(val)) {
                this.sum_ += parseFloat(val);
            }
        };

        this.storeResult = function (groupTotals) {
            if (!groupTotals.sum) {
                groupTotals.sum = {};
            }
            groupTotals.sum[this.field_] = this.sum_;
        }
    }

    function _Volume(e) {//a
        this.field_ = e;
        this.init = function () {
            this.sum_ = null;
        };

        this.accumulate = function (e) {
            var t = e[this.field_];
            if (t !== null && t !== "" && t !== NaN) {
                if (e.side === 0) {
                    this.sum_ += parseFloat(t);
                } else {
                    this.sum_ -= parseFloat(t);
                }
            }
        };

        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {};
            }
            e.sum[this.field_] = this.sum_;
        };

        this.storeDirectlyResult = function (e) {
            e[this.field_] = this.sum_;
        };
    }

    function _WeightedAverageByVolume(e) {//r
        this.field_ = e;
        this.init = function () {
            this.sum_ = null;
            this.totalVolume_ = null;
        }
            ;
        this.accumulate = function (e) {
            var t = e[this.field_];
            var o = e["volume"];
            if (t != null && t !== "" && t !== NaN && o != null && o !== "" && o !== NaN) {
                this.sum_ += parseFloat(t) * parseFloat(o);
                this.totalVolume_ += parseFloat(o);
            }
        }
            ;
        this.storeResult = function (e) {
            if (!e.sum) {
                e.sum = {}
            }
            e.sum[this.field_] = this.sum_ / this.totalVolume_;
        };
        this.storeDirectlyResult = function (e) {
            e[this.field_] = this.sum_;
        };
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

    // TODO:  add more built-in aggregators
    // TODO:  merge common aggregators in one to prevent needles iterating

})(jQuery);


(function (e) {
    e.extend(true, window, {
        Slick: {
            Editors: {
                Number: numberEditor
            }
        }
    });
    function numberEditor(t) {
        var o;
        var n;
        var i = this;
        var r = 0;
        this.init = function () {
            i.precision = parseInt(t.column.precision);
            var r = Math.pow(10, -i.precision);
            o = e("<INPUT type=number class='editor-text' />");
            n = 0;
            o[0].step = r;
            o.val(n);
            o[0].defaultValue = n;
            o.bind("keydown.nav", function (t) {
                if (t.keyCode === e.ui.keyCode.LEFT || t.keyCode === e.ui.keyCode.RIGHT) {
                    t.stopImmediatePropagation()
                }
            });
            o.appendTo(t.container);
            o.focus().select()
        }
            ;
        this.destroy = function () {
            o.remove()
        }
            ;
        this.focus = function () {
            o.focus()
        }
            ;
        this.loadValue = function (e) {
            n = e[t.column.field];
            o.val(n);
            o[0].defaultValue = n;
            o.select()
        }
            ;
        this.serializeValue = function () {
            return parseFloat(parseFloat(o.val()).toFixed(i.precision))
        }
            ;
        this.applyValue = function (e, o) {
            e[t.column.field] = o
        }
            ;
        this.isValueChanged = function () {
            return !(o.val() == "" && n == null) && o.val() != n
        }
            ;
        this.validate = function () {
            if (isNaN(o.val())) {
                return {
                    valid: false,
                    msg: "Please enter a valid number"
                }
            }
            return {
                valid: true,
                msg: null
            }
        }
            ;
        this.init()
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            Formatters: {
                Volume: _volume,//o
                Date: _Date,//p
                DateDMY: _DateDMY,//C
                HoursMinutes: _HoursMinutes,//w
                HoursMinutesSeconds: _HoursMinutesSeconds,//R
                ExpirationDate: _ExpirationDate,//u
                DisabledExpirationDate: _DisabledExpirationDate,//h
                StopLoss: _StopLoss,//c
                TakeProfit: _TakeProfit,//d
                DisabledStopLoss: _DisabledStopLoss,//f
                DisabledTakeProfit: _DisabledTakeProfit,//g
                SumTotals: _SumTotals,//k
                Price: _Price,//a
                Money: _Money,//r
                Margin: _Margin,//l
                Profit: _Profit,//i
                Origin: _Origin,//s
                Field: _Field,//t
                DoubleUpReverseColumn: _DoubleUpReverseColumn,//I
                CloseColumn: _CloseColumn,//A
                DeleteColumn: _DeleteColumn,//N
                GroupRowFirstCell: _GroupRowFirstCell,//F
                CountryColumn: _CountryColumn,//T
                AggregatedPrice: _AggregatedPrice,//n
                ImpactColumn: _ImpactColumn,//P
                OptionOrderType: _OptionOrderType,//x
                OptionExpiresIn: _OptionExpiresIn,//M
                OptionStatus: _OptionStatus,//$
                TwoDecimalPlacesFormatter: _TwoDecimalPlacesFormatter,//H
                PercentFormatter: _PercentFormatter, //L
                MarketPrice: _MarketPrice //v
            }
        }
    });
    function _Field(e, t, o, n, i) {//t
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else {
            return o
        }
    }
    function _volume(e, t, o, n, i) {//_volume
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle">' + D(i.totals, n) + "</div>"
        } else {
            return FormatUtils.formatVolume(MAE.I18nService, o)
        }
    }
    function _AggregatedPrice(e, t, o, n, i) {//n
        if (i instanceof Slick.Group) {
            var r = i.rows[0].precision;
            return '<div  class="slick-group-toggle">' + E(i.totals, n, r) + "</div>"
        } else {
            return FormatUtils.formatPrice(o, i.precision)
        }
    }
    function _Profit(e, t, o, n, i) {//i
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle">' + S(i.totals, n) + "</div>"
        } else {
            return total_profit(o);
        }
    }
    function _Money(e, t, o, n, i) {//r
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle">' + y(i.totals, n) + "</div>";
        } else {
            if (o === null) {
                return "";
            }
            return FormatUtils.formatMoney(o);
        }
    }
    function _MarketPrice(e, t, o, n, i) {//v
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle">' + y(i.totals, n) + "</div>";
        } else {
            if (o === null || o === 0) {
                return "-";
            }
            return FormatUtils.formatMoney(o, i.precision);
        }
    }
    function _Margin(e, t, o, n, i) {//l
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle">' + y(i.totals, n) + "</div>"
        } else {
            if (i.isHedged) {
                if (o === null) {
                    return "";
                }
                var r = "";
                r = "*";
                return '<span title="' + MAE.I18nService.getFrequentString("OPEN_TRADES.MARGIN_TOOLTIP") + '">' + FormatUtils.formatMoney(o) + r + "</span>"
            } else {
                return FormatUtils.formatMoney(o);
            }
        }
    }
    function _Price(e, t, o, n, i) {//a
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle">' + k(i.totals, n, i.rows[0].precision) + "</div>";
        } else {
            return FormatUtils.formatThousandSeparator(o);
        }
    }
    function _Origin(e, t, o, n, i) {//s
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else {
            return "<span class='xs-origin-cell' title='" + MAE.I18nService.getFrequentString("ORDERS.ORIGIN_" + o) + "'>" + MAE.I18nService.getFrequentString("ORDERS.SHORT_ORIGIN_" + o) + "</span>"
        }
    }
    function _StopLoss(e, t, o, n, i) {//c
        if (i instanceof Slick.Group) {
            if (i.recordType !== RecordType.PENDING && SymbolKeyUtils.getAssetClassFromKey(i.groupingKey) == AssetClass.STC) {
                var r = "";
                if (i.volumesData && i.volumesData.closeableVolume !== 0) {
                    r = r.concat('<span id="addSlButton" class="xs-ot-sltp-add-btn" title="' + n.rendererTitle + '"></span>')
                }
                if (i.volumesData && i.volumesData.pendingStopCount > 0) {
                    r = r.concat('<span class="xs-ot-is-sltp" title="' + MAE.I18nService.getFrequentString("OPEN_TRADES.STC_HAS_PENDING_SL") + '"></span>')
                }
                if (i.volumesData && i.volumesData.closeableVolume !== 0 && (i.volumesData && i.volumesData.pendingStopCount > 0)) {
                    r = '<div class="xs-ot-is-sltp-wrap">' + r + "</div>"
                }
                return r
            }
            return '<div  class="slick-group-toggle"></div>'
        } else if (i.assetClass == AssetClass.STC || i.dictPosReferenceId !== PosReferenceId.DEFAULT) {
            return ""
        } else if (o == 0) {
            return '<span id="addSlButton" class="xs-ot-sltp-add-btn" title="' + n.rendererTitle + '"></span>'
        } else {
            return '<span id="modifySlButton" class="xs-ot-sltp-value">' + FormatUtils.formatPrice(o, i.precision) + (i.offset != 0 ? "*" : "") + "</span>" + '<span id="removeSlButton" class="xs-ot-close-btn"></span>'
        }
    }
    function _TakeProfit(e, t, o, n, i) {//d
        if (i instanceof Slick.Group) {
            if (i.recordType !== RecordType.PENDING && SymbolKeyUtils.getAssetClassFromKey(i.groupingKey) == AssetClass.STC) {
                var r = "";
                if (i.volumesData && i.volumesData.closeableVolume !== 0) {
                    r = r.concat('<span id="addSlButton" class="xs-ot-sltp-add-btn" title="' + n.rendererTitle + '"></span>')
                }
                if (i.volumesData && i.volumesData.pendingLimitCount > 0) {
                    r = r.concat('<span class="xs-ot-is-sltp" title="' + MAE.I18nService.getFrequentString("OPEN_TRADES.STC_HAS_PENDING_TP") + '"></span>')
                }
                if (i.volumesData && i.volumesData.closeableVolume !== 0 && (i.volumesData && i.volumesData.pendingLimitCount > 0)) {
                    r = '<div class="xs-ot-is-sltp-wrap">' + r + "</div>"
                }
                return r
            }
            return '<div  class="slick-group-toggle"></div>'
        } else if (i.assetClass == AssetClass.STC || i.dictPosReferenceId !== PosReferenceId.DEFAULT) {
            return ""
        } else if (o == 0) {
            return '</span><span id="addTpButton" class="xs-ot-sltp-add-btn" title="' + n.rendererTitle + '"></span>'
        } else {
            return '<span id="modifyTpButton" class="xs-ot-sltp-value">' + FormatUtils.formatPrice(o, i.precision) + "</span>" + '<span id="removeTpButton" class="xs-ot-close-btn"></span>'
        }
    }
    function _ExpirationDate(e, t, o, n, i) {//u
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else if (!o) {
            if (i.dictPosReferenceId === PosReferenceId.DEFAULT) {
                return '<span id="pendingsAddExpirationButton" class="xs-ot-sltp-add-btn"></span>'
            } else {
                return ""
            }
        } else {
            var r = new Date(o);
            var l = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate(), r.getUTCHours(), r.getUTCMinutes(), r.getUTCSeconds(), r.getUTCMilliseconds());
            var a = new Date(l);
            var s = v(a);
            return '<span id="pendingsAddExpirationButton" class="xs-ot-sltp-value">' + s + "</span>" + '<span id="pendingsRemoveExpirationButton" class="xs-ot-close-btn"></span>'
        }
    }
    function _DisabledStopLoss(e, t, o, n, i) {//f
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else if (o == 0) {
            return ""
        } else {
            return '<span id="modifySlButton" class="xs-ot-sltp-value">' + FormatUtils.formatPrice(o, i.precision) + (i.offset != 0 ? "*" : "") + "</span>" + '<span id="removeSlButton" class="xs-ot-close-btn"></span>'
        }
    }
    function _DisabledTakeProfit(e, t, o, n, i) {//g
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else if (o == 0) {
            return ""
        } else {
            return '<span id="modifyTpButton" class="xs-ot-sltp-value">' + FormatUtils.formatPrice(o, i.precision) + "</span>" + '<span id="removeTpButton" class="xs-ot-close-btn"></span>'
        }
    }
    function _DisabledExpirationDate(e, t, o, n, i) {//h
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else if (!o) {
            return ""
        } else {
            var r = new Date(o);
            var l = Date.UTC(r.getFullYear(), r.getMonth(), r.getDate(), r.getHours(), r.getMinutes(), r.getSeconds(), r.getMilliseconds());
            var a = r.getTimezoneOffset() * 6e4;
            var s = new Date(l);
            var c = v(s);
            return '<span id="pendingsAddExpirationButton" class="xs-ot-sltp-value">' + c + "</span>" + '<span id="pendingsRemoveExpirationButton" class="xs-ot-close-btn"></span>'
        }
    }
    function v(e) {
        return FormatDateTimeUtils.formatFullDate(e)
    }
    function _Date(e, t, o, n, i) {//p
        if (!o || i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else {
            var r = new Date(o);
            var l = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate(), r.getUTCHours(), r.getUTCMinutes(), r.getUTCSeconds(), r.getUTCMilliseconds());
            var a = new Date(l);
            return v(a)
        }
    }
    function m(e) {
        return FormatDateTimeUtils.formatDateDDMMY(e)
    }
    function _DateDMY(e, t, o, n, i) {//C
        if (!o || i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        } else {
            var r = new Date(o);
            var l = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate(), r.getUTCHours(), r.getUTCMinutes(), r.getUTCSeconds(), r.getUTCMilliseconds());
            var a = new Date(l);
            return m(a)
        }
    }
    function _HoursMinutes(e, t, o, n, i) {//w
        if (!o || i instanceof Slick.Group) {
            return ""
        } else {
            var r = new Date(o);
            var l = Date.UTC(r.getFullYear(), r.getMonth(), r.getDate(), r.getHours(), r.getMinutes(), r.getSeconds(), r.getMilliseconds());
            var a = r.getTimezoneOffset() * 6e4;
            var s = new Date(l);
            var c = new Date(s).toISOString();
            return c.substring(11, 16)
        }
    }
    function _HoursMinutesSeconds(e, t, o, n, i) {//R
        if (!o || i instanceof Slick.Group) {
            return ""
        } else {
            var r = new Date(o);
            var l = Date.UTC(r.getFullYear(), r.getMonth(), r.getDate(), r.getHours(), r.getMinutes(), r.getSeconds(), r.getMilliseconds());
            var a = r.getTimezoneOffset() * 6e4;
            var s = new Date(l);
            var c = new Date(s).toISOString();
            return c.substring(11, 19)
        }
    }
    function S(e, t) {
        var o = e.sum && e.sum[t.field];
        if (o != null) {
            if (o >= 0) {
                return '<span class="slickgrid-sum-total-positive slick-group-toggle">' + FormatUtils.formatMoney(Math.round(parseFloat(o) * 100) / 100) + "</span>"
            } else {
                return '<span class="slickgrid-sum-total-negative slick-group-toggle">' + FormatUtils.formatMoney(Math.round(parseFloat(o) * 100) / 100) + "</span>"
            }
        }
        return ""
    }
    function total_profit(e) {//b
        if (e != null) {
            if (e >= 0) {
                return '<span' + (e > 0 ? ' class="slickgrid-sum-total-positive">' : ">") + FormatUtils.formatMoney(e) + "</span>";
            } else {
                return '<span class="slickgrid-sum-total-negative">' + FormatUtils.formatMoney(e) + "</span>";
            }
        }
        return "";
    }
    function y(e, t) {
        var o = e.sum && e.sum[t.field];
        if (o != null) {
            return '<span class="slickgrid-sum-total  slick-group-toggle">' + FormatUtils.formatMoney(Math.round(parseFloat(o) * 100) / 100) + "</span>"
        }
        return "";
    }
    function _SumTotals(e, t, o) {//k
        var n = e.sum && e.sum[t.field];
        if (n != null) {
            return '<span class="slickgrid-sum-total slick-group-toggle">' + FormatUtils.formatPrice(Math.round(parseFloat(n) * 100) / 100, o) + "</span>"
        }
        return ""
    }
    function D(e, t) {
        var o = e.sum && e.sum[t.field];
        if (o != null) {
            return '<span class="slickgrid-sum-total slick-group-toggle">' + FormatUtils.formatVolume(MAE.I18nService, Math.round(parseFloat(o) * 100) / 100) + "</span>"
        }
        return "";
    }
    function E(e, t, o) {
        var n = e.sum && e.sum[t.field];
        if (n != null) {
            return '<span class="slickgrid-sum-total slick-group-toggle">' + FormatUtils.formatPrice(n, o) + "</span>"
        }
        return "";
    }
    function _DoubleUpReverseColumn(e, t, o, n, i) {//I
        if (i instanceof Slick.Group) {
            return "";
        }
        return '<span id="doubleUpTradeBtn" class="xs-ot-doubleUp-btn" title="Double up"></span>' + '<span id="reverseTradeBtn" class="xs-ot-reverse-btn" title="Reverse"></span>'
    }
    function _CountryColumn(e, t, o, n, i) {//T
        if (i instanceof Slick.Group) {
            return "";
        }
        if (o.toLowerCase() === "uk") {
            return '<span id="countryFlag" class="img-thumbnail flag flag-icon-background flag-icon-gb' + '" title="' + o.toUpperCase() + '"></span>'
        }
        return '<span id="countryFlag" class="img-thumbnail flag flag-icon-background flag-icon-' + o.toLowerCase() + '" title="' + o.toUpperCase() + '"></span>'
    }
    function _OptionOrderType(e, t, o, n, i) {//x
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>';
        }
        if (o) {
            return '<span class="xs-option-open-orders-up"></span>';
        } else {
            return '<span class="xs-option-open-orders-down"></span>';
        }
    }
    function _OptionStatus(e, t, o, n, i) {//$
        return "<span>" + MAE.I18nService.getFrequentString("OPTION.HISTORY.STATUS_TYPE.STAT_" + o) + "</span>";
    }
    function _OptionExpiresIn(e, t, o, n, i) {//M
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>';
        }
        return ' <div class="row progressBox"> <div style="width: 80%}"></div> </div>';
    }
    function _ImpactColumn(e, t, o, n, i) {//P
        if (i instanceof Slick.Group) {
            return "";
        }
        var r = "";
        if (o == 1) {
            r = MAE.I18nService.getFrequentString("CALENDAR.IMPACT_LOW")
        } else if (o == 2) {
            r = MAE.I18nService.getFrequentString("CALENDAR.IMPACT_MEDIUM")
        } else if (o == 3) {
            r = MAE.I18nService.getFrequentString("CALENDAR.IMPACT_HIGH")
        }
        return '<span id="countryFlag" class="c-grid-impact-' + o + '" title="' + r + '"></span>'
    }
    function _CloseColumn(e, t, o, n, i) {//A
        if (i instanceof Slick.Group) {
            return '<span id="ordersCloseTradeBtn" class="xs-ot-group-close-btn"></span>'
        }
        if (i.$deleting) {
            return '<span id="ordersCloseTradeBtn" class="xs-ot-close-pending-btn"></span>'
        } else {
            return '<span id="ordersCloseTradeBtn" class="xs-ot-close-btn"></span>'
        }
    }
    function _DeleteColumn(e, t, o, n, i) {//N
        if (i instanceof Slick.Group) {
            return '<div  class="slick-group-toggle"></div>'
        }
        if (i.$deleting) {
            return '<span id="pendingsDeleteTradeBtn" class="xs-ot-close-pending-btn"></span>'
        } else {
            return '<span id="pendingsDeleteTradeBtn" class="xs-ot-close-btn"></span>'
        }
    }
    function _TwoDecimalPlacesFormatter(e, t, o, n, i) {//H
        if (typeof o === "number") {
            return FormatUtils.formatPrice(o, 2);
        }
        return ""
    }
    function _PercentFormatter(e, t, o, n, i) {//L
        if (typeof o === "number") {
            return FormatUtils.formatPrice(o, 2) + "%"
        }
        return ""
    }
    function _GroupRowFirstCell(e, t, o, n, i) {//F
        return '<span class="slickgrid-group-row-firstCell-icon"></span><span class="slickgrid-group-row-firstCell-value">' + o + "</span>"
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            Data: {
                GroupItemMetadataProvider: _groupItemMetadataProvider
            }
        }
    });
    function _groupItemMetadataProvider(t) {
        var o;
        var n = {
            groupCssClass: "slick-group",
            groupTitleCssClass: "slick-group-title",
            totalsCssClass: "slick-group-totals",
            groupFocusable: true,
            totalsFocusable: false,
            toggleCssClass: "slick-group-toggle",
            additionalToggleCssClasses: [],
            toggleExpandedCssClass: "expanded",
            toggleCollapsedCssClass: "collapsed",
            enableExpandCollapse: true,
            groupCellFormatter: _groupCellFormatter,
            colspan: "1"
        };
        t = e.extend(true, {}, n, t);
        function _groupCellFormatter(e, o, n, i, r) {
            if (!t.enableExpandCollapse) {
                return r.title
            }
            var l = r.level * 10 + "px";
            return "<span class='" + t.toggleCssClass + " " + (r.collapsed ? t.toggleCollapsedCssClass : t.toggleExpandedCssClass) + "' style='margin-left:" + l + "'>" + "</span>" + "<span class='" + t.groupTitleCssClass + "' level='" + r.level + "'>" + r.title + "</span>"
        }
        function _formatter_totalRows(e, t, o, n, i) {//r
            return n.groupTotalsFormatter && n.groupTotalsFormatter(i, n) || ""
        }
        function _init(e) {//l
            o = e;
            o.onClick.subscribe(_onClick);
            o.onKeyDown.subscribe(_onKeyDown)
        }
        function _destroy() {//a
            if (o) {
                o.onClick.unsubscribe(_onClick);
                o.onKeyDown.unsubscribe(_onKeyDown)
            }
        }
        function _hasToggleCssClass(e) {//s
            if (e.hasClass(t.toggleCssClass)) {
                return true
            } else if (t.additionalToggleCssClasses.length > 0) {
                for (var o = 0; o < t.additionalToggleCssClasses.length; o++) {
                    if (e.hasClass(t.additionalToggleCssClasses[o])) {
                        return true
                    }
                }
            }
            return false
        }
        function _onClick(t, o) {//c
            var n = this.getDataItem(o.row);
            if (n && n instanceof Slick.Group && _hasToggleCssClass(e(t.target))) {
                if (n.collapsed) {
                    this.getData().expandGroup(n.groupingKey)
                } else {
                    this.getData().collapseGroup(n.groupingKey)
                }
                t.preventDefault()
            }
        }
        function _onKeyDown(o, n) {//d
            if (t.enableExpandCollapse && o.which == e.ui.keyCode.SPACE) {
                var i = this.getActiveCell();
                if (i) {
                    var r = this.getDataItem(i.row);
                    if (r && r instanceof Slick.Group) {
                        if (r.collapsed) {
                            this.getData().expandGroup(r.groupingKey)
                        } else {
                            this.getData().collapseGroup(r.groupingKey)
                        }
                        o.stopImmediatePropagation();
                        o.preventDefault()
                    }
                }
            }
        }
        function _getGroupRowMetadata(e) {//u
            return {
                selectable: false,
                focusable: t.groupFocusable,
                cssClasses: t.groupCssClass,
                columns: {
                    0: {
                        colspan: t.colspan,
                        formatter: t.groupCellFormatter,
                        editor: null
                    }
                }
            }
        }
        function _getTotalsRowMetadata(e) {//f
            return {
                selectable: false,
                focusable: t.totalsFocusable,
                cssClasses: t.totalsCssClass,
                formatter: _formatter_totalRows,
                editor: null
            }
        }
        return {
            init: _init,//l
            destroy: _destroy,//a
            getGroupRowMetadata: _getGroupRowMetadata,//u
            getTotalsRowMetadata: _getTotalsRowMetadata//f
        }
    }
}
)(jQuery);

(function (e) {
    e.extend(true, window, {
        Slick: {
            RowMoveManager: _RowMoveManager //t
        }
    });
    function _RowMoveManager(t) {
        var o;
        var n;
        var i;
        var r;
        var l = this;
        var a = new Slick.EventHandler;
        var s = {
            cancelEditOnDrag: false,
            moveOneRowOnly: false,
            dragOutsideCallback: false
        };
        var c;
        var d = false;
        function _init(r) {//u
            t = e.extend(true, {}, s, t);
            o = r;
            n = o.getCanvasNode();
            i = o.getDragContainer();
            a.subscribe(o.onDragInit, _onDragInit).subscribe(o.onDragStart, _onDragStart).subscribe(o.onDrag, _onDrag).subscribe(o.onDragEnd, _onDragEnd)
        }
        function _destroy() {//f
            a.unsubscribeAll()
        }
        function _onDragInit(e, t) { //
            e.stopImmediatePropagation();
            c = n.getBoundingClientRect();
            void 0
        }
        function _onDragStart(l, a) {//h
            var s = o.getCellFromEvent(l);
            if (t.cancelEditOnDrag && o.getEditorLock().isActive()) {
                o.getEditorLock().cancelCurrentEdit()
            }
            if (o.getEditorLock().isActive() || !/move|selectAndMove/.test(o.getColumns()[s.cell].behavior)) {
                return false
            }
            var c = o.getDataItem(s.row);
            if (c && c.rows) {
                return false
            }
            r = true;
            l.stopImmediatePropagation();
            var d;
            if (t.moveOneRowOnly) {
                d = []
            } else {
                d = o.getSelectedRows()
            }
            if (d.length == 0 || e.inArray(s.row, d) == -1) {
                d = [s.row];
                if (!t.moveOneRowOnly) {
                    o.setSelectedRows(d)
                }
            }
            var u = o.getOptions().rowHeight;
            a.selectedRows = d;
            a.selectionProxy = e("<div class='slick-reorder-proxy'/>").css("position", "absolute").css("zIndex", "99999").css("width", e(n).innerWidth()).css("height", u * d.length).appendTo(n);
            a.guide = e("<div class='slick-reorder-guide'/>").css("position", "absolute").css("zIndex", "99998").css("width", e(n).innerWidth()).css("top", -1e3).appendTo(n);
            a.dragOutside = e("<div class='slick-drag-marker'><span class='slick-drag-marker-label'></span><span class='slick-drag-marker-icon'></span></div>").css("position", "absolute").css("zIndex", "99998").css("top", -1e3).appendTo(i);
            a.dragOutsideLabel = a.dragOutside.find(".slick-drag-marker-label");
            a.insertBefore = -1;
            var c = o.getDataItem(a.selectedRows[0]);
            if (c) {
                a.dragOutsideLabel[0].innerHTML = c.name;
                if (t.dragOutsideCallback) {
                    t.dragOutsideCallback("ITEM_START_DRAG", {
                        event: l,
                        item: c,
                        items: [c]
                    })
                }
            }
        }
        function _onDrag(i, a) {//v
            if (!r) {
                return
            }
            var s = c;
            if (t.dragOutsideCallback && (i.clientY > s.bottom || i.clientY < s.top || i.clientX < s.left || i.clientX > s.right)) {
                d = true
            } else {
                d = false
            }
            i.stopImmediatePropagation();
            var u = i.pageY - e(n).offset().top;
            a.dragOutside.css("top", i.pageY);
            a.dragOutside.css("left", i.pageX);
            if (!d) {
                if (a.dragOutside.hasClass("slick-drag-outside")) {
                    a.dragOutside.removeClass("slick-drag-outside")
                }
                a.selectionProxy.css("top", u - 5);
                var f = Math.max(0, Math.min(Math.round(u / o.getOptions().rowHeight), o.getDataLength()));
                if (f !== a.insertBefore) {
                    var g = {
                        rows: a.selectedRows,
                        insertBefore: f
                    };
                    if (l.onBeforeMoveRows.notify(g) === false) {
                        a.guide.css("top", -1e3);
                        a.canMove = false
                    } else {
                        a.guide.css("top", f * o.getOptions().rowHeight);
                        a.canMove = true
                    }
                    a.insertBefore = f
                }
            } else {
                if (!a.dragOutside.hasClass("slick-drag-outside")) {
                    a.dragOutside.addClass("slick-drag-outside");
                    var h = o.getDataItem(a.selectedRows[0]);
                    a.dragOutsideLabel[0].innerHTML = h.name
                }
                a.guide.css("top", -1e3);
                a.selectionProxy.css("top", -1e3)
            }
        }
        function _onDragEnd(e, n) {//p
            if (!r) {
                return
            }
            r = false;
            e.stopImmediatePropagation();
            n.guide.remove();
            n.selectionProxy.remove();
            n.dragOutside.remove();
            if (t.moveOneRowOnly) { }
            if (n.canMove && !d) {
                var i = {
                    rows: n.selectedRows,
                    insertBefore: n.insertBefore
                };
                l.onMoveRows.notify(i)
            }
            if (d) {
                var a = o.getDataItem(n.selectedRows[0]);
                if (t.dragOutsideCallback) {
                    t.dragOutsideCallback("ITEM_DRAG_DROP", {
                        event: e,
                        item: a,
                        items: [a]
                    })
                }
                d = false;
                e.preventDefault()
            }
            if (t.dragOutsideCallback) {
                t.dragOutsideCallback("ITEM_END_DRAG")
            }
        }
        e.extend(this, {
            onBeforeMoveRows: new Slick.Event,
            onMoveRows: new Slick.Event,
            init: _init,//u
            destroy: _destroy //f
        })
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            CheckboxSelectColumn: _CheckboxSelectColumn
        }
    });
    function _CheckboxSelectColumn(t) {
        var o;
        var n = this;
        var i = new Slick.EventHandler;
        var _rows = {};//r
        var l = {
            columnId: "_checkbox_selector",
            cssClass: null,
            toolTip: "Select/Deselect All",
            width: 30
        };
        var a = e.extend(true, {}, l, t);
        function _init(e) {//s
            o = e;
            i.subscribe(o.onSelectedRowsChanged, _onSelectedRowsChanged).subscribe(o.onClick, _onClick).subscribe(o.onHeaderClick, _onHeaderClick).subscribe(o.onKeyDown, _onKeyDown)
        }
        function _destroy() {//c
            i.unsubscribeAll()
        }
        function _onSelectedRowsChanged(e, t) {//d
            var n = o.getSelectedRows();
            var i = {}, l, s;
            for (s = 0; s < n.length; s++) {
                l = n[s];
                i[l] = true;
                if (i[l] !== _rows[l]) {
                    o.invalidateRow(l);
                    delete _rows[l]
                }
            }
            for (s in r) {
                o.invalidateRow(s)
            }
            r = i;
            o.render();
            if (n.length && n.length == o.getDataLength()) {
                o.updateColumnHeader(a.columnId, '<input type="checkbox" checked="checked">', a.toolTip)
            } else {
                o.updateColumnHeader(a.columnId, '<input type="checkbox">', a.toolTip)
            }
        }
        function _onKeyDown(e, t) {//u
            if (e.which == 32) {
                if (o.getColumns()[t.cell].id === a.columnId) {
                    if (!o.getEditorLock().isActive() || o.getEditorLock().commitCurrentEdit()) {
                        _make_select(t.row)
                    }
                    e.preventDefault();
                    e.stopImmediatePropagation()
                }
            }
        }
        function _onClick(t, n) {//f
            if (o.getColumns()[n.cell].id === a.columnId && (e(t.target).is(":checkbox") || e(t.target).siblings("input").is(":checkbox"))) {
                if (o.getEditorLock().isActive() && !o.getEditorLock().commitCurrentEdit()) {
                    t.preventDefault();
                    t.stopImmediatePropagation();
                    return
                }
                _make_select(n.row);
                t.stopPropagation();
                t.stopImmediatePropagation()
            }
        }
        function _make_select(t) {//g
            if (_rows[t]) {
                o.setSelectedRows(e.grep(o.getSelectedRows(), function (e) {
                    return e != t
                }))
            } else {
                o.setSelectedRows(o.getSelectedRows().concat(t))
            }
        }
        function _onHeaderClick(t, n) {//h
            if (n.column.id == a.columnId && e(t.target).is(":checkbox")) {
                if (o.getEditorLock().isActive() && !o.getEditorLock().commitCurrentEdit()) {
                    t.preventDefault();
                    t.stopImmediatePropagation();
                    return
                }
                if (e(t.target).is(":checked")) {
                    var i = [];
                    for (var r = 0; r < o.getDataLength(); r++) {
                        i.push(r)
                    }
                    o.setSelectedRows(i)
                } else {
                    o.setSelectedRows([])
                }
                t.stopPropagation();
                t.stopImmediatePropagation()
            }
        }
        function _getColumnDefinition() {//v
            return {
                id: a.columnId,
                name: '<input type="checkbox">',
                toolTip: a.toolTip,
                field: "sel",
                width: a.width,
                resizable: false,
                sortable: false,
                cssClass: a.cssClass,
                formatter: _formatter_checkbox
            }
        }
        function _formatter_checkbox(e, t, o, n, i) {//p
            if (i) {
                return _rows[e] ? '<input type="checkbox" checked="checked"><label></label>' : '<input type="checkbox"><label></label>'
            }
            return null
        }
        e.extend(this, {
            init: _init,//s
            destroy: _destroy,//c
            getColumnDefinition: _getColumnDefinition //v
        })
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            Plugins: {
                HeaderButtons: _HeaderButtons //t
            }
        }
    });
    function _HeaderButtons(t) {//t
        var o;
        var n = this;
        var i = new Slick.EventHandler;
        var r = {
            buttonCssClass: "slick-header-button"
        };
        function _init(n) {//l
            t = e.extend(true, {}, r, t);
            o = n;
            i.subscribe(o.onHeaderCellRendered, _onHeaderCellRendered).subscribe(o.onBeforeHeaderCellDestroy, _onBeforeHeaderCellDestroy);
            o.setColumns(o.getColumns())
        }
        function _destroy() {//a
            i.unsubscribeAll()
        }
        function _onHeaderCellRendered(o, n) {//s
            var i = n.column;
            if (i.header && i.header.buttons) {
                var r = i.header.buttons.length;
                while (r--) {
                    var l = i.header.buttons[r];
                    var a = e("<div></div>").addClass(t.buttonCssClass).data("column", i).data("button", l);
                    if (l.showOnHover) {
                        a.addClass("slick-header-button-hidden")
                    }
                    if (l.image) {
                        a.css("backgroundImage", "url(" + l.image + ")")
                    }
                    if (l.cssClass) {
                        a.addClass(l.cssClass)
                    }
                    if (l.tooltip) {
                        a.attr("title", l.tooltip)
                    }
                    if (l.command) {
                        a.data("command", l.command)
                    }
                    if (l.handler) {
                        a.bind("click", l.handler)
                    }
                    a.bind("click", _column_click).prependTo(n.node)
                }
            }
        }
        function _onBeforeHeaderCellDestroy(o, n) { //c
            var i = n.column;
            if (i.header && i.header.buttons) {
                e(n.node).find("." + t.buttonCssClass).remove()
            }
        }
        function _column_click(t) {//d
            var i = e(this).data("command");
            var r = e(this).data("column");
            var l = e(this).data("button");
            if (i != null) {
                n.onCommand.notify({
                    grid: o,
                    column: r,
                    command: i,
                    button: l
                }, t, n);
                o.updateColumnHeader(r.id)
            }
            t.preventDefault();
            t.stopPropagation()
        }
        e.extend(this, {
            init: _init,//l
            destroy: _destroy,//a
            onCommand: new Slick.Event
        })
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            AutoTooltips: t
        }
    });
    function t(t) {
        var o;
        var n = this;
        var i = {
            enableForCells: true,
            enableForHeaderCells: false,
            maxToolTipLength: null
        };
        function r(n) {
            t = e.extend(true, {}, i, t);
            o = n;
            if (t.enableForCells)
                o.onMouseEnter.subscribe(a);
            if (t.enableForHeaderCells)
                o.onHeaderMouseEnter.subscribe(s)
        }
        function l() {
            if (t.enableForCells)
                o.onMouseEnter.unsubscribe(a);
            if (t.enableForHeaderCells)
                o.onHeaderMouseEnter.unsubscribe(s)
        }
        function a(n) {
            var i = o.getCellFromEvent(n);
            if (i) {
                var r = e(o.getCellNode(i.row, i.cell));
                var l;
                if (r.innerWidth() < r[0].scrollWidth) {
                    l = e.trim(r.text());
                    if (t.maxToolTipLength && l.length > t.maxToolTipLength) {
                        l = l.substr(0, t.maxToolTipLength - 3) + "..."
                    }
                } else {
                    l = ""
                }
                r.attr("title", l)
            }
        }
        function s(t, o) {
            var n = o.column
                , i = e(t.target).closest(".slick-header-column");
            if (n) {
                if (!n.toolTip) {
                    i.attr("title", i.innerWidth() < i[0].scrollWidth ? n.name : "")
                } else {
                    i.attr("title", i.innerWidth() < i[0].scrollWidth ? n.name + " - " + n.toolTip : n.toolTip)
                }
            }
        }
        e.extend(this, {
            init: r,
            destroy: l
        })
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            DisableRowProvider: t
        }
    });
    function t(t) {
        var o;
        var n = {
            checkDisable: null,
            tooltip: null,
            formatters: null
        };
        var i = null;
        t = e.extend(true, {}, n, t);
        function r(e) {
            o = e;
            o.onClick.subscribe(a);
            o.onDblClick.subscribe(s);
            if (t.tooltip !== null) {
                o.onMouseEnter.subscribe(u)
            }
        }
        function l() {
            if (o) {
                o.onClick.unsubscribe(a);
                o.onDblClick.unsubscribe(s);
                if (t.tooltip !== null) {
                    o.onMouseEnter.unsubscribe(u)
                }
            }
        }
        function a(e, o) {
            var n = this.getDataItem(o.row);
            if (t.checkDisable && t.checkDisable(n)) {
                o.disabledRow = true;
                e.preventDefault()
            }
        }
        function s(e, o) {
            var n = this.getDataItem(o.row);
            if (t.checkDisable && t.checkDisable(n)) {
                o.disabledRow = true;
                e.preventDefault()
            }
        }
        function c(e) {
            if (t.formatters === null) {
                return null
            }
            if (Object.keys(t.formatters).length === 0) {
                return null
            }
            var n = o.getColumns();
            var r = 0;
            if (!i) {
                i = {}
            }
            for (var l = 0; l < n.length; l++) {
                if (t.formatters[n[l].id]) {
                    if (e) {
                        if (!i[n[l].id]) {
                            i[n[l].id] = n[l].formatter
                        }
                        n[l].formatter = t.formatters[n[l].id];
                        r++
                    } else {
                        if (i[n[l].id]) {
                            n[l].formatter = i[n[l].id]
                        }
                    }
                    if (Object.keys(t.formatters).length === r) {
                        break
                    }
                }
            }
            return n
        }
        function d(e) {
            var o = t.checkDisable ? t.checkDisable(e) : null;
            var n = {
                disabled: o !== null ? o : false,
                focusable: o !== null ? o : true
            };
            var i = c(o);
            if (i !== null) {
                n.columns = i
            }
            return n
        }
        function u(n) {
            var i = o.getCellFromEvent(n);
            if (i) {
                var r = this.getDataItem(i.row);
                if (r && t.checkDisable && t.checkDisable(r)) {
                    var l = e(o.getCellNode(i.row, i.cell));
                    l.attr("title", t.tooltip);
                    n.preventDefault()
                }
            }
        }
        return {
            init: r,
            destroy: l,
            getDisabledMetadata: d
        }
    }
}
)(jQuery);
(function (e) {
    e.extend(true, window, {
        Slick: {
            RowSelectionModel: t
        }
    });
    function t(t) {
        var o;
        var n = [];
        var i = this;
        var r = new Slick.EventHandler;
        var l;
        var a;
        var s = {
            selectActiveRow: true
        };
        function _init(n) {//c
            a = e.extend(true, {}, s, t);
            o = n;
            r.subscribe(o.onActiveCellChanged, u(w));
            r.subscribe(o.onKeyDown, u(R));
            r.subscribe(o.onClick, u(S))
        }
        function _destroy() {//d
            r.unsubscribeAll()
        }
        function u(e) {
            return function () {
                if (!l) {
                    l = true;
                    e.apply(this, arguments);
                    l = false
                }
            }
        }
        function f(e) {
            var t = [];
            for (var o = 0; o < e.length; o++) {
                for (var n = e[o].fromRow; n <= e[o].toRow; n++) {
                    t.push(n)
                }
            }
            return t
        }
        function createRange(e) {//g
            var t = [];
            var n = o.getColumns().length - 1;
            for (var i = 0; i < e.length; i++) {
                t.push(new Slick.Range(e[i], 0, e[i], n))
            }
            return t
        }
        function h(e, t) {
            var o, n = [];
            for (o = e; o <= t; o++) {
                n.push(o)
            }
            for (o = t; o < e; o++) {
                n.push(o)
            }
            return n
        }
        function _getSelectedRows() {//v
            return f(n)
        }
        function _setSelectedRows(e) {//p
            _setSelectedRanges(createRange(e))
        }
        function _setSelectedRanges(e) {//m
            n = e;
            i.onSelectedRangesChanged.notify(n)
        }
        function _getSelectedRanges() {//C
            return n
        }
        function w(e, t) {
            if (a.selectActiveRow && t.row != null) {
                _setSelectedRanges([new Slick.Range(t.row, 0, t.row, o.getColumns().length - 1)]);
            }
        }
        function R(e) {
            var t = o.getActiveCell();
            if (t && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)) {
                var i = _getSelectedRows();
                i.sort(function (e, t) {
                    return e - t
                });
                if (!i.length) {
                    i = [t.row]
                }
                var r = i[0];
                var l = i[i.length - 1];
                var a;
                if (e.which == 40) {
                    a = t.row < l || r == l ? ++l : ++r
                } else {
                    a = t.row < l ? --l : --r
                }
                if (a >= 0 && a < o.getDataLength()) {
                    o.scrollRowIntoView(a);
                    n = g(h(r, l));
                    m(n)
                }
                e.preventDefault();
                e.stopPropagation()
            }
        }
        function S(t) {
            var i = o.getCellFromEvent(t);
            if (!i || !o.canCellBeActive(i.row, i.cell)) {
                return false
            }
            var r = f(n);
            var l = e.inArray(i.row, r);
            if (!t.ctrlKey && !t.shiftKey && !t.metaKey) {
                return false
            } else if (o.getOptions().multiSelect) {
                if (l === -1 && (t.ctrlKey || t.metaKey)) {
                    r.push(i.row);
                    o.setActiveCell(i.row, i.cell)
                } else if (l !== -1 && (t.ctrlKey || t.metaKey)) {
                    r = e.grep(r, function (e, t) {
                        return e !== i.row
                    });
                    o.setActiveCell(i.row, i.cell)
                } else if (r.length && t.shiftKey) {
                    var a = r.pop();
                    var s = Math.min(i.row, a);
                    var c = Math.max(i.row, a);
                    r = [];
                    for (var d = s; d <= c; d++) {
                        if (d !== a) {
                            r.push(d)
                        }
                    }
                    r.push(a);
                    o.setActiveCell(i.row, i.cell)
                }
            }
            n = createRange(r);
            _setSelectedRanges(n);
            t.stopImmediatePropagation();
            return true;
        }
        e.extend(this, {
            getSelectedRows: _getSelectedRows,//v
            setSelectedRows: _setSelectedRows,//p
            getSelectedRanges: _getSelectedRanges,//C
            setSelectedRanges: _setSelectedRanges,//m
            init: _init,//c
            destroy: _destroy,//d
            onSelectedRangesChanged: new Slick.Event
        })
    }
}
)(jQuery);