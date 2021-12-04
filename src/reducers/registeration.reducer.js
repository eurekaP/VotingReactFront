import {userType} from '../actions/types';

export function registeration(state={}, action){
    switch(action.type){
        case userType.REGISTER_REQUEST:
            return {
                registering:true
            };
        case userType.REGISTER_SUCCESS:
            return {
                registered:true
            };
        case userType.REGISTER_FAILURE:
            return {};
        case userType.LOGOUT:
            return {};
        default:
            return state;
    }
}