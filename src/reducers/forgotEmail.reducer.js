
export function forgotEmail(state={},action){
    switch(action.type){
        case 'email':
            return {forgotEmail:action.email};
        case 'clear':
            return {};
        default:
            return state;
    }
}