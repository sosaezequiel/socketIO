import React, { useEffect, useReducer, useRef } from 'react';
import DepthContext from './DepthContext';
import DepthReduce from './DepthReduce';

import Types from './Types';

const initialState = {
    depthLink: null,
    depthA: null,
    depthB: null,
    depthC: null
};




function DepthState(props) {

    const [state, dispatch] = useReducer(DepthReduce, initialState);

    const ref_state = useRef(state);

    function onItemMatch({ type, item, prop }) {
        dispatch({
            type: type,
            [type]: item
        });
    }



    function estaContenido(clientX, clientY) {
        const container = props.container;

        const abajoDeMouse = document.elementFromPoint(clientX, clientY);
        if (container.current.contains(abajoDeMouse))
            return true;
        else
            return false;

    }


    function _dragAndDrop(e, data) {
        switch (e) {
            case "DepthEvent.ITEM_START_DRAG":

                break;
            case "DepthEvent.ITEM_DRAG_DROP":


                break;
            case "DepthEvent.ITEM_END_DRAG":

                break;
        }
    }




    useEffect(()=>{
        ref_state.current = state;

    })

    useEffect(() => {

        MAE.DepthService.subscribeDragAndDrop(_dragAndDrop);


        return () => {

            MAE.DepthService.unsubscribeDragAndDrop(_dragAndDrop);

        }

    }, []);

    return (
        <DepthContext.Provider value={
            {
                //depthLink: state.depthLink,
                // depthA: state.depthA,
                // depthB: state.depthB,
                // depthC: state.depthC,
                onItemMatch: onItemMatch

            }
        }>
            {props.children}
        </DepthContext.Provider>
    )

};

export default DepthState;