//LayoutUtils
(function (t) {
    t.extend(true, window, {
        MAE: {
            LayoutUtils: _LayoutUtils
        }
    });
    function _LayoutUtils() {
        function _parseLayout(e) {
            var i = e;
            var n;
            var o, r;
            if (i instanceof ContainerData) {
                switch (i.type) {
                    case ContainerDataType.HORIZONTAL:
                        n = new MAE.HDividedContainer(i.id);
                        break;
                    case ContainerDataType.VERTICAL:
                        n = new MAE.VDividedContainer(i.id);
                        break;
                    case ContainerDataType.TABS:
                        n = new MAE.TabbedContainer(i.id, i.activeChildIndex);
                        break
                }
                n.setPercentSize(i.percentSize);
                for (o = 0; o < i.children.length; o++) {
                    r = i.children[o];
                    n.addChild(_parseLayout(r), undefined, false)
                }
            } else if (i instanceof ModuleData) {
                if (i.children && i.children.length > 0) {
                    n = new MAE.SubmodulesContainer(i.id, i, i.activeChildIndex);
                    for (o = 0; o < i.children.length; o++) {
                        r = i.children[o];
                        n.addChild(_parseLayout(r), undefined, false)
                    }
                } else {
                    n = new MAE.ModuleContainer(i.id, i)
                }
            } else {
                throw "LayoutUtils.parseLayout() - can not parse layout data object"
            }
            return n
        }
        function _findSubmodulesContainer(t, e) {
            var n = e;
            var o;
            if (n instanceof MAE.ContainerBase) {
                for (var r = 0; r < n.children.length; r++) {
                    var a = n.children[r];
                    if (a.id == t) {
                        return n
                    }
                    o = _findModuleTabbedContainer(t, a);
                    if (o) {
                        return o
                    }
                }
            }
            return null
        }
        function _findModuleTabbedContainer(t, e) {
            var n = e;
            var o;
            if (n instanceof MAE.ContainerBase) {
                for (var r = 0; r < n.children.length; r++) {
                    var a = n.children[r];
                    if (a.id == t) {
                        return n
                    }
                    o = _findModuleTabbedContainer(t, a);
                    if (o) {
                        return o
                    }
                }
            }
            return null
        }
        function _findModuleContainer(t, e) {
            var n = _findModuleTabbedContainer(t, e);
            if (n) {
                for (var o = 0; o < n.children.length; o++) {
                    if (n.children[o].id == t) {
                        return n.children[o]
                    }
                }
            }
            return null
        }
        function _refreshTabbedContainersConstraints(t) {
            var e = t;
            if (e instanceof MAE.TabbedContainer) {
                e.recalculateSizeConstraints(false)
            } else if (e instanceof MAE.DividedContainer) {
                for (var i = 0; i < e.children.length; i++) {
                    var n = e.children[i];
                    _refreshTabbedContainersConstraints(n)
                }
            }
        }
        function _recalculateDividedContainersSize(t, e) {
            e = e != undefined ? e : true;
            var i = t;
            if (i instanceof MAE.DividedContainer) {
                for (var n = 0; n < i.children.length; n++) {
                    var o = i.children[n];
                    _recalculateDividedContainersSize(o, false)
                }
                i.handleResizeChildContainerRequest()
            } else if (i instanceof MAE.TabbedContainer && e) {
                i.setPercentSize(100)
            }
        }
        function _getMaximizedContainer(t) {
            var e = t;
            if (e instanceof MAE.TabbedContainer) {
                if (e.isMaximized) {
                    return e
                } else {
                    return null
                }
            } else if (e instanceof MAE.ContainerBase) {
                for (var i = 0; i < e.children.length; i++) {
                    var n = _getMaximizedContainer(e.children[i]);
                    if (n) {
                        return n
                    }
                }
                return null
            }
        }
        function _minimizeAllTabs(t) {
            var e = t;
            if (e instanceof MAE.TabbedContainer) {
                e.minimize()
            } else if (e instanceof MAE.ContainerBase) {
                for (var i = 0; i < e.children.length; i++) {
                    var n = e.children[i];
                    if (n instanceof MAE.TabbedContainer) {
                        n.minimize()
                    } else {
                        _minimizeAllTabs(n)
                    }
                }
            }
        }
        function _hideAllTabs(t) {
            var e = t;
            if (e instanceof MAE.TabbedContainer) {
                e.hide()
            } else if (e instanceof MAE.ContainerBase) {
                for (var i = 0; i < e.children.length; i++) {
                    var n = e.children[i];
                    if (n instanceof MAE.TabbedContainer) {
                        n.hide()
                    } else {
                        _hideAllTabs(n)
                    }
                }
            }
        }
        function _setAvailableTabs(t, e, i) {
            i = i != undefined ? i : true;
            var n = t;
            if (n instanceof MAE.TabbedContainer) {
                n.setAvailableTabs(e, i)
            } else if (n instanceof MAE.ContainerBase) {
                for (var o = 0; o < n.children.length; o++) {
                    var r = n.children[o];
                    if (r instanceof MAE.TabbedContainer) {
                        r.setAvailableTabs(e, i)
                    } else {
                        _setAvailableTabs(r, e, i)
                    }
                }
            }
        }
        function _hideAvailableTabsDropdown(t) {
            var e = t;
            if (e instanceof MAE.TabbedContainer) {
                e.addTabDropdown.clickOutsideProxy()
            } else if (e instanceof MAE.ContainerBase) {
                for (var i = 0; i < e.children.length; i++) {
                    var n = e.children[i];
                    if (n instanceof MAE.TabbedContainer) {
                        n.addTabDropdown.hideDropdownProxy()
                    } else {
                        _hideAvailableTabsDropdown(n)
                    }
                }
            }
        }
        function _findContainer(t, e) {
            var i = e;
            var n;
            if (i instanceof MAE.ContainerBase) {
                if (i.id == t) {
                    return i
                } else {
                    for (var o = 0; o < i.children.length; o++) {
                        var r = i.children[o];
                        n = _findContainer(t, r);
                        if (n) {
                            return n
                        }
                    }
                }
            }
            return null
        }
        function _isModuleInContainer(t, e) {
            for (var i = 0; i < e.children.length; i++) {
                var n = e.children[i];
                if (n.id == t) {
                    return true
                }
            }
            return false
        }
        function _isTabMaximized(t, e) {
            var i = _getMaximizedContainer(e);
            if (i) {
                return _isModuleInContainer(t, i)
            }
            return false
        }
        return {
            refreshTabbedContainersConstraints: _refreshTabbedContainersConstraints, //o
            parseLayout: _parseLayout,//t
            findSubmodulesContainer: _findSubmodulesContainer,//e
            findModuleTabbedContainer: _findModuleTabbedContainer, //i
            findContainer: _findContainer, //c
            findModuleContainer: _findModuleContainer, //n
            isModuleInContainer: _isModuleInContainer, //u
            recalculateDividedContainersSize: _recalculateDividedContainersSize, //r
            getMaximizedContainer: _getMaximizedContainer,//a
            minimizeAllTabs: _minimizeAllTabs,//s
            hideAllTabs: _hideAllTabs, //d
            setAvailableTabs: _setAvailableTabs,//h
            hideAvailableTabsDropdown: _hideAvailableTabsDropdown, //l
            isTabMaximized: _isTabMaximized//p
        }
    }
}
)(jQuery);