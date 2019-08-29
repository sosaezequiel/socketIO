//Signal
(function (global) {
    function SignalBinding(signal, listener, isOnce, listenerContext, priority, name) {
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext || null;
        this._signal = signal;
        this._priority = priority || 0;
        this._name = name || "L" + SignalBinding._counter++
    }
    SignalBinding._counter = 0;
    SignalBinding.prototype = {
        active: true,
        params: null,
        execute: function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params ? this.params.concat(paramsArr) : paramsArr;
                var listener = this._listener;
                if (this._isOnce) {
                    this.detach()
                }
                handlerReturn = listener.apply(this.context, params)
            }
            return handlerReturn
        },
        detach: function () {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null
        },
        isBound: function () {
            return !!this._signal && !!this._listener
        },
        isOnce: function () {
            return this._isOnce
        },
        getListener: function () {
            return this._listener
        },
        getSignal: function () {
            return this._signal
        },
        _destroy: function () {
            delete this._signal;
            delete this._listener;
            delete this.context
        },
        toString: function () {
            return "[SignalBinding:" + this._name + " isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]"
        },
        getName: function () {
            return this._name
        }
    };
    function validateListener(listener, fnName) {
        if (typeof listener !== "function") {
            throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", fnName))
        }
    }
    function Signal(name) {
        this._bindings = [];
        this._prevParams = null;
        this._name = name || "S" + Signal._counter++;
        var self = this;
        this.dispatch = function () {
            Signal.prototype.dispatch.apply(self, arguments)
        }
    }
    Signal._counter = 0;
    Signal.prototype = {
        VERSION: "1.0.0",
        memorize: false,
        _shouldPropagate: true,
        active: true,
        _registerListener: function (listener, isOnce, listenerContext, priority, listenerName) {
            var prevIndex = this._indexOfListener(listener, listenerContext), binding;
            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error("You cannot add" + (isOnce ? "" : "Once") + "() then add" + (!isOnce ? "" : "Once") + "() the same listener without removing the relationship first.")
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority, listenerName);
                this._addBinding(binding)
            }
            if (this.memorize && this._prevParams) {
                binding.execute(this._prevParams)
            }
            return binding
        },
        _addBinding: function (binding) {
            var n = this._bindings.length;
            do {
                --n
            } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority); this._bindings.splice(n + 1, 0, binding)
        },
        _indexOfListener: function (listener, context) {
            context = context || null;
            var n = this._bindings.length, cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n
                }
            }
            return -1
        },
        has: function (listener, context) {
            return this._indexOfListener(listener, context) !== -1
        },
        add: function (listener, listenerContext, priority, listenerName) {
            validateListener(listener, "add");
            return this._registerListener(listener, false, listenerContext, priority, listenerName)
        },
        addOnce: function (listener, listenerContext, priority, listenerName) {
            validateListener(listener, "addOnce");
            return this._registerListener(listener, true, listenerContext, priority, listenerName)
        },
        remove: function (listener, context) {
            validateListener(listener, "remove");
            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1)
            }
            return listener
        },
        removeAll: function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy()
            }
            this._bindings.length = 0
        },
        getNumListeners: function () {
            return this._bindings.length
        },
        halt: function () {
            this._shouldPropagate = false
        },
        dispatch: function (params) {
            if (!this.active) {
                return
            }
            var paramsArr = Array.prototype.slice.call(arguments), n = this._bindings.length, bindings;
            if (this.memorize) {
                this._prevParams = paramsArr
            }
            if (!n) {
                return
            }
            bindings = this._bindings.slice();
            this._shouldPropagate = true;
            do {
                n--
            } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false)
        },
        forget: function () {
            this._prevParams = null
        },
        dispose: function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams
        },
        toString: function () {
            return "[Signal:" + this._name + " active:" + this.active + " numListeners:" + this.getNumListeners() + "]"
        },
        getName: function () {
            return this._name
        },
        setName: function (name) {
            this._name = name
        },
        getListenersNames: function () {
            var result = [];
            var binding;
            for (var i = 0, n = this._bindings.length; i < n; i++) {
                binding = this._bindings[i];
                result.push(binding.getName())
            }
            return result
        },
        toStringNames: function () {
            return this.getName() + ":" + this.getListenersNames()
        }
    };
    var signals = Signal;
    signals.Signal = Signal;
    global["signals"] = signals
}
)(this);