ObjectUtils = {
    getFinalObjByPathArr: function (e, t, r) {
        for (var n, i, a = 0, o = t.length; a < o; a++) {
            n = t[a];
            i = e[n];
            if (null == i) {
                if (!r)
                    return null;
                e[n] = {},
                    i = e[n]
            }
            e = i;
        }
        return e
    },
    getFinalObjByPathStr: function (e, t, r) {
        var n = t.split(".");
        if (0 == n.length)
            return null;


        return this.getFinalObjByPathArr(e, n, r);
    },
    setValueByPathStr: function (e, t, r) {
        if (null != r) {
            var n = t.split(".");
            if (0 == n.length)
                return;
            var i = n.pop()
                , a = this.getFinalObjByPathArr(e, n, !0);
            a[i] = r
        }
    },
    getDiffObj: function (e, t) {
        var r = {};
        for (var n in e)
            r[n] = e[n] != t[n];
        return r
    },
    deleteKeyByPathArr: function (e, t) {
        for (var r, n, i = 0, a = t.length; i < a; i++) {
            if (r = t[i],
                n = e,
                !e.hasOwnProperty(r))
                return !1;
            e = e[r]
        }
        return null !== n && "undefined" != typeof n && delete n[r]
    },
    deleteKeyByPathStr: function (e, t) {
        var r = t.split(".");
        return 0 == r.length ? null : this.deleteKeyByPathArr(e, r)
    }
};


StringUtils = {
    trim11: function (e) {
        e = e.replace(/^\s+/, "");
        for (var t = e.length - 1; t >= 0; t--)
            if (/\S/.test(e.charAt(t))) {
                e = e.substring(0, t + 1);
                break
            }
        return e
    },
    stripTags: function (e) {
        return e ? e.replace(/<(?:.|\n)*?>/gm, "") : ""
    },
    _SNAKE_CASE_REGEXP: /[A-Z]/g,
    snakeCase: function (e, t) {
        return t = t || "-",
            e.replace(this._SNAKE_CASE_REGEXP, function (e, r) {
                return (r ? t : "") + e.toLowerCase()
            })
    }
};

var SettingsUtils = {};
SettingsUtils.notExtendableAccountSettingsKeys = ["layout", "layoutContainers", "favoriteSymbols.datagridColumns", "marketWatch.datagridColumns", "openTrades.datagridColumns", "pendingTrades.datagridColumns", "closedPositions.datagridColumns", "cashOperations.datagridColumns", "calendar.datagridColumns", "screener.datagridColumns", "fundSelector.datagridColumns", "topMovers.filters", "marketSentiments.symbols", "marketSentiments.selection", "notificationsHistoryFilter"],
    SettingsUtils.notSupportedAccountSettingsKeys = [],
    SettingsUtils.notExtendableUserSettingsKeys = [],
    SettingsUtils.notSupportedUserSettingsKeys = ["chart"],
    SettingsUtils.applyDefaultAccountSettingsFromFile = function (e, t) {
        SettingsUtils.applyDefaultSettingsFromFile(e, t, SettingsUtils.notExtendableAccountSettingsKeys, SettingsUtils.notSupportedAccountSettingsKeys)
    }
    ,
    SettingsUtils.applyDefaultUserSettingsFromFile = function (e, t) {
        SettingsUtils.applyDefaultSettingsFromFile(e, t, SettingsUtils.notExtendableUserSettingsKeys, SettingsUtils.notSupportedUserSettingsKeys)
    }
    ,
    SettingsUtils.applyDefaultSettingsFromFile = function (e, t, r, n) {
        for (var i, a = 0; a < n.length; a++)
            i = n[a],
                ObjectUtils.deleteKeyByPathStr(t, i);
        if (jQuery.extend(!0, e, t), r)
            for (var o = 0; o < r.length; o++) {
                i = r[o];
                var s = ObjectUtils.getFinalObjByPathStr(t, i, !1);
                null !== s && ObjectUtils.setValueByPathStr(e, i, s)
            }
    };


