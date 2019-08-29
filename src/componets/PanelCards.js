import React from 'react';
import DepthState from './DepthState';
import DepthList from './DepthList'


function DepthPanel(props) {

    const ref = React.createRef();

    function clickNew()
    {
        Demo.SocketService.emit("newItem", {name : "a"});
    }


    return (
        <>
            <div className="container-toolbar">
               <div className="row">
                    <div className="col-6">
                        <a onClick={clickNew} className="btn-dark">Click</a>    
                    </div>   
                </div> 

            </div>
            <DepthState container={ref}>
                <div className="container-fluid depth-panel" ref={ref}>
                    <DepthList />
                </div>
            </DepthState>
        </>
    )

}

export default DepthPanel;