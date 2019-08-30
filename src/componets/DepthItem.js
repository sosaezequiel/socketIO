import React, { useEffect, useContext, useRef, useState } from 'react';
import DepthContext from './DepthContext';
import Types from './Types';



function DepthItem(props) {
    const context = useContext(DepthContext)
    const container = useRef()


    const [item, setItem] = useState({ name: "test" });
    const [items_pending, setItemPending] = useState(null);

    const ref_item = useRef(item);
    const ref_item_pending = useRef([]);

    function estaContenido(clientX, clientY) {

        const abajoDeMouse = document.elementFromPoint(clientX, clientY);
        if (!container.current) return false;
        if (container.current.contains(abajoDeMouse))
            return true;
        else
            return false;

    }

    const onMouseEnter = (event) => {

        container.current.classList.add("depth-item-over");
    }

    const onMouseLeave = (event) => {

        let { clientX, clientY } = event;

        if (!estaContenido(clientX, clientY)) {
            container.current.classList.remove("depth-item-over");


        }
        event.preventDefault();

    }

    const onPriceChangeUpdate = (e, producto) => {//c

        if (ref_item.current.name == producto.name)
            setItem(producto);


    }

    function _link(item) {

        if (props.type && props.type == Types.Link) {

            ref_item.current = checkedOrigen(item)
            setItem(ref_item.current);

            MAE.DepthModule.refreshDepth();


            container.current.classList.add("depth-item-in");
            setTimeout((container) => {
                container.current.classList.remove("depth-item-in");

            }, 100, container);
        }
    }


    useEffect(() => {
        ref_item.current = item;
    })

    useEffect(() => {

        ref_item.current = item;



        return () => {


        }

    }, [item.name]);


    return (
        <div className="card card-depth" ref={container} >
            <span className="position-absolute clickable close-icon" data-effect="fadeOut" style={{ right: "10px", top: "2px" }} onClick={() => setItem({ name: "test" })}><i className="fa fa-times"></i></span>
            <div className="card-header text-center">
                <div className="depth-producto">
                    ({item.edad}) {item.name}
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-12 text-center border">Habitación</div>
                </div>
                <div className="row">
                    <div className="col-6 text-center border">
                        <div className="row">
                            <div className="col-12  text-center">Fecha Ingreso</div>
                        </div>

                        <div className="row">
                            <div className="col-6 text-center">Fecha</div>
                            <div className="col-6 text-center">Hora</div>
                        </div>
                    </div>

                    <div className="col-6 text-center border">
                        <div className="row">
                            <div className="col-12  text-center">Fecha Egreso</div>
                        </div>

                        <div className="row">
                            <div className="col-6 text-center">Fecha</div>
                            <div className="col-6 text-center">Hora</div>
                        </div>
                    </div>
                </div>


            </div>
            <div className="card-footer"></div>
        </div>
    )
}

export default DepthItem;
