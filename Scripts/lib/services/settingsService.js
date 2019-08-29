/*
Dependencias = [ settingsApiService,localStorageService ]
*/

(function (jq) {

    var t = MAE.SettingsApiService;
    var c = MAE.LocalStorageService;
    var o = MAE.LogsService;
    var r = MAE.DetachService;
    var e = rootScope;

    function _getCommonValue(e) {
        if (isLocalStorage) {
            var t = c.getItem(e);
            if (t)
                try {
                    t = JSON.parse(t)
                } catch (e) {
                    t = null
                }
            return t
        }
        return null
    }
    function _setCommonValue(e, t) {
        if(isLocalStorage)
        {
            if(null != t)
            {
                t = JSON.stringify(t);
                c.setItem(e, t);

            }
            else
            {
                c.removeItem(e)
            }
            

        }
    }
    function _removeCommonValue(e) {
        isLocalStorage && c.removeItem(e)
    }
    function S() {
        return n.getPersonId()
    }
    function _loadUserData() {
        if (rootScope.detachMode)
            return void g();
        if (isLocalStorage) {
            var n = S();
            var a = c.getItem(n);
            if (null != a)
                try {
                    _userData = JSON.parse(a)
                } catch (e) {
                    o.logWarn("settingsService", "loadUserData", "local", "error", e);
                    _userData = {};
                }
        }
        var i = _userData.timestamp ? _userData.timestamp : 0;
        se("loadUserData");
        t.getUserData(i, function (t) {
            if (t && t.hasOwnProperty("str")) {
                _userData = t.str;
                o.log("settingsService | getUserData | success");
                userDataSignal.dispatch(true);
            }
            else {
                o.log("settingsService", "getUserData", "success", "no data");
                ye = true;
                if (e.widgetMode) {
                    s.modifySettingsUserData(_userData);
                    userDataSignal.dispatch(true);
                    ce("loadUserData");
                }

            }
        }, function (e) {
            ye = true;
            o.logWarn("settingsService", "getUserData", "failure", JSON.stringify(e));
            userDataSignal.dispatch(false);
            ce("loadUserData");
        });
    }
    function g() {
        r.callHandlerAdd("settingsService.receiveUserDataFromMain", m),
            r.callSend("settingsService.sendUserDataToDetach");
    }
    function _sendUserDataToDetach() {
        r.callSend("settingsService.receiveUserDataFromMain", _userData);
    }
    function m(e) {
        r.callHandlerRemove("settingsService.receiveUserDataFromMain");
        _userData = e;
        ye = true;
        userDataSignal.dispatch(true);
    }
    function _loadUserDataAddHandler(e, t) {
        userDataSignal.add(e, null, null, t)
    }
    function _loadUserDataRemoveHandler(e) {
        userDataSignal.remove(e)
    }
    function _isUserDataLoaded() {
        return ye
    }
    function D(t, n, a) {
        rootScope.detachMode || rootScope.widgetMode || (null != t && null != n && (Ae[t] = oe(n)),
            0 !== Ie && clearTimeout(Ie),
            a ? C() : (Ie = setTimeout(C, fe),
                h()))
    }
    function h() {
        if (isLocalStorage) {
            var e = S();
            null != _userData ? c.setItem(e, JSON.stringify(_userData)) : c.removeItem(e)
        }
    }
    function C() {
        Ie = 0;
        var e = Object.keys(Ae).length;
        if (0 !== e) {
            var n = JSON.parse(JSON.stringify(Ae));
            se("saveUserDataServer"),
                t.setUserData(n, function (e) {
                    e && e.hasOwnProperty("long") ? _userData.timestamp = e.long : (_userData.timestamp = 0,
                        o.log("settingsService", "saveUserDataOnServer", "success | no data")),
                        h(),
                        ce("saveUserDataServer")
                }, function (e) {
                    ce("saveUserDataServer")
                }),
                Ae = {}
        }
    }
    function _getUserValue(e) {
        var t = e.split(".");
        if (0 === t.length)
            return null;
        t = ie(t);
        var n = t.pop();
            var a = ObjectUtils.getFinalObjByPathArr(_userData, t, !0);
        if (null == a[n]) {
            var i = ObjectUtils.getFinalObjByPathArr(SettingsDefaultUserData, t, !1);
            try {
                i = JSON.parse(JSON.stringify(i[n]))
            } catch (e) {
                return null
            }
            a[n] = i
        }
        a = a[n];
        intercambiaPropiedad(a);
        return a;
    }
    function _setUserValue(e, t, n, a) {
        var i = e.split(".");
        if (0 !== i.length) {
            i = ie(i);
            var o = i.join(".")
                , s = i.pop()
                , c = ObjectUtils.getFinalObjByPathArr(_userData, i, !0);
            if (c[s] != t || "object" == typeof t) {
                c[s] = t;
                D(o, t, n);
                var u = userValueSignals[e];
                if (u)
                    u.dispatch(t);

                if(!a)    
                  r.callSend("settingsService.setUserValue", e, t, n, !0)
            }
        }
    }
    function _setUserValueAddHandler(e, t) {
        var n = userValueSignals[e];
        if (!n) {
            n = new signals.Signal;
            userValueSignals[e] = n;
            n.add(t)
        }

    }
    function _setUserValueRemoveHandler(e, t) {
        var n = userValueSignals[e];
        if (n)
            n.remove(t);
    }
    function N() {
        return n.getPersonId() + "/" + n.getCurrentAccount().wtAccountId.endpoint_account()
    }
    function _loadAccountData(a) {
        if (rootScope.detachMode)
            return void R();
        if (isLocalStorage) {
            var n = N();
            var a = c.getItem(n);

            if (null != a)
                try {
                    Oe = JSON.parse(a)
                } catch (e) {
                    o.logWarn("settingsService", "loadAccountData", "local", "error", e),
                        Oe = {}
                }
        }
        var i = Oe.timestamp ? Oe.timestamp : 0;
        se("loadAccountData");
        t.getAccountData(i, function (t) {
            if (t) {
                if (t.hasOwnProperty("str")) {
                    Oe = JSON.parse(t.str);
                    if (e.widgetMode) {
                        s.modifySettingsAccountData(Oe);
                        Re = true;
                        accountDataSignal.dispatch(true);
                        ce("loadAccountData");
                    }
                }

            }
        }, function (e) {
            Re = true;
            accountDataSignal.dispatch(false);
            ce("loadAccountData");
        });
    }
    function R() {
        r.callHandlerAdd("settingsService.receiveAccountDataFromMain", _),
            r.callSend("settingsService.sendAccountDataToDetach")
    }
    function _sendAccountDataToDetach() {
        r.callSend("settingsService.receiveAccountDataFromMain", Oe)
    }
    function _(e) {
        r.callHandlerRemove("settingsService.receiveAccountDataFromMain"),
            Oe = e,
            Re = !0,
            accountDataSignal.dispatch(!0)
    }
    function _loadAccountDataAddHandler(e, t) {
        accountDataSignal.add(e, null, null, t)
    }
    function _loadAccountDataRemoveHandler(e) {
        accountDataSignal.remove(e)
    }
    function _isAccountDataLoaded() {
        return Re
    }
    function P(t, n, a) {
        rootScope.detachMode || rootScope.widgetMode || (null != t && null != n && _e.push({
            path: t,
            value: n
        }),
            0 !== ke && (clearTimeout(ke),
                Ue++),
            Ue >= ve && (a = !0,
                Ue = 0,
                clearTimeout(ke)),
            a ? H() : (ke = setTimeout(H, fe),
                M()))
    }
    function B(n) {
        rootScope.detachMode || rootScope.widgetMode || null === n || (0 !== ke && clearTimeout(ke),
            Ue = 0,
            H(),
            se("removeAccountData"),
            t.removeAccountData(n, function (e) {
                e && e.hasOwnProperty("long") ? Oe.timestamp = e.long : Oe.timestamp = 0,
                    ce("removeAccountData")
            }, function (e) {
                o.logWarn("settingsService", "removeAccountDataServer", "failure", JSON.stringify(e), "path of data to remove: " + n),
                    ce("removeAccountData")
            }))
    }
    function M() {
        if (isLocalStorage) {
            var e = N();
            if ("/" === e)
                return;
            null != Oe ? c.setItem(e, JSON.stringify(Oe)) : c.removeItem(e)
        }
    }
    function x(e, t) {
        for (var n = t.split("."), a = "", i = 0; i < n.length; i++)
            if (a += (0 !== i ? "." : "") + n[i],
                e[a])
                return a;
        return !1
    }
    function F(e, t, n) {
        if (t.length > 0) {
            var a = t[0];
            t.splice(0, 1),
                e[a] = F(e[a], t, n)
        } else
            e = oe(n);
        return e
    }
    function W(e, t, n) {
        var a = t.split(".");
        if (1 === a.length) {
            var i = new RegExp("^" + t + "\\..*$", "i");
            for (var o in e)
                i.test(o) && delete e[o];
            e[t] = oe(n)
        } else {
            var r = x(e, t);
            if (r) {
                var s = t.substr(r.length, t.length)
                    , c = s.split(".");
                c.length > 0 && !c[0] && c.splice(0, 1),
                    e[r] = F(e[r], c, n)
            } else
                e[t] = oe(n)
        }
    }
    function V() {
        var e = {}
            , t = [];
        t = t.concat(_e),
            _e.length = 0;
        for (var n = 0; 0 !== t.length;) {
            var a = t[n].path
                , i = t[n].value;
            W(e, a, i),
                t.splice(n, 1)
        }
        return e
    }
    function H() {
        ke = 0;
        var e = V()
            , n = Object.keys(e).length;
        if (0 !== n) {
            var a = JSON.parse(JSON.stringify(e));
            se("saveAccountDataServer"),
                MAE.SettingsApiService.setAccountData(a, function (e) {
                    e && e.hasOwnProperty("long") ? Oe.timestamp = e.long : Oe.timestamp = 0,
                        ce("saveAccountDataServer")
                }, function (e) {
                    o.logWarn("settingsService", "saveAccountDataServer", "failure", JSON.stringify(e), "group of data to save: ", Object.keys(a).join(",")),
                        ce("saveAccountDataServer")
                }),
                M(),
                _e = []
        }
    }
    function _getAccountValue(e) {
        var Oe = {}
        var t = e.split(".");
        if (0 === t.length)
            return null;
        // t = ie(t);
        var a = t.pop();
        i = ObjectUtils.getFinalObjByPathArr(Oe, t, !0);
        if (null == i[a]) {
            var o = ObjectUtils.getFinalObjByPathArr(SettingsDefaultAccountData["MAE"], t, !1);
            try {
                o = JSON.parse(JSON.stringify(o[a]))
            } catch (e) {
                return null
            }
            i[a] = o
        }
        i = i[a];
        intercambiaPropiedad(i);
        return i;

    }
    function _getModuleValue(e, t) {//G
        return _getAccountValue(e + "." + t)
    }
    function _setAccountValue(e, t, n, a) {
        var i = e.split(".");
        if (0 !== i.length) {
            i = ie(i);
            var o = i.join(".")
                , s = i.pop()
                , c = ObjectUtils.getFinalObjByPathArr(Oe, i, !0);
            if (c[s] !== t || "object" == typeof t) {
                c[s] = t,
                    P(o, t, n);
                var u = Le[e];
                u && u.dispatch(t),
                    a;//|| r.callSend("settingsService.setAccountValue", e, t, n, !0)
            }
        }
    }
    function _removeAccountValue(e, t) {
        var n = e.split(".");
        if (0 !== n.length) {
            n = ie(n);
            var a = n.join(".")
                , i = n.pop()
                , o = ObjectUtils.getFinalObjByPathArr(Oe, n, !0);
            delete o[i],
                B(a);
            var s = Pe[e];
            s && s.dispatch(),
                t || r.callSend("settingsService.removeAccountValue", e, !0)
        }
    }
    function _setModuleValue(e, t, n, a, i) {
        _setAccountValue(e + "." + t, n, a, i)
    }
    function _removeModuleValue(e, t, n) {
        _removeAccountValue(e + "." + t, n)
    }
    function _setAccountValueAddHandler(e, t) {
        var n = Le[e];
        n || (n = new signals.Signal,
            Le[e] = n),
            n.add(t)
    }
    function _removeAccountValueAddhandler(e, t) {
        var n = Pe[e];
        n || (n = new signals.Signal,
            Pe[e] = n),
            n.add(t)
    }
    function _setModuleValueAddHandler(e, t, n) {
        _setAccountValueAddHandler(e + "." + t, n)
    }
    function _setAccountValueRemoveHandler(e, t) {
        var n = Le[e];
        n && n.remove(t)
    }
    function _removeAccountValueRemoveHandler(e, t) {
        var n = Pe[e];
        n && n.remove(t)
    }
    function _setModuleValueRemoveHandler(e, t, n) {
        _setAccountValueRemoveHandler(e + "." + t, n)
    }
    function _getSkinCurrent() {
        return Be
    }
    function _getSkinCurrentFromSetting() {
        return Be = _getUserValue(SettingsTypeUser.SKIN)
    }
    function _setSkinCurrent(e) {
        Be = e,
            _setUserValue(SettingsTypeUser.SKIN, e)
    }
    function ie(e) {
        return e[0] === me && (e[0] = a.getEnvironment()),
            e
    }
    function oe(e) {
        var t, n = [];
        for (var a in e)
            a.indexOf(".") > -1 && n.push(a);
        if (n.length > 0) {
            t = JSON.parse(JSON.stringify(e));
            for (var i = /\./g, o = n.length - 1; o > -1; o--)
                a = n[o].replace(i, ge),
                    t[a] = t[n[o]],
                    delete t[n[o]];
            return t
        }
        return e
    }
    function intercambiaPropiedad(e) { //re
        if ("object" == typeof e) {
            var t = [];
            for (var n in e)
                n.indexOf(ge) > -1 && t.push(n);
            if (t.length > 0)
                for (var a = new RegExp(ge, "g"), i = t.length - 1; i > -1; i--)
                    n = t[i].replace(a, "."),
                        e[n] = e[t[i]],
                        delete e[t[i]]
        }
        return e
    }
    function se(e) {
        De++
    }
    function ce(e) {
        De--;
        if (0 === De && pe) {
            pe();
            pe = null;
        }


    }
    function _isLocked() {
        return 0 !== Ie || 0 !== ke || 0 !== De
    }
    function _saveAll(t) {
        return rootScope.detachMode ? void t() : (clearTimeout(Ie),
            C(),
            clearTimeout(ke),
            H(),
            void (_isLocked() ? pe = t : t()))
    }
    function _restoreDefault() {
        _setUserValue(SettingsTypeUser.MARKET_WATCH_CATEGORY, SymbolCategories.FAVORITES)
    }
    function _init() {
        r.callHandlerAdd("settingsService.setUserValue", _setUserValue);
        r.callHandlerAdd("settingsService.setAccountValue", _setAccountValue);
        r.callHandlerAdd("settingsService.removeAccountValue", _removeAccountValue);

        if (!rootScope.detachMode) {
            r.callHandlerAdd("settingsService.sendUserDataToDetach", _sendUserDataToDetach);
            r.callHandlerAdd("settingsService.sendAccountDataToDetach", _sendAccountDataToDetach)
        }
        Ee = true;

    }
    var pe, ge = "@!@",
        fe = 5e3,
        me = "{env}",
        ve = 20,
        isLocalStorage = !1,
        Ee = !1,
        De = 0,
        userSession = {},//he
        _userData = {},//Ce
        ye = !1,
        userDataSignal = new signals.Signal,//Te
        Ae = {},
        Ie = 0,
        userValueSignals = {},//Ne
        Oe = {},
        Re = !1,
        accountDataSignal = new signals.Signal, //we
        _e = [],
        ke = 0,
        Ue = 0,
        Le = {},
        Pe = {},
        Be = (new signals.Signal, new signals.Signal, new signals.Signal, new signals.Signal, null),
        _getSessionValue = function (e) {
            return userSession[e]
        },
        _setSessionValue = function (e, t) {
            userSession[e] = t
        },
        _removeSessionValue = function (e) {
            userSession[e] = null;
            delete userSession[e];
        };
    isLocalStorage = /*c.isLocalStorageAvailable(),*/ rootScope.widgetMode && (isLocalStorage = false);


    jq.extend(true, window, {
        MAE: {
            SettingsService:
            {
                init: _init,//Se
                saveAll: _saveAll,//le
                restoreDefault: _restoreDefault,//de
                isLocked: _isLocked,//ue
                getSessionValue: _getSessionValue,//Me
                setSessionValue: _setSessionValue,//xe
                removeSessionValue: _removeSessionValue,//Fe
                getCommonValue: _getCommonValue,//u
                setCommonValue: _setCommonValue,//l
                removeCommonValue: _removeCommonValue,//d
                isUserDataLoaded: _isUserDataLoaded,//E
                loadUserDataAddHandler: _loadUserDataAddHandler,//v
                loadUserDataRemoveHandler: _loadUserDataRemoveHandler,//b
                loadUserData: _loadUserData,//p
                getUserValue: _getUserValue,//y
                setUserValue: _setUserValue,//T
                setUserValueAddHandler: _setUserValueAddHandler,//A
                setUserValueRemoveHandler: _setUserValueRemoveHandler,//I
                isAccountDataLoaded: _isAccountDataLoaded,//L
                loadAccountDataAddHandler: _loadAccountDataAddHandler,//k
                loadAccountDataRemoveHandler: _loadAccountDataRemoveHandler,//U
                loadAccountData: _loadAccountData,//O
                getAccountValue: _getAccountValue,//X
                setAccountValue: _setAccountValue,//K
                setAccountValueAddHandler: _setAccountValueAddHandler,//$
                setAccountValueRemoveHandler: _setAccountValueRemoveHandler,//z
                removeAccountValueRemoveHandler: _removeAccountValueRemoveHandler,//Z
                getModuleValue: _getModuleValue,//G
                setModuleValue: _setModuleValue,//Q
                removeModuleValue: _removeModuleValue,//j
                setModuleValueAddHandler: _setModuleValueAddHandler,//Y
                removeAccountValueAddhandler: _removeAccountValueAddhandler,//J
                setModuleValueRemoveHandler: _setModuleValueRemoveHandler,//ee
                getSkinCurrent: _getSkinCurrent,//te
                getSkinCurrentFromSetting: _getSkinCurrentFromSetting,//ne
                setSkinCurrent: _setSkinCurrent //ae
            }
        }
    });
})(jQuery)