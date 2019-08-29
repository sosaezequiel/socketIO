$.widget("ui.spinner", $.ui.spinner, {
    _buttonHtml: function () {
        return "" + '<button class="ui-spinner-button ui-spinner-up">' + '<div class="ui-spinner-icon-up"/>' + "</button>" + '<button class="ui-spinner-button ui-spinner-down">' + '<div class="ui-spinner-icon-down"/>' + "</button>"
    },
    _parse: function (value) {
        if (typeof value === "string") {
            if (Number(value) === value) {
                return Number(value);
            }
            value = value.replace(" ", "");
            return value;
        }
        return value;
    }
});

var TOTALPORCIENTO = 10000;

function controlBase() {
    this.html;
    this._invalidateHandle;

};


controlBase.prototype.clear = function () {
    if (this._clearHandle)
        this._clearHandle();
};


controlBase.prototype.getHtml = function () {
    return this.html;

};

controlBase.prototype.invalidate = function (val) {
    if (this._invalidateHandle)
        this._invalidateHandle(val);

};

controlBase.prototype.remove = function () {

    this.html.remove();
};


function marketTrade(scope_Parent, depth, _grid) {
    this.grid = _grid;
    this.scopeParent = scope_Parent;
    this.depth = depth;
    this.html = $($("#clickAndTradePanel").html());
    this.count = 0;

    this.$quote_tick_priceChangeDirection;
    this.$panel_title;
    this.$high;
    this.$low;
    this.$ctSideLabelAsk;
    this.$ctPricePart1LabelAsk;
    this.$ctPricePart2LabelASk;
    this.$ctPricePart3LabelAsk;

    this.$ctSideLabelBid;
    this.$ctPricePart1LabelBid;
    this.$ctPricePart2LabelBid;
    this.$ctPricePart3LabelBid;
    this.$ctdailychangevaluespan;

    this.$ctspreaddiv;
    this.$numericstepper;
    this._numericStepper;
    this.precision = 2;
    this._isNumericMouseOver = false;

    this.$clickAndTradeButtonAsk;
    this.$clickAndTradeButtonBid;
    this.$marketdepthContainer;
    this.marketdepth;
    this.marketDepthItem = [];

    this.$mw_ticket_bottom_divider = this.html.find(".mw-ticket-bottom-divider");
    this.$mw_ticket_background = this.html.find(".mw-ticket-background");
    this.$mwctchartbtn = this.html.find(".mw-ct-chart-btn");
    this.$mwticketpanelheading = this.html.find("#mw-ticket-panel-heading");
    this.$openTradeCtr = this.html.find("#openTradeCtr");
    this.$openInfoCtr = this.html.find("#openInfoCtr");
    this.$onItemKeyCode;

    this.symbol = {};
    this.item = {};
    var self = this;

    this.marketDepthMaxBidVolume;
    this.marketDepthMaxAskVolume;

    this.$openTradeCtr.attr("title", MAE.I18nService.getString("MARKET_WATCH_TICKET.OPEN_TICKET"));
    this.$openInfoCtr.attr("title", MAE.I18nService.getString("POPUP_TRADE_SYMBOL_INFO.INSTRUMENT_INFORMATION"));

    this.$mwctchartbtn.attr("title", MAE.I18nService.getString("CHAR_TRADE_SYMBOL.INFORMATION"));

    this.$mwctchartbtn.on("click", function (e) {

        MAE.ChartsService.open(ChartEvent.OPEN_CHART, self.symbol);
        e.preventDefault();
        e.stopPropagation();
        window.AppComponent.ShowGraphs(self.symbol.id + '/' + self.symbol.name);
        MAE.LayoutService.moduleIsReady(ModulesType.CHARTS);
        var module = MAE.LayoutService.getModule(ModulesType.CHARTS);
        var h = module.content.css("height");
        $("#tv_chart_container").css("height", h);
        MAE.ChartsService.subscribeResized(function (data) {
            $("#tv_chart_container").css("height", data.height + "px");

        });
    });
    this.$openTradeCtr.on("click", function (e) {

        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        MAE.PopupsService.showTrade(self.item);
        //MAE.ChartsService.open(ChartEvent.OPEN_CHART, self.symbol);
        e.preventDefault();
        e.stopPropagation();
        //alert("id" + self.symbol.key);

    });
    this.$openInfoCtr.on("click", function (e) {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        MAE.PopupsService.showInfo(self.item);
        //MAE.ChartsService.open(ChartEvent.OPEN_CHART, self.symbol);
        e.preventDefault();
        e.stopPropagation();
        //alert("id" + self.symbol.key);

    });

    this.$mw_ticket_background.on("click", function () {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        self.collapseTicket(false);

    });

    this.$mw_ticket_background.dblclick(function () {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        self.openTradePopup(self.symbol.key);
    });

    this.$mwticketpanelheading.on("click", function () {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        self.collapseTicket(false);

    });

    this.$mwticketpanelheading.dblclick(function () {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        self.openTradePopup(self.symbol.key);
    });



    this.makeBody();

    this._invalidateHandle = function (val) {
        self.invalidateInterno();
        if (val)
            self.updateMarketDepthSize(5/*item.marketDepthDataProvider.length*/);

    }
    this._clearHandle = function () {
        self.count = 0;

    }

    this.item_key;


    var func_temp = function (e, data, grid) {
        if (data.row != undefined && e.keyCode == 13) {
            var n = _grid.getDataItem(data.row);
            if (n && n instanceof Slick.Group)
                return;

            self.item_key = n;

            setTimeout(function () {
                self.keyDown();

            }, 200);

        }
    };






    this.grid.onKeyDown.subscribe(func_temp);



};



marketTrade.prototype = Object.create(controlBase.prototype);
marketTrade.prototype.constructor = marketTrade.constructor;

marketTrade.prototype.keyDown = function () {
    var key = this.symbol.key || null;
    if (this.item_key.key == key)
        this._numericStepper.focus();
}


marketTrade.prototype.openTradePopup = function (t) {
    var o = MAE.PopupsService;
    rootScope.widgetMode || o.addPopup("popupTradeTicket", true, true, PopupsType.POPUP_TRADE_TICKET, {
        symbolKey: t
    })
}

marketTrade.prototype.collapseTicket = function (t) {
    if (!rootScope.widgetMode) {
        if (t) {
            this.scopeParent.closeTicket({
                removeItem: true,
                quote: this.symbol
            });
        }
        else {
            this.scopeParent.closeTicket({
                removeItem: false
            });
        }

    }

    // rootScope.widgetMode || (t ? this.scopeParent.closeTicket({
    //     removeItem: true,
    //     quote: this.quote
    // }) : this.scopeParent.closeTicket({
    //     removeItem: false
    // }))

};

marketTrade.prototype.makeBody = function () {
    var self = this;

    if (!this.$quote_tick_priceChangeDirection)
        this.$quote_tick_priceChangeDirection = this.html.find("#quote_tick_priceChangeDirection");

    if (!this.$panel_title)
        this.$panel_title = this.html.find("#panel_title");

    if (!this.$high)
        this.$high = this.html.find("#high");

    if (!this.$low)
        this.$low = this.html.find("#low");

    if (!this.$ctSideLabelAsk)
        this.$ctSideLabelAsk = this.html.find("#clickAndTradeButtonAsk .ctSideLabel");

    if (!this.$ctPricePart1LabelAsk)
        this.$ctPricePart1LabelAsk = this.html.find("#clickAndTradeButtonAsk .ctPricePart1Label");

    if (!this.$ctPricePart2LabelAsk)
        this.$ctPricePart2LabelAsk = this.html.find("#clickAndTradeButtonAsk .ctPricePart2Label");

    if (!this.$ctPricePart3LabelAsk)
        this.$ctPricePart3LabelAsk = this.html.find("#clickAndTradeButtonAsk .ctPricePart3Label");


    if (!this.$ctSideLabelBid)
        this.$ctSideLabelBid = this.html.find("#clickAndTradeButtonBid .ctSideLabel");

    if (!this.$ctPricePart1LabelBid)
        this.$ctPricePart1LabelBid = this.html.find("#clickAndTradeButtonBid .ctPricePart1Label");

    if (!this.$ctPricePart2LabelBid)
        this.$ctPricePart2LabelBid = this.html.find("#clickAndTradeButtonBid .ctPricePart2Label");

    if (!this.$ctPricePart3LabelBid)
        this.$ctPricePart3LabelBid = this.html.find("#clickAndTradeButtonBid .ctPricePart3Label");

    if (!this.$ctspreaddiv)
        this.$ctspreaddiv = this.html.find(".ct-spread-div");

    if (!this.$ctdailychangevaluespan)
        this.$ctdailychangevaluespan = this.html.find("#ct-daily-change-value-span");

    if (!this.$clickAndTradeButtonAsk)
        this.$clickAndTradeButtonAsk = this.html.find("#clickAndTradeButtonAsk");

    if (!this.$clickAndTradeButtonBid)
        this.$clickAndTradeButtonBid = this.html.find("#clickAndTradeButtonBid");


    // if (!this.$marketdepthContainer && this.depth) {
    //     this.$marketdepthContainer = this.html.find("div[market-depth]");
    //     this.marketdepth = new marketDepth(this.$marketdepthContainer);
    //     this.$marketdepthContainer.append(this.marketdepth.getHtml());

    //     var marketDepthItemContainer = this.$marketdepthContainer;//.find(".mw-ticket-panel-market-depth");     
    //     var temp_marketDepthItem;

    //     temp_marketDepthItem = new marketDepthItem();
    //     temp_marketDepthItem.isFirst = true;
    //     this.marketDepthItem.push(temp_marketDepthItem);
    //     marketDepthItemContainer.append(temp_marketDepthItem.getHtml());
    //     for (var i = 1; i < 5/*item.marketDepthDataProvider.length*/; i++) {
    //         temp_marketDepthItem = new marketDepthItem();

    //         this.marketDepthItem.push(temp_marketDepthItem);
    //         marketDepthItemContainer.append(temp_marketDepthItem.getHtml());

    //     }

    //     //if (item.marketDepthDataProvider.length > 0)

    //     // this._invalidateHandle = function () {
    //     //     self.updateMarketDepthSize(5/*item.marketDepthDataProvider.length*/);

    //     // };

    // }

    //    if (!self.$numericstepper) {

    //       if (item.enableVolumeStepper) {
    self.$numericstepper = this.html.find("div[numeric-stepper]");

    self._numericStepper = new numericStepper();

    self.$numericstepper.append(self._numericStepper.getHtml());



    self.$numericstepper.find("form[name='xsStepperForm']").submit(function (e) {
        e.preventDefault();

    });
    // $("form[name='xsStepperForm']").submit(function (e) {
    //     e.preventDefault();

    // });

    self.$numericstepper.addClass("xs-stepper-element");

    var $input = self.$numericstepper.find("input");
    //$input.val(item.displayedValue);
    $input.on("focus", function () {
        self.$numericstepper.find(".xs-stepper").addClass("ui-xsfocus");
        self.isNumericMouseOver = true;

    });

    $input.on("blur", function () {
        //self.$numericstepper.find(".xs-stepper").removeClass("ui-xsfocus");
        // self.isNumericMouseOver = false;
        //$input.val('');
    });

    $input.on("keydown", function (e) {

        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;


        if (e.altKey && e.which == 65) //a
        {
            self.createOrder(OrderType.ASK);
        }


        if (e.altKey && e.which == 66) //b
        {
            self.createOrder(OrderType.BID);
        }


        if (e.which == 27) //scape
            self.scopeParent.closeTicket(false);

        if (e.which == 77) {
            self.multiply(1000000);
            e.preventDefault();
        }

        if (e.which == 75) {

            self.multiply(1000);
            e.preventDefault();
        }

        if (e.which == 109 || e.which == 107) {
            e.preventDefault();

        }
        if (e.keyCode == 49 && e.shiftKey) {
            MAE.PopupsService.showInfo(self.item);
        }

        if (e.keyCode == 50 && e.shiftKey) {

            MAE.ChartsService.open(ChartEvent.OPEN_CHART, self.item.symbol);
        }

        if (e.keyCode == 51 && e.shiftKey) {

            MAE.PopupsService.showTrade(self.item);
        }

        if (e.which === 38 || e.which === 40 /*|| e.which == 51*/) {
            e.preventDefault();

        }

    });



    this.$clickAndTradeButtonAsk.click(function () {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;

        self.createOrder(OrderType.ASK);
    });

    this.$clickAndTradeButtonBid.click(function () {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;

        self.createOrder(OrderType.BID);
    });

    // var spi = $input.spinner({
    //     wheelDisabled: true,
    //     step: .01,
    //     min: 0,
    //     start: function (ev) {
    //         // ev.preventDefault();
    //         // ev.stopPropagation();
    //     },
    //     spin: function (ev, t) {
    //         // ev.preventDefault();
    //         // ev.stopPropagation();
    //     },
    //     stop: function (ev) {
    //         // ev.preventDefault();
    //     }
    // });
    //spi.spinner("enable");
    //spi.spinner("value", $input.val());


    Object.defineProperty(self, "isNumericMouseOver", {
        get: function () {
            return self._isNumericMouseOver;

        },

        set: function (value) {

            self._isNumericMouseOver = value;
            if (self._isNumericMouseOver) {
                self.$numericstepper.addClass("ct-volume-stepper-selected");
                self.$clickAndTradeButtonAsk.addClass("ct-button-buy-ns-mouse-over");
                self.html.find("#clickAndTradeButtonBid").addClass("ct-button-sell-ns-mouse-over");
            }
            else {
                self.$numericstepper.removeClass("ct-volume-stepper-selected");
                self.$clickAndTradeButtonAsk.removeClass("ct-button-buy-ns-mouse-over");
                self.html.find("#clickAndTradeButtonBid").removeClass("ct-button-sell-ns-mouse-over");
            }

        }

    });

    self.$numericstepper.on("mouseover", function () {
        // self.numericMouseOver();
    });
    self.$numericstepper.on("mouseleave", function (e) {
        //self.numericMouseLeave(e);
    });

    // }
    // else {
    //     self.$numericstepper = $('<div><div class="xs-stepper"></div></div>');
    // }

    // }


    // if (self.isNumericMouseOver) {
    //     self.$numericstepper.addClass("ct-volume-stepper-selected");
    //     self.$clickAndTradeButtonAsk.addClass("ct-button-buy-ns-mouse-over");
    // }
    // else {

    //     self.$numericstepper.removeClass("ct-volume-stepper-selected");
    //     self.$clickAndTradeButtonAsk.removeClass("ct-button-buy-ns-mouse-over");
    // }




};

