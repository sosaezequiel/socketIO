/*
Dependencias = [ rootScope,  logsService, socketService]
*/

(function (jq) {
    var t = rootScope; // rootScope
    var n = MAE.SocketService;// socketService
    var a = MAE.LogsService;//logsService
    var h = MAE.SessionService;

    function getsessionService() {

        h = MAE.SessionService;
        
        return h;
    }
    function _setForexApiService(e) {
        I = e
    }
    function _initSocketSubscribe() {
        n.subscribeStatus(onStatus, "apiService");
        n.subscribeOnMessage(onMessage, "apiService");
    }
    function onStatus(e, t, n, a) {//s
        switch (e) {
            case SocketStatus.CLOSED:
                close();
        }
    }
    function close() {
        var e, t, n, a, i, o;
        for (e in y) {
            clearTimeoutByName;
            t = arrayIdTimes[e];
            a = t.length;

            for (n = 0; n < a; n++) {
                i = arraytimersId[n];
                o = i.failHandler;
                if (o)
                    o.call(null, null);
            }
            delete arrayIdTimes[e];
        }
        C = 0
    }
    function onMessage(e) {//u
        var t, n, i = e.status;
        if (i == ResponseStatus.PUSH) {
            var o = e.events;
            if (!o)
                return;
            var r;
            for (t = 0, n = o.length; t < n; t++) {
                r = o[t];
                I.handlePushEvent(r);
            }


        } else {
            var s, c, u, d, p, g, f, m, v = e.response;
            if (i == ResponseStatus.SUCCESS) {
                if (s = e.reqId, null == s)
                    return void a.logWarn("apiService", "socketOnMessageHandler", "SUCCESS", "requestId is null", "message=" + JSON.stringify(e));

                clearTimeoutByName(s);
                c = arrayIdTimes[s];
                if (null == c)
                    return void a.logWarn("apiService", "socketOnMessageHandler", "SUCCESS", "requestCommands is null", "requestId=" + s);

                    
                for (u = c.length, u != v.length &&
                    (a.logWarn("apiService", "socketOnMessageHandler", "SUCCESS", "amountOfCommands is different in request and response", "requestId=" + s), u = Math.min(v.length, c.length)), t = 0; t < u; t++) {
                    d = v[t];
                    p = c[t];
                    g = d.hasOwnProperty("exception");
                    f = g ? p.failHandler : p.successHandler;
                    f ? f.call(null, d) : g && a.logWarn("apiService", "socketOnMessageHandler", "SUCCESS", "failHandler is null", "requestId=" + s);
                }
                delete arrayIdTimes[s]
            } else if (i == ResponseStatus.ERROR && (a.logWarn("apiService", "socketOnMessageHandler", "ERROR", "response=" + JSON.stringify(v)),
                m = v.request)) {
                m = v.request.replace('"', '"');
                try {
                    m = JSON.parse(m)
                } catch (e) {
                    return void a.logWarn("apiService", "socketOnMessageHandler", "ERROR", "cannot parse request", "request=" + m)
                }
                s = m.reqId
                if (null == s)
                    return void a.logWarn("apiService", "socketOnMessageHandler", "ERROR", "requestId is null", "request=" + JSON.stringify(m));

                clearTimeoutByName(s);
                c = arrayIdTimes[s];
                if (null == c)
                    return void a.logWarn("apiService", "socketOnMessageHandler", "ERROR", "requestCommands is null", "requestId=" + s);

                for (u = c.length, t = 0; t < u; t++) {
                    p = c[t];
                    f = p.failHandler;
                    if (f)
                        f.call(null, null);
                    else
                        a.logWarn("apiService", "socketOnMessageHandler", "ERROR", "failHandler is null", "requestId=" + s);
                }
                delete arrayIdTimes[s]
            }
        }
        if (!idTimerScopeApply)
            idTimerScopeApply = setTimeout(scopeApply, 250);

    }
    function scopeApply() {
        clearTimeout(A);
        idTimerScopeApply = null;
        t.apply();
    }
    function diferirLlamada(e, t, n) { //d
        if (n) {
            if (t > 0) {
                arraytimersId[e] = setTimeout(function () {
                    p.call(this, e, n);
                }, t)

            }
        }
    }
    function clearTimeoutByName(e) {//S
        var t = arraytimersId[e];

        if (t) {
            clearTimeout(t);
            delete arraytimersId[e];
        }

    }
    function p(e, t) {
        var n = arrayIdTimes[e];
        var i = arraytimersId[e];

        if (null == n || null == i)
            void a.logWarn("apiService", "requestTimeout", "request not exist", "requestId=" + e)
        else {
            a.logWarn("apiService", "requestTimeout", "requestId=" + e);
            delete arrayIdTimes[e];
            delete arraytimersId[e];
            if (t)
                t.call(null);
        }

    }
    function _sendCommand(e, req, success, fail, r, s) {
        if (!n.isConnected()) {
            a.logWarn("apiService", "sendCommand", "socketService not connected", "commandName=" + e);
            return void (fail && fail.call(null, null));
        }

        var id_time = e + "_" + (new Date).getTime() + "_" + C;
        C++;
        var u = {};
        u.reqId = c;
        u.command = [req];
        var request = new RequestCommand(id_time, success, fail);
        arrayIdTimes[id_time] = [request];
        diferirLlamada(id_time, r, s);
        n.send(u);
    }
    function _sendSessionMultiCommand(e, t, o, r, s, c) {
        var u, l;
        if (n.isConnected() && i() && h.getIsLogged()) {
            var S = "multi_" + e + "_" + (new Date).getTime() + "_" + C;
            C++;
            var p = {};
            p.reqId = S,
                p.command = t;
            var g, f = [];
            for (u = 0,
                l = t.length; u < l; u++)
                g = new RequestCommand(S, o, r),
                    f.push(g);
            arrayIdTimes[S] = f,
                d(S, s, c),
                n.send(p)
        } else if (n.isConnected() ? a.logWarn("apiService", "sendSessionMultiCommand", "socketService not connected", "commandName=" + e) : a.logWarn("apiService", "sendSessionMultiCommand", "sessionService is not logged", "commandName=" + e),
            r)
            for (u = 0,
                l = t.length; u < l; u++)
                r.call(null, null)
    }
    function _sendSessionCommand(e, req, success, fail, r, s) {


        var s = getsessionService();
        if (s) {
            if (h.getIsLogged()) {
                void _sendCommand(e, req, success, fail, r, s);


            }
            else {
                a.logWarn("apiService", "sendSessionCommand", "_sessionService is not logged", "commandName=" + e);
                void (fail && fail.call(null, null))
            }

        }

    }
    function _loginWithServiceTicket(e, t, n) {
        var a = {
            CoreAPI: {
                endpoint: "",
                logonWithServiceTicket: {
                    serviceTicket: e
                }
            }
        };
        _sendCommand("loginWithServiceTicket", a, t, n)
    }
    function _loginRestricted(e, t, n, a) {
        var i = {
            CoreAPI: {
                endpoint: "",
                logonRestricted: {
                    user: e,
                    accessCode: t
                }
            }
        };
        _sendCommand("loginRestricted", i, n, a)
    }
    function _logout() { }
    function _changePassword(e, t, n, a) {
        var i = {
            CoreAPI: {
                endpoint: "xstation5",
                changePassword: {
                    oldPassword: e,
                    newPassword: t
                }
            }
        };
        _sendSessionCommand("changePassword", i, n, a)
    }
    var h, C = 0, arrayIdTimes = {}, arraytimersId = {}, idTimerScopeApply = null, I = {
        handlePushEvent: function () { }
    };
    jq.extend(true, window, {
        MAE: {
            ApiService:
            {
                setForexApiService: _setForexApiService,//o
                initSocketSubscribe: _initSocketSubscribe,//r
                sendCommand: _sendCommand,//g
                sendSessionMultiCommand: _sendSessionMultiCommand,//f
                sendSessionCommand: _sendSessionCommand,//m
                loginWithServiceTicket: _loginWithServiceTicket,//v
                loginRestricted: _loginRestricted,//b
                logout: _logout,//E
                changePassword: _changePassword //D
            }
        }
    });

})(jQuery);