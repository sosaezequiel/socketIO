;/*! worker_socket : src : begin !*/
function Socket(e, t, n, o, c, i, s) {
    this._configSocket = e,
    this._configEnvironments = t,
    this._statusCallback = n,
    this._onMessageCallback = o,
    this._pingCallback = c,
    this._logCallback = i,
    this._logWarnCallback = s,
    this._environment = null,
    this._webSocket = null,
    this._status = null,
    this._sendHandlers = {},
    this._pingTimeSend = null,
    this._pingPongLatency = null,
    this._pingTimeout = null,
    this._pongTimeout = null,
    this._isReconnecting = !1,
    this._isSwitchingEnvironment = !1,
    this._reconnectDelay = 0,
    this.resetReconnectDelay()
}
function socketConstructor(e, t) {
    _socket = new Socket(e,t,socketStatusCallback,socketOnMessageCallback,socketPingCallback,socketLogCallback,socketLogWarnCallback)
}
function socketInit(e, t) {
    _socket.init(),
    _socketPerformanceNowShift = t - _socketPerformanceNowInit + (_socketDateNowInit - e)
}
function socketStatusCallback(e, t, n, o) {
    self.postMessage(["statusCallback", e, t, n, o])
}
function socketOnMessageCallback(e) {
    self.postMessage(["onMessageCallback", e])
}
function socketPingCallback(e, t, n, o) {
    o += _socketPerformanceNowShift,
    self.postMessage(["pingCallback", e, t, n, o])
}
function socketLogCallback() {
    var e = Array.prototype.slice.call(arguments);
    e.unshift("logCallback"),
    self.postMessage(e)
}
function socketLogWarnCallback() {
    var e = Array.prototype.slice.call(arguments);
    e.unshift("logWarnCallback"),
    self.postMessage(e)
}
function socketConnect(e) {
    _socket.connect(e)
}
function socketSend(e) {
    _socket.isConnected() && _socket.send(e)
}
function socketDisconnect(e) {
    _socket.disconnect(e)
}
function socketReconnect() {
    _socket.reconnect()
}
function socketSwitchEnvironment(e) {
    _socket.switchEnvironment(e)
}

var win = self;

