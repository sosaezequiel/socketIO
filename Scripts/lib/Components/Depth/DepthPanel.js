import React from 'react';
import DepthState from './context/DepthState';
import DepthList from './DepthList'

import './estilos.scss';


function DepthPanel(props) {

    const ref = React.createRef();

    return (
        <DepthState container={ref}>
            <div className="container-fluid depth-panel" ref={ref}>
                 <DepthList /> 
            </div>
        </DepthState>
    )

}

export default DepthPanel;

