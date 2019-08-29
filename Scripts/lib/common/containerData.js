//Red
function RequestCommand(t, e, n) {
    this.requestId = t,
        this.successHandler = e,
        this.failHandler = n
}


//tipos de disposiciones
var ContainerDataType = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    TABS: "tabs",
    MODULES: "modules"
};



function ContainerData(e, t, i) {
    this.id = e;
    this.parentId = t;
    this.type = i;
    this.percentSize = null;
    this.children = [];
    this.activeChildIndex = -1;
    this.historyActiveId = null;
    this.historyActiveData = {};
};






ContainerData.prototype.setActiveChildIndex = function (e) {
    null != e && (this.activeChildIndex = e)
};

ContainerData.prototype.addChild = function (e, t) {
    if (this.children.indexOf(e) != -1)
        return !1;
    var i = this.children.length;
    return null == t && (t = i),
        t < 0 ? t = 0 : t > i && (t = i),
        this.children.splice(t, 0, e),
        t <= this.activeChildIndex && (this.activeChildIndex = this.activeChildIndex + 1),
        !0
};

ContainerData.prototype.removeChild = function (e) {
    var t = this.children.indexOf(e);
    return t != -1 && (this.children.splice(t, 1),
        t <= this.activeChildIndex && (this.activeChildIndex = this.activeChildIndex - 1,
            this.activeChildIndex == -1 && this.children.length > 0 && (this.activeChildIndex = 0),
            this.historyActiveUpdate(this.getActiveChild())),
        !0)
};

ContainerData.prototype.getChildIndex = function (e) {
    return this.children.indexOf(e)
};

ContainerData.prototype.setChildIndex = function (e, t) {
    var i = this.children.indexOf(e);
    if (i == -1)
        return !1;
    var s = this.children.length;
    if (null == t && (t = s), t < 0 ? t = 0 : t > s && (t = s), t == i || t - 1 == i)
        return !1;
    t > i && (t -= 1);
    var a;
    return i != this.activeChildIndex && t != this.activeChildIndex || (a = this.children[this.activeChildIndex]),
        this.children.splice(i, 1),
        this.children.splice(t, 0, e),
        a && (this.activeChildIndex = this.children.indexOf(a)),
        !0
};

ContainerData.prototype.getActiveChild = function () {
    return this.activeChildIndex >= 0 && this.activeChildIndex < this.children.length ? this.children[this.activeChildIndex] : null
};

ContainerData.prototype.setActiveChildIndexByChild = function (e) {
    var t = this.children.indexOf(e);
    return t != -1 && (this.activeChildIndex = t,
        this.historyActiveUpdate(e),
        !0)
};

ContainerData.prototype.validateActiveChildIndex = function () {
    var e = this.children.length;
    this.activeChildIndex >= e ? this.activeChildIndex = e - 1 : this.activeChildIndex < 0 && e > 0 && (this.activeChildIndex = 0)
};

ContainerData.prototype.historyActiveReset = function () {
    this.historyActiveId = null,
        this.historyActiveData = {}
};

ContainerData.prototype.historyActiveUpdate = function (e) {
    if (e) {
        var t = e.id;
        this.historyActiveId != t && (this.historyActiveData[t] = this.historyActiveId,
            this.historyActiveId = t)
    }
};

ContainerData.prototype.validateChildrenPercentSizes = function () {
    if (this.type != ContainerDataType.TABS) {
        var e, t, i, s = [], a = 0, o = this.children.length, r = Math.floor(100 / o);
        for (e = 0; e < o; e++)
            t = this.children[e],
                i = t.percentSize,
                (null == i || i <= 0) && (i = r),
                s[e] = i,
                a += i;
        if (a > 100) {
            var n, l = a - 100;
            for (e = 0; e < o; e++)
                i = s[e],
                    n = i / a * l,
                    s[e] = i - n
        }
        for (e = 0; e < o; e++)
            t = this.children[e],
                t.percentSize = s[e]
    }
};

ContainerData.prototype.toLayoutData = function () {
    var e = {
        id: this.id,
        type: this.type,
        percentSize: this.percentSize,
        activeChildIndex: this.activeChildIndex
    };
    switch (this.type) {
        case ContainerDataType.HORIZONTAL:
        case ContainerDataType.VERTICAL:
            for (var t, i = [], s = 0, a = this.children.length; s < a; s++)
                t = this.children[s],
                    i.push(t.toLayoutData());
            e.children = i;
            break;
        case ContainerDataType.TABS:
            e.containerId = this.containerId
    }
    return e
};

ContainerData.prototype.toLayoutContainerData = function () {
    var e, t, i, s = [];
    for (e = 0,
        t = this.children.length; e < t; e++)
        i = this.children[e],
            s.push(i.toLayoutData());
    return s
};

ContainerData.prototype.toString = function () {
    return "ContainerData{id=" + this.id + ", parentId=" + this.parentId + ", type=" + this.type + ", percentSize=" + this.percentSize + ", activeChildIndex=" + this.activeChildIndex + "}"
};

ContainerData.prototype.toStringStructure = function (e) {
    e = e || "";
    var t = e + this.toString();
    e += "   ";
    for (var i, s = 0, a = this.children.length; s < a; s++)
        i = this.children[s],
            t = t + "\n" + i.toStringStructure(e + (this.activeChildIndex == s ? "# " : "- "));
    return t
};






