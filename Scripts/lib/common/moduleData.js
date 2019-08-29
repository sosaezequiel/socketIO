function ModuleData(e, t) {
    this.id = e,
    this.parentId = t,
    this.gaId = e,
    this.minWidth = 0,
    this.minHeight = 0,
    this.scope = null,
    this.content = null,
    this.headerLabel = null,
    this.headerTooltip = null,
    this.headerElement = null,
    this.isReady = false,
    this.isReadyCallback = null,
    this.isReadyCallbackParameters = null,
    this.isDetachable = !1,
    this.children = null,
    this.activeChildIndex = -1,
    this.isSubModule = !1,
    this.amountOfActivations = 0
};


ModuleData.prototype.setActiveChildIndex = function(e) {
    null != e && (this.activeChildIndex = e)
};

ModuleData.prototype.addChild = function(e, t) {
    if (this.children.indexOf(e) != -1)
        return !1;
    var i = this.children.length;
    return null == t && (t = i),
    t < 0 ? t = 0 : t > i && (t = i),
    this.children.splice(t, 0, e),
    t <= this.activeChildIndex && (this.activeChildIndex = this.activeChildIndex + 1),
    !0
};

ModuleData.prototype.removeChild = function(e) {
    var t = this.children.indexOf(e);
    return t != -1 && (this.children.splice(t, 1),
    t <= this.activeChildIndex && (this.activeChildIndex = this.activeChildIndex - 1,
    this.activeChildIndex == -1 && this.children.length > 0 && (this.activeChildIndex = 0)),
    !0)
};

ModuleData.prototype.getChildIndex = function(e) {
    return this.children.indexOf(e)
};

ModuleData.prototype.setChildIndex = function(e, t) {
    var i = this.children.indexOf(e);
    if (i == -1)
        return !1;
    var s = this.children.length;
    if (null == t && (t = s),
    t < 0 ? t = 0 : t > s && (t = s),
    t == i || t - 1 == i)
        return !1;
    t > i && (t -= 1);
    var a;
    return i != this.activeChildIndex && t != this.activeChildIndex || (a = this.children[this.activeChildIndex]),
    this.children.splice(i, 1),
    this.children.splice(t, 0, e),
    a && (this.activeChildIndex = this.children.indexOf(a)),
    !0
};

ModuleData.prototype.getActiveChild = function() {
    return this.activeChildIndex >= 0 && this.activeChildIndex < this.children.length ? this.children[this.activeChildIndex] : null
};

ModuleData.prototype.setActiveChildIndexByChild = function(e) {
    var t = this.children.indexOf(e);
    return t != -1 && (this.activeChildIndex = t,
    !0)
};

ModuleData.prototype.validateActiveChildIndex = function() {
    var e = this.children.length;
    this.activeChildIndex >= e ? this.activeChildIndex = e - 1 : this.activeChildIndex < 0 && e > 0 && (this.activeChildIndex = 0)
};

ModuleData.prototype.toLayoutData = function() {
    var e = {
        id: this.id,
        parentId: this.parentId,
        activeChildIndex: this.activeChildIndex
    };
    return e
};

ModuleData.prototype.toString = function() {
    return "ModuleData{id=" + this.id + ", parentId=" + this.parentId + ", content=" + (null != this.content) + ", headerElement=" + (null != this.headerElement) + ", headerLabel=" + (null != this.headerLabel) + ", headerTooltip=" + (null != this.headerTooltip) + ", isReady=" + this.isReady + ", isDetachable=" + this.isDetachable + ", activeChildIndex=" + this.activeChildIndex + ", isSubModule=" + this.isSubModule + ", amountOfActivations=" + this.amountOfActivations + "}"
};

ModuleData.prototype.toStringStructure = function(e) {
    e = e || "";
    var t = e + this.toString();
    if (this.children) {
        e += "   ";
        for (var i, s = 0, a = this.children.length; s < a; s++)
            i = this.children[s],
            t = t + "\n" + i.toStringStructure(e + (this.activeChildIndex == s ? "# " : "- "))
    }
    return t
};