marketTrade.prototype.multiply = function (factor) {
    var self = this;
    var $input = self.$numericstepper.find("input");
    var value = $input.val();
    value = value == "" ? 0 : parseFloat(value);


    $input.val(value * factor);
};

marketTrade.prototype.createOrder = function (type) {
    var self = this;
    var $input = self.$numericstepper.find("input");
    if ($input.val() <= 0)
        return;

    self.item.displayedValue = $input.val();
    $input.val('');
    MAE.OrdersMaeService.createOrder(self.item, type);


};

marketTrade.prototype.numericMouseOver = function () {
    //this.isNumericMouseOver === false && (this.isNumericMouseOver = true);
};

marketTrade.prototype.select = function (item) {
    var self = this;

};

marketTrade.prototype.invalidateInterno = function () {
    var self = this;
    var $input = self.$numericstepper.find("input");
    $input.val('');

}

marketTrade.prototype.numericMouseLeave = function (e) {
    //(e.offsetX < 0 || e.offsetY < 0 || e.offsetX + 1 >= e.target.offsetWidth || e.offsetY + 1 >= e.target.offsetHeight) && this.isNumericMouseOver === true && (this.isNumericMouseOver = false)
};

marketTrade.prototype.detach = function () {

};


marketTrade.prototype.updateMarketDepthSize = function (e) {
    De = e;
    this.$mw_ticket_bottom_divider && (e > 0 ? this.$mw_ticket_bottom_divider.css("margin-top", "166px") : this.$mw_ticket_bottom_divider.css("margin-top", "26px"));
    this.$mw_ticket_background && (e > 0 ? this.$mw_ticket_background.css("bottom", "-164px") : this.$mw_ticket_background.css("bottom", "-23px"));
    this.scopeParent.updateTicketSize({
        size: De
    });

};



marketTrade.prototype.drawData = function (item) {
    var self = this;

    self.item = item;

    self.symbol = item.quote.symbol;


    var class_icon = "mw-ct-price-" + item.quote.tick.priceChangeDirection + "-icon";

    this.$quote_tick_priceChangeDirection.removeClass();
    this.$quote_tick_priceChangeDirection.addClass(class_icon);


    this.$panel_title.removeClass("mw-ticket-title-price-down mw-ticket-title-price-up");
    this.$panel_title.addClass("mw-ticket-title-price-" + item.quote.tick.priceChangeDirection);
    this.$panel_title.attr("title", item.quote.symbol.fullDescription);
    this.$panel_title.html(item.quote.name + ' <span class="xs-btn-asset-class">' + item.symbolGroup.name + "</span>");

    this.$high.html(item.highPriceParts[0]);//+ "-" + item.highPriceParts[1] + "-" + item.highPriceParts[2] 
    this.$low.html(item.lowPriceParts[0]);//+ "-" + item.lowPriceParts[1] + "-" + item.lowPriceParts[2]

    this.$ctdailychangevaluespan.removeClass();
    //ct-daily-change-value{{:dailyChangeDirection}}
    this.$ctdailychangevaluespan.html(item.dailyChange.toFixed(this.precision) + "" + item.dailyChangeSign);
    this.$ctdailychangevaluespan.addClass("ct-daily-change-value-" + item.dailyChangeDirection);//{{:dailyChange}}{{:dailyChangeSign}}
    //title="{{:changePeriodLabel}}"
    this.$ctdailychangevaluespan.attr("title", item.changePeriodLabel);

    /**
     *             var n = i.find(".ctPricePart1Label")
                  , s = i.find(".ctPricePart2Label")
                  , d = i.find(".ctPricePart3Label")
                  , u = !1;
                i.find(".ctSideLabel").html(e.getFrequentString("CLICK_AND_TRADE." + t.side.toUpperCase())),
                o.addQuoteUpdateSubscriber(l),
                t.$on("$destroy", function() {
                    o.removeQuoteUpdateSubscriber(l)
                })
    */

    this.$ctSideLabelAsk.html("Sell");
    this.$ctPricePart1LabelAsk.html(FormatUtils.formatThousandSeparator(item.askVWAP) || 0);
    // this.$ctPricePart2LabelAsk.html(item.highPriceParts[1]);
    // this.$ctPricePart3LabelAsk.html(item.highPriceParts[2]);

    this.$ctSideLabelBid.html("Buy");
    this.$ctPricePart1LabelBid.html(FormatUtils.formatThousandSeparator(item.bidVWAP) || 0);
    // this.$ctPricePart2LabelBid.html(item.lowPriceParts[1]);
    // this.$ctPricePart3LabelBid.html(item.lowPriceParts[2]);
    if (!isNaN(item.quote.spreadTableVWAP))
        this.$ctspreaddiv.html(item.quote.spreadTableVWAP.toFixed(this.precision));
    else 
        this.$ctspreaddiv.html("-");
    this.calularValores();


    if (!this.$marketdepthContainer && this.depth) {
        this.$marketdepthContainer = this.html.find("div[market-depth]");

        this.marketdepth = new marketDepth(this.$marketdepthContainer);
        this.$marketdepthContainer.append(this.marketdepth.getHtml());

        var marketDepthItemContainer = this.$marketdepthContainer;//.find(".mw-ticket-panel-market-depth");     
        var temp_marketDepthItem;

        temp_marketDepthItem = new marketDepthItem();
        temp_marketDepthItem.isFirst = true;
        this.marketDepthItem.push(temp_marketDepthItem);
        marketDepthItemContainer.append(temp_marketDepthItem.getHtml());
        for (var i = 1; i < 5/* item.marketDepthDataProvider.length*/; i++) {
            temp_marketDepthItem = new marketDepthItem();

            this.marketDepthItem.push(temp_marketDepthItem);
            marketDepthItemContainer.append(temp_marketDepthItem.getHtml());

        }

        //if (item.marketDepthDataProvider.length > 0)

        // this._invalidateHandle = function () {
        //     self.updateMarketDepthSize(5/*item.marketDepthDataProvider.length*/);

        // };

    }

    for (var i = 0; i < this.marketDepthItem.length; i++) {
        var data = item.marketDepthDataProvider[i];
        if (data) {
            data.data.bidVolume = data.data.bidVolume ? data.data.bidVolume : 0;
            data.data.askVolume = data.data.askVolume ? data.data.askVolume : 0;
            data.data.bid = data.data.bid ? data.data.bid : 0;
            data.data.ask = data.data.ask ? data.data.ask : 0;
            var item_temp = Object.assign({}, item);
            item_temp.data = data.data;


            item_temp.maxMarketDepthBidVolume = this.marketDepthMaxBidVolume;
            item_temp.maxMarketDepthAskVolume = this.marketDepthMaxAskVolume;
            this.marketDepthItem[i].setData(item_temp);
        } else {
            this.marketDepthItem[i].clean();
        }

    }



    // if(this.item_key )
    //     console.log(this.item_key.key + " ?= " + item.key );

    if (this.count++ == 1 && this.depth) {
        setTimeout(function () {
            self._numericStepper.focus();

        }, 100);
    }



};


marketTrade.prototype.setData = function (item, t, a) {
    //quote_tick_priceChangeDirection;
    this.drawData(item);
    //console.dir(item);

};

marketTrade.prototype.calularValores = function (e, a, o, l) {

    // for (var n = 0, d = 0, u = 0; u < a.length; u++) {
    //     var c = a[u];
    //     var m = r.length > u ? r[u] : null;

    //     c.bidVolume > n && (n = c.bidVolume);
    //     c.askVolume > d && (d = c.askVolume);

    //     if (m) {
    //         if (m.bidVolume > c.bidVolume)
    //             c.bidVolumeChangeDirection = "down"
    //         else {
    //             if (m.bidVolume < c.bidVolume)
    //                 c.bidVolumeChangeDirection = "up"
    //             else {
    //                 if (t.marketDepthProvider && t.marketDepthProvider.length > u)
    //                     c.bidVolumeChangeDirection = t.marketDepthProvider[u].bidVolumeChangeDirection
    //                 else
    //                     c.bidVolumeChangeDirection = "up";

    //                 if (m.askVolume > c.askVolume)
    //                     c.askVolumeChangeDirection = "down"
    //                 else {
    //                     if (m.askVolume < c.askVolume)
    //                         c.askVolumeChangeDirection = "up"
    //                     else {
    //                         if (t.marketDepthProvider && t.marketDepthProvider.length > u)
    //                             c.askVolumeChangeDirection = t.marketDepthProvider[u].askVolumeChangeDirection
    //                         else
    //                             c.askVolumeChangeDirection = "up";
    //                     }
    //                 }
    //             }

    //         }


    //     }
    //     else {
    //         c.bidVolumeChangeDirection = "up";
    //         c.askVolumeChangeDirection = "up";

    //     }

    // }

    this.marketDepthMaxBidVolume = 100;
    this.marketDepthMaxAskVolume = 100;

};

function numericStepper() {
    this.html = $('<div class="xs-stepper ignore-slickgrid-key-handle"><form  name="xsStepperForm"><input id="stepperInput" type="number" name="stepperInput" class="xs-stepper-input"  max="' + 35700000000 + '" min="1"/></form></div>');

    this.$stepperInput = this.html.find("#stepperInput");


};


numericStepper.prototype = Object.create(controlBase.prototype);
numericStepper.prototype.constructor = numericStepper.constructor;

numericStepper.prototype.focus = function () {

    this.$stepperInput = this.html.find("#stepperInput");
    if (this.$stepperInput && this.$stepperInput.length > 0) {
        this.$stepperInput.focus();
    }
    if (rootScope.sessionType != SymbolSessionType.OPEN) {
        this.$stepperInput.attr("readonly", "true");
    }
    else {
        this.$stepperInput.removeAttr("readonly");
    }

}



