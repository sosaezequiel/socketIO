(function (jq) {
    var _dicTraduccion = {};
    function _instant(texto) {
        /*Aca se usa el diccionario de traduccion*/
        var traduccionTexto = _dicTraduccion[texto];
        console.log("traducciones[\"" + texto + "\"] = \"traduccion\" " + traduccionTexto);
        if(traduccionTexto)
            texto = traduccionTexto;

        return texto;
    }

    function _use() {
        return "en";
    }

    function _setTraducciones(dicTraduccion) {
        _dicTraduccion = dicTraduccion;
    }


    var _translatorService = {
        instant: _instant,
        use: _use,
        setTraducciones: _setTraducciones
    };



    jq.extend(true, window, {
        MAE: {
            TranslatorService: _translatorService

        }
    });

})(jQuery);