(function (jq) {

    var e = window;
    var t = rootScope;
    var n = location;
    var i = MAE.ConfigService;
    var o = MAE.GaService;

    function _init(t) {
        E = MAE.SettingsService;
        h = "*";
        e.addEventListener("message", onmessage, false);
        c(t);
    }
    function onmessage(e) {
        var t = e.data;
        var n = t.type;
        switch (n) {
        case "setConfig":
            u(t.config);
        }
    }
    function c(t) {
        D = t;
        var n = {
            type: "getConfig"
        };
        e.parent.postMessage(n, h)
    }
    function u(e) {
        C || (l(e),
        D(),
        D = null)
    }
    function l(e) {
        C = e;
        C.accountNo = C.accountId || C.accountNo;
    }
    function _getWidgetConfig() {
        return C;
    }
    function _click(t, n, a, r) {
        var s = C.clickAction;
        t = t || C.moduleId || ModulesType.MAIN,
        n = n || "widgetService";
        var c, u = "widget";
        if ("postMessage" == s)
            c = "postMessage/" + a,
            o.eventClick(t, n, u, c),
            e.parent.postMessage({
                type: "clickFromWidget",
                widgetId: C.widgetId,
                moduleId: C.moduleId,
                target: a,
                data: r
            }, h);
        else {
            var l = C.clickUrl;
            null != l && 0 != l.length || (l = i.getConfigParam("links.widgetClickUrl")),
            c = "openUrl/" + l.substr(0, 50),
            o.eventClick(t, n, u, c),
            window.open(l, "_blank")
        }
    }
    function _load(t, n, a, i) {
        var r = C.loadAction;
        t = t || C.moduleId || ModulesType.MAIN,
        n = n || "widgetService";
        var s, c = "widget";
        "postMessage" == r && (s = "postMessage/" + a,
        o.eventClick(t, n, c, s),
        e.parent.postMessage({
            type: "loadWidget",
            widgetId: C.widgetId,
            moduleId: C.moduleId,
            target: a,
            data: i
        }, h))
    }
    function _modifySettingsUserData(e) {
        null != C.skin && (e.skin = C.skin),
        null != C.language && (e.language = C.language),
        null != C.dailyChanges && (e[SettingsTypeUser.DAILY_CHANGE_MODE] = C.dailyChanges),
        null != C.changePeriod && (e[SettingsTypeUser.CHANGE_PERIOD] = C.changePeriod)
    }
    function _modifySettingsAccountData(e) {
        var n, a, i = [];
        switch (t.specifiedModuleId) {
        case ModulesType.MARKET_WATCH:
            n = C.instruments,
            i = C.columns,
            n && n.length > 0 && ObjectUtils.setValueByPathStr(e, "marketWatch.symbols", n),
            i && i.length > 0 && ObjectUtils.setValueByPathStr(e, "marketWatch.datagridColumns", i);
            break;
        case "clickAndTrade":
            n = C.instruments,
            n && n.length > 0 && ObjectUtils.setValueByPathStr(e, "marketWatch.symbols", n);
            break;
        case ModulesType.MARKET_SENTYMENTS:
            var o = SettingsDefaultAccountData.CFD.marketSentiments;
            C.instrumentsXTB ? (n = C.instrumentsXTB,
            ObjectUtils.setValueByPathStr(e, "widgetXTB", !0)) : n = C.instruments,
            n && n.length > 0 && (n.length > 20 && (n.length = 20),
            o.symbols = n.reverse(),
            ObjectUtils.setValueByPathStr(e, ModulesType.MARKET_SENTYMENTS, o));
            break;
        case ModulesType.HEATMAP_EQUITIES:
            var r = C.industry
              , s = ["Commercial Banks", "Oil, Gas & Consumable Fuels", "Automobiles"];
            s.indexOf(r) < 0 && (r = s[0]);
            var c = SettingsDefaultAccountData.CFD.heatmapEquities;
            c.widgetSelectedIndustry = r;
            var u = "EU";
            if (u) {
                var l = HeatmapType.EQ_US;
                switch (u) {
                case "US":
                case HeatmapType.EQ_US:
                    l = HeatmapType.EQ_US;
                    break;
                case "EU":
                case HeatmapType.EQ_EU:
                    l = HeatmapType.EQ_EU
                }
                c.selectedHeatmap = l,
                ObjectUtils.setValueByPathStr(e, ModulesType.HEATMAP_EQUITIES, c)
            }
            switch (a = MovementPeriod.D1,
            C.changePeriod) {
            case 0:
                a = MovementPeriod.D1;
                break;
            case 1:
                a = MovementPeriod.W1;
                break;
            case 2:
                a = MovementPeriod.MN1
            }
            c.selectedPeriod = a,
            ObjectUtils.setValueByPathStr(e, ModulesType.HEATMAP_EQUITIES, c);
            break;
        case ModulesType.HEATMAP_FOREX:
            var d = SettingsDefaultAccountData.CFD.heatmapForex;
            switch (a = MovementPeriod.D1,
            C.changePeriod) {
            case 0:
                a = MovementPeriod.D1;
                break;
            case 1:
                a = MovementPeriod.W1;
                break;
            case 2:
                a = MovementPeriod.MN1
            }
            d.selectedPeriod = a,
            ObjectUtils.setValueByPathStr(e, ModulesType.HEATMAP_FOREX, d);
            break;
        case ModulesType.TOP_MOVERS:
            var S = SettingsDefaultAccountData.CFD.topMovers;
            if (S.filters = [1],
            C.assetClassXTB && Array.isArray(C.assetClassXTB)) {
                S.filters = [];
                var p, g;
                for (p = 0; p < C.assetClassXTB.length; p++)
                    g = C.assetClassXTB[p],
                    AssetClass[Number(g)] ? S.filters.push(Number(g)) : "string" == typeof g && AssetClass[g.toUpperCase()] && S.filters.push(AssetClass[g.toUpperCase()])
            }
            switch (a = MovementPeriod.D1,
            C.changePeriod) {
            case 0:
                a = MovementPeriod.D1;
                break;
            case 1:
                a = MovementPeriod.W1;
                break;
            case 2:
                a = MovementPeriod.MN1
            }
            S.selectedPeriod = a,
            ObjectUtils.setValueByPathStr(e, ModulesType.TOP_MOVERS, S);
            break;
        case ModulesType.CHARTS:
            ObjectUtils.setValueByPathStr(e, ModulesType.CHARTS + ".lightMode", "mini" === String(C.viewVersion));
            break;
        case ModulesType.CALENDAR_ECONOMIC:
            if ("mini" === C.viewVersion) {
                var f = SettingsDefaultAccountData.CFD.calendarEconomic;
                f.datagridColumns = [{
                    id: "time"
                }, {
                    id: "country"
                }, {
                    id: "title"
                }, {
                    id: "current"
                }, {
                    id: "forecast"
                }],
                C.width <= 330 && (f.datagridColumns = [{
                    id: "time"
                }, {
                    id: "title"
                }, {
                    id: "current"
                }, {
                    id: "forecast"
                }]),
                f.standardView = false;
                ObjectUtils.setValueByPathStr(e, ModulesType.CALENDAR, f);
            }
        }
    }
    function _modifySettingsChartTemplateUserDefault(e) {}
    function _modifySettingsChartTemplates(e) {}
    function _modifyChartTemplatesDefault(e) {}
    var E, D, h = "", C = null;




    var _widgetService = {
        init: _init,//r
        getWidgetConfig: _getWidgetConfig, //d
        click: _click,//S
        load: _load,//p
        modifySettingsUserData: _modifySettingsUserData, //g
        modifySettingsAccountData: _modifySettingsAccountData,//f
        modifySettingsChartTemplateUserDefault: _modifySettingsChartTemplateUserDefault,//m
        modifySettingsChartTemplates: _modifySettingsChartTemplates,//v
        modifyChartTemplatesDefault: _modifyChartTemplatesDefault//b
    };

    jq.extend(true, window, {
        MAE: {
            WidgetService: _widgetService
        }
    });

})(jQuery);