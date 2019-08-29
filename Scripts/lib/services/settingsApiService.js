/*
Dependencias = [ apiService,  logsService]
*/


(function (jq) {
    function _setAccount(e) {
        y = e.wtAccountId;
    }

    var promise;
    function _getUserData(t, onSuccess, onFail) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                getUserData: {
                    timestamp: t
                }
            }
        };

        
        promise = AppContext.getPortfoliosMercadosProductos();

        promise.then(function (data) {
             var user_data = {
                 str: data
             };
           //let user_data = {str : '{"marketWatchCategory":"PFA","marketWatchPorfolio":[{"value":"Dolar","label":"Dolar","transKey":"MARKET_WATCH_CATEGORY.DOLAR","Grupo":["MAE"]},{"value":"PFA","label":"PFA","transKey":"MARKET_WATCH_CATEGORY.FAVORITES","Grupo":["MERCADO_1"]},{"value":"PFB","label":"PFB","transKey":"MARKET_WATCH_CATEGORY.FAVORITES","Grupo":["MERCADO_1","MERCADO_2"]},{"value":"PFC","label":"PFC","transKey":"MARKET_WATCH_CATEGORY.FAVORITES","Grupo":["MERCADO_1","MERCADO_2","MERCADO_3"]}]}'};
            if(DEMO)
            {
                 user_data = {str : '{"marketWatchCategory":"PFA","marketWatchPorfolio":[{"value":"Dolar","label":"Dolar","transKey":"MARKET_WATCH_CATEGORY.DOLAR","Grupo":["MAE"]},{"value":"PFA","label":"PFA","transKey":"MARKET_WATCH_CATEGORY.FAVORITES","Grupo":["MERCADO_1"]},{"value":"PFB","label":"PFB","transKey":"MARKET_WATCH_CATEGORY.FAVORITES","Grupo":["MERCADO_1","MERCADO_2"]},{"value":"PFC","label":"PFC","transKey":"MARKET_WATCH_CATEGORY.FAVORITES","Grupo":["MERCADO_1","MERCADO_2","MERCADO_3"]}]}'};
                user_data.str = JSON.parse(user_data.str);
            }
                

            onSuccess(user_data);
        });
       // MAE.ApiService.sendSessionCommand("settingsGetUserData", i, onSuccess, onFail)
    }
    function _setUserData(t, onSuccess, onFail) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                setUserData: {
                    data: JSON.stringify(t)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsSetUserData", i, onSuccess, onFail);
    }
    function _getAccountData(t, n, a) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                getAccountData: {
                    wtAccountId: y,
                    timestamp: t
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetAccountData", i, n, a);
    }
    function _setAccountData(t, onSuccess, onFail) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                setAccountData: {
                    wtAccountId: y,
                    data: JSON.stringify(t)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsSetAccountData", i, onSuccess, onFail);
    }
    function _removeAccountData(t,onSuccess, onFail) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                accountId: y.endpoint_account(),
                removeAccountDataFields: {
                    fieldsPaths: [t]
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsRemoveAccountDataFields", i, onSuccess, onFail);
    }
    function _getChartTemplates(t, n) {
        var a = {
            MAEClientApi: {
                endpoint: "mae",
                getChartTemplates: {}
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartTemplates", a, t, n);
    }
    function _getChartTemplatesDefault(t, n) {
        var a = {
            MAEClientApi: {
                endpoint: "mae",
                getChartTemplatesDefault: {}
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartTemplatesDefault", a, t, n);
    }
    function _setChartTemplate(t, n, a, i, o) {
        var r = {
            MAEClientApi: {
                endpoint: "mae",
                setChartTemplate: {
                    templateId: t,
                    templateType: n,
                    data: JSON.stringify(a)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsSetChartTemplate", r, i, o)
    }
    function _getChartWorkspacesDescriptors(t, n) {
        var a = {
            MAEClientApi: {
                endpoint: "mae",
                getChartWorkspacesDescriptors: {}
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartWorkspacesDescriptors", a, t, n)
    }
    
    function _getChartWorkspacesLight(t, n) {
        var a = {
            MAEClientApi: {
                endpoint: "mae",
                getChartWorkspacesLight: {}
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartWorkspacesLight", a, t, n)
    }
    function _getWorkspaceChartPanel(t, n, a, i) {
        var o = {
            MAEClientApi: {
                endpoint: "mae",
                getChartPanel: {
                    workspaceId: t,
                    chartPanelId: n
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartPanel", o, a, i)
    }
    function _addWorkspaceChartPanel(t, n, a, i) {
        var o = {
            MAEClientApi: {
                endpoint: "mae",
                addChartPanel: {
                    workspaceId: t,
                    chartPanelData: JSON.stringify(n)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsAddChartPanel", o, a, i)
    }
    function _updateWorkspaceChartPanel(t, n, a, i, o) {
        var r = {
            MAEClientApi: {
                endpoint: "mae",
                updateChartPanel: {
                    workspaceId: t,
                    chartPanelId: n,
                    chartPanelData: JSON.stringify(a)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsUpdateChartPanel", r, i, o)
    }
    function _updateWorkspace(t, n, a, i) {
        var o = {
            MAEClientApi: {
                endpoint: "mae",
                updateWorkspace: {
                    workspaceId: t,
                    workspaceData: JSON.stringify(n)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsUpdateWorkspace", o, a, i)
    }
    function _getChartWorkspace(t, n, a, i) {
        var o = {
            MAEClientApi: {
                endpoint: "mae",
                getChartWorkspace: {
                    workspaceId: t,
                    timestamp: n
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartWorkspace", o, a, i)
    }
    function _setChartWorkspace(t, n, a, i) {
        var o = {
            MAEClientApi: {
                endpoint: "mae",
                setChartWorkspace: {
                    workspaceId: t,
                    data: JSON.stringify(n)
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsSetChartWorkspace", o, a, i)
    }
    function _removeChartPanelFromWorkspace(t, n, a, i) {
        var o = {
            MAEClientApi: {
                endpoint: "mae",
                removeChartPanel: {
                    workspaceId: t,
                    chartPanelId: n
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsRemoveChartPanel", o, a, i)
    }
    function _getChartUserDefaultTemplate(t, n) {
        var a = {
            MAEClientApi: {
                endpoint: "mae",
                getChartUserDefaultTemplate: {}
            }
        };
        MAE.ApiService.sendSessionCommand("settingsGetChartUserDefaultTemplate", a, t, n)
    }
    function _removeChartTemplate(t, n, a) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                removeChartTemplate: {
                    templateId: t
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsRemoveChartTemplate", i, n, a)
    }
    function _removeWorkspaceById(t, n, a) {
        var i = {
            MAEClientApi: {
                endpoint: "mae",
                removeChartWorkspace: {
                    workspaceId: t
                }
            }
        };
        MAE.ApiService.sendSessionCommand("settingsRemoveWorkspaceById", i, n, a)
    }
    function _removeChartWorkspaces(t, n) {
        var a = {
            MAEClientApi: {
                endpoint: "mae",
                removeChartWorkspaces: {}
            }
        };
        MAE.ApiService.sendSessionCommand("settingsRemoveChartWorkspaces", a, t, n)
    }
    var y;
    jq.extend(true, window, {
        MAE: {
            SettingsApiService:
            {
                setAccount: _setAccount,//t
                getUserData: _getUserData,//n
                setUserData: _setUserData,//a
                getAccountData: _getAccountData,//i
                setAccountData: _setAccountData,//o
                removeAccountData: _removeAccountData,//r
                getChartTemplates: _getChartTemplates,//s
                getChartTemplatesDefault: _getChartTemplatesDefault,//c
                setChartTemplate: _setChartTemplate,//u
                getChartWorkspacesDescriptors: _getChartWorkspacesDescriptors,//l
                getChartWorkspacesLight: _getChartWorkspacesLight,//d
                getWorkspaceChartPanel: _getWorkspaceChartPanel,//S
                addWorkspaceChartPanel: _addWorkspaceChartPanel,//p
                updateWorkspaceChartPanel: _updateWorkspaceChartPanel,//g
                updateWorkspace: _updateWorkspace,//f
                getChartWorkspace: _getChartWorkspace,//m
                setChartWorkspace: _setChartWorkspace,//v
                getChartUserDefaultTemplate: _getChartUserDefaultTemplate,//E
                removeChartTemplate: _removeChartTemplate,//D
                removeWorkspaceById: _removeWorkspaceById,//h
                removeChartPanelFromWorkspace: _removeChartPanelFromWorkspace,//b
                removeChartWorkspaces: _removeChartWorkspaces //C
            }
        }
    });


})(jQuery);