var FormatDateTimeUtils = {
    formatTimeHMM: function (e) {
        if (e.getTime() > 0) {
            var t = e.getMinutes();
            return e.getHours() + ":" + (t > 9 ? t : "0" + t)
        }
        return ""
    },
    formatTimeHHMMSS: function (e) {
        if (e.getTime() > 0) {
            var t = e.getHours()
                , r = e.getMinutes()
                , n = e.getSeconds();
            return (t > 9 ? t : "0" + t) + ":" + (r > 9 ? r : "0" + r) + ":" + (n > 9 ? n : "0" + n)
        }
        return ""
    },
    formatDateDDMMY: function (e) {
        if (e.getTime() > 0) {
            var t = e.getMonth() + 1
                , r = e.getDate();
            return (r > 9 ? r : "0" + r) + "-" + (t > 9 ? t : "0" + t) + "-" + e.getFullYear()
        }
        return ""
    },
    formatDateDMY: function (e, t) {
        return e.getTime() > 0 ? (t = t || "-",
            e.getDate() + t + (e.getMonth() + 1) + t + e.getFullYear()) : ""
    },
    formatFullDate: function (e, t) {
        return t || (t = " "),
            FormatDateTimeUtils.formatDateDDMMY(e) + t + FormatDateTimeUtils.formatTimeHHMMSS(e)
    }
}
    , FormatUtils = {
        roundToFixed: function (e, t) {
            var r = Math.pow(10, t);
            return (Math.round(e * r) / r).toFixed(t)
        },
        numberFormat: function (e, t) {
            var r = ForexCalculationUtils.calculatePowerValue(t);
            return Math.round(e * r) / r
        },
        stringNumberWithoutSpace: function (e) {
            return "string" == typeof e ? e.replace(/ /g, "") : e
        },
        formatMoney: function (e, t, r, n) {
            t = isNaN(t = Math.abs(t)) ? 2 : t,
                r = r || " ",
                n = n || ".";
            var i = e
                , a = i < 0 ? "-" : ""
                , o = parseInt(i = Math.abs(+i || 0).toFixed(t), 10) + ""
                , s = (s = o.length) > 3 ? s % 3 : 0;
            return a + (s ? o.substr(0, s) + r : "") + o.substr(s).replace(/(\d{3})(?=\d)/g, "$1" + r) + (t ? n + Math.abs(i - o).toFixed(t).slice(2) : "");
        },
        formatPrice: function (e, t, r, n) {
            t = isNaN(t = Math.abs(t)) ? 2 : t;
            var r = r || "";
            n = n || ".";
            var i = e;
            var a = i < 0 ? "-" : "";
            var o = parseInt(i = Math.abs(+i || 0).toFixed(t), 10) + "";
            var s = (s = o.length) > 3 ? s % 3 : 0;
            return a + (s ? o.substr(0, s) + r : "") + o.substr(s).replace(/(\d{3})(?=\d)/g, "$1" + r) + (t ? n + Math.abs(i - o).toFixed(t).slice(2) : "");
        },
        formatPriceSupportedE: function (e, t) {
            return t = "undefined" !== typeof t ? t : 2,
                new Intl.NumberFormat(["en", "bin"], {
                    style: "decimal",
                    maximumFractionDigits: t,
                    minimumFractionDigits: t
                }).format(e).replace(/,/g, "");
        },
        dividePrice: function (e, t, r) {
            var n, i, a, o = this.formatPrice(e, t);
            !r || 3 != t && 5 != t ? a = null : (a = o.substr(o.length - 1),
                o = o.substr(0, o.length - 1));
            var s = 2;
            return 1 == t && --s,
                i = o.substr(o.length - s, s),
                n = o.substr(0, o.length - s),
                [n, i, a];
        },
        formatSimpleVolume: function (e) {
            return FormatUtils.formatPrice(e, 2);
        },
        formatVolume: function (e, t) {
            return t < 1e3 ? FormatUtils.formatSimpleVolume(t) : '<span title="' + FormatUtils.formatSimpleVolume(t) + '">' + LongNumberUtils.getShortRepresentation(e, t, 2) + "</span>";
        },
        formatThousandSeparator: function (e, digits = 3) {
            if (!isNaN(e) && e !== 0) {
                return Number(e).toLocaleString(AppContext.LanguageTag, { maximumFractionDigits: digits, minimumFractionDigits: digits });
            } else {
                return "-";
            }
        },
        removeThousandSeparator: function (e) {
            return e.replace(/[^\d-]/g, '');
        }
    }
    , LongNumberUtils = function () {
        function obtener_mensaje_corto(e) {//e
            return {
                1: "",
                1e3: " " + e.getFrequentString("UNIT_NUMBERS.K"),
                1e6: " " + e.getFrequentString("UNIT_NUMBERS.MN"),
                1e9: " " + e.getFrequentString("UNIT_NUMBERS.BN"),
                1e12: " " + e.getFrequentString("UNIT_NUMBERS.TN")
            };
        }
        function armar_mascara(e) { //t

            var t, r = true, n = 3, a = 9, o = 1, s = Math.pow(10, n);

            for (; r || n > a;) {
                if (Math.floor(e / s) <= 0) {
                    r = false;
                    t = Math.round(e / o);
                    if (o > 1) {
                        t = FormatUtils.formatPrice(Math.round(e / (o / 100)) / 100, 2);
                    }

                    return t + i[o];

                }
                o = s;
                n += 3;
                s = Math.pow(10, n);
            }

            s = Math.pow(10, a);

            if (o > 1)
                t = FormatUtils.formatPrice(Math.round(e / (s / 100)) / 100, 2);
            else
                t = Math.round(e / s);

            return t + i[s];

        }
        function _getShortRepresentation(r, a, o) {//r
            if ("undefined" == typeof a || isNaN(a) || null === a)
                return "-";
            var s = "";//r.getLanguage();
            if (n !== s) {
                i = obtener_mensaje_corto(r);
                n = s;
            }
            return armar_mascara(a);
        }
        var n = null;
        var i = null;
        return {
            getShortRepresentation: _getShortRepresentation
        }
    }()
    , NumberUtils = {
        multiplyAndRound: function (e, t) {
            return Math.round(e * t)
        },
        multiplyAndRound100: function (e) {
            return NumberUtils.multiplyAndRound(e, 100)
        }
    };

