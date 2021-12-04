import {combineReducers} from 'redux';
import {alert} from './alert.reducer.js';
import {authentication} from './authentication.reducer';
import {registeration} from './registeration.reducer';
import { electionContractAddress } from './contractAddress.reducer.js';
import {adminInfo} from './admin.reducer';
import {forgotEmail} from './forgotEmail.reducer';
import {pageInfo} from './pageInfo.reducer';
import {selectionInfo} from './selection.reducer';

const rootRudecer= combineReducers({
    alert,
    authentication,
    registeration,
    electionContractAddress,
    adminInfo,
    forgotEmail,
    pageInfo,
    selectionInfo
})
export default rootRudecer;