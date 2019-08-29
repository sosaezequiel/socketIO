var logSeguridad = false;

var Query = {
   
    // UI
    execGridUI: function (url, queryName, filters, options, success) {
        var me = this;
        //var popupProgreso = AreaMensajes.popupMensajeAccionEnProgreso(5 * 10000);
        //var options = { requireIdentityFilter: true };
        _.extend(options, this._defaultOptions);
        this._exec(url, queryName, 'Grid', filters, options, function (data, jqXHR) {

            // popupProgreso.cancelar();

            //if (data.length == 0) AreaMensajes.toastInfo('NO HAY REGISTROS CON EL FILTRO SELECCIONADO');
            success(data, jqXHR);
        });
    },

    execCombosUI: function (url, queryName, options, filters, success) {
        var me = this;

        _.extend(options, this._defaultOptions);

        this._exec(url, queryName, 'Combos', filters, options, function (data) {
            success(data);
        });
    },

    execAutoCompleteUI: function (url, queryName, filters, options, success) {
        var me = this;
        _.extend(options, this._defaultOptions);
        this._exec(url, queryName, 'Combos', filters, options, function (data) {
            success(data);
        });
    },

    execReadFullRecordUI: function (url, queryName, _nombreCampoIdentidad, r_id, options, success) {
        var me = this;
        _.extend(options, this._defaultOptions);
        var param = (param = {}, param[_nombreCampoIdentidad] = r_id, param);

        this._exec(url, queryName, 'FullRecord', param, options, function (data) {
            success(data);
        });
    },

    execDataUI: function (url, queryName, filters, success) {
        var me = this;
        var options = { requireIdentityFilter: true };

        //Object.assign(options, this._defaultOptions) NO FUNCA EN IE
        _.extend(options, this._defaultOptions);

        Query._exec(url, queryName, 'Data', filters, options, function (data) {
            success(data);
        });
    },

    execSimpleQuery: function (queryname, filtros, requiereIdentity, cb) {
        var options = { returnColumnNames: true, gridAdapter: true };
        if (requiereIdentity)
            options.requireIdentityFilter = true;

        Query.execGridUI(AppContext.QueryServices, queryname, filtros, options, function (data, jqXHR) {

            if (cb != null && typeof (cb) == 'function') {
                var result = JSON.parse(jqXHR.responseText, JSON.dateParser);//JSON.parseWithDate(jqXHR.responseText);
                var resultWithColumns = [];

                for (var i = 0; i < result.Data.length; i++) {
                    resultWithColumns.push(_.zipObject(result.ColumnNames, result.Data[i]));
                }
                result.Data = resultWithColumns;
                cb(result);
            }

        }, null, null, null);
    },

    execQueryGridHelper: function (queryname, filtros, requiereIdentity, cb) {
        var options = { returnColumnNames: true };
        if (requiereIdentity)
            options.requireIdentityFilter = true;

        Query.execGridUI(AppContext.QueryServices, queryname, filtros, options, function (data, jqXHR) {

            if (cb !== null && typeof cb === 'function') {
                var result = jQuery.parseJSON(JSON.parse(jqXHR.responseText, JSON.dateParser));
                var resultWithColumns = [];

                for (var i = 0; i < result.Data.length; i++) {
                    resultWithColumns.push(_.zipObject(result.ColumnNames, result.Data[i]));
                }
                result.Data = resultWithColumns;
                cb(result, data);
            }

        }, null, null, null);
    },

    // Private
    _defaultOptions: {
    },
    _TEcallback: function (status, issue_no) {
    //    AreaMensajes.popupMensajeErrorTecnico('Error Técnico', 'Código de Error: {0}, Número de identificación de incidente: {1}'.format(status, issue_no));
    },
    _FEcallback: function (status) {
      //  AreaMensajes.popupMensajeErrorFuncional('Error de Datos', 'Código de Error: {0}'.format(status));
    },
    _serverfailure: function (errorThrown) {
       // AreaMensajes.popupMensajeErrorTecnico('Error en Servidor', 'La aplicación no puede conectarse al servidor o el servidor no puede responder a la petición. Intente mas tarde.');
    },
    _convertToWCFDictionary: function (o) {
        var r = [];

        if (!o) return r;

        for (var e in o) {
            r.push({
                Key: e,
                Value: o[e]
            });
        }
        return r;
    },

    _exec: function (url, queryName, type, filters, options, success) {
        
     //   Pace.restart();
        var me = this;

        var clientStartTime;

        options = options ? options : me._defaultOptions;
        filters = filters ? filters : {};

        if (options.includeClientMetrics) {
            clientStartTime = performance.now();
        }

        var querye = {};
        var query = {
            Name: queryName,
            Filters: me._convertToWCFDictionary(filters),
            Type: type.capitalizeFirstLetter(),
            Options: me._convertToWCFDictionary(options)
        };
        
        query.$type = "mae.ordenes.mvc." + queryName + ", mae.ordenes.mvc";
        
        //querye.d = GetStringToServer(JSON.stringify(query));
        querye.d = JSON.stringify(query);

        this._autoTrimStrings(querye);
        
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(querye),
            headers: { "SecurityTokenId": AppContext.SECURITY_TOKEN_ID },
            success: function (dataString, textStatus, jqXHR) {
                var r = {};
                var data = jQuery.parseJSON(dataString);
                r.data = data.Data; // (*) 
                r.metaData = data.MetaData; // (*) 
                r.status = data.Status; // (*) 

//                Log.debug('Query RequestId: {0}', data.RequestId);
                if (options.includeClientMetrics) {
                    var clientEndTime = performance.now();
                    r.metaData = r.metaData || {};
                    r.metaData.clientMetrics = clientEndTime - clientStartTime;
                }

                var typeOfStatus = r.status.substr(0, 2);
                switch (typeOfStatus) {
                    case "TE":
                        //if (logSeguridad)
                        //                          Log.error('{2} - query {0} ABENDED with issue identifier: {1}', queryName, r.data.MensajeError[0], r.status);
                        // AreaMensajes.popupMensajeErrorTecnico('Error Técnico', 'Número de identificación de incidente: {0} {1}'.format(data.RequestId, r.data.MensajeError[0]));
                        MAE.MaeApiService.notiError(String.Format('Error de Validación, Código de Error: {0} {1}', r.data[0], r.data[1]));
                        break;
                    case "FE":
                        //if (logSeguridad)
                        // Log.debug('{1} - cannot run query {0} because of security privilegdes not granted!', queryName, r.status);
                        // AreaMensajes.popupMensajeErrorFuncional('Error de Datos', 'Código de Error: {0} {1}'.format(data.RequestId, r.data.MensajeError[0]));
                        MAE.MaeApiService.notiError(String.Format('Error de Validación, Código de Error: {0} {1}', r.data[0], r.data[1]));
                        break;
                    case "EX":
                        //if (logSeguridad)
                        //                      Log.debug('{1} - query {0} run OK!', queryName, r.status);
                        if (options.ejecutaRowCustomQuery == true || options.filtersAdapter == true || options.gridAdapter == true)
                            success(data.Data, jqXHR);
                        else
                            success(me._parseResult(type, data), jqXHR);
                        break;
                    case "SE": //Session expirada
                        window.location.href = WebURL + "main";
                        break;
                    default:
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                me.failure(errorThrown);
                // error tecnico en cliente o server, registrar numero de incidente para seguimiento
            }
        });
    },
    _crypt: function (data) {
        var doOaepPadding = true;
        var rsa = new System.Security.Cryptography.RSACryptoServiceProvider();
        rsa.FromXmlString(AppContext.PublicKey);
        var rsaParamsPublic = rsa.ExportParameters(false);
        var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(data);
        rsa.ImportParameters(rsaParamsPublic);
        var encryptedBytes = rsa.Encrypt(decryptedBytes, doOaepPadding);
        return System.Convert.ToBase64String(encryptedBytes);
    },
    _parseResult: function (type, data) {
        var me = this;
        switch (type) {
            case 'Grid':
                return me._parseGridResult(data);
            case 'Combos':
                return me._parseCombosResult(data);
            case 'Data':
                return me._parseDataResult(data);
            case 'FullRecord':
                return me._parseFullRecordResult(data);
            default:
                if (logSeguridad)
                    Log.error('parsing QUERY result ({0}) INTERNAL ERROR'.format(type));
                throw 'INTERNAL ERROR';
        }
    },
    _parseGridResult: function (data) {
        var rGrid = jQuery.extend({}, data);
        delete rGrid.MetaData;
        delete rGrid.Status;
        rGrid.data = rGrid.Data[0];
        delete rGrid.Data;
        return rGrid;
    },
    _parseDataResult: function (data) {
        return data.Data;
    },
    _parseCombosResult: function (dataset) {
        var me = this;
        var r = {};

        for (var i = 0; i < dataset.Data.length; i++) {
            r[i] = me._convertToKeyPair(dataset.Data[i]);
        }

        return r;
    },
    _parseFullRecordResult: function (dataset) {
        var me = this;
        var r = {};

        for (var i = 0; i < dataset.Data.length; i++) {
            r[i] = me._convertToKeyPair(dataset.Data[i]);
        }

        return r;
    },
    _convertToKeyPair: function (dataset) {
        var columns = dataset.Columns;

        var r = [];
        for (var i = 0; i < dataset.Data.length; i++) {
            var e = {};
            for (var j = 0; j < columns.length; j++) {
                e[columns[j]] = dataset.Data[i][j];
            }
            r.push(e);
        }
        return r;
    },
    _autoTrimStrings: function (dto) {
        for (var p in dto) {
            if (typeof dto[p] === 'string') {
                dto[p] = dto[p].trim();
            }
        }
    },
    failure: function (err) {
      //  AreaMensajes.popupMensajeErrorTecnico('Error en Servidor', err.message);
    },

    execQueryGridHelperAdapter: function (queryname, filtros, requiereIdentity, cb, gridAdapter) {
        
        var options = { returnColumnNames: true };
        if (gridAdapter)
            options.gridAdapter = gridAdapter;

        if (requiereIdentity)
            options.requireIdentityFilter = true;

        Query.execGridUI(AppContext.QueryServices, queryname, filtros, options, function (data, jqXHR) {

            if (cb !== null && typeof cb === 'function') {
                var result = jQuery.parseJSON(JSON.parse(jqXHR.responseText));
                if (!options.hasOwnProperty('gridAdapter')) {
                    var resultWithColumns = [];
                    
                    for (var i = 0; i < result.Data.length; i++) {
                        resultWithColumns.push(_.zipObject(result.ColumnNames, result.Data[i]));
                    }
                    result.Data = resultWithColumns;
                }
                cb(result, data);
            }

        }, null, null, null);
    },

};
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}