function ArrayUtils() { }


ArrayUtils.findNearestIndex = function (e, t, r, n) {
    if (r > n)
        return n;
    var i = Math.floor((r + n) / 2);
    if (e[i] == t)
        return i;
    if (i > 0 && i < e.length - 1 && e[i - 1] < t && e[i + 1] > t) {
        if (e[i] == t)
            return i;
        var a, o = i, s = Math.abs(e[i] - t);
        return a = Math.abs(e[i - 1] - t),
            s > a && (s = a,
                o = i - 1),
            a = Math.abs(e[i + 1] - t),
            s > a && (o = i + 1),
            o
    }
    return e[i] > t ? ArrayUtils.findNearestIndex(e, t, r, i - 1) : ArrayUtils.findNearestIndex(e, t, i + 1, n)
}
    ,
    ArrayUtils.removeNotExistingItems = function (e, t, r) {
        var n, i, a, o, s, l, u, c = [], p = e.getKey(), f = e.getCollection();
        for (n = 0,
            o = f.length; n < o; n++) {
            for (s = f[n],
                u = !1,
                i = 0,
                a = t.length; i < a; i++)
                if (l = r(t[i]),
                    s[p] == r(t[i])) {
                    u = !0;
                    break
                }
            u || c.push(s)
        }
        for (n = 0,
            o = c.length; n < o; n++)
            e.removeItem(c[n]);
        return c
    }
    ,
    ArrayUtils.getUniqueItemsFast = function (e, t) {
        for (var r = {}, n = [], i = 0, a = 0, o = e.length; a < o; a++) {
            var s = e[a]
                , l = s[t];
            1 !== r[l] && (r[l] = 1,
                n[i++] = s)
        }
        return n
    }
    ;
