
import Types from './Types';

export default (state, action) => {
    switch (action.type) {
        case Types.Link:
            return {
                ...state,
                depthLink: action.depthLink
            }
        case Types.A:
            return {
                ...state,
                depthA: action.depthA
            }
        case Types.B:
            return {
                ...state,
                depthB: action.depthB
            }
        case Types.C:
            return {
                ...state,
                depthC: action.depthC
            }
        default:
            return state;
    }


}