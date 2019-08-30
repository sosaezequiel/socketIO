import React from 'react';
import DepthState from './DepthState';
import DepthList from './DepthList'


function DepthPanel(props) {

    const ref = React.createRef();

    function clickNew()
    {
        Demo.SocketService.emit("newItem", {name : "a", msg : "nuevo desde cliente"});
    }

    function clickClear()
    {
        Demo.SocketService.emit("clearItem", {name : "a", msg : "clear desde cliente"});
    }

    return (
        <>
            <div className="container-toolbar d-flex flex-column justify-content-end align-items-center">
               <div className="row">
                    <div className="col-6">
                        <a onClick={clickNew} className="btn btn-dark">Nuevo</a>    
                    </div>
                    <div className="col-6">
                        <a onClick={clickClear} className="btn btn-dark">Limpiar</a>    
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