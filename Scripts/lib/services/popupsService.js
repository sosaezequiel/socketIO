(function (jq) {

    var e = setTimeout;
    var _priceChangeTrack;

    function _getPopups() {
        return g_popups
    }
    function _getBackdropData() {
        return f
    }
    function _getData(e) {
        var t = popups[e];

        if (null == t) {
            t = {
                id: e,
                isShown: !1,
                backdrop: !1
            };
            popups[e] = t;
        }


        return t;
    }
    function _setIsShown(t, n, a) {
        var i = popups[t];
        if (null != i) {
            if (null == n)
                n = !i.isShown;
            else if (i.isShown === n)
                return;
            i.isShown = n,
                i.uiParams = a,
                i.backdrop && (f.counter += n ? 1 : -1,
                    f.isShown = 0 !== f.counter,
                    f.light = a && a.backdropLight),
                setTimeout(function () { }, 0, true);
        }
    }
    function acomodarzIndexPopups() {//o
        for (var e = 0, t = g_popups.length; e < t; e++) {
            g_popups[e].zindex = 1400 + 3 * e + 1;
            signalEvents.dispatch(PopupEvent.CHANGE_ORDER, {
                id: g[e].id,
                zIndex: g[e].zindex
            });
        }


    }
    function _addPopup(t, n, a, i, r, c) {
        var u = popups[t];
        if (null != u) {
            // if (!("sessionStatusException" === t || c && c.reopenWhenExist))
            //     return;
            var l = JSON.parse(JSON.stringify(r));
            if (l.popupId = t,
                JSON.stringify(u.content) === JSON.stringify(l) && JSON.stringify(u.extraData) === JSON.stringify(c))
                return;
            _removePopup(t, c && c.reopenWhenExist || !1),
                u = null
        };
        u = this.getData(t);
        null == r && (r = {});
        r.popupId = t;
        u.isShown = n === true;
        u.backdrop = a === true;
        u.template = i;
        u.priority = 0;//PopupsPriority[i] || PopupsPriorityType.STANDARD_POPUP,
        u.content = r;
        u.extraData = c;
        if (g_popups.length > 0 && u.priority < g_popups[g_popups.length - 1].priority) {

            g_popups.splice(PopupUtils.calculatePopupPosition(g_popups, u.priority), 0, u)
            acomodarzIndexPopups();
        }
        else {
            u.zindex = 1400 + 3 * g_popups.length + 1;
            g_popups.push(u);
            setTimeout(function () {
                signalEvents.dispatch(PopupEvent.CHANGE_ORDER, {
                    id: r.popupId,
                    zIndex: u.zindex
                })
            }, 100);
        }

        signalEvents.dispatch(PopupEvent.ADD, {
            popupId: u.id
        });


        if (u.backdrop && u.isShown) {
            f.counter++;
            f.isShown = true;
        }
        if (f.counter) {
            jq("[backdrop]").css({
                "z-index": PopupUtils.countZIndexForBackdrop(f.counter, g_popups)
            })
        }
    }
    function _removePopup(e, t) {
        var n = popups[e];
        if (null != n) {
            if (n.backdrop && n.isShown) {
                f.counter--;
                f.isShown = (0 !== f.counter);
            }

            var a = g_popups.indexOf(n);
            a !== -1 && g_popups.splice(a, 1);
            signalEvents.dispatch(PopupEvent.REMOVE, {
                popupId: n.id,
                immediately: t
            });

            delete popups[e];
            acomodarzIndexPopups();
            f.counter && jq("[backdrop]").css({
                "z-index": PopupUtils.countZIndexForBackdrop(f.counter, g_popups)
            });
        }
    }
    function _existPopup(e) {
        var t = popups[e];
        return null != t && g.indexOf(t) !== -1
    }
    function _movePopupUp(e) {
        if (this.existPopup(e)) {
            var t = PopupUtils.calculatePopupPosition(g_popups, popups[e].priority);
            var n = popups[e];
            g_popups.splice(g_popups.indexOf(n), 1);
            g_popups.splice(t - 1, 0, n);
            acomodarzIndexPopups();
        }
    }
    function _subscribePopupAction(e) {
        signalEvents.add(e)
    }
    function _unsubscribePopupAction(e) {
        signalEvents.remove(e)
    }
    var signalEvents = new signals.Signal; //S
    var popups = {};//p
    var g_popups = [];//g
    var f = {
        counter: 0,
        isShown: false,
        light: false
    };

    var pCtr;
    function _showInfo(item) {
        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        // pCtr = new popupsCtr("infoModal", "infoModalTemplate");
        // pCtr.show();
    };

    function onPriceChangeUpdate(e, item) {

        if (_priceChangeTrack.key === item.key) {
            _priceChangeTrack = item;//actualizo

            if ((pCtr instanceof popupsAlta))
                pCtr.draw(item);
        }

    }


    function _showTradeUpdate(item, type) {


        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        _priceChangeTrack = item;

        if (!(pCtr instanceof popupsUpdate)) {
            //MAE.MarketWatchService.addPriceChangeUpdateHandler(onPriceChangeUpdate);
            pCtr = new popupsUpdate("infoTrade", "openTradeUpdateModalTemplate", item);



        }

        pCtr.draw(_priceChangeTrack);
        pCtr.show();

    }

    function _showTrade(item) {

        if (rootScope.sessionType != SymbolSessionType.OPEN)
            return;

        _priceChangeTrack = item;

        if (!(pCtr instanceof popupsAlta)) {
            MAE.MarketWatchService.addPriceChangeUpdateHandler(onPriceChangeUpdate);
            pCtr = new popupsAlta("infoTrade", "openTradeModalTemplate", item);



        }

        pCtr.draw(_priceChangeTrack);
        pCtr.show();
    }

    function _closePopups() {
        pCtr.close();

        if (pCtr && ("dispose" in pCtr)) {
            pCtr.dispose();
            MAE.MarketWatchService.removePriceChangeUpdateHandler(onPriceChangeUpdate);
        }


    }

    rootScope.addHandle(_mercadoevent);

    function _mercadoevent(data) {
        MAE.NotifyService.notifyMarket(data.sessionType === SymbolSessionType.CLOSED);
    }


    var _popupsService = {
        getPopups: _getPopups, //t
        getBackdropData: _getBackdropData, //n
        getData: _getData,//a
        setIsShown: _setIsShown,//i
        addPopup: _addPopup,//r
        removePopup: _removePopup,//s
        existPopup: _existPopup,//c
        movePopupUp: _movePopupUp,//u
        subscribePopupAction: _subscribePopupAction,//l
        unsubscribePopupAction: _unsubscribePopupAction, //d
        showInfo: _showInfo,
        showTrade: _showTrade,
        closePopups: _closePopups,
        showTradeUpdate: _showTradeUpdate,
        mercadoevent: _mercadoevent

    };

    jq.extend(true, window, {
        MAE: {
            PopupsService: _popupsService
        }
    });
})(jQuery);