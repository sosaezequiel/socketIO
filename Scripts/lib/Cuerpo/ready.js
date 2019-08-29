$(document).ready(
    function () {

        var traducciones = {};
        traducciones["MODULES.marketWatch"] = "Market Watch";
        traducciones["MODULES_DESCRIPTIONS.marketWatch"] = "Market Watch";
        traducciones["MODULES.charts"] = "Charts   ";
        traducciones["MODULES_DESCRIPTIONS.charts"] = "Graficos";
        traducciones["MODULES.openTrades"] = "Open Positions";
        traducciones["MODULES_DESCRIPTIONS.openTrades"] = "Open Positions";
        traducciones["MODULES.pendingTrades"] = "Pending Orders";
        traducciones["MODULES_DESCRIPTIONS.pendingTrades"] = "Pending Orders";

        traducciones["MODULES.ordersHistory"] = "Orders";
        traducciones["MODULES_DESCRIPTIONS.ordersHistory"] = "Orders";

        traducciones["MODULES.history"] = "History";
        traducciones["MODULES_DESCRIPTIONS.history"] = "History";

        traducciones["MODULES.closedPositions"] = "Close positions";
        traducciones["MODULES_DESCRIPTIONS.closedPositions"] = "Close positions";

        traducciones["MODULES.rejected"] = "Rejected";
        traducciones["MODULES_DESCRIPTIONS.rejected"] = "Rejected";
        traducciones["MODULES.symbolInfo"] = "Symbol Info";
        traducciones["MODULES_DESCRIPTIONS.symbolInfo"] = "Symbol Info";

        traducciones["MODULES.Garanty"] = "Garanty";

        traducciones["LAYOUT.DETACH"] = "Separar  Vista";
        traducciones["LAYOUT.MAXIMIZE"] = "Maximizar";
        traducciones["LAYOUT.MINIMALIZE"] = "Minimixar";
        traducciones["LAYOUT.CLOSE"] = "Cerrar";
        traducciones["LAYOUT.EMPTY_CONTAINER"] = "Contenedor vacio";
        traducciones["LAYOUT.ADD_MODULE_OR_CHANGE_LAYOUT"] = "Añada un Modulo"; /*o cambie el diseño*/


        traducciones["MARKET_WATCH.SYMBOL"] = "SYMBOL";
        traducciones["MARKET_WATCH.BID"] = "Buy";
        traducciones["MARKET_WATCH_TICKET.SPREAD"] = "Spread";
        traducciones["MARKET_WATCH.CHANGE"] = "Change";
        traducciones["MARKET_WATCH.ASK"] = "Sell";
        traducciones["MARKET_WATCH.LOW"] = "Low";
        traducciones["MARKET_WATCH.HIGH"] = "High";
        traducciones["MARKET_WATCH.TIME"] = "Time";
        traducciones["CONTEXT_MENU.TRADE"] = "Trade";
        traducciones["MARKET_WATCH.CT_VIEW"] = "View";
        traducciones["MARKET_WATCH.CHANGE_INTERVAL_TEMPL"] = "Change";
        traducciones["SYMBOLS_SEARCH_EXTENDED.MOST_POPULAR"] = "Symbols";
        traducciones["MARKET_WATCH_GROUP.MAE"] = "MAE";
        traducciones["MARKET_WATCH_GROUP.CPC2"] = "Dólar Futuro";

        traducciones["GARANTY.receptor"] = "Receptor";
        traducciones["GARANTY.dador"] = "Dador";
        traducciones["GARANTY.moneda"] = "moneda";
        traducciones["GARANTY.montoAsignado"] = "Monto asignado";
        traducciones["GARANTY.montoConsumido"] = "Monto consumido";
        traducciones["GARANTY.fichas"] = "Fichas";
        traducciones["GARANTY.disponible"] = "Disponible";
        traducciones["GARANTY.clearingHouse"] = "Clearing house";



        traducciones["CHAR_TRADE_SYMBOL.INFORMATION"] = "Open chart";




        traducciones["POPUP_TRADE_SYMBOL_INFO.INSTRUMENT_INFORMATION"] = "Open info";
        traducciones["MARKET_WATCH_TICKET.OPEN_CHART"] = "open chart";
        traducciones["CHART.MAX_CHARTS"] = "max chart";
        traducciones["MARKET_WATCH_TICKET.OPEN_TICKET"] = "open ticket";
        traducciones["MARKET_WATCH_TICKET.REMOVE_FROM_FAVORITES"] = "remove fav";
        traducciones["MARKET_WATCH_TICKET.ADD_TO_FAVORITES"] = "add fav";
        traducciones["SYMBOLS_SEARCH.NO_RESULTS"] = "no matches found ";
        traducciones["SYMBOLS_SEARCH_EXTENDED.LOOKING_FOR_NEW"] = "looking for new";
        //  traducciones["SYMBOLS_SEARCH_EXTENDED.CHECK_OUT_TOP_MOVERS"] = "traduccion" undefined
        //  traducciones["SYMBOLS_SEARCH_EXTENDED.BASE_ON_MARKET_SENTIMENTS"] = "traduccion" undefined
        //  traducciones["SYMBOLS_SEARCH_EXTENDED.FILTER_OUT_STOCKS"] = "traduccion" undefined
        //  traducciones["SYMBOLS_SEARCH_EXTENDED.CHECK_HEATMAPS"] = "traduccion" undefined
        //  traducciones["SYMBOLS_SEARCH_EXTENDED.TRADING_IDEAS"] = "traduccion" Trading Ideas
        //  traducciones["SYMBOLS_SEARCH_EXTENDED.BACK_TO_SEARCH"] = "traduccion" undefined
        //  traducciones["OPEN_TRADE.ADD_STOP_LOSS"] = "traduccion" undefined
        //  traducciones["OPEN_TRADE.ADD_TAKE_PROFIT"] = "traduccion" undefined
        //  traducciones["OPEN_TRADES.EXPIRY_DATE_TOOLTIP"] = "traduccion" undefined
        //  traducciones["OPEN_TRADES.NOMINAL_VALUE_TOOLTIP"] = "traduccion" undefined
        //  traducciones["OPEN_TRADES.NET_PROFIT_TOOLTIP_FX"] = "traduccion" undefined
        //  traducciones["OPEN_TRADES.NET_PROFIT_TOOLTIP_STC_ETF"] = "traduccion" undefined
        //  traducciones["OPEN_TRADES.NET_PROFIT_IS_CALCULATED"] = "traduccion" undefined
        traducciones["OPEN_TRADES.CLOSE"] = "close";
        traducciones["OPEN_TRADES.OPEN_ORIGIN"] = "open origin";
        traducciones["OPEN_TRADES.COMMENT"] = "comment";
        traducciones["OPEN_TRADES.PROFIT"] = "profit";
        traducciones["OPEN_TRADES.TOTAL_PROFIT"] = "total profit";
        traducciones["OPEN_TRADES.SWAP"] = "swap";
        traducciones["OPEN_TRADES.CLOSE_COMMISSION"] = "close commission";
        traducciones["OPEN_TRADES.COMMISSION"] = "commission";
        traducciones["OPEN_TRADES.NET_PL"] = "net pl";
        traducciones["OPEN_TRADES.MARKET_VALUE"] = "market value";
        traducciones["OPEN_TRADES.PURCHASE_VALUE"] = "purchase value";
        traducciones["OPEN_TRADES.MARGIN"] = "margin";
        traducciones["OPEN_TRADES.MARKET_PRICE"] = "market price";
        traducciones["OPEN_TRADES.EXPIRY_DATE"] = "expiry day";
        traducciones["OPEN_TRADES.TP"] = "tp";
        traducciones["OPEN_TRADES.SL"] = "sl";
        traducciones["OPEN_TRADES.OPEN_PRICE"] = "open price";
        traducciones["OPEN_TRADES.OPEN_TIME"] = "open time";
        traducciones["OPEN_TRADES.VOLUME"] = "Cantidad";
        traducciones["OPEN_TRADES.TYPE"] = "type";
        traducciones["OPEN_TRADES.SYMBOL"] = "symbol";
        traducciones["OPEN_TRADES.ORDER"] = "order";
        traducciones["OPEN_TRADES.POSITION"] = "position";
        traducciones["OPEN_TRADES.PRICE"] = "Price";
        traducciones["OPEN_TRADES.SEQUENCENUMBER"] = "Sequence number";


        /*HISTORY*/
        traducciones["HISTORY.CLOSE"] = "close";
        traducciones["HISTORY.OPEN_ORIGIN"] = "open origin";
        traducciones["HISTORY.COMMENT"] = "comment";
        traducciones["HISTORY.PROFIT"] = "profit";
        traducciones["HISTORY.TOTAL_PROFIT"] = "total profit";
        traducciones["HISTORY.SWAP"] = "swap";
        traducciones["HISTORY.CLOSE_COMMISSION"] = "close commission";
        traducciones["HISTORY.COMMISSION"] = "commission";
        traducciones["HISTORY.NET_PL"] = "net pl";
        traducciones["HISTORY.MARKET_VALUE"] = "market value";
        traducciones["HISTORY.PURCHASE_VALUE"] = "purchase value";
        traducciones["HISTORY.MARGIN"] = "margin";
        traducciones["HISTORY.MARKET_PRICE"] = "market price";
        traducciones["HISTORY.EXPIRY_DATE"] = "expiry day";
        traducciones["HISTORY.TP"] = "tp";
        traducciones["HISTORY.SL"] = "sl";
        traducciones["HISTORY.OPEN_PRICE"] = "open price";
        traducciones["HISTORY.OPEN_TIME"] = "open time";
        traducciones["HISTORY.VOLUME"] = "volume";
        traducciones["HISTORY.TYPE"] = "type";
        traducciones["HISTORY.SYMBOL"] = "symbol";
        traducciones["HISTORY.ORDER"] = "order";
        traducciones["HISTORY.POSITION"] = "position";
        traducciones["HISTORY.PRICE"] = "Price";
        traducciones["HISTORY.FECHA"] = "Date";
        traducciones["HISTORY.TOTAL"] = "Total";


        traducciones["HISTORY.Monto"] = "Monto";
        traducciones["HISTORY.Cantidad"] = "Cantidad";
        traducciones["HISTORY.PrecioDetalle"] = "PrecioDetalle";
        traducciones["HISTORY.NroOperacionMercado"] = "N° Ope M";
        traducciones["HISTORY.NumeroOrdenMercado"] = "N° Orden M";
        traducciones["HISTORY.PersonaDescripcion"] = "Persona";
        traducciones["HISTORY.Remanente"] = "Remanente";
        traducciones["HISTORY.Ejecutada"] = "Ejecutada";
        traducciones["HISTORY.Precio"] = "Precio";
        traducciones["HISTORY.CodigoMercado"] = "Mercado";
        traducciones["HISTORY.MonedaDescripcion"] = "Moneda";
        traducciones["HISTORY.PlazoDescripcion"] = "Plazo";
        traducciones["HISTORY.ProductoDescripcion"] = "Producto";
        traducciones["HISTORY.CompraVenta"] = "C o V";
        traducciones["HISTORY.FechaConcertacion"] = "Fecha";
        traducciones["HISTORY.Estado"] = "Estado";
        traducciones["HISTORY.NumeroOrdenInterno"] = "N°";
        traducciones["HISTORY.BITACORA"] = "Bitacora Orden";


        traducciones["DETALLE.NroOperacionMercado"] = "Número Operacion Mercado";
        traducciones["DETALLE.Precio"] = "Precio";
        traducciones["DETALLE.Cantidad"] = "Cantidad";
        traducciones["DETALLE.Monto"] = "Monto";
        traducciones["DETALLE.Tasa"] = "Tasa";
        traducciones["DETALLE.Fecha"] = "Fecha";


        traducciones["ORDERS_HISTORY.NO_RESULTS"] = "no result";
        traducciones["ORDERS_HISTORY.NO_RESULTS_FOR_SELECTED_FILTERS"] = "no result for selected filters";

        traducciones["TRADE_TYPES.SELL"] = "Sell";
        traducciones["TRADE_TYPES.BUY"] = "Buy";

        traducciones["OPEN_TRADES.CLOSE_ALL"] = "Close All";
        traducciones["OPEN_TRADES.CLOSE_WINNERS"] = "Close Winners";
        traducciones["OPEN_TRADES.CLOSE_LOSERS"] = "Close Losers";
        traducciones["OPEN_TRADES.TOTAL"] = "Total";

        traducciones["OPEN_TRADES.FECHA"] = "Date";





        traducciones["PENDING_TRADES.NOMINAL_VALUE_TOOLTIP"] = "Nominal Value";
        traducciones["PENDING_TRADES.TOTAL"] = "Total";
        traducciones["PENDING_TRADES.DELETE"] = "Delete";
        traducciones["PENDING_TRADES.COMMENT"] = "Comment";
        traducciones["PENDING_TRADES.NOMINAL_VALUE"] = "Nominal Value";
        traducciones["PENDING_TRADES.MARGIN"] = "Margin";
        traducciones["PENDING_TRADES.MARKET_PRICE"] = "Market Price";
        traducciones["PENDING_TRADES.OPEN_PRICE"] = "Open Price";
        traducciones["PENDING_TRADES.OPEN_TIME"] = "Open Time";
        traducciones["PENDING_TRADES.VOLUME"] = "Volumen";
        traducciones["PENDING_TRADES.TYPE"] = "Type";
        traducciones["PENDING_TRADES.SYMBOL"] = "Symbol";
        traducciones["PENDING_TRADES.ORDER"] = "Order";
        traducciones["PENDING_TRADES.PRICE"] = "Price";
        traducciones["PENDING_TRADES.UPDATE"] = "Update";
        traducciones["PENDING_TRADES.TIMESTAMP"] = "Timestamp";


        traducciones["REJECTED.NOMINAL_VALUE_TOOLTIP"] = "Nominal Value";
        traducciones["REJECTED.DELETE"] = "Delete";
        traducciones["REJECTED.COMMENT"] = "Comment";
        traducciones["REJECTED.NOMINAL_VALUE"] = "Nominal Value";
        traducciones["REJECTED.MARGIN"] = "Margin";
        traducciones["REJECTED.MARKET_PRICE"] = "Market Price";
        traducciones["REJECTED.OPEN_PRICE"] = "Open Price";
        traducciones["REJECTED.OPEN_TIME"] = "Open Time";
        traducciones["REJECTED.VOLUME"] = "Volumen";
        traducciones["REJECTED.TYPE"] = "Type";
        traducciones["REJECTED.SYMBOL"] = "Symbol";
        traducciones["REJECTED.ORDER"] = "Order";
        traducciones["REJECTED.PRICE"] = "Price";
        traducciones["REJECTED.DETALLE"] = "Obs";


        traducciones["UNIT_NUMBERS.K"] = "K";
        traducciones["UNIT_NUMBERS.MN"] = "M";
        traducciones["UNIT_NUMBERS.BN"] = "B";
        traducciones["UNIT_NUMBERS.TN"] = "T";


        traducciones["MARKET.CLOSE"] = "Market closed";

        traducciones["MARKET.OPEN"] = "Market open";


        traducciones["DATE.SELECT_DATE_RANGE"] = "Select date range";
        traducciones["HISTORY.FROM"] = "From";
        traducciones["HISTORY.TO"] = "To";
        traducciones["POPUPS.APPLY"] = "Apply";
        traducciones["HISTORY.RANGE_TODAY"] = "Today";
        traducciones["HISTORY.RANGE_WEEK"] = "This week";
        traducciones["HISTORY.RANGE_MONTH"] = "This month";
        traducciones["HISTORY.RANGE_DAYS30"] = "Last 30 days";
        traducciones["HISTORY.RANGE_MONTHS3"] = "Last 3 months";
        traducciones["HISTORY.RANGE_YEAR"] = "This year";
        traducciones["HISTORY.RANGE_ALL"] = "All";
        traducciones["HISTORY.RANGE_CUSTOM"] = "Custom date";

        traducciones["ORDERS_HISTORY.ALL_STATUSES"] = "All statuses";
        traducciones["ORDERS_HISTORY.ALL_SYMBOLS"] = "All symbols";
        traducciones["ORDERS_HISTORY.SELECT_FILTER"] = "Choose filter";



        traducciones["BITACORA.TITLETEXT"] = "Bitacora de Orden";
        traducciones["BITACORA.Fecha"] = "Fecha";
        traducciones["BITACORA.UsuarioDescripcion"] = "Usuario";
        traducciones["BITACORA.EstadoDescripcion"] = "Estado";
        traducciones["BITACORA.AccionDescripcion"] = "Accion";
        traducciones["BITACORA.MotivoCancelacionDescripcion"] = "Motivo Baja";
        traducciones["BITACORA.Observaciones"] = "Observaciones";
        traducciones["BITACORA.Source"] = "Fuente";


        traducciones["MODULES.Depth"] = "Depth";
        traducciones["MODULES.marketWatchDepth"] = "Market-Depth";

        traducciones["MARKET_WATCH_DEPTH.VC"] = "V.BUY";
        traducciones["MARKET_WATCH_DEPTH.VV"] = "V.SELL";
        traducciones["MARKET_WATCH_DEPTH.OP"] = "OP";
        traducciones["MARKET_WATCH_DEPTH.CP"] = "CP";

        traducciones["SYMBOLS_SEARCH_EXTENDED.TRADING_IDEAS"] = "Trading Ideas";
        for (var t_i = 0; t_i < 3; t_i++)
            traducciones["MARKET_WATCH_GROUP.MERCADO_" + (t_i + 1)] = "Mercado " + (t_i + 1);

        // traducciones["MARKET_WATCH_GROUP.MERCADO_1"] = "Mercado 1";
        // traducciones["MARKET_WATCH_GROUP.MERCADO_2"] = "Mercado 2";
        // traducciones["MARKET_WATCH_GROUP.MERCADO_3"] = "Mercado 3";

        var configuracion = { data: {} };
        configuracion.data["APP_URL"] = "main.html";
        configuracion.data["VERSION"] = "1.1";
        MAE.ConfigService.init(configuracion);
        MAE.TranslatorService.setTraducciones(traducciones);


        promiseAppinit.then(function () {


            myWorker.postMessage({ 'demo': DEMO });

            MAE.MainService.Init();
            var a = new MAE.Layout($("#appContentContainer"));

            MAE.LayoutService.setMAELayout(a);
            MAE.MaeApiService.loadOrders();


            if (!rootScope.detachMode) {

                var bottomTemplate = $("#bottomTemplate").html();
                $(".xs-menu-bottombar-container").html(bottomTemplate);

                var arrow = $('#chat-headimg');
                $('.chat-body').slideToggle('fast');
                arrow.on('click', function () {
                    var src = arrow.attr('src');

                    $('.chat-body').slideToggle('fast');
                    if (src === 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png') {
                        arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_up-16.png');
                    }
                    else {
                        arrow.attr('src', 'https://maxcdn.icons8.com/windows10/PNG/16/Arrows/angle_down-16.png');
                    }
                });

            }

        });

        $('#priceAlertsButton').on('click', function () {
            if (eval($('#notificationCount').html()) > 0)
                $('#NotificationBox').show();
        });

        $("#NotificationBox").on('click', function () {
            MAE.NotifyService.notifyremove();
        });


        MAE.ChartsService.subscribeDragAndDrop(function (e, data) {

            switch (e) {
                case "ChartEvent.ITEM_START_DRAG":

                    break;
                case "ChartEvent.ITEM_DRAG_DROP":
                    console.log("subscribeDragAndDrop : " + data.item.key);
                    break;
                case "ChartEvent.ITEM_END_DRAG":

                    break;
            }


        });

        MAE.ChartsService.subscribeOpen(function (e, symbol) {

            console.log("open chart : " + symbol.key);
        });

        var toolBar = toolBarManager();

        $("#menuToolbar").on("click", toolBar.showHamburgerMenu);



    });