var DateUtils = {
    getLastSundayInMonthUTC: function (e, t) {
        var r = 1
            , n = new Date(Date.UTC(t, e, r, 0, 0, 0, 0));
        6 !== n.getDay() && (r = r + 6 - n.getDay());
        for (var i = ""; n.getUTCMonth() === e;)
            i = r,
                r += 7,
                n = new Date(Date.UTC(t, e, r, 0, 0, 0, 0));
        return new Date(Date.UTC(t, e, i, 1, 0, 0, 0))
    },
    getPolandTimezone: function () {
        var e = new Date
            , t = new Date(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds())
            , r = DateUtils.getLastSundayInMonthUTC(2, e.getUTCFullYear())
            , n = DateUtils.getLastSundayInMonthUTC(9, e.getUTCFullYear());
        return r.getTime() <= t.getTime() && t.getTime() <= n.getTime() ? "UTC+2" : "UTC+1"
    },
    setMidnight: function (e) {
        return e.setHours(0),
            e.setMinutes(0),
            e.setSeconds(0),
            e.setMilliseconds(0),
            e
    },
    setEndDay: function (e) {
        return e.setHours(23),
            e.setMinutes(59),
            e.setSeconds(59),
            e.setMilliseconds(999),
            e
    },
    roundTimestampToMidnight: function (e) {
        var t = new Date(e);
        return DateUtils.setMidnight(t),
            t.getTime()
    },
    getRoundedDate: function (e, t) {
        var r = new Date(e)
            , n = new Date(r.getFullYear(), r.getMonth(), r.getDate(), t ? 23 : 0, t ? 59 : 0, t ? 59 : 0);
        return n
    }
}
    , ImageUtils = {
        convertImageToBase64: function (e, t, r) {
            var n = new Image;
            n.crossOrigin = "anonymous",
                n.onload = function () {
                    var e, n = document.createElement("CANVAS"), i = n.getContext("2d");
                    n.height = this.height,
                        n.width = this.width,
                        i.drawImage(this, 0, 0),
                        e = n.toDataURL(r),
                        t(e)
                }
                ,
                n.src = e
        }
    };

var MapWithSignals = function () {
    function e(e, t) {
        a[e] || (a[e] = new signals.Signal),
            a[e].add(t)
    }
    function t(e, t) {
        a[e] && (a[e].remove(t),
            0 === a[e].getNumListeners() && (a[e] = null,
                delete a[e]))
    }
    function r(e) {
        a[e] && a[e].dispatch.apply(null, Array.prototype.slice.call(arguments, 1))
    }
    function n() {
        return Object.keys(a).length
    }
    function i() {
        return Object.keys(a)
    }
    var a = {};
    return {
        addSubscribtion: e,
        removeSubscribtion: t,
        dispatch: r,
        signalsCount: n,
        getKeysList: i
    }
};

function SymbolKeyUtils() { };
SymbolKeyUtils.prepareSymbolKey = function (e, t, r) {
    return r + "_" + e + "_" + t
};

SymbolKeyUtils.getAssetClassFromKey = function (e) {
    var t = e.split("_");
    return 2 == t.length ? Number(e.substring(e.lastIndexOf("_") + 1)) : t.length > 2 ? Number(t[0]) : null
};

SymbolKeyUtils.getSymbolNameFromKey = function (e) {
    var t = e.split("_");
    return t.length <= 2 ? t[0] : e.substring(e.indexOf("_") + 1, e.lastIndexOf("_"))
};

SymbolKeyUtils.getQuoteIdFromKey = function (e) {
    var t = e.split("_");
    return t.length >= 3 ? e.substring(e.lastIndexOf("_") + 1) : void 0
};

SymbolKeyUtils.prepareTickKey = function (e, t, r) {
    return SymbolKeyUtils.prepareSymbolKey(e, t, r)
};

SymbolKeyUtils.getSymbolNameFromTickKey = function (e) {
    return SymbolKeyUtils.getSymbolNameFromKey(e)
};

SymbolKeyUtils.getTickKeyFromSymbolKey = function (e) {
    return e
};

SymbolKeyUtils.getTickKeysFromSymbolKeys = function (e) {
    return e.concat()
};

SymbolKeyUtils.prepareMarketSentimentKey = function (e, t, r) {
    return t + "_" + e + "_" + r
};

SymbolKeyUtils.getMarketSentimentKeyFromSymbolKeyAndSentiment = function (e, t) {
    return SymbolKeyUtils.prepareMarketSentimentKey(SymbolKeyUtils.getSymbolNameFromKey(e), SymbolKeyUtils.getAssetClassFromKey(e), t)
};



