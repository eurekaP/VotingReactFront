let valStr = localStorage.getItem('isAdmin');
const initialState = (valStr==='true' ) ? {isAdmin:true}:{isAdmin:false};

export function adminInfo (state=initialState, action){
    switch(action.type){
        case 'admin':
            return {
                isAdmin:action.val
            };
        default:
            return state;
    }
     
}