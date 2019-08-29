import React, { useContext, useEffect, useRef, useState } from 'react'
import DepthContext from './DepthContext';
import Types from './Types';
import DepthItem from './DepthItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';


//var itemList = [];

function DepthList() {

    const context = useContext(DepthContext);
    const [itemList, setList] = useState([]);

    function onNewItem(item) {
        itemList.push(item);
        setList([]);
        setList(itemList);
    }

    useEffect(() => {

        Demo.SocketService.subscribe("newItem", onNewItem);

        return () => {


        }

    }, []);


    return (


        <div className="row depth-list d-flex justify-content-center w-100">
            {itemList.map((it, index)=> {
                return (<div className="depth-item" key={index}>
                    <DepthItem item={it} />
                </div>
                )
            })}
        </div>
    )

}

export default DepthList;