function marketDepth(container, scope_parent) {
    var _html = container.html();
    this.html = _html;
    this.scope = scope_parent;
    this.marketDepthMaxBidVolume = 0;
    this.marketDepthMaxAskVolume = 0;



};

marketDepth.prototype = Object.create(controlBase.prototype);
marketDepth.prototype.constructor = marketDepth.constructor;

marketDepth.prototype.getMarketDepth = function (quote) {



};



marketDepth.prototype.setData = function (item) {

    this.drawData(item);
};



function marketDepthItem() {
    var _html = $('#marketdepthitemTemplate').html();
    this.html = $(_html);

    this.$mwmarketdepthbidvolume;
    this.$mwmarketdepthaskvolume;
    this.$wmarketdepthbidprice;
    this.$mwmarketdepthaskprice;
    this.$bidVolumeDirectionStyle;
    this.$askVolumeDirectionStyle;
    this.$mwmarketdepthbidprice;
    this.$mwmarketdepthbidequivalentratebuy;
    this.$mwmarketdepthbidequivalentratesell;
    this.makeBody();
};

marketDepthItem.prototype = Object.create(controlBase.prototype);
marketDepthItem.prototype.constructor = marketDepthItem.constructor;

marketDepthItem.prototype.setData = function (item) {

    this.drawData(item);
};

marketDepthItem.prototype.makeBody = function () {

    if (!this.$mwmarketdepthbidvolume)
        this.$mwmarketdepthbidvolume = this.html.find(".mw-market-depth-bid-volume");//u

    if (!this.$mwmarketdepthaskvolume)
        this.$mwmarketdepthaskvolume = this.html.find(".mw-market-depth-ask-volume");//c

    if (!this.$wmarketdepthbidprice)
        this.$wmarketdepthbidprice = this.html.find(".mw-market-depth-bid-price"); //m

    if (!this.$mwmarketdepthaskprice)
        this.$mwmarketdepthaskprice = this.html.find(".mw-market-depth-ask-price");

    if (!this.$bidVolumeDirectionStyle)
        this.$bidVolumeDirectionStyle = this.html.find("#bidVolumeDirectionStyle");

    if (!this.$askVolumeDirectionStyle)
        this.$askVolumeDirectionStyle = this.html.find("#askVolumeDirectionStyle");

    if (!this.$mwmarketdepthbidequivalentratebuy)
        this.$mwmarketdepthbidequivalentratebuy = this.html.find(".mw-market-depth-bid-equivalent-rate-buy");

    if (!this.$mwmarketdepthbidequivalentratesell)
        this.$mwmarketdepthbidequivalentratesell = this.html.find(".mw-market-depth-bid-equivalent-rate-sell");
};

marketDepthItem.prototype.clean = function () {
    this.$bidVolumeDirectionStyle.removeClass("mw-market-depth-bar-value-down mw-market-depth-bar-value-up");
    this.$askVolumeDirectionStyle.removeClass("mw-market-depth-bar-value-down mw-market-depth-bar-value-up");

    this.$askVolumeDirectionStyle.css("width", "0%");
    this.$bidVolumeDirectionStyle.css("width", "0%");

    this.$mwmarketdepthbidvolume.html(0);
    this.$mwmarketdepthaskvolume.html(0);
    this.$wmarketdepthbidprice.html(0);
    this.$mwmarketdepthaskprice.html(0);
    this.$mwmarketdepthbidequivalentratebuy.html(0);
    this.$mwmarketdepthbidequivalentratesell.html(0);

};

marketDepthItem.prototype.init = function (item) {

    var t = item.maxMarketDepthBidVolume > 0 ? item.data.bidVolume / item.maxMarketDepthBidVolume : 0;
    var i = item.maxMarketDepthAskVolume > 0 ? item.data.askVolume / item.maxMarketDepthAskVolume : 0;
    var a = Math.round(100 * t);
    var o = Math.round(100 * i);

    var bidValueStyle = {
        width: a + "%"
    };
    var askValueStyle = {
        width: o + "%"
    };
    this.$bidVolumeDirectionStyle.removeClass("mw-market-depth-bar-value-down mw-market-depth-bar-value-up");
    this.$bidVolumeDirectionStyle.addClass("mw-market-depth-bar-value-" + item.data.bidVolumeChangeDirection);
    var bidValue = bidValueStyle.width.replace("%", "");
    var temp_calc = (isNaN(bidValue) ? 0 : bidValue * 100) / AppContext.CantidadMaxima;
    this.$bidVolumeDirectionStyle.css("width", temp_calc < AppContext.CantidadMaxima ? temp_calc : AppContext.CantidadMaxima + "%");


    this.$askVolumeDirectionStyle.removeClass("mw-market-depth-bar-value-down mw-market-depth-bar-value-up");
    this.$askVolumeDirectionStyle.addClass("mw-market-depth-bar-value-" + item.data.askVolumeChangeDirection);


    var askValue = askValueStyle.width.replace("%", "");
    var temp_calculo = (isNaN(askValue) ? 0 : askValue * 100) / AppContext.CantidadMaxima;
    this.$askVolumeDirectionStyle.css("width", temp_calculo < AppContext.CantidadMaxima ? temp_calculo : AppContext.CantidadMaxima + "%");

};

marketDepthItem.prototype.drawData = function (item) {

    this.init(item);
    this.setHtmlRender(item);
};

marketDepthItem.prototype.formato = function (e) {
    return e >= 1e6 ? FormatUtils.numberFormat(e / 1e6, 2) + "M" : e > 1e3 ? FormatUtils.numberFormat(e / 1e3, 2) + "K" : e;

};
marketDepthItem.prototype.setHtmlRender = function (item) {
    /*
    u = this.$mwmarketdepthbidvolume, 
    c = this.$mwmarketdepthaskvolume, 
    m = this.$wmarketdepthbidprice 
    p = this.$mwmarketdepthaskprice
    */

    if (0 != item.data.bid || item.isFirst) {
        this.$wmarketdepthbidprice.html(FormatUtils.formatThousandSeparator(item.data.bid,3));
        this.$mwmarketdepthbidequivalentratesell.html(item.data.SpotRateBid);
        if (0 == item.data.bidVolume)
            this.$mwmarketdepthbidvolume.html(0);
        else
            this.$mwmarketdepthbidvolume.html(this.formato(item.data.bidVolume + " <font style='font-size:8px'>[" + item.data.TotalOffersBid + "]</font>"));
    } else {
        this.$wmarketdepthbidprice.html(0);
        this.$mwmarketdepthbidvolume.html(0);
    }


    if (0 != item.data.ask || item.isFirst) {
        this.$mwmarketdepthaskprice.html(FormatUtils.formatThousandSeparator(item.data.ask, 3));
        this.$mwmarketdepthbidequivalentratebuy.html(item.data.SpotRateAsk);
        if (0 == item.data.askVolume)
            this.$mwmarketdepthaskvolume.html(0);
        else
            this.$mwmarketdepthaskvolume.html(this.formato(FormatUtils.formatThousandSeparator(item.data.askVolume,0) + " <font style='font-size:8px'>[" + item.data.TotalOffersAsk + "]</font>"));
    }
    else {
        this.$mwmarketdepthaskprice.html(0),
            this.$mwmarketdepthaskvolume.html(0);
    }
};



function popupsCtr(id, template) {
    var html_temp = $("#" + template).html();
    this.html = $(html_temp);

    // $(this.html[0]).dialog({
    //     autoOpen: false,
    //     modal: true,
    //     draggable: true,
    //     hide: { effect: "explode", duration: 200 },
    //     show: { effect: "explode", duration: 400 },
    //     position: { my: "center", at: "center", of: window }
    // });

    this.dialog = new dialogModal();

    this.dialog.open();

};

popupsCtr.prototype = Object.create(controlBase.prototype);
popupsCtr.prototype.constructor = popupsCtr.constructor;

popupsCtr.prototype.show = function () {
    //this.html.modal('show');
    $(this.html[0]).dialog("open");
};

popupsCtr.prototype.close = function () {
    //this.html.dialogdialog( "open" );
    //this.html.modal('hide');

};


function popupsUpdate(id, template, item) {
    var html_temp = $("#" + template).html();
    var self = this;
    this.html = $(html_temp);
    this.item = item;

    this.dialog = new dialogModal();
    this.dialog.$modal_content_dialog.css("width", "351px");
    this.dialog.$modal_content_dialog.css("height", "230px");

    this.dialog.setContent(this.html);
    this.$close_btn = this.html.find("#close_btn");
    this.$producto_lbl = this.html.find("#producto_lbl");
    this.$mercado_lbl = this.html.find("#mercado_lbl");

    this.$mercado_lbl.hide();

    this.$volumen = this.html.find("#volumen");
    this.$price = this.html.find("#price");
    this.$contractValue = this.html.find("#contractValue");

    this.$updateBtn_modal = this.html.find("#updateBtn-modal");

    this.$close_btn.on("click", this.dialog.close.bind(this.dialog));
    this.draw(item);


    this.$updateBtn_modal.on("click", function () {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;

        if (self.validate()) {
            self.updateOrder();
            self.dialog.close();
            item.$updating = true;
        }

    });

    this.$volumen.on("focus", function () {

        self.$volumen.removeClass("error_input");
    });

    this.$price.on("focus", function () {

        self.$price.removeClass("error_input");
    });

    this.$volumen.on("keydown", function (e) {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;
        if (e.which == 77) {
            e.preventDefault();
            self.multiply(1000000, self.$volumen);

        }

        if (e.which == 75) {
            e.preventDefault();
            self.multiply(1000, self.$volumen);


        }

        if (e.which == 109 || e.which == 107) {
            e.preventDefault();

        }
        if (e.which == 38 || e.which == 40 || e.which == 51333) {
            e.preventDefault();

        }

    });

    this.$price.on("keydown", function (e) {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;
        if (e.which == 77) {
            self.multiply(1000000, self.$price);

        }

        if (e.which == 75) {
            self.multiply(1000, self.$price);

        }

        if (e.which == 109 || e.which == 107) {
            e.preventDefault();

        }
        if (e.which == 38 || e.which == 40) {
            e.preventDefault();

        }

    });

}

popupsUpdate.prototype = Object.create(controlBase.prototype);
popupsUpdate.prototype.constructor = popupsUpdate.constructor;

popupsUpdate.prototype.show = function () {
    //this.html.modal('show');
    //  $(this.html[0]).dialog("open");
    //this.dialog.setContent(this.html);
    this.dialog.open();
    this.$volumen.focus();

    this.$price.val(FormatUtils.formatThousandSeparator(this.item.price));
    this.$volumen.val(FormatUtils.formatThousandSeparator(this.item.volume, 0));
};

popupsUpdate.prototype.close = function () {
    //this.html.dialogdialog( "open" );
    //this.html.modal('hide');

};

popupsUpdate.prototype.updateOrder = function () {
    var price = this.$price.val();
    var volumen = this.$volumen.val();


    var clone = Object.assign({}, this.item);
    clone.volume = +volumen;
    clone.price = +price;
    // clone.highPriceParts = [price];
    clone.$updating = true;

    MAE.OrdersMaeService.updateOrder(clone);

}


popupsUpdate.prototype.dispose = function () {
    //this.html.dialogdialog( "open" );
    //this.html.modal('hide');

    this.dialog.dispose();

};

popupsUpdate.prototype.draw = function (item) {
    this.item = item;
    this.$producto_lbl.html(item.symbol);
    //this.$mercado_lbl.html(item.symbolGroup.name);
    this.$contractValue.val(FormatUtils.formatThousandSeparator(item.contractValue));
    //this.$contractValue.val(item.contrato.toLocaleString(AppContext.LanguageTag, { style: 'decimal', maximumFractionDigits: 3, minimumFractionDigits: 3 }));

};

popupsUpdate.prototype.validate = function () {
    var self = this;
    var isValid = 2;
    this.$volumen.removeClass("error_input");
    if (this.$volumen.val() == '' || +this.$volumen.val() == 0) {
        this.$volumen.addClass("error_input");
        isValid -= 1;
    }

    this.$price.removeClass("error_input");
    if (this.$price.val() == '' || +this.$price.val() == 0) {
        this.$price.addClass("error_input");
        isValid -= 1;
    }

    return isValid == 2;
}

