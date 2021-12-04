
export function pageInfo(state="", action){
    switch(action.type){
        case 'pageName':
            return{
                pageName:action.name
            };
        default:
            return state;
    }
}