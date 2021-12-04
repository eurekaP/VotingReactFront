const item = JSON.parse(localStorage.getItem('selectedItem'));
const initialState = item ? {selectedId:item.selectedId, selectedName:item.selectedName} : {};
export function selectionInfo(state=initialState,action){
    switch(action.type){
        case "selected":
            return {
                selectedId:action.item.selectedId,
                selectedName:action.item.selectedName
            };
        case 'clear':
            return{
               
            };
        default:
            return state;
    }
}