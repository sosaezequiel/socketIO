import DepthRoot from './Depth/DepthRoot';


//window.DepthRoot = new DepthRoot();



$.extend(true, window, {
    MAE: {
        DepthRoot: new DepthRoot()
    }
});




