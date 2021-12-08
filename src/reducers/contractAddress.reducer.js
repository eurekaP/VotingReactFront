const rinkeby = '0x45E306046fb5eCC8a86447B270c089A6EdF1f2AB';
// const rinkeby = '0x09E521061D9dC7402c902C9B927C82D07fB0E00E';   // My address 
// const ropsten=  '0xEaeA5493054Afe857cC4B6305562b1A4a284F36A';
const ropsten = '0xa9BF0FE4AFEED786C7616Af13A4E70be501C0CA3';
const ganache = '0x14305CD19203Ce8472911746Ea9EBfFDEa9A0073';

export function electionContractAddress(state=ropsten, action){
    switch(action.type){
        default:
            return state;
    }
    
}
