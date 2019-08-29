

var timeWorker = (function () {

    var _countframe = 0;
    var _startTime = 0;
    var _lastCall = 0;
    var _ticks = 0;
    var _timeUpdateID;

    /**
    var travel = {
        type: 10
    };

    self.postMessage(travel);
     */

    function _onMessage(oEvent) {

        switch (oEvent.data.type) {

            case 1: //start
                {
                    _startTime = oEvent.data.startTime;
                    _lastCall = oEvent.data.lastCall;
                    _duration = oEvent.data.duration;//minutos
                    _ticks = 0;
                    _timeUpdateID = setInterval(_timeUpdate, 990);
                    break;
                }
            case 2: //stop
                {

                    self.postMessage({
                        type: 1,
                        progress: 0,
                        stop: true
                    });

                    clearInterval(_timeUpdateID);
                    break;
                }

            default:
        }

    };

    function _timeUpdate() {


        // console.log(_ticks++ );

        var time = new Date();

        var travel;
        var elapsed = (time.getTime() - _startTime.getTime());

        var wakeUp = false;
        var wakeUpPre = false;
        var duration_ms = (_duration * 60 * 1000);
        var progress = (elapsed * 100) / duration_ms;
        var lastCall_ms = _lastCall * 60 * 1000;//minutos a milisegundos
        var elapse_hours_min_sec = time.getTime() + duration_ms;
        var timeFormat;

        timeFormat = new Date((duration_ms - elapsed));
        _ticks = timeFormat.getSeconds();

        self.postMessage({
            type: 4,
            tick: _ticks//timeFomat.getHours() +":"+ timeFomat.getMinutes() + ":" + timeFomat.getSeconds()
        });


        if (progress > 100)
            progress = 100;

        travel = { //progress
            type: 1,
            elapsed: elapsed,
            progress: progress,
            wakeUp: wakeUp,
            wakeUpPre: wakeUpPre,
            stop: false
        };

        self.postMessage(travel);

        if (elapsed >= (duration_ms - lastCall_ms)) {//wakeUpPre!! ultimo aviso
            wakeUp: false;
            wakeUpPre: true;
            travel = {
                type: 2,
                elapsed: elapsed,
                progress: progress,
                wakeUp: wakeUp,
                wakeUpPre: wakeUpPre
            };

            self.postMessage(travel);
        }




        if (elapsed >= duration_ms) { // wakeUp!! paso el tiempo
            wakeUp: true;
            travel = {
                type: 3,
                elapsed: elapsed,
                progress: 100,
                wakeUp: wakeUp,
                wakeUpPre: wakeUpPre
            };
            self.postMessage(travel);

            timeFomat = new Date(elapse_hours_min_sec + elapsed);
            self.postMessage({
                type: 4,
                tick: 0
            });
            var oEvent = {
                data: {
                    type: 2
                }
            }
            _onMessage(oEvent);
            return;
        }



        //cada segundo que transcurre
        // self.postMessage({
        //     type : 4,
        //     tick : Math.round(elapsed / 1000)    
        // }); 
        //var time_fromStart = _startTime.getTime();


    }


    function _loop() {

        ++_countframe;


        requestAnimationFrame(_loop);
    };

    var _obj = {

        onmessage: _onMessage
    };

    _loop();

    return _obj;

})();


self.onmessage = timeWorker.onmessage;