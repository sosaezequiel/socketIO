/**
 * Dependencias : [MainStartupService, settingsService]
 * 
 */
(function (jq) {



    var a = rootScope;


    //var l = MAE.SessionApiService;
    var _initSignal = new signals.Signal;



    window.addEventListener("beforeunload", function (e) {
        var N = MAE.DetachService;

        if (a.detachMode)
            N.detach_moduleAttach();
        // else if (!a.desktopMode)
        //     if (s.getIsLogged()) {
        //         var t = c.isLocked() || u.isLocked() || S.isLocked();
        //         if (k.event(ModulesType.MAIN, "mainController", "beforeunload", t === !0 ? "settingsIsLocked" : null),
        //         s.logout(!t, !1),
        //         t) {
        //             var o = "Your settings are still being saved. If you close the window now, they may not be saved.";
        //             return e = e || window.event,
        //             e.returnValue = o,
        //             o
        //         }
        //     } else
        //         k.event(ModulesType.MAIN, "mainController", "beforeunload", "beforeLogin")
    });


    function _init() {
        primero();
        segundo();
        var y = MAE.MainStartupService;
        y.stepAdd(StartupStep.INIT_FIRST_SERVICES, init_first_services);
        y.stepAdd(StartupStep.LOAD_SETTINGS_USER, load_settings_user, [StartupStep.INIT_FIRST_SERVICES]);
        y.stepAdd(StartupStep.SET_LANGUAGE, set_language, [StartupStep.LOAD_SETTINGS_USER]);

        y.stepAdd(StartupStep.LOGIN, login, [StartupStep.SET_LANGUAGE])

        y.stepAdd(StartupStep.INIT_SERVICES_AFTER_LOGIN, init_services_after_login, [StartupStep.LOGIN]);
        y.stepAdd(StartupStep.LOAD_SETTINGS_ACCOUNT, load_settings_account, [StartupStep.INIT_SERVICES_AFTER_LOGIN]);
        y.stepAdd(StartupStep.SET_VIEW_STATE_LOADED, set_view_state_loaded, [StartupStep.LOAD_SETTINGS_ACCOUNT]);
        y.stepAdd(StartupStep.COMPILE_ADDITIONAL_VIEWS, compile_additional_views, [StartupStep.SET_VIEW_STATE_LOADED]);
        y.stepAdd(StartupStep.SET_LAYOUT, set_layout, [StartupStep.SET_VIEW_STATE_LOADED, StartupStep.COMPILE_ADDITIONAL_VIEWS]);
        y.stepAdd(StartupStep.ADD_MODULES, add_modules, [StartupStep.SET_LAYOUT]);

        y.stepRun(StartupStep.INIT_FIRST_SERVICES);

    };

    function primero() {
        var e = {};
        var t = location.search;
        var o = t.slice(t.indexOf("?") + 1).split("&");
        for (r = 0, i = o.length; r < i; r++) {
            var n = o[r];
            var p = n.indexOf("=");
            if (!(p <= 0)) {
                var d = n.substring(0, p);
                var s = n.substring(p + 1);
                e[d] = s;
            }
        }
        a.searchParams = e;
    }

    function segundo() {
        var e = a.searchParams["detach"];

        a.detachMode = null != e && e.length > 0;
        if (a.detachMode) {
            a.specifiedModuleMode = true;
            a.specifiedModuleId = e;
        }

        var t = a.searchParams["widget"];
        a.widgetMode = null != t && t.length > 0;

        if (a.widgetMode) {
            if (t === ModulesType.FAVORITE_SYMBOLS)
                t = ModulesType.MARKET_WATCH;

            if (t === XsWidgetType.CLICK_AND_TRADE) {
                a.specifiedWidgetType = t;
                t = ModulesType.MARKET_WATCH;
            }

            if (t === XsWidgetType.CALENDAR) {
                a.specifiedWidgetType = t;
                t = ModulesType.CALENDAR_ECONOMIC;
            }
            a.specifiedModuleMode = true;
            a.specifiedModuleId = t;
        }


        a.desktopMode = "file:" === document.location.protocol;
    }

    function login() {
        var d = MAE.SessionService;
        var y = MAE.MainStartupService;

        d.init();
        d.subscribeStatus(loginStatus, "mainController");
        y.stepFinish(StartupStep.LOGIN);
        //d.login();
    }
    function loginStatus(e, t) {
        switch (e) {
            case SessionStatus.LOGIN_SUCCESS:
                f_login(e, t);
                break;
            case SessionStatus.LOGIN_SUCCESS_AFTER_RECONNECT:
                login_success_after_reconnect(e, t);
                break;
            case SessionStatus.LOGIN_FAIL_NO_TGT_NO_INPUT:
            case SessionStatus.CAS_GET_TGT_UNAUTHORIZED:
            case SessionStatus.CAS_GET_ST_UNAUTHORIZED:
            case SessionStatus.API_LOGIN_FAIL:
            case SocketStatus.ERROR:
            case ServerStatus.MAINTENANCE_1:
            case ServerStatus.SERVER_DOWN_2:
            case ServerStatus.ERROR:
                //d.getIsFirstLogin() && error(e, t);
                break;
            case SessionStatus.LOGOUT_CLOSE:
                logout_close(e, t)
        }
    }
    function f_login(e, t) {
        y.stepFinish(StartupStep.LOGIN)
    }
    function login_success_after_reconnect(e, t) {
        // P.playReconnectSound()
    }

    function error(e, t) {
        if (!a.widgetMode) {
            ke(AppStates.LOGIN);
            a.loaderVisible = false;
            n(function () { }, 0, !0);
        }

    }
    function logout_close(t, o) {
        e.appState = AppStates.LOGGED_OUT
    }

    function init_services_after_login() {
        var y = MAE.MainStartupService;
        var T = MAE.LayoutService;
        var b = MAE.LogsService;
        // var e = s.getEnvironment()
        //   , t = l.getPersonId()
        //   , o = l.getCurrentAccount()
        //   , r = l.getCurrentAccountData()
        //   , i = o.getAccountNo()
        //   , n = o.endpointType
        //   , p = D.getConfigParam("WL.EXCLUDED_MODULES") || [];
        // r && !r.ibAccount && p.push(ModulesType.IB_LEDGER_HISTORY),
        T.init(EndpointType.MAE, null);
        if (!a.widgetMode) {
            a.loaderVisible = true;
            b.init();
            var t = "1";
            var i = "1234";
            b.logsCreateNew(t, i);
        }
        //k.startSessionAfterLogin(e, t, i);
        rootScope.sessionType = (window.AppContext.EstadoSistema.EstadoAbierto === true) ? SymbolSessionType.OPEN : SymbolSessionType.CLOSED;

        // a.widgetMode || (a.loaderVisible = !0),
        // a.widgetMode || (b.init(),
        // b.logsCreateNew(t, i)),
        // k.startSessionAfterLogin(e, t, i),
        // a.$broadcast(MainEvents.APP_INITIALIZED),
        // $.extend(!0, window, {
        //     Slick: {
        //         i18nService: _
        //     }
        // }),
        y.stepFinish(StartupStep.INIT_SERVICES_AFTER_LOGIN);
    }

    function set_layout() {
        var y = MAE.MainStartupService;
        var T = MAE.LayoutService;
        var c = MAE.SettingsService;

        var e, t, o = [];
        if (a.detachMode || a.widgetMode) {
            var r = PredefinedLayouts.specifiedModule;
            a.widgetMode && a.specifiedModuleId == AppModes.CONTEST || (e = r.layout, t = r.containers, t.specifiedModule[0].id = a.specifiedModuleId)
        }
        else {
            e = JSON.parse(JSON.stringify(c.getAccountValue(SettingsTypeAccount.LAYOUT)));
            t = JSON.parse(JSON.stringify(c.getAccountValue(SettingsTypeAccount.LAYOUT_CONTAINERS)));
        }


        T.setLayout(e, t, o);
        if (!a.detachMode && !a.widgetMode) {
            var i = a.searchParams.activateModule;
            if (i)
                switch (i) {
                    case ModulesType.HEATMAP_EQUITIES:
                    // case ModulesType.HEATMAP_FOREX:
                    // {
                    //     T.activateModule(ModulesType.HEATMAP);
                    //     p.get("heatmapService").activateSubmodule(i);
                    // }

                    //   break;
                    case ModulesType.NEWS:
                        var n = a.searchParams.activateModuleData;
                        if (n) {
                            var d;
                            try {
                                d = JSON.parse(atob(n)).id
                            } catch (e) {
                                d = ""
                            }
                            p.get("newsService").setNewsToOpen(d)
                        } else
                            T.activateModule(i);
                        break;
                    default:
                        T.activateModule(i)
                }
        }
        y.stepFinish(StartupStep.SET_LAYOUT)

    }


    function f_load_settings_user(e) {
        var y = MAE.MainStartupService;
        var c = MAE.SettingsService;

        c.loadUserDataRemoveHandler(f_load_settings_user);
        y.stepFinish(StartupStep.LOAD_SETTINGS_USER);
    };

    function load_settings_user() {
        var c = MAE.SettingsService;

        c.init();
        c.loadUserDataAddHandler(f_load_settings_user);
        c.loadUserData();

    };

    function load_settings_account() {
        var c = MAE.SettingsService;
        c.loadAccountDataAddHandler(i_load_settings_account);
        c.loadAccountData();
    }
    function i_load_settings_account(e) {
        var y = MAE.MainStartupService;
        var c = MAE.SettingsService;

        c.loadAccountDataRemoveHandler(i_load_settings_account);
        y.stepFinish(StartupStep.LOAD_SETTINGS_ACCOUNT);
    }

    function init_first_services() {
        var y = MAE.MainStartupService;
        MAE.DetachService.init();
        MAE.TimeService.Init();
        var travel = {
            lastCall: .16,
            duration: 1
        };
        MAE.TimeService.setOptions(travel);
        
        /*
        es un buen momento para iniciar signalR
        */
        y.stepFinish(StartupStep.INIT_FIRST_SERVICES);
    }

    function set_language() {
        var y = MAE.MainStartupService;
        var _ = MAE.I18nService;
        var c = MAE.SettingsService;

        var e = c.getUserValue(SettingsTypeUser.LANGUAGE);
        _.setLanguage(e, !0);
        if (_.currentLanguageIsReady())
            y.stepFinish(StartupStep.SET_LANGUAGE);
        else
            _.subscribeLanguageIsReady(i_set_language);
    }

    function i_set_language() {
        var y = MAE.MainStartupService;
        var _ = MAE.I18nService;

        _.unsubscribeLanguageIsReady(i_set_language);
        y.stepFinish(StartupStep.SET_LANGUAGE);
    }

    function set_view_state_loaded() {
        var y = MAE.MainStartupService;
        subSet_view_state_loaded(AppStates.LOGGED_IN);
        sessionStorage.setItem("loaderVisible", !1);
        y.stepFinish(StartupStep.SET_VIEW_STATE_LOADED);
    }

    function compile_additional_views() {
        var y = MAE.MainStartupService;
        // $("#bottombarContainer").replaceWith(t("<div bottombar></div>")(e);
        // $("#toolbarContainer").replaceWith(t("<div toolbar></div>")(e));
        // $("#toastsContainer").replaceWith(t("<div toasts></div>")(e));
        // $("#sltpPopupContainer").replaceWith(t("<div sl-tp-popup></div>")(e));




        y.stepFinish(StartupStep.COMPILE_ADDITIONAL_VIEWS);
    }

    function subSet_view_state_loaded(t) {

        // e.appState != t && (e.appState = t,
        // a.loadedApp = e.appState === AppStates.LOGIN,
        // R.setPathItemMain(t))
    }


    function add_modules() {
        var T = MAE.LayoutService;
        //sub_add_modules();
        T.unsubscribeModuleAction(ModulesType.MARKET_WATCH, moduleAction_mw, "marketWatchModule");
        T.subscribeModuleAction(ModulesType.MARKET_WATCH, moduleAction_mw, "marketWatchModule");

         T.unsubscribeModuleAction(ModulesType.MARKET_WATCH_DEPTH, moduleAction_mw_depth, "marketWatchModuleDepth");
         T.subscribeModuleAction(ModulesType.MARKET_WATCH_DEPTH, moduleAction_mw_depth, "marketWatchModuleDepth");

        T.unsubscribeModuleAction(ModulesType.OPEN_TRADES, moduleAction_ot, "openTradesModule");
        T.subscribeModuleAction(ModulesType.OPEN_TRADES, moduleAction_ot, "openTradesModule");

        T.unsubscribeModuleAction(ModulesType.PENDING_TRADES, moduleAction_pt, "pendingTradesModule");
        T.subscribeModuleAction(ModulesType.PENDING_TRADES, moduleAction_pt, "pendingTradesModule");

        T.unsubscribeModuleAction(ModulesType.REJECTED, moduleAction_rj, "rejectedModule");
        T.subscribeModuleAction(ModulesType.REJECTED, moduleAction_rj, "rejectedModule");

        T.unsubscribeModuleAction(ModulesType.HISTORY, moduleAction_hi, "historyModule");
        T.subscribeModuleAction(ModulesType.HISTORY, moduleAction_hi, "historyModule");

        T.unsubscribeModuleAction(ModulesType.GARANTY, moduleAction_ga, "galeryModule");
        T.subscribeModuleAction(ModulesType.GARANTY, moduleAction_ga, "galeryModule");


        T.unsubscribeModuleAction(ModulesType.DEPTH, moduleAction_depth, "depthModule");
        T.subscribeModuleAction(ModulesType.DEPTH, moduleAction_depth, "depthModule");


        MAE.ChartsService.init();

    }

    function sub_add_modules_rj() {
        var module = MAE.RejectedModule;
        if (!module.isLoad()) {
            var placeHolder = $("div[rejected-module]");

            module.link(placeHolder, {});
        }

    }

    function sub_add_modules_history() {

        var module = MAE.HistoryModule;
        if (!module.isLoad()) {
            var placeHolder = $("div[history-module]");

            module.link(placeHolder, {});
        }
    }

    function sub_add_modules_garanty() {

        var module = MAE.GarantyModule;
        if (!module.isLoad()) {
            var placeHolder = $("div[garanty-module]");

            module.link(placeHolder, {});
        }
    }

    function sub_add_modules_depth() {
        var module = MAE.DepthModule;
        if (!module.isLoad()) {
            var placeHolder = $("div[depth-module]");

            module.link(placeHolder, {});
        }
    }

    function sub_add_modules_mw() {
        var module = MAE.MarketWatchModule;
        if (!module.isLoad()) {
            var placeHolder = $("div[market-watch-module]");

            module.link(placeHolder, {});
        }

    }

    function sub_add_modules_mw_depth() {
        var module = MAE.MarketWatchDepthModule;
        if (!module.isLoad()) {
            var placeHolder = $("div[market-watch-depth-module]");

            module.link(placeHolder, {});
        }

    }

    function sub_add_modules_ot() {
        var module = MAE.OpenTradesModule;
        if (!module.isLoad()) {
            var placeHolder_pt = $("div[open-trades-module]");
            module.link(placeHolder_pt, {});
        }

    }


    function sub_add_modules_pt() {
        var module = MAE.PendingTradesModule;
        if (!module.isLoad()) {
            var placeHolder_pt = $("div[pending-trades-module]");
            module.link(placeHolder_pt, {});
        }

    }

    function moduleAction_rj(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_rj();
                
                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.REJECTED, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }
    };

    function moduleAction_mw(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_mw();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.MARKET_WATCH, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }
    };

    function moduleAction_mw_depth(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_mw_depth();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.MARKET_WATCH_DEPTH, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }
    };

    function moduleAction_ot(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_ot();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.OPEN_TRADES, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }


    };

    function moduleAction_pt(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_pt();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.PENDING_TRADES, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }
    };


    function moduleAction_ga(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_garanty();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.GARANTY, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }


    };

    function moduleAction_depth(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_depth();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.DEPTH, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }


    };

    function moduleAction_hi(e) {
        switch (e) {
            case LayoutAction.MODULE_ADDED:
                sub_add_modules_history();

                break;
            // case LayoutAction.MODULE_REMOVED:
            //     xe(),
            //         Oe(e);
            //     break;
            case LayoutAction.MODULE_ACTIVATED_FIRST_TIME:
                _initSignal.dispatch({ Module: ModulesType.HISTORY, event: LayoutAction.MODULE_ACTIVATED_FIRST_TIME });
                break;
            // case LayoutAction.MODULE_ACTIVATED:
            //     Ke(),
            //         Ue();
            //     break;
            // case LayoutAction.MODULE_DEACTIVATED:
            //     Le();
            //     break;
            // case LayoutAction.MODULE_RESIZED:
            //     Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.MODULE_CONTAINER_CHANGED:
            //     h(),
            //         Ue(),
            //         Oe(e);
            //     break;
            // case LayoutAction.LAYOUT_OVERLAY_HIDE:
            //     tt()
        }


    };
    
    function _subscribeInit(func) {
        _initSignal.add(func);
    }

    function _unsubscribeInit(fnc) {
        _initSignal.remove(func);
    }

    var _mainService = {
        Init: _init,
        subscribeInit: _subscribeInit,
        unsubscribeInit: _unsubscribeInit

    };


    jq.extend(true, window, {
        MAE: {
            MainService: _mainService

        }
    });
})(jQuery);