
export const selectionActions={
    setSelectedItem,
    clear
}
function setSelectedItem(item){
    localStorage.setItem('selectedItem', JSON.stringify(item));
    return {type:'selected', item};
}
function clear(){
    localStorage.removeItem('selectedItem');
    return {type:'cancelSeleted'};
}