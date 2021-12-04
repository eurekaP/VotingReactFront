export const adminActions={
    isAdmin
}
function isAdmin(val){
    if(val){
        localStorage.setItem('isAdmin','true');
        return {type:'admin', val};
    } else{
        localStorage.setItem('isAdmin','false');
        return {type:'admin', val};
    }
}