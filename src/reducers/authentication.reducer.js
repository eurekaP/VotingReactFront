import {userType} from '../actions/types';
let user=JSON.parse(localStorage.getItem('user'));
const initialState=user?{loggedIn:true,user}:{};

export function authentication(state=initialState, action){
    switch(action.type){
        case userType.LOGIN_REQUEST:
            return{
                loggingIn:true,
                user:action.user
            };
        case userType.LOGIN_SUCCESS:
            return {
                loggedIn:true,
                user:action.user
            };
        case userType.LOGIN_FAILURE:
            return {};
        case userType.LOGOUT:
            return {};
        default:
            return state;
    }
}