export const forgotEmailActions={
    setForgotEmail,
    clear
}
function setForgotEmail(email){
    return {type:'email', email}
}
function clear(){
    return {type:'clear'};
}