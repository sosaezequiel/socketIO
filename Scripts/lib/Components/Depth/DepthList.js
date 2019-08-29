import React, { useContext } from 'react'
import DepthContext from './context/DepthContext';
import Types from './context/Types';
import DepthItem from './DepthItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';




function DepthList() {

    const context = useContext(DepthContext);


    return (

        <div className="row depth-list d-flex justify-content-center w-100">
            <div className="depth-item">
                <DepthItem type={Types.Link} />
            </div>
            <div className="depth-item">
                <DepthItem />
            </div>
            <div className="depth-item">
                <DepthItem />
            </div>
            <div className="depth-item">
                <DepthItem />
            </div>
            <div className="depth-item">
                <DepthItem />
            </div>
            <div className="depth-item">
                <DepthItem />
            </div>
        </div>
    )

}



export default DepthList;