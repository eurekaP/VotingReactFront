import {userType} from '../actions/types';
let voters=JSON.parse(localStorage.getItem('users'));
const initialState=voters?{voters}:{};

export function voter(state=initialState, action){
    switch(action.type){
        case userType.GET_ALL_SUCCESS:
            return {
                voters:action.users
            };
        default:
            return state;
    }
}