popupsUpdate.prototype.multiply = function (factor, $input) {
    var self = this;
    var value = $input.val();
    value = value == "" ? 0 : parseFloat(value);

    $input.val(value * factor);
}


function popupsAlta(id, template, item) {
    var html_temp = $("#" + template).html();
    var self = this;
    this.html = $(html_temp);
    this.item = item;

    this.dialog = new dialogModal();
    this.dialog.$modal_content_dialog.css("width", "436px");
    this.dialog.$modal_content_dialog.css("height", "230px");
    this.dialog.setContent(this.html);



    this.$close_btn = this.html.find("#close_btn");
    this.$producto_lbl = this.html.find("#producto_lbl");
    this.$mercado_lbl = this.html.find("#mercado_lbl");


    this.$volumen = this.html.find("#volumen");
    this.$price = this.html.find("#price");
    this.$contractValue = this.html.find("#contractValue");

    this.$priceBid = this.html.find("#priceBid");
    this.$priceAsk = this.html.find("#priceAsk");

    this.$clickAndTradeButtonBid = this.html.find("#clickAndTradeButtonBid-modal");
    this.$clickAndTradeButtonAsk = this.html.find("#clickAndTradeButtonAsk-modal");

    this.$clickAndTradeButtonBid.on("click", function () {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;

        if (self.validate()) {
            self.createOrder(OrderType.BID);
            self.dialog.close();
        }

    });
    this.$clickAndTradeButtonAsk.on("click", function () {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;

        if (self.validate()) {
            self.createOrder(OrderType.ASK);
            self.dialog.close();
        }
    });

    this.$close_btn.on("click", this.dialog.close.bind(this.dialog));

    rootScope.addHandle(function (data) {
        if (data.sessionType == SymbolSessionType.CLOSED && self.dialog.isOpen)
            self.dialog.close();

    });


    this.draw(item);

    this.$volumen.on("focus", function () {

        self.$volumen.removeClass("error_input");
    });

    this.$price.on("focus", function () {

        self.$price.removeClass("error_input");
    });

    this.$volumen.on("keydown", function (e) {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;
        if (e.which == 77) {
            e.preventDefault();
            self.multiply(1000000, self.$volumen);

        }

        if (e.which == 75) {
            e.preventDefault();
            self.multiply(1000, self.$volumen);

        }

        if (e.which == 109 || e.which == 107) {
            e.preventDefault();

        }
        if (e.which == 38 || e.which == 40) {
            e.preventDefault();

        }

    });

    this.$price.on("keydown", function (e) {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;
        if (e.which == 77) {
            self.multiply(1000000, self.$price);

        }

        if (e.which == 75) {
            self.multiply(1000, self.$price);

        }

        if (e.which == 109 || e.which == 107) {
            e.preventDefault();

        }
        if (e.which == 38 || e.which == 40) {
            e.preventDefault();

        }

    });

    // this.html.draggable();

    // this.html.dialog({
    //     autoOpen: false,
    //     modal: true,
    //     draggable: true
    //     // hide: { effect: "explode", duration: 200 },
    //     // show: { effect: "explode", duration: 400 },
    //     //position: { my: "center", at: "center", of: window }
    // });//.siblings('div.ui-dialog-titlebar').remove();
    // //.siblings('div.ui-dialog-titlebar').remove();;

    // // this.html.modal({
    // //     escapeClose: false,
    // //     clickClose: false,
    // //     showClose: false
    // //   });

};





popupsAlta.prototype = Object.create(controlBase.prototype);
popupsAlta.prototype.constructor = popupsAlta.constructor;

popupsAlta.prototype.show = function () {
    //this.html.modal('show');
    //  $(this.html[0]).dialog("open");

    this.dialog.open();
    this.$volumen.focus();
    this.$price.val("");
    this.$volumen.val("");
};

popupsAlta.prototype.validate = function () {
    var self = this;
    var isValid = 2;
    this.$volumen.removeClass("error_input");
    if (this.$volumen.val() == '' || +this.$volumen.val() == 0) {
        this.$volumen.addClass("error_input");
        isValid -= 1;
    }

    this.$price.removeClass("error_input");
    if (this.$price.val() == '' || +this.$price.val() == 0) {
        this.$price.addClass("error_input");
        isValid -= 1;
    }

    return isValid == 2;
}

popupsAlta.prototype.multiply = function (factor, $input) {
    var self = this;
    var value = $input.val();
    value = value == "" ? 0 : parseFloat(value);

    $input.val(value * factor);
}

popupsAlta.prototype.close = function () {
    //this.html.dialogdialog( "open" );
    //this.html.modal('hide');

};

popupsAlta.prototype.createOrder = function (type) {
    var price = this.$price.val();
    var volumen = this.$volumen.val();


    var clone = Object.assign({}, this.item);
    clone.displayedValue = +FormatUtils.removeThousandSeparator(volumen);
    clone.lowPriceParts = [price];
    clone.highPriceParts = [price];
    clone.bidVWAP = price;
    clone.askVWAP = price;

    MAE.OrdersMaeService.createOrder(clone, type);

};


popupsAlta.prototype.dispose = function () {
    //this.html.dialogdialog( "open" );
    //this.html.modal('hide');

    this.dialog.dispose();

};

popupsAlta.prototype.draw = function (item) {
    this.item = item;
    this.$producto_lbl.html(item.name);
    this.$mercado_lbl.html(item.symbolGroup.name);
    this.$priceBid.html(FormatUtils.formatThousandSeparator(item.bidVWAP));//,2));// ? isNaN(item.bidVWAP)?0: item.bidVWAP.toFixed(4) : 0);
    this.$priceAsk.html(FormatUtils.formatThousandSeparator(item.askVWAP));//,2));// ? isNaN(item.askVWAP) ? 0 :item.askVWAP.toFixed(4) : 0);
    this.$contractValue.val(item.contractValue.toLocaleString(AppContext.LanguageTag));
    //this.$contractValue.val(item.contractValue);
};


function openTradesCloseAll(scopeParent) {
    var i = MAE.I18nService;
    var self = this;
    this.html = $('<div id="closeMenu" class="xs-ot-close-all xs-tooltip xs-tooltip-top xs-tooltip-arrow-topright" style="width:94px" > <ul> <li id="li_CloseAll" class="carefully"  data-title="sessionDesc"></li><li id="li_closeAllWinners" data-title="sessionDesc"></li><li id="li_closeAllLosers"  data-title="sessionDesc"></li></ul></div>')
    this.visible = false;
    this.$li_CloseAll = this.html.find("#li_CloseAll");
    this.$li_closeAllWinners = this.html.find("#li_closeAllWinners");
    this.$li_closeAllLosers = this.html.find("#li_closeAllLosers");

    this.$li_CloseAll.html(i.getString("OPEN_TRADES.CLOSE_ALL"));
    this.$li_CloseAll.on("click", function (e) {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;

        scopeParent.closeAllCallback();

    });

    this.$li_closeAllWinners.html(i.getString("OPEN_TRADES.CLOSE_WINNERS"));
    this.$li_closeAllWinners.on("click", function (e) {

        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;
        //alert("closeAllWinners");
        scopeParent.closeAllWinners();
    });


    this.$li_closeAllLosers.html(i.getString("OPEN_TRADES.CLOSE_LOSERS"));
    this.$li_closeAllLosers.on("click", function (e) {
        if (rootScope.sessionType !== SymbolSessionType.OPEN)
            return;
        //alert("closeAllLosers");
        scopeParent.closeAllLosers();
    });

    this._scopeParent = scopeParent;
    this.C = {
        leftModifier: -45,
        topModifier: 10,
        width: 94,
        sessionDesc: ""
    }

    this.show();

    scopeParent.innerCloseHandle = function () {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        this.closeAllVisible = false;
        self.show();
    }
};

openTradesCloseAll.prototype = Object.create(controlBase.prototype);
openTradesCloseAll.prototype.constructor = openTradesCloseAll.constructor;

openTradesCloseAll.prototype.show = function () {

    if (rootScope.sessionType != SymbolSessionType.OPEN)
    {
        this.html.hide();
        return;
    }
        

    if (this._scopeParent.closeAllVisible) {
        this.positionTo();
        this.html.show();
    }

    else
        this.html.hide();

};


openTradesCloseAll.prototype.positionTo = function () {
    var e = window.innerHeight;
    var s = window.innerWidth;
    var o = this.html;
    var t = $(o[0]).width();
    var a = $(o[0]).height();
    var i = this._scopeParent.closeAll.pageX || 0;
    var r = this._scopeParent.closeAll.pageY || 0;


    if (this._scopeParent.closeAll.pageY && this._scopeParent.closeAll.pageY + this._scopeParent.topModifier + a > e) {
        i = this._scopeParent.closeAll.pageX - parseInt(t / 2) - 9;
        r = this._scopeParent.closeAll.pageY - parseInt(a / 2) - 15;
        o.removeClass("xs-tooltip-top xs-tooltip-arrow-topright");
        o.addClass("xs-tooltip-right");
    }
    else {
        o.removeClass("xs-tooltip-right");
        o.addClass("xs-tooltip-top xs-tooltip-arrow-topright");
    }


    if (this._scopeParent.closeAll.row === -1) {

        var n = this.html.width() || C.width;
        var p = this._scopeParent.closeAll.pageX - 35;

        if (this._scopeParent.closeAll.pageX && this._scopeParent.closeAll.pageX + n > s) {
            i = this._scopeParent.closeAll.pageX - (p + n - s);
        }
    }
    i += this.C.leftModifier;
    r += this.C.topModifier;

    o.css({
        left: i,
        top: r
    });
};

openTradesCloseAll.prototype.close = function () {
    this.show();
    //this._scopeParent.closeAllVisible = this._scopeParent.closeAllVisible ? false : true;


};

function openTradesClosePart() {
    this.html = $('<div class="xs-ot-close-part xs-tooltip xs-tooltip-right" ng-show="visible"><div class="xs-tooltip-header"><div><span class="xs-tooltip-title ng-binding">CLOSE_TRADE.PARTIAL_CLOSE</span><span class="xs-close-btn xs-close-tooltip" ng-click="close()"></span></div></div><div><label class="input-label">OPEN_TRADES.VOLUME</label> <div xs-numeric-stepper ng-if="enable" data-id="closeVolume" class="xs-form" options="data.closeVolume.options" stepper-model="data.closeVolume.modelStepper"></div><div ng-if="!enable" class="xs-form"><div class="xs-stepper ui-xsfocus"></div></div></div><div class="buttons-section"><button class="xs-btn xs-btn-warn xs-partial-close" ng-click="closeVolume()">OPEN_TRADES.CLOSE</button></div></div>');
}

openTradesClosePart.prototype = Object.create(controlBase.prototype);
openTradesClosePart.prototype.constructor = openTradesClosePart.constructor;



function dialogModal() {
    this.id = "modal-inner_" + (Math.random() * 100000);
    var template = '<div id="' + this.id + '" class="modal-dialog-inner"><div class="modal-content-dialog"></div></div>';
    var self = this;
    this.isOpen = false;
    this.html = $("#" + this.id);


    if (this.html.length === 0) {
        this.html = $(template);
        $(document.body).append(this.html);

        // this.$close_button = this.html.find(".close-button");
    }
    // this.$close_button.on("click", this.toggle.bind(this));
    this.$modal_content_dialog = this.html.find(".modal-content-dialog");
    this.$modal_content_dialog.html("");

    this.$modal_content_dialog.draggable();
    $(document.body).on("keydown", this.keydown.bind(this));


}

dialogModal.prototype = Object.create(controlBase.prototype);
dialogModal.prototype.constructor = dialogModal.constructor;
dialogModal.prototype.keydown = function (e) {
    var self = this;
    // if (!dialogModal.fnc && !dialogModal.context) {
    //     dialogModal.context = self;
    //     dialogModal.fnc = function (e) {


    //     }
    // }

    // return dialogModal.fnc;

    if (self.isOpen && e.which == 27) //scape
        self.close();
}


