import React, { useEffect, useContext, useRef, useState } from 'react';
import DepthContext from './context/DepthContext';
import Types from './context/Types';



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

    function checkedOrigen(ite) {
        if (ite.name)
            return ite;

        //si no es completo entonces lo busco en MarketWatchDepthService.


        var temp_ite = MAE.MarketWatchDepthService.getTrackProductByKey(ite.key) || MAE.MarketWatchService.getTrackProductByKey(ite.key);


        return temp_ite;
    }

    const _dragAndDrop = (e, data) => {
        switch (e) {
            case "DepthEvent.ITEM_START_DRAG":
                break;

            case "DepthEvent.ITEM_DRAG_DROP":
                {
                    let { clientX, clientY } = data.event;

                    if (estaContenido(clientX, clientY)) {
                        container.current.classList.add("depth-item-in");
                        ref_item.current = checkedOrigen(data.item);
                        setItem(ref_item.current);

                        MAE.DepthModule.refreshDepth();


                    }

                    break;
                }
            case "DepthEvent.ITEM_END_DRAG":
                setTimeout((container) => {
                    container.current.classList.remove("depth-item-in");

                }, 300, container);



                break;

        }
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

    function _onPending(e, data, o) {

        switch (e) {
            case DataEvent.EXIST:
                break;
            case DataEvent.ITEM_LIST:
                if (ref_item.current.name === "test")
                    return;

                ref_item_pending.current = [];
                _.forEach(data, function (ite_for) {
                    if (ite_for.key === ref_item.current.key) {
                        if (ite_for.orderId2 != undefined)
                            ref_item_pending.current.push(ite_for);
                    }
                });
                //if (ref_item_pending.current.length > 0)
                setItemPending(ref_item_pending.current);
                break;
            case DataEvent.NEW:
                if (ref_item.current.name === "test")
                    return;

                _.forEach(data, function (ite_for) {
                    if (ite_for.key === ref_item.current.key) {
                        if (ite_for.orderId2 != undefined)
                            ref_item_pending.current.push(ite_for);

                    }
                });
                //if (ref_item_pending.current.length > 0)
                setItemPending(ref_item_pending.current);

                break;
            case DataEvent.UPDATED:
                if (ref_item.current.name === "test")
                    return;

                if (!ref_item_pending.current) ref_item_pending.current = [];

                _.forEach(data, function (ite_for) {
                    if (ite_for.key === ref_item.current.key) {
                        if (ite_for.orderId2 != undefined) {
                            _.remove(ref_item_pending.current, function (ite) {
                                return !ite;
                            });
                            let temp_item_update = ref_item_pending.current.find(t => t.orderId2 == ite_for.orderId2);
                            if (temp_item_update) {
                                let index_temp_update = ref_item_pending.current.indexOf(temp_item_update);
                                delete ref_item_pending.current[index_temp_update];
                                ref_item_pending.current.push(ite_for);
                                //ref_item_pending.current[index_temp_update] = ite_for;
                            }
                            else {
                                ref_item_pending.current.push(ite_for);
                            }

                            setItemPending([]);
                            setItemPending(ref_item_pending.current);
                        }

                    }
                });

                break;
            case DataEvent.REMOVED:
                if (ref_item.current.name === "test")
                    return;

                let a;
                for (let l = 0, t = data.length; l < t; l++) {
                    a = data[l];

                    _.remove(ref_item_pending.current, function (ite) {
                        return !ite;
                    });

                    _.remove(ref_item_pending.current, function (ite) {
                        return ite.id == a.id;

                    });

                }
                setItemPending(ref_item_pending.current);

                break;
            case DataEvent.NO_DATA:

        }
    }

    useEffect(() => {
        ref_item.current = item;
    })

    useEffect(() => {

        ref_item.current = item;

        MAE.DepthService.subscribeLinkDepth(_link);
        MAE.DepthService.subscribeDragAndDrop(_dragAndDrop);
        MAE.MaePriceChangeService.getAndSubscribePriceChange(item.name, onPriceChangeUpdate);

        return () => {


            MAE.DepthService.unsubscribeLinkDepth(_link);
            MAE.DepthService.unsubscribeDragAndDrop(_dragAndDrop);
            MAE.MaePriceChangeService.unsubscribePriceChange(item.name, onPriceChangeUpdate);
        }

    }, [item.name]);


    useEffect(() => {
        MAE.PendingTradesService.initSubscriptions(_onPending);

        return () => {
            MAE.PendingTradesService.removeSubscriptions(_onPending);
        }
    }, []);






    if (item.name == "test") {
        return (<div className="card card-depth card-depth-empty d-flex justify-content-center align-items-center" ref={container} >NO DATA </div>)
    }
    else {

        let plain_items = [];

        let plain_items_bid = [];
        let plain_items_ask = [];

        if (items_pending) {
            plain_items_bid = _.groupBy(items_pending.filter(p => p.side == OrderType.BID), (t) => t.price);
            plain_items_ask = _.groupBy(items_pending.filter(p => p.side == OrderType.ASK), (t) => t.price);
        }

        if (items_pending) {

            for (let item in plain_items_bid) {

                plain_items.push({
                    side: OrderType.BID,
                    price: +item,
                    volume: _.sumBy(plain_items_bid[item], p => {
                        if (p.orderId2)
                            return +p.volume

                        return 0;
                    })

                });
            }


            for (let item in plain_items_ask) {

                plain_items.push({
                    side: OrderType.ASK,
                    price: +item,
                    volume: _.sumBy(plain_items_ask[item], p => {
                        if (p.orderId2)
                            return +p.volume

                        return 0;
                    })

                });
            }
        }
        // if (items_pending) {
        //     let container_items = _.groupBy(items_pending, (t) => t.price);

        //     for (let item in container_items) {

        //         plain_items.push({

        //             price: +item,
        //             volume: _.sumBy(container_items[item], p => {
        //                 if (p.orderId2)
        //                     return +p.volume

        //                 return 0;
        //             })

        //         });
        //     }
        // }


        const items = item.marketDepthDataProvider.map((it, index) => {
            let es_mia_buy = "";
            let es_mia_sell = "";

            let tienePendingBid = plain_items.find(t => {
                return (t.side == OrderType.BID && t.price == it.data.bid && +t.volume == it.data.bidVolume);
            });

            let tienePending_partialBid = plain_items.find(t => {
                return (t.side == OrderType.BID && t.price == it.data.bid && +t.volume < it.data.bidVolume);
            });

            let tienePendingAsk = plain_items.find(t => {
                return (t.side == OrderType.ASK && t.price == it.data.ask && +t.volume == it.data.askVolume);
            });

            let tienePending_partialAsk = plain_items.find(t => {
                return (t.side == OrderType.ASK && t.price == it.data.ask && t.volume < it.data.askVolume);
            });


            es_mia_buy = tienePendingBid ? "item-owner-depth" : "";
            es_mia_sell = tienePendingAsk ? "item-owner-depth" : "";



            if (tienePending_partialBid) {
                es_mia_buy = "item-owner-depth-partial";
            }

            if (tienePending_partialAsk) {
                es_mia_sell = "item-owner-depth-partial";
            }

            return (
                <div className="row" key={index}>
                    <div className="col-6 text-center">
                        <div className={`row ${es_mia_buy}`}>
                            {/* <div className={`col-6 text-center ct-daily-change-value-${it.data.bidVolumeChangeDirection}`}>{it.data.bid || 0}</div> */}
                            <div className="col-6 text-right">{FormatUtils.formatThousandSeparator(it.data.bid, 3) || 0}</div>
                            <div className="col-6 text-right border-right">{FormatUtils.formatThousandSeparator(it.data.bidVolume, 0) || 0}</div>
                        </div>
                    </div>
                    <div className="col-6 text-center ">
                        <div className={`row ${es_mia_sell}`}>
                            {/* <div className={`col-6 text-center ct-daily-change-value-${it.data.askVolumeChangeDirection}`}>{it.data.ask || 0}</div> */}
                            <div className="col-6 text-right border-left">{FormatUtils.formatThousandSeparator(it.data.ask, 3) || 0}</div>
                            <div className="col-6 text-right ">{FormatUtils.formatThousandSeparator(it.data.askVolume, 0) || 0}</div>
                        </div>
                    </div>
                </div>

            )

        });
        return (
            <div className="card card-depth" ref={container} >
                <span className="position-absolute clickable close-icon" data-effect="fadeOut" style={{ right: "10px", top: "2px" }} onClick={() => setItem({ name: "test" })}><i className="fa fa-times"></i></span>
                <div className="card-header text-center">
                    <div className="depth-producto">
                        ({item.symbolGroup.name}) {item.name}- {item.plazo}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 text-center border">Offers</div>
                    </div>
                    <div className="row">
                        <div className="col-6 text-center border">
                            <div className="row">
                                <div className="col-12  text-center">BUY</div>
                            </div>

                            <div className="row">
                                <div className="col-6 text-center">Price</div>
                                <div className="col-6 text-center">Volume</div>
                            </div>
                        </div>

                        <div className="col-6 text-center border">
                            <div className="row">
                                <div className="col-12  text-center">SELL</div>
                            </div>

                            <div className="row">
                                <div className="col-6 text-center">Price</div>
                                <div className="col-6 text-center">Volume</div>
                            </div>
                        </div>
                    </div>
                    {items}

                </div>
                <div className="card-footer"></div>
            </div>
        )
    }

}

export default DepthItem;
