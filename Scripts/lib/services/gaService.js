/*
Dependencias : [rootScope,configService, layoutService]
*/ 

(function (jq){
    var e = rootScope;
    var n = MAE.ConfigService;


    function _init() {
        D = MAE.LayoutService;
    }
    function _startSessionAfterLogin(t, a, i) {
        _closeSession();
        var r = n.getConfigParam("NAME")
          , s = n.getConfigParam("VERSION");
        ga("set", "title", r),
        ga("set", "dimension1", t),
        ga("set", "dimension2", s),
        ga("set", "dimension3", a),
        ga("set", "dimension4", i),
        ga("set", "dimension5", e.detachMode ? "1" : "0"),
        ga("set", "dimension6", e.widgetMode ? "1" : "0"),
        ga("set", "dimension7", e.specifiedModuleId),
        ga("set", "dimension8", e.desktopMode ? "1" : "0")
    }
    function _closeSession() {}
    function r(e) {
        var t = GAPageView.MAIN_TRADING;
        switch (e) {
        case ModulesType.MAIN:
            t = GAPageView.MAIN_OTHER;
            break;
        case ModulesType.SETTINGS:
        case ModulesType.SUPPORT_MOBILE:
        case ModulesType.SUPPORT_BROWSER:
        case ModulesType.LOGIN:
        case ModulesType.SUMMARY:
        case ModulesType.STATISTICS:
            t = ""
        }
        return t
    }
    function s(e) {
        switch (e) {
        case "1":
            return GAPageView.CONTAINER_LEFT;
        case "2":
            return GAPageView.CONTAINER_RIGHT;
        case "3":
            return GAPageView.CONTAINER_BOTTOM;
        case "overlaySettings":
        case "overlayMyAccount":
        case "specifiedModule":
            return ""
        }
        return e
    }
    function c(e) {
        D = MAE.LayoutService;
        var t = D.getModuleGAPageViewPath(e);
        return t && (t[0] = s(t[0])),t
    }
    function u(e) {
        var t = ModulesConfig[e];
        return t ? [t.gaId] : [e]
    }
    function _trackPageView(e) {
        if (e) {
            var t = []
              , n = r(e);
            t.push(n);
            var a;
            switch (e) {
            case ModulesType.BASKETS:
                a = c(ModulesType.MARKET_WATCH),
                a = a.concat(u(ModulesType.BASKETS));
                break;
            default:
                a = c(e),a || (a = u(e))
            }
            t = t.concat(a);
            var i = Array.prototype.slice.call(arguments, 1);
            t = t.concat(i),
            t = d(t);
            //ga("set", "page", "/" + t.join("/")),
            //ga("send", "pageview")
        }
    }
    function d(e) {
        for (var t = 0, n = e.length; t < n; t++)
            null != e[t] && "" !== e[t] || (e.splice(t, 1),
            t--,
            n--);
        return e
    }
    function _event(e, t, n, a, i) {
        var o = e + "/" + t
          , r = {
            eventCategory: o,
            eventAction: n
        };
        null != a && (r.eventLabel = a),
        null != i && (null == r.eventLabel && (r.eventLabel = "-"),
        r.eventValue = i),
        ga("send", "event", r)
    }
    function _eventClick(e, t, n, a, i) {
        n = "click/" + n,
        _event(e, t, n, a, i)
    }
    function _eventsTicketClick(e, t, n, a) {
        if (Array.isArray(n))
            for (var i = 0, o = n.length; i < o; i++) {
                var r = void 0 !== n[i].eventValue ? n[i].eventValue : a;
                _eventClick(e, t, n[i].eventAction, n[i].eventLabel, r)
            }
    }
    function _exception(e, t) {
        _event(ModulesType.MAIN, "gaService", "exception", e, 1)
    }
    function _timingStart(e, t, n, a, i) {
        var o = e + "/" + t
          , r = o + "/" + n + (null != i ? "/" + i : "")
          , s = performance.now()
          , c = {
            timingCategory: o,
            timingVar: n,
            timingValue: s
        };
        return null != a && (c.timingLabel = a),
        h[r] = c,
        r
    }
    function _timingStop(e, t, n, a) {
        var i = e + "/" + t
          , o = i + "/" + n + (null != a ? "/" + a : "");
          _timingStopById(o)
    }
    function _timingStopById(e) {
        var t = h[e];
        null != t && (t.timingValue = Math.round(performance.now() - t.timingValue),
        h[e] = null,
        delete h[e])
    }
    function _timingFromBeginning(e, t, n, a) {
        var i = e + "/" + t
          , o = Math.round(performance.now())
          , r = {
            timingCategory: i,
            timingVar: n,
            timingValue: o
        };
        null != a && (r.timingLabel = a)
    }
    var D = null;
    h = {};
      gaService =  {
        init: _init, //a
        startSessionAfterLogin: _startSessionAfterLogin,//i
        closeSession: _closeSession, //o
        trackPageView: _trackPageView,//l
        event: _event, //S
        eventClick: _eventClick, //p
        eventsTicketClick: _eventsTicketClick,//g
        exception: _exception,//f
        timingStart: _timingStart,//m
        timingStop: _timingStop,//v
        timingStopById: _timingStopById,//b
        timingFromBeginning: _timingFromBeginning //E
    };

    jq.extend(true, window, {
        MAE: {
            GaService: gaService
        }
    });

})(jQuery);