dialogModal.prototype.open = function () {
    this.isOpen = true;
    this.toggle();

}
dialogModal.prototype.toggle = function () {
    this.html.toggleClass("show-modal-dialog");

}
dialogModal.prototype.close = function () {
    this.isOpen = false;
    this.toggle();
    //  $(document.body).off("keydown", this.keydown());
   // MAE.MarketWatchModule.focusGrid();

    //this.html.remove();
}
dialogModal.prototype.dispose = function () {
    this.isOpen = false;
    // $(document.body).off("keydown", this.keydown());
}

dialogModal.prototype.setContent = function (element) {

    this.$modal_content_dialog.append(element);

}

dialogModal.prototype.getState = function ()
{
    return this.isOpen;
}

function maeDateRangePicker(scopeparent) {
    var template = '<div class="date-range-picker"><input class="date-range-picker-input" readonly/><span class="picker-date-icon"></span><span class="picker-popup-container"></span></div>';
    this.html = $(template);//v
    this._scopeParent = scopeparent;
    this.$datapicker;//u
    this.fechas = {}//p

    this.create();
}

maeDateRangePicker.prototype = Object.create(controlBase.prototype);
maeDateRangePicker.prototype.constructor = maeDateRangePicker.constructor;

maeDateRangePicker.prototype.create = function () {

    var self = this;
    // t.$watch("fromDate", l),
    // t.$watch("toDate", s);

    var fromDate = DateUtils.setMidnight(this._scopeParent.fromDate ? new Date(this._scopeParent.fromDate.getTime()) : new Date);//o
    var toDate = DateUtils.setEndDay(this._scopeParent.toDate ? new Date(this._scopeParent.toDate.getTime()) : new Date);//p
    var maxDate = DateUtils.setEndDay(this._scopeParent.maxDate ? new Date(this.maxDate.getTime()) : toDate);//m
    var _ranges = this.ranges(toDate);//f
    this.$element = this.html.find(".date-range-picker-input");
    var direccion = "up" === this._scopeParent.dropdownPosition ? "up" : "down";//b

    this.$datapicker = this.$element.daterangepicker({
        parentEl: this._scopeParent.parentSelector ? $(this._scopeParent.parentSelector) : this.html.find(".picker-popup-container"),
        timePicker: false,
        showDropdowns: false,
        drops: direccion,
        linkedCalendars: false,
        alwaysShowCalendars: true,
        startDate: fromDate,
        endDat: toDate,
        maxDate: maxDate,
        ranges: _ranges,
        locale: {
            format: DateTimeFormat.MOMENT.SHORT_DATE_SLASH,
            maskFormat: "00/00/00",
            datePlaceholder: "DD/MM/YY",
            firstDay: 1,
            oneLetterDayName: !0,
            customRangeDescriptionLabel: MAE.I18nService.getFrequentString("DATE.SELECT_DATE_RANGE"),
            customRangeLabel: getFrequentString("custom"),
            applyLabel: MAE.I18nService.getFrequentString("POPUPS.APPLY"),
            startLabel: MAE.I18nService.getFrequentString("HISTORY.FROM") + ":",
            endLabel: MAE.I18nService.getFrequentString("HISTORY.TO") + ":",
            monthNames: moment.months()
        }
    }).data("daterangepicker"),
        this.html.on("show.daterangepicker", function (e) {
            var n_date = new Date;
            var i = self._scopeParent.fullRange;
            self.$datapicker.setMaxDate(i ? maxDate : n_date);
        });

    this.html.on("apply.daterangepicker", this.apply.bind(this));

    this._scopeParent.addHandlePropertyChange(function (name, value) {


    });

    // this._scopeParent.on("xsDateRangePicker.hide", hide);
    // this._scopeParent.on("$destroy", clear);
    //t.$on("$destroy", clear),
    this.$datapicker.setEndDate(toDate);

};


maeDateRangePicker.prototype.fromDateChange = function (e, n) {
    this.$datapicker && e && e != n && this.$datapicker.setStartDate(this._scopeParent.fromDate);
}
maeDateRangePicker.prototype.toDateChange = function s(e, n) {
    this.$datapicker && e && e != n && this.$datapicker.setEndDate(t.toDate)
}

maeDateRangePicker.prototype.hide = function (e) { //d
    $(document).trigger("mousedown.daterangepicker");
}
maeDateRangePicker.prototype.clear = function (e) { //c
    this.$datapicker && this.$datapicker.remove();
    this.$datapicker = null;
    // n.off("xsDateRangePicker.hide", this.hide.bind(this));
}

maeDateRangePicker.prototype.apply = function r(e, n) {//r
    // t.$apply(function() {
    var e = new Date(n.startDate.valueOf())
        , i = new Date(n.endDate.valueOf())
        , a = void 0 !== this.fechas[n.chosenLabel] && null !== this.fechas[n.chosenLabel] ? this.fechas[n.chosenLabel] : "others";
    this._scopeParent.fromDate = e,
        this._scopeParent.toDate = i,
        this._scopeParent.chosenRange = a;
    // })
    this._scopeParent.search();
}

maeDateRangePicker.prototype.ranges = function (date) {//e
    var n = new Date;//
    n.setDate(n.getDate() - n.getDay());
    n = DateUtils.setMidnight(n);
    var a = new Date;
    a.setDate(1);
    a = DateUtils.setMidnight(a);
    var o = new Date;
    o.setDate(o.getDate() - 30),
        o = DateUtils.setMidnight(o);
    var l = new Date;
    l.setMonth(l.getMonth() - 3);
    l = DateUtils.setMidnight(l);
    var s = new Date((new Date).getFullYear(), 0, 1);
    s = DateUtils.setMidnight(s);
    var r = this._scopeParent.fullRange
        , d = date
        , c = date
        , u = date
        , m = date
        , f = date
        , v = date;

    if (r) {
        d = new Date;
        c = new Date(n);
        c.setDate(c.getDate() + 6);
        c = DateUtils.setEndDay(c);
        u = new Date(a);
        u.setMonth(u.getMonth() + 1);
        u.setDate(0);
        u = DateUtils.setEndDay(u);
        m = new Date(o);
        m.setDate(m.getDate() + 30);
        m = DateUtils.setEndDay(m);
        f = new Date(l);
        f.setMonth(f.getMonth() + 3);
        f.setDate(f.getDate() - 1);
        f = DateUtils.setEndDay(f);
        v = new Date(s.getFullYear(), 11, 31);
        v = DateUtils.setEndDay(v);
    }
    var b = {
        today: [new Date, d],
        week: [n, c],
        month: [a, u],
        days30: [o, m],
        months3: [l, f],
        year: [s, v],
        all: [new Date(2007, 0, 0, 0, 0), date]
    };
    var h = this._scopeParent.availableRanges;
    var g = {};
    for (var x in b) {
        null !== h && void 0 !== h && h.indexOf(x) === -1 || (g[getFrequentString(x)] = b[x], this.fechas[getFrequentString(x)] = x);
    }


    return g
}

function getFrequentString(t) {
    return MAE.I18nService.getFrequentString("HISTORY.RANGE_" + t.toUpperCase());
}

function maeMultiselectCombobox(scopeparent, configuracion) {
    var template = '#maeMultiselectComboboxTemplate';
    this.html = $($(template).html());//v
    this._scopeParent = scopeparent;
    this.$configuracion = configuracion;
    this.$lblSelection;
    this.$empty_label;
    this.$inputQuery;
    this.selected_items;
    this.$items;
    this.typeahead_string_limit;
    this.selection_change_callback;
    this.row_formatter;
    this.heightItem;
    this.maxRows;
    this.constante_filas = 5;
    this.comboboxUtils;
    this.container = {};//m
    this.isOpen;
    this.activeIndex;
    this.showSelectAll;
    this.showStaticSelectAll;
    this.activeIndex;
    this.$btnToggle;
    this.selectAllItem;
    this.displayedItems = [];
    this.labelField;
    this.idField;

    this._selectAllItem = {};//y
    this.selectedItemsMap = [];
    this.idTimerS;//S
    this.idTimerW; //w
    this.searchable;
    this.items;
    this.selectedItems = [];
    this.selectAllAlwaysVisible = false;
    this.create();
    this.init();
}

maeMultiselectCombobox.prototype = Object.create(controlBase.prototype);
maeMultiselectCombobox.prototype.constructor = maeMultiselectCombobox.constructor;

maeMultiselectCombobox.prototype.querySearchChangeHandler = function () {
    this.search(false);
}
maeMultiselectCombobox.prototype.create = function () {
    var self = this;
    this.$lblSelection = this.html.find("#lblSelection");
    var all_label_value = this.$configuracion.attr("all-label");
    all_label_value = MAE.I18nService.getString(all_label_value);
    this.$lblSelection.text(all_label_value);
    this.allLabel = all_label_value;
    this.$empty_label;
    var empty_label = this.$configuracion.attr("empty-label");
    empty_label = MAE.I18nService.getString(empty_label);


    this.$inputQuery = this.html.find("#inputQuery");
    var placeholder = this.$configuracion.attr("placeholder");
    placeholder = MAE.I18nService.getString(placeholder);
    this.$inputQuery.attr("placeholder", placeholder);

    this.$inputQuery.change(function (e) {
        self.querySearchChangeHandler();
    });
    this.$inputQuery.on("click", function (e) {
        e.stopPropagation();
    });

    var selected_items_attr = this.$configuracion.attr("selected-items");
    this.selected_items = this._scopeParent[selected_items_attr];

    this.items_attr = this.$configuracion.attr("items");
    this.items = this._scopeParent[this.items_attr];

    this.typeahead_string_limit = this.$configuracion.attr("typeahead-string-limit");

    var callback_name = this.$configuracion.attr("selection-change-callback");
    this.selection_change_callback = this._scopeParent[callback_name];

    var row_formatter_fnc = this.$configuracion.attr("row-formatter");
    this.row_formatter = this._scopeParent[row_formatter_fnc];

    this.heightItem = this.$configuracion.attr("height-item");
    this.maxRows = this.$configuracion.attr("max-rows");

    this.$btnToggle = this.html.find("#btnToggle");

    this.$btnToggle.on("click", this.toggle.bind(this));

    this.labelField = this.$configuracion.attr("label-field");
    this.idField = this.$configuracion.attr("id-field");

    var select_all = this.$configuracion.attr("show-select-all");
    this.showSelectAll = !!select_all;
    var _searchable = this.$configuracion.attr("searchable");
    this.searchable = !!_searchable;


    this.$no_items = this.html.find("#noItems");

};


maeMultiselectCombobox.prototype.setSearchLabel = function (value) {
    this.$lblSelection.text(value);

}


maeMultiselectCombobox.prototype.init = function () {//n
    this.maxRows = this.getMaxRows();
    var self = this;
    var heightItem = this.getHeightItem();
    var i_query = {
        scrollParams: {
            showArrows: false,
            contentWidth: "0px",
            enableKeyboardNavigation: true
        },
        loopForScrolledItemsDisabled: true
    };
    null !== heightItem && (i_query.staticHeightItem = heightItem);
    this.comboboxUtils = new ComboboxUtils(this, this.html, this.displayedItems, this.maxRows, "activeIndex", i_query);
    this.container.dropdownContainer = this.html.find(".dropdown-menu");
    this.container.dropdownScrollContainer = this.html.find(".mae-scroll-container");
    this.container.button = this.html.find(".btn-primary");
    this.container.searchInput = this.html.find(".mae-searchbox-input");
    this.container.scrollContainer = this.html.find(".mae-scroll-container");
    this.container.staticShowAllButton = this.html.find(".static-select-all");

    this.ulItems = this.html.find("#ulItems");
    self.ulItems.on("selectAll.trigger", self.trigger_selectAll.bind(self));
    //e.$on("$destroy", u),
    this.html.bind("keydown", this.keydown.bind(this));

    var no_result = MAE.I18nService.getString("SYMBOLS_SEARCH.NO_RESULTS");
    this.html.find(".no-items > span").text(no_result);

    this.container.staticShowAllButton.mouseenter(function (e) {
        self.mouseEnterHandler(e, -1);
    });


    if (this.showStaticSelectAll) {
        this.container.dropdownContainer.addClass("with-static-select-all");

    }

    if (this.showStaticSelectAll && this.selectAllItem && this.displayedItems.length != 0) {
        this.container.staticShowAllButton.show();
    }
    else {
        this.container.staticShowAllButton.hide();

    }

    if (this.displayedItems.length == 0) {
        this.container.dropdownContainer.addClass("no-results");
    }

    this.initScope();
    this.drawItem();
};

