/*
Dependencias : [gaService]
*/

(function (jq) {
    var t = MAE.GaService;

    function _stepAdd(e, t, n, i) {
        var o = GetObj(e, t, n, i);
        n = o.waitForIds;
        for (var r, s, c = 0, u = n.length; c < u; c++) {
            r = n[c];
            o = GetObj(r);
            s = o.nextIds;
            if (s.indexOf(e) === -1)
                s.push(e);

        }

    }
    function GetObj(e, t, n, a) {
        var i = r[e];
        return i ? i : (i = {
            id: e,
            func: t || null,
            waitForIds: n || [],
            delay: a || 0,
            nextIds: [],
            isFinished: !1,
            gaId: null
        },
            r[e] = i,
            i)
    }
    function _stepRun(n) {
        var a = r[n];
        setTimeout(function () {
            window.console.log("mainStartupService | stepRun | id=" + n + " | delay=" + a.delay + ", nextFunc=" + a.nextIds.join(",")),
                a.gaId = t.timingStart(ModulesType.MAIN, "mainStartupService", n),
                a.func.call(this)
        }, a.delay, !0)
    }
    function _stepFinish(e) {
        var n = r[e];
        n.isFinished = !0;
        t.timingStopById(n.gaId);
        for (var o, s, c, u, l, d = n.nextIds, S = d.length, p = 0; p < S; p++) {
            o = GetObj(d[p]);
            s = o.waitForIds;
            c = s.length;
            l = !0;
            for (var g = 0; g < c; g++) {
                u = GetObj(s[g]);
                if (!u.isFinished) {
                    l = !1;
                    g = c;
                }
            }
            if (l)
            _stepRun(o.id);
        }
    }
    var r = {};
    _mainStartupService = {
        stepAdd: _stepAdd, //n
        stepRun: _stepRun,//i
        stepFinish: _stepFinish //o
    }


    jq.extend(true, window, {
        MAE: {
            MainStartupService: _mainStartupService
        }
    });

})(jQuery);