function wathc_property(obj, property, func) {
    Object.defineProperty(obj, property, {
        get: function (val) {

        },

        set: function (val) {
            func(val);
        }
    })

};

var PopupUtils = {
    offset: 50,
    getDefaultDragableProperties: function () {
        return {
            containment: "#containment-wrapper",
            scroll: !0
        }
    },
    getNoLimitDragableProperties: function (e, t) {
        return {
            scroll: !1,
            drag: function (r, n) {
                var i = t()
                    , a = e();
                n.position.top < -a + PopupUtils.offset ? r.preventDefault() : n.position.top > $("#containment-wrapper").height() - PopupUtils.offset && r.preventDefault(),
                    n.position.left < -i + PopupUtils.offset ? r.preventDefault() : n.position.left > $("#containment-wrapper").width() - PopupUtils.offset && r.preventDefault()
            }
        }
    },
    getMaxZIndex: function () {
        var e, t, r, n = 0, i = $(".draggable");
        for (e = 0,
            t = i.length; e < t; e++)
            r = parseInt($(i[e]).css("z-index")),
                r > n && (n = r);
        return n
    },
    checkPopupIsVisible: function (e, t, r, n) {
        var i = $(window).width()
            , a = $(window).height()
            , o = e + n
            , s = t + r;
        return (0 < e && e < a || 0 < o && o < a) && (0 < t && t < i || 0 < s && s < i)
    },
    calculatePopupPosition: function (e, t) {
        for (var r = e.length; r > 0 && e[r - 1].priority > t;)
            r--;
        return r
    },
    countZIndexForBackdrop: function (e, t) {
        var r = 1400
            , n = t[t.length - 1].priority;
        if (e)
            for (var i = t.length - 1; i >= 0; i--)
                if (t[i].backdrop && t[i].isShown) {
                    if (t[i].priority < n)
                        return r;
                    r = 1400 + 3 * i
                }
        return 1400
    },
    countZIndexForValidInfo: function (e) {
        var t = e.filter(function (e) {
            return e.priority === PopupsPriorityType.STANDARD_POPUP
        }).length;
        return 1400 + 3 * (t - 1) + 2
    },
    centerPopup: function (e) {
        var t = e.outerWidth()
            , r = e.outerHeight()
            , n = window.innerHeight
            , i = window.innerWidth
            , a = parseInt(i / 2 + 1) - parseInt(t / 2 + 1)
            , o = parseInt(n / 2 + 1) - parseInt(r / 2 + 1);
        o = o < 0 ? 0 : o,
            o + r > n && (o = Math.max(0, n - r)),
            e.css({
                left: a + "px",
                top: o + "px",
                height: r
            })
    }
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
};


var TradeUtils = {
    getTradeTypeLabel: function (e, t) {
        switch (t) {
            case 0:
                return e ? "Sell" : "Buy";
            case 1:
                return e ? "Sell limit" : "Buy limit";
            case 2:
                return e ? "Sell stop" : "Buy stop";
        }
    },
    getTradeTypeTranslationKey: function (e, t) {
        var r = "";
        switch (t = Number(t),
        e = Boolean(Number(e)),
        t) {
            case 0:
                r = e ? "SELL" : "BUY";
                break;
            case 1:
                r = e ? "SELL_LIMIT" : "BUY_LIMIT";
                break;
            case 2:
                r = e ? "SELL_STOP" : "BUY_STOP";
        }
        return r;
    },
    getTradeTypeTranslatedLabel: function (traductor, side, tradeType) {
        var n = "";
        tradeType = Number(tradeType);
        //side = Boolean(Number(side));
        switch (tradeType) {
            case 0:
                n = side == OrderType.BID ? "BUY" : "SELL";
                break;
            case 1:
                n = side ? "SELL_LIMIT" : "BUY_LIMIT";
                break;
            case 2:
                n = side ? "SELL_STOP" : "BUY_STOP"
        }
        return n ? traductor.getFrequentString("TRADE_TYPES." + n) : "";
    },
    getOrderTypeTranslationLabel: function (e, t, r, n) {
        var i = ""
            , a = 2 === t;
        switch (r) {
            case 2:
                i = a ? "SELL_LIMIT" : "BUY_LIMIT";
                break;
            case 1:
                i = n > 0 ? a ? "SELL_STOP" : "BUY_STOP" : a ? "SELL" : "BUY"
        }
        return i ? e.getFrequentString("TRADE_TYPES." + i) : ""
    },
    getOrderSideTranslationLabel: function (e, t) {
        var r = "";
        switch (t) {
            case 2:
                r = "SELL";
                break;
            case 1:
                r = "BUY";
                break;
            default:
                return ""
        }
        return r ? e.getFrequentString("TRADE_TYPES." + r) : ""
    },
    isConfirmationRequired: function (e) {
        var t;
        if (Array.isArray(e)) {
            for (var r = 0, n = e.length; r < n; r++)
                if (t = e[r].assetClass,
                    t == AssetClass.EQ || t == AssetClass.STK || t == AssetClass.ETF || t == AssetClass.STC)
                    return !0
        } else if (e.hasOwnProperty("idAssetClass") ? t = e.idAssetClass : e.hasOwnProperty("assetClass") && (t = e.assetClass),
            t == AssetClass.EQ || t == AssetClass.STK || t == AssetClass.ETF || t == AssetClass.STC)
            return !0;
        return !1
    }
};


