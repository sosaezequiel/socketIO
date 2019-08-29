/*
Dependencias:[logsService]
*/
(function (jq) {
    var e = MAE.LogsService;
    function t() {
        if (r = "localStorage" in window && null !== window.localStorage)
            try {
                var e = (new Date).getTime();
                localStorage.setItem("__xstation_is_local_storage_available", e);
                localStorage.getItem("__xstation_is_local_storage_available");
                localStorage.removeItem("__xstation_is_local_storage_available")
            } catch (e) {
                r = !1
            }
    }
    function _isLocalStorageAvailable() {
        return r
    }
    function _getItem(t) {
        var n;
        if (r)
            try {
                return n = localStorage.getItem(t)
            } catch (n) {
                e.log("localStorage.service | getItem | key=" + t + " | " + n)
            }
        return n = s[t]
    }
    function _setItem(t, n) {
        if (s[t] = n,
            r)
            try {
                return localStorage.setItem(t, n)
            } catch (n) {
                e.log("localStorage.service | setItem | key=" + t + " | " + n)
            }
    }
    function _removeItem(t) {
        if (delete s[t],
            r)
            try {
                localStorage.removeItem(t)
            } catch (n) {
                e.log("localStorage.service | removeItem | key=" + t + " | " + n)
            }
    }
    var r, s = {};
    t();

    jq.extend(true, window, {
        MAE: {
            LocalStorageService: {
                isLocalStorageAvailable: _isLocalStorageAvailable,//n
                getItem: _getItem,//a
                setItem: _setItem,//i
                removeItem: _removeItem //o

            }
        }
    });
})(jQuery);