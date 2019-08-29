/*
Dependencias : [rootScope]
*/

(function (qy) {

    var i = MAE.I18nService;

    var _layout /*Pe*/, _layoutLayer_current /*ge*/, _layoutType/*fe */, _layoutLayer /*me*/, _layoutLayer_overlay /*ve*/, _signalLayoutAction = new signals.Signal/*be*/, collModulesAction = {}/*Ee*/,
        De = null, _modulesEndpointName = ""/*he*/, Ce = [], _elementosXLayout = {}/*ye */, Te = [], Ae = [ModulesType.CALENDAR, ModulesType.NEWS, ModulesType.EDUCATION, ModulesType.MARKET_ANALYSIS];


    function _init(modulesEndpointName, n) {//r
        // De = e.$new(),
        // De.data = "this is default module scope",
        // De.globalMessage = "This is global message",
        _modulesEndpointName = modulesEndpointName;
        n && (Ce = Ce.concat(n));
        var arbolModulos = ConstruirArbol(ModulesEndpoint[_modulesEndpointName], Ce);
        // , o = ConstruirArbol(ModulesGlobal, Ce);
        setSignal(arbolModulos);
        //setSignal(o),
        _layoutLayer = new LayoutLayer("main", arbolModulos, IsModulo, ponerAtributoModulo, traducirHeader, limpiarContenido);
        //_layoutLayer_overlay = new LayoutLayer("overlay",o,P,M,B,F),
        ElementosXLayout(arbolModulos, _layoutLayer);
        // O(o, _layoutLayer_overlay),
        _layoutLayer_current = _layoutLayer;
        //i.subscribeLanguageChange(languageChange);
    }
    function _setMAELayout(layout) {

        _layout = layout;
        _layout.setConfig({
            widgetMode: rootScope.widgetMode
        });
        _layout.registerActionHandler(layoutHandle);
    }
    function _subscribeLayoutAction(e) {
        _signalLayoutAction.add(e)
    }
    function _unsubscribeLayoutAction(e) {
        _signalLayoutAction.remove(e)
    }
    function _subscribeModuleAction(t, n, a) {//l
        var i = collModulesAction[t];
        if (i) {
            i.add(n, null, null, a);
            var o = getElement(t);
            if (o) {
                var r = o.getModule(t);
                if (r) {
                    var s;
                    if (r.isSubModule && !rootScope.widgetMode && (s = r, t = r.parentId), r = o.getModuleDetached(t))
                        n(LayoutAction.MODULE_REMOVED),
                            n(LayoutAction.MODULE_DETACHED);
                    else if (r = o.getModuleShown(t)) {
                        n(LayoutAction.MODULE_ADDED);
                        var c = o.getContainerModules(r.parentId), u = c.getActiveChild();
                        u && u.id === r.id && (s ? u.getActiveChild() === s && n(s.amountOfActivations <= 1 ? LayoutAction.MODULE_ACTIVATED_FIRST_TIME : LayoutAction.MODULE_ACTIVATED) : n(u.amountOfActivations <= 1 ? LayoutAction.MODULE_ACTIVATED_FIRST_TIME : LayoutAction.MODULE_ACTIVATED))
                    } else
                        r = o.getModuleHidden(t),
                            r && n(LayoutAction.MODULE_REMOVED)
                }
            }
        }
    }
    function _unsubscribeModuleAction(e, t) {
        var n = collModulesAction[e];
        n && n.remove(t)
    }
    /*(e,r)*/
    function DispararAccion(modulo, _layoutAction) {//S
        var n = _layoutAction;
        switch (_layoutAction) {
            case LayoutAction.MODULE_DETACHED:
                // o.event(ModulesType.MAIN, "layoutService", n, modulo.id);
                break;
            case LayoutAction.MODULE_ADDED:
                modulo.amountOfActivations = 0;
                break;
            case LayoutAction.MODULE_ACTIVATED:
                0 === modulo.amountOfActivations && (n = LayoutAction.MODULE_ACTIVATED_FIRST_TIME),
                    modulo.amountOfActivations++
            //o.event(ModulesType.MAIN, "layoutService", n, modulo.id)
        }
        collModulesAction[modulo.id].dispatch(n);
        if (modulo.children) {
            switch (_layoutAction) {
                case LayoutAction.MODULE_IS_READY:
                    break;
                case LayoutAction.MODULE_ACTIVATED:
                    var a = modulo.getActiveChild();
                    if (a)
                        DispararAccion(a, _layoutAction);
                    break;
                default:
                    for (var i = 0, r = modulo.children.length; i < r; i++)
                        DispararAccion(modulo.children[i], _layoutAction)
            }

        }

        collModulesAction[modulo.id].dispatch(n);
        if (modulo.children)
            switch (_layoutAction) {
                case LayoutAction.MODULE_IS_READY:
                    break;
                case LayoutAction.MODULE_ACTIVATED:
                    var a = modulo.getActiveChild();
                    if (a)
                        DispararAccion(a, _layoutAction);
                    break;
                default:
                    for (var i = 0, r = modulo.children.length; i < r; i++)
                        DispararAccion(modulo.children[i], _layoutAction)
            }
    }
    function DispararGruposDeAcciones(e) {//p
        for (var t, n = 0, a = e.length; n < a; n++) {
            t = e[n];
            DispararAccion(t.module, t.action);
        }

    }
    function _getLayerOverlayIsShown() {
        return _layoutLayer_current === ve
    }
    function getElement(e) { // f
        return _elementosXLayout[e]
    }
    function _setLayout(layout, n, a, i) {//t n, a, i
        _layoutType = layout.layoutType;
        if (null === _layoutType) {
            _layoutType = layout.id || layout.label;
            _layoutType = _layoutType.toString().split("/")[0];
        }


        var a_idsModulesShown = ObtenerIds(_layoutLayer.getModulesShown().getCollection());
        var a_idsModulesHidden = ObtenerIds(_layoutLayer.getModulesHidden().getCollection());
        var a_idsModulesDetached = ObtenerIds(_layoutLayer.getModulesDetached().getCollection());

        var u = containerIsShownGetActiveChild(_layoutLayer);
        _layoutLayer.buildAllModulesDetached(a);
        _layoutLayer.buildAllContainerModules(n);
        _layoutLayer.buildContainerRoot(layout, _layoutType);
        // _layoutLayer.buildAllModulesHidden(e.specifiedModuleMode);
        var containerRoot = _layoutLayer.getContainerRoot();//l
        var d = "Chart" === _layoutType;
        _layout.buildLayout(containerRoot, 0, {
            hideTabNavigation: false,//rootScope.widgetMode,
            hideMaximizeButtons: d
        });

        _layout.setAvailableTabs(_layoutLayer.getModulesHidden().getCollection());
        var d_idsModulesShown = ObtenerIds(_layoutLayer.getModulesShown().getCollection());
        var d_a_idsModulesHidden = ObtenerIds(_layoutLayer.getModulesHidden().getCollection());
        var d_idsModulesDetached = ObtenerIds(_layoutLayer.getModulesDetached().getCollection());
        var f = containerIsShownGetActiveChild(_layoutLayer);
        _signalLayoutAction.dispatch(LayoutAction.LAYOUT_CHANGED, _layoutType);
        // o.event(ModulesType.MAIN, "layoutService", LayoutAction.LAYOUT_CHANGED, fe);
        revisarYDisparar(_layoutLayer.getModules().getCollection(), a_idsModulesShown, d_idsModulesShown, a_idsModulesHidden, d_a_idsModulesHidden, a_idsModulesDetached, d_idsModulesDetached);
        y(u, f);
        i && (setAccountLAYOUT(), setAccountLAYOUT_CONTAINERS());
    }
    function _setLayoutDefault(e) {
        var layout = JSON.parse(JSON.stringify(SettingsDefaultAccountData[he].layout));
        var n = JSON.parse(JSON.stringify(SettingsDefaultAccountData[he].layoutContainers));
        _setLayout(layout, n, null, e);
    }
    function _showLayerOverlay(e, t) {
        _layoutLayer_current = _layoutLayer_overlay;
        var n = ObtenerIds(_layoutLayer_overlay.getModulesShown().getCollection())
            , a = ObtenerIds(_layoutLayer_overlay.getModulesHidden().getCollection())
            , i = ObtenerIds(_layoutLayer_overlay.getModulesDetached().getCollection())
            , r = containerIsShownGetActiveChild(_layoutLayer_overlay);
        _layoutLayer_overlay.destroyContainerRoot(),
            _layoutLayer_overlay.destroyAllContainerModules(),
            _layoutLayer_overlay.buildAllContainerModules(t),
            _layoutLayer_overlay.buildContainerRoot(e, e.layoutType);
        var s = _layoutLayer_overlay.getContainerRoot();
        _layout.buildLayout(s, 1, {
            hideMaximizeButtons: !0
        }),
            _layout.setAvailableTabs([]);
        var c = ObtenerIds(_layoutLayer_overlay.getModulesShown().getCollection())
            , u = ObtenerIds(_layoutLayer_overlay.getModulesHidden().getCollection())
            , l = ObtenerIds(_layoutLayer_overlay.getModulesDetached().getCollection())
            , d = containerIsShownGetActiveChild(_layoutLayer_overlay);
        _signalLayoutAction.dispatch(LayoutAction.LAYOUT_OVERLAY_SHOW, s.id),
            o.event(ModulesType.MAIN, "layoutService", LayoutAction.LAYOUT_OVERLAY_SHOW, s.id),
            revisarYDisparar(_layoutLayer_overlay.getModules().getCollection(), n, c, a, u, i, l),
            y(r, d)
    }
    function _hideLayerOverlay() {
        if (_layoutLayer_current !== _layoutLayer) {
            _layoutLayer_current = _layoutLayer;
            var e = ObtenerIds(_layoutLayer_overlay.getModulesShown().getCollection())
                , t = ObtenerIds(_layoutLayer_overlay.getModulesHidden().getCollection())
                , n = ObtenerIds(_layoutLayer_overlay.getModulesDetached().getCollection())
                , a = containerIsShownGetActiveChild(ve);
            _layoutLayer_overlay.destroyContainerRoot(),
                _layoutLayer_overlay.destroyAllContainerModules();
            var i = _layoutLayer_overlay.getContainerRoot();
            _layout.destroyLayout(1),
                _layout.setActiveLayoutLevel(0);
            var r = ObtenerIds(_layoutLayer_overlay.getModulesShown().getCollection())
                , s = ObtenerIds(_layoutLayer_overlay.getModulesHidden().getCollection())
                , c = ObtenerIds(_layoutLayer_overlay.getModulesDetached().getCollection())
                , u = containerIsShownGetActiveChild(ve);
            _signalLayoutAction.dispatch(LayoutAction.LAYOUT_OVERLAY_HIDE, i.id),
                o.event(ModulesType.MAIN, "layoutService", LayoutAction.LAYOUT_OVERLAY_HIDE, i.id),
                revisarYDisparar(_layoutLayer_overlay.getModules().getCollection(), e, r, t, s, n, c),
                y(a, u),
                T()
        }
    }
    function ObtenerIds(e) {
        for (var t = [], n = 0, a = e.length; n < a; n++)
            t.push(e[n].id);
        return t
    }
    function containerIsShownGetActiveChild(e) { //h
        var t, n, a, i, o = {}, r = e.getContainersModules().getCollection();
        for (t = 0, n = r.length; t < n; t++)
            a = r[t], e.containerIsShown(a.id) && (i = a.getActiveChild(), i && (o[a.id] = i));
        return o
    }
    //function C(e, t, n, a, i, o, r)
    function revisarYDisparar(collModules, a_idsModulesShown, d_idsModulesShown, a_idsModulesHidden, d_a_idsModulesHidden, a_idsModulesDetached, d_idsModulesDetached) {//C

        var v = collModules.length;
        var modulo, idModulo;
        var i_a_idsModulesShown, i_a_idsModulesHidden, i_a_idsModulesDetached, d_idsModulesShown, i_d_a_idsModulesHidden, i_d_idsModulesDetached;
        for (var m = 0; m < v; m++) {
            modulo = collModules[m];//s
            idModulo = modulo.id;//c
            i_a_idsModulesShown = a_idsModulesShown.indexOf(idModulo) !== -1;//u
            i_a_idsModulesHidden = a_idsModulesHidden.indexOf(idModulo) !== -1; //l
            i_a_idsModulesDetached = a_idsModulesDetached.indexOf(idModulo) !== -1; //d
            i_d_idsModulesShown = d_idsModulesShown.indexOf(idModulo) !== -1;//p
            i_d_a_idsModulesHidden = d_a_idsModulesHidden.indexOf(idModulo) !== -1;//g
            i_d_idsModulesDetached = d_idsModulesDetached.indexOf(idModulo) !== -1;//f

            if (i_a_idsModulesShown || i_a_idsModulesHidden || i_a_idsModulesDetached) {

                if (i_a_idsModulesShown) {
                    if (i_d_idsModulesShown) {
                        DispararAccion(modulo, LayoutAction.MODULE_CONTAINER_CHANGED)
                    }
                    else
                        if (i_d_a_idsModulesHidden) {
                            DispararAccion(modulo, LayoutAction.MODULE_REMOVED)
                        }
                        else if (i_d_idsModulesDetached) {
                            DispararAccion(modulo, LayoutAction.MODULE_REMOVED);
                            DispararAccion(modulo, LayoutAction.MODULE_DETACHED);
                        }
                        else {
                            DispararAccion(modulo, LayoutAction.MODULE_REMOVED)
                        }
                }
            }
            else {
                if (i_a_idsModulesHidden) {
                    if (i_d_a_idsModulesHidden) {
                        if (i_d_idsModulesShown)
                            DispararAccion(modulo, LayoutAction.MODULE_ADDED);
                        else
                            if (i_d_idsModulesDetached)
                                DispararAccion(modulo, LayoutAction.MODULE_DETACHED);

                    }
                    if (i_a_idsModulesDetached) {
                        if (!i_d_idsModulesDetached) {
                            if (i_d_idsModulesShown) {
                                DispararAccion(modulo, LayoutAction.MODULE_ATTACHED);
                                DispararAccion(modulo, LayoutAction.MODULE_ADDED);

                            }
                            else {
                                if (i_d_a_idsModulesHidden) {
                                    DispararAccion(modulo, LayoutAction.MODULE_ATTACHED);
                                    DispararAccion(modulo, LayoutAction.MODULE_REMOVED);

                                }
                            }
                        }

                    }
                    else {
                        if (i_d_idsModulesShown) {
                            DispararAccion(modulo, LayoutAction.MODULE_ADDED);

                        }
                        else {
                            if (i_d_a_idsModulesHidden)
                                DispararAccion(modulo, LayoutAction.MODULE_REMOVED);
                            else {
                                if (i_d_idsModulesDetached)
                                    DispararAccion(modulo, LayoutAction.MODULE_DETACHED);
                            }
                        }
                    }
                }
            }
        }
    }
    function y(e, t) {
        var n, a, i, o, r, s, c = {};
        for (n in e)
            i = e[n],
                a = {
                    moduleOld: i,
                    moduleNew: null
                },
                c[n] = a;
        for (n in t) {
            o = t[n],
                s = !1;
            for (r in c)
                n !== r && (a = c[r],
                    a && (i = a.moduleOld,
                        i === o && (s = !0,
                            a.moduleOld = null)));
            s || (a = c[n],
                a ? a.moduleNew = o : (a = {
                    moduleOld: null,
                    moduleNew: o
                },
                    c[n] = a))
        }
        for (n in c)
            a = c[n],
                i = a.moduleOld,
                o = a.moduleNew,
                null === i && null !== o ? DispararAccion(o, LayoutAction.MODULE_ACTIVATED) : null !== i && null === o ? DispararAccion(i, LayoutAction.MODULE_DEACTIVATED) : null !== i && null !== o && i.id !== o.id && (DispararAccion(i, LayoutAction.MODULE_DEACTIVATED),
                    DispararAccion(o, LayoutAction.MODULE_ACTIVATED))
    }
    function T() {
        var e, t, n = containerIsShownGetActiveChild(me);
        for (e in n) {
            t = n[e];
            t && ispararAccion(t, LayoutAction.LAYOUT_OVERLAY_HIDE);
        }

    }
    function ConstruirArbol(modulesEndpoint, n) { //A (t,n)
        var mapWithCollection = new MapWithCollection("id");//a
        n = n || [];
        var i, o, moduleId/*r*/, moduleData/*s*/, moduleConstraints/*c */, modulesConfig /*u */, modulesConfig_propiedad /*l */;
        var containers_aplanados = containers();//d
        for (i = 0, o = modulesEndpoint.length; i < o; i++) {
            moduleId = modulesEndpoint[i];
            if (n.indexOf(moduleId) === -1) {
                moduleData = new ModuleData(moduleId, containers_aplanados[moduleId]);
                moduleConstraints = ModuleConstraints[moduleId];
                if (moduleConstraints) {
                    moduleData.minWidth = moduleConstraints.minWidth || 0;
                    moduleData.minHeight = moduleConstraints.minHeight || 0;
                }
                modulesConfig = ModulesConfig[moduleId];
                if (modulesConfig)
                    for (modulesConfig_propiedad in modulesConfig) {
                        if (modulesConfig.hasOwnProperty(modulesConfig_propiedad)) {
                            moduleData[modulesConfig_propiedad] = JSON.parse(JSON.stringify(modulesConfig[modulesConfig_propiedad]));
                        }
                    }

                //e.specifiedModuleMode && (s.isDetachable = !1),
                mapWithCollection.addItem(moduleData)
            }
        }
        modulesEndpoint = mapWithCollection.getCollection();
        var children, p, g, f;
        var i_modulesEndpoint;
        for (i = 0, o = modulesEndpoint.length; i < o; i++) {
            i_modulesEndpoint = modulesEndpoint[i];
            if (children = i_modulesEndpoint.children)
                for (p = 0, g = children.length; p < g; p++) {
                    moduleId = children[p];
                    if (n.indexOf(moduleId) === -1) {
                        f = mapWithCollection.getItem(moduleId);
                        if (f) {
                            f.parentId = i_modulesEndpoint.id;
                            f.isSubModule = true;
                            children[p] = f;
                        }

                    } else {
                        children.splice(p, 1);
                        p--;
                        g--;
                    };

                }
        }

        return mapWithCollection
    }
    function containers() { //I
        var propiedad, valor_propiedad, sub_propiedad, a, valor_sub_propiedad;
        var moduleId, containers_aplanados = {};
        var containers_to = PredefinedLayouts[_modulesEndpointName].containers;

        for (propiedad in containers_to) {
            if (containers_to.hasOwnProperty(propiedad)) {//si la propiedad no es heredada 
                valor_propiedad = containers_to[propiedad];
                for (sub_propiedad = 0, a = valor_propiedad.length; sub_propiedad < a; sub_propiedad++) {
                    valor_sub_propiedad = valor_propiedad[sub_propiedad];
                    moduleId = valor_sub_propiedad.moduleId || valor_sub_propiedad.id;
                    containers_aplanados[moduleId] = propiedad;
                }
            }

        }

        return containers_aplanados;
    }
    function setSignal(arbolModulos) { //N
        var t, n, moduleId /*a*/, signaltemp /*i */, moduleDataColl = arbolModulos.getCollection();//o
        for (t = 0, n = moduleDataColl.length; t < n; t++) {
            moduleId = moduleDataColl[t].id;
            signaltemp = collModulesAction[moduleId];
            if (!signaltemp) {
                signaltemp = new signals.Signal(moduleId);
                collModulesAction[moduleId] = signaltemp;
            }
        }


    }
    function ElementosXLayout(arbolModulos, layout_Layer) { //O(e,t)
        var n, a, moduleId/*i */, moduleDataColl = arbolModulos.getCollection();//o
        for (n = 0, a = moduleDataColl.length; n < a; n++) {
            moduleId = moduleDataColl[n].id;
            _elementosXLayout[moduleId] = layout_Layer;
        }


    }
    function _getModuleIsDetached(e) {
        return null != _layoutLayer.getModuleDetached(e)
    }
    function _getModuleIsShown(e) {
        return null != _layoutLayer.getModuleShown(e)
    }
    function _getModuleIsHidden(e) {
        return null != v.getModuleHidden(e)
    }
    function _getModuleIsActive(e) {
        var t = _layoutLayer.getModule(e);
        if (!t)
            return !1;
        var n = _layoutLayer.getContainerShown(t.parentId);
        if (!n)
            return !1;
        var a = n.getActiveChild();
        return a === t
    }
    function _getModuleIsMaximized(e) {
        return _layout.isTabMaximized(e)
    }
    function _getModuleGAPageViewPath(e) {
        var t = getElement(e);
        if (t) {
            var n = t.getModule(e);
            if (n) {
                var a = [n.gaId];
                var i = n.parentId;
                if (n.isSubModule) {
                    var o = t.getModuleShown(i);
                    if (o) {
                        a.unshift(o.gaId);
                        i = o.parentId;
                    }
                }
                var r = t.getContainerModules(i);
                r && a.unshift(r.id);

                return a;
            }
        }
        return null
    }
    function IsModulo(e) {//P
        var t = e.indexOf("Module");
        return t !== -1 ? e.slice(0, t) : e
    }
    function traducirHeader(e) {//B
        e.headerLabel = i.getString("MODULES." + e.id),
            e.headerTooltip = i.getStringIfExists("MODULES_DESCRIPTIONS." + e.id)
    }
    function ponerAtributoModulo(e) { //M
        if (!e.content) {
            var n = StringUtils.snakeCase(e.id + "Module");
            var a = qy("<div></div>");
            a.attr(n, "");
            a.addClass("xs-module");
            // var i = 1//;De.$new();
            // i.moduleId = e.id,
            // e.scope = i;
            // var o = t(a);
            e.content = a;//o(i)
        }
    }
    function x(e, n) {
        if (!e.headerElement && null !== e.scope) {
            n = StringUtils.snakeCase(n);
            var a = qy("<div></div>");
            a.attr(n, "");
            // var i = 1//e.scope.$new()
            //   , o = t(a);
            // e.headerElement = o(i)
        }
    }
    function limpiarContenido(e) {//F
        var t = e.scope;
        t && (t.$destroy(),
            e.scope = null),
            e.content = null,
            e.headerElement = null,
            e.isReady = !1
    }
    function tab_select(e, t, n, a, Z) {
      
        var i = getElement(e);
        if (i) {
            var o = i.getModule(e);
            if (o) {
                var r, s = o.parentId;
                if (o.isSubModule)
                    W(s),
                        r = i.getModuleShown(s);
                else {
                    o = i.getModuleShown(e);
                    if (!o) {
                        a = a ? a : null;
                        return void tab_add(e, a, t, n);
                    }



                    r = i.getContainerModules(s)
                }
                if (r) {
                    var c = _layout.getCurrentMaximizedContainerId();
                    c && c == s || tab_minimize();
                    var u = r.getActiveChild();
                    if (u) {
                        if (u.id === o.id)
                            return void (t && (o.isReady ? t.apply(this, n) : (o.isReadyCallback = t,
                                o.isReadyCallbackParameters = n)));
                        DispararAccion(u, LayoutAction.MODULE_DEACTIVATED)
                    }
                    r.setActiveChildIndexByChild(o);
                    _layout.selectTab(o.id, undefined, Z);
                    DispararAccion(o, LayoutAction.MODULE_ACTIVATED);
                    if (o.isSubModule)
                        setAccountLAYOUT_CONTAINERS();
                    else
                        setAccountLAYOUT();

                    t && (o.isReady ? t.apply(this, n) : (o.isReadyCallback = t,
                        o.isReadyCallbackParameters = n))
                }
            }
        }
    }
    function tab_add(e, t, n, a) {
        var i = getElement(e);
        if (i) {
            var o = i.getModuleShown(e);
            if (o)
                return void (n && n.apply(this, a));

            o = i.getModuleHidden(e);
            if (!o)
                return void (o = i.getModuleDetached(e));

            var r = o.parentId;
            var s = i.getContainerModules(r);

            s && s.removeChild(o);
            t = t || r;
            s = i.getContainerModules(t);
            
            var c = i.containerIsShown(t);
            if (c || (s = i.findShownContainerModules())) {
                var u = i.addModuleIntoContainerModules(s, o);
                if (u.success) {
                    i.removeModuleHidden(o);
                    i.addModuleShown(o);
                    var l = o.children;
                    if (l) {
                        o.validateActiveChildIndex();
                        for (var d, g = l.concat(), m = 0, v = g.length; m < v; m++) {
                            d = g[m];
                            l.indexOf(o) < -1 || ponerAtributoModulo(d);
                        }
                        g.length = 0;
                    } else
                        ponerAtributoModulo(o);

                    _layout.addTab(o);
                    _layout.setAvailableTabs(i.getModulesHidden().getCollection());
                    DispararGruposDeAcciones(u.actions);
                    DispararAccion(o, LayoutAction.MODULE_ADDED);
                    DispararAccion(o, LayoutAction.MODULE_ACTIVATED);
                    setAccountLAYOUT();
                    setAccountLAYOUT_CONTAINERS();
                    if (n) {
                        if (o.isReady)
                            n.apply(this, a);
                        else {
                            o.isReadyCallback = n;
                            o.isReadyCallbackParameters = a;
                        }
                    }
                }
            }
        }
    }
    function tab_remove(t) {
        if (rootScope.detachMode)
            return void window.close();
        var n = getElement(t);
        if (n) {
            if (n === _layoutLayer_overlay)
                return void E();
            var a = n.getModuleShown(t);
            if (a) {
                var i = a.parentId;
                var o = n.getContainerModules(i);
                var r = n.removeModuleFromContainerModules(o, a);
                if (r.success) {
                    n.removeModuleShown(a);
                    n.addModuleHidden(a);
                    var s = a.children;
                    if (s)
                        for (var c, u = 0, l = s.length; u < l; u++) {
                            c = s[u];
                            limpiarContenido(c);
                        }


                    limpiarContenido(a);
                    _layout.removeTab(a.id);
                    _layout.setAvailableTabs(n.getModulesHidden().getCollection());
                    DispararGruposDeAcciones(r.actions);
                    DispararAccion(a, LayoutAction.MODULE_REMOVED);
                    setAccountLAYOUT();
                    setAccountLAYOUT_CONTAINERS();
                }
            }
        }
    }
    function _excludeModule(e) {
        if (!De)
            return void Ce.push(e);
        var t = getElement(e);
        if (t) {
            var n = t.getModule(e);
            if (n) {
                var a, i;
                if (n.isSubModule) {
                    a = t.getModule(n.parentId);
                    i = t.removeSubmoduleFromModule(a, n);
                }
                else {
                    a = t.getContainerModules(n.parentId);
                    i = t.removeModuleFromContainerModules(a, n);
                }


                t.excludeModule(n);
                delete _elementosXLayout[e];
                limpiarContenido(n);
                if (n.isSubModule) {
                    a = t.getModuleShown(a.id);
                    if (a) {
                        _layout.removeSubTab(n.id);
                        DispararGruposDeAcciones(i.actions);
                    }
                }
                else {
                    a = t.getContainerShown(a.id);
                    if (a) {
                        _layout.removeTab(n.id);
                        _layout.setAvailableTabs(t.getModulesHidden().getCollection());
                        DispararGruposDeAcciones(i.actions);
                    }
                }

                DispararAccion(n, LayoutAction.MODULE_EXCLUDED);
                if (!n.isSubModule && a) {
                    setAccountLAYOUT();
                    setAccountLAYOUT_CONTAINERS()
                }
            }
        }
    }
    function tab_move(e, t, n) {
        var a = getElement(e);
        if (a) {
            var i = a.getModuleShown(e);
            if (i) {
                var o = i.parentId;
                t = t || o;
                var r = a.getContainerModules(t);
                if (o === t) {
                    var s = r.setChildIndex(i, n);
                    if (!s)
                        return;
                    n = r.getChildIndex(i),
                        _layout.moveTab(i.id, t, n),
                        DispararAccion(i, LayoutAction.MODULE_POSITION_CHANGED),
                        setAccountLAYOUT(),
                        setAccountLAYOUT_CONTAINERS()
                } else {
                    var c = a.getContainerModules(o)
                        , u = a.removeModuleFromContainerModules(c, i);
                    if (!u.success)
                        return;
                    var l = a.addModuleIntoContainerModules(r, i, n);
                    if (!l.success)
                        return;
                    n = r.getChildIndex(i);
                    _layout.moveTab(i.id, t, n);
                    DispararGruposDeAcciones(u.actions);
                    DispararGruposDeAcciones(l.actions);
                    DispararAccion(i, LayoutAction.MODULE_CONTAINER_CHANGED);
                    setAccountLAYOUT();
                    setAccountLAYOUT_CONTAINERS();
                }
            }
        }
    }
    function _moduleIsReady(t) {
        var n = getElement(t);
        if (n) {
            var a = n.getModule(t);
            if (a && (a.isSubModule || (a = n.getModuleShown(t))) && !a.isReady) {
                a.isSubModule && _moduleIsReady(a.parentId);
                a.isReady = true;
                _layout.hideModuleLoader(t);
                rootScope.widgetMode && (e.loaderVisible = !1);
                DispararAccion(a, LayoutAction.MODULE_IS_READY);
                var i = a.isReadyCallback;
                i && i.apply(this, a.isReadyCallbackParameters)
            }
        }
    }
    function _moduleSetHeader(e, t, n, a) {
        var i = getElement(e);
        if (i) {
            var o = i.getModule(e);
            o && (t && (o.headerLabel = t),
                n && (o.headerTooltip = n),
                a && x(o, a),
                _layout.setTabHeader(o))
        }
    }
    function _isAnyContainerMaximized() {
        return null !== _layout.getCurrentMaximizedTabId()
    }
    function tab_maximize(e) {
        var t = getElement(e);
        if (t) {
            var n = t.getModuleShown(e);
            n && (_layout.maximizeTab(e),
                DispararAccion(n, LayoutAction.MODULE_RESIZED))
        }
    }
    function _hideAvailableTabsDropdown() {
        _layout && _layout.hideAvailableTabsDropdown()
    }
    function tab_minimize(e) {
        if (e = e || _layout.getCurrentMaximizedTabId()) {
            var t = getElement(e);
            if (t) {
                var n = t.getModuleShown(e);
                n && (_layout.minimizeTab(),
                    DispararAccion(n, LayoutAction.MODULE_RESIZED))
            }
        }
    }
    function tab_detach(e, t, n) {
        var i = getElement(e);
        var a = MAE.DetachService;
        if (i) {
            var o = i.getModuleShown(e);
            if (o && o.isDetachable) {
                var r = o.parentId;
                var s = i.getContainerModules(r);
                var c = i.removeModuleFromContainerModules(s, o);
                if (c.success) {
                    i.removeModuleShown(o);
                    limpiarContenido(o);
                    _layout.removeTab(o.id);
                    DispararGruposDeAcciones(c.actions);
                    DispararAccion(o, LayoutAction.MODULE_REMOVED);

                    var u = a.main_moduleDetach(e, t, n);
                    if (u) {
                        i.addModuleDetached(o);
                        DispararAccion(o, LayoutAction.MODULE_DETACHED);
                        setAccountLAYOUT_CONTAINERS();
                        setAccountLAYOUT_MODULES_DETACHED();
                    }

                    // u && (i.addModuleDetached(o),
                    //     DispararAccion(o, LayoutAction.MODULE_DETACHED),
                    //     setAccountLAYOUT_CONTAINERS(),
                    //     setAccountLAYOUT_MODULES_DETACHED())
                }
            }
        }
    }
    function _attachModule(e, t, n) {
        var a = getElement(e);
        if (a) {
            var i = a.getModuleShown(e);
            if (i)
                return void (t && t.apply(this, n));
            if (i = a.getModuleDetached(e),
                !i)
                return void (i = a.getModuleHidden(e));
            var o = i.parentId
                , r = a.getContainerModules(o)
                , s = a.containerIsShown(o);
            if (s || (r = a.findShownContainerModules())) {
                var c = a.addModuleIntoContainerModules(r, i);
                if (c.success) {
                    a.removeModuleDetached(i);
                    a.addModuleShown(i);
                    ponerAtributoModulo(i);
                    traducirHeader(i);
                    _layout.addTab(i);
                    DispararGruposDeAcciones(c.actions);
                    DispararAccion(i, LayoutAction.MODULE_ATTACHED);
                    DispararAccion(i, LayoutAction.MODULE_ADDED);
                    DispararAccion(i, LayoutAction.MODULE_ACTIVATED);
                    setAccountLAYOUT_CONTAINERS();
                    setAccountLAYOUT_MODULES_DETACHED();
                    if (t) {
                        if (i.isReady)
                            t.apply(this, n);
                        else {
                            i.isReadyCallback = t;
                            i.isReadyCallbackParameters = n;
                        }
                    }
                }
            }
        }
    }
    function containers_resize(e) {
        var t, n, a = [];
        for (t in e) {
            if (e.hasOwnProperty(t)) {
                n = _layoutLayer_current.getContainerShown(t);
                if (n) {
                    n.percentSize = e[t];
                    _layoutLayer_current.getContainerShownAllModules(n, a);
                }
            }
        }



        var i, o, r;
        for (i = 0, o = a.length; i < o; i++) {
            r = a[i];
            DispararAccion(r, LayoutAction.MODULE_RESIZED);
        }


        setAccountLAYOUT();
    }
    function resize_constraint_reached(e) {
        _signalLayoutAction.dispatch(LayoutAction.CONTAINER_CONSTRAINT_REACHED, e)
    }
    function resize_constraint_released(e) {
        _signalLayoutAction.dispatch(LayoutAction.CONTAINER_CONSTRAINT_RELEASED, e)
    }
    function languageChange() {//ne
        if (pe) {
            var e, t, n, a = _layoutLayer.getModulesShown().getCollection().concat(_layoutLayer_overlay.getModulesShown().getCollection());
            for (e = 0, t = a.length; e < t; e++) {

                n = a[e];
                B(n);
                _layout.setTabHeader(n);
            }


            a = _layoutLayer.getModulesHidden().getCollection().concat(_layoutLayer_overlay.getModulesHidden().getCollection());
            t = a.length;
            for (e = 0; e < t; e++) {
                n = a[e];
                B(n);
            }

            _layout.setAvailableTabs(_layoutLayer.getModulesHidden().getCollection());
            traducir();
        }
    }
    function translations_request(e) {
        Te = e;
        traducir();
    }
    function traducir() {//ie
        var e, t, n, a = {};
        for (e = 0, t = Te.length; e < t; e++) {
            n = Te[e];
            a[n] = i.getString(n);

        }
        if (t > 0)
            _layout.setTranslations(a);
    }
    function setAccountLAYOUT() {//oe
        if (!rootScope.detachMode) {
            var t = _layoutLayer.getContainerRoot().toLayoutData();
            t.layoutType = _layoutType;
            MAE.SettingsService.setAccountValue(SettingsTypeAccount.LAYOUT, t);
        }
    }
    function setAccountLAYOUT_CONTAINERS() {//re
        if (!rootScope.detachMode) {
            var t, a, i, item, oLayoutContainerData = {}, s = _layoutLayer.getContainersModules().getCollection();
            for (t = 0, a = s.length; t < a; t++) {
                i = s[t];
                item = i.toLayoutContainerData();
                oLayoutContainerData[i.id] = item;
            }

            MAE.SettingsService.setAccountValue(SettingsTypeAccount.LAYOUT_CONTAINERS, oLayoutContainerData);
        }
    }
    function setAccountLAYOUT_MODULES_DETACHED() {//se
        if (!rootScope.detachMode) {
            var t, a, i, o, r = [], s = _layoutLayer.getModulesDetached().getCollection();
            for (t = 0, a = s.length; t < a; t++) {
                i = s[t];
                o = i.toLayoutData();
                r.push(o);
            }

            MAE.SettingsService.setAccountValue(SettingsTypeAccount.LAYOUT_MODULES_DETACHED, r)
        }
    }
    function layoutHandle(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        switch (e) {
            case MAE.LayoutChangeRequestEvent.TAB_SELECT:
                Ae.indexOf(t[0]) > -1 && o.eventClick(ModulesType.MAIN, "tabs", t[0]),
                    tab_select(t[0], undefined, undefined, undefined,false);//W
                break;
            case MAE.LayoutChangeRequestEvent.TAB_ADD:
                tab_add(t[0], t[1]);//V
                break;
            case MAE.LayoutChangeRequestEvent.TAB_REMOVE:
                tab_remove(t[0]);//H
                break;
            case MAE.LayoutChangeRequestEvent.TAB_MOVE:
                tab_move(t[0], t[1], t[2]); //G
                break;
            case MAE.LayoutChangeRequestEvent.TAB_MAXIMIZE:
                tab_maximize(t[0]);//j
                break;
            case MAE.LayoutChangeRequestEvent.TAB_MINIMIZE:
                tab_minimize(t[0]);//J
                break;
            case MAE.LayoutChangeRequestEvent.TAB_DETACH:
                tab_detach(t[0], t[1], t[2]);//Y
                break;
            case MAE.LayoutChangeRequestEvent.CONTAINERS_RESIZE:
                containers_resize(t[0]);//Z
                break;
            case MAE.LayoutChangeRequestEvent.TRANSLATIONS_REQUEST:
                translations_request(t[0]);//ae
                break;
            case MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_REACHED:
                resize_constraint_reached(t[0]);//ee
                break;
            case MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_RELEASED:
                resize_constraint_released(t[0])//te
        }
    }

    function _getModule(mod)
    {
        return _layoutLayer.getModule(mod);

    }

    function _getActiveModuleBefore(e) {
        if (!e)
            return null;
        var t = getElement(e);
        if (!t)
            return null;
        var n = _layoutLayer.getModule(e);
        if (!n)
            return null;
        var a = _layoutLayer.getContainerModules(n.parentId);
        return a ? a.historyActiveData[e] || null : null
    }
    function _getSubscriptionStatus() {
        var e, t = "";
        for (var n in collModulesAction) {
            e = collModulesAction[n];
            t += e.toStringNames() + " | ";
        }

        return t
    }
    function _moveToMaximizeContainer(e) {
        var t = _layout.getCurrentMaximizedContainerId();
        t && tab_move(e, t)
    }
    function _moveHiddenToMaximizeContainer(e) {
        var t = _layout.getCurrentMaximizedContainerId();
        t && tab_select(e, void 0, void 0, t)
    }



    var _LayoutService = {
        _getSubscriptionStatus: _getSubscriptionStatus, //le
        init: _init, //r
        setMAELayout: _setMAELayout, //s
        getLayerOverlayIsShown: _getLayerOverlayIsShown,//g
        subscribeLayoutAction: _subscribeLayoutAction, //c
        unsubscribeLayoutAction: _unsubscribeLayoutAction,//u
        subscribeModuleAction: _subscribeModuleAction, //l
        unsubscribeModuleAction: _unsubscribeModuleAction, //d
        setLayout: _setLayout, //m
        setLayoutDefault: _setLayoutDefault,//v
        showLayerOverlay: _showLayerOverlay,//b
        hideLayerOverlay: _hideLayerOverlay,//E
        activateModule: tab_select,//W
        moduleIsReady: _moduleIsReady, //K
        moduleSetHeader: _moduleSetHeader, //q
        isAnyContainerMaximized: _isAnyContainerMaximized, //Q
        minimizeModule: tab_minimize,//J
        attachModule: _attachModule, //z
        removeModule: tab_remove, //H
        excludeModule: _excludeModule, //X
        moveToMaximizeContainer: _moveToMaximizeContainer, //de
        moveHiddenToMaximizeContainer: _moveHiddenToMaximizeContainer, //Se
        getModuleIsShown: _getModuleIsShown,//w
        getModuleIsHidden: _getModuleIsHidden, //_
        getModuleIsDetached: _getModuleIsDetached,//R
        getModuleIsActive: _getModuleIsActive, //k
        getModuleIsMaximized: _getModuleIsMaximized, //U
        getModuleGAPageViewPath: _getModuleGAPageViewPath,//L
        getActiveModuleBefore: _getActiveModuleBefore,//ue
        hideAvailableTabsDropdown: _hideAvailableTabsDropdown, //$,
        getModule : _getModule
    }


    qy.extend(true, window, {
        MAE: {
            LayoutService: _LayoutService
        }
    });



})(jQuery);