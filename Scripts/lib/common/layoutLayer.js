function LayoutLayer(id, modules, correctModuleIdFunc, buildModuleContentFunc, updateModuleHeaderLabelFunc, destroyModuleFunc) {
    this._id = id;
    this._modules = modules;
    this._correctModuleIdFunc = correctModuleIdFunc;
    this._buildModuleContentFunc = buildModuleContentFunc;
    this._updateModuleHeaderLabelFunc = updateModuleHeaderLabelFunc;
    this._destroyModuleFunc = destroyModuleFunc;
    this._containerRoot = null;
    this._containersShown = new MapWithCollection("id");
    this._containersModules = new MapWithCollection("id");
    this._modulesDetached = new MapWithCollection("id");
    this._modulesShown = new MapWithCollection("id");
    this._modulesHidden = new MapWithCollection("id");
}


LayoutLayer.prototype.getId = function () {
    return this._id
}
    ,
    LayoutLayer.prototype.getModules = function () {
        return this._modules
    }
    ,
    LayoutLayer.prototype.getModule = function (e) {
        return this._modules.getItem(e)
    }
    ,
    LayoutLayer.prototype.excludeModule = function (e) {

        this.removeModuleShown(e);
        this.removeModuleHidden(e);
        this.removeModuleDetached(e);
        return this._modules.removeItem(e)
    }
    ,
    LayoutLayer.prototype.getContainerRoot = function () {
        return this._containerRoot
    }
    ,
    LayoutLayer.prototype.buildContainerRoot = function (e, t) {
        this._containersShown.removeAll();
        this._modulesShown.removeAll();
        this._containerRoot = this.buildContainerShown(t, null, e);
    }
    ,
    LayoutLayer.prototype.destroyContainerRoot = function () {
        this.destroyContainerShown(this._containerRoot);
        this._containersShown.removeAll();
        this._modulesShown.removeAll();
    }
    ,
    LayoutLayer.prototype.getContainersShow = function () {
        return this._containersShown
    }
    ,
    LayoutLayer.prototype.buildContainerShown = function (e, t, i) {
        var s, a, o, r, n, l, d = i.type, u = i.percentSize, h = i.activeChildIndex;
        switch (d) {
            case ContainerDataType.HORIZONTAL:
            case ContainerDataType.VERTICAL:
                for (s = new ContainerData(e, t, d), s.percentSize = u, r = i.children, l = [], a = 0, o = r.length; a < o; a++)
                    n = this.buildContainerShown(e + "/" + a, e, r[a]), l.push(n);

                if (l.length > 0) {
                    if (1 === l.length) {
                        n = l[0]; n.parentId = t; n.percentSize = s.percentSize;
                        s = n;
                    }
                    else {
                        s.setActiveChildIndex(h);
                        s.children = l;
                        s.validateActiveChildIndex();
                        s.validateChildrenPercentSizes()
                    }
                }

                this._containersShown.addItem(s);
                break;
            case ContainerDataType.TABS:
            case ContainerDataType.MODULES:
                i.type = ContainerDataType.TABS;
                e = i.id || i.containerId;
                s = this.getContainerModules(e);
                s.parentId = t;
                s.percentSize = u;
                s.setActiveChildIndex(h);
                s.validateActiveChildIndex();
                this._containersShown.addItem(s);
                this.buildModulesShown(s.children);
                var c = s.getActiveChild();
                c && s.historyActiveUpdate(c)
        }
        return s
    }
    ,
    LayoutLayer.prototype.destroyContainerShown = function (e) {
        if (e) {
            var t, i, s, a, o = e.type;
            switch (o) {
                case ContainerDataType.HORIZONTAL:
                case ContainerDataType.VERTICAL:
                    for (a = e.children, t = 0, i = a.length; t < i; t++) {
                        s = a[t];
                        this.destroyContainerShown(s);
                    }

                    e.children = [];
                    this._containersShown.removeItem(e);
                    break;
                case ContainerDataType.TABS:
                    this.destroyModulesShown(e.children);
                    this._containersShown.removeItem(e);
            }
        }
    }
    ,
    LayoutLayer.prototype.getContainerShown = function (e) {
        return this._containersShown.getItem(e)
    }
    ,
    LayoutLayer.prototype.containerIsShown = function (e) {
        return Boolean(this._containersShown.getItem(e))
    }
    ,
    LayoutLayer.prototype.getContainerShownAllModules = function (e, t) {
        t = t || [];
        var i, s, a = e.children;
        switch (e.type) {
            case ContainerDataType.HORIZONTAL:
            case ContainerDataType.VERTICAL:
                for (i = 0,s = a.length; i < s; i++)
                    this.getContainerShownAllModules(a[i], t);
                break;
            case ContainerDataType.TABS:
                for (i = 0, s = a.length; i < s; i++)
                    t.push(a[i])
        }
        return t
    }
    ,
    LayoutLayer.prototype.getContainersModules = function () {
        return this._containersModules
    }
    ,
    LayoutLayer.prototype.buildAllContainerModules = function (e) {
        if (e) {
            this._containersModules.removeAll();
            var t, i;
            for (t in e) {
                if (e.hasOwnProperty(t)) {
                    i = e[t];
                    this.buildContainerModules(t, null, i)
                }

            }
            // e.hasOwnProperty(t) && (i = e[t], this.buildContainerModules(t, null, i))
        }
        for (var s, a, o = this._modulesDetached.getCollection(), r = 0, n = o.length; r < n; r++) {
            s = o[r];
            a = this.getContainerModules(s.parentId);
            if (a)
                a.removeChild(s);
        }
        // s = o[r],
        //     a = this.getContainerModules(s.parentId),
        //     a && a.removeChild(s)
    }
    ,
    LayoutLayer.prototype.buildContainerModules = function (e, t, i) {
        var s = new ContainerData(e, t, ContainerDataType.TABS);
        this._containersModules.addItem(s);
        for (var a, o, r, n, l = [], d = 0, u = i.length; d < u; d++) {
            a = i[d];
            o = a.id || a.moduleId;
            o = this._correctModuleIdFunc(o);
            r = this.getModule(o);
            if (r) {
                n = this.getContainerModules(r.parentId);
                if (n) {
                    if (n.getChildIndex(r) == -1) {
                        r.parentId = e;
                        r.activeChildIndex = a.activeChildIndex ? a.activeChildIndex : 0;

                        l.push(r);
                    }


                }

            }
            //     r && (n = this.getContainerModules(r.parentId), n && n.getChildIndex(r) !== -1 || 
            //     (r.parentId = e, r.activeChildIndex = a.activeChildIndex || 0, l.push(r)));
            // return s.children = l, s

        }
        //     a = i[d];
        // o = a.id || a.moduleId;
        // o = this._correctModuleIdFunc(o);
        // r = this.getModule(o);
        // r && (n = this.getContainerModules(r.parentId), n && n.getChildIndex(r) !== -1 || (r.parentId = e, r.activeChildIndex = a.activeChildIndex || 0, l.push(r)));
        s.children = l;
        return s;
    }
    ,
    LayoutLayer.prototype.destroyAllContainerModules = function () {
        for (var e, t = this._containersModules.getCollection(), i = 0, s = t.length; i < s; i++) {
            e = t[i];
            this.destroyContainerModules(e);
        }

        this._containersModules.removeAll();
    }
    ,
    LayoutLayer.prototype.destroyContainerModules = function (e) {
        e.children = []
    }
    ,
    LayoutLayer.prototype.getContainerModules = function (e) {
        return this._containersModules.getItem(e)
    }
    ,
    LayoutLayer.prototype.findShownContainerModules = function () {
        for (var e, t = this._containersModules.getCollection(), i = 0, s = t.length; i < s; i++) {
            e = t[i];
            if (this.containerIsShown(e.id))
                return e;
        }



        return null
    }
    ,
    LayoutLayer.prototype.addModuleIntoContainerModules = function (e, t, i) {
        var s = {
            success: false,
            actions: []
        };
        var a = e.getActiveChild();

        s.success = e.addChild(t, i);
        if (s.success) {
            t.parentId = e.id;
            if (a) {
                s.actions.push({
                    module: a,
                    action: LayoutAction.MODULE_DEACTIVATED
                });
            }

            e.setActiveChildIndexByChild(t);
        }

        return s;
    }
    ,
    LayoutLayer.prototype.removeModuleFromContainerModules = function (e, t) {
        var i = {
            success: !1,
            actions: []
        };
        var s = e.getActiveChild();

        i.success = e.removeChild(t);
        if (i.success && s === t) {
            s = e.getActiveChild();
            if (s) {
                i.actions.push({
                    module: s,
                    action: LayoutAction.MODULE_ACTIVATED
                });
            }
        }

        return i;
    }
    ,
    LayoutLayer.prototype.getModulesShown = function () {
        return this._modulesShown
    }
    ,
    LayoutLayer.prototype.buildModulesShown = function (e) {
        var t, i, s, a = e.concat();
        for (t = 0, i = a.length; t < i; t++) {
            s = a[t];

            if (e.indexOf(s) > -1) {
                this.addModuleShown(s);
                if (s.children) {
                    this._updateModuleHeaderLabelFunc(s);
                    s.validateActiveChildIndex();
                    this.buildModulesShown(s.children);
                }
                else {
                    this._buildModuleContentFunc(s);
                    this._updateModuleHeaderLabelFunc(s);
                }
            }
        }
        // e.indexOf(s) < -1 || 
        // (this.addModuleShown(s),s.children ? (s.validateActiveChildIndex(),this.buildModulesShown(s.children)) : this._buildModuleContentFunc(s),
        // this._updateModuleHeaderLabelFunc(s));
        a.length = 0;
    }
    ,
    LayoutLayer.prototype.destroyModulesShown = function (e) {
        var t, i, s;
        for (t = 0, i = e.length; t < i; t++) {
            s = e[t];
            if (s.children)
                this.destroyModulesShown(s.children);
            else
                this._destroyModuleFunc(s);

            this.removeModuleShown(s);
        }

    }
    ,
    LayoutLayer.prototype.addModuleShown = function (e) {
        this._modulesShown.addItem(e)
    }
    ,
    LayoutLayer.prototype.removeModuleShown = function (e) {
        this._modulesShown.removeItem(e)
    }
    ,
    LayoutLayer.prototype.getModuleShown = function (e) {
        return this._modulesShown.getItem(e)
    }
    ,
    LayoutLayer.prototype.getModulesHidden = function () {
        return this._modulesHidden
    }
    ,
    LayoutLayer.prototype.buildAllModulesHidden = function (e) {
        this._modulesHidden.removeAll();
        var t, i, s, a, o = this._modules.getCollection();
        for (t = 0, i = o.length; t < i; t++) {
            s = o[t];
            a = s.id;
            this.getModuleDetached(a) || this.getModuleShown(a) || (e || s.isSubModule || this.addModuleHidden(s),
                this._destroyModuleFunc(s),
                this._updateModuleHeaderLabelFunc(s));
        }

    }
    ,
    LayoutLayer.prototype.addModuleHidden = function (e) {
        this._modulesHidden.addItem(e)
    }
    ,
    LayoutLayer.prototype.removeModuleHidden = function (e) {
        this._modulesHidden.removeItem(e)
    }
    ,
    LayoutLayer.prototype.getModuleHidden = function (e) {
        return this._modulesHidden.getItem(e)
    }
    ,
    LayoutLayer.prototype.getModulesDetached = function () {
        return this._modulesDetached
    }
    ,
    LayoutLayer.prototype.buildAllModulesDetached = function (e) {
        if (e) {
            this._modulesDetached.removeAll();
            for (var t, i, s = 0, a = e.length; s < a; s++) {
                t = e[s];
                i = this.getModule(t.id);
                this.addModuleDetached(i);
                i.parentId = t.parentId;
                this._destroyModuleFunc(i);

            }

        }
    }
    ,
    LayoutLayer.prototype.addModuleDetached = function (e) {
        this._modulesDetached.addItem(e)
    }
    ,
    LayoutLayer.prototype.removeModuleDetached = function (e) {
        this._modulesDetached.removeItem(e)
    }
    ,
    LayoutLayer.prototype.getModuleDetached = function (e) {
        return this._modulesDetached.getItem(e)
    }
    ,
    LayoutLayer.prototype.removeSubmoduleFromModule = function (e, t) {
        var i = {
            success: false,
            actions: []
        }
        var s = e.getActiveChild();
        i.success = e.removeChild(t);

        if (i.success && s === t) {
            s = e.getActiveChild();
            if (s) {
                i.actions.push({
                    module: s,
                    action: LayoutAction.MODULE_ACTIVATED
                });
            }
        }

        return i;
    };