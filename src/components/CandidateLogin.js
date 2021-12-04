import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userActions } from "../actions/user.action";
import { alertActions } from "../actions/alert.action";
import { adminActions, adminInfo } from '../actions/admin.action';
import { makeStyles } from "@material-ui/core";
import {pageActions} from '../actions/pageInfo.action';
import Particles from './Particles'

import {
    Grid,
    CssBaseline,
    Button,
    Typography,
    Divider,
    Paper,
    Snackbar

} from '@material-ui/core'
import {contractAbi} from '../app/contractAbi';
import MuiAlert from '@material-ui/lab/Alert';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import getWeb3 from "../getWeb3";

const Alert=React.forwardRef(function Alert(props, ref){
    return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  });
const useStyles=makeStyles((theme)=>({
    root:{
        flexGrow:1,
        // backgroundColor:"#071722",
        backgroundImage: `url('./image/background.jpg')`,
        height:'100vh',
    },
    paper: {
      margin:'5%',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      elevation:3,
      width:"100%",
      maxHeight:'40%',
      
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      padding:theme.spacing(0,0,8,0),
    },
    panel:{
        // margin:theme.spacing(2,4,2,4),
    },
    button:{
        backgroundColor:"#00aa00",
        color:"#fff",
        '&:hover': {
            backgroundColor: '#007700',
        },
        margin:theme.spacing(1,0,1,0),
        width:"98%",
    },
    textField:{
        margin:theme.spacing(1,0,1,0),
    }

}));
export default function CandidateLogin(){
    
    const classes=useStyles();
    const history =  useHistory();

    const isAdmin = useSelector(state=>state.adminInfo.isAdmin);

    const electionContractAddress=useSelector(state=>state.electionContractAddress);
    const [electionContract, setElectionContract] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');

    const alertContent = useSelector(state=>state.alert);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
  
    const checkMetaMask = async() =>{
        try{
            const web3 =await getWeb3();
           
            await web3.eth.requestAccounts();
            
            const accounts = await web3.eth.getAccounts();
           
            if(accounts.length>0){
               
                setCurrentAccount(accounts[0]);
            }
            const contract = new web3.eth.Contract(contractAbi,electionContractAddress);
            
            setElectionContract(contract);
            
        } catch(error){
            dispatch(alertActions.error("Can't found MetaMask. Please install MetaMask or unlock Metask."));
            setOpen(true);
        }
        
    }
    useEffect(()=>{
        if(window.ethereum){
            window.ethereum.on('chainChanged',()=>{
                dispatch(adminActions.isAdmin(false));
                history.push('/');

            })
            window.ethereum.on('accountsChanged',()=>{
                dispatch(adminActions.isAdmin(false));
                history.push('/');
            })

        }
        dispatch(alertActions.clear());
        dispatch(pageActions.setPageName('adminLogin'));
        checkMetaMask();
    },[]);

    const handleClose=(event,reason)=>{
        if(reason==="clickaway"){
          return;
        }
        setOpen(false);
      }
    const handleSubmit = ()=>{
        try{
            
             if(currentAccount){
                    dispatch(adminActions.isAdmin(false));
                    localStorage.setItem('isAdmin', "false");
                    history.push('/elections');
             } else{
                dispatch(alertActions.error('Please install MetaMask.'))
                setOpen(true);
             }
            
        } catch (err){
            dispatch(alertActions.error("Some errors occurred while connecting your wallet1."));
            setOpen(true);
        }
        
    }

    return(
        <>
            {
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alertContent.type} sx={{width:'100%'}}>
                    {alertContent.message}
                    </Alert>
                </Snackbar>
            }
            <Grid component="main" className={classes.root} container justifyContent="center" alignItems="center">
                <Particles/>
               
                <Grid container justifyContent="center" item xs={12} sm={8} md={6}>
                    <Paper className={classes.paper} marginLeft={{xs:1, sm:2}} 
                       elevation={24}>
                        <CssBaseline/>
                        <Grid container>
                            <Typography variant="h5" style={{marginLeft:"8vw", paddingTop:"2vw", paddingBottom:"2vh"}}>
                                Authentication of Candidate
                            </Typography>
                        </Grid>
                        <Divider style={{width:"100%"}}/>
                        <Grid container justifyContent="center" item md={12} style={{width:"60%", paddingTop:"20px"}}>
                            <form className={classes.form}>
                                
                                <Grid container>
                                    <Grid container item md={12} justifyContent="center"> 
                                        <Button 
                                            className={classes.button}  
                                            startIcon={<SettingsInputAntennaIcon />}
                                            onClick={handleSubmit}>
                                            Connect Your Wallet     
                                        </Button>
                                    </Grid>
                                    
                                </Grid>
                               
                            </form>
                        </Grid>
                        
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}