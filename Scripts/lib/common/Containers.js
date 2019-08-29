//Containers
(function (t) {
    var e = {
        RESIZE_CHILD_CONTAINER_REQUEST: "ContainerEvent.ResizeChildContainerRequest",
        CONTAINER_MIN_WIDTH_EXCEEDED: "ContainerEvent.ContainerMinWidthExceeded",
        CONTAINER_MIN_HEIGHT_EXCEEDED: "ContainerEvent.ContainerMinHeightExceeded",
        SIZE_CHANGED: "ContainerEvent.SizeChanged"
    };
    var i = {
        DIVIDER_MOVE: "dividerMove",
        DIVIDER_DROP: "dividerDrop"
    };
    var n = {
        WIDTH: "SizeProperty.Width",
        HEIGHT: "SizeProperty.Height"
    };
    t.extend(true, window, {
        MAE: {
            VDividedContainer: VDividedContainer, //d
            HDividedContainer: HDividedContainer, //h
            DividedContainer: DividedContainer, //s
            ContainerBase: ContainerBase, //a
            ComponentBase: ComponentBase, //r
            ContainerEvent: e,
            DividerEvent: i
        }
    });
    function o(t) {
        t.reduce(function (t, e, i, n) {
            if (i == n.length - 1 && t + e > 100) {
                n[i] = 100 - t
            }
            return t + e
        }, 0)
    }
    function ComponentBase(t) {
        this.id = t;
        this.DOMElement = null;
        this.constructorHTML = '<div style="mae-component"></div>';
        this.minWidth = 200;
        this.minHeight = 90
    }
    ComponentBase.prototype = {
        _createDOMElement: function () {
            this.DOMElement = t(this.constructorHTML)
        },
        getDOMElement: function () {
            if (!this.DOMElement) {
                this._createDOMElement();
                this.resize()
            }
            return this.DOMElement
        },
        setConstructorHTML: function (t) {
            this.constructorHTML = t
        },
        resize: function () { },
        getBoundingRect: function () {
            if (this.DOMElement) {
                return this.DOMElement.get(0).getBoundingClientRect()
            } else {
                return null
            }
        },
        destroy: function () {
            void 0;
            if (this.DOMElement) {
                this.DOMElement.remove();
                this.DOMElement = null
            }
        }
    };
    function ContainerBase(t) {
        ComponentBase.call(this, t);
        this.children = [];
        this.percentSize = 0;
        this.MIN_WIDTH = 200;
        this.MIN_HEIGHT = 90
    }
    ContainerBase.prototype = Object.create(ComponentBase.prototype);
    ContainerBase.prototype.constructor = ContainerBase.constructor;
    ContainerBase.prototype.setPercentSize = function (t) {
        this.percentSize = t;
        if (this.DOMElement) {
            this.DOMElement.trigger(e.SIZE_CHANGED)
        }
        if (MAE.LayoutOptions.DEBUG_COMPONENTS_MEASUREMENTS && this.updateDebugMeasurementsText) {
            this.updateDebugMeasurementsText()
        }
    }
        ;
    ContainerBase.prototype.getPercentSize = function () {
        return this.percentSize
    }
        ;
    ContainerBase.prototype.addChild = function (t, e, i) {
        i = i != undefined ? i : true;
        e = e != undefined ? e : this.children.length;
        this.children.splice(e, 0, t);
        if (i) {
            this.recalculateSizeConstraints()
        }
    }
        ;
    ContainerBase.prototype.recalculateSizeConstraints = function () {
        void 0;
        var t = 0;
        var i = 0;
        for (var n = 0; n < this.children.length; n++) {
            var o = this.children[n];
            if (o.minWidth > t) {
                t = o.minWidth
            }
            if (o.minHeight > i) {
                i = o.minHeight
            }
        }
        this.minWidth = t > this.MIN_WIDTH ? t : this.MIN_WIDTH;
        this.minHeight = i > this.MIN_HEIGHT ? i : this.MIN_HEIGHT;
        if (this.DOMElement) {
            if (this.minWidth > this.DOMElement.width()) {
                this.DOMElement.trigger(e.CONTAINER_MIN_WIDTH_EXCEEDED, [this.minWidth, this.id])
            }
            if (this.minHeight > this.DOMElement.height()) {
                this.DOMElement.trigger(e.CONTAINER_MIN_HEIGHT_EXCEEDED, [this.minHeight, this.id])
            }
        }
    }
        ;
    ContainerBase.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            this._createDOMElement();
            for (var t = 0; t < this.children.length; t++) {
                this.DOMElement.append(this.children[t].getDOMElement())
            }
            this.resize()
        }
        return this.DOMElement
    }
        ;
    ContainerBase.prototype.destroy = function () {
        void 0;
        for (var t = 0; t < this.children.length; t++) {
            var e = this.children[t];
            e.destroy()
        }
        r.prototype.destroy.call(this)
    }
        ;
    function DividedContainer(t) {
        ContainerBase.call(this, t);
        this.dividers = [];
        this.resizeConstraintReached = false
    }
    DividedContainer.prototype = Object.create(ContainerBase.prototype);
    DividedContainer.prototype.constructor = DividedContainer.constructor;
    DividedContainer.prototype.updateDividersPosition = function () {
        var t = 0;
        for (var e = 0; e < this.dividers.length; e++) {
            var i = this.dividers[e];
            t += this.children[e].getPercentSize();
            i.setPosition(t)
        }
    }
        ;
    DividedContainer.prototype.onDividerDrop = function (t, e) {
        t.stopPropagation();
        var i = this.dividers[e].getPosition();
        if (isNaN(i)) {
            return
        }
        var n = [];
        var o = 0;
        var r = 0;
        for (var a = 0; a < this.children.length; a++) {
            if (a == e) {
                r = i - o
            } else if (a == e + 1) {
                if (this.dividers.length > a) {
                    r = this.dividers[e + 1].getPosition() - o
                } else {
                    r = 100 - o
                }
            } else {
                r = this.children[a].getPercentSize()
            }
            n.push(r);
            o += r
        }
        this.setChildrenSize(n)
    }
        ;
    DividedContainer.prototype.setChildrenSize = function (t) {
        void 0;
        if (this.children.length != t.length) {
            void 0;
            return
        }
        var e = t.reduce(function (t, e) {
            return t + e
        }, 0);
        void 0;
        if (e > 100 && e - 100 > 5) {
            void 0;
            return
        } else if (e < 100 && 100 - e > 5) {
            void 0;
            return
        } else {
            o(t)
        }
        var i;
        var n = {};
        for (var r = 0; r < this.children.length; r++) {
            i = this.children[r];
            i.setPercentSize(t[r]);
            n[i.id] = t[r]
        }
        this.resize();
        this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.CONTAINERS_RESIZE, n)
    }
        ;
    DividedContainer.prototype.onDividerMove = function (t, e, i, n) {
        t.stopPropagation()
    }
        ;
    DividedContainer.prototype.initListeners = function () {
        this.DOMElement.on(i.DIVIDER_DROP, t.proxy(this.onDividerDrop, this));
        this.DOMElement.on(i.DIVIDER_MOVE, t.proxy(this.onDividerMove, this));
        this.DOMElement.on(e.CONTAINER_MIN_WIDTH_EXCEEDED, t.proxy(this.handlePreferredSizeRequest, this));
        this.DOMElement.on(e.CONTAINER_MIN_HEIGHT_EXCEEDED, t.proxy(this.handlePreferredSizeRequest, this));
        this.DOMElement.on(e.RESIZE_CHILD_CONTAINER_REQUEST, t.proxy(this.handleResizeChildContainerRequest, this))
    }
        ;
    DividedContainer.prototype.handlePreferredSizeRequest = function (t, e, i) {
        t.stopPropagation();
        this.forceChildSize(i, e)
    }
        ;
    DividedContainer.prototype.updateContainerDividers = function () {
        var t = this.children.length - 1 > 0 ? this.children.length - 1 : 0;
        var e;
        for (var i = 0; i < t; i++) {
            e = this.createDivider(i);
            this.dividers.push(e);
            this.DOMElement.append(e.getDOMElement())
        }
        this.updateDividersPosition()
    }
        ;
    DividedContainer.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            ContainerBase.prototype.getDOMElement.call(this);
            this.updateContainerDividers();
            this.initListeners()
        }
        return this.DOMElement
    }
        ;
    DividedContainer.prototype.handleResizeChildContainerRequest = function (t, e, i, o, r) {
        if (t) {
            t.stopPropagation()
        }
        var a = 0;
        var s = [];
        var d = [];
        var h = [];
        var l = 0;
        var c = 0;
        var u = [];
        var p = [];
        function f(t, e) {
            u[t] = u[t] + e;
            for (var i = 0; i < p.length; i++) {
                var n = p[i].index;
                var o = p[i].ratio;
                u[n] = u[n] - e * o
            }
        }
        if (this.DOMElement) {
            if (this.sizeProperty == n.WIDTH) {
                c = this.DOMElement.outerWidth()
            } else if (this.sizeProperty == n.HEIGHT) {
                c = this.DOMElement.outerHeight()
            } else {
                return
            }
            for (var v = 0; v < this.children.length; v++) {
                if (this.sizeProperty == n.WIDTH) {
                    a += this.children[v].minWidth;
                    s.push(this.children[v].minWidth);
                    d.push(this.children[v].DOMElement.outerWidth());
                    u.push(this.children[v].DOMElement.outerWidth());
                    this.minHeight = Math.max(this.minHeight, this.children[v].minHeight)
                } else if (this.sizeProperty == n.HEIGHT) {
                    a += this.children[v].minHeight;
                    s.push(this.children[v].minHeight);
                    d.push(this.children[v].DOMElement.outerHeight());
                    u.push(this.children[v].DOMElement.outerHeight());
                    this.minWidth = Math.max(this.minWidth, this.children[v].minWidth)
                } else {
                    return
                }
                var m = d[v] - s[v];
                h.push(m);
                if (m > 0) {
                    l += m
                }
            }
            if (a > c) {
                for (var b = 0; b < this.children.length; b++) {
                    u[b] = s[b] / a * 100
                }
                this.setChildrenSize(u)
            } else {
                for (var g = 0; g < this.children.length; g++) {
                    if (h[g] > 0) {
                        p.push({
                            index: g,
                            ratio: h[g] / l
                        })
                    }
                }
                for (g = 0; g < this.children.length; g++) {
                    if (h[g] < 0) {
                        f(g, -h[g])
                    }
                }
                for (g = 0; g < u.length; g++) {
                    u[g] = u[g] / c * 100
                }
                this.setChildrenSize(u)
            }
        }
        void 0;
        void 0;
        void 0
    }
        ;
    DividedContainer.prototype.destroy = function () {
        for (var t = 0; t < this.dividers.length; t++) {
            var e = this.dividers[t];
            e.destroy()
        }
        ContainerBase.prototype.destroy.call(this)
    }
        ;
    function VDividedContainer(t) {
        DividedContainer.call(this, t);
        this.setConstructorHTML('<div class="mae-vdivided-container"></div>');
        this.sizeProperty = n.HEIGHT
    }
    VDividedContainer.prototype = Object.create(DividedContainer.prototype);
    VDividedContainer.prototype.constructor = VDividedContainer.constructor;
    VDividedContainer.prototype.resize = function () {
        for (var t = 0; t < this.children.length; t++) {
            var e = this.children[t];
            var i = e.getPercentSize();
            e.DOMElement.css("height", i + "%");
            if (this.dividers.length > t) {
                this.dividers[t].setPosition(e.getPercentSize())
            }
        }
    }
        ;
    VDividedContainer.prototype.forceChildSize = function (t, e) {
        var i = e;
        var n = this.getBoundingRect().height;
        var o = e * 100 / n;
        void 0;
        var r = -1;
        var a = [];
        var s = [];
        var d = 0;
        var h;
        for (var l = 0; l < this.children.length; l++) {
            h = this.children[l];
            a.push(h.getBoundingRect().height);
            s.push(h.minHeight);
            d += h.minHeight;
            if (h.id == t) {
                r = l
            }
        }
        if (r == -1) {
            return
        }
        var c = a[r];
        var u = i - c;
        var p = u;
        void 0;
        void 0;
        var f = [];
        for (l = 0; l < this.children.length; l++) {
            h = this.children[l];
            if (h.id != t) {
                if (p > 0) {
                    var v = Math.max(h.minHeight, h.getBoundingRect().height - p);
                    f.push(v);
                    p -= h.getBoundingRect().height - v
                } else {
                    f.push(h.getBoundingRect().height)
                }
            } else {
                f.push(0)
            }
        }
        f[r] = c + (u - p);
        if (f[r] <= 0) {
            f[r] = this.children[r].minHeight
        }
        var m = f.reduce(function (t, e) {
            return t + e
        }, 0);
        if (m > n) {
            void 0;
            for (var b = 0; b < this.children.length; b++) {
                f[b] = n * (this.children[b].minHeight / d)
            }
        }
        void 0;
        var g = [];
        for (l = 0; l < f.length; l++) {
            g.push(f[l] * 100 / n)
        }
        this.setChildrenSize(g)
    }
        ;
    VDividedContainer.prototype.createDivider = function (t) {
        return new vDivider(t)
    }
        ;
    VDividedContainer.prototype.onDividerMove = function (t, e, i, n) {
        DividedContainer.prototype.onDividerMove.call(this, t, e, i, n);
        if (this.getBoundingRect().top < n && n < this.getBoundingRect().bottom) {
            var o;
            var r;
            var a = this.children[e];
            var d = this.children[e + 1];
            if (a.minHeight >= n - a.getBoundingRect().top) {
                this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_REACHED, a.id);
                this.resizeConstraintReached = true;
                o = this.getBoundingRect().top + a.minHeight - 5;
                if (o < this.getBoundingRect().height - d.minHeight) {
                    r = o / this.getBoundingRect().height * 100;
                    this.dividers[e].setPosition(r)
                }
                return
            }
            if (n + d.minHeight >= d.getBoundingRect().bottom) {
                this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_REACHED, d.id);
                this.resizeConstraintReached = true;
                o = this.getBoundingRect().bottom - d.minHeight - 5;
                if (o > this.getBoundingRect().bottom + a.minHeight) {
                    r = o / this.getBoundingRect().height * 100;
                    this.dividers[e].setPosition(r)
                }
                return
            }
            if (this.resizeConstraintReached) {
                this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_RELEASED, d.id)
            }
            this.resizeConstraintReached = false;
            r = (n - this.getBoundingRect().top) / this.getBoundingRect().height * 100;
            this.dividers[e].setPosition(r)
        }
    }
        ;
    function HDividedContainer(t) {
        DividedContainer.call(this, t);
        this.setConstructorHTML('<div class="xs-hdivided-container"></div>');
        this.sizeProperty = n.WIDTH
    }
    HDividedContainer.prototype = Object.create(DividedContainer.prototype);
    HDividedContainer.prototype.constructor = HDividedContainer.constructor;
    HDividedContainer.prototype.resize = function () {
        for (var t = 0; t < this.children.length; t++) {
            var e = this.children[t];
            var i = e.getPercentSize();
            e.DOMElement.css("width", i + "%");
            e.DOMElement.css("float", "left");
            if (this.dividers.length > t) {
                this.dividers[t].setPosition(e.getPercentSize())
            }
        }
    }
        ;
    HDividedContainer.prototype.forceChildSize = function (t, e) {
        var i = e;
        var n = this.getBoundingRect().width;
        var o = e * 100 / n;
        void 0;
        var r = -1;
        var a = [];
        var s = [];
        var d = 0;
        var h;
        for (var l = 0; l < this.children.length; l++) {
            h = this.children[l];
            a.push(h.getBoundingRect().width);
            s.push(h.minWidth);
            d += h.minWidth;
            if (h.id == t) {
                r = l
            }
        }
        if (r == -1) {
            return
        }
        var c = a[r];
        var u = i - c;
        var p = u;
        void 0;
        void 0;
        var f = [];
        for (l = 0; l < this.children.length; l++) {
            h = this.children[l];
            if (h.id != t) {
                if (p > 0) {
                    var v = Math.max(h.minWidth, h.getBoundingRect().width - p);
                    f.push(v);
                    p -= h.getBoundingRect().width - v
                } else {
                    f.push(h.getBoundingRect().width)
                }
            } else {
                f.push(0)
            }
        }
        f[r] = c + (u - p);
        if (f[r] <= 0) {
            f[r] = this.children[r].minWidth
        }
        var m = f.reduce(function (t, e) {
            return t + e
        }, 0);
        if (m > n) {
            void 0;
            for (var b = 0; b < this.children.length; b++) {
                void 0;
                f[b] = n * (this.children[b].minWidth / d)
            }
        }
        void 0;
        var g = [];
        for (l = 0; l < f.length; l++) {
            g.push(f[l] * 100 / n)
        }
        this.setChildrenSize(g)
    }
        ;
    HDividedContainer.prototype.createDivider = function (t) {
        return new hDivider(t)
    }
        ;
    HDividedContainer.prototype.onDividerMove = function (t, e, i, n) {
        DividedContainer.prototype.onDividerMove.call(this, t, e, i, n);
        if (this.getBoundingRect().left < i && i < this.getBoundingRect().right) {
            var o;
            var r = this.children[e];
            var a = this.children[e + 1];
            var d;
            if (r.minWidth >= i - r.getBoundingRect().left) {
                this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_REACHED, r.id);
                this.resizeConstraintReached = true;
                d = this.getBoundingRect().left + r.minWidth - 5;
                if (d < this.getBoundingRect().width - a.minWidth) {
                    o = d / this.getBoundingRect().width * 100;
                    this.dividers[e].setPosition(o)
                }
                return
            }
            if (i + a.minWidth >= a.getBoundingRect().right) {
                this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_REACHED, a.id);
                this.resizeConstraintReached = true;
                d = this.getBoundingRect().right - a.minWidth - 5;
                if (d > this.getBoundingRect().left + r.minWidth) {
                    o = d / this.getBoundingRect().width * 100;
                    this.dividers[e].setPosition(o)
                }
                return
            }
            if (this.resizeConstraintReached) {
                this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.RESIZE_CONSTRAINT_RELEASED, a.id)
            }
            this.resizeConstraintReached = false;
            o = (i - this.getBoundingRect().left) / this.getBoundingRect().width * 100;
            this.dividers[e].setPosition(o)
        }
    }
        ;
    function Divider(t) { //l
        ComponentBase.call(this, t);
        this.setConstructorHTML('<div class="xs-divider"></div>');
        this.mouseDownEventProxyHandler = null;
        this.mouseUpEventProxyHandler = null;
        this.mouseMoveEventProxyHandler = null;
        this.percentagePosition = 0
    }
    Divider.prototype = Object.create(ComponentBase.prototype);
    Divider.prototype.constructor = Divider.constructor;
    Divider.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            ComponentBase.prototype.getDOMElement.call(this);
            this.initListeners()
        }
        return this.DOMElement
    }
        ;
    Divider.prototype.initListeners = function () {
        this.mouseDownEventProxyHandler = t.proxy(this.mouseDownHandler, this);
        this.DOMElement.mousedown(this.mouseDownEventProxyHandler)
    }
        ;
    Divider.prototype.mouseDownHandler = function (e) {
        e.preventDefault();
        this.DOMElement.removeClass(this.cssClass);
        this.DOMElement.addClass(this.cssDragClass);
        this.mouseMoveEventProxyHandler = t.proxy(this.mouseMoveHandler, this);
        this.mouseUpEventProxyHandler = t.proxy(this.mouseUpHandler, this);
        t(document).mousemove(this.mouseMoveEventProxyHandler);
        t(document).mouseup(this.mouseUpEventProxyHandler)
    }
        ;
    Divider.prototype.mouseUpHandler = function () {
        this.DOMElement.removeClass(this.cssDragClass);
        this.DOMElement.addClass(this.cssClass);
        t(document).off("mousemove", this.mouseMoveEventProxyHandler);
        t(document).off("mouseup", this.mouseUpEventProxyHandler);
        this.DOMElement.trigger(i.DIVIDER_DROP, this.id)
    }
        ;
    Divider.prototype.mouseMoveHandler = function (t) {
        if (!t) {
            t = window.event
        }
        this.DOMElement.trigger(i.DIVIDER_MOVE, [this.id, t.clientX, t.clientY])
    }
        ;
    Divider.prototype.destroy = function () { //l
        t(document).off("mousedown", this.mouseDownEventProxyHandler);
        t(document).off("mousemove", this.mouseMoveEventProxyHandler);
        t(document).off("mouseup", this.mouseUpEventProxyHandler);
        ComponentBase.prototype.destroy.call(this)
    }
        ;
    function vDivider(t) {//c
        Divider.call(this, t);
        this.cssClass = "xs-vertical-divider";
        this.cssDragClass = "xs-dragged-vertical-divider";
        this.setConstructorHTML('<div class="xs-divider xs-vdivider"><div></div></div>');
        this.dragOffset = 0
    }
    vDivider.prototype = Object.create(Divider.prototype);
    vDivider.prototype.constructor = vDivider.constructor;
    vDivider.prototype.mouseDownHandler = function (t) {
        Divider.prototype.mouseDownHandler.call(this, t);
        this.dragOffset = Math.abs(t.clientY - this.DOMElement.get(0).getBoundingClientRect().top)
    }
        ;
    vDivider.prototype.mouseMoveHandler = function (t) {
        if (!t) {
            t = window.event
        }
        this.DOMElement.trigger(i.DIVIDER_MOVE, [this.id, t.clientX, t.clientY - this.dragOffset])
    }
        ;
    vDivider.prototype.setPosition = function (t) {
        this.percentagePosition = t;
        this.getDOMElement().css("top", t + "%")
    }
        ;
    vDivider.prototype.getPosition = function () {
        return this.percentagePosition
    }
        ;
    function hDivider(t) {//u
        Divider.call(this, t);
        this.cssClass = "xs-horizontal-divider";
        this.cssDragClass = "xs-dragged-horizontal-divider";
        this.setConstructorHTML('<div class="xs-divider xs-hdivider"></div>')
    }
    hDivider.prototype = Object.create(Divider.prototype);
    hDivider.prototype.constructor = hDivider.constructor;
    hDivider.prototype.setPosition = function (t) {
        this.percentagePosition = t;
        this.getDOMElement().css("left", t + "%")
    }
        ;
    hDivider.prototype.getPosition = function () {
        return this.percentagePosition
    }
}
)(jQuery);



