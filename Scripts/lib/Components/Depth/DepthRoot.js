import React from 'react';
import ReactDOM from 'react-dom';
import DepthPanel from './DepthPanel';


function DepthRoot()
{

};

DepthRoot.prototype.Init = function (selector){
    ReactDOM.render(<DepthPanel />, document.querySelector(selector));
};  


export default DepthRoot;