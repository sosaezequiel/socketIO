function Socket(t, e, n, o, c, i, s) {
    this._configSocket = t,
    this._configEnvironments = e,
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
};
function SocketWorker(t, e, n, o, c, i, s) {
    Socket.call(this, t, e, n, o, c, i, s)
};


Socket.prototype.init = function() {};
Socket.prototype.isConnected = function() {
    return this._status === SocketStatus.CONNECTED
};

Socket.prototype.getEnvironment = function() {
    return this._environment
};

Socket.prototype.connect = function(t) {
    if (this._webSocket)
        switch (this._webSocket.readyState) {
        case 0:
        case 1:
            return void this._logWarnCallback.call(this, "Socket", "connect", "socket exists")
        }
    this._environment = t;
    var e = this._configEnvironments[this._environment];
    if (!e)
        return void this._logWarnCallback.call(this, "Socket", "connect", "config for _environment=" + this._environment + "not exists");
    var n = e.socket;
    this._logCallback.call(this, "Socket", "connect", "_environment=" + this._environment + " | socketUrl=" + n);
    try {
        this._webSocket = new WebSocket(n),
        this._webSocket.self = this,
        this._webSocket.addEventListener("open", this.socketOnOpenHandler),
        this._webSocket.addEventListener("close", this.socketOnCloseHandler),
        this._webSocket.addEventListener("error", this.socketOnErrorHandler),
        this._webSocket.addEventListener("message", this.socketOnMessageHandler)
    } catch (t) {
        this._logWarnCallback.call(this, "Socket", "connect", "webSocket cannot be created | error=" + t)
    }
    this.updateStatus(this._webSocket)
};

Socket.prototype.socketOnOpenHandler = function(t) {
    var e = this.self
      , n = t.target
      , o = n.url
      , c = n.readyState;
    return e._logCallback.call(this, "Socket", "socketOnOpenHandler", "url=" + o + ", readyState=" + c),
    e._webSocket && e._webSocket !== n ? void e._logCallback.call(this, "Socket", "socketOnOpenHandler", "return: old webSocket") : (e.updateStatus.call(e, n),
    e._isReconnecting = !1,
    e._isSwitchingEnvironment = !1,
    e.resetReconnectDelay.call(e),
    e._sendHandlers = {},
    clearTimeout(e._pongTimeout),
    clearTimeout(e._pingTimeout),
    void e.pingSend.call(e))
};

Socket.prototype.socketOnCloseHandler = function(t) {
    var e = this.self
      , n = t.target
      , o = n.url
      , c = n.readyState
      , i = t.code
      , s = t.reason
      , r = t.wasClean;
    return e._logCallback.call(this, "Socket", "socketOnCloseHandler", "url=" + o + ", readyState=" + c, "code=" + i + ", reason=" + s + ", wasClean=" + r),
    e._webSocket && e._webSocket !== n ? void e._logCallback.call(this, "Socket", "socketOnCloseHandler", "return: old webSocket") : (r || (e._isReconnecting = !0),
    e.updateStatus.call(e, n),
    n.self = null,
    n.onopen = null,
    n.onclose = null,
    n.onerror = null,
    n.onmessage = null,
    e._webSocket === n && (e._webSocket = null,
    e._sendHandlers = {},
    clearTimeout(e._pongTimeout),
    clearTimeout(e._pingTimeout)),
    void (e._isReconnecting && (setTimeout(function() {
        e.connect.call(e, e._environment)
    }, e._reconnectDelay),
    e.increaseReconnectDelay.call(e))))
};

Socket.prototype.socketOnErrorHandler = function(t) {
    var e = this.self
      , n = t.target
      , o = n.url
      , c = n.readyState;
    return e._logWarnCallback.call(this, "Socket", "socketOnErrorHandler", "url=" + o + ", readyState=" + c),
    e._webSocket && e._webSocket !== n ? void e._logCallback.call(this, "Socket", "socketOnErrorHandler", "return: old webSocket") : void e.updateStatus.call(e, n, !0)
};

Socket.prototype.socketOnMessageHandler = function(t) {
    var e = this.self
      , n = JSON.parse(t.data)
      , o = n.reqId
      , c = e._sendHandlers[o];
    c ? (delete e._sendHandlers[o],
    c.call(e, n)) : e._onMessageCallback.call(e, n)
};

