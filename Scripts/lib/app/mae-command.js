var Command = {
    // UI
    execUI: function (url, commandName, args, options, success, fallback) {  
        var me = this;
        _.extend(options, this._defaultOptions);

        //me.popupProgreso = AreaMensajes.popupMensajeAccionEnProgreso(3 * 10000);

        this._exec(url, commandName, args, options, function (data) {
            if (!success) Log.debug('sin rutina success en Command.execUI');

         //   me.popupProgreso.cancelar();
            
            if (success) { 
                success(data);
            }
        }, function (data) {
            if (fallback) {
                fallback(data);
            }
        });
    },
    // Private
    _defaultOptions: {
    },
    _TEcallback: function (status, issue_no, sender) {
       // sender.popupProgreso.cancelar();
     //   AreaMensajes.popupMensajeErrorTecnico('Error Técnico', 'Código de Error: {0}, Número de identificación de incidente: {1}'.format(status, issue_no));
    },
    _FEcallback: function (status, sender) {
        //sender.popupProgreso.cancelar();
      //  AreaMensajes.popupMensajeErrorFuncional('Error de Validación', 'Código de Error: {0}'.format(status));
    },
    _serverfailure: function (errorThrown, sender) {
        //sender.popupProgreso.cancelar();
      //  AreaMensajes.popupMensajeErrorTecnico('Error en Servidor', 'La aplicación no puede conectarse al servidor o el servidor no puede responder a la petición. Intente mas tarde.');
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
    _convertFromWCFDictionary: function (wcfDictionaryArray) {
        var r = {};

        if (!wcfDictionaryArray) return r;

        for (var i = 0; i < wcfDictionaryArray.length; i++) {
            r[wcfDictionaryArray[i].Key] = wcfDictionaryArray[i].Value;
        }

        return r;
    },
    _exec: function (url, commandName, args, options, success, fallback) {
     //   var prg = AreaMensajes.popupMensajeProgeso('Procesando..', null, null);
        var me = this;
		
        var clientStartTime;

        options = options ? options : me._defaultOptions;

        if (options.includeClientMetrics) {
            clientStartTime = performance.now();
        }

      //  Log.debug('dispatching command {0} to run!', commandName);
        
        
        var command = {};
        var Commnade = {};

        //command.Options = me._convertToWCFDictionary(options);
        command.a = args.TipoAplicacion;
        
        var SecurityTokenId = AppContext.SECURITY_TOKEN_ID === null ? args.IdSession : AppContext.SECURITY_TOKEN_ID;
        if (args) {
            delete args.IdSession;//Elimino el id de sesion para que solo viaje en el header
            delete args.TipoAplicacion;
        }
        
        if (commandName == "AppContextCommand" || commandName == "LoginCommand" || commandName == "MenuCommand") {
            //command.__type = commandName + ':#mae.ordenes.server';
            //_.assign(command, args); 
            //command.$type = '@s.' + commandName + ', @a';
            //_.assign(command, args);
            //Commnade.d = JSON.stringify(command);
            //command = Commnade;
            command.d = JSON.stringify(command);
            command.k = commandName;
            command.b = true;

        }
        else {
             
            command.k = commandName;
            _.assign(Commnade, args);
            command.d = JSON.stringify(Commnade);//GetStringToServer(JSON.stringify(command));
            if (AppContext.Nonce && AppContext.ClientSecret && AppContext.ServerPublic) {
                var pk, sk, n;
                if (!(n = this.decodeNonce())) return;
                if (!(pk = this.decodeTheirPublicKey())) return;
                if (!(sk = this.decodeMySecretKey())) return;
                m = nacl.util.decodeUTF8(command.d);
                encrypted = nacl.box(m, n, pk, sk); //nacl.util.encodeBase64(nacl.box(m, n, pk, sk));
                command.d = System.Convert.ToBase64String(encrypted);
            }
        }

        this._autoTrimStrings(command); 
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(command),
            headers: { "SecurityTokenId": SecurityTokenId },
            success: function (data, textStatus, jqXHR) {
                //prg.modal('hide');
                var r = {};
                
                // (*) when using C# WCF 4.0 <webHttp automaticFormatSelectionEnabled="true"   /> data.d.Data is not needed.
                var jsonData = jQuery.parseJSON(data);
                r.data = jsonData.Data; // (*) 


                r.metaData = me._convertFromWCFDictionary(jsonData.MetaData); // (*) 
                r.status = jsonData.Status; // (*) 
       //         Log.debug('Command RequestId: {0}', data.RequestId);

                var typeOfStatus = r.status.substr(0, 2);
       
                switch (typeOfStatus) {
                    case "TE":
                        //Log.error('{2} - command {0} ABENDED with issue identifier: {1}', commandName, r.data.MensajeError[0], r.status);
                        //     AreaMensajes.popupMensajeErrorTecnico('Error Técnico', 'Número de identificación de incidente: {0} {1}'.format(data.RequestId, r.data.MensajeError[0]));
                        MAE.MaeApiService.notiError(String.Format('Error de Validación, Código de Error: {0} {1}', r.data[0], r.data[1]));
                        fallback(r.data);
                        break;
                    case "FE":
                        MAE.MaeApiService.notiError(String.Format('Error de Validación, Código de Error: {0} {1}', r.data[0], r.data[1]));
                        fallback(r.data);
                       // Log.debug('{1} - cannot run command {0} because of security privilegdes not granted!', commandName, r.status);
                     //   AreaMensajes.popupMensajeErrorFuncional('Error de Validación', 'Código de Error: {0} {1}'.format(data.RequestId, r.data.MensajeError[0]));

                        break;
                    case "EX":
                      //  Log.debug('{1} - command {0} dispatched/ran OK!', commandName, r.status);
                        success(r.data);
                        break;
                    case "SE": //Session expirada
                        //if (logSeguridad)
                        //    Log.debug('{1} - cannot run query {0} because your session has expired!', queryName, r.status);
                        window.location.href = WebURL + "main";
                        break;
                    default:
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //prg.modal('hide');
                //_hideLoading(AppContext.ClickedButton);
                $('button[disabled]').removeAttr('disabled');
                //Log.error('* * * command {0} ABENDED because of technical issue of remote server or network connectivity: {1}', commandName, errorThrown);
                //Log.debug('command round-trip was: {0}ms', performance.now() - clientStartTime);
                //AreaMensajes.popupMensajeErrorTecnico('Error en Servidor', 'La aplicación no puede conectarse al servidor o el servidor no puede responder a la petición. Intente mas tarde.');
                // error tecnico en cliente o server, registrar numero de incidente para seguimiento
            }
        }); 
    },
    _crypt: function (data) {
        var doOaepPadding = true;
        var rsa = new System.Security.Cryptography.RSACryptoServiceProvider();
        rsa.FromXmlString(AppContext.PublicKey);
        var rsaParamsPublic = rsa.ExportParameters(false);
        var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(data.toString());
        rsa.ImportParameters(rsaParamsPublic);
        var encryptedBytes = rsa.Encrypt(decryptedBytes, doOaepPadding);
        return System.Convert.ToBase64String(encryptedBytes);
    },
    createCommandContract: function (commandName) {
        var command = {};
        var clientStartTime;
        var options = this._defaultOptions;

        command.cmdType = commandName + ':#mae.ordenes.mvc';
        command.SecurityTokenId = AppContext.SECURITY_TOKEN_ID;

        this._autoTrimStrings(command);
        return command;
    },

    _autoTrimStrings: function (dto) {
        for (var p in dto) {
            if (typeof dto[p] === 'string') {
                dto[p] = dto[p].trim();
            }
        }
    },
    _resolveCallerBtn: function (args) {
        var $btn = null;
        if (!args.callee.caller) return null;
        if (args.callee.caller.arguments.length>0 && args.callee.caller.arguments[0].handleObj.type == 'click')
            return $(args.callee.caller.arguments[0].currentTarget);
        else return this._resolveCallerBtn(args.callee.caller.arguments);

    },
    decodeTheirPublicKey: function () {
        try {
            var k = nacl.util.decodeBase64(AppContext.ServerPublic);
            if (k.length !== nacl.box.publicKeyLength) {
                this.error('Bad public key length: must be ' + nacl.box.publicKeyLength + ' bytes');
                return null;
            }
            return k;
        } catch (e) {
            this.error('Failed to decode public key from Base64');
            return null;
        }
    },

    decodeMySecretKey: function () {
        try {
            var k = nacl.util.decodeBase64(AppContext.ClientSecret);
            if (k.length !== nacl.box.secretKeyLength) {
                this.error('Bad secret key length: must be ' + nacl.box.secretKeyLength + ' bytes');
                return null;
            }
            return k;
        } catch (e) {
            this.error('Failed to decode secret key from Base64');
            return null;
        }
    },

    decodeNonce: function () {
        try {
            var n = nacl.util.decodeBase64(AppContext.Nonce);
            if (n.length !== nacl.secretbox.nonceLength) {
                this.error('Bad nonce length: must be ' + nacl.secretbox.nonceLength + ' bytes');
                return null;
            }
            return n;
        } catch (e) {
            this.error('Failed to decode nonce from Base64');
            return null;
        }
    }
};