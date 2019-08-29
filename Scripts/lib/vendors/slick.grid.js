if (typeof jQuery === "undefined") {
  throw new Error("SlickGrid requires jquery module to be loaded");
}
if (!jQuery.fn.drag) {
  throw new Error("SlickGrid requires jquery.event.drag module to be loaded");
}
if (typeof Slick === "undefined") {
  throw new Error("slick.core.js not loaded");
}


(function($) {
  $.extend(true, window, {
      Slick: {
          Grid: SlickGrid
      }
  });
  var scrollbarDimensions;
  var maxSupportedCssHeight;
  function SlickGrid(container, data, columns, options) {
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
          forceFitColumnsMinWidth: 1,
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
          deselectOnClick: false
      };
      var columnDefaults = {
          name: "",
          resizable: true,
          sortable: false,
          minWidth: 40,//bowser.firefox ? 47 : 40,
          rerenderOnResize: false,
          headerCssClass: null,
          defaultSortAsc: true,
          focusable: true,
          selectable: true
      };
      var th;
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
      var render_interval = 40;
      var max_render_delay = 80;
      var last_render_time = 0;
      function init() {
          if (typeof container === "string") {
              $container = $(container)
          } else {
              $container = container
          }
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
          $focusSink2 = $focusSink.clone().appendTo($container);
          $dragContainer = $("<div class='grid-drag-container' />").appendTo($("body"));
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
                      return $(e.target).is("input,textarea");
                  });
              }
              updateColumnCaches();
              createColumnHeaders();
              setupColumnSort();
              createCssRules();
              resizeCanvas();
              bindAncestorScrollEvents();
              var e;
              $container.bind("resize.slickgrid", resizeCanvas);
              $viewport.bind("scroll jsp-scroll-y jsp-scroll-x", function() {
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
          e.init(self);
      }
      function unregisterPlugin(e) {
          for (var t = plugins.length; t >= 0; t--) {
              if (plugins[t] === e) {
                  if (plugins[t].destroy) {
                      plugins[t].destroy();
                  }
                  plugins.splice(t, 1);
                  break;
              }
          }
      }
      function setSelectionModel(e) {
          if (selectionModel) {
              selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
              if (selectionModel.destroy) {
                  selectionModel.destroy();
              }
          }
          selectionModel = e;
          if (selectionModel) {
              selectionModel.init(self);
              selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged)
          }
      }
      function getSelectionModel() {
          return selectionModel;
      }
      function getCanvasNode() {
          return $canvas[0];
      }
      function getDragContainer() {
          return $dragContainer[0];
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
              t += columns[o].width;
          }
          return options.fullWidthRows ? Math.max(t, e) : t;
      }
      function updateHeaderWidth(e) {
          $canvas.width(e);
          $headerRow.width(e);
          $headers.width(getHeadersWidth());
          viewportHasHScroll = e > viewportW - scrollbarDimensions.width;
      }
      function updateCanvasWidth(e) {
          var t = canvasWidth;
          canvasWidth = getCanvasWidth();
          if (canvasWidth != t) {
              updateHeaderWidth(canvasWidth);
          }
          $headerRowSpacer.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
          if (canvasWidth != t || e) {
              applyColumnWidths();
          }
      }
      function disableSelection(e) {
          if (e && e.jquery) {
              e.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function() {
                  return false;
              });
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
                  break;
              } else {
                  e = n;
              }
          }
          o.remove();
          return e;
      }
      function bindAncestorScrollEvents() {
          var e = $canvas[0];
          while ((e = e.parentNode) != document.body && e != null) {
              if (e == $viewport[0] || e.scrollWidth != e.clientWidth || e.scrollHeight != e.clientHeight) {
                  var t = $(e);
                  if (!$boundAncestors) {
                      $boundAncestors = t;
                  } else {
                      $boundAncestors = $boundAncestors.add(t);
                  }
                  t.bind("scroll." + uid, handleActiveCellPositionChange);
              }
          }
      }
      function unbindAncestorScrollEvents() {
          if (!$boundAncestors) {
              return;
          }
          $boundAncestors.unbind("scroll." + uid);
          $boundAncestors = null;
      }
      function updateColumnHeader(e, t, o) {
          if (!initialized) {
              return;
          }
          var n = getColumnIndex(e);
          if (n == null) {
              return;
          }
          var i = columns[n];
          var r = $headers.children().eq(n);
          if (r) {
              if (t !== undefined) {
                  columns[n].name = t;
              }
              if (o !== undefined) {
                  columns[n].toolTip = o;
              }
              trigger(self.onBeforeHeaderCellDestroy, {
                  node: r[0],
                  column: i
              });
              r.attr("title", o || "").children().eq(0).html(t);
              trigger(self.onHeaderCellRendered, {
                  node: r[0],
                  column: i
              });
          }
      }
      function getHeaderRow() {
          return $headerRow[0];
      }
      function getHeaderRowColumn(e) {
          var t = getColumnIndex(e);
          var o = $headerRow.children().eq(t);
          return o && o[0]
      }
      function createColumnHeaders() {
          function e() {
              $(this).addClass("ui-state-hover");
          }
          function t() {
              $(this).removeClass("ui-state-hover");
          }
          $headers.find(".slick-header-column").each(function() {
              var e = $(this).data("column");
              if (e) {
                  trigger(self.onBeforeHeaderCellDestroy, {
                      node: this,
                      column: e
                  });
              }
          });
          $headers.empty();
          $headers.width(getHeadersWidth());
          $headerRow.find(".slick-headerrow-column").each(function() {
              var e = $(this).data("column");
              if (e) {
                  trigger(self.onBeforeHeaderRowCellDestroy, {
                      node: this,
                      column: e
                  });
              }
          });
          $headerRow.empty();
          for (var o = 0; o < columns.length; o++) {
              var n = columns[o];
              var i = $("<div class='ui-state-default slick-header-column' id='" + uid + n.id + "' />").html("<span class='slick-column-name'>" + n.name.toUpperCase() + "</span>").width(n.width - headerColumnWidthDiff).attr("title", n.toolTip || "").data("column", n).addClass(n.headerCssClass || "").appendTo($headers);
              if (options.enableColumnReorder || n.sortable) {
                  i.on("mouseenter", e).on("mouseleave", t);
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
              setupColumnReorder();
          }
      }
      function setupColumnSort() {
          $headers.click(function(e) {
              e.metaKey = e.metaKey || e.ctrlKey;
              if ($(e.target).hasClass("slick-resizable-handle")) {
                  return;
              }
              var t = $(e.target).closest(".slick-header-column");
              if (!t.length) {
                  return;
              }
              var o = t.data("column");
              if (o.sortable) {
                  if (!getEditorLock().commitCurrentEdit()) {
                      return;
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
                          sortColumns.splice(i, 1);
                      }
                  } else {
                      if (!e.shiftKey && !e.metaKey || !options.multiColumnSort) {
                          sortColumns = [];
                      }
                      if (!n) {
                          n = {
                              columnId: o.id,
                              sortAsc: o.defaultSortAsc
                          };
                          sortColumns.push(n);
                      } else if (sortColumns.length == 0) {
                          sortColumns.push(n);
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
                          sortCols: $.map(sortColumns, function(e) {
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
              start: function(e, t) {
                  $(t.helper).addClass("slick-header-column-active")
              },
              beforeStop: function(e, t) {
                  $(t.helper).removeClass("slick-header-column-active")
              },
              stop: function(e) {
                  if (!getEditorLock().commitCurrentEdit()) {
                      $(this).sortable("cancel");
                      return
                  }
                  var t, o = $headers.sortable("toArray");
                  for (t = 0; t < columns.length; t++) {
                      var n = columns[t];
                      if (n.xsFrozen) {
                          if (o[t] !== uid + n.id) {
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
          i.each(function(e, t) {
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
          i.each(function(c, d) {
              if (c < a || options.forceFitColumns && c >= s) {
                  return
              }
              e = $(d);
              $("<div class='slick-resizable-handle' />").appendTo(d).bind("dragstart", function(e, a) {
                  if (!getEditorLock().commitCurrentEdit()) {
                      return false
                  }
                  n = e.pageX;
                  $(this).parent().addClass("slick-header-column-active");
                  var s = null
                    , d = null;
                  i.each(function(e, t) {
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
              }).bind("drag", function(e, a) {
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
              }).bind("dragend", function(e, n) {
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
          $.each(t, function(t, n) {
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
          $.each(t, function(t, o) {
              headerColumnWidthDiff += parseFloat(e.css(o)) || 0
          });
          $.each(o, function(t, o) {
              headerColumnHeightDiff += parseFloat(e.css(o)) || 0
          });
          e.remove();
          var n = $("<div class='slick-row' />").appendTo($canvas);
          e = $("<div class='slick-cell' id='' style='visibility:hidden'>-</div>").appendTo(n);
          cellWidthDiff = cellHeightDiff = 0;
          $.each(t, function(t, o) {
              cellWidthDiff += parseFloat(e.css(o)) || 0
          });
          n.remove();
          absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff)
      }
      function createCssRules() {
          $style = $("<style type='text/css' rel='stylesheet' />").appendTo($("head"));
          var e = options.rowHeight;
          var t = ["." + uid + " .slick-header-column { left: 1000px; }", "." + uid + " .slick-top-panel { height:" + options.topPanelHeight + "px; }", "." + uid + " .slick-headerrow-columns { height:" + options.headerRowHeight + "px; }", "." + uid + " .slick-cell { height:" + e + "px; }", "." + uid + " .slick-row { height:" + options.rowHeight + "px; }"];
          for (var o = 0; o < columns.length; o++) {
              t.push("." + uid + " .l" + o + " { }");
              t.push("." + uid + " .r" + o + " { }")
          }
          if ($style[0].styleSheet) {
              $style[0].styleSheet.cssText = t.join(" ")
          } else {
              $style[0].appendChild(document.createTextNode(t.join(" ")))
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
          if (options.forceFitColumnsMinWidth > 0 && viewportW < options.forceFitColumnsMinWidth) {
              return
          }
          var e, t, o = [], n = 0, i = 0, r, l = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW - options.noScrollBarRightPadding;
          for (e = 0; e < columns.length; e++) {
              t = columns[e];
              o.push(t.width);
              i += t.width;
              if (t.resizable) {
                  if (t.autoResizeOff) {
                      continue
                  }
                  n += t.width - Math.max(t.minWidth, absoluteColumnMinWidth)
              }
          }
          r = i;
          while (i > l && n) {
              var a = (i - l) / n;
              for (e = 0; e < columns.length && i > l; e++) {
                  t = columns[e];
                  var s = o[e];
                  if (!t.resizable || s <= t.minWidth || s <= absoluteColumnMinWidth || t.autoResizeOff) {
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
                  if (!t.resizable || t.maxWidth <= t.width || t.maxWidth <= o[e] || t.xsForceSlim || t.autoResizeOff) {
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
      function setSortColumns(e) {
          sortColumns = e;
          var t = $headers.children();
          t.removeClass("slick-header-column-sorted").find(".slick-sort-indicator").removeClass("slick-sort-indicator-asc slick-sort-indicator-desc");
          $.each(sortColumns, function(e, o) {
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
          return options.rowHeight * e - offset
      }
      function getRowFromPosition(e) {
          return Math.floor((e + offset) / options.rowHeight)
      }
      function scrollTo(e) {
          e = Math.max(e, 0);
          e = Math.min(e, th - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0));
          var t = offset;
          page = Math.min(n - 1, Math.floor(e / ph));
          offset = Math.round(page * cj);
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
          var n = o && o.columns && (o.columns[t.id] || o.columns[getColumnIndex(t.id)]);
          return n && n.formatter || o && o.formatter || t.formatter || options.formatterFactory && options.formatterFactory.getFormatter(t) || options.defaultFormatter
      }
      function getEditor(e, t) {
          var o = columns[t];
          var n = data.getItemMetadata && data.getItemMetadata(e);
          var i = n && n.columns;
          if (i && i[o.id] && i[o.id].editor !== undefined) {
              return i[o.id].editor
          }
          if (i && i[t] && i[t].editor !== undefined) {
              return i[t].editor
          }
          return o.editor || options.editorFactory && options.editorFactory.getEditor(o)
      }
      function getDataItemValueForColumn(e, t) {
          if (options.dataItemColumnValueExtractor) {
              return options.dataItemColumnValueExtractor(e, t)
          }
          return e[t.field]
      }
      function appendRowHtml(container, index_item, visibleRange) {
          var item = getDataItem(index_item);///n
          var hayData = index_item < getDataLength() && !item;//
          
          ///r
          var clases = "slick-row" + (hayData ? " loading" : "") + (index_item === activeRow ? " active" : "") + (index_item % 2 == 1 ? " odd" : " even") + (index_item === 0 ? " first-row" : "");
          var itemMetadata = data.getItemMetadata && data.getItemMetadata(index_item);//l
          if (itemMetadata) {
              if (itemMetadata.cssClasses) {
                clases += " " + itemMetadata.cssClasses
              }
              if (itemMetadata.disabled) {
                clases += " slick-disable"
              }
          }
          container.push("<div class='ui-widget-content " + clases + "' row='" + index_item + "' style='top:" + getRowTop(index_item) + "px'>");
          var colspan, _column;//a ,s
          for (var index_column = 0, columns_length = columns.length; index_column < columns_length; index_column++) {
            _column = columns[index_column];
            colspan = 1;
              if (itemMetadata && itemMetadata.columns) {
                  var _currentColumn = itemMetadata.columns[_column.id] || itemMetadata.columns[index_column]; //si noes por id de columna es por posicion de columna
                  colspan = _currentColumn && _currentColumn.colspan || 1;
                  if (colspan === "*") {
                    colspan = columns_length - index_column
                  }

              }

                if (columnPosRight[Math.min(columns_length - 1, index_column + colspan - 1)] > visibleRange.leftPx) {
                    if (columnPosLeft[index_column] > visibleRange.rightPx) {
                        break
                    }
                    appendCellHtml(container, index_item, index_column, colspan)
                }
              

              if (colspan > 1) {
                index_column += colspan - 1
              }
          }
          container.push("</div>")
      }
      function appendCellHtml(container, index_item, index_column, colspan) {//e,t,o,n
          var _column = columns[index_column];//i
          var item = getDataItem(index_item);//r
          //l
          var clases = "slick-cell l" + index_column + " r" + Math.min(columns.length - 1, index_column + colspan - 1) + (_column.cssClass ? " " + _column.cssClass : "");
          if (index_item === activeRow && index_column === activeCell) {
            clases += " active"
          }
          for (var a in cellCssClasses) {
              if (cellCssClasses[a][index_item] && cellCssClasses[a][index_item][_column.id]) {
                clases += " " + cellCssClasses[a][index_item][_column.id]
              }
          }
          container.push("<div class='" + clases + "'>");
          if (item) {
              var valueForColumn = getDataItemValueForColumn(item, _column);
              container.push(getFormatter(index_item, _column)(index_item, index_column, valueForColumn, _column, item))
          }
          container.push("</div>");
          rowsCache[index_item].cellRenderQueue.push(index_column);
          rowsCache[index_item].cellColSpans[index_column] = colspan;
      }

      function cleanupRows(e) {
          for (var t in rowsCache) {
              if ((t = parseInt(t, 10)) !== activeRow && (t < e.top || t > e.bottom)) {
                  removeRowFromCache(t)
              }
          }
      }
      function invalidate() {
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
              viewportH = options.rowHeight * (getDataLength() + (options.enableAddRow ? 1 : 0))
          } else {
              viewportH = getViewportHeight()
          }
          numVisibleRows = Math.ceil(viewportH / options.rowHeight);
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
      function updateRowCount() {
          if (!initialized) {
              return
          }
          numberOfRows = getDataLength() + (options.enableAddRow ? 1 : 0) + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
          var e = viewportHasVScroll;
          viewportHasVScroll = !options.autoHeight && numberOfRows * options.rowHeight > viewportH;
          var t = options.enableAddRow ? getDataLength() : getDataLength() - 1;
          for (var o in rowsCache) {
              if (o >= t) {
                  removeRowFromCache(o)
              }
          }
          if (activeCellNode && activeRow > t) {
              resetActiveCell()
          }
          var i = h;
          th = Math.max(options.rowHeight * numberOfRows, viewportH - scrollbarDimensions.height);
          if (th < maxSupportedCssHeight) {
              h = ph = th;
              n = 1;
              cj = 0
          } else {
              h = maxSupportedCssHeight;
              ph = h / 100;
              n = Math.floor(th / ph);
              cj = (th - h) / (n - 1)
          }
          if (h !== i) {
              $canvas.css("height", h);
              scrollTop = getScrollPosition().top
          }
          var r = scrollTop + offset <= th - viewportH;
          if (th == 0 || scrollTop == 0) {
              page = offset = 0
          } else if (r) {
              scrollTo(scrollTop + offset)
          } else {
              scrollTo(th - viewportH)
          }
          if (h != i && options.autoHeight) {
              resizeCanvas()
          }
          if (options.forceFitColumns && e != viewportHasVScroll) {
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
          var n = Math.round(viewportH / options.rowHeight);
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
          var t = $canvas[0]
            , o = []
            , n = [];
          for (var i = e.top; i <= e.bottom; i++) {
              if (rowsCache[i]) {
                  if (!rowsCache[i].dataDirty) {
                      continue
                  }
                  delete rowsCache[i].dataDirty
              }
              renderedRows++;
              n.push(i);
              if (!rowsCache[i]) {
                  rowsCache[i] = prepareRowCacheNode()
              } else {
                  rowsCache[i].cellRenderQueue.length = 0
              }
              appendRowHtml(o, i, e);
              counter_rows_rendered++
          }
          if (!n.length) {
              return
          }
          var r = document.createElement("div");
          r.innerHTML = o.join("");
          var l = htmlCollToArr(r.children);
          for (var i = 0, a = n.length; i < a; i++) {
              updateRowData(t, rowsCache[n[i]], l[i])
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
      function render() {
          if (!initialized) {
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
          h_render = null;
          last_render_time = (new Date).getTime()
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
              if (t < viewportH) {} else {
                  var i = offset;
                  if (h == viewportH) {
                      page = 0
                  } else {
                      page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)))
                  }
                  offset = Math.round(page * cj);
                  if (i != offset) {
                      invalidateAllRows()
                  }
              }
          }
          if (o || t) {
              if (h_render) {
                  clearTimeout(h_render)
              }
              var r = (new Date).getTime() - last_render_time > max_render_delay;
              if (r || Math.abs(lastRenderedScrollTop - scrollTop) > 20 || Math.abs(lastRenderedScrollLeft - scrollLeft) > 20) {
                  if (r || options.forceSyncScrolling || Math.abs(lastRenderedScrollTop - scrollTop) < viewportH && Math.abs(lastRenderedScrollLeft - scrollLeft) < viewportW) {
                      render()
                  } else {
                      h_render = setTimeout(render, render_interval)
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
                  setTimeout(function() {
                      n.queue(function() {
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
                      t = navigateLeft()
                  } else if (e.which == 39) {
                      t = navigateRight()
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
              } catch (e) {}
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
              if (selectionModel && options.deselectOnClick) {
                  setSelectedRows([]);
                  resetActiveCell()
              }
              return
          }
          trigger(self.onClick, {
              row: t.row,
              cell: t.cell
          }, e);
          if (e.isImmediatePropagationStopped()) {
              return
          }
          var o = $.inArray(t.row, selectedRows);
          if (selectionModel && options.deselectOnClick && o != -1 && (!options.multiSelect || selectedRows.length == 1)) {
              selectedRows.splice(o, 1);
              setSelectedRows(selectedRows);
              resetActiveCell()
          } else if ((activeCell != t.cell || activeRow != t.row) && canCellBeActive(t.row, t.cell)) {
              if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
                  scrollRowIntoView(t.row, false);
                  setActiveCellInternal(getCellNode(t.row, t.cell), t.row === getDataLength() || options.autoEdit)
              }
          }
      }
      function handleContextMenu(e) {
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
              return null
          }
          var o = getRowFromNode(t[0].parentNode);
          var n = getCellFromNode(t[0]);
          if (o == null || n == null) {
              return null
          } else {
              return {
                  row: o,
                  cell: n
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
          scrollRowIntoView(e, o);
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
                      h_editorLoader = setTimeout(function() {
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
      function scrollRowIntoView(e, t) {
          var o = e * options.rowHeight;
          var n = (e + 1) * options.rowHeight - viewportH + (viewportHasHScroll ? scrollbarDimensions.height : 0);
          if ((e + 1) * options.rowHeight > scrollTop + viewportH + offset) {
              scrollTo(t ? o : n);
              render()
          } else if (e * options.rowHeight < scrollTop + offset) {
              scrollTo(t ? n : o);
              render()
          }
      }
      function scrollRowToTop(e) {
          scrollTo(e * options.rowHeight);
          render()
      }
      function getColspan(e, t) {
          var o = data.getItemMetadata && data.getItemMetadata(e);
          if (!o || !o.columns) {
              return 1
          }
          var n = o.columns[columns[t].id] || o.columns[t];
          var i = n && n.colspan;
          if (i === "*") {
              i = columns.length - t
          } else {
              i = i || 1
          }
          return Number(i)
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
          } while (t < columns.length && !canCellBeActive(e, t));if (t < columns.length) {
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
          if (o && typeof o.focusable === "boolean") {
              return o.focusable
          }
          var n = o && o.columns;
          if (n && n[columns[t].id] && typeof n[columns[t].id].focusable === "boolean") {
              return n[columns[t].id].focusable
          }
          if (n && n[t] && typeof n[t].focusable === "boolean") {
              return n[t].focusable
          }
          return columns[t].focusable
      }
      function canCellBeSelected(e, t) {
          if (e >= getDataLength() || e < 0 || t >= columns.length || t < 0) {
              return false
          }
          var o = data.getItemMetadata && data.getItemMetadata(e);
          if (o && typeof o.selectable === "boolean") {
              return o.selectable
          }
          var n = o && o.columns && (o.columns[columns[t].id] || o.columns[t]);
          if (n && typeof n.selectable === "boolean") {
              return n.selectable
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
                              execute: function() {
                                  this.editor.applyValue(e, this.serializedValue);
                                  updateRow(this.row)
                              },
                              undo: function() {
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
              t.push(new Slick.Range(e[n],0,e[n],o))
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
          selectionModel.setSelectedRanges(rowsToRanges(e))
      }
      this.debug = function() {
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
      this.eval = function(expr) {
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
          render: render,
          invalidate: invalidate,
          invalidateRow: invalidateRow,
          invalidateRows: invalidateRows,
          invalidateRowsData: invalidateRowsData,
          invalidateAllRows: invalidateAllRows,
          updateCell: updateCell,
          updateRow: updateRow,
          getViewport: getVisibleRange,
          getRenderedRange: getRenderedRange,
          resizeCanvas: resizeCanvas,
          updateRowCount: updateRowCount,
          scrollRowIntoView: scrollRowIntoView,
          scrollRowToTop: scrollRowToTop,
          scrollCellIntoView: scrollCellIntoView,
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
          getEditController: getEditController
      });
      init()
  }
}
)(jQuery);