Socket.prototype.updateStatus = function(t, e) {
    if (!this._webSocket || this._webSocket === t) {
        var n;
        if (t) {
            switch (t.readyState) {
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
            e = e === !0
        } else
            n = SocketStatus.ERROR,
            e = !0;
        (this._status !== n || e) && (this._status = n,
        this._logCallback.call(this, "Socket", "updateStatus", "_status=" + this._status + ", _isReconnecting=" + this._isReconnecting + ", _isSwitchingEnvironment=" + this._isSwitchingEnvironment + ", isError=" + e),
        this._statusCallback.call(this, this._status, this._isReconnecting, this._isSwitchingEnvironment, e))
    }
};

Socket.prototype.send = function(t) {
    this._webSocket.send(JSON.stringify(t))
};

Socket.prototype.pingSend = function() {
    if (this.isConnected()) {
        this._pingTimeSend = Date.now();
        var t = "ping_" + this._pingTimeSend
          , e = {
            reqId: t,
            command: [{
                CoreAPI: {
                    ping: {}
                }
            }]
        };
        clearTimeout(this._pongTimeout),
        this._pongTimeout = setTimeout(this.pongNotReceivedLog.bind(this), this._configSocket.pongTimeoutLog),
        this._sendHandlers[t] = this.pongHandler,
        this.send(e)
    }
};

Socket.prototype.pongNotReceivedLog = function() {
    var t = Date.now() - this._pingTimeSend;
    this._logWarnCallback.call(this, "Socket", "pongNotReceivedLog", "delay=" + t + " > " + this._configSocket.pongTimeoutLog);
    var e = this._configSocket.pongTimeoutReconnect - this._configSocket.pongTimeoutLog;
    this._pongTimeout = setTimeout(this.pongNotReceivedReconnect.bind(this), e)
};

Socket.prototype.pongNotReceivedReconnect = function() {
    var t = Date.now() - this._pingTimeSend;
    this._logWarnCallback.call(this, "Socket", "pongNotReceivedReconnect", "execute reconnect", "delay=" + t + " > " + this._configSocket.pongTimeoutReconnect),
    this.reconnect()
};

Socket.prototype.pongHandler = function(t) {
    var e = Date.now()
      , n = performance.now();
    this._pingPongLatency = e - this._pingTimeSend,
    clearTimeout(this._pongTimeout);
    var o = t.response[0].xpong.time
      , c = o - this._pingTimeSend
      , i = e - o;
    this._pingCallback.call(this, this._pingPongLatency, c, i, n),
    this._pingPongLatency > this._configSocket.pingPongLatencyMax ? (this._logWarnCallback.call(this, "Socket", "pongHandler", "execute reconnect", "_pingPongLatency=" + this._pingPongLatency + " > " + this._configSocket.pingPongLatencyMax),
    this.reconnect()) : this._pingTimeout = setTimeout(this.pingSend.bind(this), this._configSocket.pingInterval)
};

Socket.prototype.resetReconnectDelay = function() {
    this._reconnectDelay = this._configSocket.reconnectDelay,
    this._reconnectDelay = this._reconnectDelay + Math.random() * (.5 * this._reconnectDelay)
};

Socket.prototype.increaseReconnectDelay = function() {
    this._reconnectDelay < this._configSocket.reconnectDelayMax && (this._reconnectDelay = this._reconnectDelay * this._configSocket.reconnectDelayFactor,
    this._reconnectDelay > this._configSocket.reconnectDelayMax && (this._reconnectDelay = this._configSocket.reconnectDelayMax))
};

Socket.prototype.disconnect = function(t) {
    if (null === this._webSocket)
        return void this._logWarnCallback.call(this, "Socket", "disconnect", "socket not exists");
    var e = this._webSocket;
    this._webSocket = null,
    e.close(),
    this.updateStatus(e)
};


Socket.prototype.reconnect = function() {
    this._isReconnecting = !0,
    this.disconnect()
};

Socket.prototype.switchEnvironment = function(t) {
    this._environment = t,
    this._isSwitchingEnvironment = !0,
    this.reconnect()
};

SocketWorker.prototype = Object.create(Socket.prototype);
SocketWorker.prototype.constructor = SocketWorker;
SocketWorker.prototype.init = function(t) {
    var e = Date.now()
      , n = performance.now();
    this._worker = new Worker(t),
    this._worker.self = this,
    this._worker.onmessage = this._workerOnMessage,
    this._worker.onerror = this._workerOnError,
    this._worker.onmessageerror = this._workerOnMessageError,
    this._worker.postMessage(["constructor", this._configSocket, this._configEnvironments]),
    this._worker.postMessage(["init", e, n])
};

SocketWorker.prototype._workerOnMessage = function(t) {
    var e = t.data
      , n = e.shift();
    switch (n) {
    case "statusCallback":
        workerStatusCallback.apply(this.self, e);
        break;
    case "onMessageCallback":
        this.self._onMessageCallback.apply(this.self, e);
        break;
    case "pingCallback":
        this.self._pingCallback.apply(this.self, e);
        break;
    case "logCallback":
        this.self._logCallback.apply(this.self, e);
        break;
    case "logWarnCallback":
        this.self._logWarnCallback.apply(this.self, e)
    }
};

SocketWorker.prototype._workerOnError = function(t, e, n) {
    this.self._logWarnCallback.call(this.self, "SocketWorker", "_workerOnError", "message=" + t + ", filename=" + e + ", lineno=" + n)
};


SocketWorker.prototype._workerOnMessageError = function(t) {
    this.self._logWarnCallback.call(this.self, "SocketWorker", "_workerOnMessageError", "event=" + JSON.stringify(t))
};

SocketWorker.prototype.connect = function(t) {
    this._environment = t,
    this._worker.postMessage(["connect", t])
};

SocketWorker.prototype.send = function(t) {
    this._worker.postMessage(["send", t])
};

SocketWorker.prototype.disconnect = function(t) {
    this._worker.postMessage(["disconnect", t]),
    t && this._worker.terminate()
};

SocketWorker.prototype.reconnect = function() {
    this._worker.postMessage(["reconnect"])
};

SocketWorker.prototype.switchEnvironment = function(t) {
    this._environment = t,
    this._worker.postMessage(["switchEnvironment", t])
}