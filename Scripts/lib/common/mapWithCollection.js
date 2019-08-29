function MapWithCollection(e, t, r) {
    this.key = e || "key",
        this.map = t || {},
        this.col = r || []
};

MapWithCollection.prototype.getLength = function () {
    return this.col.length
};

MapWithCollection.prototype.getCollection = function () {
    return this.col
};

MapWithCollection.prototype.getKey = function () {
    return this.key
};

MapWithCollection.prototype.getMap = function () {
    return this.map
};

MapWithCollection.prototype.addItem = function (e) {
    var t = e[this.key] || "null";


    return this.map.hasOwnProperty(t) ? (this.replaceItem(e), !1) : (this.map[t] = e, this.col[this.col.length] = e, !0)
};

MapWithCollection.prototype.replaceItem = function (e, t) {
    var r = t || e[this.key]
        , n = this.map[r];
    void 0 !== n && void 0 !== n.update && n.update(e)
};

MapWithCollection.prototype.getItem = function (e) {
    return this.map[e]
};

MapWithCollection.prototype.removeAll = function () {
    this.map = {},
        this.col = []
};

MapWithCollection.prototype.removeItem = function (e) {
    var t = e[this.key];
    return this.removeItemByKey(t)
};

MapWithCollection.prototype.removeItemByKey = function (e) {
    var t = this.map[e];
    if (t) {
        var r = this.col.indexOf(t);
        r > -1 && this.col.splice(r, 1),
            delete this.map[e]
    }
    return t
};