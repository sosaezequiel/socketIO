
(function (jq) {
    var e = window;
    var t = rootScope;
    var i = MAE.ConfigService;
    var I = MAE.LogsService;
    var N = MAE.SettingsService;
    var O = MAE.SessionService;
    var R = MAE.LayoutService;

    function _isInDetachMode() {
        return t.detachMode
    }
    function onMessage(e) {
        var t = e.origin || e.originalEvent.origin;
        if (t === targetOrigin) {
            var n = e.data;
            var a = n.type;
            switch (a) {
                case "call":
                    applyFnc(n.id, n.args);
                    break;
                case _ + "link":
                    C(e.source);
                    break;
                case k + "link":
                    v(n.moduleId);
                    break;
                case k + "attach":
                    E(n.moduleId, e.source, n.windowData);
                    break;
                case _ + "close":
                    T()
            }
        }
    }
    function _callHandlerAdd(e, t) {
        null == B[e] && (B[e] = t)
    }
    function _callHandlerRemove(e) {
        delete B[e]
    }
    function _callHandlerArgsSet(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        null == M[e] && (M[e] = t)
    }
    function _callHandlerArgsGet(e) {
        return null == M[e] ? [] : M[e]
    }
    function _callHandlerArgsRemove(e) {
        delete M[e]
    }
    function _callSend(e) {
        var n, a; 
        var i = Array.prototype.slice.call(arguments, 1);
        var o = {
            type: "call",
            id: e,
            args: i
        };
        for (a in L)
            L[a].postMessage(o, targetOrigin),
                n = !0;
        !n && t.detachMode && (V[V.length] = o)
    }
    function applyFnc(id, args) {//p
        var fnc = B[id];
        null != fnc && fnc.apply(this, args)
    }
    function g(e) {
        var t = {};
        return t.x = e.screenLeft ? e.screenLeft : e.screenX ? e.screenX : 0,
            t.y = e.screenTop ? e.screenTop : e.screenY ? e.screenY : 0,
            t.width = e.innerWidth,
            t.height = e.innerHeight,
            t
    }
    function f() {
        null == x && (x = setInterval(m, 1e3))
    }
    function m() {
        var e = {
            type: _ + "link"
        };
        for (var t in F)
            F[t].postMessage(e, targetOrigin)
    }
    function v(e) {
        null != F[e] && (delete F[e],
            W-- ,
            I.log("detachService", "main_link", "moduleId=" + e),
            0 == W && (clearInterval(x),
                x = null))
    }
    function _main_moduleDetach(a, o, s) {
        if (!N)
            N = MAE.SettingsService;

        if (t.detachMode || t.widgetMode)
            return !1;
        if (null != L[a])
            return !1;
        0 == P && e.addEventListener("message", onMessage, !1);
        var c = 0
            , u = 0
            , l = N.getCommonValue(SettingsTypeCommon.DETACH) || {}
            , d = l[a];
        if (d)
            c = d.x,
                u = d.y,
                o = d.width,
                s = d.height;
        else {
            var S = void 0 != window.screenLeft ? window.screenLeft : screen.left
                , p = void 0 != window.screenTop ? window.screenTop : screen.top
                , g = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
                , m = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            c = .5 * (g - o) + S,
                u = .5 * (m - s) + p
        }
        var v = "";
        if ("file" === window.location.protocol)
            CookieUtils.readCookie("CASTGC", function (t) {
                var i = n.$$absUrl
                    , r = i.indexOf("#");
                i = i.slice(0, r),
                    v = e.open(i + "#/?detach=" + a + "&tgt=" + t, "detach." + a, "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=0,width=" + o + ",height=" + s + ",top=" + u + ",left=" + c),
                    L[a] = v,
                    P++ ,
                    0 == W && f(),
                    F[a] = v,
                    W++ ,
                    I.log("detachService", "main_moduleDetach", "moduleId=" + a)
            });
        else {
            var b = i.getConfigParam("APP_URL") + "?detach=" + a;
            v = e.open(b, "detach." + a, "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=0,width=" + o + ",height=" + s + ",top=" + u + ",left=" + c);
            L[a] = v;
            P++;
            if (0 == W)
                f();
            F[a] = v;
            W++;
            I.log("detachService", "main_moduleDetach", "moduleId=" + a);
        }
        return !0
    }
    function E(t, n, a) {
        if (L[t] == n) {
            delete L[t],
                P--;
            var i = N.getCommonValue(SettingsTypeCommon.DETACH) || {};
            i[t] = a,
                N.setCommonValue(SettingsTypeCommon.DETACH, i),
                R.attachModule(t),
                0 == P && e.removeEventListener("message", onMessage, false),
                I.log("detachService", "main_moduleAttach", "moduleId=" + t)
        }
    }
    function _main_allModulesClose() {
        if (!t.detachMode) {
            var n, a, i, o = {
                type: _ + "close",
                moduleId: t.specifiedModuleId
            }, s = N.getCommonValue(SettingsTypeCommon.DETACH) || {};
            for (n in L)
                a = L[n],
                    delete L[n],
                    i = g(a),
                    s[n] = i,
                    a.postMessage(o, targetOrigin),
                    R.attachModule(n);
            N.setCommonValue(SettingsTypeCommon.DETACH, s),
                P > 0 && e.removeEventListener("message", r, !1),
                P = 0
        }
    }
    function h() {
        for (var e = 0; e < V.length; e++) {
            var t, n = V[e];
            for (t in L)
                L[t].postMessage(n, targetOrigin)
        }
        V = []
    }
    function C(e) {//C
        L[w] = e;
        var n = {
            type: k + "link",
            moduleId: t.specifiedModuleId
        };
        e.postMessage(n, targetOrigin);
        h();
    }
    function _detach_moduleAttach() {
        if (!t.detachMode || null == L[w])
            return !1;
        var n = g(e)
            , a = {
                type: k + "attach",
                moduleId: t.specifiedModuleId,
                windowData: n
            };
        L[w].postMessage(a, targetOrigin)
    }
    function T() {
        O.logout(!0, !1),
            e.close()
    }
    function _init() {
        I = MAE.LogsService;
        N = MAE.SettingsService;
        //O = MAE.SessionService;
        R = MAE.LayoutService;
        targetOrigin = location.protocol + "//" + location.host;

        if (t.detachMode) {
            e.addEventListener("message", onMessage, false);
            var i = location.search.detachDoClose;
            if ("true" == i)
                e.close()
            else
                location.search.detachDoClose = "true";
        }
    }
    var I, N, O, R, w = "MAIN", _ = "2D_", k = "2M_", targetOrigin = "", L = {}, P = 0, B = {}, M = {}, x = null, F = {}, W = 0, V = [];
    var _detachService = {
        init: _init, // A
        main_moduleDetach: _main_moduleDetach, //b
        main_allModulesClose: _main_allModulesClose,//D
        detach_moduleAttach: _detach_moduleAttach, //y
        callHandlerAdd: _callHandlerAdd, //s
        callHandlerRemove: _callHandlerRemove, //c
        callHandlerArgsSet: _callHandlerArgsSet,//u
        callHandlerArgsGet: _callHandlerArgsGet, //l
        callHandlerArgsRemove: _callHandlerArgsRemove,//d
        callSend: _callSend, //S
        isInDetachMode: _isInDetachMode //o
    };

    jq.extend(true, window, {
        MAE: {
            DetachService: _detachService
        }
    });

})(jQuery);