maeMultiselectCombobox.prototype.trigger_selectAll = function (event, item) {
    var self = this;
    var index = self.displayedItems.indexOf(item);
    var elem = self.ulItems.find('li[data-id-item=' + index + ']');

    if (self.selectedItemsMap[item[self.idField]])
        elem.addClass("selected");
    else
        elem.removeClass("selected");


    this.selection_change_callback(this.selectedItems);

}

maeMultiselectCombobox.prototype.drawItem = function () {
    var item_temp;
    var self = this;
    self.ulItems.html('');

    if (this.displayedItems.length == 0) {
        this.$no_items.removeClass("no-items-clear");
        this.$no_items.addClass("no-items");
        this.$no_items.show()
    }
    else {
        this.$no_items.removeClass("no-items");
        this.$no_items.addClass("no_items_clear");
        this.$no_items.hide();
    }



    this.displayedItems.forEach(function (item, index) {

        item_temp = self.buildItem(item, index);

        self.ulItems.append(item_temp);

    });


}

maeMultiselectCombobox.prototype.formatItem = function (e, n) {
    return e ? this.row_formatter ? this.row_formatter(e, n) : e[this.labelField] : "";
};

maeMultiselectCombobox.prototype.buildItem = function (item, index) {
    /*
     <li class="mae-combobox-li-item" ng-repeat="item in displayedItems"
                        ng-class="{\'selected\': selectedItemsMap[item[idField]]}" \n
                        ng-mouseenter="mouseEnterHandler($event, $index)" \n ng-click="selectItem(item)" \n
                        data-id-item="{{$index}}" title="{{::formatItem(item, true)}}"> <a class="pointer"
                            ng-bind-html="::formatItem(item, false)"></a> </li>
    */
    var self = this;
    var template = '<li class="mae-combobox-li-item"> <a class="pointer">' + this.formatItem(item, false) + '</a></li>';
    var elem = $(template);

    elem.on("click", function () {
        self.selectItem(item);
        if (self.selectedItemsMap[item[self.idField]])
            elem.addClass("selected");
        else
            elem.removeClass("selected");
    })
    elem.mouseenter(function (e) {
        self.mouseEnterHandler(e, index);
    });
    elem.attr("title", this.formatItem(item, true));
    elem.attr("data-id-item", index);

    if (self.selectedItemsMap[item[self.idField]])
        elem.addClass("selected");
    else
        elem.removeClass("selected");

    return elem;

};

maeMultiselectCombobox.prototype.forAllinExclusiveItems = function p() {//p
    for (var e = this.items, n = 0, i = e.length; n < i; n++)
        this.inExclusiveItems(e[n]) && this.setKeyValue(e[n], false);
};


maeMultiselectCombobox.prototype.setSelectedItems = function () {//I
    var e = this.selectedItems;
    e.length = 0;
    for (var n, i = this.items, a = 0, o = i.length; a < o; a++) {
        n = i[a];
        this.getKeyValue(n) && e.push(n);
    }

    if (e.length > 0)
        this.selectedItemsChange();

}

maeMultiselectCombobox.prototype.runCallback = function f() {//f
    this.selectionChangeCallback && this.selectionChangeCallback();
    this.setInputFocus && this.setInputFocus();
}

maeMultiselectCombobox.prototype.selectItem = function (n) {
    var i, a, o, l = this.inExclusiveItems(n), s = this.getKeyValue(n);
    if (l) {
        if (!s)
            for (i = this.items, a = 0, o = i.length; a < o; a++)
                this.setKeyValue(i[a], false);
    } else
        this.forAllinExclusiveItems();

    this.setKeyValue(n, !s);
    if (this.selectAllItem === n) {
        for (i = this.items, a = 0, o = i.length; a < o; a++) {
            this.setKeyValue(i[a], !s);//this.setKeyValue(i[a], !s && !this.inExclusiveItems(i[a]));
            this.ulItems.trigger("selectAll.trigger", [i[a]]);
        }
    }
    else



        this.setSelected();
    this.setSelectedItems();
    this.setLabel();
    clearTimeout(this.idTimerS);
    this.idTimerS = setTimeout(this.runCallback.bind(this), 0, true);
    this.ulItems.trigger("selectAll.trigger", [n]);
}

maeMultiselectCombobox.prototype.keydown = function (t) {//c
    if (this.container && this.isOpen) {
        var n = false;
        switch (t.which) {
            case 13:
                this.activeIndex > -1 && this.selectItem(this.displayedItems[this.activeIndex]);
                n = true;
                break;
            case 27:
                break;
            case 40:
            case 38:
                this.activeIndex = this.comboboxUtils.onKeyUp(t.which, this.activeIndex);
                n = true;
        }
        this.comboboxUtils.renderActive(this.activeIndex);
        n && (t.preventDefault(), t.stopPropagation());
    }
}

maeMultiselectCombobox.prototype.getMaxRows = function () {//a
    var t = this.constante_filas;
    this.maxRows && (t = Number(this.maxRows));
    var n = Number(t) - (this.showSelectAllOrStatic() ? 1 : 0);
    return isNaN(n) ? this.constante_filas - (this.showSelectAllOrStatic() ? 1 : 0) : Math.max(2, n)
};

maeMultiselectCombobox.prototype.getHeightItem = function () {//o
    var t = Number(this.heightItem);
    return isNaN(t) ? 33 : Math.max(10, t)
};

maeMultiselectCombobox.prototype.showSelectAllOrStatic = function () {//i
    return this.showSelectAll && this.showStaticSelectAll
}




maeMultiselectCombobox.prototype.toggle = function () {
    if (this.container) {
        this.isOpen = !this.isOpen
        if (this.isOpen) {
            document.removeEventListener("mousedown", this.mousedown.bind(this));
            document.removeEventListener("keyup", this.keyup.bind(this), true);

            document.addEventListener("mousedown", this.mousedown.bind(this));
            document.addEventListener("keyup", this.keyup.bind(this), true);
            this.resetDisplayList();
            this.container.dropdownContainer.css("display", "block");
            this.container.dropdownContainer.css("top", "100%");
            var t = this.container.dropdownContainer[0].getBoundingClientRect().bottom;
            var n = t - window.innerHeight;
            this.updateDropdownView();

            if (this.searchable) {
                this.container.searchInput.css("display", "inline-block");
                this.container.searchInput.focus();
            } else if (n > 0) this.container.dropdownContainer.css("top", "-115px");

        } else {
            document.removeEventListener("mousedown", this.mousedown.bind(this));
            document.removeEventListener("keyup", this.keyup.bind(this), true);
            this.container.dropdownContainer.css("display", "none");
            this.container.searchInput.css("display", "none");
        }

    }

}

maeMultiselectCombobox.prototype.updateDropdownView = function () {
    if (this.container && this.comboboxUtils.jScrollApi) {
        var t = this.getMaxRows();
        var n = Math.max(0, Math.min(t, this.displayedItems.length));
        var l = 0;

        if (n >= this.displayedItems.length ? this.container.dropdownContainer.addClass("no-scrollbar") : (this.container.dropdownContainer.removeClass("no-scrollbar"), l = 6),
            this.container.dropdownScrollContainer.width(this.container.dropdownContainer.width()), this.showSelectAllOrStatic()) {
            var s = this.getHeightItem();
            this.container.dropdownScrollContainer.css({
                top: s,
                height: n * this.getHeightItem() + l - s
            });
            this.container.staticShowAllButton.css({
                height: s
            });
        } else
            this.container.dropdownScrollContainer.css({
                top: 0,
                height: n * this.getHeightItem() + l
            });
        n += this.showSelectAllOrStatic() ? 1 : 0;
        this.container.dropdownContainer.height(n * this.getHeightItem());
        this.drawItem();
        this.comboboxUtils.updateScrollbar()
    }
}


maeMultiselectCombobox.prototype.resetDisplayList = function () {
    this.query = "";
    this.activeIndex = 0;
    this.search(false);

};

maeMultiselectCombobox.prototype.mousedown = function (n) {//l
    this.isOpen && !this.html[0].contains(n.target) && this.toggle()
};

maeMultiselectCombobox.prototype.keyup = function (t) {
    if (this.isOpen)
        switch (t.which) {
            case 27:
                t.stopImmediatePropagation();
                this.toggle();
        }
};


maeMultiselectCombobox.prototype.scrollTop = function () {
    this.comboboxUtils.jScrollApi && this.comboboxUtils.jScrollApi.scrollTo(0, 0)
};

maeMultiselectCombobox.prototype.mouseEnterHandler = function (t, n) {
    t.preventDefault();
    var i = this.comboboxUtils.onMouseEnter(n, t);
    i !== -1 && (this.activeIndex = i)
};

maeMultiselectCombobox.prototype.setInputFocus = function () {
    this.container && this.container.searchInput && this.container.searchInput.focus()
};

maeMultiselectCombobox.prototype.dropdownToggleKeyboardEventHandler = function (t) {
    this.comboboxUtils.jScrollApi.scrollTo(0, t)
};


maeMultiselectCombobox.prototype.initScope = function () {//n
    //    //t.labelField
    //this.searchable = !!this.searchable && "TRUE" == this.searchable.toUpperCase(),
    this.showStaticSelectAll = "false" !== String(this.selectAllAlwaysVisible);
    this.idField = void 0 != this.idField ? this.idField : "id";
    if (this.showSelectAll) {

        this._selectAllItem[this.idField] = "all" + 1e5 * Math.random();
        this._selectAllItem[this.labelField] = this.allLabel;
        this.selectAllItem = this._selectAllItem;
    }




    this.mapItems();
    //t.$on("$destroy", this.clear);
    // t.$watchCollection("items", this.itemsChange);
    //t.$watchCollection("selectedItems", this.selectedItemsChange);
    //t.$watch("labelField", this.labelFieldChange);



};

maeMultiselectCombobox.prototype.setUpdateDropdownView = function () {//d
    this.updateDropdownView && this.updateDropdownView()
};

maeMultiselectCombobox.prototype.labelFieldChange = function a(e, n) {
    D = this.labelField;
}

maeMultiselectCombobox.prototype.toUpperCaseSearch = function (e, t) {//u
    return !!e && e.toUpperCase().search(".*" + t.toUpperCase() + ".*") !== -1
};

maeMultiselectCombobox.prototype.itemsChange = function (e, n) {//o
    this.search(false);
    this.selectedItems && 0 === this.selectedItems.length && (this.setSelected(), this.setLabel());
};
maeMultiselectCombobox.prototype.selectedItemsChange = function (e, t) {//l
    this.mapItems(false);
}
maeMultiselectCombobox.prototype.search = function (isNew) {//r
    this.query = this.$inputQuery.val();

    this.displayedItems.length = 0;


    var n, i = this.items, a = this.searchable ? this.query : null;
    if (i) {
        for (var o = 0, l = i.length; o < l; o++) {
            n = i[o];
            a && 0 != a.length && !this.toUpperCaseSearch(this.formatItem(n), a) || this.displayedItems.push(n);
        }
    }

    if (this.selectAllItem && this.items.length > 0) {
        this.displayedItems.unshift(this.selectAllItem);
        clearTimeout(this.idTimerW);
        this.idTimerW = setTimeout(this.setUpdateDropdownView, 1, true);
    }

    //!this.selectAllItem || this.showStaticSelectAll || a && 0 != a.length || this.displayedItems.unshift(this.selectAllItem), clearTimeout(this.idTimerW), this.idTimerW = setTimeout(this.setUpdateDropdownView, 1, true);


    this.drawItem();
};

maeMultiselectCombobox.prototype.destroy = function () {
    this.clear();
};

