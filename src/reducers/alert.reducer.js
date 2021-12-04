import {alertType} from '../actions/types';

export function alert(state={}, action){
    switch(action.type){
        case alertType.SUCCESS:
            return {
                type:'success',
                message:action.message
            };
        case alertType.ERROR:
            return {
                type:'error',
                message:action.message
            };
        case alertType.CLEAR:
            return {};
        default:
            return state;
    }
}