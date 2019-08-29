(function (jq) {

    var _travel = {
        type: 1,
        startTime: 1,
        lastCall: 2,
        duration: 5
    }

    function _onMessage(travel) {

        switch (travel.data.type) {
            case 1: //progress
                {
                    _onProgress(travel.data);
                    break;
                };
            case 2: //wakeUpPre!
                {
                    _onWakeUpPre(travel.data);
                    break;
                };
            case 3: //wakeUp!
                {
                    _onWakeUp(travel.data);
                    break;
                };
            case 4: //tick!
                {
                    _onTick(travel.data);
                    break;
                }

        }
    };

    function _onTick(travel) {
        var time = travel.tick;
        console.log(time);
        jq("#progressCounter").text(time);
        //setTimeout(function () {
            
        //    jq("#progressCounter").text(time);
        //}, 0);

    }
    var _wekUp;
    function _onWakeUpPre(travel) {
        
        //console.log("_onWakeUpPre");
        jq("#progressCounter").addClass("wake-up-pre");
        if(!_wekUp.isOpen())
            _wekUp.show();

    };

    function _onWakeUp(travel) {
        console.log("_onWakeUp");
        _out();
        //_start();
    };

    function _out()
    {
        document.getElementById("logout").click();
    }
    function _onProgress(travel) {
        if (travel.stop) {
            stop();
        }

        var opacity = (travel.progress / 100);
        $(".progress-time").css("opacity", opacity).css("width", travel.progress + "%");
    };

    function _start() {
        _removeWekUpPre();
        var time = new Date();
        _travel.type = 1; //start
        _travel.startTime = time;
        // _travel.lastCall = .5;
        // _travel.duration = 2;
        timeWorker.postMessage(_travel);
    };

    function _init() {
        timeWorker.onmessage = _onMessage;
        _wekUp = new wekUp();
    };

    function _stop() {
        _removeWekUpPre();
        _travel.type = 2;//stop
        timeWorker.postMessage(_travel);

    };

    function _removeWekUpPre()
    {
        jq("#progressCounter").removeClass("wake-up-pre");
    }

    function _setOptions(options) {
        jq.extend(true, _travel, options);
    }


    jq.extend(true, window, {
        MAE: {
            TimeService:
            {
                Init: _init,
                Start: _start,
                Stop: _stop,
                setOptions: _setOptions,
                out : _out

            }
        }
    });

})(jQuery);