//otros Containers
(function (t) {
    var e = {
        CLOSE_TAB: "closeTab",
        TOGGLE_MAXIMIZE: "toggleMaximize",
        DETACH_TAB: "detachTab",
        MODULE_TAB_DRAG_END: "moduleTabDragEnd",
        ADD_MODULE: "addModule"
    };
    var i = {
        BEFORE_TAB: "beforeTab",
        AFTER_TAB: "afterTab",
        LAST_TAB: "lastTab"
    };
    t.extend(true, window, {
        MAE: {
            TabbedContainer: _TabbedContainer, //s,
            SubmodulesContainer: _SubmodulesContainer,//d,
            ModuleContainer: _ModuleContainer,//h,
            TabEvent: e,
            TabDragPosition: i
        }
    });
    function n(t) {
        var e = t[0].getBoundingClientRect();
        return e.top < 10 && e.right + 10 > window.innerWidth
    }
    function o(t) {
        t.css("display", "none")
    }
    function r(t) {
        t.css("display", "initial")
    }
    function a(t, e) {
        if (t) {
            t.css("right", "");
            if (e) {
                t.css("left", "-5px")
            } else {
                t.css("left", "0px")
            }
        } else {
            void 0;
            void 0
        }
    }
    function _TabbedContainer(e, i) {
        MAE.ContainerBase.call(this, e);
        this.tabs = [];
        this.activeTabIndex = i;
        this.isMaximized = false;
        this.availableTabs = [];
        this.addTabDropdown = null;
        this.addTabButtonElement = null;
        this.tabNavigation = null;
        this.preferredTabNavigationWidth = 0;
        this.debugMinWidthText = null;
        if (MAE.LayoutOptions.DEBUG_COMPONENTS_MEASUREMENTS) {
            this.debugMinWidthText = t('<label style="position: absolute; bottom: 1px; right: 9px; background: white; padding: 3px">300px</label>');
            this.debugMinWidthText.click(t.proxy(this.recalculateSizeConstraints, this))
        }
        this.setConstructorHTML('<div class="xs-tabbed-container">' + '<div class="xs-tab-nav-container">' + '<ul class="xs-tab-nav"></ul>' + "</div>" + '<div class="xs-tabbed-container-background">' + '<div class="xs-empty-module-container-div">' + '<div class="xs-empty-module-container-text">' + '<h5 class="xs-empty-module-container-text-title"></h5>' + '<p class="xs-empty-module-container-text-desc"></p>' + "</div>" + "</div>" + "</div>" + "</div>")
    }
    _TabbedContainer.prototype = Object.create(MAE.ContainerBase.prototype);
    _TabbedContainer.prototype.constructor = _TabbedContainer.constructor;
    _TabbedContainer.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            MAE.ContainerBase.prototype.getDOMElement.call(this);
            for (var t = 0; t < this.tabs.length; t++) {
                var e = this.tabs[t];
                this.renderTab(e)
            }
            this.addTabListeners();
            this.initAddTabDropdown();
            this.initEmptyContainerText();
            this.selectTab(this.activeTabIndex);
            this._updateAvailableTabsBtnVisibility();
            this.tabNavigation = this.DOMElement.find(".xs-tab-nav")
        }
        if (MAE.LayoutOptions.DEBUG_COMPONENTS_MEASUREMENTS) {
            this.DOMElement.append(this.debugMinWidthText)
        }
        return this.DOMElement
    }
        ;
    _TabbedContainer.prototype.initEmptyContainerText = function () {
        var t = MAE.LayoutTranslations["LAYOUT.EMPTY_CONTAINER"];
        var e = MAE.LayoutTranslations["LAYOUT.ADD_MODULE_OR_CHANGE_LAYOUT"];
        this.DOMElement.find(".xs-empty-module-container-text-title").html(t);
        this.DOMElement.find(".xs-empty-module-container-text-desc").html(e)
    }
        ;
    _TabbedContainer.prototype.initAddTabDropdown = function () {
        this.addTabDropdown = new _tabDropdown(this.id + "_addTabDropdown");
        this.DOMElement.find(".xs-tab-nav").append(this.addTabDropdown.getDOMElement());
        this.addTabButtonElement = this.DOMElement.find(".xs-add-tab-dropdown-btn")
    }
        ;
    _TabbedContainer.prototype.setAvailableTabs = function (e, i) {
        this.availableTabs = e;
        this.addTabDropdown.updateList(e);
        if (this._updateAvailableTabsBtnVisibility()) {
            if (i) {
                setTimeout(t.proxy(this.recalculateSizeConstraints, this), 0)
            }
        }
    }
        ;
    _TabbedContainer.prototype._updateAvailableTabsBtnVisibility = function () {
        var t = this.DOMElement.find(".xs-add-tab-dropdown-btn");
        var e = t.is(":visible");
        if (this.availableTabs.length > 0) {
            if (!e) {
                this.DOMElement.find(".xs-add-tab-dropdown-btn").show();
                return true
            }
        } else {
            if (e) {
                this.DOMElement.find(".xs-add-tab-dropdown-btn").hide();
                return true
            }
        }
        return false
    }
        ;
    _TabbedContainer.prototype.addTab = function (t, e) {
        e = e != undefined ? e : this.tabs.length;
        this.tabs.splice(e, 0, t)
    }
        ;
    _TabbedContainer.prototype.addChild = function (e, i, n) {
        MAE.ContainerBase.prototype.addChild.call(this, e, i, n);
        n = n != undefined ? n : true;
        this.addTab(this.createTab(e), i);
        if (n) {
            setTimeout(t.proxy(this.recalculateSizeConstraints, this), 0)
        }
    }
        ;
    _TabbedContainer.prototype.renderTab = function (e, i) {
        var n = this.DOMElement.find(".xs-tab-nav");
        var o = n.find(".xs-tab");
        var r = n.find(".xs-add-tab-dropdown-btn");
        if (i == undefined || o.length == 0) {
            if (r.length > 0) {
                r.before(e.getDOMElement())
            } else {
                n.append(e.getDOMElement())
            }
        } else {
            if (i + 1 > this.tabs.length - 1) {
                n.find(".xs-tab:nth-child(" + i + ")").after(e.getDOMElement())
            } else {
                n.find(".xs-tab:nth-child(" + (i + 1) + ")").before(e.getDOMElement())
            }
        }
        e.getDOMElement().on("mousedown", {
            moduleId: e.id
        }, t.proxy(this.onTabClicked, this));
        e.updateHeader()
    }
        ;
    _TabbedContainer.prototype.onTabClicked = function (t) {
        var e = this._getTabIndex(t.data.moduleId);
        if (this.activeTabIndex != e) {
            this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_SELECT, [t.data.moduleId])
        }
    }
        ;
    _TabbedContainer.prototype.getActiveModuleId = function () {
        if (this.children.length > 0 && this.children.length > this.activeTabIndex) {
            var t = this.children[this.activeTabIndex];
            return t.id
        } else {
            return null
        }
    }
        ;
    _TabbedContainer.prototype.selectTab = function (t, Z) {
        if (t != -1 && this.tabs.length > 0 && this.tabs.length > t) {
            this.activeTabIndex = t;
            this._updateActiveTab(Z);
        }
    }
        ;
    _TabbedContainer.prototype._updateTabContent = function (t, e) {
        if (t != -1 && this.children.length > 0 && this.children.length > t) {
            var i = this.children[t];
            i.updateContent(e)
        }
    }
        ;
    _TabbedContainer.prototype._updateTabHeader = function (t, e, i) {
        if (t != -1 && this.children.length > 0 && this.children.length > t) {
            var n = this.tabs[t];
            n.header = e;
            n.headerTooltip = i;
            n.updateHeader()
        }
    }
        ;
    _TabbedContainer.prototype.selectModule = function (t,Z) {
        var e = this._getTabIndex(t);
        this.selectTab(e, Z);
    }
        ;
    _TabbedContainer.prototype.setModuleContent = function (t, e) {
        var i = this._getTabIndex(t);
        this._updateTabContent(i, e)
    }
        ;
    _TabbedContainer.prototype.setTabHeader = function (t, e, i, n) {
        var o = this._getTabIndex(t);
        if (i && i instanceof jQuery) {
            this._updateTabHeader(o, i, n)
        } else {
            this._updateTabHeader(o, e, n)
        }
    }
        ;
    _TabbedContainer.prototype._getTabIndex = function (t) {
        for (var e = 0; e < this.tabs.length; e++) {
            if (this.tabs[e].id == t) {
                return e
            }
        }
        return -1
    }
        ;
    _TabbedContainer.prototype.changeTabIndex = function (e, i) {
        var n = this._getTabIndex(e);
        if (n == -1 || n == i) {
            return
        }
        var o = this.DOMElement.find(".xs-tab-nav");
        var r = this.tabs.splice(n, 1)[0];
        var a = this.children.splice(n, 1)[0];
        var s = t(o.children()[n]).detach();
        this.tabs.splice(i, 0, r);
        this.children.splice(i, 0, a);
        o.find(".ui-droppable:nth-child(" + (i + 1) + ")").before(s);
        this.selectTab(i)
    }
        ;
    _TabbedContainer.prototype.detachModuleContainer = function (e) {
        var i = this._getTabIndex(e);
        if (i == -1) {
            return
        }
        var n = this.children.splice(i, 1)[0];
        n.DOMElement.removeClass("xs-tab-module-container-active");
        n.DOMElement.detach();
        this._removeTab(i);
        setTimeout(t.proxy(this.recalculateSizeConstraints, this), 0);
        return n
    }
        ;
    _TabbedContainer.prototype.createTab = function (t) {
        var e;
        if (t.moduleData.headerElement && t.moduleData.headerElement instanceof jQuery) {
            e = t.moduleData.headerElement
        } else {
            e = t.moduleData.headerLabel
        }
        return new _tab(t.id, e, t.moduleData.headerTooltip, t.moduleData.isDetachable, this.isMaximized)
    }
        ;
    _TabbedContainer.prototype.insertModuleContainer = function (e, i) {
        var n = this.createTab(e);
        this.children.splice(i, 0, e);
        this.DOMElement.append(e.getDOMElement());
        if (MAE.LayoutOptions.DEBUG_COMPONENTS_MEASUREMENTS) {
            this.DOMElement.append(this.debugMinWidthText)
        }
        this.addTab(n, i);
        this.renderTab(n, i);
        this.selectTab(i);
        setTimeout(t.proxy(this.recalculateSizeConstraints, this), 0)
    }
        ;
    _TabbedContainer.prototype.addModuleContainer = function (t) {
        var e;
        if (t.children && t.children.length > 0) {
            e = new d(t.id, t, t.activeChildIndex);
            var i;
            var n;
            for (var o = 0; o < t.children.length; o++) {
                i = t.children[o];
                n = new h(i.id, i);
                e.addChild(n, undefined, false)
            }
        } else {
            e = new _ModuleContainer(t.id, t)
        }
        this.insertModuleContainer(e, this.children.length)
    }
        ;
    _TabbedContainer.prototype.getPreferredTabNavigationWidth = function () {
        var e = 0;
        if (this.DOMElement) {
            if (n(this.DOMElement)) {
                e = t(".xs-toolbar").width() + 20 || 280
            }
        }
        var i = 0;
        var o = false;
        if (this.tabNavigation) {
            if (MAE.LayoutOptions.DEBUG_NAVIGATION_PREFERRED_SIZE_CALCULATIONS) {
                void 0
            }
            this.tabNavigation.children().each(function (t, e) {
                var n = 0;
                var r = e.getElementsByClassName("xs-tab-header-text");
                if (r.length > 0) {
                    var a = r[0];
                    n = a ? a.scrollWidth - a.offsetWidth : 0;
                    if (n > 0) {
                        o = true
                    }
                    if (MAE.LayoutOptions.DEBUG_NAVIGATION_PREFERRED_SIZE_CALCULATIONS) {
                        void 0
                    }
                } else { }
                i += Math.ceil(e.getBoundingClientRect().width) + n
            })
        }
        if (o) { }
        var r = this.tabNavigation ? i + 10 + e : 0;
        return r
    }
        ;
    _TabbedContainer.prototype.updateDebugMeasurementsText = function () {
        this.debugMinWidthText.text(this.minWidth + "px" + " (" + this.percentSize.toFixed(2) + "%)")
    }
        ;
    _TabbedContainer.prototype.recalculateSizeConstraints = function (t) {
        t = t != undefined ? t : true;
        void 0;
        var e = 0;
        var i = 0;
        for (var n = 0; n < this.children.length; n++) {
            var o = this.children[n];
            if (o.minWidth > e) {
                e = o.minWidth
            }
            if (o.minHeight > i) {
                i = o.minHeight
            }
        }
        var r = 5;
        var a = 30;
        e = e + 2 * r;
        i = i + 2 * r + a;
        this.minWidth = e > this.MIN_WIDTH ? e : this.MIN_WIDTH;
        this.minHeight = i > this.MIN_HEIGHT ? i : this.MIN_HEIGHT;
        this.preferredTabNavigationWidth = this.getPreferredTabNavigationWidth();
        if (MAE.LayoutOptions.FORCE_TAB_NAVIGATION_PREFERRED_SIZE) {
            this.minWidth = Math.max(this.minWidth, this.preferredTabNavigationWidth)
        }
        if (MAE.LayoutOptions.DEBUG_COMPONENTS_MEASUREMENTS) {
            this.updateDebugMeasurementsText()
        }
        if (this.DOMElement && t && !this.isMaximized) {
            this.DOMElement.trigger(MAE.ContainerEvent.RESIZE_CHILD_CONTAINER_REQUEST, [this.id, this.minWidth, this.minHeight, this.preferredTabNavigationWidth])
        }
    }
        ;
    _TabbedContainer.prototype.toggleMaximize = function (t) {
        if (this.isMaximized) {
            this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_MINIMIZE, [t])
        } else {
            this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_MAXIMIZE, [t])
        }
    }
        ;
    _TabbedContainer.prototype.detachTab = function (t) {
        this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_DETACH, [t, this.DOMElement.width(), this.DOMElement.height()])
    }
        ;
    _TabbedContainer.prototype.maximize = function () {
        this.isMaximized = true;
        this.DOMElement.addClass("xs-maximized-tabbed-container");
        this.DOMElement.removeClass("xs-hidden-tabbed-container");
        var e = MAE.LayoutTranslations["LAYOUT.MINIMALIZE"];
        this.DOMElement.find(".xs-tab-fullscreen-btn").each(function () {
            t(this).prop("title", e)
        })
    }
        ;
    _TabbedContainer.prototype.hide = function () {
        this.isMaximized = false;
        this.DOMElement.removeClass("xs-maximized-tabbed-container");
        this.DOMElement.addClass("xs-hidden-tabbed-container")
    }
        ;
    _TabbedContainer.prototype.minimize = function () {
        this.isMaximized = false;
        this.DOMElement.removeClass("xs-maximized-tabbed-container");
        this.DOMElement.removeClass("xs-hidden-tabbed-container");
        var e = MAE.LayoutTranslations["LAYOUT.MAXIMIZE"];
        this.DOMElement.find(".xs-tab-fullscreen-btn").each(function () {
            t(this).prop("title", e)
        })
    }
        ;
    _TabbedContainer.prototype.onCloseTab = function (t, e) {
        t.stopPropagation();
        this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_REMOVE, [e])
    }
        ;
    _TabbedContainer.prototype.onToggleMaximize = function (t, e) {
        t.stopPropagation();
        this.toggleMaximize(e)
    }
        ;
    _TabbedContainer.prototype.onDetachTab = function (t, e) {
        t.stopPropagation();
        this.detachTab(e)
    }
        ;
    _TabbedContainer.prototype.onTabDragEnd = function (t, e, n, o) {
        t.stopPropagation();
        var r;
        switch (o) {
            case i.BEFORE_TAB:
                r = this.findTabIndex(n);
                break;
            case i.AFTER_TAB:
                r = this.findTabIndex(n) + 1;
                break;
            case i.LAST_TAB:
                r = this.tabs.length;
                break;
            default:
        }
        this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_MOVE, [e, this.id, r])
    }
        ;
    _TabbedContainer.prototype.onAddModule = function (t, e) {
        t.stopPropagation();
        this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_ADD, [e, this.id])
    }
        ;
    _TabbedContainer.prototype.onSizeChanged = function () {
        void 0;
        if (n(this.DOMElement)) {
            var e = t(".xs-toolbar");
            var i = e.length > 0 ? e.width() + 5 : 0;
            this.tabNavigation.css("padding-right", i + "px")
        } else {
            this.tabNavigation.css("padding-right", "0")
        }
    }
        ;
    _TabbedContainer.prototype.addTabListeners = function () {
        this.DOMElement.on(e.CLOSE_TAB, t.proxy(this.onCloseTab, this));
        this.DOMElement.on(e.TOGGLE_MAXIMIZE, t.proxy(this.onToggleMaximize, this));
        this.DOMElement.on(e.DETACH_TAB, t.proxy(this.onDetachTab, this));
        this.DOMElement.on(e.MODULE_TAB_DRAG_END, t.proxy(this.onTabDragEnd, this));
        this.DOMElement.on(e.ADD_MODULE, t.proxy(this.onAddModule, this));
        this.DOMElement.on(MAE.ContainerEvent.SIZE_CHANGED, t.proxy(this.onSizeChanged, this))
    }
        ;
    _TabbedContainer.prototype.removeTabListeners = function () {
        this.DOMElement.off()
    }
        ;
    _TabbedContainer.prototype.findTabIndex = function (t) {
        for (var e = 0; e < this.tabs.length; e++) {
            if (t == this.tabs[e].id) {
                return e;
            }
        }
        return -1
    }
        ;
    _TabbedContainer.prototype._removeTab = function (t) {
        if (t >= 0 && t < this.tabs.length) {
            var e = this.tabs.splice(t, 1)[0];
            e.destroy()
        }
        if (t == this.activeTabIndex) {
            var i = t - 1;
            i = i < 0 ? 0 : i;
            this.selectTab(i)
        }
    }
        ;
    _TabbedContainer.prototype._removeModuleContainer = function (t) {
        if (t >= 0 && t < this.tabs.length) {
            var e = this.children.splice(t, 1)[0];
            e.destroy()
        }
    }
        ;
    _TabbedContainer.prototype.closeTab = function (e) {
        this._removeModuleContainer(e);
        this._removeTab(e);
        setTimeout(t.proxy(this.recalculateSizeConstraints, this), 0)
    }
        ;
    _TabbedContainer.prototype.removeModule = function (t) {
        var e = this._getTabIndex(t);
        if (e != -1) {
            this.closeTab(e)
        }
    }
        ;
    _TabbedContainer.prototype._updateActiveTab = function (Z) {
        for (var t = 0; t < this.tabs.length; t++) {
            var e = this.tabs[t];
            var i = this.children[t];
            if (t == this.activeTabIndex) {
                e.DOMElement.addClass("xs-tab-active");
                i.DOMElement.addClass("xs-tab-module-container-active");
                if (Z)
                    e.DOMElement.addClass("xs-tab-notify-circle");
                else
                    e.DOMElement.removeClass("xs-tab-notify-circle");

            } else {
                e.DOMElement.removeClass("xs-tab-active");
                i.DOMElement.removeClass("xs-tab-module-container-active");
            }
        }
    }
        ;
    _TabbedContainer.prototype.resize = function () { }
        ;
    _TabbedContainer.prototype.destroy = function () {
        for (var t = 0; t < this.tabs.length; t++) {
            var e = this.tabs[t];
            e.destroy()
        }
        MAE.ContainerBase.prototype.destroy.call(this)
    }
        ;
    function _SubmodulesContainer(t, e, i) {
        MAE.ContainerBase.call(this, t);
        this.moduleData = e;
        this.minWidth = e.minWidth;
        this.minHeight = e.minHeight;
        this.tabs = [];
        this.activeTabIndex = i >= 0 ? i : 0;
        this.isMaximized = false;
        this.tabNavigation = null;
        this.setConstructorHTML('<div class="xs-submodules-container">' + '<div class="xs-submodules-tab-nav-container">' + '<div class="xs-submodules-tab-nav"></div>' + "</div>" + '<div class="xs-submodules-container-background">' + "</div>" + "</div>")
    }
    _SubmodulesContainer.prototype = Object.create(MAE.ContainerBase.prototype);
    _SubmodulesContainer.prototype.constructor = _SubmodulesContainer.constructor;
    _SubmodulesContainer.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            MAE.ContainerBase.prototype.getDOMElement.call(this);
            for (var t = 0; t < this.tabs.length; t++) {
                var e = this.tabs[t];
                this.renderTab(e)
            }
            this.addTabListeners();
            this.selectTab(this.activeTabIndex);
            this.tabNavigation = this.DOMElement.find(".xs-submodules-tab-nav")
        }
        return this.DOMElement
    }
        ;
    _SubmodulesContainer.prototype.addTab = function (t, e) {
        e = e != undefined ? e : this.tabs.length;
        this.tabs.splice(e, 0, t)
    }
        ;
    _SubmodulesContainer.prototype.addChild = function (e, i, n) {
        MAE.ContainerBase.prototype.addChild.call(this, e, i, n);
        n = n != undefined ? n : true;
        this.addTab(this.createTab(e), i);
        if (n) {
            setTimeout(t.proxy(this.recalculateSizeConstraints, this), 0)
        }
    }
        ;
    _SubmodulesContainer.prototype._removeTab = function (t) {
        if (t >= 0 && t < this.tabs.length) {
            var e = this.tabs.splice(t, 1)[0];
            e.destroy()
        }
        if (t == this.activeTabIndex) {
            var i = t - 1;
            i = i < 0 ? 0 : i;
            this.selectTab(i)
        }
    }
        ;
    _SubmodulesContainer.prototype._removeModuleContainer = function (t) {
        if (t >= 0 && t < this.tabs.length) {
            var e = this.children.splice(t, 1)[0];
            e.destroy()
        }
    }
        ;
    _SubmodulesContainer.prototype.closeTab = function (t) {
        this._removeModuleContainer(t);
        this._removeTab(t)
    }
        ;
    _SubmodulesContainer.prototype.removeModule = function (t) {
        var e = this._getTabIndex(t);
        if (e != -1) {
            this.closeTab(e)
        }
    }
        ;
    _SubmodulesContainer.prototype.renderTab = function (e, i) {
        var n = this.DOMElement.find(".xs-submodules-tab-nav");
        var o = n.find(".xs-submodule-tab");
        if (i == undefined || o.length == 0) {
            n.append(e.getDOMElement())
        } else {
            if (i + 1 > this.tabs.length - 1) {
                n.find(".xs-submodule-tab:nth-child(" + i + ")").after(e.getDOMElement())
            } else {
                n.find(".xs-submodule-tab:nth-child(" + (i + 1) + ")").before(e.getDOMElement())
            }
        }
        e.getDOMElement().on("mousedown", {
            moduleId: e.id
        }, t.proxy(this.onTabClicked, this));
        e.updateHeader()
    }
        ;
    _SubmodulesContainer.prototype.onTabClicked = function (t) {
        var e = this._getTabIndex(t.data.moduleId);
        if (this.activeTabIndex != e) {
            this.DOMElement.trigger(MAE.LayoutChangeRequestEvent.TAB_SELECT, [t.data.moduleId])
        }
    }
        ;
    _SubmodulesContainer.prototype._getTabIndex = function (t) {
        for (var e = 0; e < this.tabs.length; e++) {
            if (this.tabs[e].id == t) {
                return e
            }
        }
        return -1
    }
        ;
    _SubmodulesContainer.prototype.createTab = function (t) {
        var e;
        if (t.moduleData.headerElement && t.moduleData.headerElement instanceof jQuery) {
            e = t.moduleData.headerElement
        } else {
            e = t.moduleData.headerLabel
        }
        return new _submoduleTab(t.id, e, t.moduleData.headerTooltip, t.moduleData.isDetachable)
    }
        ;
    _SubmodulesContainer.prototype.addTabListeners = function () {
        this.DOMElement.on(e.CLOSE_TAB, t.proxy(this.onCloseTab, this));
        this.DOMElement.on(e.TOGGLE_MAXIMIZE, t.proxy(this.onToggleMaximize, this));
        this.DOMElement.on(e.DETACH_TAB, t.proxy(this.onDetachTab, this));
        this.DOMElement.on(e.MODULE_TAB_DRAG_END, t.proxy(this.onTabDragEnd, this));
        this.DOMElement.on(e.ADD_MODULE, t.proxy(this.onAddModule, this));
        this.DOMElement.on(MAE.ContainerEvent.SIZE_CHANGED, t.proxy(this.onSizeChanged, this))
    }
        ;
    _SubmodulesContainer.prototype.selectModule = function (t) {
        var e = this._getTabIndex(t);
        this.selectTab(e)
    }
        ;
    _SubmodulesContainer.prototype.selectTab = function (t) {
        if (t != -1 && this.tabs.length > 0 && this.tabs.length > t) {
            this.activeTabIndex = t;
            this._updateActiveTab()
        }
    }
        ;
    _SubmodulesContainer.prototype._updateActiveTab = function () {
        var e = function (e) {
            e.mouseenter(function () {
                t(this).addClass("xs-submodule-tab-active")
            });
            e.mouseleave(function () {
                t(this).removeClass("xs-submodule-tab-active")
            })
        };
        var i = function (t) {
            t.unbind("mouseenter");
            t.unbind("mouseleave")
        };
        for (var n = 0; n < this.tabs.length; n++) {
            var o = this.tabs[n];
            var r = this.children[n];
            if (n === this.activeTabIndex) {
                o.DOMElement.addClass("xs-submodule-tab-active");
                r.DOMElement.addClass("xs-tab-module-container-active");
                i(o.DOMElement)
            } else {
                o.DOMElement.removeClass("xs-submodule-tab-active");
                r.DOMElement.removeClass("xs-tab-module-container-active");
                e(o.DOMElement)
            }
        }
    }
        ;
    _SubmodulesContainer.prototype.hideLoader = function () { }
        ;
    _SubmodulesContainer.prototype.destroy = function () {
        for (var t = 0; t < this.tabs.length; t++) {
            var e = this.tabs[t];
            e.destroy()
        }
        MAE.ContainerBase.prototype.destroy.call(this)
    }
        ;
    _SubmodulesContainer.prototype.setTabHeader = function (t, e, i, n) {
        var o = this._getTabIndex(t);
        if (i && i instanceof jQuery) {
            this._updateTabHeader(o, i, n)
        } else {
            this._updateTabHeader(o, e, n)
        }
    }
        ;
    _SubmodulesContainer.prototype._getTabIndex = function (t) {
        for (var e = 0; e < this.tabs.length; e++) {
            if (this.tabs[e].id == t) {
                return e
            }
        }
        return -1
    }
        ;
    _SubmodulesContainer.prototype._updateTabHeader = function (t, e, i) {
        if (t != -1 && this.children.length > 0 && this.children.length > t) {
            var n = this.tabs[t];
            n.header = e;
            n.headerTooltip = i;
            n.updateHeader()
        }
    }
        ;
    function _ModuleContainer(t, e) {
        MAE.ContainerBase.call(this, t);
        this.moduleData = e;
        this.minWidth = e.minWidth;
        this.minHeight = e.minHeight;
        this.setConstructorHTML('<div class="xs-tab-module-container">' + '<div class="xs-module-wrapper"></div>' + "</div>")
    }
    _ModuleContainer.prototype = Object.create(MAE.ContainerBase.prototype);
    _ModuleContainer.prototype.constructor = _ModuleContainer.constructor;
    _ModuleContainer.prototype.updateContent = function (t) {
        if (t) {
            var e = this.DOMElement.find(".xs-module-wrapper");
            e.empty();
            e.prepend(t)
        }
    }
        ;
    _ModuleContainer.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            MAE.ContainerBase.prototype.getDOMElement.call(this);
            if (!this.moduleData.isReady && !MAE.LayoutConfig.widgetMode) {
                if (this.moduleData.content) {
                    this.moduleData.content.css("opacity", 0)
                }
                this.showLoader()
            }
            this.updateContent(this.moduleData.content)
        }
        return this.DOMElement
    }
        ;
    _ModuleContainer.prototype.resize = function () { }
        ;
    _ModuleContainer.prototype.showLoader = function () {
        this.loader = t('<div class="xs-module-loader-container">' + '<div><div class="xs-module-loader"></div></div>' + "</div>");
        this.DOMElement.append(this.loader)
    }
        ;
    _ModuleContainer.prototype.hideLoader = function () {
        var t = this.DOMElement.find(".xs-module");
        if (this.loader) {
            this.loader.remove()
        }
        t.css("opacity", 1);
        if (!MAE.LayoutConfig.widgetMode) {
            t.addClass("fadein")
        }
    }
        ;
    _ModuleContainer.prototype.destroy = function () {
        void 0;
        t(this.DOMElement).detach();
        this.DOMElement.find(".xs-module").removeClass("fadein");
        this.DOMElement = null
    }
        ;
    function _tab(t, e, i, n, o) { //l
        MAE.ComponentBase.call(this, t);
        this.header = e;
        this.headerTooltip = i;
        this.toolbar = null;
        this.isDetachable = n;
        this.tabDropIndicator = null;
        this.setConstructorHTML('<li class="xs-tab monkey-down"></li>');
        this.isInitiallyMaximized = o
    }
    _tab.prototype = Object.create(MAE.ComponentBase.prototype);
    _tab.prototype.constructor = _tab.constructor;
    _tab.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            MAE.ComponentBase.prototype.getDOMElement.call(this);
            this.updateToolbar();
            this.addDragAndDrop()
        }
        return this.DOMElement
    }
        ;
    _tab.prototype.onDragStart = function (e, i) {
        i.helper.attr("dragged-module-id", this.id);
        t(i.helper).addClass("xs-tab-dragger")
    }
        ;
    _tab.prototype.onDrag = function (t, e) {
        var i = e.helper.prevObject.data("tab-drop-indicator");
        if (!i) {
            return
        }
        var n = i.parent();
        var o = false;
        var r = n.hasClass("xs-add-tab-dropdown-btn");
        if (r) {
            if (n.parent().find(".xs-tab-nav").children().length != 0) {
                o = true
            }
        } else {
            var s = n.is(":nth-child(1)");
            if (!s) {
                o = true
            }
        }
        a(e.helper.prevObject.data("tab-drop-indicator"), o)
    }
        ;
    _tab.prototype.onDrop = function (t, n) {
        var r = n.helper.attr("dragged-module-id");
        var a = this.id;
        var s = 1 ? i.BEFORE_TAB : i.AFTER_TAB;
        o(this.tabDropIndicator);
        this.DOMElement.trigger(e.MODULE_TAB_DRAG_END, [r, a, s])
    }
        ;
    _tab.prototype.onDragOver = function (t, e) {
        e.draggable.data("tab-drop-indicator", this.tabDropIndicator);
        r(this.tabDropIndicator)
    }
        ;
    _tab.prototype.onDragOut = function (t, e) {
        o(this.tabDropIndicator);
        if (e.draggable.data("tab-drop-indicator") && e.draggable.data("tab-drop-indicator").attr("data-tab-id") == this.id) {
            e.draggable.removeData("tab-drop-indicator")
        }
    }
        ;
    _tab.prototype.addDragAndDrop = function () {
        this.DOMElement.droppable({
            scope: "tabs",
            tolerance: "pointer",
            greedy: true,
            drop: t.proxy(this.onDrop, this),
            over: t.proxy(this.onDragOver, this),
            out: t.proxy(this.onDragOut, this)
        });
        this.DOMElement.draggable({
            distance: 4,
            zIndex: 999,
            helper: "clone",
            opacity: .5,
            scope: "tabs",
            start: t.proxy(this.onDragStart, this),
            drag: t.proxy(this.onDrag, this),
            cancel: false
        });
        this.tabDropIndicator = t('<div class="xs-tab-drop-indicator"></div>');
        this.tabDropIndicator.attr("data-tab-id", this.id);
        this.DOMElement.append(this.tabDropIndicator)
    }
        ;
    _tab.prototype.removeDragAndDrop = function () {
        this.DOMElement.draggable("destroy");
        this.DOMElement.droppable("destroy")
    }
        ;
    _tab.prototype.updateToolbar = function () {
        if (!this.toolbar) {
            this.toolbar = t('<div class="xs-tab-toolbar"></div>');
            var e = MAE.LayoutTranslations["LAYOUT.DETACH"];
            if (this.isDetachable) {
                this.detachBtn = t('<div class="xs-tab-toolbar-btn xs-tab-detach-btn" title="' + e + '"></div>');
                this.toolbar.append(this.detachBtn)
            }
            var i = this.isInitiallyMaximized ? MAE.LayoutTranslations["LAYOUT.MINIMALIZE"] : MAE.LayoutTranslations["LAYOUT.MAXIMIZE"];
            var n = MAE.LayoutTranslations["LAYOUT.CLOSE"];
            this.toggleMaximizeBtn = t('<div class="xs-tab-toolbar-btn xs-tab-fullscreen-btn monkey-click" title="' + i + '"></div>');
            this.closeBtn = t('<div class="xs-tab-toolbar-btn xs-tab-close-btn monkey-click" title="' + n + '"></div>');
            this.toolbar.append(this.toggleMaximizeBtn);
            this.toolbar.append(this.closeBtn);
            this.DOMElement.append(this.toolbar);
            this.addViewListeners()
        }
    }
        ;
    _tab.prototype.onCloseButtonClicked = function (t) {
        this.DOMElement.trigger(e.CLOSE_TAB, t.data.tabId)
    }
        ;
    _tab.prototype.onToggleMaximizeButtonClicked = function (t) {
        this.DOMElement.trigger(e.TOGGLE_MAXIMIZE, t.data.tabId)
    }
        ;
    _tab.prototype.onDetachButtonClicked = function (t) {
        this.DOMElement.trigger(e.DETACH_TAB, t.data.tabId)
    }
        ;
    _tab.prototype.addViewListeners = function () {
        this.closeBtn.click({
            tabId: this.id
        }, t.proxy(this.onCloseButtonClicked, this));
        this.toggleMaximizeBtn.click({
            tabId: this.id
        }, t.proxy(this.onToggleMaximizeButtonClicked, this));
        if (this.isDetachable) {
            this.detachBtn.click({
                tabId: this.id
            }, t.proxy(this.onDetachButtonClicked, this))
        }
        this.DOMElement.on("mouseenter", t.proxy(this.onMouseEnter, this))
    }
        ;
    _tab.prototype.onMouseEnter = function () {
        var t = this.DOMElement.find(".xs-tab-header-text");
        if (t.length > 0) {
            var e = t[0];
            if (e.offsetWidth < e.scrollWidth && !t.attr("title")) {
                t.attr("title", t.text())
            } else if (e.offsetWidth >= e.scrollWidth) {
                if (!this.headerTooltip || this.headerTooltip == "") {
                    t.removeAttr("title")
                }
            }
        }
    }
        ;
    _tab.prototype.removeViewListeners = function () {
        t(this.DOMElement).off();
        this.closeBtn.off();
        this.toggleMaximizeBtn.off()
    }
        ;
    _tab.prototype.updateHeader = function () {
        this.DOMElement.find(".xs-tab-header").remove();
        if (this.header instanceof jQuery) {
            var e = t('<div class="xs-tab-header xs-tab-header-element"></div>');
            e.append(this.header);
            this.DOMElement.prepend(e);
            this.DOMElement.addClass("xs-fixed-tab")
        } else {
            this.DOMElement.prepend(t('<div class="xs-tab-header xs-tab-header-text" title="' + this.headerTooltip + '" >' + this.header + "</div>"))
        }
    }
        ;
    _tab.prototype.destroy = function () {
        void 0;
        this.DOMElement.find(".xs-tab-header-element").children().first().detach();
        this.removeViewListeners();
        this.removeDragAndDrop();
        this.DOMElement.remove();
        this.DOMElement = null
    }
        ;
    function _submoduleTab(t, e, i, n) { //c
        MAE.ComponentBase.call(this, t);
        this.header = e;
        this.headerTooltip = i;
        this.setConstructorHTML('<div class="xs-submodule-tab"></div>')
    }
    _submoduleTab.prototype = Object.create(MAE.ComponentBase.prototype);
    _submoduleTab.prototype.constructor = _submoduleTab.constructor;
    _submoduleTab.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            MAE.ComponentBase.prototype.getDOMElement.call(this)
        }
        return this.DOMElement
    }
        ;
    _submoduleTab.prototype.updateHeader = function () {
        if (this.header instanceof jQuery) { } else {
            this.DOMElement.html(this.header);
            if (this.headerTooltip) {
                this.DOMElement.attr("title", this.headerTooltip)
            }
        }
    }
        ;
    _submoduleTab.prototype.destroy = function () {
        void 0;
        this.DOMElement.remove();
        this.DOMElement = null
    }
        ;
    function _tabDropdown(e) { //u
        MAE.ComponentBase.call(this, e);
        this.dropdownList = null;
        this.setConstructorHTML('<div class="xs-add-tab-dropdown-btn">' + '<span class="xs-nav-tab-add-icon">' + "</span>" + '<div class="xs-add-tab-dropdown-list-container">' + '<ul class="xs-add-tab-dropdown-list"></ul>' + "</div>" + "</div>");
        this.hideDropdownProxy = t.proxy(this.hideList, this);
        this.tabDropIndicator = null;
        t(window).on("click", this.hideDropdownProxy)
    }
    _tabDropdown.prototype = Object.create(MAE.ComponentBase.prototype);
    _tabDropdown.prototype.constructor = _tabDropdown.constructor;
    _tabDropdown.prototype.getDOMElement = function () {
        if (!this.DOMElement) {
            MAE.ComponentBase.prototype.getDOMElement.call(this);
            this.dropdownList = this.DOMElement.find(".xs-add-tab-dropdown-list-container");
            this.dropdownList.hide();
            this.addListeners();
            this.addDragAndDrop()
        }
        return this.DOMElement
    }
        ;
    _tabDropdown.prototype.addListeners = function () {
        this.DOMElement.click(t.proxy(this.toggleListVisibility, this))
    }
        ;
    _tabDropdown.prototype.removeListeners = function () {
        this.DOMElement.off()
    }
        ;
    _tabDropdown.prototype.updateList = function (e) {
        var i = this.dropdownList.find("ul");
        i.find("li").off();
        i.empty();
        for (var n = 0; n < e.length; n++) {
            var o = e[n];
            var r = t('<li class="xs-add-tab-dropdown-list-item" data-module-id="' + o.id + '">' + o.headerLabel + "</li>");
            i.append(r)
        }
        i.find("li").on("click", this.addTabDropdownItemSelected)
    }
        ;
    _tabDropdown.prototype.addDragAndDrop = function () {
        this.DOMElement.droppable({
            scope: "tabs",
            tolerance: "pointer",
            greedy: true,
            drop: t.proxy(this.onDrop, this),
            over: t.proxy(this.onDragOver, this),
            out: t.proxy(this.onDragOut, this)
        });
        this.tabDropIndicator = t('<div class="xs-tab-drop-indicator"></div>');
        this.tabDropIndicator.attr("data-tab-id", this.id);
        this.DOMElement.append(this.tabDropIndicator)
    }
        ;
    _tabDropdown.prototype.removeDragAndDrop = function () {
        this.DOMElement.droppable("destroy")
    }
        ;
    _tabDropdown.prototype.onDrop = function (t, n) {
        var r = n.helper.attr("dragged-module-id");
        var a = "";
        o(this.tabDropIndicator);
        this.DOMElement.trigger(e.MODULE_TAB_DRAG_END, [r, a, i.LAST_TAB])
    }
        ;
    _tabDropdown.prototype.onDragOver = function (t, e) {
        e.draggable.data("tab-drop-indicator", this.tabDropIndicator);
        r(this.tabDropIndicator)
    }
        ;
    _tabDropdown.prototype.onDragOut = function (t, e) {
        o(this.tabDropIndicator);
        if (e.draggable.data("tab-drop-indicator") && e.draggable.data("tab-drop-indicator").attr("data-tab-id") == this.id) {
            e.draggable.removeData("tab-drop-indicator")
        }
    }
        ;
    _tabDropdown.prototype.addTabDropdownItemSelected = function (i) {
        t(this).trigger(e.ADD_MODULE, [this.getAttribute("data-module-id")])
    }
        ;
    _tabDropdown.prototype.hideList = function () {
        this.dropdownList.hide()
    }
        ;
    _tabDropdown.prototype.destroy = function () {
        this.dropdownList.find("li").off();
        this.removeListeners();
        this.removeDragAndDrop();
        t(window).off("click", this.hideDropdownProxy);
        this.hideDropdownProxy = null
    }
        ;
    _tabDropdown.prototype.toggleListVisibility = function (t) {
        if (this.dropdownList.is(":visible")) {
            this.dropdownList.hide()
        } else {
            this.dropdownList.show()
        }
        t.stopPropagation()
    }
}
)(jQuery);