maeMultiselectCombobox.prototype.clear = function () {//i
    clearTimeout(idTimerS);
    clearTimeout(idTimerW);
};

maeMultiselectCombobox.prototype.setKeyValue = function (e, n) {//x
    this.selectedItemsMap[this.getFiledVAlue(e)] = n
};
maeMultiselectCombobox.prototype.getFiledVAlue = function (e) {//h
    return e[this.idField];
};

maeMultiselectCombobox.prototype.getKeyValue = function (e) {//g
    return this.selectedItemsMap[this.getFiledVAlue(e)];
};


maeMultiselectCombobox.prototype.inExclusiveItems = function (e) {//m
    return !!(this.exclusiveItems && this.exclusiveItems.indexOf(e) > -1)
}
maeMultiselectCombobox.prototype.setSelected = function v() {//v
    var e, n, i, a = this.items, o = true;
    if (this.selectAllItem) {
        for (n = 0, i = a.length; n < i; n++) {
            e = a[n];
            if (e != this.selectAllItem && !this.getKeyValue(e) && !this.inExclusiveItems(e)) {
                o = false;
                break
            }
        }
        this.setKeyValue(this.selectAllItem, o);
    }
};

maeMultiselectCombobox.prototype.setLabel = function () {//b
    if (this.selectAllItem && this.getKeyValue(this.selectAllItem))
        this.setSearchLabel(this.selectAllItem[this.labelField]);
    else {
        for (var e = "", n = this.selectedItems, i = 0, a = n.length; i < a; i++) {
            e += this.formatItem(n[i], !0);
            i != a - 1 && (e += ", ");
        }


        "" == e && this.emptyLabel && (e = this.emptyLabel);
        this.setSearchLabel(e);
    }
}

maeMultiselectCombobox.prototype.setScrollTop = function () {//c
    this.scrollTop && this.scrollTop()
}

maeMultiselectCombobox.prototype.invalidate = function () {//c

    this.items = this._scopeParent[this.items_attr];
    this.itemsChange();


    this.search(true);

}


maeMultiselectCombobox.prototype.mapItems = function (e) {//s
    var s_items = this.selectedItems ? this.selectedItems : [];
    var maps = this.selectedItemsMap;
    for (var a in maps) {
        maps[a] = null;
        delete maps[a];
    }

    var index, len_items;
    if (s_items.length > 0) {
        for (index = 0, len_items = s_items.length; index < len_items; index++)
            this.setKeyValue(s_items[index], true);
    }

    else {
        for (index = 0, len_items = this.items.length; index < len_items; index++)
            this.setKeyValue(this.items[index], false);
    }


    this.setSelected();
    this.setLabel();
    if (e)
        this.setScrollTop();
}

function ComboboxUtils(escope, element, items, maxRows, updateIndex, i_query) {//e, t, r, n, i, a
    this.scope = escope;
    this.element = element;
    this.items = items;
    this.itemHeight = 0;
    i_query && i_query.staticHeightItem && (this.itemHeight = i_query.staticHeightItem);
    this.MAX_VISIBLE_ITEMS = maxRows || items.length;
    this.NO_MAX_ITEMS = !maxRows && 0 === items.length;
    this.workspaceMode = !!i_query && (i_query.workspaceMode || false);
    this.scrollParams = {};
    i_query && (this.scrollParams = $.extend(this.scrollParams, i_query.scrollParams));
    this.scrollContainer = element.find(".mae-scroll-container");
    this.scrollerAvailable = 0 !== this.scrollContainer.length;
    this.loopForScrolledItemsDisabled = false;
    i_query && i_query.loopForScrolledItemsDisabled && (this.loopForScrolledItemsDisabled = i_query.loopForScrolledItemsDisabled);

    this.scrollerAvailable && this.initJScrollPane(escope, element);
    this.mousePosition = {
        x: -1e9,
        y: -1e11
    };
    this._activeIndex = null;
    this._mousescroll = false;
    this._onEnterIndex = null;
    this.updateIndex = updateIndex;
    var o = this;
    $(element).bind("mousemove", function (e) {
        o.mousePosition.x = e.clientX;
        o.mousePosition.y = e.clientY;

        if (o._onEnterIndex !== o._activeIndex) {
            o._activeIndex = o._onEnterIndex;
            o.renderActive(o._onEnterIndex);
            null !== o.updateIndex && void 0 !== o.updateIndex && (o.scope[o.updateIndex] = o._activeIndex)
        }
    })
};
ComboboxUtils.prototype.initJScrollPane = function (e) {
    this.scrollPane = this.scrollContainer.jScrollPane(this.scrollParams),
        this.jScrollApi = e.jScrollApi = this.scrollPane.data("jsp"),
        this.updateScrollbarTimer = null
};

ComboboxUtils.prototype.updateScrollbar = function (e) {
    e || (e = 0);
    var t = this.element.find(".mae-combobox-li-item")[0];
    if (t) {
        clearTimeout(this.updateScrollbarTimer);
        var r = this;
        this.updateScrollbarTimer = setTimeout(function () {
            0 === r.itemHeight && (t = r.element.find(".mae-combobox-li-item")[0],
                r.itemHeight = $(t).outerHeight());
            var n = Math.max(r.itemHeight, r.items.length * r.itemHeight);
            r.workspaceMode || (r.NO_MAX_ITEMS && (r.MAX_VISIBLE_ITEMS = r.items.length),
                n = Math.min(r.MAX_VISIBLE_ITEMS * r.itemHeight + e, n)),
                r.scrollContainer.height(n),
                r.jScrollApi.scrollTo(0, 0),
                r.jScrollApi.reinitialise()
        }, 10, !0)
    }
};

ComboboxUtils.prototype.renderActive = function (e) {
    this.clearActive(),
        $(this.element).find('li[data-id-item="' + e + '"]').addClass("active")
};

ComboboxUtils.prototype.clearActive = function () {
    $(this.element).find("li.active").each(function () {
        $(this).removeClass("active"),
            this._activeIndex = null
    })
};

ComboboxUtils.prototype.onMouseEnter = function (e, t) {
    return this._onEnterIndex = e,
        this.mousePosition.x !== t.clientX || this.mousePosition.y !== t.clientY || this._mousescroll !== !1 || -1; /*|| bowser.msedge || bowser.msie && (!bowser.msie || null === this._activeIndex || this._activeIndex !== e) ? (this._activeIndex = e,
            this._mousescroll = !1,
            this.renderActive(e),
            e) : -1*/
};

ComboboxUtils.prototype.onMouseWheel = function () {
    this._mousescroll = !0
};

ComboboxUtils.prototype.onDestroy = function () {
    this.scrollContainer = null,
        this.scrollerAvailable && (this.jScrollApi && this.jScrollApi.destroy(),
            this.jScrollApi = null,
            this.scrollPane = null,
            clearTimeout(this.updateScrollbarTimer))
};

ComboboxUtils.prototype.isItemInVisibleRange = function (e) {
    var t = this.items.length
        , r = e / t
        , n = this.jScrollApi.getPercentScrolledY() * (t - this.MAX_VISIBLE_ITEMS) / t;
    return NumberUtils.multiplyAndRound100(r) >= NumberUtils.multiplyAndRound100(n) && NumberUtils.multiplyAndRound100(r) < NumberUtils.multiplyAndRound100(n + this.MAX_VISIBLE_ITEMS / t)
};

ComboboxUtils.prototype.scrollToY = function (e) {
    this.scope.$broadcast("dropdownToggleKeyboardEvent", e),
        this.scope.dropdownToggleKeyboardEventHandler && this.scope.dropdownToggleKeyboardEventHandler(e)
};

ComboboxUtils.prototype.onKeyUp = function (e, t) {
    switch (e) {
        case 40:
            t = t < this.items.length - 1 ? t + 1 : this.loopForScrolledItemsDisabled ? t : 0,
                this.scrollerAvailable && !this.isItemInVisibleRange(t) && this.scrollToY((t - (this.MAX_VISIBLE_ITEMS - 1)) * this.itemHeight);
            break;
        case 38:
            t = t > 0 ? t - 1 : this.loopForScrolledItemsDisabled ? t : this.items.length - 1,
                this.scrollerAvailable && !this.isItemInVisibleRange(t) && this.scrollToY(t * this.itemHeight)
    }
    return this.renderActive(t),
        this._mousescroll = !1,
        this._activeIndex = t,
        t
};



function popupsBitacora(template) {
    var html_temp = $("#" + template).html();
    var self = this;
    this.html = $(html_temp);
    this.item = {};
    this.$title_bitacora = this.html.find("#title_bitacora");
    this.$gridBitacora = this.html.find("#gridBitacora");
    this._xDataGridView = new XDataGridView(this.html.find("#gridBitacora"));
    this._items = [];
    this.columnas = [];
    this._proxy = {
        rowHeight: 80
    };
    var title_bitacora_text = MAE.I18nService.getString("BITACORA.TITLETEXT");
    this.$title_bitacora.text(title_bitacora_text);

    this.dialog = new dialogModal();
    this.dialog.$modal_content_dialog.css("width", "780px");
    this.dialog.$modal_content_dialog.css("height", "500px");

    //this.dialog.$modal_content_dialog.css("height", "500px");
    this.dialog.setContent(this.html);



    this.$close_btn = this.html.find("#close_btn");

    this.$close_btn.on("click", this.dialog.close.bind(this.dialog));

    this.armarGrilla();
    MAE.BitacoraService.initSubscriptions(this.onInit.bind(this));

};

popupsBitacora.prototype = Object.create(controlBase.prototype);
popupsBitacora.prototype.constructor = popupsBitacora.constructor;




popupsBitacora.prototype.armarGrilla = function () {
    this.armarColumnas();
    this.traducir();
    this._xDataGridView.init(this.columnas, this._proxy, this._items, "id", {}, null/*groupObj*/);


}

popupsBitacora.prototype.setItem = function (item) {
    this.item = item;
};

popupsBitacora.prototype.draw = function () {

    MAE.BitacoraService.searchBitacora({
        IdOrden: this.item.IdOrden
    });

};

popupsBitacora.prototype.show = function () {

    //this.dialog.setContent(this.html);
    this.draw();
    this.dialog.open();

};


popupsBitacora.prototype.formatoGeneral = function (row, cell, value, columnDef, dataContext) {
    return value;
}

popupsBitacora.prototype.formatoGeneral_grap = function (row, cell, value, columnDef, dataContext) {
    return '<p class="bitacora-observaciones">'+ value +'</p>';
}


popupsBitacora.prototype.formatoEstado = function (row, cell, value, columnDef, dataContext) { 
    var texto = "";
    var color;

    var estado = dataContext.IdEstado;
    var estados = ["Ingresada", "Cancelada", "Expirada", "Confirmada", "Aplicada", "Aplicada Parcial", "Rechazo Envio Mercado", "En Mercado", "Bloqueada"];
    var colores = ["#CCCCCC", "#AA0433", "#9900FF", "#B76B24", "#082D8C", "#3366FF", "#E0AFAF", "#55916B", "#F7DC6F"];

    texto = estados[estado - 1];
    color = colores[estado - 1];

    return '<div  class="" style="color:#:' + color + '">' + texto + '</div>';
}

popupsBitacora.prototype.formatoFecha = function (row, cell, value, columnDef, dataContext) {
    var date, new_date_from_utc, new_date;

    date = new Date(value);
    new_date_from_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    new_date = new Date(new_date_from_utc);
    new_date = FormatDateTimeUtils.formatFullDate(new_date, '</span> <span class="oh-date-hours " style="display: flex;justify-content: left;">');

    return '<span class="oh-date"><span class="oh-date-year s" style="display: flex;justify-content: left;height:19px">' + new_date + '</span></span>';

    //'<span class="oh-date"><span class="oh-date-year">' + s.formatDate(H, DateTimeFormat.ANGULAR.SHORT_DATE_DASH, !0) + '</span><span class="oh-date-hours">' + s.formatDate(H, DateTimeFormat.ANGULAR.LONG_TIME_23H, !0) + "</span></span>")


}


