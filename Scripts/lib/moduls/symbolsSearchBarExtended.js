(function (jq) {

    var a = MAE.PopupsService;
    var n = MAE.I18nService;
    var objtWraper = {};

    var scope =
        {
            isLoad: false

        };

    function _inputFocus() {
        if (objtWraper && objtWraper.input)
            objtWraper.input.focus();

    };


    function _isLoad() {
        return scope.isLoad;

    };

    function _update(scope_target) {
        jq.extend(scope, scope_target);

    };

    function _onClickButton(e) {
        openTradePopup_bind(e, index);

    };
    function openTradePopup_bind(e, el) {

        var index = jq(el).attr("data-mw-open-trade");
        scope.openTradePopup_inner(e, scope.filteredItems[index].key);

    };
    function _link(scope_target, element, u) {//c(l, c, u)

        scope = scope_target;

        function llenarobjtWraper() {//p
            objtWraper.inputWrapper = element.find(".xs-symbol-search-bar-input-wrapper");
            objtWraper.input = element.find(".xs-symbol-search-bar-input");
            objtWraper.mainContainer = element.find(".xs-symbol-search-bar-container");
            objtWraper.symbolsContainer = element.find(".xs-symbol-search-bar-extended-symbols-container");
            objtWraper.scrollContainer = element.find(".xs-symbol-search-scroller");
        }
        function objtWraperInput() {//m
            objtWraper.input.focus(_focus);
            objtWraper.input[0].addEventListener("keydown", input_keydown, true);
            objtWraper.input[0].addEventListener("keyup", input_keyup, true);

            jq(".xs-symbol-search-bar-close-btn").on("click", function () {
                scope.hideResults(true);
            });

            jq(".xs-symbol-search-bar-open-btn").on("click", function () {
                scope.showResults();
            });

            jq(".search-bar-extended-nav-option").on("click", function () {
                scope.changeTab();
            });




        }
        function _render(id) {

            var template = jq.templates("#" + id);
            var renderOut = template.render(scope);

            return renderOut;

        };

        function _linkTemplate(id) {

            var template = jq.templates("#" + id);
            template.link(element, scope);



        };

        function inyectarCuerpo() {
            // var outHtml = _render("symbolsSearchBarExtended");
            // element.html(outHtml);
            _linkTemplate("symbolsSearchBarExtended");

        }

        function _init() {//f

            inyectarCuerpo();

            scope.isLoad = true;

            llenarobjtWraper();
            objtWraperInput();
            enlazarjScrollPane();
        }
        function enlazarjScrollPane() {//v
            _jScrollPane = objtWraper.scrollContainer.jScrollPane();
            _jsp = objtWraper.scrollContainer.data("jsp");
            _jScrollPane.bind("jsp-scroll-y", jsp_scroll_y);
            _jScrollPane.bind("jsp-initialised", jsp_initialised);
            objtWraper.symbolsContainer.bind("mousewheel", _mousewheel);
            objtWraper.symbolsContainer.bind("mousemove", _mousemove);
            objtWraper.symbolsContainer.bind("mouseup", _mouseup);
        }



        function _mousewheel(e, t, n, i) {//b
            var delta = e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ? 1 : -1;
            _jsp.scrollBy(0, -delta * _extra_rows, false);
        }
        function calcularIndex(clientX, clientY) {//h(e,t)
            var posicion_y = clientY - symbolsContainer_metric.y//n
            var fila = Math.min(scope.numRows - 1, Math.max(0, Math.floor(posicion_y / scope.rowHeight))); //i
            var visibleLabels = scope.visibleLabels;//a
            var firstDisplayedIndex = scope.firstDisplayedIndex;//o
            var mostPopularInstruments_length = scope.mostPopularInstruments_filtro().length;

            if (1 === visibleLabels) {
                if (0 === firstDisplayedIndex)
                    fila -= 1;
                else {
                    if (firstDisplayedIndex + fila > mostPopularInstruments_length)
                        fila -= 1;
                }
            }

            if (2 === visibleLabels) {
                fila -= 1;
                if (fila > mostPopularInstruments_length)
                    fila -= 1;
            }
            return fila;
            // return 1 === a && (0 === o ? i -= 1 : o + i > s && (i -= 1)),
            //     2 === a && (i -= 1,
            //         i > s && (i -= 1)),
            //     i
        }
        function _mousemove(e) {//g
            if (q.x != e.clientX || q.y != e.clientY) {
                q.x = e.clientX,
                    q.y = e.clientY;
                var index = calcularIndex(e.clientX, e.clientY);

                if (index != scope.selectedIndex) {
                    scope.selectedIndex = index;
                    scope.updateListView();

                }


            }
        }
        function _mouseup(e) {//x
            var index = calcularIndex(e.clientX, e.clientY);
            scope.selectedIndex = index;
            armarQuery();
        }
        function jsp_initialised() {//I
            scope.updateListView()
        }
        function y(e) {
            return Math.round(e * (scope.filteredItems.length - _numRows))
        }
        function scrollToPercent(e) {//w
            return e / (scope.filteredItems.length - _numRows)
        }
        function jsp_scroll_y(e, t, n, i) {//S
            var a = y(_jsp.getPercentScrolledY());
            a != scope.firstDisplayedIndex && (scope.firstDisplayedIndex = Math.max(0, Math.min(parseInt(a), scope.filteredItems.length - _numRows)),
                scope.updateDisplayedItems(false))
        }
        function tecla_press(e) {//C
            var t = scope.selectedIndex + e;
            scope.selectedIndex = Math.min(Math.max(0, t), _numRows - 1);

            if (t < 0 || t >= _numRows || 0 !== scope.visibleLabels && t >= _numRows - 1) {
                var n = scope.firstDisplayedIndex + e;
                var i = -1;
                if (n <= scope.filteredItems.length - _numRows && n > -1) {
                    i = scope.firstDisplayedIndex + e,
                        0 !== scope.visibleLabels && scope.selectedIndex >= _numRows - 1 && (scope.selectedIndex = _numRows - 2)
                } else {
                    if (n < 0) {
                        i = scope.filteredItems.length - _numRows;
                        scope.selectedIndex = _numRows - 1;
                    }
                    else {
                        i = 0;
                        scope.selectedIndex = 0;
                    }
                }


                scope.firstDisplayedIndex = i;
                scope.updateDisplayedItems(false);
                scope.updateScrollBarPos();

            } else
                scope.updateListView();
        }
        function _focus(e) {//D
            //objtWraper.symbolsContainer.html("");
            scope.searchString = objtWraper.input.val();
            preparar_focus();
        }
        function input_keyup(e) {
            switch (e.keyCode) {
                case 27: //escape
                    var t = true;
                    var n = "";
                    if (scope.closeCallback) {
                        n = scope.closeCallback();
                        if (!n)
                            n = "";

                        if ("" !== n)
                            t = false;
                    }
                    scope.hideList(t, n);
                    setTimeout(function () {
                        MAE.MarketWatchModule.focusGrid();    
                    }, 100);
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                // scope.closeCallback && (n = scope.closeCallback() || "",
                // "" !== n && (t = !1)),
                // scope.hideList(t, n),
                // e.preventDefault(),
                // e.stopPropagation(),
                // e.stopImmediatePropagation()

                default:

                if(char_code.filter(function(v){ 
                    return e.keyCode === v
                }).length == 0 && !e.shiftKey && !e.ctrlKey)        
                {
                    if (objtWraper.input.val().length > 0) {
                        armarQuery();
                        t = true;
                    }
                }

                break;
            }
        }
        var char_code = [40,38,34,33,27,13,49,50,51,17]
        function input_keydown(e) {//V
            var t = false;
            switch (e.keyCode) {
                case 40: //down arrow
                    t = true;
                    tecla_press(1);
                    break;
                case 38: //up arrow
                    t = true;
                    tecla_press(-1);
                    break;
                case 34: //page down
                    t = true;
                    tecla_press(scope.numRows);
                    break;
                case 33: //page up
                    t = true;
                    tecla_press(-scope.numRows);
                    break;
                case 27: //escape
                    t = true;
                    break;
                case 13: //enter
                    armarQuery();
                    t = true;
                    break;
                case 49: //Show info
                    if (e.shiftKey)
                        armarShowInfo();
                    break;
                case 50: //open Cahrt
                    if (e.shiftKey)
                        armarOpenChart();
                    break;
                case 51: //open Oferta
                    if (e.shiftKey)
                        armarOpenOferta();
                    break;

            }

            //console.log("input_keydown e.ctrlKey" + e.ctrlKey + " e.keyCode " + e.keyCode);
            if (t) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }


        }
        function left_top() {//E
            if (objtWraper.symbolsContainer) {
                input_metric.x = 0;
                input_metric.y = objtWraper.input.outerHeight();
                var e = objtWraper.symbolsContainer.offset();
                symbolsContainer_metric.x = e.left;
                symbolsContainer_metric.y = e.top;
            }
        }
        function document_mousedown(e) {//M
            for (var t = element[0], n = e.target; n && n != t;)
                n = n.parentNode;

            n != t && scope.hideList()
        }
        function alto_conainer() {//T
            return objtWraper.input.width() + parseInt(objtWraper.symbolsContainer.css("padding-right")) + parseInt(objtWraper.symbolsContainer.css("margin-right")) + 1
        }
        function preparar_focus() { //$

            if (!scope.opened && !scope.xsDisabled) {

                _jsp.scrollTo(0);
                _temp_rows = -1;
                scope.firstDisplayedIndex = 0;
                // i.playSound(i.SOUND_BUTTON_CLICK);
                scope.opened = true;
                objtWraper.symbolsContainer[0].style.width = alto_conainer() + "px";
                objtWraper.mainContainer.css("display", "block");
                _jsp.reinitialise();
                document.removeEventListener("mousedown", document_mousedown);
                document.addEventListener("mousedown", document_mousedown);
                scope.openCallback && scope.openCallback({
                    opened: true
                });
                scope.updateDisplayedItems();
                setTimeout(function () { }, 0, true);
                left_top();
                objtWraper.input.focus();
                setTimeout(left_top, 10);
                scope.updateScrollBarPos();
            }

            // scope.opened || scope.xsDisabled || (_jsp.scrollTo(0),
            //     W = -1,
            //     scope.firstDisplayedIndex = 0,
            //     i.playSound(i.SOUND_BUTTON_CLICK),
            //     scope.opened = !0,
            //     objtWraper.symbolsContainer[0].style.width = T() + "px",
            //     objtWraper.mainContainer.css("display", "block"),
            //     document.removeEventListener("mousedown", document_mousedown),
            //     document.addEventListener("mousedown", document_mousedown),
            //     scope.openCallback && scope.openCallback({
            //         opened: !0
            //     }),
            //     scope.updateDisplayedItems(),
            //     e(function () { }, 0, !0),
            //     E(),
            //     objtWraper.input.focus(),
            //     e(E, 10),
            //     scope.updateScrollBarPos())
        }
        function calcularArea() {//P
            _numRows = Math.min(scope.numRows, scope.displayedItems.length);//X

            if (scope.numRows > scope.displayedItems.length)
                _numRows += 1;

            _extra_rows = Math.max(1, Math.ceil(G / Math.max(1, scope.filteredItems.length - _numRows))); //Y

            var noScrollbar = scope.noScrollbar != (scope.filteredItems.length <= scope.numRows);
            scope.noScrollbar = scope.filteredItems.length <= scope.numRows;
            var n_flag = false;
            if (_numRows != _temp_rows || noScrollbar) {

                n_flag = noScrollbar || scope.filteredItems.length <= scope.numRows || scope.filteredItems.length > scope.numRows && _temp_rows < scope.numRows;

                _temp_rows = _numRows;


                var alto_final = scope.rowHeight * _numRows;
                objtWraper.symbolsContainer.height(alto_final + "px");

                if (scope.filteredItems.length > scope.numRows) {
                    objtWraper.scrollContainer[0].style.display = "inline-block";
                    objtWraper.scrollContainer.height(alto_final + "px");
                    _jsp.reinitialise();
                }
                else {
                    objtWraper.scrollContainer[0].style.display = "none";
                    n_flag && (left_top(), setTimeout(left_top, 10))
                }
            }
        }


        function itemToHtml(item, index, searchString, isSelected) {//L(e, t, n, i)
            searchString = searchString.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
            var a = searchString.length > 0;
            var s = new RegExp(searchString, "gi");
            var r = item.symbolGroup.name + " " + item.symbolGroup.category;
            var d = item.symbol.description || "";
            var c = isSelected ? "active " : "";

            if (scope.isItemAddedFunction) {
                scope.isItemAddedFunction({
                    item: item
                });

                c += " item-added ";
            }
            //     scope.isItemAddedFunction && scope.isItemAddedFunction({
            //     item: e
            // }) && (c += " item-added "),


            index += scope.firstDisplayedIndex;
            var u = scope.isOpenChartEnabled ? '<div class="mw-ct-chart-btn-icon" title="' + te + '"></div>' : '<div class="mw-ct-chart-btn-disabled-icon" title="' + ne + '"></div>';
            var p = scope.isFavoriteSymbol(item.key) ? '<div class="mw-ct-fav-btn-icon" title="' + oe + '"></div>' : '<div class="mw-ct-fav-active-btn-icon" title="' + ae + '"></div>';
            var m = scope.addFavSymbolEnabled ? '<button class="mw-ct-fav-btn mw-btn-menu" data-mw-fav-btn ng-mouseup="favSymbolClicked($event, filteredItems[' + index + '])" xs-sound-button ng-dblclick="$event.stopPropagation();">' + p + "</button>" : "";
            var f = '<div class="options-menu"><button id="openInfoCtr" class="mw-info-btn mw-btn-menu" data-mw-info-symbol title="' + ee + '" ng-click="showInfo($event, filteredItems[' + index + '].key)"><span class="info-btn"></span></button><button id="openChartCtr" class="mw-ct-chart-btn mw-btn-menu" data-mw-open-chart-key=' + index + ' data-mw-open-chart ng-click="openChart($event, filteredItems[' + index + '].key)" xs-sound-button ng-dblclick="$event.stopPropagation();" title="{{openChartTooltip}}">' + u + '</button><button id="openTradeCtr" class="mw-ct-ticket-btn mw-btn-menu" data-mw-open-trade="' + index + '"  ng-click="openTradePopup_inner($event, filteredItems[' + index + '].key)" xs-sound-button ng-dblclick="$event.stopPropagation();" title="' + ie + '"><div class="mw-ct-ticket-btn-icon"></div></button>' + m + "</div>";
            var v = '<div class="description">' + d + "</div>" + (i ? f : "");
            var b = '<div class="single-symbol-container ' + c + '"><div class="symbol"><span class="symbol-name">' + (a ? item.name.replace(s, "<strong>$&</strong>") : item.name) + '</span><span class="asset-class">' + "..."/*e.symbolGroup.businessAssetClass*/ + '</span><p class="group-id">' + r + "</p></div>" + v + "</div>";
            return b
        }

        function armarItemToHtml(inicio, cantidad_show) {//A(e,t)
            var n, items = scope.displayedItems, a = "";
            if (items.length < cantidad_show - inicio)
                cantidad_show = inicio + items.length;



            for (n = inicio; n < cantidad_show; n++) {
                a += itemToHtml(items[n], n, scope.searchString, scope.selectedIndex === n);
            }


            return a
        }
        function animar() {//U
            z = false;
            var html_salida = "";//e
            var firstDisplayedIndex = scope.firstDisplayedIndex; //n
            var i = 0;
            var mostPopularInstruments_length = scope.mostPopularInstruments_filtro().length //a
            var cantidad_show = 5; //o

            // cantidad_show = Math.min(cantidad_show, mostPopularInstruments_length) + 1;
            scope.visibleLabels = 0;

            if (scope.searchString) {
                html_salida += armarItemToHtml(0, cantidad_show);
            }
            else {
                //             html_salida += armarItemToHtml(0, cantidad_show);
                if (0 === firstDisplayedIndex && mostPopularInstruments_length > 0) {
                    html_salida += '<p class="section-title">' + Z + "</p>";
                    scope.visibleLabels++;
                    cantidad_show -= 1;
                }
                if (firstDisplayedIndex < mostPopularInstruments_length) {
                    if (mostPopularInstruments_length - firstDisplayedIndex > cantidad_show) {
                        html_salida += armarItemToHtml(0, cantidad_show);
                        i = cantidad_show;
                    }
                    else {
                        html_salida += armarItemToHtml(0, mostPopularInstruments_length - firstDisplayedIndex);
                        i = mostPopularInstruments_length - firstDisplayedIndex;
                    }

                }

                // if (i < cantidad_show) {
                //     if (firstDisplayedIndex < mostPopularInstruments_length + 1 && mostPopularInstruments_length > 0) {
                //         cantidad_show -= 1;
                //         html_salida += '<p class="section-title">' + J + "</p>";
                //         scope.visibleLabels++;
                //         if (i < cantidad_show )
                //             html_salida += armarItemToHtml(i, cantidad_show);
                //     }
                //     else
                //         html_salida += armarItemToHtml(0, cantidad_show);
                // }

            }

            // scope.searchString ? e += A(0, o) : (0 === n && a > 0 && (e += '<p class="section-title">' + Z + "</p>",
            //     scope.visibleLabels++ ,
            //     o -= 1),
            //     n < a && (a - n > o ? (e += A(0, o),
            //         i = o) : (e += A(0, a - n),
            //             i = a - n)),
            //     i < o && (n < a + 1 && a > 0 ? (o -= 1,
            //         e += '<p class="section-title">' + J + "</p>",
            //         scope.visibleLabels++ ,
            //         i < o && (e += A(i, o))) : e += A(0, o)));


            var s_html = html_salida;//t(e)(l);
            objtWraper.symbolsContainer.html(s_html);

            pegarEventos();
            calcularArea();
        }

        function pegarEventos() {


            //jq("button[data-mw-open-trade]").off("click", openTradePopup_bind);
            jq("#openTradeCtr").click(function (e) {
                armarOpenOferta();
                //MAE.PopupsService.showTrade();
                //openTradePopup_bind(e, this);

            });

            jq("#openInfoCtr").click(function (e) {
                armarShowInfo();
                //MAE.PopupsService.showTrade();
                //openTradePopup_bind(e, this);

            });


            jq("#openChartCtr").on("click", function () {
                var index = $(this).attr("data-mw-open-chart-key");

                var symbol = scope.filteredItems[index]
                MAE.ChartsService.open(ChartEvent.OPEN_CHART, symbol);

            });


        }


        function armarShowInfo() {
            if (scope.selectCallback && scope.displayedItems.length > 0) {
                var e = scope.displayedItems[scope.selectedIndex];
                var t = scope.selectCallback({
                    res: {
                        value: e,
                        query: scope.searchString
                    }
                });
                t !== !1 && (t = t || !0);

                if (t) {
                    if (scope.setSymbol || "string" == typeof scope.setSymbol) {
                        scope.searchString = e.symbol.name;
                        scope.hideList(false);
                    }
                    else
                        scope.hideList(true);
                }

                MAE.PopupsService.showInfo(e.symbol);
                //console.log("Show info " + e.symbol.key);

                // i.playSound(i.SOUND_BUTTON_CLICK);
            }

        }

        function armarOpenOferta() {
            if (scope.selectCallback && scope.displayedItems.length > 0) {
                var e = scope.displayedItems[scope.selectedIndex];
                var t = scope.selectCallback({
                    res: {
                        value: e,
                        query: scope.searchString
                    }
                });
                t !== !1 && (t = t || !0);

                if (t) {
                    if (scope.setSymbol || "string" == typeof scope.setSymbol) {
                        scope.searchString = e.symbol.name;
                        scope.hideList(false);
                    }
                    else
                        scope.hideList(true);
                }
                MAE.PopupsService.showTrade(e.symbol);
                //console.log("Show open oferta " + e.symbol.key);

                // i.playSound(i.SOUND_BUTTON_CLICK);
            }

        }

        function armarOpenChart() {

            if (scope.selectCallback && scope.displayedItems.length > 0) {
                var e = scope.displayedItems[scope.selectedIndex];
                var t = scope.selectCallback({
                    res: {
                        value: e,
                        query: scope.searchString
                    }
                });
                t !== !1 && (t = t || !0);

                if (t) {
                    if (scope.setSymbol || "string" == typeof scope.setSymbol) {
                        scope.searchString = e.symbol.name;
                        scope.hideList(false);
                    }
                    else
                        scope.hideList(true);
                }

                MAE.ChartsService.open(ChartEvent.OPEN_CHART, e.symbol);

                // i.playSound(i.SOUND_BUTTON_CLICK);
            }
        }

        function armarQuery() {//F
            scope.searchString = objtWraper.input.val();
            if (scope.selectCallback && scope.displayedItems.length > 0) {
                var e;
                if (scope.selectedIndex >= 0)
                    e = scope.displayedItems[scope.selectedIndex];


                //t !== !1 && (t = t || !0);
                if (e) {
                    var t = scope.selectCallback({
                        res: {
                            value: e,
                            query: scope.searchString
                        }
                    });
                }



                t !== false && (t = t || true);

                if (t) {
                    if (scope.setSymbol || "string" == typeof scope.setSymbol) {
                        scope.searchString = e.symbol.name;
                        scope.hideList(false);
                    }
                    else {
                        if (e)
                            scope.hideList(true);

                    }

                }
                // scope.hideList(true);            

                // i.playSound(i.SOUND_BUTTON_CLICK);
            }
        }
        function limpiarEventos(e) {//R
            d.unsubscribeCurrentWorkspaceFillEvents(null, N);
            document.removeEventListener("mousedown", M);

            if (objtWraper) {
                if (objtWraper.input) {
                    objtWraper.input.focus(null);
                    objtWraper.input[0].removeEventListener("keydown", V, !0);
                    objtWraper.input[0].removeEventListener("keyup", k, !0);
                }

                if (objtWraper.symbolsContainer) {
                    objtWraper.symbolsContainer.unbind("mousewheel", b);
                    objtWraper.symbolsContainer.unbind("mousemove", g);
                    objtWraper.symbolsContainer.unbind("click", x);
                }




                objtWraper.input = null;
                objtWraper.inputWrapper = null;
                objtWraper.mainContainer = null;
                objtWraper.symbolsContainer = null;
                objtWraper.scrollContainer = null;
                objtWraper = null;
            }

            if (_jScrollPane) {
                _jScrollPane.unbind("jsp-scroll-y", S);
                _jScrollPane.unbind("jsp-initialised", I);
                _jScrollPane = null;

            }

            _jsp = null;

            scope.displayedItems && (scope.displayedItems.length = 0);
            scope.allItems && (scope.allItems.length = 0);
            scope.filteredItems && (scope.filteredItems.length = 0);

        }
        function O() {
            armarQuery();
            scope.hideList();
        }
        function _currentWorkspaceFill(e) {//N
            switch (e) {
                case ChartWorkspaceFillEvent.WORKSPACE_IS_FULL:
                    scope.isOpenChartEnabled = false;
                    // scope.openChartTooltip = n.getString("CHART.MAX_CHARTS", {
                    //     count: XChartConst.MAX_CHARTS
                    // });
                    break;
                case ChartWorkspaceFillEvent.WORKSPACE_IS_NOT_FULL:
                case ChartWorkspaceFillEvent.WORKSPACE_IS_EMPTY:
                    scope.isOpenChartEnabled = !0,
                        scope.openChartTooltip = n.getString("MARKET_WATCH_TICKET.OPEN_CHART")
            }
        }
        var _jsp, _jScrollPane, input_metric = {
            x: 0,
            y: 0
        }, symbolsContainer_metric = {
            x: 0,
            y: 0
        }, /*W*/ _temp_rows = -1,/*X*/ _numRows = 5, /*Y*/_extra_rows = 1, G = 1e3, q = {
            x: -1,
            y: -1
        }, z = !1, Q = ((new Date).getTime() + "_" + Math.floor(1e4 * Math.random()), null);


        scope.mostPopularVisible = true;
        scope.showAddToFavorites = false;
        scope.addFavSymbolEnabled = true;
        scope.visibleLabels = 0;
        var J = n.getString("SYMBOLS_SEARCH_EXTENDED.OTHERS").toUpperCase();
        var Z = n.getString("SYMBOLS_SEARCH_EXTENDED.MOST_POPULAR").toUpperCase();
        var ee = n.getString("POPUP_TRADE_SYMBOL_INFO.INSTRUMENT_INFORMATION");
        var te = n.getString("MARKET_WATCH_TICKET.OPEN_CHART");
        var ne = n.getString("CHART.MAX_CHARTS", {
            //count: XChartConst.MAX_CHARTS
        });
        var ie = n.getString("MARKET_WATCH_TICKET.OPEN_TICKET");
        var ae = n.getString("MARKET_WATCH_TICKET.REMOVE_FROM_FAVORITES");
        var oe = n.getString("MARKET_WATCH_TICKET.ADD_TO_FAVORITES");

        scope.NO_RESULTS = n.getString("SYMBOLS_SEARCH.NO_RESULTS");
        scope.LOOKING_FOR_NEW = n.getString("SYMBOLS_SEARCH_EXTENDED.LOOKING_FOR_NEW");
        scope.CHECK_OUT_TOP_MOVERS = n.getString("SYMBOLS_SEARCH_EXTENDED.CHECK_OUT_TOP_MOVERS");
        scope.BASE_ON_MARKET_SENTIMENTS = n.getString("SYMBOLS_SEARCH_EXTENDED.BASE_ON_MARKET_SENTIMENTS");
        scope.BASE_ON_MARKET_SENTIMENTS = n.getString("SYMBOLS_SEARCH_EXTENDED.BASE_ON_MARKET_SENTIMENTS");
        scope.FILTER_OUT_STOCKS = n.getString("SYMBOLS_SEARCH_EXTENDED.FILTER_OUT_STOCKS");
        scope.CHECK_HEATMAPS = n.getString("SYMBOLS_SEARCH_EXTENDED.CHECK_HEATMAPS");
        scope.TRADING_IDEAS = n.getString("SYMBOLS_SEARCH_EXTENDED.TRADING_IDEAS");
        scope.BACK_TO_SEARCH = n.getString("SYMBOLS_SEARCH_EXTENDED.BACK_TO_SEARCH");
        //scope.placeholder = n.getString("SYMBOLS_SEARCH_EXTENDED.PLACEHOLDER");

        scope.updateBasePosition = left_top;
        scope.hideList = function (t, n) {
            n = n || "";
            _temp_rows = -1;
            scope.opened = false;
            t === true ? scope.searchString = "" : "" !== n && (scope.searchString = n);
            objtWraper.input.blur();
            setTimeout(function () { }, 0, true);
            document.removeEventListener("mousedown", document_mousedown);
            objtWraper.mainContainer.css("display", "none");
            scope.openCallback && scope.openCallback({
                opened: !1
            });
            scope.tabs[1].active = false;
            scope.tabs[0].active = true;



            Q && (a.removePopup(Q), Q = null)
        };

        scope.updateListView = function (e) {

            if (e)
                animar();
            else {
                if (!z) {
                    z = true;
                    requestAnimationFrame(animar);
                }
            }

            // e ? U() : z || (z = !0,requestAnimationFrame(U))
        };

        scope.updateScrollBarPos = function () {
            _jsp.scrollToPercentY(scrollToPercent(scope.firstDisplayedIndex), false);
        };

        // scope.$on("hideList", function () {
        //     scope.hideList(!0)
        // });
        // scope.$on("$destroy", R),
        //     scope.hideResults = function () {
        //         scope.hideList(!0);
        //         scope.selectCallback(null);
        //     };

        scope.showResults = preparar_focus;
        scope.showInfo = function (e, t) {
            e.preventDefault();
            e.stopPropagation();
            O();
            a.addPopup("popupTradeSymbolInfoMW", !0, !0, PopupsType.POPUP_SYMBOL_INFO, {
                symbolKey: t,
                id: "popupTradeSymbolInfoMW"
            });
            s.eventClick(ModulesType.MAIN, "symbolInfo", "showSymbolInfo", "marketWatch");
        };

        scope.openChart = function (e, t) {
            e.preventDefault();
            e.stopPropagation();

            if (scope.isOpenChartEnabled) {
                O();
                d.openChart(t, void 0, !1);
            }

            // scope.isOpenChartEnabled && (O(),
            //     d.openChart(t, void 0, !1))
        };

        scope.openTradePopup_inner = function (e, t) {
            e.preventDefault();
            e.stopPropagation();
            O();
            a.addPopup("popupTradeTicket", true, true, PopupsType.POPUP_TRADE_TICKET, {
                symbolKey: t
            })
        };

        scope.favSymbolClicked = function (t, n) {
            t.preventDefault();
            t.stopPropagation();
            r.toggleFavoriteSymbol(n.key);
            setTimeout(function () {
                r.isFavoriteSymbol(n.key) ? O() : scope.hideList()
            }, 100)
        };

        scope.isFavoriteSymbol = function (e) {
            return true;
            //return !r.isFavoriteSymbol(e);
        };

        scope.isOpenChartEnabled = false;
        scope.openChartTooltip = null;

        //jq.extend(scope, scope_target);
        //CharService == d
        //d.loadAndSubscribeCurrentWorkspaceFillEvents(null, _currentWorkspaceFill);
        _controller(scope);
        _init();
    }
    function _controller(t) {//u

        function opened_change(e, n) {//n
            if (t.opened && I) {
                I = false;
                u_inter();
                updateDisplayedItems();
            }
        }
        function i(e) {
            var n = t.preferredDataProvider;
            if (!n || 0 == n.length)
                return e;
            var i = function (e) {
                return n.indexOf(e) < 0
            };
            return e.filter(i)
        }
        function a(e) {
            return t.symbolsFilter({
                item: e
            })
        }
        function sort(e, t) {//s
            return e.symbol < t.symbol ? -1 : e.symbol > t.symbol ? 1 : 0
        }

        t.mostPopularInstruments_filtro = function () {
            return t.mostPopularInstruments.filter(filtro);

        }

        function setmostPopularInstruments() {//r
            // for (var e = null, n = 0, i = C.length; n < i; n++) {
            //     e = o.getQuoteLightByAssetClassAndSymbolName(C[n].assetClass, C[n].symbolName);
            //     if (e)
            //         t.mostPopularInstruments.push(e);
            // }

            for (var i = 0; i < t.symbols.length; i++) {
                //if (filtro(t.symbols[i]))
                t.mostPopularInstruments.push(t.symbols[i]);
            }




        }
        function filteredItems_sort(e, t) {//d
            var n = e.idAssetClass
                , i = t.idAssetClass;
            return n == i ? e.name < t.name ? -1 : e.name > t.name ? 1 : 0 : n == y ? -1 : i == y ? 1 : i - n
        }
        function filtro(e) {

            return e.symbolGroup.category == scope.selectedCategoryName && e.symbolGroup.name == scope.groupingKey && !e.symbol.isCloseOnly

        }
        function u_inter() {//u
            var e;

            if (t.symbols && t.symbols.length > 0) {
                if (t.preferredDataProvider && t.preferredDataProvider.length > 0) {
                    if (t.preferredDataProvider !== t.symbols)
                        t.preferredDataProvider.concat(i(t.symbols)).filter(c)
                }

            }
            if (t.symbols && t.symbols.length > 0)
                if (t.preferredDataProvider && t.preferredDataProvider.length > 0)
                    if (t.preferredDataProvider !== t.symbols)
                        e = t.preferredDataProvider.concat(i(t.symbols)).filter(filtro)
                    else
                        e = t.preferredDataProvider.filter(filtro)
                else
                    if ("true" == String(t.useSymbolsFilter))
                        e = t.symbols.filter(filtro).filter(a)
                    else
                        e = t.symbols.filter(filtro)
            else
                e = [];


            // e = t.symbols && t.symbols.length > 0 ? t.preferredDataProvider && t.preferredDataProvider.length > 0 ? t.preferredDataProvider !== t.symbols ? t.preferredDataProvider.concat(i(t.symbols)).filter(c) : t.preferredDataProvider.filter(c) : "true" == String(t.useSymbolsFilter) ? t.symbols.filter(c).filter(a) : t.symbols.filter(c) : [];

            // t.allItems = [];
            var n = t.allItems;
            n.length = 0;
            for (var o = e.length, l = 0; l < o; l++)
                n[l] = e[l];
            n.sort(sort);
        }
        function p(e) {
            return 0 === e.name.toUpperCase().indexOf(w);
        }
        function filtro_nombre(e) {//m
            return e.name.toUpperCase().indexOf(w) > -1;
        }

        function filtro_nombre_regExp(e) {
            return e.name.toUpperCase().search(S) > -1;
        }

        function filtro_description(e) {//f
            return !!(e.symbol.description && e.symbol.description.search(S) > -1) || !!(e.symbol.instrumentTag && e.symbol.instrumentTag.search(S) > -1)
        }
        function updateDisplayedItems(e) {//v
            var n, i, filteredItems_slice = [];//a
            w = t.searchString.toUpperCase();
            var o = w.search(".(, | )[MHDW]{1}([0-9]{0,2}|N)$");

            if (o > -1 && (w = w.substr(0, o + 1)), e = e !== false) {

                if (0 == w.length) {
                    t.filteredItems = t.mostPopularInstruments_filtro();//.concat(t.allItems);
                    t.mostPopularVisible = true;
                }
                else {
                    var lista_filtrada, s, lista_final = [], c = w.split(" ");

                    // l = t.allItems.filter(p);
                    // r = r.concat(l);
                    lista_filtrada = t.mostPopularInstruments_filtro().filter(filtro_nombre)//t.allItems.filter(m);
                    lista_final = lista_final.concat(lista_filtrada);
                    s = c.join(".*");/*para buscar entre dos palabras*/
                    S = new RegExp(s, "i");
                    lista_filtrada = t.mostPopularInstruments_filtro().filter(filtro_description);//
                    lista_final = lista_final.concat(lista_filtrada);

                    if (c.length >= 2) {
                        for (s = "", n = 0, i = c.length; n < i; n++)
                            s += "(?=.*" + c[n] + ")";

                        S = new RegExp(s, "i");
                        lista_filtrada = t.mostPopularInstruments_filtro().filter(filtro_nombre_regExp);
                        lista_final = lista_final.concat(lista_filtrada);

                        lista_filtrada = t.mostPopularInstruments_filtro().filter(filtro_description);
                        lista_final = lista_final.concat(lista_filtrada);
                    }
                    t.filteredItems = lista_final;
                    t.mostPopularVisible = false;
                }
                t.filteredItems = ArrayUtils.getUniqueItemsFast(t.filteredItems, "key");

                if (t.selectedCategoryName && t.selectedCategoryName != SymbolCategories.FAVORITES) {
                    //y = SymbolCategoriesAssetClass[t.selectedCategoryName];
                    t.filteredItems.sort(filteredItems_sort);
                }
                // (y = SymbolCategoriesAssetClass[t.selectedCategoryName],
                //     t.filteredItems.sort(d))
            }
            var ref_filteredItems = t.filteredItems;//u
            if (ref_filteredItems.length > 0) {
                var v = Math.min(t.firstDisplayedIndex, ref_filteredItems.length - 1);
                var b = Math.min(v + t.numRows, ref_filteredItems.length);
                filteredItems_slice = ref_filteredItems.slice(v, b);
            }
            var ref_displayedItems = t.displayedItems; //h

            ref_displayedItems.length = 0;
            for (n = 0, i = filteredItems_slice.length; n < i; n++)
                ref_displayedItems[n] = filteredItems_slice[n];

            if (t.selectedIndex >= i)
                t.selectedIndex = 0;

            t.noResults = (0 == h.length);
            t.updateListView(e);

        }
        function searchString_change(e, n) {//b
            if (e != n && t.opened) {
                scope.selectedIndex = -1;
                t.firstDisplayedIndex = 0;
                updateDisplayedItems();//v
                t.updateScrollBarPos();
            }

            // e != n && t.opened && (t.firstDisplayedIndex = 0,
            //     v(),
            //     t.updateScrollBarPos())


        }
        function firstDisplayedIndex_change(e, t) {//h
            e != t && updateDisplayedItems(false)
        }
        function symbols_change(e, t) {//g
            I = true;
            scope.symbols = e;
            e && e.length > 0 && setmostPopularInstruments();
        }
        function setSymbol(e, n) {//x
            t.searchString = void 0 !== e ? e : ""
        }
        var I = false;
        var y = null;
        t.opened = !1;
        t.allItems = [];
        t.filteredItems = [];
        t.displayedItems = [];
        t.numRows = t.maxRows > 0 ? Math.min(t.maxRows, 5) : 5;
        // t.firstDisplayedIndex = 0;
        t._firstDisplayedIndex = 0;
        Object.defineProperty(t, "firstDisplayedIndex", {
            get: function (val) {
                return t._firstDisplayedIndex;
            },

            set: function (val) {
                var old = t._firstDisplayedIndex;
                t._firstDisplayedIndex = val;
                firstDisplayedIndex_change(val, old);
            }
        });
        t._setSymbol;
        Object.defineProperty(t, "setSymbol", {
            get: function (val) {
                return t._setSymbol;
            },

            set: function (val) {
                var old = t._setSymbol;
                t._setSymbol = val;
                setSymbol(val, old);
            }
        });

        t.selectedIndex = 0;

        t._opened = false;
        Object.defineProperty(t, "opened", {
            get: function (val) {
                return t._opened;
            },

            set: function (val) {
                var old = t._opened;
                t._opened = val;
                opened_change(val, old);
            }
        });

        t._searchString = "";
        Object.defineProperty(t, "searchString", {
            get: function (val) {
                return t._searchString;
            },

            set: function (val) {
                var old = t._searchString;
                t._searchString = val;
                searchString_change(val, old);
            }
        });

        t.rowHeight = 35;
        t.noScrollbar = false;
        t.noResults = false;
        t.tabs = [{
            id: 0,
            active: true
        }, {
            id: 1,
            active: false
        }];
        t.AssetClass = AssetClass;
        t.changeTab = function () {
            t.tabs[0].active = !t.tabs[0].active;
            t.tabs[1].active = !t.tabs[1].active;

            if (t.tabs[0].active) {
                t.updateDisplayedItems();
                setTimeout(function () { }, 0, !0);
                t.updateBasePosition();
                setTimeout(t.updateBasePosition, 10);
            }

            // t.tabs[0].active && (t.updateDisplayedItems(),
            //     e(function () { }, 0, !0),
            //     t.updateBasePosition(),
            //     e(t.updateBasePosition, 10))
        };

        t.mostPopularInstruments = [];
        var w = "";
        var S = null
        var C = [{
            symbolName: "EURUSD",
            assetClass: AssetClass.FX
        }, {
            symbolName: "DE30",
            assetClass: AssetClass.IND
        }, {
            symbolName: "GOLD",
            assetClass: AssetClass.CMD
        }, {
            symbolName: "AAPL.US",
            assetClass: AssetClass.EQ
        }, {
            symbolName: "BITCOIN",
            assetClass: AssetClass.CRT
        }];
        t.getLastDisplayedIndex = function () {
            return Math.min(t.firstDisplayedIndex + t.numRows, t.filteredItems.length - 1)
        };

        t.tradingIdeasOptions = [{
            moduleId: ModulesType.TOP_MOVERS
        }, {
            moduleId: ModulesType.MARKET_SENTYMENTS
        }, {
            moduleId: ModulesType.SCREENER
        }, {
            moduleId: ModulesType.HEATMAP
        }];
        t.openView = function (e) {
            scope.activateModule(e);
            scope.hideList();
        };

        t.updateDisplayedItems = updateDisplayedItems;
        // wathc_property(t, "symbols", symbols_change);
        // wathc_property(t, "symbols", symbols_change);

        scope.addQuotesLightLoaded(symbols_change);


        //watch(t, "symbols", symbols_change);
        // watch(t.symbols, "length", symbols_change);
        // watch(t, "preferredDataProvider", symbols_change);
        // watch(t.preferredDataProvider, "length", symbols_change);
        // watch(t, "opened", opened_change);
        // watch(t, "searchString", searchString_change);
        // watch(t, "firstDisplayedIndex", firstDisplayedIndex_change);
        // watch(t, "setSymbol", setSymbol);
    };


    jq.extend(true, window, {
        MAE: {
            SymbolsSearchBarExtended:
            {

                templateUrl: "SymbolsSearchBarExtended",
                replace: true,
                update: _update,
                link: _link,
                isLoad: _isLoad,
                onClickButton: _onClickButton,
                inputFocus: _inputFocus
            }
        }
    });
})(jQuery)