$(window).on("load", function (e) {
    setTimeout(function () {
        $('#preloader').fadeOut('slow');
        $('body').css({ 'overflow': 'visible' });
    }, 2000);

});


function toolBarManager() {
    var n = $(".xs-toolbar");

    function _boldHamburgerMenuElement(e) {
        for (var t = n.find(".xs-toolbar-hamburger-menu-element"), o = 0; o < t.length; o++)
            t[o].style.fontWeight = "normal";
        switch (e) {
            case "trading":
                t[0].style.fontWeight = "bold";
                break;
            case "myAccount":
                t[1].style.fontWeight = "bold";
                break;
            case "settings":
                t[2].style.fontWeight = "bold";
        }
    }
    function _showHamburgerMenu() {
        n.find(".xs-toolbar-hamburger-menu")[0].style.display = "block",
            document.addEventListener("mousedown", r);
    }
    function _hideHamburgerMenu() {
        n.find(".xs-toolbar-hamburger-menu")[0].style.display = "none",
            document.removeEventListener("mousedown", r);
    }
    function _showLayoutDropdown() {
        n.find(".xs-toolbar-layout")[0].style.visibility = "visible";
    }
    function _hideLayoutDropdown() {
        n.find(".xs-toolbar-layout")[0].style.visibility = "hidden";
    }

    function r(e) {
        var t = $(e.target).parents(".xs-toolbar-hamburger-menu");
        t && t.length > 0 || _hideHamburgerMenu()
    };
    var o = { showHamburgerMenu: _showHamburgerMenu };
    return o;



}


