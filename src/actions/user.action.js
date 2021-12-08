import http from '../http.comon.js';
import {userType} from './types';
import {alertActions} from './alert.action';

export const userActions={
    login,
    register,
    logout,
    getAll,
    delte:_delete
}
function login(userData){
    return dispatch=>{
        dispatch(request(userData));
        http.post('/auth/login', userData)
            .then(res=>{
                localStorage.setItem('user',JSON.stringify(res.data));
                dispatch(success(res.data));
            },
            error=>{
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.response.data));
            }
        );
    };
    function request(user){ return {type:userType.LOGIN_REQUEST,user}}
    function success(user){return {type:userType.LOGIN_SUCCESS, user}}
    function failure(error){return {type:userType.LOGIN_FAILURE,error}}
}

function logout(){
    localStorage.removeItem('user');
    return {type:userType.LOGOUT};
}

function register(userData){
    return dispatch=>{
        dispatch(request());
        
        http.post('/auth/user-add',userData)
            .then(user=>{
                dispatch(success());
                dispatch(alertActions.success('Registration successful!'));
            },
            error=>{
                console.log(error.response);
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.response.data));
                
            });
    };
    function request(){ return {type:userType.REGISTER_REQUEST}}
    function success(){return {type:userType.REGISTER_SUCCESS}};
    function failure(){return {type:userType.REGISTER_FAILURE}};
}

function getAll(){
    return dispatch=>{
        let users;
        http.post('/auth/user-data')
            .then(response=>{
                users = response.data;
                localStorage.setItem('users',JSON.stringify(response.data));
                dispatch(success(users));
            },
            error=>{
                dispatch(failure(error.toString()));
            }
            );
    };
    function success(users){return {type:userType.GET_ALL_SUCCESS, users}}
    function failure(error){return {type:userType.GET_ALL_FAILURE, error}}
}

function _delete(id){
    return dispatch=>{
        dispatch(success(id));
    };
    function success(id){ return {type:userType.DELETE_SUCCESS,id}}
    function failure(id, error){ return {type:userType.DELETE_FAILURE,id, error}}
}
function registerCandidateList(candidateList){
    return dispatch=>{
        
    }
}
