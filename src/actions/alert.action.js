import {alertType} from './types';

export const alertActions={
    success,
    error,
    clear
}

function success(message){
    return {type:alertType.SUCCESS,message};
}
function error(message){
    return {type:alertType.ERROR,message};
}
function clear(){
    return {type:alertType.CLEAR};
}