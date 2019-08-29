(function (jq){

    var t = rootScope;

    function _init() {
        if (!t.widgetMode) {
            p = MAE.SettingsService;
            g = MAE.ConfigService;
            b = p.getUserValue(SettingsTypeUser.SHOW_PROFIT_ON_TAB);
            p.loadUserDataAddHandler(o);
            p.setUserValueAddHandler(SettingsTypeUser.SHOW_PROFIT_ON_TAB, o);
            g.isConfigLoaded() ? r() : g.addConfigLoadedHandler(r);
            //var e = a.get("api:sessionApiService");
            //D = e.getCurrentAccount().getCurrency()
        }
    }
    function o() {
        b = p.getUserValue(SettingsTypeUser.SHOW_PROFIT_ON_TAB),
        _setTitle()
    }
    function r() {

        if(g.getConfigParam("WL"))
        {
            h = g.getConfigParam("WL.TITLE");
            _setTitle();
            g.removeConfigLoadedHandler(r);
            g = null;
        }


    }
    function _setTitle(e) {
        var t = "";
        null != e && (0 != e ? (E = e > 0 ? "+" : "",
        E += FormatUtils.formatMoney(e) + " ",
        E += D + " ") : E = ""),
        b && (t += E),
        t += h,
        document.title = t
    }
    function c(t, n) {
        for (; m.length < t; )
            m.push(f);
        m[t] = n || f;
        var a = "/" + m.join("/");
        a != v && (v = a,
        e.path(v),
        e.replace())
    }
    function _setPathItemEnvironment(e) {
        c(0, e)
    }
    function _setPathItemMain(e) {
        c(1, e)
    }
    function _setPathItemPopup(e) {
        c(2, e)
    }
    function _reload(e, t) {
        if (1 == e)
            if (null != t) {
                var a = window.location.protocol + "//" + window.location.host + window.location.pathname;
                if (t.length > 0) {
                    for (var i = null, o = 0, r = t.length; o < r; o++) {
                        var s = t[o];
                        Array.isArray(s) && (s = s.join("=")),
                        i = null === i ? "?" + s : i + "&" + s
                    }
                    null !== i && i.length > 1 && (a += i)
                }
                window.location.href = a
            } else
                window.location.reload();
        else
            n(function() {
                _reload(!0, t)
            }, 0)
    }
    var p, g, f = "_", m = [], v = "/", b = !0, E = "", D = "", h = "Ordenes MAE";

    var _pageService = {
        init: _init, //i
        setTitle: _setTitle, //s
        setPathItemEnvironment: _setPathItemEnvironment,//u
        setPathItemMain: _setPathItemMain, //l
        setPathItemPopup: _setPathItemPopup, //d
        reload:  _reload//S

    };

    jq.extend(true, window, {
        MAE: {
            PageService: _pageService

        }
    });
})(jQuery);