var ForexCalculationUtils = {
    _pipsPrecisionValues: [1, .1, .01, .001, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10],
    _10Pow: [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10],
    calculatePipsValue: function (e) {
        return ForexCalculationUtils._pipsPrecisionValues[e]
    },
    calculatePowerValue: function (e) {
        if (e >= 0) {
            if ("undefined" != typeof ForexCalculationUtils._10Pow[e])
                return ForexCalculationUtils._10Pow[e]
        } else if ("undefined" != typeof ForexCalculationUtils._pipsPrecisionValues[-e])
            return ForexCalculationUtils._pipsPrecisionValues[-e];
        return Math.pow(10, e)
    },
    calculateTradeProfitInPips: function (e, t) {
        return (e.closePrice - e.openPrice) / ForexCalculationUtils.calculatePipsValue(t) * (e.side == TradeSide.BUY ? 1 : -1)
    },
    getSymbolPipsPrecision: function (e) {
        return Math.max(e.precision - e.pipsPrecision, 0)
    },
    getSpread: function (e, t, r, n) {
        var i = (t - e) * ForexCalculationUtils._10Pow[r];
        return FormatUtils.numberFormat(i, n)
    },
    getSpreadTableVWAP: function (e, t, r, n) {
        var i = (t - e) * ForexCalculationUtils._10Pow[r];
        return FormatUtils.numberFormat(i, n)
    },
    checkPrecision: function (e, t) {
        var r = e;
        if (r) {
            if ("string" != typeof r && (r = r.toString()),
                new RegExp(".+e.+").test(r) && (r = new Intl.NumberFormat(["en", "bin"], {
                    style: "decimal",
                    maximumFractionDigits: StepperExtrema.MAX_LENGTH,
                    minimumFractionDigits: t
                }).format(r).replace(/,/g, "")),
                r = r.split("."),
                2 === r.length && r[1].length > t)
                return !1;
            if (r.length > 2)
                return !1
        }
        return !0
    },
    roundPrice: function (e, t, r, n) {
        var i = ForexCalculationUtils.calculatePipsValue(e.precision)
            , a = -1;
        if (n && n.steps)
            for (var o, s = n.steps, l = s.length - 1; l >= 0; l--)
                if (o = s[l],
                    t >= o.fromStepValue) {
                    a = l,
                        i = o.step;
                    break
                }
        var u = t
            , c = t;
        "string" == typeof c && (c = StepperUtils.repareStringNumberForCalculation(c, e.precision));
        var p = ForexCalculationUtils.calculatePowerValue(e.precision)
            , f = c;
        f = StepperUtils.makeStrongValidPrecision(c, e.precision, r);
        var d, m = Math.round(f * p), h = Math.round(i * p);
        if (i && 0 != Math.round(m % Math.round(i * p))) {
            var g;
            if (1 === n.steps.length)
                return d = StepperUtils.round(m / h, r),
                    Math.round(d * h) / p;
            if (a - 1 >= 0 && m == Math.round(n.steps[a].fromStepValue * p) && 0 == Math.round(m % (n.steps[a - 1].step * p)))
                return m / p;
            d = StepperUtils.round(m / h, r),
                g = Math.round(d * h);
            var S, y, T, b, v;
            if (a - 1 >= 0) {
                S = Math.round(n.steps[a].fromStepValue * p);
                var U = Math.round(n.steps[a - 1].step * p);
                if (g < S)
                    return d = Math.ceil(m / h),
                        T = d * h,
                        S % U == 0 || S % h == 0 ? b = S : (d = Math.floor(S / U),
                            b = d * U),
                        r ? (v = [T],
                            b > S && b > m && v.push(b)) : v = r === !1 ? [b] : [T, b],
                        g = StepperUtils.getCloserValueInteger(m, v, r),
                        g / p;
                if (Math.abs(S - m) <= h)
                    return d = Math.ceil(m / h),
                        T = d * h,
                        a + 1 < n.steps.length && T > Math.round(n.steps[a + 1].fromStepValue * p) && (y = Math.round(n.steps[a + 1].step * p),
                            d = Math.ceil(Math.round(n.steps[a + 1].fromStepValue * p) / y),
                            T = d * y),
                        S % U == 0 || S % h == 0 ? b = S : (d = Math.floor(S / U),
                            b = d * U),
                        r ? (v = [g, T],
                            b > S && b > m && v.push(b)) : v = r === !1 ? [g, b] : [g, T, b],
                        g = StepperUtils.getCloserValueInteger(m, v, r),
                        g / p
            }
            if (a + 1 < n.steps.length) {
                if (S = Math.round(n.steps[a + 1].fromStepValue * p),
                    y = Math.round(n.steps[a + 1].step * p),
                    S < g)
                    return d = Math.floor(S / h),
                        b = d * h,
                        S % y == 0 || S % h == 0 ? T = S : (d = Math.ceil(m / y),
                            T = d * y,
                            T < S && (d = Math.ceil(S / y),
                                T = d * y)),
                        r ? (v = [T],
                            b >= S && v.push(b)) : r === !1 ? (v = [],
                                b < m && v.push(b)) : v = [T, b],
                        g = StepperUtils.getCloserValueInteger(m, v, r),
                        g / p;
                if (Math.abs(S - m) <= h)
                    return d = Math.floor(S / h),
                        b = d * h,
                        S % y == 0 || S % h == 0 ? T = S : (d = Math.ceil(m / y),
                            T = d * y),
                        r === !1 ? (v = [g],
                            b < m && v.push(b)) : (v = [g],
                                T >= S && v.push(T),
                                b >= S && v.push(b)),
                        g = StepperUtils.getCloserValueInteger(m, v, r),
                        g / p
            }
            return g / p
        }
        return c !== f && (u = f),
            u
    },
    getCorrectStepRuleForPrecision: function (e, t) {
        var r = new XStepRule(e);
        if (!t && 0 !== t)
            return r;
        for (var n = r.steps.length - 1; n >= 0; n--)
            ForexCalculationUtils.checkPrecision(r.steps[n].step, t) || r.steps.splice(n, 1);
        if (r.steps.length <= 0)
            r.steps.push(new XStep({
                fromStepValue: 0,
                step: ForexCalculationUtils.calculatePowerValue(-t)
            }));
        else if (0 !== r.steps[0].fromStepValue) {
            var i = ForexCalculationUtils.calculatePowerValue(-t);
            r.steps[0].step !== i ? r.steps.push(new XStep({
                fromStepValue: 0,
                step: ForexCalculationUtils.calculatePowerValue(-t)
            })) : r.steps[0].fromStepValue = 0
        }
        return r.sort(),
            r
    },
    checkStepRuleIsCorrectForPrecision: function (e, t) {
        if (!t && 0 !== t)
            return !0;
        for (var r = new XStepRule(e), n = r.steps.length - 1; n >= 0; n--)
            if (!ForexCalculationUtils.checkPrecision(r.steps[n].step, t))
                return !1;
        return !0
    },
    directionRoundForLevelPrice: function (e, t) {
        var r = !0;
        return e == TradeInputType.SL ? t == TradeSide.BUY && (r = !1) : e == TradeInputType.TP && t == TradeSide.SELL && (r = !1),
            r
    },
    roundTradeSLTPPrice: function (e, t, r, n, i) {
        var a = ForexCalculationUtils.directionRoundForLevelPrice(r, n);
        return ForexCalculationUtils.roundPrice(e, t, a, i)
    },
    roundSlTpPrice: function (e, t, r, n) {
        var i = ForexCalculationUtils.getCorrectStepRuleForPrecision(e.stepRule, e.symbol.precision);
        return Number(ForexCalculationUtils.roundTradeSLTPPrice(e.symbol, t, r, n, i))
    },
    getPipStopsLevelValue: function (e) {
        return e.stopsLevel / ForexCalculationUtils._10Pow[e.precision - e.pipsPrecision]
    },
    calculatePriceFromTrailing: function (e, t, r, n) {
        return t == TradeSide.BUY ? e - r * n : e + r * n
    },
    convertOffsetToTrailingValue: function (e, t) {
        return FormatUtils.numberFormat(e / ForexCalculationUtils.calculatePowerValue(t), t)
    },
    convertTrailingValueToOffset: function (e, t) {
        return Math.round(e * ForexCalculationUtils.calculatePowerValue(t))
    },
    calculatePriceFromPips: function (e, t, r, n) {
        var i;
        return i = n == TradeSide.SELL ? e - r * t : e + r * t
    },
    calculatePipsFromLevelPrice: function (e, t, r, n) {
        var i;
        return i = n == TradeSide.SELL ? (-parseFloat(e) + t) / r : (parseFloat(e) - t) / r,
            i === -0 && (i = Math.abs(i)),
            i
    },
    calculateValidatedSltpInstantValue: function (e, t, r) {
        var n, i = ForexCalculationUtils.calculatePowerValue(e.symbol.precision), a = e.symbol.stopsLevel;
        return t == TradeSide.BUY ? n = r == TradeInputType.SL ? (e.tick.bid * i - a) / i : (e.tick.bid * i + a) / i : t == TradeSide.SELL && (n = r == TradeInputType.SL ? (e.tick.ask * i + a) / i : (e.tick.ask * i - a) / i),
            n
    },
    calculateValidatedSltpPendingValue: function (e, t, r, n) {
        var i, a = ForexCalculationUtils.calculatePowerValue(e.symbol.precision), o = e.symbol.stopsLevel;
        return t == TradeSide.BUY ? i = r == TradeInputType.SL ? (n * a - o) / a : (n * a + o) / a : t == TradeSide.SELL && (i = r == TradeInputType.SL ? (n * a + o) / a : (n * a - o) / a),
            i
    },
    calculatePriceChangeInPipsFromPercent: function (e, t, r) {
        return e * t * .01 / ForexCalculationUtils._pipsPrecisionValues[r]
    },
    calculatePipsPriceChange: function (e, t) {
        return e / ForexCalculationUtils._pipsPrecisionValues[t]
    },
    repareExtremaForStep: function (e, t, r, n) {
        var i = ForexCalculationUtils.calculatePowerValue(n)
            , a = Math.round(r * i)
            , o = Math.round(e * i)
            , s = Math.round(t * i);
        return 0 === a && (a = Math.round(ForexCalculationUtils.calculatePowerValue(-n) * i)),
            o > 0 && o < a ? o = a : 0 !== Math.abs(o % a) && (o = Math.ceil(o / a) * a),
            s % a !== 0 && (s = Math.floor(s / a) * a),
            {
                min: o / i,
                max: s / i,
                step: a / i
            }
    },
    repareValueForStep: function (e, t, r) {
        if (0 !== t) {
            var n = ForexCalculationUtils.calculatePowerValue(r)
                , i = e
                , a = Math.round(t * n);
            if (0 === a)
                return 0;
            var o = e * n
                , s = o;
            if (o % 1 !== 0 && (s = Math.round(e * n),
                i = s / n),
                0 !== Math.abs(s % a)) {
                var l = Math.round(s / a);
                i = l * a / n
            }
            return i
        }
        return 0
    }
};

