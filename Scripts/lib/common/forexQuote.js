function ForexQuote(key, symbolGroup, symbol, tick, groupSettings, stepRule) {
    this.key = key;//e
    this.symbol = symbol;//i
    this.symbolGroup = symbolGroup;//t
    this.tick = tick;//s
    this.groupSettings = groupSettings;//a
    this.stepRule = stepRule;//o
    this.spreadTable = 0;
    this.bidVWAP = 0;
    this.askVWAP = 0;
    this.spreadTableVWAP = 0;
    this.sessionType = 1;
    if (symbol) {

    this.name = symbol.name ? symbol.name : null;
        this.idAssetClass = symbol.idAssetClass ? symbol.idAssetClass : null;
        this.quoteId = symbol.quoteId ? symbol.quoteId : null;
        this.sessionType = symbol.sessionType ? symbol.sessionType : 1;
    }

    this.favoriteGroup = null;
};


ForexQuote.prototype.setSymbol = function (e) {
    this.symbol = e;
        this.name = e.name;
        this.idAssetClass = e.idAssetClass;
        this.quoteId = e.quoteId;
        this.sessionType = e.sessionType;
};

ForexQuote.prototype.setTick = function (e) {
    this.tick = e
};

ForexQuote.prototype.setGroupSettings = function (e) {
    this.groupSettings = e
};

ForexQuote.prototype.setStepRule = function (e) {
    this.stepRule = e
};

ForexQuote.prototype.update = function (e) { };

ForexQuote.prototype.setVWAPPrices = function (e, t, i, s, a) {
    this.bidVWAP = e;
        this.askVWAP = t;
        this.spreadTableVWAP = i;
        this.bidInsufficientLiquidity = s;
        this.askInsufficientLiquidity = a;
};

ForexQuote.prototype.setFavoriteGroup = function (e) {
    this.favoriteGroup = e || null
};