var KEY_CODE = {
    Q: 81,
    V: 86,
    G: 71,
    P: 80
}

var _track_porfolio = 0;

document.addEventListener('keyup', function (event) {

    if ((event.keyCode == KEY_CODE.Q) && event.ctrlKey /*&& event.shiftKey*/) {

        MAE.SymbolsSearchBarExtended.inputFocus();
        return true;
    }
    else if ((event.keyCode == KEY_CODE.V) && event.altKey /*&& event.shiftKey*/) {

        MAE.MarketWatchModule.toggleGridView();
        return true;
    }
    else if (event.keyCode == KEY_CODE.G && event.shiftKey) {
        MAE.MarketWatchModule.focusGrid();
        MAE.MarketWatchDepthModule.focusGrid();
    }
    else if (event.keyCode == KEY_CODE.P && event.shiftKey) {
        _track_porfolio++;
        if (_track_porfolio >= $(".xs-marketwatch-category-button").length)
            _track_porfolio = 0;

        $(".xs-marketwatch-category-button")[_track_porfolio].click();
        MAE.MarketWatchModule.focusGrid();
        MAE.MarketWatchDepthModule.focusGrid();
    }
    else
        return false;


}, false);


function toData2(str) {
    var result = jQuery.parseJSON(str);

    var resultWithColumns = [];

    if (result.ColumnNames) {
        for (var i = 0; i < result.Data.length; i++) {
            resultWithColumns.push(_.zipObject(result.ColumnNames, result.Data[i]));
        }
    } else {
        for (var i = 0; i < result.Data.length; i++) {
            resultWithColumns.push(result.Data[i]);
        }
    }

    result.Data = resultWithColumns;


    return result;
}


function toData(str) {
    var resultWithColumns = [];
    for (var i = 0; i < result.Data.length; i++) {
        resultWithColumns.push(_.zipObject(result.ColumnNames, result.Data[i]));
    }
    return resultWithColumns;
}