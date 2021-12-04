export const pageActions={
    setPageName
}
function setPageName(name){
    return{type:'pageName', name};
}