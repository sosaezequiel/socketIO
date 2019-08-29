(function (jq) {

    var e = rootScope;

    var n = MAE.ApiService;
    var a = MAE.SettingsApiService;
    var i = MAE.MaeApiService

    var r = MAE.GaService
    var s = MAE.LogsService;


    function _getUsername() {
        return X
    }
    function _getLogin() {
        return G
    }
    function _getPersonId() {
        return K.uid
    }
    function _getAccountList() {
        return q
    }
    function _getEndpointList() {
        return Q
    }
    function _getEndpointMap() {
        return j
    }
    function _hasRealAccount() {
        return $
    }
    function _getCurrentAccount() {
        return J
    }
    function _getCurrentAccountData() {
        return Y
    }
    function _subscribeStatus(e, t) {
        W.add(e, null, null, t)
    }
    function _unsubscribeStatus(e) {
        W.remove(e)
    }
    function _isSubscribed(e) {
        return W.has(e)
    }
    function D(e) {
        J = e,
            a.setAccount(e),
            i.setAccount(e)
    }
    function _setEnvironment(e) {
        z = e
    }
    function C(e) {
        if (e.element && e.element.elements && e.element.elements.length > 0) {
            var t, n = e.element.elements[0], a = J ? J.getAccountNo() : null, i = J ? J.getEndpointID() : null, o = J ? J.endpointType : null;
            try {
                switch (o) {
                    case EndpointType.CFD:
                        var r = n.value.xmt4account;
                        t = r.accountID.wtaccountid,
                            a === t.accountNo && i === t.endpointID && (Y = new XMt4Account(r)),
                            W.dispatch(SessionStatus.GET_ACCOUNT_SUCCESS)
                }
            } catch (e) {
                W.dispatch(SessionStatus.GET_ACCOUNT_FAIL)
            }
        } else
            W.dispatch(SessionStatus.GET_ACCOUNT_FAIL)
    }
    function y(e) {
        W.dispatch(SessionStatus.GET_ACCOUNT_FAIL)
    }
    function _updateCurrentAccountData() {
        i.getAccountData(C, y)
    }
    function A(e, t, n) {
        for (var a = [], i = 0, o = q.length; i < o; i++) {
            var r = q[i];
            null != e && r.getEnvironment() != e || null != t && r.getEndpointID() != t || null != n && r.getAccountNo() != n || a.push(r)
        }
        return a
    }
    function _findAllAccountsByEndpointType(e) {
        var t = [];
        return q.forEach(function (n) {
            n.endpointType === e && t.push(n)
        }),
            t
    }
    function _loginWithServiceTicket(e) {
        if (s.log("sessionApiService", "loginWithServiceTicket", "wtAccountId=" + e),
            e && (H = e),
            o.hasSt(V)) {
            var t = o.getSt(V);
            F = r.timingStart(ModulesType.MAIN, "sessionApiService", "loginWithServiceTicket"),
                n.loginWithServiceTicket(t, w, _)
        } else
            o.getStFromCAS(V, O, P)
    }
    function O(e) {
        _loginWithServiceTicket()
    }
    function _loginRestricted(e, t) {
        null != e && (H = e),
            F = r.timingStart(ModulesType.MAIN, "sessionApiService", "loginRestricted"),
            n.loginRestricted(H.accountNo, t, w, _)
    }
    function w(e) {
        e.xloginresult ? k(SessionStatus.API_LOGIN_SUCCESS, e) : P(SessionStatus.API_LOGIN_FAIL, e)
    }
    function _(e) {
        P(SessionStatus.API_LOGIN_FAIL, e)
    }
    function k(n, a) {
        s.log("sessionApiService", "loginSuccessHandler", "status=" + n);
        var i, o = a.xloginresult;
        X = o.username,
            G = o.login,
            K = o.userID,
            q = U(o.accountList),
            $ = L(q),
            Q = o.endpointList,
            j = o.endpointMap;
        var c = [];
        e.widgetMode ? (c = A(null, H.endpointID, H.accountNo),
            0 == c.length && (s.logWarn("sessionApiService", "loginSuccessHandler", "widgetMode", "matchingAccounts is empty", "by endpointID=" + H.endpointID + " and accountNo=" + H.accountNo),
                c = A(Environment.DEMO),
                0 == c.length && (s.logError("sessionApiService", "loginSuccessHandler", "widgetMode", "matchingAccounts is empty", "by environment=" + Environment.DEMO),
                    c = q))) : (H.accountNo && (c = A(null, null, H.accountNo)),
                        0 == c.length && (c = A(z, H.endpointID, H.accountNo),
                            0 == c.length && (s.log("sessionApiService", "loginSuccessHandler", "matchingAccounts is empty", "by environment=" + z + " and endpoint=" + H.endpointID + " and accountNo=" + H.accountNo),
                                c = A(z, H.endpointID),
                                0 == c.length && (s.logWarn("sessionApiService", "loginSuccessHandler", "matchingAccounts is empty", "by environment=" + z + " and endpoint=" + H.endpointID),
                                    c = A(z),
                                    0 == c.length && (s.logError("sessionApiService", "loginSuccessHandler", "matchingAccounts is empty", "by environment=" + z),
                                        c = q))))),
            i = c[0],
            D(i);
        var u = t.get("api:forexUserDataService");
        u._updateAfterLogin(o.userData),
            r.timingStopById(F),
            W.dispatch(n, a)
    }
    function U(e) {
        var t = [];
        return e.forEach(function (e, n) {
            t[n] = Account.createFromObject(e)
        }),
            t.forEach(function (e) {
                var n = e.relatedAccount;
                if (n) {
                    var a = t.find(function (e) {
                        return e.wtAccountId.endpoint_account() === n.endpoint_account()
                    });
                    a && (a.reletedAccounts.push(e),
                        e.relatedAccount = a)
                }
            }),
            t
    }
    function L(e) {
        for (var t = 0, n = e.length; t < n; t++)
            if (e[t].isRealAccount())
                return !0;
        return !1
    }
    function P(e, t) {
        s.log("sessionApiService", "loginFailHandler", "status=" + e),
            H = null,
            r.timingStopById(F),
            W.dispatch(e, t)
    }
    function _logout() {
        s.log("sessionApiService", "logout");
        n.logout();
        clearAll();
    }
    function clearAll() {
        s.log("sessionApiService", "destroySessionData"),
            H = null,
            X = null,
            G = null,
            K = null,
            q = null,
            Q = null,
            j = null,
            J = null
    }
    function __getSubscriptionStatus() {
        return W.toStringNames()
    }
    var F, W = new signals.Signal("status"), V = "xapi5", H = null, X = "", G = "", K = null, q = [], Q = [], j = null, $ = !1, J = null, Y = null, z = null;


    var _sessionApiService = {
        _getSubscriptionStatus: __getSubscriptionStatus,//x
        getUsername: _getUsername,//c
        getLogin: _getLogin, //u
        getPersonId: _getPersonId,//l
        getAccountList: _getAccountList,//d
        getEndpointList: _getEndpointList,//S
        getEndpointMap: _getEndpointMap,//p
        hasRealAccount: _hasRealAccount,//g
        getCurrentAccount: _getCurrentAccount,//f
        getCurrentAccountData: _getCurrentAccountData,//m
        setEnvironment: _setEnvironment,//h
        subscribeStatus: _subscribeStatus,//v
        unsubscribeStatus: _unsubscribeStatus,//b
        isSubscribed: _isSubscribed,//E
        findAllAccountsByEndpointType: _findAllAccountsByEndpointType,//I
        loginWithServiceTicket: _loginWithServiceTicket,//N
        loginRestricted: _loginRestricted, //R
        updateCurrentAccountData: _updateCurrentAccountData, //T
        logout: _logout //B
    };

    jq.extend(true, window, {
        MAE: {
            SessionApiService: _sessionApiService
        }
    });
})(jQuery);