popupsBitacora.prototype.onInit = function (e, data, o) {//v
    var l, t, a, i;
    var current_item;
    var self = this;
    switch (e) {
        case DataEvent.EXIST:

        case DataEvent.ITEM_LIST:

            self._items.length = 0;
            _.forEach(data, function (ite_for) {
                // var temp_item = _items.find(t => t.IdOrden == ite_for.IdOrden);
                // if (temp_item === undefined) {
                self._items.push(ite_for);
                //}
            });

            this._xDataGridView.updateItems(data, 100);

            $(".bitacora-observaciones").jScrollPane();

            this._moduleIsReady();

            break;

        case DataEvent.NEW:


            break;
        case DataEvent.UPDATED:

            break;
        case DataEvent.REMOVED:
            break;
        case DataEvent.NO_DATA:
            _items.length = 0;
            this._xDataGridView.updateItems([], 100);

            this._moduleIsReady();

            break;
    }

}

popupsBitacora.prototype._moduleIsReady = function () {

}

popupsBitacora.prototype.armarColumnas = function () {

    /*
                    { field: "Fecha", type: 'text', title: "Fecha", width: "100px", template: "#=Fecha!='' ? kendo.toString(kendo.parseDate(Fecha), 'dd.MM.yyyy HH.mm'):'' #" },
                    { field: "UsuarioDescripcion", type: 'text', title: "Usuario", "width": 100 },
                    { field: "EstadoDescripcion", type: 'text', title: "Estado", "width": 120 },
                    { field: "AccionDescripcion", type: 'text', title: "Accion", "width": 140 },
                    { field: "MotivoCancelacionDescripcion", type: 'text', title: "Motivo Baja", "width": 120 },
                    { field: "Observaciones", type: 'text', title: "Observaciones", "width": 120 },
                    { field: "Source", type: 'text', title: "Fuente", "width": 120 }
    */

    this.columnas.push(
        {
            id: "Fecha",
            name: "",
            nameKey: "BITACORA.Fecha",
            field: "Fecha",
            sortable: false,
            formatter: this.formatoFecha,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });

    this.columnas.push(
        {
            id: "UsuarioDescripcion",
            name: "",
            nameKey: "BITACORA.UsuarioDescripcion",
            field: "UsuarioDescripcion",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });

    this.columnas.push(
        {
            id: "EstadoDescripcion",
            name: "",
            nameKey: "BITACORA.EstadoDescripcion",
            field: "EstadoDescripcion",
            sortable: false,
            formatter: this.formatoEstado,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });

    this.columnas.push(
        {
            id: "AccionDescripcion",
            name: "",
            nameKey: "BITACORA.AccionDescripcion",
            field: "AccionDescripcion",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });

    this.columnas.push(
        {
            id: "MotivoCancelacionDescripcion",
            name: "",
            nameKey: "BITACORA.MotivoCancelacionDescripcion",
            field: "MotivoCancelacionDescripcion",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });

    this.columnas.push(
        {
            id: "Observaciones",
            name: "",
            nameKey: "BITACORA.Observaciones",
            field: "Observaciones",
            sortable: false,
            formatter: this.formatoGeneral_grap,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });

    this.columnas.push(
        {
            id: "Source",
            name: "",
            nameKey: "BITACORA.Source",
            field: "Source",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 84,
            type: "string"
        });
}

popupsBitacora.prototype.traducir = function () {//R
    for (var e = this.columnas.length - 1; e > -1; e--)
        this.columnas[e].name = MAE.I18nService.getFrequentString(this.columnas[e].nameKey)
}



function detallePanel(scope_Parent, _grid) {
    this.html = $($("#detalleTemplate").html());
    this.$headerDetalle = this.html.find("#headerDetalle");
    this.parentScope = scope_Parent;
    this._xDataGridView = new XDataGridView(this.html.find("#detalleGrid"));
    this._items = [];
    this.columnas = [];
    this._proxy = {
        rowHeight: 45
    };
    this.item = {};
    this.grid;
    this._data_jsp;
    this.slick_viewport;
    this.$loaderDetalle = this.html.find("#loaderDetalle");
    this.iniControls();
    this.initEvent();
    this.armarGrilla();
    MAE.DetalleService.initSubscriptions(this.onInit.bind(this));
};


detallePanel.prototype = Object.create(controlBase.prototype);
detallePanel.prototype.constructor = detallePanel.constructor;

detallePanel.prototype.iniControls = function () {


};

detallePanel.prototype.initEvent = function () {
    var self = this;
    this.$headerDetalle.on("click", function (e) {
        self.parentScope.closeDetalle();
    });
};

detallePanel.prototype.setData = function (item) {
    this.item = item;
    this.search(item);
    this.draw(item);

};

detallePanel.prototype.detach = function () {

};

detallePanel.prototype.armarColumnas = function () {

    /*
            [
                { field: "NroOperacionMercado", title: LT.T('LBL_NROOPERACIONMERCADO'), "width": 50 },
                { field: "Precio", title: LT.T('LBL_PRECIO'), "width": 40, format: "{0:N4}", attributes: { style: "text-align:right" } },
                { field: "Cantidad", title: LT.T('LBL_CANTIDAD'), "width": 40, format: "{0:N0}", attributes: { style: "text-align:right" } },
                { field: "Monto", title: LT.T('LBL_MONTO'), "width": 40, format: "{0:N4}", attributes: { style: "text-align:right" } },
    */


    this.columnas.push(
        {
            id: "NroOperacionMercado",
            name: "",
            nameKey: "DETALLE.NroOperacionMercado",
            field: "NroOperacionMercado",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 54,
            type: "string"
        });

    this.columnas.push(
        {
            id: "Precio",
            name: "",
            nameKey: "DETALLE.Precio",
            field: "Precio",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 40,
            type: "string"
        });

    this.columnas.push(
        {
            id: "Cantidad",
            name: "",
            nameKey: "DETALLE.Cantidad",
            field: "Cantidad",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 40,
            type: "string"
        });

    this.columnas.push(
        {
            id: "Monto",
            name: "",
            nameKey: "DETALLE.Monto",
            field: "Monto",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 40,
            type: "string"
        });
    this.columnas.push(
        {
            id: "Tasa",
            name: "",
            nameKey: "DETALLE.Tasa",
            field: "Tasa",
            sortable: false,
            formatter: this.formatoGeneral,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 40,
            type: "string"
        });

    this.columnas.push(
        {
            id: "Fecha",
            name: "",
            nameKey: "DETALLE.Fecha",
            field: "Fecha",
            sortable: false,
            formatter: this.formatoFecha,
            cssClass: "slickgrid-cell-align-center",
            headerCssClass: "slickgrid-cell-align-center",
            width: 100,
            type: "string"
        });

}

detallePanel.prototype.formatoGeneral = function (row, cell, value, columnDef, dataContext) {
    return value;
}

detallePanel.prototype.formatoFecha = function (row, cell, value, columnDef, dataContext) {
    var date, new_date_from_utc, new_date;

    date = new Date(value);
    new_date_from_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
    new_date = new Date(new_date_from_utc);
    new_date = FormatDateTimeUtils.formatFullDate(new_date, '</span> <span class="oh-date-hours " style="width: 120px;text-align: left;">');

    return '<span class="oh-date" style="display: flex;justify-content: center;flex-direction: column;align-items: center;"><span class="oh-date-year " style="width: 120px;text-align: left;">' + new_date + '</span></span>';

    //'<span class="oh-date"><span class="oh-date-year">' + s.formatDate(H, DateTimeFormat.ANGULAR.SHORT_DATE_DASH, !0) + '</span><span class="oh-date-hours">' + s.formatDate(H, DateTimeFormat.ANGULAR.LONG_TIME_23H, !0) + "</span></span>")


}
// detallePanel.prototype.armarGrilla = function () {
//     this.armarColumnas();
//     this.traducir();
//     this._xDataGridView.init(this.columnas, this._proxy, this._items, "id", {}, null/*groupObj*/);


// }

detallePanel.prototype.traducir = function () {//R
    for (var e = this.columnas.length - 1; e > -1; e--)
        this.columnas[e].name = MAE.I18nService.getFrequentString(this.columnas[e].nameKey)
}

detallePanel.prototype.onInit = function (e, data, o) {//v
    var l, t, a, i;
    var current_item;
    var self = this;
    switch (e) {
        case DataEvent.EXIST:

        case DataEvent.ITEM_LIST:
            this._data_jsp.scrollToY(0);

            this._data_jsp.getContentPane().addClass("initialization");

            self._items.length = 0;
            _.forEach(data, function (ite_for) {
                // var temp_item = _items.find(t => t.IdOrden == ite_for.IdOrden);
                // if (temp_item === undefined) {
                self._items.push(ite_for);
                //}
            });

            this._xDataGridView.updateItems(data, 100);


            this._data_jsp.getContentPane().removeClass("initialization");
            
            this._moduleIsReady();

            break;

        case DataEvent.NEW:


            break;
        case DataEvent.UPDATED:

            break;
        case DataEvent.REMOVED:
            break;
        case DataEvent.NO_DATA:
            self._items.length = 0;
            this._xDataGridView.updateItems([], 100);

            this._moduleIsReady();

            break;
    }

}

detallePanel.prototype.armarGrilla = function () {
    var self = this;
    this.armarColumnas();
    this.traducir();

    this._proxy = $.extend({
        getScrollPosition: function (e) {
            return self._data_jsp ? {
                top: self._data_jsp.getContentPositionY(),
                left: self._data_jsp.getContentPositionX()
            } : {}
        },
        getScrollDimensions: function (e) {
            return {
                width: ScrollDimensions.WIDTH,
                height: ScrollDimensions.HEIGHT
            }
        },
        setScrollLeft: function (e, t) {
            self._data_jsp ? self._data_jsp.scrollByX(t) : e.scrollLeft(t)
        },
        setScrollTop: function (e, t) {
            self._data_jsp ? setTimeout(function () {
                self._data_jsp.scrollToY(t)
            }, 0) : e.scrollTop(t)
        }
        //gridContainerClass: "slick-mw-drag-container"
    }, this._proxy);


    this._xDataGridView.init(this.columnas, this._proxy, this._items, "id", {}, null/*groupObj*/);

    setTimeout(function() {
        self._xDataGridView.updateSize();
    }, 0);

    this.slick_viewport = this.html.find("div.slick-viewport");
    this.slick_viewport.jScrollPane({
        showArrows: true,
        contentWidth: "0px"
    });

    this._data_jsp = this.slick_viewport.data("jsp");


};

detallePanel.prototype.search = function (item) {
    this.$loaderDetalle.show();
    this._items.length = 0;
    this._xDataGridView.updateItems([], 100);
    // setTimeout(() => {
    MAE.DetalleService.searchDetalle({
        IdOrden: item.IdOrden
    });
    //}, 2000);


};

detallePanel.prototype.draw = function (item) {
    var property;
    var el;
    var formatter;
    var value_temp;

    for (property in item) {
        el = $("#headerDetalle div[" + property + "]");
        formatter = el.attr("formatter");
        if (formatter && formatter.length > 0) {
            value_temp = this.parentScope.Apply(formatter, item);
            el.html(value_temp);

        }

    }

};

detallePanel.prototype._moduleIsReady = function () {
    this.$loaderDetalle.hide();
    
};


function wekUp()
{
    var template = $("#wekUpModalTemplate").html();
    var self = this;
    this.html = $(template);
    this.dialog = new dialogModal();
    this.dialog.$modal_content_dialog.css("width", "351px");
    this.dialog.$modal_content_dialog.css("height", "253px");

    this.dialog.setContent(this.html);
    this.$close_btn = this.html.find("#close_btn");


    this.$btnContinuar = this.html.find("#btnContinuar");
    this.$btnSalir = this.html.find("#btnSalir");

    this.$btnContinuar.on("click" , function (e)
    {   
        MAE.TimeService.Stop();
        MAE.TimeService.Start();    
        self.dialog.close();

    });

    this.$btnSalir.on("click" , function (e)
    {
        MAE.TimeService.out();
    });

};



wekUp.prototype = Object.create(controlBase.prototype);
wekUp.prototype.constructor = wekUp.constructor;

wekUp.prototype.show = function () {

    this.dialog.open();

 
};

wekUp.prototype.isOpen = function()
{
 
    return this.dialog.getState();
};