!function() {
    if ("performance"in win == 0 && (win.performance = {}),
    Date.now = Date.now || function() {
        return (new Date).getTime()
    }
    ,
    "now"in win.performance == 0) {
        var e = Date.now();
        performance.timing && performance.timing.navigationStart && (e = performance.timing.navigationStart),
        wind.performance.now = function() {
            return Date.now() - e
        }
    }
}();
var SocketStatus = {
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    DISCONNECTING: "DISCONNECTING",
    CLOSED: "CLOSED",
    ERROR: "ERROR"
};
Object.freeze(SocketStatus),
Socket.prototype.init = function() {}
,
Socket.prototype.isConnected = function() {
    return this._status === SocketStatus.CONNECTED
}
,
Socket.prototype.getEnvironment = function() {
    return this._environment
}
,
Socket.prototype.connect = function(e) {
    if (this._webSocket)
        switch (this._webSocket.readyState) {
        case 0:
        case 1:
            return void this._logWarnCallback.call(this, "Socket", "connect", "socket exists")
        }
    this._environment = e;
    var t = this._configEnvironments[this._environment];
    if (!t)
        return void this._logWarnCallback.call(this, "Socket", "connect", "config for _environment=" + this._environment + "not exists");
    var n = t.socket;
    this._logCallback.call(this, "Socket", "connect", "_environment=" + this._environment + " | socketUrl=" + n);
    try {
        this._webSocket = new WebSocket(n),
        this._webSocket.self = this,
        this._webSocket.addEventListener("open", this.socketOnOpenHandler),
        this._webSocket.addEventListener("close", this.socketOnCloseHandler),
        this._webSocket.addEventListener("error", this.socketOnErrorHandler),
        this._webSocket.addEventListener("message", this.socketOnMessageHandler)
    } catch (e) {
        this._logWarnCallback.call(this, "Socket", "connect", "webSocket cannot be created | error=" + e)
    }
    this.updateStatus(this._webSocket)
}
,
Socket.prototype.socketOnOpenHandler = function(e) {
    var t = this.self
      , n = e.target
      , o = n.url
      , c = n.readyState;
    return t._logCallback.call(this, "Socket", "socketOnOpenHandler", "url=" + o + ", readyState=" + c),
    t._webSocket && t._webSocket !== n ? void t._logCallback.call(this, "Socket", "socketOnOpenHandler", "return: old webSocket") : (t.updateStatus.call(t, n),
    t._isReconnecting = !1,
    t._isSwitchingEnvironment = !1,
    t.resetReconnectDelay.call(t),
    t._sendHandlers = {},
    clearTimeout(t._pongTimeout),
    clearTimeout(t._pingTimeout),
    void t.pingSend.call(t))
}
,
Socket.prototype.socketOnCloseHandler = function(e) {
    var t = this.self
      , n = e.target
      , o = n.url
      , c = n.readyState
      , i = e.code
      , s = e.reason
      , a = e.wasClean;
    return t._logCallback.call(this, "Socket", "socketOnCloseHandler", "url=" + o + ", readyState=" + c, "code=" + i + ", reason=" + s + ", wasClean=" + a),
    t._webSocket && t._webSocket !== n ? void t._logCallback.call(this, "Socket", "socketOnCloseHandler", "return: old webSocket") : (a || (t._isReconnecting = !0),
    t.updateStatus.call(t, n),
    n.self = null,
    n.onopen = null,
    n.onclose = null,
    n.onerror = null,
    n.onmessage = null,
    t._webSocket === n && (t._webSocket = null,
    t._sendHandlers = {},
    clearTimeout(t._pongTimeout),
    clearTimeout(t._pingTimeout)),
    void (t._isReconnecting && (setTimeout(function() {
        t.connect.call(t, t._environment)
    }, t._reconnectDelay),
    t.increaseReconnectDelay.call(t))))
}
,
Socket.prototype.socketOnErrorHandler = function(e) {
    var t = this.self
      , n = e.target
      , o = n.url
      , c = n.readyState;
    return t._logWarnCallback.call(this, "Socket", "socketOnErrorHandler", "url=" + o + ", readyState=" + c),
    t._webSocket && t._webSocket !== n ? void t._logCallback.call(this, "Socket", "socketOnErrorHandler", "return: old webSocket") : void t.updateStatus.call(t, n, !0)
}
,
Socket.prototype.socketOnMessageHandler = function(e) {
    var t = this.self
      , n = JSON.parse(e.data)
      , o = n.reqId
      , c = t._sendHandlers[o];
    c ? (delete t._sendHandlers[o],
    c.call(t, n)) : t._onMessageCallback.call(t, n)
}
,
Socket.prototype.updateStatus = function(e, t) {
    if (!this._webSocket || this._webSocket === e) {
        var n;
        if (e) {
            switch (e.readyState) {
            case 0:
                n = SocketStatus.CONNECTING;
                break;
            case 1:
                n = SocketStatus.CONNECTED;
                break;
            case 2:
                n = SocketStatus.DISCONNECTING;
                break;
            case 3:
                n = SocketStatus.CLOSED
            }
            t = t === !0
        } else
            n = SocketStatus.ERROR,
            t = !0;
        (this._status !== n || t) && (this._status = n,
        this._logCallback.call(this, "Socket", "updateStatus", "_status=" + this._status + ", _isReconnecting=" + this._isReconnecting + ", _isSwitchingEnvironment=" + this._isSwitchingEnvironment + ", isError=" + t),
        this._statusCallback.call(this, this._status, this._isReconnecting, this._isSwitchingEnvironment, t))
    }
}
,
Socket.prototype.send = function(e) {
    this._webSocket.send(JSON.stringify(e))
}
,
Socket.prototype.pingSend = function() {
    if (this.isConnected()) {
        this._pingTimeSend = Date.now();
        var e = "ping_" + this._pingTimeSend
          , t = {
            reqId: e,
            command: [{
                CoreAPI: {
                    ping: {}
                }
            }]
        };
        clearTimeout(this._pongTimeout),
        this._pongTimeout = setTimeout(this.pongNotReceivedLog.bind(this), this._configSocket.pongTimeoutLog),
        this._sendHandlers[e] = this.pongHandler,
        this.send(t)
    }
}
,
Socket.prototype.pongNotReceivedLog = function() {
    var e = Date.now() - this._pingTimeSend;
    this._logWarnCallback.call(this, "Socket", "pongNotReceivedLog", "delay=" + e + " > " + this._configSocket.pongTimeoutLog);
    var t = this._configSocket.pongTimeoutReconnect - this._configSocket.pongTimeoutLog;
    this._pongTimeout = setTimeout(this.pongNotReceivedReconnect.bind(this), t)
}
,
Socket.prototype.pongNotReceivedReconnect = function() {
    var e = Date.now() - this._pingTimeSend;
    this._logWarnCallback.call(this, "Socket", "pongNotReceivedReconnect", "execute reconnect", "delay=" + e + " > " + this._configSocket.pongTimeoutReconnect),
    this.reconnect()
}
,
Socket.prototype.pongHandler = function(e) {
    var t = Date.now()
      , n = performance.now();
    this._pingPongLatency = t - this._pingTimeSend,
    clearTimeout(this._pongTimeout);
    var o = e.response[0].xpong.time
      , c = o - this._pingTimeSend
      , i = t - o;
    this._pingCallback.call(this, this._pingPongLatency, c, i, n),
    this._pingPongLatency > this._configSocket.pingPongLatencyMax ? (this._logWarnCallback.call(this, "Socket", "pongHandler", "execute reconnect", "_pingPongLatency=" + this._pingPongLatency + " > " + this._configSocket.pingPongLatencyMax),
    this.reconnect()) : this._pingTimeout = setTimeout(this.pingSend.bind(this), this._configSocket.pingInterval)
}
,
Socket.prototype.resetReconnectDelay = function() {
    this._reconnectDelay = this._configSocket.reconnectDelay,
    this._reconnectDelay = this._reconnectDelay + Math.random() * (.5 * this._reconnectDelay)
}
,
Socket.prototype.increaseReconnectDelay = function() {
    this._reconnectDelay < this._configSocket.reconnectDelayMax && (this._reconnectDelay = this._reconnectDelay * this._configSocket.reconnectDelayFactor,
    this._reconnectDelay > this._configSocket.reconnectDelayMax && (this._reconnectDelay = this._configSocket.reconnectDelayMax))
}
,
Socket.prototype.disconnect = function(e) {
    if (null === this._webSocket)
        return void this._logWarnCallback.call(this, "Socket", "disconnect", "socket not exists");
    var t = this._webSocket;
    this._webSocket = null,
    t.close(),
    this.updateStatus(t)
}
,
Socket.prototype.reconnect = function() {
    this._isReconnecting = !0,
    this.disconnect()
}
,
Socket.prototype.switchEnvironment = function(e) {
    this._environment = e,
    this._isSwitchingEnvironment = !0,
    this.reconnect()
}
;
var _messageOrigin = location.protocol + "://" + location.host;
self.onmessage = function(e) {
    if ("" === e.origin || e.origin === self._messageOrigin) {
        var t = e.data
          , n = t.shift();
        switch (n) {
        case "constructor":
            socketConstructor.apply(this, t);
            break;
        case "init":
            socketInit.apply(this, t);
            break;
        case "connect":
            socketConnect.apply(this, t);
            break;
        case "send":
            socketSend.apply(this, t);
            break;
        case "disconnect":
            socketDisconnect.apply(this, t);
            break;
        case "reconnect":
            socketReconnect.apply(this, t);
            break;
        case "switchEnvironment":
            socketSwitchEnvironment.apply(this, t)
        }
    }
};


var _socket = null
  , _socketDateNowInit = Date.now()
  , _socketPerformanceNowInit = performance.now()
  , _socketPerformanceNowShift = 0;

