/*
Dependencias : [rootScope, configService,]
*/

(function (jq) {

    var t = rootScope;
    var i = MAE.ConfigService;
    var a = MAE.DetachService;

    function _init() {
        if (!a)
            a = MAE.DetachService;

        if (t.detachMode) {
            void (N = " [DETACH]")
        }
        else {
            if (!t.widgetMode) {
                lifeTime = i.getConfigParam("logs.lifeTime")
                if (!lifeTime)
                lifeTime = 21;

                lifeTime = 1000 * lifeTime * 60 * 60 * 24;
                /*Crea la DB de logs*/
                D = new Dexie("LogDB", {
                    autoOpen: false
                });
                D.version(1).stores({
                    logs: ", createTS, createDate, userId, accountNo"
                });
                D.open();
                a.callHandlerAdd("logsService.appendLog", appendLog);
            }
        }

        return t.detachMode ? void (N = " [DETACH]") : void (t.widgetMode || (lifeTime = i.getConfigParam("logs.lifeTime") || 21,
        lifeTime = 1000 * lifeTime * 60 * 60 * 24,
            D = new Dexie("LogDB", {
                autoOpen: false
            }),
            D.version(1).stores({
                logs: ", createTS, createDate, userId, accountNo"
            }),
            D.open(),
            a.callHandlerAdd("logsService.appendLog", appendLog)))
    }
    function _logsCreateNew(_personId, _accountNo) {

        if (!t.detachMode && !t.widgetMode) {
            var _date = new Date;//a
            var _time = _date.getTime();//i
            var o = _date.toLocaleDateString();
            personId = personId;
            accountNo = _accountNo;
            logKey = o + "/" + personId + "/" + accountNo;
            deletCreateTS();
            var r = D.logs.where(":id").equals(logKey);
            r.count(function (e) {

                if (0 == e) {
                    objLog = {
                        createTS: _time,
                        createDate: o,
                        userId: personId,
                        accountNo: accountNo,
                        data: null
                    };
                    dataLog = "--- ID: " + logKey + " ---\n--- USER AGENT: " + window.navigator.userAgent + " ---\n" + makeKey(_date) + dataLog;
                    flagLogCreado = true;
                    putLog();
                }
                else {
                    r.first(function (e) {
                        objLog = e;
                        dataLog = objLog.data + makeKey(_date) + dataLog;
                        flagLogCreado = true;
                        putLog();
                    });
                }
            })
        }
    }
    function makeKey(time) {///s
        return "--- NEW LOG SESSION | " + time.toISOString() + " | " + time.getTimezoneOffset() + " | APP " + i.getConfigParam("VERSION") + " ---\n";
    }
    function deletCreateTS() { //c
        if (!t.detachMode && !t.widgetMode) {
            var e = Date.now() - lifeTime;
            var n = D.logs.where("createTS").belowOrEqual(e);

            n.and(function (e) {
                return e.userId == personId && e.accountNo == accountNo
            })
            n.count(function (e) { });
            n.delete();
        }
    }
    function putLog() {//u
        if (flagLogCreado) {
            objLog.data = dataLog;
            D.logs.put(objLog, logKey);
        }

    }
    function _logsClose() {
        t.detachMode || t.widgetMode || (h = !1,
            null != D && D.close())
    }
    function appendLog(e) {
        if (t.detachMode)
            void a.callSend("logsService.appendLog", e);
        else {
            if (!t.widgetMode) {
                dataLog += e;
                putLog();
            }
        }

    }
    function _log() {
        var e = Date.now() + N + " | " + Array.prototype.join.call(arguments, " | ") + "\n";
        appendLog(e)
    }
    function _logWarn() {
        var e = Date.now() + " [!]" + N + " | " + N + Array.prototype.join.call(arguments, " | ") + "\n";
        window.console.warn("logsService | logWarn | " + e),
        appendLog(e)
    }
    function _logError() {
        var e = Array.prototype.slice.call(arguments);
        var t = Date.now() + " [!]" + N + " | " + N + e.join(" | ") + "\n";
        window.console.error("logsService | logError | " + t),
        appendLog(t)
    }
    function _logClick() {
        var e = Date.now() + " [CLICK] | " + Array.prototype.join.call(arguments, " | ") + "\n";
        appendLog(e)
    }
    function _logSubscription() {
        var e = Array.prototype.slice.call(arguments);
        var t = (new Date).toLocaleTimeString() + " [SUBSCRIPTION] | \n";
        0 == e.length && (e = ["SessionService", "SessionApiService", "SocketService", "LayoutService"]);
        for (var a, i, o = 0, r = e.length; o < r; o++)
        {
            a = e[o];
            i = MAE[a];
            if( null != i)
            {
                t += i.hasOwnProperty("_getSubscriptionStatus") ? "\t" + a + " | " + i._getSubscriptionStatus() + "\n" : "\t" + a + " | _getSubscriptionStatus function not implemented\n";
            }

        }
 
        window.console.log("logsService | logSubscription | " + t)
    }
    function _getLogs(e, n, a) {
        (t.detachMode || t.widgetMode) && e.call(null, null);
        var i = Date.now();
        n || (n = i - E),
            a || (a = i),
            D.logs.where("createTS").between(n, a).and(function (e) {
                return e.userId == personId && e.accountNo == accountNo
            }).toArray(function (t) {
                e.call(null, t)
            })
    }
    function _getLogsLifeTime() {
        return lifeTime;
    }
    var lifeTime, D, flagLogCreado = false, objLog = null, personId = null, accountNo = null, dataLog = "", logKey = "", N = "";


    jq.extend(true, window, {
        MAE: {
            LogsService:
            {
                init: _init,//o
                logsCreateNew: _logsCreateNew, //r
                logsClose: _logsClose, //l
                log: _log, //S
                logWarn: _logWarn, //p
                logError: _logError, //g
                logClick: _logClick, //f
                logSubscription: _logSubscription, //m
                getLogs: _getLogs, //v
                getLogsLifeTime: _getLogsLifeTime //b
            }
        }
    });
})(jQuery);